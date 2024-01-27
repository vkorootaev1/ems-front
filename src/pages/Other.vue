<template>
    <div class="container-fluid pt-2">
        <div class="row justify-content-center mx-0">
            <div class="col-12 col-lg-6 other-card">
                <h3>Другое</h3>
                <div class="other-functions">
                    <div class="other-function"
                        @click="router.push($userStore.isStudent() ? { name: 'student_certificate' } : { name: 'teacher_certificate' })">
                        Справки</div>
                    <div class="other-function" v-if="$userStore.isStudent()"
                        @click="router.push({ name: 'student_attendance' })">
                        Посещаемость</div>
                    <div class="other-function" v-if="$userStore.isStudent()"
                        @click="router.push({ name: 'teachers_info' })">
                        Преподаватели</div>
                    <div class="other-function"
                        @click="router.push($userStore.isStudent() ? { name: 'student_advertisements' } : { name: 'teacher_advertisements' })">
                        Объявления</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { inject } from 'vue';
import { useRouter } from 'vue-router';

const $userStore = inject('$userStore')

const router = useRouter()

</script>