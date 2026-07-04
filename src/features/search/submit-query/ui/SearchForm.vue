<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';

import { searchSchema } from '@/features/search/submit-query/model/searchSchema';
import { useSubmitQuery } from '@/features/search/submit-query/model/useSubmitQuery';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { ui } from '@/shared/config/ui';

const { inputStatus, submit } = useSubmitQuery();

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: toTypedSchema(searchSchema),
  initialValues: {
    text: '',
  },
});

const [text, textAttrs] = defineField('text');

const onSubmit = handleSubmit(async (values) => {
  await submit(values.text);
  text.value = '';
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
    <div class="flex flex-1 flex-col gap-1">
      <Textarea
        v-model="text"
        v-bind="textAttrs"
        :placeholder="ui.searchPlaceholder"
        rows="2"
        class="min-h-[72px] resize-none"
        :disabled="inputStatus === 'process'"
        @keydown="onKeydown"
      />
      <p
        v-if="errors.text"
        class="text-sm text-destructive"
      >
        {{ errors.text }}
      </p>
    </div>
    <Button
      type="submit"
      class="self-end"
      :disabled="inputStatus === 'process'"
    >
      {{ ui.searchSubmit }}
    </Button>
  </form>
</template>
