const gender = {
  type: 'string',
  enum: ['male', 'female', 'transgender'],
};

const image = {
  type: 'object',
  properties: {
    fileName: { type: 'string' },
    fileExt: { type: 'string' },
    checked: { type: 'boolean' },
    id: { type: 'string' },
    isPhotoVerified: { type: 'boolean' },
    photoReportedCount: { type: 'number' },
  },
  required: ['fileName', 'fileExt'],
  additionalProperties: false,
};

export const profileEditable = {
  type: 'object',
  properties: {
    nickName: { type: 'string', minLength: 1 },
    dob: { type: 'string', minLength: 1 },
    location1st: { type: 'string' },
    location2nd: { type: 'string' },
    location3rd: { type: 'string' },
    phone: { type: 'string' },
    hobbies: { type: 'array', items: { type: 'string' } },
    gender,
    genderMatch: {
      type: 'array',
      items: gender,
    },
    preferAgeGTE: { type: 'integer' },
    preferAgeLTE: { type: 'integer' },
    selfIntro: { type: 'string' },
  },
  required: ['nickName', 'dob', 'gender'],
  additionalProperties: false,
};

const profileSecret = {
  description: 'The data that need keep secret to client',
  type: 'object',
  properties: {
    score: {
      description: 'The score higher, the sorting priority',
      type: 'number',
    },
    reportedCount: {
      description: 'The count that this profile reported by other users',
      type: 'number',
    },
  },
  additionalProperties: false,
};

const profileReadonly = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    email: { type: 'string' },
    hobbies: { type: 'array', items: { type: 'string' } },
    images: { type: 'array', items: image },
    ts: { type: 'number' },
  },
  additionalProperties: false,
};

export default {
  gender,
  image,
  profileEditable,
  profileSecret,
  profileReadonly,
};
