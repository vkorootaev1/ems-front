<template>
    <div class="container editor-container">
        <div class="row">
            <div class="col-lg-8 col-12">
                <div class="editor">
                    <editor :init="editor_init" v-model="editor_body" />
                </div>
            </div>
            <div class="col-lg-4 col-12 mt-2 mt-md-0 mb-2 mb-md-0">
                <div class="editor-panel">
                    <div class="search-group">
                        <v-autocomplete label="Учебная группа" v-model="selected_study_groups" rounded="lg" chips
                            variant="outlined" hide-details="true" type="text" v-debounce:400="getStudyGroup"
                            v-model:search="search_study_group" :items="study_groups" item-title="name" item-value="id"
                            return-object multiple no-data-text="Учебные группы не найдены"
                            placeholder="Введите учебную группу" clearable>
                        </v-autocomplete>
                    </div>
                    <div class="file-input">
                        <v-file-input clearable label="Выбор файлов" Multiple v-model="files_input" variant="outlined"
                            rounded="lg" @change="uploadFiles" @click:clear="clearFiles" hide-details>
                            <template v-slot:selection="">
                                {{ files.length }}
                                <span v-if="files.length === 1">файл</span>
                                <span v-else>файла(ов)</span>
                                <span> к загрузке</span>
                            </template>
                        </v-file-input>
                    </div>
                    <div class="selected-files">
                        <h5>Файлы к загрузке</h5>
                        <div class="no-filed-select message-error" v-if="files.length === 0">
                            <span>Файлы не выбраны</span>
                        </div>
                        <div v-else class="selected-file" v-for="file in files " :key="file"
                            :style="[list_of_ids_files_errors.includes(file.id) ? { 'color': 'red' } : { 'color': 'inherit' }]">
                            <span :title="file.file.name">
                                {{ truncateFilename(file.file.name, 5) }} ({{
                                    formatBytes(file.file.size,
                                        1) }})
                            </span> <i class="bi bi-x-lg" @click="removeFile(file)"></i>
                        </div>
                        <div class="errors">
                            <div class="message-error files-error" v-for=" file_error  in  files_errors " :key="file_error">
                                * {{ file_error }}
                            </div>
                        </div>
                    </div>
                    <div class="uploaded-files" v-if="uploaded_files.length">
                        <h5>Загруженные файлы</h5>
                        <div class="" v-for="uploaded_file in uploaded_files" :key="uploaded_file">
                            <a :href="uploaded_file.file" :download="uploaded_file.origin_name"><font-awesome-icon
                                    icon="fa-solid fa-file-arrow-down" class="font-awesome-icon" /></a> <span
                                :title="uploaded_file.origin_name">
                                {{ truncateFilename(uploaded_file.origin_name, 10) }}
                            </span> <i class="bi bi-x-lg" @click="deleteAdvertisementFile(uploaded_file)"></i>
                        </div>
                    </div>
                    <div class="advertisement-btns">
                        <div class="btn-save">
                            <input type="submit" value="Сохранить" @click="saveAdvertisement" class="form__btn w-100">
                        </div>
                        <div class="btn-delete">
                            <input v-if="route.name === 'advertisement_update'" type="submit" value="Удалить"
                                @click="deleteAdvertisement" class="form__btn w-100 error__btn">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  

