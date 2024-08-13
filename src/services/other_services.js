import _ from 'lodash'

// Дополнительные функции

// Функция генерации уникального идентификатора
export const generateUID = () => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
};

// Функция сравнения двух объектов
export const diffArrayOfObjects = (arr1, arr2) => {
  return _.differenceWith(arr1, arr2, _.isEqual)
}

// Функция глубокого копирования
export const deepClone = (data) => {
  return _.cloneDeep(data)
}