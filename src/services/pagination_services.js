const _ = require("lodash");

// Функции, связанные с пагинацией

// Функция для подсчета вывода пагинации
export const getPaginationList = (current, last, range) => {
  current = Number(current);
  last = Number(last);
  range = Number(range);
  if (last < 2 * range + 1) {
    return _.range(1, last + 1);
  }
  if (_.range(1, range + 1).includes(current)) {
    return _.range(1, 2 * range + 2);
  }
  if (_.range(last - range, last + 1).includes(current)) {
    return _.range(last - 2 * range, last + 1);
  }
  return _.range(current - range, current + range + 1);
};
