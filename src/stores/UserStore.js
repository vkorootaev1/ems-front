import { defineStore } from "pinia";
import { currentUserAPI, logoutAPI, logoutAllAPI } from "@/api/auth";
import { ref } from "vue";
import { clearAuth } from "@/services/auth_services";
import { useRouter } from "vue-router";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);

  const router = useRouter();

  const getCurrentUser = async () => {
    try {
      const response = await currentUserAPI();
      user.value = response.data;
    } catch (e) {
      console.log(e);
    }
  };

  const setUserEmail = (email) => {
    user.value.email = email;
  };

  const logout = async () => {
    try {
      const response = await logoutAPI();
      user.value = null;
    } catch (e) {
      console.log(e);
    }
    clearAuth();
    router.push({ name: "login" });
  };

  const logouAll = async () => {
    try {
      const response = await logoutAllAPI();
      user.value = null;
    } catch (e) {
      console.log(e);
    }
    clearAuth();
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

  return {
    user,
    getCurrentUser,
    getUserRole,
    logout,
    logouAll,
    setUserEmail,
    isStudent,
    isTeacher,
  };
});
