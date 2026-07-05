<script setup lang="ts">
import { ref } from 'vue';
import { FolderOpen, Upload } from 'lucide-vue-next';

import { useUploadDocument } from '@/features/upload/document/model/useUploadDocument';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { ui } from '@/shared/config/ui';

const {
  uploadStatus,
  uploadError,
  fileError,
  setFile,
  setDirectoryFiles,
  selectionLabel,
  submit,
  resetSelection,
} = useUploadDocument();

const fileInputRef = ref<HTMLInputElement | null>(null);
const directoryInputRef = ref<HTMLInputElement | null>(null);
const uploadSuccess = ref(false);
const uploadSuccessText = ref('');

const onPickFile = (): void => {
  fileInputRef.value?.click();
};

const onPickDirectory = (): void => {
  directoryInputRef.value?.click();
};

const clearInputs = (): void => {
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
  if (directoryInputRef.value) {
    directoryInputRef.value.value = '';
  }
};

const onFileChange = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] ?? null;
  setFile(file);
  uploadSuccess.value = false;
  uploadSuccessText.value = '';
};

const onDirectoryChange = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  if (!target.files) {
    return;
  }
  setDirectoryFiles(target.files);
  uploadSuccess.value = false;
  uploadSuccessText.value = '';
};

const onDrop = (event: DragEvent): void => {
  event.preventDefault();
  const items = event.dataTransfer?.items;
  if (items && items.length > 0) {
    const fileList: File[] = [];
    Array.from(items).forEach((item) => {
      const entry = item.webkitGetAsEntry?.();
      if (entry?.isFile) {
        const file = item.getAsFile();
        if (file) {
          fileList.push(file);
        }
      }
    });
    if (fileList.length > 1) {
      setDirectoryFiles(fileList);
      return;
    }
  }
  const file = event.dataTransfer?.files?.[0] ?? null;
  setFile(file);
  uploadSuccess.value = false;
  uploadSuccessText.value = '';
};

const onDragOver = (event: DragEvent): void => {
  event.preventDefault();
};

const buildSuccessText = (response: NonNullable<Awaited<ReturnType<typeof submit>>>): string => {
  if (response.batch) {
    const batch = response.batch;
    return `${ui.uploadBatchSuccess}: ${batch.queued} (пропущено: ${batch.skipped})`;
  }
  return ui.uploadSuccess;
};

const onSubmit = async (event: Event): Promise<void> => {
  event.preventDefault();
  const response = await submit();
  if (!response) {
    return;
  }
  uploadSuccess.value = true;
  uploadSuccessText.value = buildSuccessText(response);
  resetSelection();
  clearInputs();
};
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
        <input
          ref="directoryInputRef"
          type="file"
          class="hidden"
          webkitdirectory
          directory
          multiple
          @change="onDirectoryChange"
        />
        <div
          class="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 px-6 py-10 transition-colors hover:bg-muted/40"
          @drop="onDrop"
          @dragover="onDragOver"
        >
          <Upload class="size-8 text-muted-foreground" />
          <p class="text-sm font-medium">
            {{ ui.uploadDescription }}
          </p>
          <p class="text-center text-xs text-muted-foreground">
            {{ ui.uploadFormatsHint }}
          </p>
          <div class="flex flex-wrap justify-center gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              :disabled="uploadStatus === 'process'"
              @click="onPickFile"
            >
              {{ ui.uploadAction }}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              :disabled="uploadStatus === 'process'"
              @click="onPickDirectory"
            >
              <FolderOpen class="size-4" />
              {{ ui.uploadDirectoryAction }}
            </Button>
          </div>
        </div>
        <p
          v-if="selectionLabel()"
          class="text-sm text-muted-foreground"
        >
          {{ selectionLabel() }}
        </p>
        <p
          v-if="fileError"
          class="text-sm text-destructive"
        >
          {{ fileError }}
        </p>
        <p
          v-if="uploadSuccess"
          class="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm"
        >
          {{ uploadSuccessText }}
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
