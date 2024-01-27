<template>
    <div class="container mt-3">
        <div class="row justify-content-center">
            <div class="col-lg-8 col-12">
                <div class="row align-items-end mb-2">
                    <div class="col-xxl-6 col-12 my-2">
                        <v-select label="Посещаемость" v-model="selected_attendance" :items="attendance_choices"
                            variant="outlined" rounded="lg" item-title="title" item-value="status" return-object
                            hide-details="true" @update:modelValue="select"></v-select>
                    </div>
                    <div class="col-xxl-6 col-12 my-2">
                        <v-select label="Триместр" v-model="selected_trimester" :items="trimesters" variant="outlined"
                            rounded="lg" return-object item-value="id" @update:modelValue="select" hide-details="true">
                            <template v-slot:item="{ item: { raw }, props: { onClick } }">
                                <v-list-item :class="{ 'v-list-item--active': selected_trimester?.id === raw.id }"
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
                </div>
                <div class="row align-items-end mb-2">
                    <div class="col-xxl-6 col-12 my-2">
                        <v-select label="Поиск по" v-model="selected_search_name" :items="seacrh_name_choices"
                            variant="outlined" rounded="lg" return-object hide-details="true"
                            @update:modelValue="select"></v-select>
                    </div>
                    <div class="col-xxl-6 col-12 my-2">
                        <v-text-field
                            :label="selected_search_name === 'Название группы' ? 'Название группы' : 'Название дисциплины'"
                            v-model="search_name" rounded="lg" variant="outlined" hide-details="true" type="text"
                            v-debounce:400="search" clearable @click:clear="getPairs"></v-text-field>
                    </div>
                </div>
                <div v-if="!pairs.length" class="attendance-card my-2 huge-card" style="text-align: center;">
                    <h5>Ничего не найдено по вашему запросу</h5>
                </div>
                <div class="attendance-card my-2 huge-card" v-else v-for="item in pairs" :key="item"
                    @click="router.push({ name: 'teacher_attendance_update', params: { pair_id: item.id } })">
                    <h5>{{ item.course }} [{{ reduceTypeOfPair(item.type_of_pair) }}] ({{
                        dateFormat(item.date) }})</h5>
                </div>
            </div>
        </div>
    </div>
    <InfiniteComponent :page="page" :hasNextPage="hasNextPage" @incrementPage="page++;" @loadAPI="getPairs">
    </InfiniteComponent>
</template>
<script setup>
import { reduceTypeOfPair } from '@/services/study_services'
import { getTrimesterAPI, getTimeTableAPI } from '@/api/study'
import { ref, onMounted, inject } from 'vue'
import { dateFormat } from '@/services/datetime_services'
import InfiniteComponent from '@/components/InfiniteComponent.vue';
import { useRouter, useRoute } from 'vue-router'
import { formatTrimester } from '@/services/study_services'

const $notificationStore = inject('$notificationStore')

const router = useRouter()
const route = useRoute()

const error_message_pairs = 'Не удалось загрузить пары'
const error_message_trimesters = 'Не удалось загрузить триместры'

let pairs = ref([])
let page = ref(1)
let hasNextPage = ref(false)
let selected_trimester = ref({ id: 0, current: 'текущий' })
let search_name = ref('')
let selected_search_name = ref(null)
let selected_attendance = ref(null)
let trimesters = ref([])

let order = '-date'
let seacrh_name_choices = ['Название группы', 'Название дисциплины']
let attendance_choices = [{ title: 'Поставлена', status: true }, { title: 'Не поставлена', status: false }, { title: 'все', status: null }]

onMounted(() => {
    selected_attendance.value = attendance_choices[1]
    selected_search_name.value = seacrh_name_choices[1]
    getPairs()
    getTrimester()
})

const getPairs = async () => {
    try {
        hasNextPage.value = false
        let params = getPairsParams()
        const response = await getTimeTableAPI(params)
        pairs.value.push(...response.data.results)
        router.replace({ name: route.name, query: { ...route.query, page: page.value } })
        if (response.data.next) {
            hasNextPage.value = true;
        }
    }
    catch {
        $notificationStore.addError(error_message_pairs)
    }
}

const getTrimester = async () => {
    try {
        const response = await getTrimesterAPI()
        trimesters.value = response.data
        trimesters.value[0].current = true
        selected_trimester.value = trimesters.value[0]
    }
    catch {
        $notificationStore.addError(error_message_trimesters)
    }
}

const select = () => {
    clear()
    search_name.value = ''
    getPairs()
}

const search = () => {
    clear()
    getPairs()
}

const clear = () => {
    pairs.value = []
    page.value = 1
}

const getPairsParams = () => {
    let params = { trimester: selected_trimester.value.id, attendance: selected_attendance.value.status, page: page.value, order: order }
    if (selected_search_name.value === 'Название группы' && search_name.value) {
        params.group_name = search_name.value
    }
    if (selected_search_name.value === 'Название дисциплины' && search_name.value) {
        params.course_name = search_name.value
    }
    return params
}
</script>
<style lang="scss" scoped>
.attendance-card {
    display: flex;
    margin-top: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: 0.5s;

    &:hover {
        background-color: $main-color;
        color: white
    }
}
</style>