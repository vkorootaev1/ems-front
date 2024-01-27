import {
  getDaysByWeekYear,
  dateFormatTimeTable,
  getYear
} from "@/services/datetime_services";
import { TRIMESTER } from '@/constants'

const _ = require("lodash");

export const formatTimeTable = (timetable, week, year) => {
  const days_of_week = getDaysByWeekYear(week, year);

  let group_timetable = Object.groupBy(timetable, ({ date }) => date);

  let formated_timetable = [];
  let cnt_day = 0;

  for (const [date, pairs] of Object.entries(group_timetable)) {
    let pairs_by_date = [];
    while (!(date == days_of_week[cnt_day])) {
      formated_timetable.push({
        date: days_of_week[cnt_day],
        pairs: null,
      });
      cnt_day++;
    }
    cnt_day++;
    let cnt_pair = 1;
    for (const [, pair] of Object.entries(pairs)) {
      while (!(pair.index_pair === cnt_pair)) {
        pairs_by_date.push({
          index_pair: cnt_pair,
          course: null,
        });
        cnt_pair++;
      }
      pairs_by_date.push(pair);
      cnt_pair++;
    }
    formated_timetable.push({
      date: date,
      pairs: pairs_by_date,
    });
  }
  for (let i = cnt_day; i < 7; i++) {
    formated_timetable.push({
      date: days_of_week[i],
      pairs: null,
    });
  }
  return formated_timetable;
};

export const formatStudyPlan = (studyplan) => {
  let group_studyplan = Object.groupBy(studyplan, ({ trimester }) => trimester);
  let formated_studyplan = [];
  for (const [trimester, courses] of Object.entries(group_studyplan)) {
    formated_studyplan.push({ trimester: trimester, courses: courses });
  }
  return formated_studyplan;
};

export const formatControlMeasureScore = (scores) => {
  let group_scores = Object.groupBy(
    scores,
    ({ control_measure }) => control_measure.course.id
  );
  let formated_scores = [];
  for (const [course, scores] of Object.entries(group_scores)) {
    formated_scores.push({
      course: scores[0].control_measure.course,
      scores: scores,
    });
  }
  return formated_scores;
};

export const formatResultScore = (scores) => {
  let group_scores = Object.groupBy(scores, ({ course }) => course.trimester);
  let formated_scores = [];
  for (const [trimester, scores] of Object.entries(group_scores)) {
    formated_scores.push({
      trimester: scores[0].course.trimester,
      scores: scores,
    });
  }
  return formated_scores;
};

export const formatScoreTeacher = (scores) => {
  let group_scores = Object.groupBy(scores, ({ student }) => student.id);
  let formated_scores = [];
  for (const [student, scores] of Object.entries(group_scores)) {
    formated_scores.push({
      user: scores[0].student.user,
      scores: scores,
    });
  }
  return _.orderBy(formated_scores, "user.last_name");
};

export const reduceTypeOfPair = (type) => {
  const reduce = {
    "Лабораторная работа": "лаб",
    Лекция: "лек",
    Практика: "практ",
  };
  return reduce[type];
};

export const formatTrimester = (trimester) => {
  return `${TRIMESTER[trimester.trimester]} (${getYear(trimester.date_start)})`
}

export const formatAttendanceTeacher = (attendance) => {
  attendance.forEach(item => { item.status = item.status === null ? item.status = false : item.status })
  let group_attendance = Object.groupBy(attendance, ({ student }) => student.study_group.id);
  let formated_attendance = [];
  for (const [study_group, attendance] of Object.entries(group_attendance)) {
    formated_attendance.push({ study_group: attendance[0].student.study_group, attendance: attendance });
  }
  return formated_attendance;
}
