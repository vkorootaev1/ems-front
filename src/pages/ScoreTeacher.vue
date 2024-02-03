<template>
    <div class="container mt-3">
        <div class="row justify-content-center">
            <div class="col-lg-8 col-12">
                <div class="row align-items-end mb-2">
                    <div class="col-xxl-6 col-12 my-2">
                        <v-select label="Триместр" v-model="selected_trimester" :items="trimesters" variant="outlined"
                            rounded="lg" return-object item-value="id" @update:modelValue="getStudyGroupsCoursesByTrimester"
                            hide-details="true">
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
                    <div class="col-xxl-6 col-12 my-2">
                        <v-text-field label="Курс и/или группа" v-model="search_field_groups_courses" rounded="lg"
                            variant="outlined" hide-details="true" type="text"
                            v-debounce:400="getStudyGroupsCoursesByGroupCourseName" clearable
                            @click:clear="getStudyGroupsCoursesByTrimester"></v-text-field>
                    </div>
                </div>
                <h4>Преподаваемые курсы</h4>
                <div class="courses-groups mb-5">
                    <div v-if="groups_courses.length">
                        <div class="course-group my-2" @click="getScores(item)" v-for="item in groups_courses" :key="item"
                            :class="{ 'active-course-group': item.study_plan_course === selected_studyplan_course && item.study_group === selected_study_group }">
                            <h6>{{ item.study_plan_course.course.name }} ({{ item.study_group.name }}) [<strong>{{
                                formatTrimester(item.trimester) }}</strong>]</h6>
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
                    <v-select class="mt-4" label="Контрольное мероприятие" v-model="selected_control_measure"
                        :items="control_measures" variant="outlined" rounded="lg" item-title="name" item-value="id"
                        return-object hide-details="true"
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
                                            <div class="row align-middle mb-2 align-items-center">
                                                <div class="col-7 student-fio">
                                                    <span>{{ reductionFIO(student.user) }}</span>
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
                                    <div class="row align-middle mb-2">
                                        <div class="col-7">
                                            <div class="student-score-fio">
                                                <span style="font-weight: 700;">Студент</span>
                                            </div>
                                        </div>
                                        <div class="col-5">
                                            <div class="student-score-fio">
                                                <span style="font-weight: 700;">Оценка</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="score" v-for="item in result_scores" :key="item">
                                        <div class="row align-middle mb-2">
                                            <div class="col-7">
                                                <div class="student-fio">
                                                    <span>{{ reductionFIO(item.student.user) }}</span>
                                                </div>
                                            </div>
                                            <div class="col-5">
                                                <div class="student-score-fio" v-if="is_discipline">
                                                    <span v-if="item.score !== 'Не выставлено'"
                                                        :class="['Зачет', '5', '4', '3'].includes(item.score) ? 'student-score' : 'score-false'">{{
                                                            item.score
                                                        }}</span>
                                                </div>
                                                <div v-else class="teacher-score">
                                                    <v-select label="Триместр" v-model="item.score"
                                                        :items="is_exam ? choices_exam_result_scores : choices_zachet_result_scores"
                                                        variant="outlined" rounded="lg" hide-details="true">
                                                    </v-select>
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
import { diffArrayOfObjects, deepClone } from '@/services/other_services'
import { getStudyGroupsCoursesAPI, getTrimesterAPI, getControlMeasureScoreAPI, multipleUpdateControlMeasureScoreAPI, getResultScoreAPI, setResultScoreDisciplineAPI, setResultScoreOtherAPI } from '@/api/study'
import { ref, onMounted, inject } from 'vue';
import { formatScoreTeacher, formatTrimester } from '@/services/study_services'
import { reductionFIO } from '@/services/user_services';

const $notificationStore = inject('$notificationStore')

const error_message_course_study_group_teacher = 'Не удалось загрузить преподаваемые дисциплины'
const error_message_control_measure_scores = 'Не удалось загрузить промежуточные оценки студентов'
const error_message_result_scores = 'Не удалось загрузить итоговые оценки студентов'
const error_message_update_scores = 'Не удалось сохранить оценки'
const error_message_trimesters = 'Не удалось загрузить триместры'
const success_message_update_scores = 'Оценки успешно обновлены'

let multiple_update_result_score = []
let multiple_update_control_measure_score = []
let choices_exam_result_scores = [2, 3, 4, 5, 'Не выставлено']
let choices_zachet_result_scores = ['Зачет', 'Незачет', 'Не выставлено']
let is_exam = true
let is_discipline = true

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

onMounted(() => {
    getStudyGroupsCoursesByTrimester()
    getTrimesters()
})

const getStudyGroupsCoursesByTrimester = async () => {
    clearScores()
    try {
        const params = getStudyGroupsCoursesByTrimesterParams()
        const response = await getStudyGroupsCoursesAPI(params)
        groups_courses.value = response.data.results
    }
    catch {
        $notificationStore.addError(error_message_course_study_group_teacher)
    }
}

const getStudyGroupsCoursesByGroupCourseName = async () => {
    if (search_field_groups_courses.value) {
        clearScores()
        try {
            const params = getStudyGroupsCoursesByGroupCourseNameParams()
            const response = await getStudyGroupsCoursesAPI(params)
            groups_courses.value = response.data.results
        }
        catch {
            $notificationStore.addError(error_message_course_study_group_teacher)
        }
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
        $notificationStore.addError(error_message_trimesters)
    }
}

