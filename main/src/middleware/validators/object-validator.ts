import { Context, Next } from 'koa';
import { Schema, validators } from './schemas';
import { ValidationError } from '../error-handlers/validation-error';

export function validateRequest(schema: Schema) {
  return async (ctx: Context, next: Next) => {
    // Cast the request body as a record with string keys and any values
    const body = ctx.request.body as Record<string, any>;
    const errors: string[] = [];

    // Check each field in the schema
    for (const [field, schemaField] of Object.entries(schema)) {
      const value = body[field];

      // Apply each validation
      for (const validation of schemaField.validations) {
        const isValid = validators[validation](value);

        if (!isValid) {
          switch (validation) {
            case 'required':
              errors.push(`${field} is required`);
              break;
            case 'string':
              errors.push(`${field} must be a string`);
              break;
            case 'number':
              errors.push(`${field} must be a number`);
              break;
            case 'uuid':
              errors.push(`${field} must be a valid UUID`);
              break;
            case 'positive':
              errors.push(`${field} must be a positive number`);
              break;
            default:
              errors.push(`${field} failed validation: ${validation}`);
          }
        }
      }
    }

    if (errors.length > 0) {
      throw new ValidationError(errors.join('; '));
    }

    return next();
  };
}
