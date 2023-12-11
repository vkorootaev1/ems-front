<template>
    <div class="container">
        <div class="row justify-content-center" style="max-width: 1000px;">
            <div class="col col-lg-10 col-md-10 order-md-2">
                <div class="row align-items-end mb-2">
                    <div class="col-lg-6 col-12 order-lg-2 order-lg-2 my-2">
                        <v-select class="mt-4" label="Триместр" v-model="selected_trimester" :items="trimesters"
                            variant="outlined" rounded="lg" return-object item-value="id"
                            @update:modelValue="getStudyGroupsCoursesByTrimester()" hide-details="true">
                            <template v-slot:item="{ item: { raw }, props: { onClick } }">
                                <v-list-item :class="{ 'v-list-item--active': selected_trimester.id === raw.id }"
                                    @click="onClick">{{ formatTrimester(raw) }} <span v-if="raw.current">&nbsp;
                                        <b>[текущий]</b>
                                    </span></v-list-item>
                            </template>
                            <template v-slot:selection="{ item: { raw } }">
                                <span> {{ formatTrimester(raw) }} </span><span v-if="raw.current">&nbsp;
                                    <b>[текущий]</b>
                                </span>
                            </template>
                        </v-select>
                    </div>
                    <div class="col-lg-6 col-12 order-lg-1 my-2">
                        <v-text-field label="Курс и/или группа" v-model="search_field_groups_courses" rounded="lg"
                            variant="outlined" hide-details="true" type="text"
                            v-debounce:400="getStudyGroupsCoursesByGroupCourseName"></v-text-field>
                    </div>
                </div>
                <h4>Преподаваемые курсы</h4>
                <div class="courses-groups mb-5">
                    <div v-if="groups_courses.length">
                        <div class="course-group my-2" @click="getScores(item)" v-for="item in groups_courses" :key="item"
                            :class="{ 'active-course-group': item.study_plan_course === selected_studyplan_course && item.study_group === selected_study_group }">
                            <h6>{{ item.study_plan_course.course.name }} ({{ item.study_group.name }})</h6>
                        </div>
                    </div>
                    <div v-else class="course-group my-2 error">
                        <h5>Курсы не найдены</h5>
                    </div>
                </div>
                <div v-if="selected_studyplan_course && selected_study_group">
                    <h4>«{{ selected_studyplan_course.course.name }}» ({{
                        selected_study_group.name
                    }}) [{{ selected_studyplan_course.course.type_of_mark }}]</h4>
                    <div v-if="messages.length" class="messages my-3">
                        <div class="message" v-for="message in messages" :key="message">
                            <h4>{{ message }}</h4>
                        </div>
                    </div>
                    <div v-if="errors.length" class="errors my-3">
                        <div class="error" v-for="error in errors" :key="error">
                            <h4>* {{ error }}</h4>
                        </div>
                    </div>
                    <v-select class="mt-4" label="Контрольное мероприятие" v-model="selected_control_measure"
                        :items="control_measures" variant="outlined" rounded="lg" item-title="name" item-value="id"
                        return-object @update:modelValue="clearMessagesErrors()" hide-details="true"
                        no-data-text="Контрольных мероприятий не предусмотрено"></v-select>
                    <div v-if="selected_control_measure">
                        <div class="score-upd-btn text-center">
                            <input type="submit" @click="updateScore"
                                :value="selected_control_measure.id !== 0 ? 'Сохранить' : 'Выставить итоговые оценки'"
                                class="form__btn w-100">
                        </div>
                        <div v-if="selected_control_measure">
                            <div v-if="selected_control_measure.id !== 0">
                                <div class="control-measure-info">
                                    <h5>Проходной балл: <span>{{ selected_control_measure.min_score
                                    }}</span></h5>
                                    <h5>Максимальный балл: <span>{{ selected_control_measure.max_score
                                    }}</span></h5>
                                </div>
                                <div class="student mx-2" v-for="student in control_measure_scores" :key="student">
                                    <div class="score" v-for="score in student.scores" :key="score">
                                        <div v-if="score.control_measure.id === selected_control_measure.id">
                                            <div class="row align-middle my-5 align-items-center">
                                                <div class="col-7 student-fio">
                                                    <span>{{ reductionFIO(student.student.user) }}</span>
                                                </div>
                                                <div class="col-5 teacher-score">
                                                    <v-text-field label="Оценка" v-model="score.score" rounded="xl"
                                                        variant="outlined" hide-details="true" @input="scoreHandler(score)"
                                                        type="number"></v-text-field>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else>
                                <div class="student mx-2">
                                    <div class="row align-middle my-5">
                                        <div class="col-7">
                                            <div class="student-score-fio">
                                                <span style="font-weight: 700;">Студент</span>
                                            </div>
                                        </div>
                                        <div class="col-5">
                                            <div class="student-score-fio">
                                                <span style="font-weight: 700;">Сумма баллов</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="score" v-for="item in result_scores" :key="item">
                                        <div class="row align-middle my-5">
                                            <div class="col-7">
                                                <div class="student-score-fio">
                                                    <span>{{ reductionFIO(item.student.user) }}</span>
                                                </div>
                                            </div>
                                            <div class="col-5">
                                                <div class="student-score-fio">
                                                    <span class="student-score">{{ sumControlMeasureScores(item.student.id)
                                                    }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getStudyGroupsCoursesAPI, getTrimesterAPI, getControlMeasureScoreAPI, multipleUpdateControlMeasureScoreAPI, getResultScoreAPI, multipleUpdateResultScoreAPI } from '@/api/study'
