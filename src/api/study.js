import { axios } from "@/api/interceptors";

export const getTimeTableAPI = (week, year, teacher_id) => {
  let params = {};
  params.week = week;
  params.year = year;
  if (teacher_id) {
    params.teacher_id = teacher_id;
  }
  return axios({
    method: "GET",
    url: "study/timetable/",
    params: params,
  });
};

export const getStudyPlanAPI = () => {
  return axios({
    method: "GET",
    url: "study/studyplan/",
  });
};

export const getControlMeasureScoreAPI = (
  trimester,
  study_group_id,
  studyplan_course_id
) => {
  let params = {};
  if (trimester) {
    params.trimester = trimester;
  }
  if (study_group_id) {
    params.study_group_id = study_group_id;
  }
  if (studyplan_course_id) {
    params.studyplan_course_id = studyplan_course_id;
  }
  return axios({
    method: "GET",
    url: "study/score/trim/",
    params: params,
  });
};

export const getResultScoreAPI = (study_group_id, studyplan_course_id) => {
  let params = {};
  if (study_group_id) {
    params.study_group_id = study_group_id;
  }
  if (studyplan_course_id) {
    params.studyplan_course_id = studyplan_course_id;
  }
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

export const getStudyGroupsCoursesAPI = (
  trimester,
  course_or_and_group_name
) => {
  let params = {};
  if (trimester !== null) {
    params.trimester = trimester;
  }
  if (course_or_and_group_name) {
    params.name = course_or_and_group_name;
  }
  return axios({
    method: "GET",
    url: "study/teacher/groups/",
    params: params,
  });
};

export const multipleUpdateControlMeasureScoreAPI = (
  scores,
  study_group_id,
  studyplan_course_id
) => {
  return axios({
    method: "PUT",
    url: "study/score/trim/multiple_update/",
    data: scores,
    params: {
      study_group_id: study_group_id,
      studyplan_course_id: studyplan_course_id,
    },
  });
};

export const multipleUpdateResultScoreAPI = (
  study_group_id,
  studyplan_course_id
) => {
  return axios({
    method: "PUT",
    url: "study/score/result/set_scores/",
    params: {
      study_group_id: study_group_id,
      studyplan_course_id: studyplan_course_id,
    },
  });
};

export const getTrimesterAPI = () => {
  return axios({
    method: "GET",
    url: "study/trimester/",
  });
};

export const getTeacherAPI = (page = null, name = null, id = null) => {
  let params = {};
  let teacher_id = "";
  if (page) {
    params.page = page;
  }
  if (name) {
    params.name = name;
  }
  if (id) {
    teacher_id = id;
  }
  return axios({
    method: "GET",
    url: `user/teacher/${teacher_id}`,
    params: params,
  });
};

export const getCertificatesAPI = (page) => {
  let params = {};
  if (page) {
    params.page = page;
  }
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

export const createCertificateAPI = (type_id, count) => {
  return axios({
    method: "POST",
    url: `certificate/`,
    data: {
      type_id: type_id,
      count: count,
      status_write: "cr",
    },
  });
};

export const updateCertificateAPI = (id) => {
  return axios({
    method: "PATCH",
    url: `certificate/${id}/`,
    data: {
      status_write: "ca",
    },
  });
};

export const getStudyGroupAPI = (name) => {
  let params = {};
  if (name) {
    params.name = name;
  }
  return axios({
    method: "GET",
    url: `study/studygroup/`,
    params: params,
  });
};

export const getAdvertisementAPI = (id = null, page = null) => {
  let adv_id = "";
  let params = {};
  if (page) {
    params.page = page;
  }
  if (id) {
    adv_id = id;
  }
  return axios({
    method: "GET",
    url: `advertisement/${adv_id}`,
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

export const deleteAdvertisementFileAPI = (id) => {
  return axios({
    method: "DELETE",
    url: `advertisement/files/${id}`,
  });
};

export const updateAdvertisementAPI = (id, data) => {
  return axios({
    method: "PUT",
    url: `advertisement/${id}/`,
    data: data,
  });
};

export const deleteAdvertisementAPI = (id) => {
  return axios({
    method: "DELETE",
    url: `advertisement/${id}/`,
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

export const getContactTypeAPI = (id = null, page = null) => {
  return axios({
    method: "GET",
    url: `user/contacts/type/`,
  });
};

export const updateContactAPI = (id, data) => {
  return axios({
    method: "PATCH",
    url: `user/contacts/${id}/`,
    data: data,
  });
};

export const deleteContactAPI = (id) => {
  return axios({
    method: "DELETE",
    url: `user/contacts/${id}/`,
  });
};
