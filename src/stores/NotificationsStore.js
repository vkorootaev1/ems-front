import { defineStore } from "pinia";
import { ref } from "vue";
import { generateUID } from "@/services/other_services";

// Глобальное хранилище уведомлений

export const useNotificationStore = defineStore("notification", () => {
  const notifications = ref([]);

  const removeTimeout = (notification) => {
    setTimeout(() => {
      remove(notification);
    }, 4000);
  };

  const addSuccess = (text) => {
    const notification = {
      id: generateUID(),
      text: text,
      type: "success",
    };
    notifications.value.push(notification);
    removeTimeout(notification);
  };

  const addError = (text) => {
    const notification = {
      id: generateUID(),
      text: text,
      type: "error",
    };
    notifications.value.push(notification);
    removeTimeout(notification);
  };

  const remove = (notification) => {
    notifications.value = notifications.value.filter(
      (item) => item.id != notification.id
    );
  };

  const clear = () => {
    notifications.value = [];
  };

  return { notifications, addSuccess, addError, remove, clear };
});
