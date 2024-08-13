<template>
    <Transition>
        <change-email v-if="is_change_email_modal && $userStore.user" @close="is_change_email_modal = false"></change-email>
    </Transition>
    <Transition>
        <change-password v-if="is_change_password_modal && $userStore.user"
            @close="is_change_password_modal = false"></change-password>
    </Transition>
    <Transition>
        <change-username v-if="is_change_username_modal && $userStore.user"
            @close="is_change_username_modal = false"></change-username>
    </Transition>
    <div class="custom-navbar">
        <router-link :to="$userStore.isStudent() ? { name: 'student_timetable' } : { name: 'teacher_timetable' }"
            active-class="link-active">Расписание</router-link>
        <router-link :to="{ name: 'studyplan' }" active-class="link-active" v-if="$userStore.isStudent()">Учебный
            план</router-link>
        <div class="custom-dropdown" v-if="$userStore.isStudent()">
            <button class="custom-dropbtn" :class="{ 'link-active-dropdown': IsParrentRoute(['student_score']) }">Оценки
                <font-awesome-icon icon="caret-down" />
            </button>
            <div class="custom-dropdown-content">
                <router-link :to="{ name: 'trimester_score' }" active-class="link-active">Промежуточные оценки</router-link>
                <router-link :to="{ name: 'result_score' }" active-class="link-active">Итоговые оценки</router-link>
            </div>
        </div>
        <router-link :to="{ name: 'teacher_score' }" v-if="$userStore.isTeacher()"
            active-class="link-active">Оценки</router-link>
        <router-link :to="{ name: 'teacher_attendance' }" v-if="$userStore.isTeacher()"
            active-class="link-active">Посещаемость</router-link>
        <div class="custom-dropdown">
            <button class="custom-dropbtn"
                :class="{ 'link-active-dropdown': IsParrentRoute(['student_other', 'teacher_other', 'teacher_advertisements', 'student_teachers']) }">Другое
                <font-awesome-icon icon="caret-down" />
            </button>
            <div class="custom-dropdown-content">
                <router-link
                    :to="$userStore.isStudent() ? { name: 'student_certificate' } : { name: 'teacher_certificate' }"
                    active-class="link-active">Справки</router-link>
                <router-link :to="{ name: 'student_attendance' }" active-class="link-active"
                    v-if="$userStore.isStudent()">Посещаемость</router-link>
                <router-link :to="{ name: 'teachers_info' }" active-class="link-active"
                    v-if="$userStore.isStudent()">Преподаватели</router-link>
                <router-link active-class="link-active"
                    :to="$userStore.isStudent() ? { name: 'student_advertisements' } : { name: 'teacher_advertisements' }">Объявления</router-link>
            </div>
        </div>
        <div class="custom-dropdown">
            <button class="custom-dropbtn" :class="{ 'link-active-dropdown': IsParrentRoute(['profile']) }">Профиль
                <font-awesome-icon icon="caret-down" />
            </button>
            <div class="custom-dropdown-content">
                <div class="user-info">
                    {{ $userStore.userShow() }}
                </div>
                <router-link :to="{ name: 'user_profiles' }" active-class="link-active">Сменить профиль</router-link>
                <a @click="is_change_password_modal = true">Изменить пароль</a>
                <a @click="is_change_username_modal = true">Изменить имя пользователя</a>
                <a @click="is_change_email_modal = true">Изменить email</a>
                <router-link v-if="$userStore.isTeacher()" :to="{ name: 'contact' }" active-class="link-active">Сменить
                    контакты</router-link>
                <a @click="$userStore.logout()">Выйти</a>
                <a @click="$userStore.logoutAll()">Выйти из всех устройств</a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { inject, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ChangeUsername from '@/components/ChangeUsername.vue'
import ChangeEmail from '@/components/ChangeEmail.vue';
import ChangePassword from '@/components/ChangePassword.vue';

const $userStore = inject('$userStore')

const router = useRouter()
const route = useRoute()

let is_change_username_modal = ref(false)
let is_change_password_modal = ref(false)
let is_change_email_modal = ref(false)


const IsParrentRoute = (parent_route_names) => {
    let is_found = null;
    router.getRoutes().forEach((r) => {
        (r.children || []).forEach((ch) => {
            if (r.path + "/" + ch.path == route.path) {
                is_found = r;
            }
        });
    });
    if (is_found) {
        return parent_route_names.includes(is_found.name) ? true : false
    }
}

</script>

<style lang="scss" scoped>
.link-active,
.link-active-dropdown {
    font-weight: 700;
    color: $main-color-hover !important;
}

.custom-navbar {
    overflow: hidden;
    background-color: $main-color;

    & a {
        float: left;
        font-size: 16px;
        color: white;
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;
        cursor: pointer;

        &:not(.link-active):hover {
            background-color: $main-color-hover;
        }
    }
}

.custom-dropdown {
    transition: 0.5s;
    float: left;
    overflow: hidden;
}

.custom-dropbtn {
    font-size: 16px;
    border: none;
    outline: none;
    color: white;
    padding: 14px 16px;
    background-color: inherit;
    font-family: inherit;
    margin: 0;

    &:not(.link-active-dropdown):hover {
        background-color: $main-color-hover;
    }
}

.custom-navbar {

    &a:hover() {
        background-color: $main-color-hover;
        color: white
    }
}

.custom-dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 3;
    border-radius: 15px;

    & a,
    div {
        border-radius: 5px;
        float: none;
        color: black;
        padding: 12px 16px;
        display: block;
        text-align: left;
    }

    & div:not(.user-info) {
        cursor: pointer;
    }

    & a:hover,
    div:hover {
        background-color: #ddd !important;
    }
}

.custom-dropdown:hover .custom-dropdown-content {
    display: block;
}

.user-info {
    font-weight: bold;
    pointer-events: none;
}

@media (max-width: 767px) {
    .custom-navbar {
        display: none;
    }
}
</style>