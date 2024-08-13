<template>
    <Transition>
        <reset-username v-if="is_reset_username_modal" @close="is_reset_username_modal = false"></reset-username>
    </Transition>
    <Transition>
        <reset-password v-if="is_reset_password_modal" @close="is_reset_password_modal = false"></reset-password>
    </Transition>
    <div class="container">
        <div class="row justify-content-center mx-1">
            <div class="col-lg-6 col-md-8 col-12 base-card login">
                <h4 class="login-header">Вход</h4>
                <div class="login-username">
                    <input type="text" v-model="username" @keyup.enter="login" placeholder="Имя пользователя"
                        class="form__input">
                </div>
                <div class="login-password">
                    <input type="password" v-model="password" @keyup.enter="login" placeholder="Ваш пароль"
                        class="form__input">
                </div>
                <div class="login-btn text-center">
                    <input type="submit" @click="login" value="Войти" class="form__btn w-100">
                </div>
                <div>
                    Забыли <span class="reset-link" @click="is_reset_username_modal = true">имя пользователя</span> или
                    <span class="reset-link" @click="is_reset_password_modal = true">пароль</span>?
                </div>
                <div v-if="errors.length" class="errors">
                    <div class="message-error" v-for="error in errors" :key="error">
                        * {{ error }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { inject, ref } from 'vue'
import { loginAPI } from '@/api/auth'
import { useRouter, useRoute } from 'vue-router'
import ResetPassword from '@/components/ResetPassword.vue';
import ResetUsername from '@/components/ResetUsername.vue';

const $userStore = inject('$userStore')

const router = useRouter()
const route = useRoute()

const error_message_login = 'Неправильное имя пользователя или пароль'

let base_redirect_name = 'student_timetable';
const redirect_name = route.query.redirect
const redirect_many_profiles = 'user_profiles'

let is_many_profiles = false

let username = ref('')
let password = ref('')
let errors = ref([])
let is_reset_username_modal = ref(false)
let is_reset_password_modal = ref(false)


const validate = () => {
    errors.value = []
    if (!username.value) {
        errors.value.push('Укажите имя пользователя')
    }
    if (!password.value) {
        errors.value.push('Укажите пароль')
    }
    if (!errors.value.length) {
        return true
    }
    return false
}

const login = async () => {
    if (validate()) {
        try {
            const response = await loginAPI(username.value, password.value)
            const data = response.data
            localStorage.setItem('Token', data.token)
            if (data.user_profiles.students.length === 1 && !data.user_profiles.teacher) {
                $userStore.user = data.user_profiles.students[0]
                localStorage.setItem('Student', data.user_profiles.students[0].id)
                localStorage.setItem('Role', 'student')
            }
            else if (data.user_profiles.teacher && !data.user_profiles.students.length) {
                $userStore.user = data.user_profiles.teacher
                localStorage.setItem('Role', 'teacher')
                base_redirect_name = 'teacher_timetable'
            }
            else if ((data.user_profiles.students.length && data.user_profiles.teacher)
                || (data.user_profiles.students.length >= 2)) {
                is_many_profiles = true
            }
            else {
                errors.value.push(error_message_login)
            }

            if (!errors.value.length) {
                if (is_many_profiles) {
                    router.push({ name: redirect_many_profiles, query: { redirect: redirect_name } })
                }
                else if (redirect_name) {
                    router.push({ name: redirect_name })
                }
                else {
                    router.push({ name: base_redirect_name })
                }
            }
        }
        catch (e) {
            console.log(e)
            errors.value.push(error_message_login)
        }
    }
}
</script>
<style scoped lang="scss">
.login-btn {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
}

.login {
    margin-top: 200px;
}
</style>