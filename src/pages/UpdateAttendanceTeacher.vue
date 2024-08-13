<template>
    <div class="container mt-3">
        <div class="row justify-content-center">
            <div class="col-lg-8 col-12">
                <div class="pair huge-card mb-2" v-if="pair">
                    <h5>{{ pair.course }} [{{ reduceTypeOfPair(pair.type_of_pair) }}] ({{
                        dateFormat(pair.date) }})</h5>
                </div>
                <div v-for="item1 in attendance_list" :key="item1">
                    <h4>{{ item1.study_group.name }}</h4>
                    <div class="row justify-content-center mb-2" v-for="item2 in item1.attendance" :key="item2">
                        <div class="col-8">
                            <div class="student-fio">
                                {{ reductionFIO(item2.student.user) }}
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="student-attendance-fio">
                                <v-checkbox v-model="item2.status" hide-details hide-spin-buttons :false-value="false"
                                    :true-value="true" density="compact"></v-checkbox>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="my-2">
                    <input type="submit" @click="multipleUpdateAttendance" value="Сохранить" class="form__btn w-100">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getAttendanceAPI, getTimeTableAPI, multipleUpdateAttendanceAPI } from '@/api/study'
import { ref, onMounted, inject } from 'vue';
import { reductionFIO } from '@/services/user_services';
import { useRoute } from 'vue-router'
import { reduceTypeOfPair, formatAttendanceTeacher } from '@/services/study_services'
import { dateFormat } from '@/services/datetime_services'

const $notificationStore = inject('$notificationStore')

const route = useRoute()

const error_message_attendance = 'Не удалось загрузить посещаемость'
const error_message_pair = 'Не удалось загрузить пару'
const error_message_update_attendance = 'Не удалось сохранить посещаемость'
const success_message_update_scores = 'Посещаемость успешно сохранена'

let attendance_list = ref([])
let pair = ref(null)

let pair_id;

onMounted(() => {
    pair_id = route.params.pair_id
    getAttendance()
    getPair()
})

const getAttendance = async () => {
    try {
        const params = getAttendanceParams()
        const response = await getAttendanceAPI(params)
        attendance_list.value = formatAttendanceTeacher(response.data.results)
    }
    catch {
        $notificationStore.addError(error_message_attendance)
    }
}

const getPair = async () => {
    try {
        const params = {}
        const response = await getTimeTableAPI(params, pair_id)
        pair.value = response.data
    }
    catch {
        $notificationStore.addError(error_message_pair)
    }
}

const multipleUpdateAttendance = async () => {
    try {
        const data = createListAttendanceUpdated()
        const params = getAttendanceParams()
        await multipleUpdateAttendanceAPI(params, data)
        $notificationStore.addSuccess(success_message_update_scores)
    }
    catch {
        $notificationStore.addError(error_message_update_attendance)
    }
}

const getAttendanceParams = () => {
    let params = { pair_id: pair_id }
    return params
}

const createListAttendanceUpdated = () => {
    let list_attendance_updated = []
    attendance_list.value.forEach((item1) => {
        item1.attendance.forEach((item2) => {
            list_attendance_updated.push({
                id: item2.id,
                status: item2.status
            })
        })
    })
    return list_attendance_updated
}
</script>

<style lang="scss" scoped></style>