import { axios } from "@/api/interceptors";

// Запросы к API, связанные с учебным процессом

export const getTimeTableAPI = (params, pair_id = null) => {
  let url = !pair_id ? "study/timetable/" : `study/timetable/${pair_id}`;
  return axios({
    method: "GET",
    url: url,
    params: params,
  });
};

// Отправка HTTP-запроса к конечной точке API для получения учебного плана студента
export const getStudyPlanAPI = () => {
  return axios({
    method: "GET",
    url: "study/studyplan/",
  });
};

// Отправка запроса к конечной точке API для получения промежуточных оценок студента
export const getControlMeasureScoreAPI = (params) => {
  return axios({
    method: "GET",
    url: "study/score/trim/",
    params: params,
  });
};

// Отправка запроса к конечной точке API для получения итоговых оценок студента
export const getResultScoreAPI = (params) => {
  return axios({
    method: "GET",
    url: "study/score/result/",
    params: params,
  });
};

// Отправка запроса к конечной точке API для получения текущего триместра
export const getStudentCurrentTrimesterAPI = () => {
  return axios({
    method: "GET",
    url: "study/trimester/student/",
  });
};

// Отправка запроса к конечной точке API для получения курсов, групп, у которых ведет преподаватель
export const getStudyGroupsCoursesAPI = (params) => {
  return axios({
    method: "GET",
    url: "study/teacher/groups/",
    params: params,
  });
};

// Отправка запроса к конечной точке API для изменения промежуточных оценок студента
export const multipleUpdateControlMeasureScoreAPI = (data, params) => {
  return axios({
    method: "PUT",
    url: "study/score/trim/multiple_update/",
    data: data,
    params: params,
  });
};

// Отправка запроса к конечной точке API для изменения итоговых оценок студента по дисциплинам
export const setResultScoreDisciplineAPI = (params) => {
  return axios({
    method: "PUT",
    url: "study/score/result/set_scores_discipline/",
    params: params,
  });
};

// Отправка запроса к конечной точке API для изменения оценок студента по физ.культуре, практикам и т.д.
export const setResultScoreOtherAPI = (data, params) => {
  return axios({
    method: "PUT",
    url: "study/score/result/set_scores_other/",
    params: params,
    data: data,
  });
};

// Отправка запроса к конечной точке API для получения триместров
export const getTrimesterAPI = () => {
  return axios({
    method: "GET",
    url: "study/trimester/",
  });
};

// Отправка запроса к конечной точке API для получения информации о всех преподавателях, конкретном преподавателе
export const getTeacherAPI = (params, teacher_id = null) => {
  let url = !teacher_id ? "user/teacher/" : `user/teacher/${teacher_id}`;
  return axios({
    method: "GET",
    url: url,
    params: params,
  });
};

// Отправка запроса к конечной точке API для получения справок студента
export const getCertificatesAPI = (params) => {
  return axios({
    method: "GET",
    url: `certificate/`,
    params: params,
  });
};

// Отправка запроса к конечной точке API для получения типов справок
export const getCertificatesTypeAPI = () => {
  return axios({
    method: "GET",
    url: `certificate/type/`,
  });
};

// Отправка запроса к конечной точке API для создания справки
export const createCertificateAPI = (data) => {
  return axios({
    method: "POST",
    url: `certificate/`,
    data: data,
  });
};

// Отправка запроса к конечной точке API для отмены справки
export const updateCertificateAPI = (certificate_id) => {
  return axios({
    method: "PATCH",
    url: `certificate/${certificate_id}/`,
    data: {
      status_write: "ca",
    },
  });
};

// Отправка запроса к конечной точке API для получения учебных групп
export const getStudyGroupAPI = (params) => {
  return axios({
    method: "GET",
    url: `study/studygroup/`,
    params: params,
  });
};

// Отправка запроса к конечной точке API для получения объявлений от преподавателей
export const getAdvertisementAPI = (params, advertisement_id = null) => {
  let url = !advertisement_id
    ? "advertisement/"
    : `advertisement/${advertisement_id}`;
  return axios({
    method: "GET",
    url: url,
    params: params,
  });
};

// Отправка запроса к конечной точке API для создания объявлений студентам
export const createAdvertisementAPI = (data) => {
  return axios({
    method: "POST",
    url: `advertisement/`,
    data: data,
  });
};

// Отправка запроса к конечной точке API для удаления файла объявления
export const deleteAdvertisementFileAPI = (file_id) => {
  return axios({
    method: "DELETE",
    url: `advertisement/files/${file_id}`,
  });
};

// Отправка запроса к конечной точке API для изменения объявления
export const updateAdvertisementAPI = (data, advertisement_id) => {
  return axios({
    method: "PUT",
    url: `advertisement/${advertisement_id}/`,
    data: data,
  });
};

// Отправка запроса к конечной точке API для удаления объявления
export const deleteAdvertisementAPI = (advertisement_id) => {
  return axios({
    method: "DELETE",
    url: `advertisement/${advertisement_id}/`,
  });
};

// Отправка запроса к конечной точке API для получения контактной информации преподавателя
export const getContactAPI = () => {
  let params = { own: true };
  return axios({
    method: "GET",
    url: `user/contacts/`,
    params: params,
  });
};

// Отправка запроса к конечной точке API для получения типов контактной информации
export const getContactTypeAPI = () => {
  return axios({
    method: "GET",
    url: `user/contacts/type/`,
  });
};

// Отправка запроса к конечной точке API для обновления контактной информации
export const updateContactAPI = (data, contact_id) => {
  return axios({
    method: "PATCH",
    url: `user/contacts/${contact_id}/`,
    data: data,
  });
};

// Отправка запроса к конечной точке API для удаления контактной информации
export const deleteContactAPI = (contact_id) => {
  return axios({
    method: "DELETE",
    url: `user/contacts/${contact_id}/`,
  });
};

// Отправка запроса к конечной точке API для создания контактной информации
export const createContactAPI = (data) => {
  return axios({
    method: "POST",
    url: `user/contacts/`,
    data: data,
  });
};

// Отправка запроса к конечной точке API для получения посещаемости студентов
export const getAttendanceAPI = (params) => {
  return axios({
    method: "GET",
    url: `study/attendance/`,
    params: params,
  });
};

// Отправка запроса к конечной точке API для получения прошедших триместров студента
export const getPassedStudentTrimesterAPI = () => {
  return axios({
    method: "GET",
    url: `study/trimester/student/passed/`,
  });
};

// Отправка запроса к конечной точке API для изменения посещаемости студентов
export const multipleUpdateAttendanceAPI = (params, data) => {
  return axios({
    method: "PUT",
    url: "study/attendance/multiple_update/",
    params: params,
    data: data,
  });
};
