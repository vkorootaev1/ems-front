<template>
    <div class="container">
        <div class="row justify-content-center pt-4">
            <div class="col-lg-6 col-md-8 col-12">
                <v-text-field label="Имя преподавателя" v-model="seacrh_field_teacher_name" rounded="lg" variant="outlined"
                    hide-details="true" type="text" style="max-width: 500px;"
                    v-debounce:800="_ => getTeacher(true)"></v-text-field>
                <div class="base-card teacher-card" v-for="teacher in teachers" :key="teacher">
                    <div>
                        <div class="teacher-photo" v-if="teacher.user.photo">
                            <img :src="teacher.user.photo">
                        </div>
                        <div class="teacher-photo no-photo" v-else>
                            Изображение не загружено
                        </div>
                    </div>
                    <div class="teacher-info">
                        <div class="last_name">
                            {{ teacher.user.last_name }}
                        </div>
                        <div class="first_name">
                            {{ teacher.user.first_name }}
                        </div>
                        <div class="patronymic">
                            {{ teacher.user.patronymic }}
                        </div>
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
import { ref, onMounted } from 'vue'
import InfiniteComponent from '@/components/InfiniteComponent.vue';

let teachers = ref([])
let page = ref(1)
let hasNextPage = ref(false)
let seacrh_field_teacher_name = ref('')

onMounted(async () => {
    await getTeacher()
})

const getTeacher = async (filtered = false) => {
    try {
        if (filtered) {
            teachers.value = []
            page.value = 1
        }
        hasNextPage.value = false
        const response = await getTeacherAPI(page.value, seacrh_field_teacher_name.value)
        teachers.value.push(...response.data.results)
        if (response.data.next) {
            hasNextPage.value = true;
        }
    }
    catch {
        console.log('qwe')
    }
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
    }

    &.no-photo {
        background-color: #FDF6E4;
        padding: 15px;
    }
}

.teacher-info {
    margin-left: 5px;
    word-wrap: break-word;
    overflow-x: hidden
}
</style>