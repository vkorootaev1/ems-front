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

.error__btn,
.form__btn {
  border: none;
  transition: all .5s ease;
  height: 50px;
  border-radius: 30px;
  color: white !important;
  padding: 6px;
}

.form__btn {
  background-color: $main-color;
}

.error__btn {
  background-color: #b82b14;
}

.modal-btns {
  margin-top: 0.7em !important;
}

.form__btn:hover,
.form__btn:focus {
  background-color: $main-color-hover;
  color: #fff;
}

.error__btn:hover,
.error__btn:focus {
  background-color: #632920;
  color: #fff;
}

.other-card,
.profile-card,
.base-card,
.huge-card {
  padding: 10px 10px;
  border: 2px solid #eeeeee;
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
  z-index: 100;
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

.score-false,
.student-score,
.message-success,
.message-error {
  font-weight: 900;
}

.certificate-preparing {
  color: #E4D00A
}

.certificate-ready,
.student-score,
.message-success {
  color: $main-color;
}

.certificate-cancel,
.score-false,
.message-error {
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
  color: #989898;
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

.other-function,
.profile-function {
  padding: 15px;
  border-radius: 20px;
  background-color: $main-color;
  color: white;
  cursor: pointer;
  margin: 10px 0;
  text-align: center;
}


.student-score-fio,
.student-fio,
.student-attendance-fio {
  font-size: 1.2rem;
  padding: 10px;
  border-radius: 20px;
  border: 2px solid #eeeeee;
  height: 100%;
  display: flex;
  align-items: center;
}

.student-score-fio {
  justify-content: center;
}
</style>

