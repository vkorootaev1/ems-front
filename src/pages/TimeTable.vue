<template>
    <div class="container">
        <div class="row justify-content-center pt-2">
            <div class="by_teacher" v-if="by_teacher">
                <h5>Расписание ({{ reductionFIO(by_teacher.user) }})</h5>
            </div>
            <pagination :current_item="week" :last_item="count_of_weeks" @changeItem="changeWeek"
                v-if="week && count_of_weeks"></pagination>
            <div class="col-md-8 col-12">
                <div class="day_pairs" v-for="item in timetable" :key="item">
                    <h4>{{ dateFormatTimeTable(item.date) }}</h4>
                    <div v-if="item.pairs">
                        <div class="huge-card mb-2 d-flex" v-for="pair in item.pairs" :key="pair">
                            <div class="pair-time">
                                {{ pair.index_pair }} пара
                                <div>
                                    {{ START_PAIRS[pair.index_pair] }}
                                </div>
                                <div
                                    v-if="$userStore.user && $userStore.isTeacher() && pair.course && compareWithNowTimeTable(item.date, pair.index_pair)">
                                    <font-awesome-icon icon="table" class="font-awesome-icon"
                                        @click="router.push({ name: 'teacher_attendance_update', params: { pair_id: pair.id } })" />
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
                                    v-if="$userStore.user && $userStore.isTeacher() || route.name === 'teacher_timetable_info'">
                                    <i class="bi bi-info-circle modal-info-icon"></i>
                                    <div class="modal-info-body" style="right:20px">
                                        <div v-for=" group in pair.groups" :key="group">
                                            {{ group }}</div>
                                    </div>
                                </div>
                                <div class="pair-teacher"
                                    v-if="$userStore.user && $userStore.isStudent() && route.name !== 'teacher_timetable_info'">
                                    <span
                                        @click="router.push({ name: 'teacher_info', params: { teacher_id: pair.teacher.id } })">{{
                                            reductionFIO(pair.teacher.user) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <p>Пар нет!</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getTimeTableAPI, getTeacherAPI } from '@/api/study'
import { useRoute, useRouter } from 'vue-router'
import { formatTimeTable, reduceTypeOfPair } from '@/services/study_services'
import { reductionFIO } from '@/services/user_services'
import { getCurrentWeek, getCurrentYear, getCountOfWeeksInYear, compareWithNowTimeTable, dateFormatTimeTable } from '@/services/datetime_services'
import { START_PAIRS } from '@/constants'
import { ref, inject, onMounted } from 'vue';
import Pagination from '@/components/Pagination.vue';

const $userStore = inject('$userStore')
const $notificationStore = inject('$notificationStore')

const router = useRouter()
const route = useRoute()

const error_message_timetable = 'Не удалось загрузить расписание'
const error_message_teacher = 'Не удалось загрузить преподавателя'

let year;
let count_of_weeks;
let week;
let teacher_id = null;

let by_teacher = ref(null);
let timetable = ref([])

onMounted(() => {
    teacher_id = route.params.teacher_id;
    week = !isNaN(route.query.week) ? route.query.week : getCurrentWeek()
    year = !isNaN(route.query.year) ? route.query.year : getCurrentYear()
    route.name === 'teacher_timetable_info' ? getTeacher() : null
    count_of_weeks = getCountOfWeeksInYear(year)
    week = week > count_of_weeks ? count_of_weeks : week
    week = week < 1 ? 1 : week
    router.replace({ name: route.name, query: { ...route.query, year: year, week: week } })
    getTimeTable()
})

const getTimeTable = async () => {
    try {
        const response = await getTimeTableAPI(getTimeTableParams())
        timetable.value = formatTimeTable(response.data.results, week, year)
    }
    catch {
        $notificationStore.addError(error_message_timetable)
    }
}

const getTeacher = async () => {
    try {
        const params = {}
        const response = await getTeacherAPI(params, teacher_id)
        by_teacher.value = response.data
    }
    catch {
        $notificationStore.addError(error_message_teacher)
    }
}

const changeWeek = (value) => {
    week = value
    router.replace({ name: route.name, query: { ...route.query, year: year, week: week } })
    getTimeTable()
}

const getTimeTableParams = () => {
    let params = { week: week, year: year }
    if (teacher_id) {
        params.teacher_id = teacher_id
    }
    return params
}
</script>

<style lang="scss" scoped>
.pair-teacher {
    font-style: oblique;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
        color: $main-color-hover;
    }
}

.by_teacher {
    margin: 5px auto;
    text-align: center
}

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