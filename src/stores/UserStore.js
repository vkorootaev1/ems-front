import { defineStore } from "pinia";
import { currentUserAPI, logoutAPI, logoutAllAPI } from "@/api/auth";
import { ref } from "vue";
import { clearAuth } from "@/services/auth_services";
import { router } from "@/router";
import { useNotificationStore } from "./NotificationsStore";
import { reductionFIO } from "@/services/user_services";

// Глобальное хранилище информации пользователя

export const useUserStore = defineStore("user", () => {
  const notificationStore = useNotificationStore();

  const user = ref(null);

  const error_message_profile = 'Не удалось загрузить текущий профиль'
  const success_message_logout = 'Вы вышли из профиля'
  const succes_message_logout_all = 'Вы вышли из всех профилей'

  const getCurrentUser = async () => {
    try {
      const response = await currentUserAPI();
      user.value = response.data;
    } catch (e) {
      notificationStore.addError(error_message_profile);
    }
  };

  const setUserEmail = (email) => {
    user.value.email = email;
  };

  const logout = async () => {
    try {
      await logoutAPI();
      user.value = null;
    } catch (e) {
      console.log(e);
    }
    clearAuth();
    notificationStore.addSuccess(success_message_logout)
    router.push({ name: "login" });
  };

  const logoutAll = async () => {
    try {
      await logoutAllAPI();
      user.value = null;
    } catch (e) {
      console.log(e);
    }
    clearAuth();
    notificationStore.addSuccess(succes_message_logout_all)
    router.push({ name: "login" });
  };

  const getUserRole = () => {
    if (user.value) {
      return user.value.role;
    }
    return null;
  };

  const isStudent = () => {
    if (user.value && user.value.role === "student") {
      return true;
    } else {
      return false;
    }
  };

  const isTeacher = () => {
    if (user.value && user.value.role === "teacher") {
      return true;
    } else {
      return false;
    }
  };

  const userShow = () => {
    if (user.value) {
      if (isStudent()) {
        return `${reductionFIO(user.value.user)} (${user.value.study_group.name
          })`;
      } else if (isTeacher()) {
        return `${reductionFIO(user.value.user)} (преподаватель)`;
      } else {
        return "Неизвестный пользователь";
      }
    } else {
      return "Неизвестный пользователь";
    }
  };

  return {
    user,
    getCurrentUser,
    getUserRole,
    logout,
    logoutAll,
    setUserEmail,
    isStudent,
    isTeacher,
    userShow,
  };
});
