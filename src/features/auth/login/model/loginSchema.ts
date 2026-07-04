import * as yup from 'yup';

import { ui } from '@/shared/config/ui';

export const loginSchema = yup.object({
  email: yup.string().trim().required(ui.fieldRequired),
  password: yup.string().required(ui.fieldRequired),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;
