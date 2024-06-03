import { axios } from "@/api/interceptors";

// Запросы к API, связанные с аутентификацией

 
// Отправка запроса к конечной точке API для идентификации и аутентификации в системе (вход) 
export const loginAPI = (username, password) => {
  return axios({
    method: "POST",
    url: "auth/login/",
    data: {
      username: username,
      password: password,
    },
  });
};


// Отправка запроса к конечной точке API для получения текущего пользователя
export const currentUserAPI = () => {
  return axios({
    method: "GET",
    url: "user/current/",
  });
};

// Отправка запроса к конечной точке API для получения профилей пользователей
export const userProfilesAPI = () => {
  return axios({
    method: "GET",
    url: "user/details/",
  });
};

// Отправка запроса к конечной точке API для выхода из системы
export const logoutAPI = () => {
  return axios({
    method: "POST",
    url: "auth/logout/",
  });
};

// Отправка запроса к конечной точке API для выхода из всех устройств пользователя
export const logoutAllAPI = () => {
  return axios({
    method: "POST",
    url: "auth/logoutall/",
  });
};

// Отправка запроса к конечной точке API для сброса имени пользователя
export const resetUsernameAPI = (email) => {
  return axios({
    method: "POST",
    url: "auth/users/reset_username/",
    data: {
      email: email,
    },
  });
};

// Отправка запроса к конечной точке API для сброса пароля
export const resetPasswordAPI = (email) => {
  return axios({
    method: "POST",
    url: "auth/users/reset_password/",
    data: {
      email: email,
    },
  });
};

// Отправка запроса к конечной точке API для изменения пароля
export const changePasswordAPI = (
  new_password,
  re_new_password,
  current_password
) => {
  return axios({
    method: "POST",
    url: "auth/users/set_password/",
    data: {
      new_password: new_password,
      re_new_password: re_new_password,
      current_password: current_password,
    },
  });
};

// Отправка запроса к конечной точке API для изменения имени пользователя
export const changeUsernameAPI = (new_username, current_password) => {
  return axios({
    method: "POST",
    url: "auth/users/set_username/",
    data: {
      new_username: new_username,
      current_password: current_password,
    },
  });
};

// Отправка запроса к конечной точке API для изменения электронной почты
export const changeEmailAPI = (email) => {
  return axios({
    method: "PATCH",
    url: "user/set_email/",
    data: {
      email: email,
    },
  });
};

// Отправка запроса к конечной точке API для подтверждения сброса пароля
export const resetPasswordConfirmAPI = (
  uid,
  token,
  new_password,
  re_new_password
) => {
  return axios({
    method: "POST",
    url: "auth/users/reset_password_confirm/",
    data: {
      uid: uid,
      token: token,
      new_password: new_password,
      re_new_password: re_new_password,
    },
  });
};

// Отправка запроса к конечной точке API для подтверждения сброса имени пользователя
export const resetUsernameConfirmAPI = (uid, token, new_username) => {
  return axios({
    method: "POST",
    url: "auth/users/reset_username_confirm/",
    data: {
      uid: uid,
      token: token,
      new_username: new_username,
    },
  });
};
