import { axios } from "@/api/interceptors";

export const getTimeTableAPI = (week, year) => {
  return axios({
    method: "GET",
    url: "study/timetable/",
    params: {
      week: week,
      year: year,
    },
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

export const getTeacherAPI = (page, name = null, id = null) => {
  let params = {};
  let teacher_id = "";
  params.page = page;
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
