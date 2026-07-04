<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';
import { ref } from 'vue';

import {
  uploadSchema,
  type UploadFormValues,
} from '@/features/upload/document/model/uploadSchema';
import { useUploadDocument } from '@/features/upload/document/model/useUploadDocument';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { ui } from '@/shared/config/ui';

const emit = defineEmits<{
  uploaded: [];
}>();

const { uploadStatus, uploadError, fileError, setFile, submit } = useUploadDocument();
const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedName = ref('');

const { handleSubmit } = useForm<UploadFormValues>({
  validationSchema: toTypedSchema(uploadSchema),
  initialValues: {
    visibility: 'internal',
  },
});

const onPickFile = (): void => {
  fileInputRef.value?.click();
};

const onFileChange = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] ?? null;
  selectedName.value = file?.name ?? '';
  setFile(file);
};

const onSubmit = handleSubmit(async (values) => {
  const ok = await submit(values);
  if (!ok) {
    return;
  }
  selectedName.value = '';
  setFile(null);
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
  emit('uploaded');
});
</script>

<template>
  <Card class="border-border">
    <CardHeader>
      <CardTitle class="text-base">
        {{ ui.uploadTitle }}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <form
        class="flex flex-col gap-4"
        @submit="onSubmit"
      >
        <input
          ref="fileInputRef"
          type="file"
          class="hidden"
          accept=".pdf,.docx,.pptx,.zip"
          @change="onFileChange"
        />
        <div class="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            :disabled="uploadStatus === 'process'"
            @click="onPickFile"
          >
            {{ ui.uploadAction }}
          </Button>
          <p
            v-if="selectedName"
            class="text-sm text-muted-foreground"
          >
            {{ selectedName }}
          </p>
          <p
            v-if="fileError"
            class="text-sm text-destructive"
          >
            {{ fileError }}
          </p>
        </div>
        <FormField
          v-slot="{ componentField }"
          name="visibility"
        >
          <FormItem>
            <FormLabel>{{ ui.uploadVisibility }}</FormLabel>
            <FormControl>
              <select
                v-bind="componentField"
                class="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                :disabled="uploadStatus === 'process'"
              >
                <option value="public">
                  {{ ui.visibilityPublic }}
                </option>
                <option value="internal">
                  {{ ui.visibilityInternal }}
                </option>
                <option value="confidential">
                  {{ ui.visibilityConfidential }}
                </option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <p
          v-if="uploadError"
          class="text-sm text-destructive"
        >
          {{ uploadError }}
        </p>
        <Button
          type="submit"
          :disabled="uploadStatus === 'process'"
        >
          {{ uploadStatus === 'process' ? ui.statusProcessing : ui.uploadSubmit }}
        </Button>
      </form>
    </CardContent>
  </Card>
</template>
