require('dotenv').config();

import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { getAxiosConfig } from './helpers/get-axios-config'; // testUserId,
import { ProfileEditable } from '../../generated/types/profileEditable';
import { signIn, getIdToken, auth } from './helpers/firebase';

const validClientProfileData: Readonly<ProfileEditable> = {
  name: 'Liou Jia Hao',
  dob: '19930929',
  gender: 'male',
};

let config: AxiosRequestConfig;
beforeEach(async () => {
  jest.setTimeout(10000);
  await signIn();
  const token = await getIdToken();
  expect(typeof token === 'string').toBe(true);
  if (!token) return;
  config = getAxiosConfig(token);
});

describe('profileCreate', () => {
  it('post empty data should return 400', async () => {
    await axios
      .post('profiles', {}, config)
      .catch((error: Error | AxiosError) => {
        expect(axios.isAxiosError(error)).toBe(true);
        if (axios.isAxiosError(error)) {
          console.log(error.message);
          expect(error.response?.status).toBe(400);
        }
      });
  });

  it('post wrong gender should return 400', async () => {
    await axios
      .post(
        'profiles',
        {
          ...validClientProfileData,
          gender: 'apple',
        },
        config,
      )
      .catch((error: Error | AxiosError) => {
        expect(axios.isAxiosError(error)).toBe(true);
        if (axios.isAxiosError(error)) {
          expect(error.response?.status).toBe(400);
        }
      });
  });

  it('post valid data should return 200', async () => {
    const res = await axios
      .post('profiles', validClientProfileData, config)
      .catch((err) => {
        console.log(err);
      });
    expect(res?.data).not.toBe(undefined);
    if (!res?.data) return;
    expect(res.data.dob).toBe(validClientProfileData.dob);
    expect(res.data.name).toBe(validClientProfileData.name);
    expect(res.data.gender).toBe(validClientProfileData.gender);
  });
});

describe('profileGet', () => {
  it('should return Object', async () => {
    expect(auth.currentUser?.uid).not.toBe(undefined);
    if (auth.currentUser?.uid === undefined) return;
    const response = await axios.get(
      `profiles/${auth.currentUser?.uid}`,
      config,
    );
    expect(response.data).toBeInstanceOf(Object);
  });
});

describe('profilesGet', () => {
  it('should return Array', async () => {
    const response = await axios.get('profiles', config);
    expect(response.data).toBeInstanceOf(Array);
  });
});

describe('profileUpdate', () => {
  it('edit gender should return updated data', async () => {
    expect(auth.currentUser?.uid).not.toBe(undefined);
    if (auth.currentUser?.uid === undefined) return;
    const response = await axios.put(
      `profiles/${auth.currentUser?.uid}`,
      {
        gender: 'female',
      },
      config,
    );
    expect(response.data.gender).toBe('female');
  });
});

describe('profileRemove', () => {
  it('delete success should return 200', async () => {
    expect(auth.currentUser?.uid).not.toBe(undefined);
    if (auth.currentUser?.uid === undefined) return;
    const response = await axios.delete(
      `profiles/${auth.currentUser?.uid}`,
      config,
    );
    expect(response.status).toBe(200);
  });
});

describe('profileGet', () => {
  it('should return 404', async () => {
    expect(auth.currentUser?.uid).not.toBe(undefined);
    if (auth.currentUser?.uid === undefined) return;
    const response = await axios.get(
      `profiles/${auth.currentUser?.uid}`,
      config,
    );
    expect(response.status).toBe(404);
  });
});
