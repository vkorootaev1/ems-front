<template>
    <Transition>
        <create-certificate v-if="is_create_certificate_modal" @close="is_create_certificate_modal = false"
            @create_certificate="createNewCertificate"></create-certificate>
    </Transition>
    <div class="container">
        <div class="row justify-content-center pt-4">
            <div class="col-lg-6 col-md-8 col-12" style="max-width: 500px;">
                <div class="create-certificate-btn text-center">
                    <input type="submit" @click="is_create_certificate_modal = true" value="Заказать справку"
                        class="form__btn w-100">
                </div>
                <div v-if="!certificates.length" class="my-2 base-card" style="text-align: center;">
                    <h5>Контактов не найдено</h5>
                </div>
                <div class="certificate base-card" v-for="certificate in certificates" :key="certificate">
                    <i class="bi bi-x-lg" v-if="!['Отменена', 'Готова к выдаче', 'Выдана'].includes(certificate.status)"
                        @click="updateCertificate(certificate.id)"></i>
                    <div class="certificate-info">Тип: <span>{{ certificate.type }}</span></div>
                    <div class="certificate-info">Количество: <span>{{ certificate.count }}</span></div>
                    <div class="certificate-info">Статус: <span :class="{
                        'certificate-cancel': certificate.status === 'Отменена',
                        'certificate-ready': certificate.status === 'Готова к выдаче',
                        'certificate-preparing': ['Создана', 'В обработке'].includes(certificate.status)
                    }">{{
    certificate.status }}</span></div>
                    <div class="certificate-date_add">
                        {{ dateTimeFormat(certificate.date_add) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <InfiniteComponent :page="page" :hasNextPage="hasNextPage" @incrementPage="page++;" @loadAPI="getCertificate">
    </InfiniteComponent>
</template>
<script setup>
import { getCertificatesAPI, updateCertificateAPI, createCertificateAPI } from '@/api/study'
import { ref, onMounted, inject } from 'vue'
import { dateTimeFormat } from '@/services/datetime_services'
import InfiniteComponent from '@/components/InfiniteComponent.vue';
import { useRoute, useRouter } from 'vue-router'
import CreateCertificate from '@/components/CreateCertificate.vue';

const $notificationStore = inject('$notificationStore')

const router = useRouter()
const route = useRoute()

const error_message_certificate = 'Не удалось загрузить справки'
const error_message_certificate_delete = 'Не удалось отменить справку'
const success_message_certificate_delete = 'Справка успешно отменена'
const error_message_certificate_create = 'Не удалось заказать справку'
const success_message_certificate_create = 'Справка успешно оформлена'

let certificates = ref([])
let page = ref(1)
let hasNextPage = ref(false)
let is_create_certificate_modal = ref(false)

onMounted(() => {
    getCertificate()
})

const getCertificate = async () => {
    try {
        hasNextPage.value = false
        const params = getCertificateParams()
        const response = await getCertificatesAPI(params)
        certificates.value.push(...response.data.results)
        router.replace({ name: route.name, query: { ...route.query, page: page.value } })
        if (response.data.next) {
            hasNextPage.value = true;
        }
    }
    catch {
        $notificationStore.addError(error_message_certificate)
    }
}

const updateCertificate = async (certificate_id) => {
    try {
        const response = await updateCertificateAPI(certificate_id)
        $notificationStore.addSuccess(success_message_certificate_delete)
        let upd_obj = certificates.value.findIndex((obj => obj.id == certificate_id));
        certificates.value[upd_obj] = response.data
    }
    catch {
        $notificationStore.addError(error_message_certificate_delete)
    }
}

const createNewCertificate = async (certificate_type, certificate_count) => {
    try {
        const data = createCertificateData(certificate_type, certificate_count)
        const response = await createCertificateAPI(data)
        certificates.value.unshift(response.data)
        $notificationStore.addSuccess(success_message_certificate_create)
    }
    catch {
        $notificationStore.addError(error_message_certificate_create)
    }
}

const getCertificateParams = () => {
    let params = { page: page.value }
    return params
}

const createCertificateData = (certificate_type, certificate_count) => {
    let data = { type_id: certificate_type.id, count: certificate_count.count, status_write: "cr" }
    return data
}

</script>
<style lang="scss" scoped>
.certificate {
    margin-bottom: 10px;

    & i {
        float: right;
        margin-right: 5px;
        font-size: 15px;
        -webkit-text-stroke: 1px;
    }
}

.certificate-info {

    & span {
        font-weight: 600;
    }
}

.certificate-date_add {
    text-align: right;
}

.create-certificate-btn {
    margin-top: 0px !important;
    margin-bottom: 15px !important;
}
</style>