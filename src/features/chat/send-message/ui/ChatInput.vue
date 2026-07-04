<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';

import { chatSchema } from '@/features/chat/send-message/model/chatSchema';
import { useChatStore } from '@/entities/query/model/chatStore';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { ui } from '@/shared/config/ui';

const chatStore = useChatStore();
const { inputStatus } = storeToRefs(chatStore);

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: toTypedSchema(chatSchema),
  initialValues: {
    text: '',
  },
});

const [text, textAttrs] = defineField('text');

const submit = handleSubmit(async (values) => {
  await chatStore.sendMessage(values.text);
  text.value = '';
});

const onKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    submit();
  }
};
</script>

<template>
  <form
    class="flex gap-2 border-t border-border bg-background p-4"
    @submit="submit"
  >
    <div class="flex flex-1 flex-col gap-1">
      <Textarea
        v-model="text"
        v-bind="textAttrs"
        :placeholder="ui.chatPlaceholder"
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
      {{ ui.chatSubmit }}
    </Button>
  </form>
</template>
