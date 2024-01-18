<template>
    <div class="containter custom-modal-wrap" @mousedown="$emit('close')">
        <div class="row align-items-center justify-content-center mt-5 mx-2">
            <div class="col-lg-6 col-md-8 col-12 custom-modal-body" @mousedown.stop="">
                <h4>Восстановление пароля</h4>
                <input type=" text" v-model="email" @keyup.enter="resetPassword" placeholder="Email" class="form__input">
                <div class="row justify-content-center modal-btns">
                    <div class="col">
                        <input type="submit" @click="resetPassword" value="Восстановить" class="form__btn w-100">
                    </div>
                    <div class="col">
                        <input type="submit" value="Закрыть" class="error__btn w-100" @click="$emit('close')">
                    </div>
                </div>
                <div v-if="messages.length">
                    <div v-for="message in messages" :key="message"
                        :class="message.type === 'error' ? 'message-error' : 'message-success'">
                        * {{ message.text }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { resetPasswordAPI } from '@/api/auth'

const error_message_email_not_exists = 'Такого адреса электронной почты не существует'
const error_message_validation_email = 'Неправильный email адрес'
const error_message_reset_password = 'Не удалось сбросить пароль'
const success_message_reset = 'Письмо отправлено. Проверьте Ваш почтовый ящик'

let email = ref('')
let messages = ref([])

const validateEmail = () => {
    messages.value = []
    if (/^[^@]+@\w+(\.\w+)+\w$/.test(email.value)) {
        return true;
    }
    messages.value.push({
        text: error_message_validation_email,
        type: 'error'
    })
}

const resetPassword = async () => {
    if (validateEmail()) {
        try {
            await resetPasswordAPI(email.value)
            messages.value.push({
                text: success_message_reset,
                type: 'success'
            })
        }
        catch (e) {
            try {
                if (e.response.status === 400) {
                    messages.value.push({
                        text: error_message_email_not_exists,
                        type: 'error'
                    })
                }
            }
            catch {
                messages.value.push({
                    text: error_message_reset_password,
                    type: 'error'
                })
            }

        }
    }
}

</script>