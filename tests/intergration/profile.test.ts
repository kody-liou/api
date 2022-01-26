require('dotenv').config();

import axios, { testUserId } from './lib/axios';
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
    const response = await axios.post('profiles', {});
    expect(response.status).toBe(400);
  });

  it('post wrong gender should return 400', async () => {
    const response = await axios.post('profiles', {
      ...clientProfileData,
      gender: 'apple',
    });
    expect(response.status).toBe(400);
  });

  it('post valid data should return 200', async () => {
    const response = await axios.post('profiles', clientProfileData);
    expect(response.status).toBe(200);
  });
});

describe('profileGet', () => {
  it('should return Object', async () => {
    const response = await axios.get(`profiles/${testUserId}`, {});
    expect(response.data).toBeInstanceOf(Object);
  });
});

describe('profilesGet', () => {
  it('should return Array', async () => {
    const response = await axios.get('profiles');
    expect(response.data).toBeInstanceOf(Array);
  });
});

describe('profileUpdate', () => {
  it('edit gender should return 400 bad input', async () => {
    const response = await axios.put(`profiles/${testUserId}`, {
      gender: Gender.femaie,
    });
    expect(response.status).toBe(400);
  });

  it('edit gender should return 400 bad input', async () => {
    const response = await axios.put(`profiles/${testUserId}`, {
      gender: Gender.femaie,
    });
    expect(response.status).toBe(400);
  });
});

describe('profileRemove', () => {
  it('delete success should return 200', async () => {
    const response = await axios.delete(`profiles/${testUserId}`, {});
    expect(response.status).toBe(200);
  });
});

describe('profileGet', () => {
  it('should return 404', async () => {
    const response = await axios.get(`profiles/${testUserId}`, {});
    expect(response.status).toBe(404);
  });
});
