import axios from 'axios';

const BASE_API = 'https://random-gofood-api.vercel.app';

const fetchRandom = async (lat, long, type) => {
  const config = {
    method: 'get',
    url: `${BASE_API}/random`,
    params: {
      lat,
      long
    }
  };
  if (type !== 'ALL') config.params['type'] = type;
  const res = await axios(config);
  return res.data;
};

const fetchDetail = async (id) => {
  const config = {
    method: 'get',
    url: `${BASE_API}/merchant/${id}`
  };
  const res = await axios(config);
  return res.data;
};

export { fetchRandom, fetchDetail };
