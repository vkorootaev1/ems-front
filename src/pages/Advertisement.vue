<template>
    <div class="container">
        <div class="row justify-content-center pt-4">
            <div class="col-lg-8 col-md-10 col-12" style="max-width: 900px;">
                <div class="create-advertisement-btn text-center" v-if="$userStore.isTeacher()">
                    <input type="submit" @click="router.push({ name: 'advertisement_create' })" value="Создать объявление"
                        class="form__btn w-100">
                </div>
                <div v-if="!advertisements.length" class="my-2 huge-card" style="text-align: center;">
                    <h5>Объявлений не найдено</h5>
                </div>
                <div class="advertisement huge-card" v-for="advertisement in advertisements" :key="advertisement">
                    <i class="bi bi-pencil-square" v-if="$userStore.isTeacher()"
                        @click="router.push({ name: 'advertisement_update', params: { 'adv_id': advertisement.id } })"></i>
                    <div class="advertisement-body" v-html="advertisement.body">
                    </div>
                    <div class="advertisement-files" v-if="advertisement.files.length">
                        <h5>Прикрепленные файлы</h5>
                        <div class="advertisement-file" v-for="file in advertisement.files" :key="file">
                            <a :href="file.file" :download="file.origin_name"><font-awesome-icon
                                    icon="fa-solid fa-file-arrow-down" class="font-awesome-icon" /></a> <span
                                :title="file.origin_name">
                                {{ truncateFilename(file.origin_name, 15) }}
                            </span>
                        </div>
                    </div>
                    <div class="advertisement__footer">
                        {{ reductionFIO(advertisement.user) }} [{{ dateTimeFormat(advertisement.date_add) }}]
                    </div>
                </div>
            </div>
        </div>
    </div>
    <InfiniteComponent :page="page" :hasNextPage="hasNextPage" @incrementPage="page++;" @loadAPI="getAdvertisement">
    </InfiniteComponent>
</template>
<script setup>
import { getAdvertisementAPI } from '@/api/study'
import { ref, inject, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { reductionFIO } from '@/services/user_services'
import { dateTimeFormat } from '@/services/datetime_services'
import { truncateFilename } from '@/services/files_services'
import InfiniteComponent from '@/components/InfiniteComponent.vue';

const $notificationStore = inject('$notificationStore')
const $userStore = inject('$userStore')

const router = useRouter()
const route = useRoute()

const error_message_adv = 'Не удалось загрузить объявления'

let advertisements = ref([])
let page = ref(1)
let hasNextPage = ref(false)

onMounted(() => {
    getAdvertisement()
})

const getAdvertisement = async () => {
    try {
        hasNextPage.value = false
        const params = getAdvertisementParams()
        const response = await getAdvertisementAPI(params)
        advertisements.value.push(...response.data.results)
        router.replace({ name: route.name, query: { ...route.query, page: page.value } })
        if (response.data.next) {
            hasNextPage.value = true;
        }
    }
    catch {
        $notificationStore.addError(error_message_adv)
    }
}

const getAdvertisementParams = () => {
    let params = { page: page.value }
    return params
}
</script>

<style scoped lang="scss">
.advertisement__footer {
    margin-top: 10px;
    text-align: right;
}

.advertisement {
    margin-bottom: 10px;

    & i {
        float: right;
        margin-right: 6px;
        margin-top: 4px;
        font-size: 15px;
        -webkit-text-stroke: 1px;
    }
}

.create-advertisement-btn {
    margin-top: 0px !important;
    margin-bottom: 15px !important;
}

.advertisement-files,
.advertisement-body {
    min-height: 100px;
    border: 2px solid #eeeeee;
    border-radius: 10px;
}

.advertisement-body {
    padding: 17px 10px 10px 10px;
}

.advertisement-files {
    margin-top: 5px;
    padding: 10px;
}
</style>