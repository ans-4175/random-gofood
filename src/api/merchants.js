import axios from 'axios';

const BASE_API = './api'; // TODO: env

const fetchRandom = async (lat, long) => {
  const config = {
    method: 'get',
    url: `${BASE_API}/random`,
    params: {
        lat,
        long,
    }
  };
  const res = await axios(config);
  return res.data;
};

export { fetchRandom };
