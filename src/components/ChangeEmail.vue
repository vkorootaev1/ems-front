<template>
    <div class="custom-modal-wrap" @mousedown="$emit('close')">
        <div class="row align-items-center justify-content-center mx-2 mt-5">
            <div class="col-lg-6 col-md-8 col-12 custom-modal-body" @mousedown.stop="">
                <h4>Изменение email</h4>
                <input type="text" v-model="email" @keyup.enter="changeEmail()" placeholder="Email" class="form__input">
                <div class="row justify-content-center">
                    <div class="col">
                        <input type="submit" @click="changeEmail()" value="Изменить" class="form__btn w-100">
                    </div>
                    <div class="col">
                        <input type="submit" value="Закрыть" class="form__btn w-100" @click="$emit('close')">
                    </div>
                </div>
                <div v-if="errors.length" class="errors">
                    <div class="error" v-for="error in errors" :key="error">
                        * {{ error }}
                    </div>
                </div>
                <div v-if="messages.length" class="messages">
                    <div class="message" v-for="message in messages" :key="message">
                        {{ message }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, inject } from 'vue';
import { changeEmailAPI } from '@/api/auth'

const $store = inject('$userStore')

const error_message_validation_email = 'Неправильный email адрес'
const error_message_email_already_exists = 'Email адрес уже занят'
const error_message_email_change = 'Не удалось изменить email'
const success_message_change = 'Email успешно изменен'

let email = ref($store.user.user.email)

let errors = ref([])
let messages = ref([])

const validateEmail = () => {
    messages.value = []
    errors.value = []
    if (/^[^@]+@\w+(\.\w+)+\w$/.test(email.value)) {
        return true;
    }
    errors.value.push(error_message_validation_email)
}

const changeEmail = async () => {
    console.log('hello')
    if (validateEmail()) {
        try {
            await changeEmailAPI(email.value)
            messages.value.push(success_message_change)
            $store.setUserEmail(email.value)
        }
        catch (e) {
            try {
                if (Object.prototype.hasOwnProperty.call(e.response.data, 'email')) {
                    if (e.response.data.email[0] === 'This email already exists') {
                        errors.value.push(error_message_email_already_exists)
                    }
                }
            }
            catch {
                errors.value.push(error_message_email_change)
            }
        }
    }
}

</script>