<template>
    <div class="container">
        <div class="row justify-content-center pt-4">
            <div class="col col-lg-8 col-md-10 col-12">
                <switcher-score></switcher-score>
                <div class="row my-2">
                    <div class="col-12 col-md-10">
                        <pagination v-if="last_trimester" :current_item="trimester" :last_item="last_trimester"
                            @changeItem="changeTrimester"></pagination>
                    </div>
                </div>
                <div v-if="!scores.length" class="my-2 huge-card" style="text-align: center;">
                    <h5>Промежуточных оценок не найдено</h5>
                </div>
                <div class="row mb-4" v-for="item in scores" :key="item">
                    <h4>{{ item.course.name }}</h4>
                    <div class="col-12 col-md-10">
                        <div class="huge-card mb-2" v-for="item in item.scores" :key="item">
                            <h5>{{ item.control_measure.name }}</h5>
                            <div class="score-info">Проходной балл: <span>{{ item.control_measure.min_score }}</span></div>
                            <div class="score-info">Максимальный балл: <span>{{ item.control_measure.max_score }}</span>
                            </div>
                            <div class="score-info">Ваш балл: <span v-if="item.score" class="student-score"
                                    :class="{ 'score-false': item.score < item.control_measure.min_score }">{{ item.score
                                    }}</span>
                                <div class="modal-info-wrap" style="display:inline-block; margin-left: 5px;"
                                    v-if="item.score">
                                    <i class="bi bi-info-circle modal-info-icon"></i>
                                    <div class="modal-info-body" style="left:-50px;">
                                        <div>
                                            {{ reductionFIO(item.teacher.user) }}
                                        </div>
                                        <div>
                                            {{ dateTimeFormat(item.date_upd) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col col-md-2 d-flex d-none d-md-flex align-items-center justify-content-center"
                        style="min-height: 100%">
                        <div class="sum-score-desktop">
                            {{ sumScores(item.scores) }}
                        </div>
                    </div>
                    <div class="col-12 d-md-none">
                        <div class="sum-score-mobile">
                            Всего: {{ sumScores(item.scores) }} баллов
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { getControlMeasureScoreAPI, getStudentCurrentTrimesterAPI } from '@/api/study'
import { ref, onMounted, inject } from 'vue';
import { formatControlMeasureScore } from '@/services/study_services'
import { dateTimeFormat } from '@/services/datetime_services'
import { reductionFIO } from '@/services/user_services';
import SwitcherScore from '@/components/SwitcherScore.vue'
import Pagination from '@/components/Pagination.vue';

const $notificationStore = inject('$notificationStore')

const router = useRouter()
const route = useRoute()

const error_message_control_measure_scores = 'Не удалось загрузить промежуточные оценки'
const error_message_current_trimester = 'Не удалось загрузить текущий триместр'

let last_trimester = null;

let trimester = ref(null)
let scores = ref([])

onMounted(async () => {
    await getStudentCurrentTrimester();
    trimester.value = (!isNaN(route.query.number) && route.query.number <= trimester.value) ? route.query.number : trimester.value
    router.replace({ name: route.name, query: { ...route.query, number: trimester.value } })
    await getControlMeasureScore();
})

const getControlMeasureScore = async () => {
    try {
        const params = getControlMeasureScoreParams()
        const response = await getControlMeasureScoreAPI(params)
        scores.value = formatControlMeasureScore(response.data)
        router.replace({ name: route.name, query: { ...route.query, number: trimester.value } })
    }
    catch {
        $notificationStore.addError(error_message_control_measure_scores)
    }
}

const getStudentCurrentTrimester = async () => {
    try {
        const response = await getStudentCurrentTrimesterAPI()
        trimester.value = response.data.current_student_trimester
        last_trimester = response.data.current_student_trimester
    }
    catch {
        $notificationStore.addError(error_message_current_trimester)
    }
}

const changeTrimester = (value) => {
    trimester.value = value
    getControlMeasureScore()
}

const sumScores = (scores) => {
    let result = 0
    scores.forEach((elem) => {
        result += elem.score
    })
    return result
}

const getControlMeasureScoreParams = () => {
    let params = { trimester: trimester.value }
    return params
}
</script>

<style lang="scss" scoped>
.score-info {
    & span {
        font-weight: 700;
    }
}

.sum-score-desktop {
    width: 5.5rem;
    height: 5rem;
    border-radius: 30% 5%;
    background-color: $main-color;
    color: white;
    font-weight: 700;
    font-size: 2rem;
    text-align: center;
    line-height: 5rem;
}

.sum-score-mobile {
    padding: 10px;
    background-color: $main-color;
    color: white;
    font-weight: 700;
    border-radius: 10px;
}

@media (max-width: 767px) {
    .sum-score-desktop {
        display: none;
    }
}
</style>