const getScores = async (group_course) => {
    clearScores()
    selected_studyplan_course.value = group_course.study_plan_course
    selected_study_group.value = group_course.study_group
    is_discipline = selected_studyplan_course.value.course.type_of_course === 'Дисциплина' ? true : false
    is_exam = selected_studyplan_course.value.course.type_of_mark === 'Экзамен' ? true : false
    if (is_discipline) {
        await getControlMeasureScore()
    }
    await getResultScore()
}

const getControlMeasureScore = async () => {
    try {
        const params = getScoreParams()
        const response = await getControlMeasureScoreAPI(params)
        control_measure_scores.value = formatScoreTeacher(response.data)
        multiple_update_control_measure_score = deepClone(control_measure_scores.value)
        getControlMeasureList()
    }
    catch {
        $notificationStore.addError(error_message_control_measure_scores)
    }
}

const getResultScore = async () => {
    try {
        const params = getScoreParams()
        const response = await getResultScoreAPI(params)
        result_scores.value = response.data
        multiple_update_result_score = deepClone(result_scores.value)
        if (!is_discipline) {
            getControlMeasureList()
        }
    }
    catch {
        $notificationStore.addError(error_message_result_scores)
    }
}

const multipleUpdateControlMeasureScores = async () => {
    try {
        const data = createListControlMeasureScoresUpdated()
        const params = multipleUpdateControlMeasureScoresParams()
        await multipleUpdateControlMeasureScoreAPI(data, params)
        multiple_update_control_measure_score = deepClone(control_measure_scores.value)
        $notificationStore.addSuccess(success_message_update_scores)
    }
    catch {
        $notificationStore.addError(error_message_update_scores)
    }
}

const setResultScoreDiscipline = async () => {
    try {
        const params = setResultScoreParams()
        const response = await setResultScoreDisciplineAPI(params)
        result_scores.value = response.data
        $notificationStore.addSuccess(success_message_update_scores)
    }
    catch {
        $notificationStore.addError(error_message_update_scores)
    }
}

const setResultScoreOther = async () => {
    try {
        const params = setResultScoreParams()
        const data = createListResultScoresUpdated()
        await setResultScoreOtherAPI(data, params)
        multiple_update_result_score = deepClone(result_scores.value)
        $notificationStore.addSuccess(success_message_update_scores)
    }
    catch {
        $notificationStore.addError(error_message_update_scores)
    }
}

const updateScore = () => {
    if (selected_control_measure.value.id === 0) {
        if (is_discipline) {
            setResultScoreDiscipline()
        }
        else {
            setResultScoreOther()
        }
    }
    else {
        multipleUpdateControlMeasureScores()
    }
}

const createListControlMeasureScoresUpdated = () => {
    const diff = diffArrayOfObjects(control_measure_scores.value, multiple_update_control_measure_score)
    console.log(diff)
    let list_scores_updated = []
    if (diff.length) {
        diff.forEach((item1) => {
            item1.scores.forEach((item2) => {
                if (item2.score && item2.id) {
                    list_scores_updated.push({
                        id: item2.id,
                        score: item2.score
                    })
                }
            })
        })
    }
    return list_scores_updated
}

const createListResultScoresUpdated = () => {
    const diff = diffArrayOfObjects(result_scores.value, multiple_update_result_score)
    let list_scores_updated = []
    diff.forEach((item) => {
        let score = item.score;
        if (score === 'Зачет') {
            score = 'OK'
        }
        else if (score === 'Незачет') {
            score = 'FA'
        }
        else if (score === 'Не выставлено') {
            score = 'NO'
        }
        list_scores_updated.push({
            id: item.id,
            score: score
        })
    })
    return list_scores_updated
}

const clearScores = () => {
    selected_study_group.value = null
    selected_study_group.value = null
    control_measure_scores.value = []
    result_scores.value = []
    control_measures.value = []
}

const getControlMeasureList = () => {
    if (is_discipline) {
        control_measure_scores.value[0].scores.forEach((item) => {
            control_measures.value.push(
                item.control_measure
            )
        })
    }
    control_measures.value.push({ id: 0, name: 'ИТОГОВЫЕ ОЦЕНКИ' })
    selected_control_measure.value = control_measures.value[0]
}

const scoreHandler = (score, min_score = 0, max_score = selected_control_measure.value.max_score) => {
    if (score.score > max_score) {
        score.score = max_score
    }
    if (score.score < min_score) {
        score.score = min_score
    }
}

const getScoreParams = () => {
    let params = {
        study_group_id: selected_study_group.value.id,
        studyplan_course_id: selected_studyplan_course.value.id
    }
    return params
}

const getStudyGroupsCoursesByTrimesterParams = () => {
    let params = { trimester: selected_trimester.value.id }
    return params
}

const getStudyGroupsCoursesByGroupCourseNameParams = () => {
    let params = { name: search_field_groups_courses.value }
    return params
}

const multipleUpdateControlMeasureScoresParams = () => {
    let params = { study_group_id: selected_study_group.value.id, studyplan_course_id: selected_studyplan_course.value.id }
    return params
}

const setResultScoreParams = () => {
    let params = { study_group_id: selected_study_group.value.id, studyplan_course_id: selected_studyplan_course.value.id }
    return params
}
</script>

<style lang="scss" scoped>
.control-measure-info {

    & span {
        color: $main-color;
        font-weight: 700;
    }
}

.course-group {
    border: 2px solid #eeeeee;
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

.score-upd-btn {
    margin: 0.5em auto;
}
</style>