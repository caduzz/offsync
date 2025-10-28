import { CreateData, Data } from '@/service/models/data';
import { axios } from '../axios';

async function create({ title, description, latitude, longitude, region_id, files }: CreateData) {
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('latitude', String(latitude));
    formData.append('longitude', String(longitude));
    formData.append('region_id', region_id);
    formData.append('files', JSON.stringify(files));

    const { data } = await axios.post('/data', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return data;
  } catch (err: any) {  
    throw err;
  }
}

const data = { create };

export default data;