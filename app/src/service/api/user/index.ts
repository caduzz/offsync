import { User } from '@/service/models/user';
import { axios } from '../axios';

async function getUser(): Promise<User> {
  const { data } = await axios.get('/user');
  return data;
}

const user = { getUser };

export default user;