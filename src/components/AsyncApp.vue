<template>
    <Navbar v-if="isHideForAuth()"></Navbar>
    <div class="notifications-wrap-sticky">
        <div class="notifications-wrap">
            <TransitionGroup>
                <Notification v-for="notification in $notificationStore.notifications" :key="notification"
                    :notification="notification" @removeNotification="removeNotification">
                </Notification>
            </TransitionGroup>
        </div>
    </div>
    <RouterView></RouterView>
    <MobileNavbar v-if="isHideForAuth()"></MobileNavbar>
</template>

<script>
import { inject } from 'vue'
import Navbar from '@/components/Navbar.vue';
import MobileNavbar from './MobileNavbar.vue';
import Notification from './Notification.vue';
import { useRoute } from 'vue-router';
export default {
    components: {
        Navbar, MobileNavbar, Notification
    },
    async setup() {
        const isAuthUser = localStorage.getItem('Token')

        const route = useRoute()

        const $userStore = inject('$userStore')
        const $notificationStore = inject('$notificationStore')

        if (isAuthUser) {
            await $userStore.getCurrentUser()
        }

        const isHideForAuth = () => {
            if (route.meta.hideForAuth || route.name === 'not_found') {
                return false
            }
            return true
        }

        const removeNotification = (notification) => {
            $notificationStore.remove(notification)
        }

        return { isHideForAuth, $notificationStore, removeNotification }
    }
}
</script>