<template>
    <div class="d-flex flex-row justify-content-center">
        <div class="pagination-item" :class="{ 'disabled-pagination': chosen_item == 1 }"
            @click="chosen_item > 1 ? changeItem(chosen_item - 1) : ''">
            <i class="bi bi-chevron-left"></i>
        </div>
        <div v-for="item in pagination_list" :key="item" @click="changeItem(item)" class="pagination-item"
            :class="{ 'active-pagination': item == chosen_item }">
            {{ item }}
        </div>
        <div class="pagination-item" :class="{ 'disabled-pagination': props.current_item == props.last_item }"
            @click="chosen_item < props.last_item ? changeItem(chosen_item + 1) : ''">
            <i class="bi bi-chevron-right"></i>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, onMounted, onBeforeUnmount, defineEmits, nextTick } from 'vue';
import { getPaginationList as _getPaginationList } from '@/services/pagination_services'

let props = defineProps(['current_item', 'last_item'])

const emit = defineEmits(['changeItem'])

let pagination_list = ref([])
let chosen_item = ref(props.current_item)
let width = ref(null)
let range_number = ref(null)

onMounted(() => {
    getPaginationList();
    nextTick(() => {
        window.addEventListener('resize', getPaginationList);
    })
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', getPaginationList);
})

const changeItem = (item) => {
    chosen_item.value = item
    emit('changeItem', item)
    getPaginationList()
}

const getRange = () => {
    width.value = document.documentElement.clientWidth
    if (width.value >= 992) {
        range_number.value = 4;
    }
    else if (width.value >= 768) {
        range_number.value = 3;
    }
    else {
        range_number.value = 2;
    }
}

const getPaginationList = () => {
    getRange()
    pagination_list.value = _getPaginationList(chosen_item.value, props.last_item, range_number.value)
}
</script>

<style lang="scss" scoped>
.pagination-item {
    transition: 0.3s;
    text-align: center;
    width: 2em;
    height: 2em;
    font-size: 19px;
    margin-right: 0.25em;
    margin-left: 0.25rem;
    padding: 4px 4px 4px 4px;
    border-radius: 50%;
    cursor: pointer;
    font-weight: 700;
    color: black;

    & i {
        color: black !important;
        -webkit-text-stroke: 2px;

        &:hover {
            color: white !important;
        }
    }

    &:not(.disabled-pagination):not(.active-pagination):hover {
        background-color: $main-color-hover;
        color: white !important;
    }

    &.active-pagination {
        background-color: $main-color;
        color: white
    }

    &.disabled-pagination {
        cursor: not-allowed;

        & i {
            -webkit-text-stroke: 1px grey;
            cursor: not-allowed;
        }
    }
}
</style>