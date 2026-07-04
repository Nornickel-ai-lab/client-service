import * as yup from 'yup';

import type { DocumentVisibility } from '@/entities/document/model/types';

export const uploadSchema = yup.object({
  visibility: yup
    .mixed<DocumentVisibility>()
    .oneOf(['public', 'internal', 'confidential'])
    .required(),
});

export type UploadFormValues = yup.InferType<typeof uploadSchema>;
