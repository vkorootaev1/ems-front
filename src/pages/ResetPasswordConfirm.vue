<template>
    <Transition>
        <reset-password v-if="is_reset_password_modal" @close="is_reset_password_modal = false"></reset-password>
    </Transition>
    <div class="container h-100">
        <div class="row justify-content-center align-items-center h-100 my-5 mx-1">
            <div class="col-lg-6 col-md-8 col-12 base-card login">
                <h4 class="reset-password-header">Восстановление пароля</h4>
                <input type="password" v-model="new_password" @keyup.enter="resetPasswordConfirm" placeholder="Новый пароль"
                    class="form__input">
                <input type="password" v-model="re_new_password" @keyup.enter="resetPasswordConfirm"
                    placeholder="Повторите новый пароль" class="form__input">
                <div class="reset-btn text-center">
                    <input type="submit" @click="resetPasswordConfirm" value="Восстановить" class="form__btn w-75">
                </div>
                <div v-if="is_false_reset">
                    Отправить новую <span class="reset-link" @click="is_reset_password_modal = true">ссылку</span> для
                    восстановления пароля?
                </div>
                <div v-if="errors.length" class="errors">
                    <div class="error" v-for="error in errors" :key="error">
                        * {{ error }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { resetPasswordConfirmAPI } from '@/api/auth'
import { useRouter, useRoute } from 'vue-router'
import ResetPassword from '@/components/ResetPassword.vue';

const router = useRouter()
const route = useRoute()

const error_message_empty_new_password = 'Введите новый пароль'
const error_message_empty_re_new_password = 'Повторите введенный пароль'
const error_message_password_not_compare = 'Введенные пароль не совпадают'
const error_message_ref_is_timeout = 'Срок действия ссылки истек'
const error_message_change_password = 'Не удалось восстановить пароль'

let new_password = ref('')
let re_new_password = ref('')
let is_false_reset = ref('')
let is_reset_password_modal = ref('')
let errors = ref([])

const validate = () => {
    errors.value = []
    if (!new_password.value) {
        errors.value.push(error_message_empty_new_password)
    }
    if (!re_new_password.value) {
        errors.value.push(error_message_empty_re_new_password)
    }
    if (!(new_password.value === re_new_password.value)) {
        errors.value.push(error_message_password_not_compare)
    }
    if (errors.value.length) {
        return false
    }
    return true
}

const resetPasswordConfirm = async () => {
    if (validate()) {
        try {
            const uid = route.params.uid
            const token = route.params.token
            await resetPasswordConfirmAPI(uid, token, new_password.value, re_new_password.value)
            router.push({ name: 'login' })
        }
        catch (e) {
            is_false_reset.value = true
            try {
                if (Object.prototype.hasOwnProperty.call(e.response.data, 'token')) {
                    if (e.response.data.token[0] === 'Неверный токен для данного пользователя.') {
                        errors.value.push(error_message_ref_is_timeout)
                    }
                }
            }
            catch {
                errors.value.push(error_message_change_password)
            }
        }
    }
}

</script>