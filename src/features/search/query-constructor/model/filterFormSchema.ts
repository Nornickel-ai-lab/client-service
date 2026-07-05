import * as yup from 'yup';

import { ui } from '@/shared/config/ui';

export const MIN_FILTER_YEAR = 1990;

export const maxFilterYear = (): number => {
  return new Date().getFullYear();
};

const yearFieldSchema = yup
  .number()
  .nullable()
  .transform((_value, originalValue) => {
    if (originalValue === '' || originalValue === null || originalValue === undefined) {
      return null;
    }
    const parsed = Number(originalValue);
    if (Number.isNaN(parsed)) {
      return Number.NaN;
    }
    return parsed;
  })
  .typeError(ui.yearInvalid)
  .integer(ui.yearInvalid)
  .min(MIN_FILTER_YEAR, ui.yearMin)
  .max(maxFilterYear(), ui.yearMax);

export const filterYearsSchema = yup.object({
  yearFrom: yearFieldSchema,
  yearTo: yearFieldSchema,
}).test('year-range', ui.yearRangeInvalid, function validateYearRange(values) {
  const from = values.yearFrom ?? null;
  const to = values.yearTo ?? null;
  if (from === null || to === null || from <= to) {
    return true;
  }
  return this.createError({
    path: 'yearTo',
    message: ui.yearRangeInvalid,
  });
});

export type FilterYearsValues = yup.InferType<typeof filterYearsSchema>;

export const validateFilterYears = async (
  yearFrom: string,
  yearTo: string,
): Promise<{ valid: boolean; values: FilterYearsValues; errors: Record<string, string> }> => {
  try {
    const values = await filterYearsSchema.validate(
      { yearFrom, yearTo },
      { abortEarly: false },
    );
    return { valid: true, values, errors: {} };
  } catch (error) {
    if (!(error instanceof yup.ValidationError)) {
      return {
        valid: false,
        values: { yearFrom: null, yearTo: null },
        errors: { yearFrom: ui.yearInvalid },
      };
    }
    const errors: Record<string, string> = {};
    for (const item of error.inner) {
      if (item.path && !errors[item.path]) {
        errors[item.path] = item.message;
      }
    }
    if (error.path && error.message && !errors[error.path]) {
      errors[error.path] = error.message;
    }
    return {
      valid: false,
      values: { yearFrom: null, yearTo: null },
      errors,
    };
  }
};
