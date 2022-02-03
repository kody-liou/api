import dotenv from 'dotenv';

dotenv.config();
import axios, { AxiosError } from 'axios';
import { got } from 'got';
import { options, testUserId } from './lib/constants';
import axiosInstance from './lib/axios';
import { ProfileClientItem, Gender } from '../../interfaces';

const clientProfileData: Readonly<ProfileClientItem> = {
  name: 'Liou Jia Hao',
  age: 28,
  gender: Gender.male,
  isAgeDisplay: true,
  prefereGender: Gender.femaie,
};

describe('profileCreate', () => {
  it('post empty data should return 400', async () => {
    await axiosInstance
      .post('profiles', {})
      .catch((error: Error | AxiosError) => {
        expect(axios.isAxiosError(error)).toBe(true);
        if (axios.isAxiosError(error)) {
          expect(error.response?.status).toBe(400);
        }
      });
    await got('profiles', options).on('request', (request) => {
      console.log(request);
    });
  });

  it('post wrong gender should return 400', async () => {
    const response = await axiosInstance.post('profiles', {
      ...clientProfileData,
      gender: 'apple',
    });
    expect(response.status).toBe(400);
  });

  it('post valid data should return 200', async () => {
    const response = await axiosInstance.post('profiles', clientProfileData);
    expect(response.status).toBe(200);
  });
});

describe('profileGet', () => {
  it('should return Object', async () => {
    const response = await axiosInstance.get(`profiles/${testUserId}`, {});
    expect(response.data).toBeInstanceOf(Object);
  });
});

describe('profilesGet', () => {
  it('should return Array', async () => {
    const response = await axiosInstance.get('profiles');
    expect(response.data).toBeInstanceOf(Array);
  });
});

describe('profileUpdate', () => {
  it('edit gender should return 400 bad input', async () => {
    const response = await axiosInstance.put(`profiles/${testUserId}`, {
      gender: Gender.femaie,
    });
    expect(response.status).toBe(400);
  });

  it('edit gender should return 400 bad input', async () => {
    const response = await axiosInstance.put(`profiles/${testUserId}`, {
      gender: Gender.femaie,
    });
    expect(response.status).toBe(400);
  });
});

describe('profileRemove', () => {
  it('delete success should return 200', async () => {
    const response = await axiosInstance.delete(`profiles/${testUserId}`, {});
    expect(response.status).toBe(200);
  });
});

describe('profileGet', () => {
  it('should return 404', async () => {
    const response = await axiosInstance.get(`profiles/${testUserId}`, {});
    expect(response.status).toBe(404);
  });
});
