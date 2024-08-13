<template>
    <Transition>
        <reset-username v-if="is_reset_username_modal" @close="is_reset_username_modal = false"></reset-username>
    </Transition>
    <div class="container h-100">
        <div class="row justify-content-center align-items-center h-100 mx-1">
            <div class="col-lg-6 col-md-8 col-12 base-card login">
                <h4 class="reset-password-header">Восстановление имени пользователя</h4>
                <input type="text" v-model="new_username" @keyup.enter="resetUsernameConfirm"
                    placeholder="Новое имя пользователя" class="form__input">
                <div class="reset-btn text-center">
                    <input type="submit" @click="resetUsernameConfirm" value="Восстановить" class="form__btn w-75">
                </div>
                <div v-if="is_false_reset">
                    Отправить новую <span class="reset-link" @click="is_reset_username_modal = true">ссылку</span> для
                    восстановления имени пользователя?
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
import { resetUsernameConfirmAPI } from '@/api/auth'
import { useRouter, useRoute } from 'vue-router'
import ResetUsername from '@/components/ResetUsername.vue';

const router = useRouter()
const route = useRoute()

const error_message_empty_new_username = 'Введите новый пароль'
const error_message_ref_is_timeout = 'Срок действия ссылки истек'
const error_message_already_exists_username = 'Имя пользователя уже занято'
const error_message_change_username = 'Не удалось восстановить имя пользователя'

let new_username = ref('')
let is_false_reset = ref('')
let is_reset_username_modal = ref('')
let errors = ref([])

const validate = () => {
    errors.value = []
    if (!new_username.value) {
        errors.value.push(error_message_empty_new_username)
    }
    if (errors.value.length) {
        return false
    }
    return true
}

const resetUsernameConfirm = async () => {
    if (validate()) {
        try {
            const uid = route.params.uid
            const token = route.params.token
            await resetUsernameConfirmAPI(uid, token, new_username.value)
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
                else if (Object.prototype.hasOwnProperty.call(e.response.data, 'new_username')) {
                    if (e.response.data.new_username[0] === 'Пользователь с таким именем уже существует.') {
                        errors.value.push(error_message_already_exists_username)
                    }
                }
            }
            catch {
                errors.value.push(error_message_change_username)
            }
        }
    }
}

</script>