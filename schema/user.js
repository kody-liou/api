const genderEnum = ['male', 'female'];

const userImage = {
  type: 'object',
  properties: {
    fileName: { type: 'string' },
    checked: { type: 'boolean' },
  },
  required: ['fileName'],
  additionalProperties: false,
};

const userEditable = {
  type: 'object',
  properties: {
    nickName: { type: 'string', minLength: 1 },
    dob: { type: 'string', minLength: 1 },
    location1st: { type: 'string' },
    location2nd: { type: 'string' },
    location3rd: { type: 'string' },
    phone: { type: 'string' },
    hobbies: { type: 'array', items: { type: 'string' } },
    gender: {
      type: 'string',
      enum: genderEnum,
    },
    genderMatch: {
      type: 'array',
      items: {
        type: 'string',
        enum: genderEnum,
      },
    },
    preferAgeGTE: { type: 'integer' },
    preferAgeLTE: { type: 'integer' },
    selfIntro: { type: 'string' },
    images: { type: 'array', items: userImage },
  },
  required: ['nickName', 'dob', 'gender'],
  additionalProperties: false,
};

const userSecret = {
  type: 'object',
  properties: {
    isEmailVerified: { type: 'boolean' },
    isPhoneVerified: { type: 'boolean' },
    createdAt: { type: 'number' },
    creditRating: { type: 'number' },
    userReportedCount: { type: 'number' },
  },
  additionalProperties: false,
};

const userReadonly = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
    email: { type: 'string' },
    hobbies: { type: 'array', items: { type: 'string' } },
    photos: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          photoId: { type: 'string' },
          isPhotoVerified: { type: 'boolean' },
          photoReportedCount: { type: 'number' },
        },
        additionalProperties: false,
      },
    },
  },
  additionalProperties: false,
};

// 被依賴的schema要放到前面才會被build
module.exports = {
  userImage,
  userEditable,
  userSecret,
  userReadonly,
};