import { ref, onMounted } from 'vue';
import { formatScoreTeacher } from '@/services/study_services'
import { reductionFIO } from '@/services/user_services';
import { TRIMESTER } from '@/constants'
import { getYear } from '@/services/datetime_services'

const error_message_course_study_group_teacher = 'Не удалось загрузить преподаваемые дисциплины'
const error_message_control_measure_scores = 'Не удалось загрузить промежуточные оценки студентов'
const error_message_result_scores = 'Не удалось загрузить итоговые оценки студентов'
const error_message_update_scores = 'Не удалось сохранить оценки'
const error_message_trimesters = 'Не удалось загрузить триместры'
const succes_message_update_scores = 'Оценки успешно обновлены'

let search_field_groups_courses = ref('')
let selected_trimester = ref({ id: 0, trimester: null, date_start: null, date_end: null })
let trimesters = ref([])
let groups_courses = ref([])
let selected_studyplan_course = ref(null)
let selected_study_group = ref(null)
let control_measure_scores = ref([])
let result_scores = ref([])
let control_measures = ref([])
let selected_control_measure = ref(null)
let errors = ref([])
let messages = ref([])

onMounted(() => {
    getStudyGroupsCoursesByTrimester()
    getTrimesters()
})

const getStudyGroupsCoursesByTrimester = async () => {
    clearScores()
    try {
        const response = await getStudyGroupsCoursesAPI(selected_trimester.value.id)
        groups_courses.value = response.data
    }
    catch {
        errors.value.push(error_message_course_study_group_teacher)
    }
}


const getStudyGroupsCoursesByGroupCourseName = async () => {
    if (search_field_groups_courses.value) {
        clearScores()
        try {
            const response = await getStudyGroupsCoursesAPI(null, search_field_groups_courses.value)
            groups_courses.value = response.data
        }
        catch {
            errors.value.push(error_message_course_study_group_teacher)
        }
    }
    else {
        getStudyGroupsCoursesByTrimester()
    }
}

const getTrimesters = async () => {
    try {
        const response = await getTrimesterAPI()
        trimesters.value = response.data
        trimesters.value[0].current = 'текущий'
        selected_trimester.value = trimesters.value[0]
    }
    catch {
        errors.value.push(error_message_trimesters)
    }
}

const getScores = async (group_course) => {
    clearMessagesErrors()
    selected_studyplan_course.value = group_course.study_plan_course
    selected_study_group.value = group_course.study_group
    await getControlMeasureScore()
    await getResultScore()
}

