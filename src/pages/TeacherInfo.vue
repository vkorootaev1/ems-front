<template>
    <div class="container mt-0">
        <div class="row justify-content-center">
            <div class="col-lg-6 col-md-8 col-12">
                <div class="teacher" v-if="teacher">
                    <div class="teacher-header">
                        <div class="teacher-photo" v-if="teacher.user.photo">
                            <img :src="teacher.user.photo">
                        </div>
                        <div class="teacher-photo no-photo" v-else>
                            Изображение не загружено
                        </div>
                        <div class="teacher-name">
                            <h5>{{ teacher.user.last_name }}</h5>
                            <h5>{{ teacher.user.first_name }}</h5>
                            <h5>{{ teacher.user.patronymic }}</h5>
                        </div>
                    </div>
                    <div class="cathedras">
                        <span class="info-header">Кафедры</span>
                        <div class="cathedra" v-for="cathedra in teacher.cathedras" :key="cathedra">
                            - {{ cathedra }}
                        </div>
                    </div>
                    <div class="courses">
                        <span class="info-header">Дисциплины</span>
                        <div class="course" v-for="course in teacher.courses" :key="course">
                            - {{ course }}
                        </div>
                    </div>
                    <div class="contacts">
                        <span class="info-header">Контакты</span>
                        <div class="contact" v-for="contact in teacher.user.contacts" :key="contact">
                            <ContactTypeIcon :contact_type="contact.type" />
                            <span class="contact-ref">{{ contact.contact_ref }}</span>
                        </div>
                    </div>
                    <span class="info-header teacher-timetable"
                        @click="router.push({ name: 'teacher_timetable_info', params: { teacher_id: route.params.teacher_id } })">Расписание
                        преподавателя</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import ContactTypeIcon from "@/components/ContactTypeIcon.vue"
import { getTeacherAPI } from '@/api/study'
import { ref, onMounted, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const $notificationStore = inject('$notificationStore')

const router = useRouter()
const route = useRoute()

const error_message_teacher = 'Не удалось загрузить преподавателя'

let teacher = ref(null)


onMounted(() => {
    getTeacher()
})

const getTeacher = async () => {
    try {
        const params = {}
        const response = await getTeacherAPI(params, route.params.teacher_id)
        teacher.value = response.data
    }
    catch {
        $notificationStore.addError(error_message_teacher)
    }
}
</script>
<style lang="scss" scoped>
.teacher {
    border-radius: 10px;
    padding: 10px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    margin-top: 10px;
    margin-bottom: 10px;
}

.teacher-header {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
}

.info-header {
    font-size: 1.2rem;
    margin-top: 10px;
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
        padding: 15px;
    }
}

.teacher-name {
    margin-left: 5px;
    word-wrap: break-word;
    overflow-x: hidden
}

.contact {
    margin-bottom: 5px;
}

.contact-ref {
    margin-left: 5px;
}

.teacher-timetable {
    cursor: pointer;
    transition: 0.3s;
    color: $main-color;

    &:hover {
        color: $main-color-hover;
    }
}
</style>