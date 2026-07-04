<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';

import { searchSchema } from '@/features/search/submit-query/model/searchSchema';
import { useSubmitQuery } from '@/features/search/submit-query/model/useSubmitQuery';
import { Button } from '@/shared/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/ui/form';
import { Textarea } from '@/shared/ui/textarea';
import { ui } from '@/shared/config/ui';

const { inputStatus, submit } = useSubmitQuery();

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(searchSchema),
  initialValues: {
    text: '',
  },
});

const onSubmit = handleSubmit(async (values) => {
  await submit(values.text);
  resetForm();
});

const onKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    onSubmit();
  }
};
</script>

<template>
  <form
    class="flex gap-2 border-t border-border bg-background p-4"
    @submit="onSubmit"
  >
    <FormField
      v-slot="{ componentField }"
      name="text"
      class="flex flex-1 flex-col"
    >
      <FormItem class="flex flex-1 flex-col gap-1">
        <FormControl>
          <Textarea
            v-bind="componentField"
            :placeholder="ui.searchPlaceholder"
            rows="2"
            class="min-h-[72px] resize-none"
            :disabled="inputStatus === 'process'"
            @keydown="onKeydown"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button
      type="submit"
      class="self-end"
      :disabled="inputStatus === 'process'"
    >
      {{ ui.searchSubmit }}
    </Button>
  </form>
</template>
