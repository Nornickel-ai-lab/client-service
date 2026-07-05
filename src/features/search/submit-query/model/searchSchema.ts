import * as yup from 'yup';

export const searchSchema = yup.object({
  text: yup.string().default(''),
});

export type SearchFormValues = yup.InferType<typeof searchSchema>;
