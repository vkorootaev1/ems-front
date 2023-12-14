<template>
    qwe
</template>


<script setup>
import { inject, ref } from 'vue';

const $store = inject('$notificationStore')

$store.addSuccess('Привет')
$store.addSuccess('Пока')

setTimeout(() => {
    $store.addError('Я')
}, 5000)

</script>

