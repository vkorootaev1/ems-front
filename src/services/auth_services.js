export const clearAuth = () => {
  localStorage.removeItem("Token");
  localStorage.removeItem("Student");
  localStorage.removeItem("Role");
};
