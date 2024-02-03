<template>
    <div class="container">
        <div class="row justify-content-center pt-4">
            <div class="col-xl-10 col-12">
                <switcher-score></switcher-score>
                <div v-if="!scores.length" class="my-2 huge-card" style="text-align: center;">
                    <h5>Итоговых оценок не найдено</h5>
                </div>
                <div class="row mb-4 mx-0" v-for="item in scores" :key="item">
                    <h4>{{ item.trimester }} триместр</h4>
                    <div class="result-scores huge-card mb-2" v-for="item in item.scores" :key="item">
                        <div class="row">
                            <div class="col-8 col-lg-5 score-info">
                                {{ item.course.course.name }}
                            </div>
                            <div class="col-4 col-lg-2 justify-content-center score-info">
                                <span class="student-score"
                                    :class="{ 'score-false': ['Незачет', '2'].includes(item.score) }">{{ item.score
                                    }}</span>
                                <div class="modal-info-wrap d-lg-none" style="display:inline-block; margin-left: 5px;">
                                    <i class="bi bi-info-circle modal-info-icon"></i>
                                    <div class="modal-info-body" style="right:20 px">
                                        <div>
                                            {{ reductionFIO(item.teacher.user) }}
                                        </div>
                                        <div>
                                            {{ dateTimeFormat(item.upd) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="score-info col col-lg-3 d-none d-md-flex">
                                {{ reductionFIO(item.teacher.user) }}
                            </div>
                            <div class="score-info col col-lg-2 d-none d-md-flex">
                                {{ dateFormat(item.date_upd) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getResultScoreAPI } from '@/api/study'
import { ref, onMounted, inject } from 'vue';
import { formatResultScore } from '@/services/study_services'
import { dateTimeFormat, dateFormat } from '@/services/datetime_services'
import { reductionFIO } from '@/services/user_services';
import SwitcherScore from '@/components/SwitcherScore.vue'

const $notificationStore = inject('$notificationStore')

const error_message_result_scores = 'Не удалось загрузить итоговые оценки'

let scores = ref([])

onMounted(() => {
    getResultScore()
})

const getResultScore = async () => {
    try {
        const response = await getResultScoreAPI(null, null)
        scores.value = formatResultScore(response.data)
    }
    catch {
        $notificationStore.addError(error_message_result_scores)
    }
}

</script>

<style lang="scss" scoped>
.score-info {
    display: flex;
    align-items: center;
}
</style>