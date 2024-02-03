<template>
    <Transition>
        <create-contact v-if="is_create_contact_modal" @close="is_create_contact_modal = false"
            :contacts_type="contacts_type" @createContact="_createContact"></create-contact>
    </Transition>
    <div class="container">
        <div class="row justify-content-center pt-4">
            <div class="col-lg-12 col-12" style="max-width: 900px;">
                <div class="create-contact-btn text-center">
                    <input type="submit" @click="is_create_contact_modal = true" value="Создать контакт"
                        class="form__btn w-100">
                </div>
                <div v-if="!contacts.length" class="my-2 huge-card" style="text-align: center;">
                    <h5>Контактов не найдено</h5>
                </div>
                <div class="contact huge-card" v-for="contact in contacts" :key="contact">
                    <div class="row">
                        <div class="col-lg-4 col-12 contact-type">
                            <v-select class="mt-4" label="Тип контакта" v-model="contact.type" :items="contacts_type"
                                variant="outlined" rounded="lg" return-object item-value="id" hide-details="true">
                                <template v-slot:item="{ item: { raw }, props: { onClick } }">
                                    <v-list-item :class="{ 'v-list-item--active': contact.type.id === raw.id }"
                                        @click="onClick"> <span>
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
                        <div class="col-lg-4 col-12 contact-ref">
                            <v-text-field label="Контакт" v-model="contact.contact_ref" rounded="lg" variant="outlined"
                                hide-details="true"></v-text-field>
                        </div>
                        <div class="col-lg-4 col-12 contact-btns align-items-center">
                            <div class="row">
                                <div class="col">
                                    <input type="submit" value="Сохранить" class="form__btn w-100"
                                        @click="updateContact(contact)">
                                </div>
                                <div class="col">
                                    <input type="submit" value="Удалить" class="error__btn w-100"
                                        @click="deleteContact(contact.id)">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getContactAPI, getContactTypeAPI, updateContactAPI, deleteContactAPI, createContactAPI } from '@/api/study'
import { ref, inject, onMounted } from 'vue'
import ContactTypeIcon from "@/components/ContactTypeIcon.vue"
import CreateContact from '@/components/CreateContact.vue';

const $notificationStore = inject('$notificationStore')

const error_message_contact = 'Не удалось загрузить контакты'
const error_message_contact_type = 'Не удалось загрузить контакты'
const error_message_contact_update = 'Не удалось обновить контакт'
const error_message_contact_delete = 'Не удалось удалить контакт'
const error_message_contact_create = 'Не удалось создать контакт'

const message_success_contact_update = 'Контакт успешно обновлен'
const message_success_contact_delete = 'Контакт успешно удален'
const message_success_contact_create = 'Контакт успешно создан'

let contacts = ref([])
let contacts_type = ref([])
let is_create_contact_modal = ref(false)

onMounted(() => {
    getContactType()
    getContact()
})

const getContact = async () => {
    try {
        const response = await getContactAPI()
        contacts.value = response.data
    }
    catch {
        $notificationStore.addError(error_message_contact)
    }
}

const getContactType = async () => {
    try {
        const response = await getContactTypeAPI()
        contacts_type.value = response.data
    }
    catch {
        $notificationStore.addError(error_message_contact_type)
    }
}

const updateContact = async (contact) => {
    try {
        const data = createUpdateContactData(contact.type, contact.contact_ref)
        const response = await updateContactAPI(data, contact.id)
        $notificationStore.addSuccess(message_success_contact_update)
    }
    catch {
        $notificationStore.addError(error_message_contact_update)
    }
}

const deleteContact = async (id) => {
    try {
        await deleteContactAPI(id)
        contacts.value = contacts.value.filter((obj) => obj.id !== id)
        $notificationStore.addSuccess(message_success_contact_delete)
    }
    catch {
        $notificationStore.addError(error_message_contact_delete)
    }
}

const _createContact = async (contact_type, contact_ref) => {
    try {
        const data = createUpdateContactData(contact_type, contact_ref)
        const response = await createContactAPI(data)
        contacts.value.unshift(response.data)
        $notificationStore.addSuccess(message_success_contact_create)
    }
    catch {
        $notificationStore.addError(error_message_contact_create)
    }
}

const createUpdateContactData = (contact_type, contact_ref) => {
    let data = {
        type_id: contact_type.id,
        contact_ref: contact_ref
    }
    return data
}
</script>
<style lang="scss" scoped>
.contact {
    margin-bottom: 10px;
    padding-top: 0px !important;
}

.contact-btns,
.contact-ref {
    margin-top: 15px;
}

.create-contact-btn {
    margin-top: 0px !important;
    margin-bottom: 15px !important;
}
</style>