<script setup>
import {
    getStudyGroupAPI, createAdvertisementAPI, getAdvertisementAPI,
    deleteAdvertisementFileAPI, updateAdvertisementAPI, deleteAdvertisementAPI
} from '@/api/study'
import { generateUID } from "@/services/other_services";
import { ref, inject, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import 'tinymce/tinymce'
import 'tinymce/icons/default/icons'
import 'tinymce/themes/silver/theme'
import 'tinymce/models/dom/model'
import 'tinymce/skins/ui/oxide/skin.css'
import "../../public/langs/ru"
import contentUiCss from 'tinymce/skins/ui/oxide/content.css';
import Editor from '@tinymce/tinymce-vue'
import { truncateFilename, formatBytes } from '@/services/files_services'

const $notificationStore = inject('$notificationStore')

const router = useRouter()
const route = useRoute()

const editor_init = {
    selector: 'textarea',
    height: 600,
    resize: false,
    skin: false,
    content_css: false,
    content_style: contentUiCss.toString(),
    language: 'ru',
    branding: false,
    promotion: false,
    statusbar: false,
    mobile: {
        menubar: true
    }
}

const message_error_studygroup = 'Не удалось загрузить учебные группы'
const message_error_create_adv = 'Не удалось создать объявление'
const message_error_update_adv = 'Не удалось обновить объявление'
const message_error_adv = 'Не удалось загрузить объявление'
const message_error_selected_study_groups_empty = 'Вы не выбрали ни одной группы'
const message_error_editor_body_empty = 'Кажется, вы забыли написать текст объявления...'
const message_error_files = 'Проверьте загружаемые файлы'
const message_error_delete_file = 'Не удалось удалить файл'
const message_error_delete_adv = 'Не удалось удалить объявление'
const error_message_empty_file = 'Файл не может быть пустым'
const error_message_max_size_file = 'Размер файла не должен превышать 10 Мб'
const error_message_ext_file = 'Расширение файла не разрешено. Допустимые расширения: .pdf, .doc, .docx, .jpg, .png, .xlsx, .xls, .pptx, .txt, .csv, .md'

const message_success_create_adv = 'Объявление успешно создано'
const message_success_update_adv = 'Объявление успешно обновлено'
const message_success_delete_file = 'Файл успешно удален'
const message_success_delete_adv = 'Объявление успешно удалено'

const permitted_extension = ['pdf', 'doc', 'docx', 'jpg', 'png', 'xlsx', 'xls', 'pptx', 'txt', 'csv', 'md', 'ppt']
let is_errors = false
let advertisement_id = null

let editor_body = ref("")
let study_groups = ref([])
let search_study_group = ref("")
let selected_study_groups = ref([])
let files = ref([])
let files_input = ref([])
let files_errors = ref([])
let list_of_ids_files_errors = ref([])
let uploaded_files = ref([])

onMounted(() => {
    if (route.name === 'advertisement_update') {
        getAdvertisement()
    }
})

const getStudyGroup = async () => {
    if (search_study_group.value) {
        try {
            const params = getStudyGroupParams()
            const response = await getStudyGroupAPI(params)
            study_groups.value = response.data
        }
        catch {
            $notificationStore.addError(message_error_studygroup)
        }
    }
}

const getAdvertisement = async () => {
    try {
        const params = {}
        const response = await getAdvertisementAPI(params, route.params.adv_id)
        setAdvertisementData(response.data)
    }
    catch {
        $notificationStore.addError(message_error_adv)
    }
}

const createAdvertisement = async () => {
    if (validate()) {
        try {
            const form_data = createFormData()
            const response = await createAdvertisementAPI(form_data)
            $notificationStore.addSuccess(message_success_create_adv)
            setAdvertisementData(response.data)
            router.push({ name: 'advertisement_update', params: { adv_id: response.data.id } })
        }
        catch {
            $notificationStore.addError(message_error_create_adv)
        }
    }
}

const deleteAdvertisementFile = async (file) => {
    try {
        await deleteAdvertisementFileAPI(file.id)
        uploaded_files.value = uploaded_files.value.filter((obj) => obj.id !== file.id)
        $notificationStore.addSuccess(message_success_delete_file + `: ${file.origin_name}`)
    }
    catch {
        $notificationStore.addError(message_error_delete_file + `: ${file.origin_name}`)
    }
}

const updateAdvertisement = async () => {
    if (validate()) {
        try {
            const form_data = createFormData()
            const response = await updateAdvertisementAPI(form_data, route.params.adv_id)
            clearFiles()
            setAdvertisementData(response.data)
            $notificationStore.addSuccess(message_success_update_adv)
        }
        catch {
            $notificationStore.addError(message_error_update_adv)
        }
    }
}

const deleteAdvertisement = async () => {
    try {
        await deleteAdvertisementAPI(route.params.adv_id)
        $notificationStore.addSuccess(message_success_delete_adv)
        router.push({ name: 'teacher_advertisement' })
    }
    catch {
        $notificationStore.addError(message_error_delete_adv)
    }
}

const saveAdvertisement = () => {
    route.name === 'advertisement_create' ? createAdvertisement() : updateAdvertisement()
}

const createFormData = () => {
    let form_data = new FormData()

    form_data.append('body', editor_body.value)

    selected_study_groups.value.forEach((group) => {
        form_data.append('groups_write', group.id)
    })

    files.value.forEach((obj) => {
        form_data.append('files_upload', obj.file)
    });

    return form_data
}

const setAdvertisementData = (data) => {
    clearFiles()
    editor_body.value = data.body
    selected_study_groups.value = data.groups
    uploaded_files.value = data.files
}

const uploadFiles = () => {
    files_input.value.forEach((file) => {
        files.value.push({ id: generateUID(), file: file })
    })
    validateFiles()
}

const clearFiles = () => {
    files_input.value = []
    files.value = []
    files_errors.value = []
    list_of_ids_files_errors = []
}

const removeFile = (file) => {
    files.value = files.value.filter(obj => obj.id !== file.id)
    files_input.value = files_input.value.filter(obj => obj.name !== file.file.name)
    list_of_ids_files_errors.value = list_of_ids_files_errors.value.filter(obj => obj.id !== file.id)
    validateFiles()
}

const validate = () => {
    is_errors = false
    if (!selected_study_groups.value.length) {
        is_errors = true
        $notificationStore.addError(message_error_selected_study_groups_empty)
    }
    if (!editor_body.value) {
        is_errors = true
        $notificationStore.addError(message_error_editor_body_empty)
    }
    if (files_errors.value.length) {
        is_errors = true
        $notificationStore.addError(message_error_files)
    }
    if (is_errors) {
        return false
    }
    return true
}

const validateFiles = () => {
    files_errors.value = []
    let is_empty_error = false
    let is_max_size_error = false
    let is_ext_error = false
    files.value.forEach((obj) => {
        if (obj.file.size < 1) {
            list_of_ids_files_errors.value.push(obj.id)
            if (!is_empty_error) {
                is_empty_error = true
                files_errors.value.push(error_message_empty_file)
            }
        }
        if (obj.file.size > 10485760) {
            list_of_ids_files_errors.value.push(obj.id)
            if (!is_max_size_error) {
                is_max_size_error = true
                files_errors.value.push(error_message_max_size_file)
            }
        }
        if (!permitted_extension.includes(obj.file.name.split(/\.(?=[^[\].]+$)/)[1])) {
            list_of_ids_files_errors.value.push(obj.id)
            if (!is_ext_error) {
                is_ext_error = true
                files_errors.value.push(error_message_ext_file)
            }
            list_of_ids_files_errors.value.push(obj.id)
        }
    })
}

const getStudyGroupParams = () => {
    let params = { name: search_study_group.value }
    return params
}
</script>

<style lang="scss" scoped>
.editor-container {
    margin-top: 1em;
}

.files-error,
.no-filed-select {
    font-size: 0.8em;
}

.editor-panel {
    border: 2px solid #eeeeee;
    height: 100%;
    min-height: 500px;
    border-radius: 10px;
    position: relative;
}

.uploaded-files,
.selected-files {
    text-align: center;

    & i {
        font-size: 12px;
        -webkit-text-stroke: 1px;
    }
}

.uploaded-files,
.selected-files,
.file-input,
.advertisement-btns,
.selected-groups,
.search-group {
    padding: 7px;
}

.advertisement-btns {
    width: 100%;
    position: absolute;
    bottom: 0;
}

.btn-delete,
.btn-save {
    margin-top: 5px;
}
</style>