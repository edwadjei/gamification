import { Context, Next } from 'koa';
import { validate as uuidValidate } from 'uuid';

export const validate = (schema: Record<string, any>) => {
  return async (ctx: Context, next: Next): Promise<void> => {
    const data = ctx.request.body as { [key: string]: any };
    const errors: string[] = [];

    // Validate required fields
    Object.keys(schema).forEach((field) => {
      const fieldSchema = schema[field];

      // Check required fields
      if (
        fieldSchema.required &&
        (data[field] === undefined || data[field] === null)
      ) {
        errors.push(`${field} is required`);
        return;
      }

      if (data[field] !== undefined && data[field] !== null) {
        // Validate types
        if (fieldSchema.type === 'uuid' && !uuidValidate(data[field])) {
          errors.push(`${field} must be a valid UUID`);
        }

        if (fieldSchema.type === 'number' && typeof data[field] !== 'number') {
          errors.push(`${field} must be a number`);
        }

        // Validate number constraints
        if (fieldSchema.type === 'number' && typeof data[field] === 'number') {
          if (fieldSchema.positive && data[field] <= 0) {
            errors.push(`${field} must be a positive number`);
          }
        }
      }
    });

    if (errors.length > 0) {
      ctx.status = 400;
      ctx.body = {
        errors,
        message: 'Validation failed',
      };
      return;
    }

    await next();
  };
};