const getControlMeasureScore = async () => {
    try {
        const response = await getControlMeasureScoreAPI(null, selected_study_group.value.id,
            selected_studyplan_course.value.id)
        control_measure_scores.value = formatScoreTeacher(response.data)
        getControlMeasureList(control_measure_scores.value)
    }
    catch {
        errors.value.push(error_message_control_measure_scores)
    }
}

const getResultScore = async () => {
    try {
        const response = await getResultScoreAPI(selected_study_group.value.id,
            selected_studyplan_course.value.id)
        result_scores.value = response.data
    }
    catch {
        errors.value.push(error_message_result_scores)
    }
}

const multipleUpdateControlMeasureScores = async () => {
    try {
        await multipleUpdateControlMeasureScoreAPI(createListControlMeasureScoresUpdated(),
            selected_study_group.value.id, selected_studyplan_course.value.id)
        messages.value.push(succes_message_update_scores)
    }
    catch {
        errors.value.push(error_message_update_scores)
    }
}

const multipleUpdateResultScores = async () => {
    try {
        await multipleUpdateResultScoreAPI(selected_study_group.value.id, selected_studyplan_course.value.id)
        messages.value.push(succes_message_update_scores)
    }
    catch {
        errors.value.push(error_message_update_scores)
    }
}

const updateScore = () => {
    clearMessagesErrors()
    if (selected_control_measure.value.id === 0) {
        multipleUpdateResultScores()
    }
    else {
        multipleUpdateControlMeasureScores()
    }
}



const sumControlMeasureScores = (student_id) => {
    let sum_control_measures_score = 0
    if (control_measure_scores.value.length) {
        control_measure_scores.value.forEach((item1) => {
            if (item1.student.id === student_id) {
                item1.scores.forEach((item2) => {
                    if (item2.score !== null) {
                        sum_control_measures_score += item2.score
                    }
                })
            }
        })
    }
    return sum_control_measures_score
}

const createListControlMeasureScoresUpdated = () => {
    let list_scores_updated = []
    if (control_measure_scores.value.length) {
        control_measure_scores.value.forEach((item1) => {
            item1.scores.forEach((item2) => {
                if (item2.score && item2.id) {
                    list_scores_updated.push({
                        id: item2.id,
                        score: item2.score
                    })
                }
            })
        })
        return list_scores_updated
    }
}

const clearMessagesErrors = () => {
    errors.value = []
    messages.value = []
}

const clearScores = () => {
    selected_study_group.value = null
    selected_study_group.value = null
    control_measure_scores.value = []
    result_scores.value = []
    control_measures.value = []
}

const getControlMeasureList = (data) => {
    control_measures.value = []
    selected_control_measure.value = null
    if (data.length) {
        data[0].scores.forEach((item) => {
            control_measures.value.push(
                item.control_measure
            )
        })
        control_measures.value.push({ id: 0, name: 'ИТОГОВЫЕ ОЦЕНКИ' })
        selected_control_measure.value = control_measures.value[0]
    }
}

const scoreHandler = (score) => {
    if (score.score > selected_control_measure.value.max_score) {
        score.score = selected_control_measure.value.max_score
    }
    if (score.score < 0) {
        score.score = 0
    }
}

const formatTrimester = (trimester) => {
    return `${TRIMESTER[trimester.trimester]} (${getYear(trimester.date_start)})`
}
</script>

<style lang="scss" scoped>
.student-score-fio,
.student-fio {
    display: flex;
    font-size: 1.2rem;
    padding: 10px;
    border-radius: 20px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    align-items: center;
}

.student-score-fio {
    height: 100%;
    overflow-wrap: break-word;
    overflow: hidden;
    justify-content: center;
}

.control-measure-info {

    & span {
        color: $main-color;
        font-weight: 700;
    }
}

.hello {
    color: red !important
}

.course-group {
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    border-radius: 15px;
    padding: 10px;
}

.course-group {
    transition: 0.3s;
    cursor: pointer;

    &:hover:not(.active-course-group) {
        background-color: $main-color-hover;
        color: white;
    }

    &.active-course-group {
        color: white;
        background-color: $main-color;
    }
}
</style>