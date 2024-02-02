import _ from 'lodash'

export const generateUID = () => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
};

export const diffArrayOfObjects = (arr1, arr2) => {
  return _.differenceWith(arr1, arr2, _.isEqual)
}

export const deepClone = (data) => {
  return _.cloneDeep(data)
}