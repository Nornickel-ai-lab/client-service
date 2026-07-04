<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup';
import { useForm } from 'vee-validate';
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Upload } from 'lucide-vue-next';

import { useUserStore } from '@/entities/user/model/userStore';
import {
  uploadSchema,
  type UploadFormValues,
} from '@/features/upload/document/model/uploadSchema';
import { useUploadDocument } from '@/features/upload/document/model/useUploadDocument';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { ui } from '@/shared/config/ui';

const { uploadStatus, uploadError, fileError, setFile, submit } = useUploadDocument();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedName = ref('');
const uploadSuccess = ref(false);

const isAdmin = computed(() => {
  return user.value?.role === 'admin';
});

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
  uploadSuccess.value = false;
};

const onDrop = (event: DragEvent): void => {
  event.preventDefault();
  const file = event.dataTransfer?.files?.[0] ?? null;
  selectedName.value = file?.name ?? '';
  setFile(file);
  uploadSuccess.value = false;
};

const onDragOver = (event: DragEvent): void => {
  event.preventDefault();
};

const onSubmit = handleSubmit(async (values) => {
  const ok = await submit(values);
  if (!ok) {
    return;
  }
  uploadSuccess.value = true;
  selectedName.value = '';
  setFile(null);
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
});
</script>

<template>
  <Card class="border-border shadow-sm">
    <CardContent class="pt-6">
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
        <button
          type="button"
          class="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 px-6 py-10 transition-colors hover:bg-muted/40"
          :disabled="uploadStatus === 'process'"
          @click="onPickFile"
          @drop="onDrop"
          @dragover="onDragOver"
        >
          <Upload class="size-8 text-muted-foreground" />
          <span class="text-sm font-medium">{{ ui.uploadAction }}</span>
          <span class="text-xs text-muted-foreground">PDF · DOCX · PPTX · ZIP</span>
        </button>
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
                <option
                  v-if="isAdmin"
                  value="confidential"
                >
                  {{ ui.visibilityConfidential }}
                </option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <p
          v-if="uploadSuccess"
          class="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm"
        >
          {{ ui.uploadSuccess }}
        </p>
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
