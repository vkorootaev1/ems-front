<template>
    <Navbar v-if="isHideForAuth()"></Navbar>
    <RouterView></RouterView>
    <MobileNavbar v-if="isHideForAuth()"></MobileNavbar>
</template>

<script>
import { inject } from 'vue'
import Navbar from '@/components/Navbar.vue';
import MobileNavbar from './MobileNavbar.vue';
import { useRoute } from 'vue-router';
export default {
    components: {
        Navbar, MobileNavbar
    },
    async setup() {
        const isAuthUser = localStorage.getItem('Token')

        const route = useRoute()

        const $store = inject('$userStore')

        if (isAuthUser) {
            await $store.getCurrentUser()
        }

        const isHideForAuth = () => {
            if (route.meta.hideForAuth) {
                return false
            }
            return true
        }

        return { isHideForAuth }
    }
}
</script>