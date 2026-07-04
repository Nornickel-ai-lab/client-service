import { useRouter } from 'vue-router';

import { useUserStore } from '@/entities/user/model/userStore';
import type { LoginFormValues } from '@/features/auth/login/model/loginSchema';

interface UseLoginReturn {
  submit: (values: LoginFormValues) => Promise<void>;
}

export const useLogin = (): UseLoginReturn => {
  const store = useUserStore();
  const router = useRouter();

  const submit = async (values: LoginFormValues): Promise<void> => {
    await store.login({
      email: values.email.trim(),
      password: values.password,
    });
    await router.push('/');
  };

  return {
    submit,
  };
};
