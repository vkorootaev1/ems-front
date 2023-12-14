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
    <div class="container">
        <div class="row justify-content-center pt-5 mx-1">
            <div class="col-lg-6 col-md-8 col-12 base-card profile">
                <h3>Профиль</h3>
                <div class="profile-header">
                    <div class="profile-header-student" v-if="$store.user">
                        <h5>{{ reductionFIO($store.user.user) }}<span v-if="$store.getUserRole() === 'teacher'">
                                (преподаватель)</span></h5>
                        <h5 v-if="$store.getUserRole() === 'student'">{{ $store.user.study_group.name }} ({{
                            dateFormat($store.user.study_group.begin_date) }} - {{
        dateFormat($store.user.study_group.end_date) }})</h5>
                    </div>
                </div>
                <div class="profile-functions">
                    <div class="profile-function" @click="router.push({ name: 'user_profiles' })">Сменить профиль</div>
                    <div class="profile-function" @click="is_change_password_modal = true">Изменить пароль</div>
                    <div class="profile-function" @click="is_change_username_modal = true">Изменить имя пользователя</div>
                    <div class="profile-function" @click="is_change_email_modal = true">Изменить Email</div>
                    <div class="profile-function" @click="$store.logout()">Выйти</div>
                    <div class="profile-function" @click="$store.logoutAll()">Выйти из всех устройств</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { reductionFIO } from '@/services/user_services';
import { dateFormat } from '@/services/datetime_services';
import ChangeEmail from '@/components/ChangeEmail.vue';
import ChangePassword from '@/components/ChangePassword.vue'
import ChangeUsername from '@/components/ChangeUsername.vue'


const $store = inject('$userStore')

const router = useRouter()

let is_change_username_modal = ref(false)
let is_change_password_modal = ref(false)
let is_change_email_modal = ref(false)


</script>
<style lang="scss" scoped>
.profile-function {
    padding: 15px;
    border-radius: 20px;
    background-color: $main-color;
    color: white;
    cursor: pointer;
    margin: 10px 0;
    text-align: center;
}
</style>