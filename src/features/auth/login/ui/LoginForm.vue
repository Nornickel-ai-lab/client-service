<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';

import { loginSchema } from '@/features/auth/login/model/loginSchema';
import { useLogin } from '@/features/auth/login/model/useLogin';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { ui } from '@/shared/config/ui';

const { submit } = useLogin();

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: {
    email: '',
    password: '',
  },
});

const onSubmit = handleSubmit(async (values) => {
  await submit(values);
});
</script>

<template>
  <Card class="w-full max-w-md border-border">
    <CardHeader>
      <CardTitle>{{ ui.loginTitle }}</CardTitle>
    </CardHeader>
    <CardContent>
      <form
        class="flex flex-col gap-4"
        @submit="onSubmit"
      >
        <FormField
          v-slot="{ componentField }"
          name="email"
        >
          <FormItem>
            <FormLabel>{{ ui.loginEmail }}</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                type="email"
                autocomplete="username"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField
          v-slot="{ componentField }"
          name="password"
        >
          <FormItem>
            <FormLabel>{{ ui.loginPassword }}</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                type="password"
                autocomplete="current-password"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button
          type="submit"
          class="w-full"
          :disabled="isSubmitting"
        >
          {{ ui.loginSubmit }}
        </Button>
      </form>
    </CardContent>
  </Card>
</template>
