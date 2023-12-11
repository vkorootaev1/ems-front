<template>
    <div class="container">
        <div class="row justify-content-center pt-4" style="max-width: 1000px;">
            <div class="col-12">
                <switcher-score></switcher-score>
                <div class="mb-4" v-for="item in scores" :key="item">
                    <h4>{{ item.trimester }} триместр</h4>
                    <div class="result-scores huge-card my-2" v-for="item in item.scores" :key="item">
                        <div class="row">
                            <div class="col-8 col-lg-5 score-info">
                                {{ item.course.course.name }}
                            </div>
                            <div class="col-4 col-lg-2 justify-content-center score-info">
                                <span class="student-score"
                                    :class="{ 'score-false': ['Незачет', '2'].includes(item.score) }">{{ item.score
                                    }}</span>
                                <div class="modal-info-wrap" style="display:inline-block; margin-left: 5px;">
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
                            <div class="score-info col col-lg-3 d-none d-lg-flex">
                                {{ reductionFIO(item.teacher.user) }}
                            </div>
                            <div class="score-info col col-lg-2 d-none d-lg-flex">
                                {{ dateTimeFormat(item.date_upd) }}
                            </div>
                        </div>
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
import { getResultScoreAPI } from '@/api/study'
import { ref, onMounted } from 'vue';
import { formatResultScore } from '@/services/study_services'
import { dateTimeFormat } from '@/services/datetime_services'
import { reductionFIO } from '@/services/user_services';
import SwitcherScore from '@/components/SwitcherScore.vue'

const error_message_result_scores = 'Не удалось загрузить итоговые оценки'

let scores = ref([])
let errors = ref([])

onMounted(async () => {
    await getResultScore()
})

const getResultScore = async () => {
    try {
        const response = await getResultScoreAPI(null, null)
        scores.value = formatResultScore(response.data)
    }
    catch {
        errors.value.push(error_message_result_scores)
    }
}

</script>

<style lang="scss" scoped>
.score-info {
    display: flex;
    align-items: center;
}
</style>