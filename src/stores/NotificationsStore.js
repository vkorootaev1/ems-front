import { defineStore } from "pinia";
import { ref } from "vue";

export const useNotificationStore = defineStore("notification", () => {
  const notifications = ref([]);

  const removeTimeout = (notification) => {
    setTimeout(() => {
      remove(notification);
    }, 5000);
  };

  const addSuccess = (text) => {
    const notification = {
      id: Date.now(),
      text: text,
      type: "success",
    };
    notifications.value.push(notification);
    removeTimeout(notification);
  };

  const addError = (text) => {
    const notification = {
      id: Date.now(),
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
