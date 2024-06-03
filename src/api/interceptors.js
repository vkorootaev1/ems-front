import _axios from "axios";
import { router } from "@/router";
import { useLoadingStore } from "@/stores/LoadingStore";
import { clearAuth } from "@/services/auth_services";

// Интерцепторы Axios

const API_URL = process.env.VUE_APP_API_BASE_URL;
export const axios = _axios.create({
  baseURL: API_URL,
});

axios.interceptors.request.use(
  (config) => {
    const $store = useLoadingStore();
    $store.incrementStartRequest();
    $store.startLoading();
    let token = localStorage.getItem("Token");
    let student = localStorage.getItem("Student");
    if (token) {
      config.headers["Authorization"] = `Token ${token}`;
    }
    if (student) {
      config.headers["Student"] = student;
    }
    return config;
  },
  (error) => {
    const $store = useLoadingStore();
    $store.incrementEndRequest();
    $store.endLoading();
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (config) => {
    const $store = useLoadingStore();
    $store.incrementEndRequest();
    $store.endLoading();
    return config;
  },
  (error) => {
    const $store = useLoadingStore();
    $store.incrementEndRequest();
    $store.endLoading();
    if (error.response.status === 401) {
      clearAuth();
      router.push({ name: "login" });
    }
    return Promise.reject(error);
  }
);
