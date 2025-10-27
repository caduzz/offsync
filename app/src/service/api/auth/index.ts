import { AuthResponse } from '@/service/models/auth';
import { axios } from '../axios';

type SignInParams = {
  email: string;
  password: string;
};

async function logOut() {
  try {
    const { data } = await axios.post('/auth/logout');
    return data;
  } catch (err: any) {
    throw err;
  }
}

async function signIn({ email, password }: SignInParams) {
  try {
    const { data } = await axios.post('/auth/local/signin', { email, password });
    return data;
  } catch (err: any) {
    throw err;
  }
}

async function refresh(refresh_token: string): Promise<AuthResponse> {
    try {
     const { data } = await axios.post('/auth/refresh', {}, {
      headers: {
        "Authorization": `Bearer ${refresh_token}`
      }
    });

    return data
  } catch (err: any) {
    throw err;
  }

}

const auth = { signIn, logOut, refresh };

export default auth;