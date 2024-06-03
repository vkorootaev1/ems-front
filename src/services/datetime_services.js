import moment from "moment";
import "moment/locale/ru";
import { START_PAIRS } from '@/constants'

// Функции, связанные с форматами времени и датами

// Функция формата даты
export const dateFormat = (date) => {
  return moment(date).format("DD.MM.YYYY");
};

// Функция для сравнения двух дат
export const compareWithNowTimeTable = (date, index_pair) => {
  let _date = moment(`${date} ${START_PAIRS[index_pair]}`, 'YYYY-MM-DD k:mm')
  let _now = moment().utcOffset("+08:00")
  if (_now > _date) {
    return true
  }
  return false
}

// Функция получения текущей недели
export const getCurrentWeek = () => {
  return moment().isoWeek();
};

// Функция получения текущего года
export const getCurrentYear = () => {
  return moment().year();
};

// Функция получения количество недель в году
export const getCountOfWeeksInYear = (year) => {
  return moment({ day: 1, month: 1, year: year }).isoWeeksInYear();
};

// Функция формата даты
export const dateFormatTimeTable = (date) => {
  var dateString = moment(date).format("dddd, D MMMM");
  return dateString.charAt(0).toUpperCase() + dateString.slice(1);
};

// Функция формата даты
export const dateTimeFormat = (date) => {
  return moment(date).format("HH:mm DD.MM.YYYY");
};

// Функция формата даты
export const getYear = (date) => {
  return moment(date).format("YYYY");
};

// Функция получения дат в заданной недели и года
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
