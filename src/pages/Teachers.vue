<template>
    <div class="container mt-3">
        <div class="row justify-content-center">
            <div class="col-lg-6 col-md-8 col-12">
                <v-text-field label="Имя преподавателя" v-model="search_field_teacher_name" rounded="lg" variant="outlined"
                    hide-details="true" type="text" style="max-width: 500px;" v-debounce:800="getTeacherByName" clearable
                    @click:clear="clearSearchField"></v-text-field>
                <div class="base-card teacher-card" v-for="teacher in teachers" :key="teacher"
                    @click="router.push({ name: 'teacher_info', params: { teacher_id: teacher.id } })">
                    <div>
                        <div class="teacher-photo" v-if="teacher.user.photo">
                            <img :src="teacher.user.photo">
                        </div>
                        <div class="teacher-photo no-photo" v-else>
                            Изображение не загружено
                        </div>
                    </div>
                    <div class="teacher-info">
                        {{ teacher.user.last_name }}
                        <br>
                        {{ teacher.user.first_name }}
                        <br>
                        {{ teacher.user.patronymic }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <InfiniteComponent :page="page" :hasNextPage="hasNextPage" @incrementPage="page++;" @loadAPI="getTeacher">
    </InfiniteComponent>
</template>
<script setup>
import { getTeacherAPI } from '@/api/study'
import { ref, onMounted, inject } from 'vue'
import InfiniteComponent from '@/components/InfiniteComponent.vue';
import { useRoute, useRouter } from 'vue-router'

const $notificationStore = inject('$notificationStore')

const router = useRouter()
const route = useRoute()

const error_message_teachers = 'Не удалось загрузить преподавателей'

let teachers = ref([])
let page = ref(1)
let hasNextPage = ref(false)
let search_field_teacher_name = ref('')

onMounted(() => {
    getTeacher()
})

const getTeacher = async () => {
    try {
        hasNextPage.value = false
        const params = getTeacherParams()
        const response = await getTeacherAPI(params)
        teachers.value.push(...response.data.results)
        router.replace({ name: route.name, query: { ...route.query, page: page.value } })
        if (response.data.next) {
            hasNextPage.value = true;
        }
    }
    catch {
        $notificationStore.addError(error_message_teachers)
    }
}

const getTeacherByName = async () => {
    if (search_field_teacher_name.value) {
        clean()
        try {
            const params = getTeacherParams()
            const response = await getTeacherAPI(params)
            teachers.value.push(...response.data.results)
            router.replace({ name: route.name, query: { ...route.query, page: page.value } })
            if (response.data.next) {
                hasNextPage.value = true;
            }
        }
        catch {
            $notificationStore.addError(error_message_teachers)
        }
    }
}

const getTeacherParams = () => {
    let params = { page: page.value }
    if (search_field_teacher_name.value) {
        params.name = search_field_teacher_name.value
    }
    return params
}

const clearSearchField = () => {
    clean()
    getTeacher()
}

const clean = () => {
    teachers.value = []
    page.value = 1
    hasNextPage.value = false
}

</script>
<style lang="scss" scoped>
.teacher-card {
    display: flex;
    margin-top: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: 0.5s;

    &:hover {
        background-color: $main-color;

        & .teacher-info {
            color: white
        }
    }
}

.teacher-photo {
    border-radius: 10px;
    margin-right: 5px;
    height: 200px;
    width: 150px;

    & img {
        height: 200px;
        width: 150px;
        border-radius: 10px;
        border: 1px solid #eeeeee;
    }

    &.no-photo {
        background-color: #FDF6E4;
        color: grey;
        padding: 15px;
    }
}

.teacher-info {
    margin-left: 5px;
    word-wrap: break-word;
    overflow-x: hidden
}
</style>