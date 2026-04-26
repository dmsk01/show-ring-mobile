/**
 * Zod schema utilities — shared helpers for common field validation patterns.
 *
 * Ported from web's `src/components/hook-form/schema-utils.ts`.
 * Dropped: `editor` (no rich editor in RN), `file` / `files` (no `z.file()` in RN).
 */

import * as z from 'zod';
import dayjs from 'dayjs';

// ----------------------------------------------------------------------

type SchemaErrorMessages = {
  required?: string;
  invalid?: string;
};

export const schemaUtils = {
  /**
   * Phone number
   * Apply for phone number input.
   */
  phoneNumber: (props?: { error?: SchemaErrorMessages; isValid?: (val: string) => boolean }) =>
    z
      .string()
      .min(1, { error: props?.error?.required ?? 'Phone number is required!' })
      .refine((val) => props?.isValid?.(val), {
        error: props?.error?.invalid ?? 'Invalid phone number!',
      }),

  /**
   * Email
   * Apply for email input.
   */
  email: (props?: { error?: SchemaErrorMessages }) =>
    z.email({
      error: ({ input, code }) =>
        input && code.startsWith('invalid')
          ? (props?.error?.invalid ?? 'Email must be a valid email address!')
          : (props?.error?.required ?? 'Email is required!'),
    }),

  /**
   * Date
   * Apply for date pickers.
   */
  date: (props?: { error?: SchemaErrorMessages }) =>
    z.preprocess(
      (val) => (val === undefined ? null : val),
      z.union([z.string(), z.number(), z.date(), z.null()]).check((ctx) => {
        const value = ctx.value;

        if (value === null || value === '') {
          ctx.issues.push({
            code: 'custom',
            message: props?.error?.required ?? 'Date is required!',
            input: value,
          });
          return;
        }

        if (!dayjs(value).isValid()) {
          ctx.issues.push({
            code: 'custom',
            message: props?.error?.invalid ?? 'Invalid date!',
            input: value,
          });
        }
      })
    ),

  /**
   * Nullable Input
   * Apply for input, select... with null value.
   */
  nullableInput: <T extends z.ZodTypeAny>(schema: T, options?: { error?: string }) =>
    schema.nullable().refine((val) => val !== null && val !== undefined, {
      error: options?.error ?? 'Field is required!',
    }),

  /**
   * Boolean
   * Apply for checkbox, switch...
   */
  boolean: (props?: { error?: string }) =>
    z.boolean().refine((val) => val === true, {
      error: props?.error ?? 'Field is required!',
    }),

  /**
   * Slider range
   * Apply for slider with range [min, max].
   */
  sliderRange: (props: { error?: string; min: number; max: number }) =>
    z
      .number()
      .array()
      .refine((val) => val[0] >= props.min && val[1] <= props.max, {
        error: props.error ?? `Range must be between ${props.min} and ${props.max}`,
      }),
};

// ----------------------------------------------------------------------

/**
 * Test one or multiple values against a Zod schema.
 * Dev-only diagnostic utility — call from REPL or __DEV__ code.
 */
export function testCase<T extends z.ZodTypeAny>(schema: T, values: unknown[]) {
  values.forEach((value) => {
    const { data, success, error } = schema.safeParse(value);
    const serializedValue = JSON.stringify(value);

    const label = success ? `✅ Valid - ${serializedValue}` : `❌ Error - ${serializedValue}`;
    const payload = success ? data : z.treeifyError(error);

    console.info(`${label} (${typeof value}):`, JSON.stringify(payload, null, 2));
  });
}
