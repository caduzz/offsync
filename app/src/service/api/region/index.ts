import { axios } from '../axios';
import { Region } from '@/service/models/region';

async function getAll(): Promise<Region | []>{
  try {
    const { data } = await axios.get('/region');
    return data;
  } catch (err: any) {
    return []
  }
}

const region = { getAll };

export default region;