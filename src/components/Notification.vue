<template>
    <div class="notification">
        <i class="bi bi-x-lg" @click="removeNotification"></i>
        <span :class="props.notification.type === 'success' ? 'message-success' : 'message-error'">{{ props.notification.text }}</span>
    </div>
</template>
<script setup>
import { defineProps, defineEmits } from 'vue';

const emit = defineEmits(['removeNotification'])

const props = defineProps({
    notification: Object,
})

const removeNotification = () => {
    emit('removeNotification', props.notification)
}

</script>

<style scoped>
.notification {
    vertical-align: middle;
    width: 95%;
    max-width: 500px;
    padding: 5px 5px 5px 10px;
    min-height: 65px;
    background-color: #f8f8fa;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    border-radius: 10px;
    margin: 3px auto;

    & i {
        float: right;
        margin-right: 5px;
        font-size: 15px;
        -webkit-text-stroke: 1px;
    }
}

@media (min-width: 768px) {
    .notification{
        margin-right: 10px;
    }
}
</style>