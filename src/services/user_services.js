
// Функции, связанные с пользователями

// Функция получения краткой формы ФИО
export const reductionFIO = (user) => {
  return `${user.last_name} ${user.first_name.substring(
    0,
    1
  )}. ${user.patronymic.substring(0, 1)}.`;
};
