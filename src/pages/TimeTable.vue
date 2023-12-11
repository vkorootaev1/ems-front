<template>
    <div class="container">
        <div class="row justify-content-center pt-2">
            <pagination :current_item="week" :last_item="count_of_weeks" @changeItem="changeWeek"
                v-if="week && count_of_weeks"></pagination>
            <div class="col-lg-6 col-md-8 col-12">
                <div class="day_pairs" v-for="item in timetable" :key="item">
                    <h4>{{ item.date }}</h4>
                    <div v-if="item.pairs">
                        <div class="huge-card mb-2 d-flex" v-for="pair in item.pairs" :key="pair">
                            <div class="pair-time">
                                {{ pair.index_pair }} пара
                                <div>
                                    {{ START_PAIRS[pair.index_pair] }}
                                </div>
                                <div v-if="$store.user && $store.getUserRole() === 'teacher' && pair.course">
                                    <font-awesome-icon icon="table" class="font-awesome-icon" />
                                    <font-awesome-icon icon="check" style="color:#008080; margin-left: 3px;"
                                        v-if="pair.is_attendance" />
                                </div>
                            </div>
                            <div class="pair-info w-100" v-if="pair.course">
                                <div class="pair-course">
                                    {{ pair.course }} ({{ reduceTypeOfPair(pair.type_of_pair) }})
                                </div>
                                <div class="pair-classroom">
                                    ауд. {{ pair.classroom.number }} ({{ pair.classroom.house }} корпус, {{
                                        pair.classroom.floor }} этаж)
                                </div>
                                <div class="modal-info-wrap pair-groups-wrap"
                                    v-if="$store.user && $store.getUserRole() === 'teacher'">
                                    <i class="bi bi-info-circle modal-info-icon"></i>
                                    <div class="modal-info-body" style="right:20px">
                                        <div v-for=" group in pair.groups" :key="group">
                                            {{ group }}</div>
                                    </div>
                                </div>
                                <div class="pair-teacher" v-if="$store.user && $store.getUserRole() === 'student'">
                                    {{ reductionFIO(pair.teacher.user) }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <p>Пар нет!</p>
                    </div>
                </div>
                <div v-if="errors.length" class="errors">
                    <div class="error" v-for="error in errors" :key="error">
                        * {{ error }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getTimeTableAPI } from '@/api/study'
import { formatTimeTable, reduceTypeOfPair } from '@/services/study_services'
import { reductionFIO } from '@/services/user_services'
import { getCurrentWeek, getCurrentYear, dateFormatTimeTable, getCountOfWeeksInYear } from '@/services/datetime_services'
import { START_PAIRS } from '@/constants'
import { ref, inject, onMounted } from 'vue';
import Pagination from '@/components/Pagination.vue';

const $store = inject('$userStore')

const error_message_timetable = 'Не удалось загрузить расписание'

let year;
let count_of_weeks;
let week;

let timetable = ref([])
let errors = ref([])

onMounted(() => {
    year = getCurrentYear()
    week = getCurrentWeek()
    count_of_weeks = getCountOfWeeksInYear()
    getTimeTable()
})

const getTimeTable = async () => {
    try {
        const response = await getTimeTableAPI(week, year)
        timetable.value = formatTimeTable(response.data, week, year)
    }
    catch {
        errors.value.push(error_message_timetable)
    }
}

const changeWeek = (value) => {
    week = value
    getTimeTable()
}

</script>

<style lang="scss" scoped>
.pair-groups-wrap,
.pair-teacher {
    text-align: right;
    float: right;
    margin-top: 5px;
}

.pair-time {
    margin-right: 10px;
    white-space: nowrap;
}

.day_pairs {
    margin-top: 15px;
    margin-bottom: 25px;
}

.pair-course {
    font-size: 1.1rem;
}

.attendance-icon,
.pair-info-icon {
    -webkit-text-stroke: 0.5px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
        color: $main-color;

        &:not(.attendance-icon)+.pair-groups {
            height: auto;
            opacity: 1;
        }
    }
}

.pair-groups-wrap {
    position: relative;
}

.pair-groups {
    right: 0;
    padding: 10px;
    width: 150px;
    text-align: center;
    height: 0;
    overflow: hidden;
    position: absolute;
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    z-index: 1;
    transition: opacity 0.1s;
    opacity: 0;
}
</style>