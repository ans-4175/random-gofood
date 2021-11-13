import axios from 'axios';

const BASE_API = './api'; // TODO: env

const fetchRandom = async () => {
  const res = await axios(`${BASE_API}/random`);
  return res.data;
};

export { fetchRandom };
