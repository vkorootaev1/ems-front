import { axios } from "@/api/interceptors";

export const getTimeTableAPI = (params, pair_id = null) => {
  let url = !pair_id ? 'study/timetable/' : `study/timetable/${pair_id}`
  return axios({
    method: "GET",
    url: url,
    params: params,
  });
};

export const getStudyPlanAPI = () => {
  return axios({
    method: "GET",
    url: "study/studyplan/",
  });
};

export const getControlMeasureScoreAPI = (params) => {
  return axios({
    method: "GET",
    url: "study/score/trim/",
    params: params,
  });
};

export const getResultScoreAPI = (params) => {
  return axios({
    method: "GET",
    url: "study/score/result/",
    params: params,
  });
};

export const getStudentCurrentTrimesterAPI = () => {
  return axios({
    method: "GET",
    url: "study/trimester/student/",
  });
};

export const getStudyGroupsCoursesAPI = (params) => {
  return axios({
    method: "GET",
    url: "study/teacher/groups/",
    params: params,
  });
};

export const multipleUpdateControlMeasureScoreAPI = (data, params) => {
  return axios({
    method: "PUT",
    url: "study/score/trim/multiple_update/",
    data: data,
    params: params
  });
};

export const multipleUpdateResultScoreAPI = (params) => {
  return axios({
    method: "PUT",
    url: "study/score/result/set_scores/",
    params: params
  });
};

export const getTrimesterAPI = () => {
  return axios({
    method: "GET",
    url: "study/trimester/",
  });
};

export const getTeacherAPI = (params, teacher_id = null) => {
  let url = !teacher_id ? 'user/teacher/' : `user/teacher/${teacher_id}`
  return axios({
    method: "GET",
    url: url,
    params: params,
  });
};

export const getCertificatesAPI = (params) => {
  return axios({
    method: "GET",
    url: `certificate/`,
    params: params,
  });
};

export const getCertificatesTypeAPI = () => {
  return axios({
    method: "GET",
    url: `certificate/type/`,
  });
};

export const createCertificateAPI = (data) => {
  return axios({
    method: "POST",
    url: `certificate/`,
    data: data
  });
};

export const updateCertificateAPI = (certificate_id) => {
  return axios({
    method: "PATCH",
    url: `certificate/${certificate_id}/`,
    data: {
      status_write: "ca",
    },
  });
};

export const getStudyGroupAPI = (params) => {
  return axios({
    method: "GET",
    url: `study/studygroup/`,
    params: params,
  });
};

export const getAdvertisementAPI = (params, advertisement_id = null) => {
  let url = !advertisement_id ? 'advertisement/' : `advertisement/${advertisement_id}`
  return axios({
    method: "GET",
    url: url,
    params: params,
  });
};

export const createAdvertisementAPI = (data) => {
  return axios({
    method: "POST",
    url: `advertisement/`,
    data: data,
  });
};

export const deleteAdvertisementFileAPI = (file_id) => {
  return axios({
    method: "DELETE",
    url: `advertisement/files/${file_id}`,
  });
};

export const updateAdvertisementAPI = (data, advertisement_id) => {
  return axios({
    method: "PUT",
    url: `advertisement/${advertisement_id}/`,
    data: data,
  });
};

export const deleteAdvertisementAPI = (advertisement_id) => {
  return axios({
    method: "DELETE",
    url: `advertisement/${advertisement_id}/`,
  });
};

export const getContactAPI = () => {
  let params = { own: true };
  return axios({
    method: "GET",
    url: `user/contacts/`,
    params: params,
  });
};

export const getContactTypeAPI = () => {
  return axios({
    method: "GET",
    url: `user/contacts/type/`,
  });
};

export const updateContactAPI = (data, contact_id) => {
  return axios({
    method: "PATCH",
    url: `user/contacts/${contact_id}/`,
    data: data,
  });
};

export const deleteContactAPI = (contact_id) => {
  return axios({
    method: "DELETE",
    url: `user/contacts/${contact_id}/`,
  });
};

export const createContactAPI = (data) => {
  return axios({
    method: "POST",
    url: `user/contacts/`,
    data: data
  })
}

export const getAttendanceAPI = (params) => {
  return axios({
    method: "GET",
    url: `study/attendance/`,
    params: params
  })
}

export const getPassedStudentTrimesterAPI = () => {
  return axios({
    method: "GET",
    url: `study/trimester/student/passed/`,
  })
}

export const multipleUpdateAttendanceAPI = (params, data) => {
  return axios({
    method: "PUT",
    url: "study/attendance/multiple_update/",
    params: params,
    data: data
  });
};