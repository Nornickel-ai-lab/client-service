import * as yup from 'yup';

export const chatSchema = yup.object({
  text: yup.string().trim().required('Обязательное поле'),
});

export type ChatFormValues = yup.InferType<typeof chatSchema>;
