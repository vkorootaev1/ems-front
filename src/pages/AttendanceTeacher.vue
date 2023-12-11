<template>
    {{ current_item }}
    <div class="container">
        <div class="row justify-content-center my-5">
            <div class="col-4">
                <div style="height: 500px;"></div>
                <v-select label="Контрольное мероприятие" v-model="current_item" return-object :items="items"
                    variant="outlined" rounded="xl" item-title="last"></v-select>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const items = ref([
    {
        id: 1,
        name: "John",
        last: "Doe"
    },
    {
        id: 2,
        name: "Harry",
        last: "Potter"
    },
    {
        id: 3,
        name: "George",
        last: "Bush"
    }
])
const current_item = ref({
    name: "John",
    last: "Doe"
})
</script>

<style lang="scss"></style>