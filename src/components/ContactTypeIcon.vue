<template>
        <span v-if="props.contact_type === 'Telegram'">
                <font-awesome-icon icon="fa-brands fa-telegram" size="lg" style="color: #33a6e1;" /></span>
        <span v-else-if="props.contact_type === 'Email'"><font-awesome-icon icon="fa-solid fa-envelope" size="lg" /></span>
        <span v-else-if="props.contact_type === 'Viber'"><font-awesome-icon icon="fa-brands fa-viber" size="lg"
                        style="color: #7360f2;" /></span>
        <span v-else-if="props.contact_type === 'YouTube'"><font-awesome-icon icon="fa-brands fa-youtube" size="lg"
                        style="color: #ff0000;" /></span>
        <span v-else-if="props.contact_type === 'WhatsApp'"><font-awesome-icon icon="fa-brands fa-whatsapp" size="lg"
                        style="color: #3adc49;" /></span>
        <span v-else-if="props.contact_type === 'VK'"><font-awesome-icon icon="fa-brands fa-vk" size="lg"
                        style="color: #0078ff;" /></span>
        <span v-else>• </span>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps(['contact_type'])
</script>