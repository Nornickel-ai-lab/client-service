<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';

import { loginSchema } from '@/features/auth/login/model/loginSchema';
import { useLogin } from '@/features/auth/login/model/useLogin';
import { Button } from '@/shared/ui/button';
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
  <div class="w-full">
    <header class="mb-8">
      <h2 class="text-2xl font-semibold tracking-tight text-white">
        {{ ui.loginTitle }}
      </h2>
      <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
        {{ ui.loginSubtitle }}
      </p>
    </header>

    <form
      class="flex flex-col gap-5"
      @submit="onSubmit"
    >
      <FormField
        v-slot="{ componentField }"
        name="email"
      >
        <FormItem>
          <FormLabel class="text-sm font-normal text-foreground">
            {{ ui.loginEmail }}
          </FormLabel>
          <FormControl>
            <Input
              v-bind="componentField"
              type="email"
              autocomplete="username"
              placeholder="researcher@local.dev"
              class="h-11 border-white/10 bg-white/5 text-foreground placeholder:text-muted-foreground/60"
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
          <FormLabel class="text-sm font-normal text-foreground">
            {{ ui.loginPassword }}
          </FormLabel>
          <FormControl>
            <Input
              v-bind="componentField"
              type="password"
              autocomplete="current-password"
              class="h-11 border-white/10 bg-white/5 text-foreground"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button
        type="submit"
        class="mt-2 h-11 w-full rounded-lg bg-white text-sm font-medium text-black hover:bg-white/90"
        :disabled="isSubmitting"
      >
        {{ ui.loginSubmit }}
      </Button>
    </form>
  </div>
</template>
