const axios = require('axios');

const getFakeData = async () => {
  const resp = await axios('https://jsonplaceholder.typicode.com/todos/1');

  return resp.data;
};

module.exports = {
  getFakeData
};
