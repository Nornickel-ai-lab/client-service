import * as yup from 'yup';

import { ui } from '@/shared/config/ui';

export const searchSchema = yup.object({
  text: yup.string().trim().required(ui.fieldRequired),
});

export type SearchFormValues = yup.InferType<typeof searchSchema>;
