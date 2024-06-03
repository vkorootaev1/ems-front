import { defineStore } from "pinia";
import { ref } from "vue";

// Глобальное хранилище индикации загрузки

export const useLoadingStore = defineStore("loading", () => {
  const is_loading = ref(false);
  const start_requests = ref(0);
  const end_requests = ref(0);

  const incrementStartRequest = () => {
    start_requests.value += 1;
  };

  const incrementEndRequest = () => {
    end_requests.value += 1;
  };

  const startLoading = () => {
    is_loading.value = true;
  };

  const endLoading = () => {
    if (start_requests.value === end_requests.value) {
      is_loading.value = false;
    }
  };

  return {
    is_loading,
    startLoading,
    endLoading,
    incrementStartRequest,
    incrementEndRequest,
  };
});
