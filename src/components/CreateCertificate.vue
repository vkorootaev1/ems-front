<template>
    <div class="custom-modal-wrap" @mousedown="$emit('close')">
        <div class="row align-items-center justify-content-center mx-2 mt-5">
            <div class="col-lg-6 col-md-8 col-12 custom-modal-body" @mousedown.stop="">
                <h4>Заказ справки</h4>
                <v-select class="mt-4" label="Тип справки" v-model="selected_type" :items="certificate_types"
                    variant="outlined" rounded="lg" return-object item-value="id" item-title="name" hide-details="true">
                </v-select>
                <v-select class="mt-4" label="Количество" v-model="selected_count" :items="count" variant="outlined"
                    rounded="lg" return-object item-value="id" item-title="count" hide-details="true">
                </v-select>
                <div class="row justify-content-center modal-btns">
                    <div class="col">
                        <input type="submit" @click="createCertificate" value="Заказать" class="form__btn w-100">
                    </div>
                    <div class="col">
                        <input type="submit" value="Закрыть" class="form__btn w-100" @click="$emit('close')">
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
import { ref, inject, onMounted, defineEmits } from 'vue';
import { getCertificatesTypeAPI } from '@/api/study'

const $notificationStore = inject('$notificationStore')

const emit = defineEmits(['create_certificate', 'close'])

const error_message_certificatetype = 'Не удалось получить виды справок'

const count = [{ id: 1, count: 1 }, { id: 2, count: 2 }, { id: 3, count: 3 }]

let messages = ref([])
let certificate_types = ref([])
let selected_type = ref(null)
let selected_count = ref({ id: 1, count: 1 })

onMounted(() => {
    getCertificatesType()
})

const getCertificatesType = async () => {
    try {
        const response = await getCertificatesTypeAPI()
        certificate_types.value = response.data
        selected_type.value = certificate_types.value[0]
    }
    catch {
        $notificationStore.addError(error_message_certificatetype)
    }
}

const createCertificate = () => {
    emit('create_certificate', selected_type.value, selected_count.value)
    emit('close')
}

</script>
<style scoped lang="scss"></style>