<template>
    <div class="custom-modal-wrap" @mousedown="$emit('close')">
        <div class="row align-items-center justify-content-center mx-2 mt-5">
            <div class="col-lg-6 col-md-8 col-12 custom-modal-body" @mousedown.stop="">
                <h4>Изменение пароля</h4>
                <input type="password" v-model="new_password" @keyup.enter="changePassword()" placeholder="Новый пароль"
                    class="form__input">
                <input type="password" v-model="re_new_password" @keyup.enter="changePassword()"
                    placeholder="Повторите новый пароль" class="form__input">
                <input type="password" v-model="current_password" @keyup.enter="changePassword()"
                    placeholder="Текущий пароль" class="form__input">
                <div class="row justify-content-center modal-btns">
                    <div class="col">
                        <input type="submit" @click="changePassword()" value="Изменить" class="form__btn w-100">
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
import { changePasswordAPI } from '@/api/auth'

const error_message_empty_new_password = 'Введите новый пароль'
const error_message_empty_re_new_password = 'Повторите введенный пароль'
const error_message_empty_current_password = 'Введите текущий пароль'
const error_message_password_not_compare = 'Введенные пароль не совпадают'
const error_message_change_password = 'Не удалось изменить пароль'
const success_message_change = 'Пароль успешно изменен'

let new_password = ref('')
let re_new_password = ref('')
let current_password = ref('')
let messages = ref([])

const validate = () => {
    messages.value = []
    if (!new_password.value) {
        messages.value.push({
            text: error_message_empty_new_password,
            type: 'error'
        })
    }
    if (!re_new_password.value) {
        messages.value.push({
            text: error_message_empty_re_new_password,
            type: 'error'
        })
    }
    if (!(re_new_password.value === new_password.value)) {
        messages.value.push({
            text: error_message_password_not_compare,
            type: 'error'
        })
    }
    if (!current_password.value) {
        messages.value.push({
            text: error_message_empty_current_password,
            type: 'error'
        })
    }
    if (messages.value.length) {
        return false
    }
    return true
}

const changePassword = async () => {
    if (validate()) {
        try {
            await changePasswordAPI(new_password.value, re_new_password.value, current_password.value)
            messages.value.push({
                text: success_message_change,
                type: 'success'
            })
        }
        catch {
            messages.value.push({
                text: error_message_change_password,
                type: 'error'
            })
        }
    }
}
</script>