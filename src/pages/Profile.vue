<template>
    <Transition>
        <change-email v-if="is_change_email_modal" @close="is_change_email_modal = false"></change-email>
    </Transition>
    <Transition>
        <change-password v-if="is_change_password_modal" @close="is_change_password_modal = false"></change-password>
    </Transition>
    <Transition>
        <change-username v-if="is_change_username_modal" @close="is_change_username_modal = false"></change-username>
    </Transition>
    <div class="container-fluid pt-2">
        <div class="row justify-content-center mx-0">
            <div class="col-12 col-lg-6 profile-card">
                <h3>Профиль</h3>
                <div class="profile-header">
                    <div class="profile-header-student" v-if="$userStore.user">
                        <h5>{{ reductionFIO($userStore.user.user) }}
                            <span v-if="$userStore.isTeacher()">
                                (преподаватель)</span>
                            <span v-if="$userStore.isStudent()"> ({{
                                $userStore.user.study_group.name }})</span>
                        </h5>
                    </div>
                </div>
                <div class="profile-functions">
                    <div class="profile-function" @click="router.push({ name: 'user_profiles' })">Сменить профиль</div>
                    <div class="profile-function" @click="is_change_password_modal = true">Изменить пароль</div>
                    <div class="profile-function" @click="is_change_username_modal = true">Изменить имя пользователя</div>
                    <div class="profile-function" @click="is_change_email_modal = true">Изменить Email</div>
                    <div class="profile-function" v-if="$userStore.isTeacher()" @click="router.push({ name: 'contact' })">
                        Сменить контакты</div>
                    <div class="profile-function" @click="$userStore.logout()">Выйти</div>
                    <div class="profile-function" @click="$userStore.logoutAll()">Выйти из всех устройств</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { reductionFIO } from '@/services/user_services';
import ChangeEmail from '@/components/ChangeEmail.vue';
import ChangePassword from '@/components/ChangePassword.vue'
import ChangeUsername from '@/components/ChangeUsername.vue'


const $userStore = inject('$userStore')

const router = useRouter()

let is_change_username_modal = ref(false)
let is_change_password_modal = ref(false)
let is_change_email_modal = ref(false)


</script>