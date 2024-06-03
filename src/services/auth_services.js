// Функции, связанные с аутентификацией

// Функция удаления аутентификационной информации из локального хранилища браузера
export const clearAuth = () => {
  localStorage.removeItem("Token");
  localStorage.removeItem("Student");
  localStorage.removeItem("Role");
};
