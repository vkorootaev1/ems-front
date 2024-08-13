<template>
    <div class="container">
        <div class="row justify-content-center pt-4">
            <div class="col-lg-8 col-md-10 col-12">
                <div v-if="!studyplan.length" class="my-2 huge-card" style="text-align: center;">
                    <h5>Учебного плана не найдено</h5>
                </div>
                <div class="studyplan-trimester-courses mb-4" v-for="item in studyplan" :key="item">
                    <h4>{{ item.trimester }} триместр</h4>
                    <div class="course huge-card my-2" v-for="item in item.courses" :key="item">
                        <h5>{{ item.course.name }}</h5>
                        <div class="course-info">Вид оценки: <span>{{ item.course.type_of_mark }}</span></div>
                        <div class="course-info">Кол-во аудиторных часов: <span>{{ item.course.classroom_worktime }}</span>
                        </div>
                        <div class="course-info">Кол-во самостоятельных часов: <span>{{ item.course.independent_worktime
                        }}</span></div>
                        <div class="course-info">Общее кол-во часов: <span>{{ item.course.classroom_worktime +
                            item.course.independent_worktime }}</span></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getStudyPlanAPI } from '@/api/study'
import { formatStudyPlan } from '@/services/study_services'
import { ref, onMounted, inject } from 'vue';

const $notificationStore = inject('$notificationStore')

const error_message_studyplan = 'Не удалось загрузить учебный план'

let studyplan = ref([])

onMounted(() => {
    getStudyPlan()
})

    // Функция обработки полученной информации об учебном плане студента
    const getStudyPlan = async () => {
        try {
            // Ответ сервера
            const response = await getStudyPlanAPI()
            studyplan.value = formatStudyPlan(response.data)
        }
        catch {
            $notificationStore.addError(error_message_studyplan)
        }
    }

</script>

<style lang="scss" scoped>
.course-info {

    & span {
        font-weight: 600;
    }
}
</style>