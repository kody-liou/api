// # sourceMappingURL=profile.js.map
import Ajv from 'ajv';
import createError from 'http-errors';
import { ProfileEditable } from '../generated/types/profileEditable';
import { profileEditable } from '../schemas/profile';
import { getValidateErrorMessage } from '../helpers/error-message';

const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

const validate = ajv.compile<ProfileEditable>(profileEditable);

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
