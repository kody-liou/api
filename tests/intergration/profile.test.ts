require('dotenv').config();

import axios, { AxiosError } from 'axios';
import { testUserId } from './lib/constants';
import { config } from './lib/axios';
import { ProfileEditable } from '../../generated/types/profileEditable';

const validClientProfileData: Readonly<ProfileEditable> = {
  name: 'Liou Jia Hao',
  dob: '19930929',
  gender: 'male',
};

describe('profileCreate', () => {
  beforeEach(() => {
    jest.setTimeout(10000);
  });
  it('post empty data should return 400', async () => {
    await axios
      .post('profiles', {}, config)
      .catch((error: Error | AxiosError) => {
        expect(axios.isAxiosError(error)).toBe(true);
        if (axios.isAxiosError(error)) {
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
    const response = await axios.get(`profiles/${testUserId}`, config);
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
    const response = await axios.put(
      `profiles/${testUserId}`,
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
    const response = await axios.delete(`profiles/${testUserId}`, config);
    expect(response.status).toBe(200);
  });
});

describe('profileGet', () => {
  it('should return 404', async () => {
    const response = await axios.get(`profiles/${testUserId}`, config);
    expect(response.status).toBe(404);
  });
});
