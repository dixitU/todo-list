import client from '../utils/client';

type SignupOption = {
  name: string;
  email: string;
  password: string;
}

export async function login(email: string, password: string) {
  const {data} = await client.post<any>('/v1/auth/login', {
    email: email,
    password: password
  });
  return data.data;
}

export async function signup(options: SignupOption) {
  const {data} = await client.post<any>(
    '/v1/auth/signup',
    options,
  );
  return data.data;
}

export async function getAccessToken(token: string) {
  const payload = {
    refreshToken: token,
  };
  const {data} = await client.post<any>(
    '/v1/generateAccess',
    payload,
  );
  console.log('getAccessToken', data.data);
  return data.data;
}
