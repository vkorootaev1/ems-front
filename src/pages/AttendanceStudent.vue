<template>
    <div class="container">
        <div class="row justify-content-center pt-4">
            <div class="col-lg-8 col-12">
                <h4>Пропущенные пары</h4>
                <v-select label="Триместр" v-model="selected_trimester" :items="passed_trimesters" variant="outlined"
                    rounded="lg" return-object item-value="id" @update:modelValue="getAttendanceByTrimester"
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
                <div v-if="!attendance_list.length" class="my-2 huge-card" style="text-align: center;">
                    <h5>Пропусков не найдено</h5>
                </div>
                <div class="huge-card my-2" v-else v-for="item in attendance_list" :key="item">
                    <h5>{{ item.pair.course }} [{{ reduceTypeOfPair(item.pair.type_of_pair) }}] ({{
                        dateFormat(item.pair.date) }})</h5>
                    <div class="attendance__footer">
                        {{ reductionFIO(item.teacher.user) }} ({{ dateTimeFormat(item.date_upd) }})
                    </div>
                </div>
            </div>
        </div>
    </div>
    <InfiniteComponent :page="page" :hasNextPage="hasNextPage" @incrementPage="page++;" @loadAPI="getAttendance">
    </InfiniteComponent>
</template>
<script setup>
import { reduceTypeOfPair } from '@/services/study_services'
import { getAttendanceAPI, getPassedStudentTrimesterAPI } from '@/api/study'
import { ref, onMounted, inject } from 'vue'
import { dateFormat, dateTimeFormat } from '@/services/datetime_services'
import { reductionFIO } from '@/services/user_services'
import InfiniteComponent from '@/components/InfiniteComponent.vue';
import { useRouter, useRoute } from 'vue-router'
import { formatTrimester } from '@/services/study_services'

const $notificationStore = inject('$notificationStore')

const router = useRouter()
const route = useRoute()

const error_message_attendace = 'Не удалось загрузить посещаемость'
const error_message_passed_trimesters = 'Не удалось загрузить прошедшие триместры'

let attendance_list = ref([])
let page = ref(1)
let hasNextPage = ref(false)
let selected_trimester = ref({ id: 0, date_start: 0, date_end: 0 })
let passed_trimesters = ref([])

onMounted(() => {
    getPassedStudentTrimester()
    getAttendance()
})

const getAttendance = async () => {
    try {
        hasNextPage.value = false
        const params = getAttendanceParams()
        const response = await getAttendanceAPI(params)
        attendance_list.value.push(...response.data.results)
        router.replace({ name: route.name, query: { ...route.query, page: page.value } })
        if (response.data.next) {
            hasNextPage.value = true;
        }
    }
    catch {
        $notificationStore.addError(error_message_attendace)
    }
}

const getPassedStudentTrimester = async () => {
    try {
        const response = await getPassedStudentTrimesterAPI()
        passed_trimesters.value = response.data
        selected_trimester.value = passed_trimesters.value[0]
        selected_trimester.value.current = 'текущий'
    }
    catch {
        $notificationStore.addError(error_message_passed_trimesters)
    }
}

const getAttendanceByTrimester = () => {
    clear()
    getAttendance()
}

const clear = () => {
    page.value = 1
    attendance_list.value = []
}

const getAttendanceParams = () => {
    let params = { trimester: selected_trimester.value.id, page: page.value }
    return params
}
</script>
<style lang="scss" scoped>
.attendance__footer {
    text-align: end;
}
</style>