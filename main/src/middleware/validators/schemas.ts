import { validate as uuidValidate } from 'uuid';

export type ValidationType =
  | 'required'
  | 'string'
  | 'number'
  | 'uuid'
  | 'positive';

export interface SchemaField {
  type: string;
  validations: ValidationType[];
}

export interface Schema {
  [field: string]: SchemaField;
}

// User login schema
export const userLoginSchema: Schema = {
  username: {
    type: 'string',
    validations: ['required', 'string'],
  },
};

// User answer schema
export const userAnswerSchema: Schema = {
  userId: {
    type: 'string',
    validations: ['required', 'uuid'],
  },
  elementId: {
    type: 'string',
    validations: ['required', 'uuid'],
  },
  userAnswer: {
    type: 'number',
    validations: ['required', 'number'],
  },
};

// Element schema
export const elementSchema: Schema = {
  eventId: {
    type: 'string',
    validations: ['required', 'uuid'],
  },
  projectId: {
    type: 'string',
    validations: ['required', 'uuid'],
  },
  scores: {
    type: 'number',
    validations: ['required', 'number', 'positive'],
  },
};

// Right answer schema
export const rightAnswerSchema: Schema = {
  rightAnswer: {
    type: 'number',
    validations: ['required', 'number'],
  },
};

// Export validators for the validation types
export const validators = {
  required: (value: any) =>
    value !== undefined && value !== null && value !== '',
  string: (value: any) => typeof value === 'string',
  number: (value: any) => typeof value === 'number',
  uuid: (value: any) => typeof value === 'string' && uuidValidate(value),
  positive: (value: any) => typeof value === 'number' && value > 0,
};
