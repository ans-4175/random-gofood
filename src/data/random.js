const axios = require('axios');
const RandomGoFood = require('../libs/RandomGoFood');

const getFakeData = async () => {
  const resp = await axios('https://jsonplaceholder.typicode.com/todos/1');

  return resp.data;
};

const getMerchants = async (lat, long) => {
  const food = new RandomGoFood(lat, long);
  return await food.fastestMerchants();
};

const getMerchantDetail = async (id) => {
  const detail = await RandomGoFood.detailMerchants(id);
  return detail;
};

module.exports = {
  getFakeData,
  getMerchantDetail,
  getMerchants
};
