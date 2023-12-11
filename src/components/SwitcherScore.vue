<template>
    <div class="container-fluid">
        <div class="row d-md-none">
            <div class="col">
                <div class="switcher" :class="{ 'active_switcher': route.name === 'result_score' }"
                    @click="route.name === 'result_score' ? '' : router.push({ name: 'result_score' })">
                    <span>Итоговые</span>
                </div>
            </div>
            <div class="col">
                <div class="switcher" :class="{ 'active_switcher': route.name === 'trimester_score' }"
                    @click="route.name === 'trimester_score' ? '' : router.push({ name: 'trimester_score' })">
                    <span>Промежуточные</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()
</script>

<style lang="scss" scoped>
.switcher {
    transition: all .5s ease;
    border-radius: 30px;
    color: $main-color;
    font-weight: 600;
    background-color: #fff;
    border: 1px solid $main-color;
    margin-top: 0.5em;
    margin-bottom: 1em;
    padding: 6px;
    text-align: center;
    cursor: pointer;

    &.active_switcher {
        background-color: $main-color;
        color: white;
        font-weight: 700;
    }
}
</style>