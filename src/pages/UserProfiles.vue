<template>
    <div class="container">
        <div class="row justify-content-center pt-2">
            <div class="col-lg-6 col-md-10 col-12">
                <h4 class="user-profiles-header">Выбор профиля</h4>
                <div v-if="profiles">
                    <div v-if="profiles.students" class="students">
                        <div class="students-profile" v-for="student in profiles.students" :key="student">
                            <div class="base-card student-profile" @click="chooseProfile(student)"
                                :class="{ 'active': $userStore.user && student.id === $userStore.user.id }">
                                <span>{{ reductionFIO(student.user) }} [{{
                                    student.study_group.name }} ({{
        dateFormat(student.study_group.begin_date) }} - {{
        dateFormat(student.study_group.end_date) }})]</span>
                            </div>
                        </div>
                    </div>
                    <div class="teacher" v-if="profiles.teacher">
                        <div class="base-card teacher-profile" @click="chooseProfile(profiles.teacher)"
                            :class="{ 'active': $userStore.user && profiles.teacher.id === $userStore.user.id }">
                            <span>{{ reductionFIO(profiles.teacher.user) }} (преподаватель)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { inject, ref, onMounted } from 'vue'
import { userProfilesAPI } from '@/api/auth'
import { reductionFIO } from '@/services/user_services'
import { dateFormat } from '@/services/datetime_services'

const $userStore = inject('$userStore')
const $notificationStore = inject('$notificationStore')

const router = useRouter()
const route = useRoute()

const error_message_profiles = 'Не удалось загрузить профили'
let base_redirect_name = 'student_timetable'

const redirect_name = route.query.redirect

const profiles = ref(null)

onMounted(() => {
    userProfiles()
})

const userProfiles = async () => {
    try {
        const response = await userProfilesAPI()
        profiles.value = response.data
    }
    catch {
        $notificationStore(error_message_profiles)
    }
}

const chooseProfile = (profile) => {
    const is_first_choose = $userStore.user
    $userStore.user = profile
    if (profile.role === 'student') {
        localStorage.setItem('Student', profile.id)
        localStorage.setItem('Role', 'student')
    }
    else {
        localStorage.removeItem('Student')
        base_redirect_name = 'teacher_timetable'
        localStorage.setItem('Role', 'teacher')
    }

    if (redirect_name) {
        router.push({ name: redirect_name })
    }
    else if (!is_first_choose) {
        router.push({ name: base_redirect_name })
    }
}

</script>
<style lang="scss">
.student-profile,
.teacher-profile {
    margin-top: 15px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: 0.5s;

    &:not(.active):hover {
        background-color: $main-color-hover;
        color: white
    }
}

.active {
    color: white;
    background-color: $main-color;
}
</style>