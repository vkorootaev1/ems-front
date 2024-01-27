import moment from "moment";
import "moment/locale/ru";
import { START_PAIRS } from '@/constants'

export const dateFormat = (date) => {
  return moment(date).format("DD.MM.YYYY");
};

export const compareWithNowTimeTable = (date, index_pair) => {
  let _date = moment(`${date} ${START_PAIRS[index_pair]}`, 'YYYY-MM-DD k:mm')
  let _now = moment().utcOffset("+08:00")
  if (_now > _date) {
    console.log('123')
    return true
  }
  console.log('456')
  return false
}

export const getCurrentWeek = () => {
  return moment().isoWeek();
};

export const getCurrentYear = () => {
  return moment().year();
};

export const getCountOfWeeksInYear = (year) => {
  return moment({ day: 1, month: 1, year: year }).isoWeeksInYear();
};

export const dateFormatTimeTable = (date) => {
  var dateString = moment(date).format("dddd, D MMMM");
  return dateString.charAt(0).toUpperCase() + dateString.slice(1);
};

export const dateTimeFormat = (date) => {
  return moment(date).format("HH:mm DD.MM.YYYY");
};

export const getYear = (date) => {
  return moment(date).format("YYYY");
};

export const getDaysByWeekYear = (week, year) => {
  const date_monday = moment()
    .year(year)
    .week(week)
    .startOf("isoweek")
    .format("YYYY-MM-DD");
  let days_by_week_and_year = [date_monday];
  for (let i = 1; i < 7; i++) {
    days_by_week_and_year.push(
      moment(date_monday).add(i, "days").format("YYYY-MM-DD")
    );
  }
  return days_by_week_and_year;
};
