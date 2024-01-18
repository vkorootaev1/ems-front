<script setup>
import { onMounted, onUnmounted, defineProps, defineEmits } from 'vue';

const emit = defineEmits(['incrementPage', 'loadAPI'])

const props = defineProps(['hasNextPage', 'page'])


onMounted(() => {
    window.addEventListener('scroll', handleScroll);
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
})

const handleScroll = () => {
    let currentScrollHeight = document.documentElement.scrollTop + window.innerHeight;
    let maxScrollHeightPosition = document.documentElement.scrollHeight
    if (currentScrollHeight > maxScrollHeightPosition - 100 && props.hasNextPage) {
        emit('incrementPage')
        emit('loadAPI')
    }
}
</script>