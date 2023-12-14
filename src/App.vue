<template>
  <div class="vl-parent">
    <loading v-model:active="$store.is_loading" :loader="'dots'" :color="'#008080'" :background-color="'#00000066'" />
  </div>
  <Suspense>
    <AsyncApp></AsyncApp>
  </Suspense>
</template>

<script setup>
import { inject } from 'vue';
import Loading from 'vue-loading-overlay';
import AsyncApp from './components/AsyncApp.vue';

const $store = inject('$loadingStore')

</script>

<style lang="scss">
.form__input {
  width: 100%;
  border: 0px solid transparent;
  border-radius: 0;
  border-bottom: 1px solid black;
  padding: 1em .5em .5em;
  outline: none;
  margin: 0.5em auto;
  transition: all .5s ease;
}

.form__btn {
  border: none;
  transition: all .5s ease;
  height: 50px;
  border-radius: 30px;
  color: white !important;
  background-color: $main-color;
  margin-top: 0.5em;
  margin-bottom: 1em;
  padding: 6px;
}

.form__btn:hover,
.form__btn:focus {
  background-color: $main-color-hover;
  color: #fff;
}


.base-card,
.huge-card {
  padding: 20px 20px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-radius: 10px;
}

.base-card {
  max-width: 500px !important;
}

.huge-card {
  max-width: 900px !important;
}

.reset-link {
  color: $main-color;
  font-weight: 700;
  cursor: pointer;
}

.custom-modal-wrap {
  position: fixed;
  z-index: 2;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}

.custom-modal-body {
  transition: opacity 1s ease;
  padding: 15px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-radius: 10px;
  background-color: #fefefe;
  max-width: 500px !important;
}

.success,
.score-false,
.student-score,
.message,
.error {
  font-weight: 900;
}

.success,
.student-score,
.message {
  color: $main-color;
}

.score-false,
.error {
  color: #ff2400;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}


.modal-info-body {
  text-align: center;
  padding: 10px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-radius: 10px;
  position: absolute;
  z-index: 10;
  width: 200px;
  background-color: #fefefe;
  overflow: hidden;
  height: 0;
  right: 0;
  opacity: 0;
  transition: height 0ms 200ms, opacity 0ms 0ms;
}

.modal-info-wrap {
  position: relative;
}

.modal-info-icon {
  -webkit-text-stroke: 0.8px;
  cursor: pointer;

  &:hover+.modal-info-body {
    height: auto;
    opacity: 1;
    transition: height 0ms 0ms, opacity 600ms 0ms;
  }
}

.font-awesome-icon,
i {
  color: black;
  transition: 0.2s;
  cursor: pointer;

  &:hover {
    color: $main-color;
  }
}

.notifications-wrap-sticky {
  width: 100%;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 10;
}

.notifications-wrap {
  width: 100%;
  position: absolute;
}
</style>

