<template>
    <div class="container d-md-none px-2" style="min-height: 60px">
        <div class="row custom-navbar justify-content-between mx-auto px-2">
            <div class="col-2 custom-navbar-content">
                <router-link class="link" active-class="link-active"
                    :to="$userStore.isStudent() ? { name: 'student_timetable' } : { name: 'teacher_timetable' }">
                    <font-awesome-icon icon="calendar-days" class="font-icon" />
                    <p>Расписание</p>
                </router-link>
            </div>
            <div class="col-2 custom-navbar-content">
                <router-link class="link" active-class="link-active"
                    :to="$userStore.isStudent() ? { name: 'student_score' } : { name: 'teacher_score' }">
                    <font-awesome-icon icon="star" class="font-icon" />
                    <p>Оценки</p>
                </router-link>
            </div>
            <div class="col-2 custom-navbar-content" v-if="$userStore.isStudent()">
                <router-link class="link" active-class="link-active" :to="{ name: 'studyplan' }">
                    <font-awesome-icon icon="table" class="font-icon" />
                    <p>План</p>
                </router-link>
            </div>
            <div class="col-3 custom-navbar-content" v-if="$userStore.isTeacher()">
                <router-link class="link" active-class="link-active" :to="{ name: 'teacher_attendance' }">
                    <font-awesome-icon icon="table" class="font-icon" />
                    <p>Посещаемость</p>
                </router-link>
            </div>
            <div class="col-2 custom-navbar-content">
                <router-link class="link" active-class="link-active"
                    :to="$userStore.isStudent() ? { name: 'student_other' } : { name: 'teacher_other' }">
                    <font-awesome-icon icon="box" class="font-icon" />
                    <p>Другое</p>
                </router-link>
            </div>
            <div class="col-2 custom-navbar-content">
                <router-link class="link" active-class="link-active" :to="{ name: 'profile_functions' }">
                    <font-awesome-icon icon="user" class="font-icon" />
                    <p>Профиль</p>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { inject } from 'vue'

const $userStore = inject('$userStore')
</script>

<style lang='scss' scoped>
p {
    font-size: 0.7rem;
}

.custom-navbar-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 12px;
    margin-bottom: -12px;
}

.link {
    color: grey;
    text-decoration: none;
}

.link-active {
    color: $main-color;
    font-weight: 900;
}

.custom-navbar {
    padding-left: 5px;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #f8f8fa;
    text-align: center;
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.7);
}
</style>