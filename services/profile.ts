// # sourceMappingURL=profile.js.map
import Ajv from 'ajv';
import createError from 'http-errors';
// import { Dyn } from '@aws-sdk/client-dynamodb';
import { ProfileEditable } from '../generated/types/profileEditable';
// import { ProfileReadonly } from '../generated/types/profileReadonly';
import { profileEditable } from '../schemas/profile';
import { getValidateErrorMessage } from '../helpers/error-message';
// import { CommonDBModel } from '../helpers/dynamodb';

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

const validate = ajv.compile<ProfileEditable>(profileEditable);

// type ProfileClientItem = ProfileEditable & ProfileReadonly;

export const dataFilter = (data: any): ProfileEditable => {
  const valid = validate(data);
  if (!valid) {
    throw new createError.BadRequest(getValidateErrorMessage(validate));
  }
  const { name, dob, gender } = data;
  return {
    name,
    dob,
    gender,
  };
};

// export class ProfileDBModel extends CommonDBModel<
//   ProfileEditable,
//   ProfileClientItem
// > {}
