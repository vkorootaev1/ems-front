<template>
    <div class="custom-modal-wrap" @mousedown="$emit('close')">
        <div class="row align-items-center justify-content-center mx-2 mt-5">
            <div class="col-lg-6 col-md-8 col-12 custom-modal-body" @mousedown.stop="">
                <h4>Изменение email</h4>
                <input type="text" v-model="email" @keyup.enter="changeEmail()" placeholder="Email" class="form__input">
                <div class="row justify-content-center modal-btns">
                    <div class="col">
                        <input type="submit" @click="changeEmail()" value="Изменить" class="form__btn w-100">
                    </div>
                    <div class="col">
                        <input type="submit" value="Закрыть" class="error__btn w-100" @click="$emit('close')">
                    </div>
                </div>
                <div v-if="messages.length">
                    <div v-for="message in messages" :key="message" :class="message.type === 'error' ? 'message-error' : 'message-success'">
                        * {{ message.text }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, inject } from 'vue';
import { changeEmailAPI } from '@/api/auth'

const $userStore = inject('$userStore')

const error_message_validation_email = 'Неправильный email адрес'
const error_message_email_already_exists = 'Email адрес уже занят'
const error_message_email_change = 'Не удалось изменить email'
const success_message_change = 'Email успешно изменен'

let email = ref($userStore.user.user.email)
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

const changeEmail = async () => {
    if (validateEmail()) {
        try {
            await changeEmailAPI(email.value)
            messages.value.push({
                text: success_message_change,
                type: 'success'
            })
            $userStore.setUserEmail(email.value)
        }
        catch (e) {
            try {
                if (Object.prototype.hasOwnProperty.call(e.response.data, 'email')) {
                    if (e.response.data.email[0] === 'This email already exists') {
                        messages.value.push({
                            text: error_message_email_already_exists,
                            type: 'error'
                        })
                    }
                }
            }
            catch {
                messages.value.push({
                    text: error_message_email_change,
                    type: 'error'
                })
            }
        }
    }
}

</script>