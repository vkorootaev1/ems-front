<template>
    <div class="containter custom-modal-wrap" @mousedown="$emit('close')">
        <div class="row align-items-center justify-content-center mx-2 mt-5">
            <div class="col-lg-6 col-md-8 col-12 custom-modal-body" @mousedown.stop="">
                <h4>Изменение имени пользователя</h4>
                <input type=" text" v-model="new_username" @keyup.enter="changeUsername"
                    placeholder="Новое имя пользователя" class="form__input">
                <input type="password" v-model="current_password" @keyup.enter="changeUsername" placeholder="Текущий пароль"
                    class="form__input">
                <div class="row justify-content-center modal-btns">
                    <div class="col">
                        <input type="submit" @click="changeUsername" value="Изменить" class="form__btn w-100">
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
import { changeUsernameAPI } from '@/api/auth'

const error_message_empty_username = 'Введите имя пользователя'
const error_message_empty_current_password = 'Введите текущий пароль'
const error_message_already_exists_username = 'Имя пользователя уже занято'
const error_message_change_username = 'Не удалось изменить имя пользователя'
const success_message_change = 'Имя пользователя успешно изменено'

let new_username = ref('')
let current_password = ref('')
let messages = ref([])

const validate = () => {
    messages.value = []
    if (!new_username.value) {
        messages.value.push({
            text: error_message_empty_username,
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

const changeUsername = async () => {
    if (validate()) {
        try {
            await changeUsernameAPI(new_username.value, current_password.value)
            messages.value.push({
                text: success_message_change,
                type: 'success'
            })
        }
        catch (e) {
            try {
                if (Object.prototype.hasOwnProperty.call(e.response.data, 'new_username')) {
                    if (e.response.data.new_username[0] === 'Пользователь с таким именем уже существует.') {
                        messages.value.push({
                            text: error_message_already_exists_username,
                            type: 'error'
                        })
                    }
                }
                else {
                    messages.value.push({
                        text: error_message_change_username,
                        type: 'error'
                    })
                }
            }
            catch (e) {
                console.log(e)
            }
        }
    }
}
</script>