// # sourceMappingURL=error-message.js.map
import type { ValidateFunction } from 'ajv';

export const getValidateErrorMessage = (validate: ValidateFunction) =>
  (validate.errors as any)[0].message;
