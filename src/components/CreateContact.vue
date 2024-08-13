<template>
    <div class="custom-modal-wrap" @mousedown="$emit('close')">
        <div class="row align-items-center justify-content-center mx-2 mt-5">
            <div class="col-lg-6 col-md-8 col-12 custom-modal-body" @mousedown.stop="">
                <h4>Создание контакта</h4>
                <div class="contact-type my-2">
                    <v-select class="mt-4" label="Тип контакта" v-model="selected_contact_type" :items="props.contacts_type"
                        variant="outlined" rounded="lg" return-object item-value="id" hide-details="true">
                        <template v-slot:item="{ item: { raw }, props: { onClick } }">
                            <v-list-item :class="{ 'v-list-item--active': selected_contact_type.id === raw.id }"
                                @click="onClick">
                                <span>
                                    <ContactTypeIcon :contact_type="raw.type" />&nbsp;{{ raw.type }}
                                </span></v-list-item>
                        </template>
                        <template v-slot:selection="{ item: { raw } }">
                            <span>
                                <ContactTypeIcon :contact_type="raw.type" />&nbsp;{{ raw.type }}
                            </span>
                        </template>
                    </v-select>
                </div>
                <div class="contact-ref my-2">
                    <v-text-field label="Контакт" v-model="contact_ref" rounded="lg" variant="outlined"
                        hide-details="true"></v-text-field>
                </div>
                <div class="row justify-content-center modal-btns">
                    <div class="col">
                        <input type="submit" @click="createContact" value="Создать" class="form__btn w-100">
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
import ContactTypeIcon from "@/components/ContactTypeIcon.vue"
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps(['contacts_type'])
const emit = defineEmits(['createContact', 'close'])

const error_message_empty_ref = 'Введите ссылку контакта'

let selected_contact_type = ref(props.contacts_type[0])
let contact_ref = ref("")
let messages = ref([])

const validation = () => {
    messages.value = []
    if (!contact_ref.value) {
        messages.value.push({
            text: error_message_empty_ref,
            type: 'error'
        })
    }
    if (messages.value.length) {
        return false
    }
    return true
}

const createContact = () => {
    if (validation()) {
        emit('createContact', selected_contact_type.value, contact_ref.value)
        emit('close')
    }
}

</script>
<style scoped lang="scss"></style>