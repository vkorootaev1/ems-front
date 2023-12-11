import { axios } from "@/api/interceptors";

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

export const currentUserAPI = () => {
  return axios({
    method: "GET",
    url: "user/current/",
  });
};

export const userProfilesAPI = () => {
  return axios({
    method: "GET",
    url: "user/details/",
  });
};

export const logoutAPI = () => {
  return axios({
    method: "POST",
    url: "auth/logout/",
  });
};

export const logoutAllAPI = () => {
  return axios({
    method: "POST",
    url: "auth/logoutall/",
  });
};

export const resetUsernameAPI = (email) => {
  return axios({
    method: "POST",
    url: "auth/users/reset_username/",
    data: {
      email: email,
    },
  });
};

export const resetPasswordAPI = (email) => {
  return axios({
    method: "POST",
    url: "auth/users/reset_password/",
    data: {
      email: email,
    },
  });
};

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

export const changeEmailAPI = (email) => {
  return axios({
    method: "PATCH",
    url: "user/set_email/",
    data: {
      email: email,
    },
  });
};

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
