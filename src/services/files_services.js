
// Функции, связанные с файлами

// Функция обрезки имени файла
export const truncateFilename = (filename, truncate_number = 10) => {
  if (filename.length < truncate_number + 3) {
    return filename;
  }
  let split_filename = filename.split(/\.(?=[^[\].]+$)/);
  return (
    split_filename[0].substring(0, truncate_number) +
    "... ." +
    split_filename[1]
  );
};

// Функция отображения размера файла
export const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return "0Б";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Б", "КБ", "МБ", "ГБ"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
