require('dotenv').config();

import axios from './lib/axios';

describe('profileCreate', () => {
  it('post empty data', async () => {
    const response = await axios.post('profiles', {});
    console.log(response);
    expect(response.data).toBeInstanceOf(Object);
  });
  it('profileGet should exist', async () => {
    const response = await axios.get('profiles/profileId_xxx', {});
    expect(response.data).toBeInstanceOf(Object);
  });
  it('profilesGet should exist', async () => {
    const response = await axios.get('profiles');
    expect(response.data).toBeInstanceOf(Array);
  });
  it('profileUpdate should exist', async () => {
    await axios.put('profiles/profileId_xxx', {});
  });
  it('profileRemove should exist', async () => {
    await axios.delete('profiles/profileId_xxx', {});
  });
});
