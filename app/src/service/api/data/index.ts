import { CreateData, Data } from '@/service/models/data';
import { axios } from '../axios';

async function create({ title, description, latitude, longitude, region_id, files }: CreateData) {
  try {
    const { data } = await axios.post('/data', {
      title,
      description,
      latitude,
      longitude,
      region_id,
      files
    });
    return data;
  } catch (err: any) {  
    throw err;
  }
}

const data = { create };

export default data;