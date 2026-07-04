import { storeToRefs } from 'pinia';
import { ref } from 'vue';

import { useDocumentStore } from '@/entities/document/model/documentStore';
import type { DocumentVisibility } from '@/entities/document/model/types';
import { useMlProviderStore } from '@/entities/ml/model/mlProviderStore';
import type { UploadFormValues } from '@/features/upload/document/model/uploadSchema';

import { ui } from '@/shared/config/ui';

const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.pptx', '.zip'];

export const useUploadDocument = () => {
  const documentStore = useDocumentStore();
  const mlStore = useMlProviderStore();
  const { uploadStatus, uploadError } = storeToRefs(documentStore);
  const selectedFile = ref<File | null>(null);
  const fileError = ref<string | null>(null);

  const validateFile = (file: File | null): boolean => {
    if (!file) {
      fileError.value = ui.fieldRequired;
      return false;
    }
    const lowerName = file.name.toLowerCase();
    const allowed = ALLOWED_EXTENSIONS.some((ext) => {
      return lowerName.endsWith(ext);
    });
    if (!allowed) {
      fileError.value = ui.uploadUnsupportedFormat;
      return false;
    }
    fileError.value = null;
    return true;
  };

  const setFile = (file: File | null): void => {
    selectedFile.value = file;
    if (file) {
      validateFile(file);
    } else {
      fileError.value = null;
    }
  };

  const submit = async (values: UploadFormValues): Promise<boolean> => {
    if (!validateFile(selectedFile.value)) {
      return false;
    }
    return documentStore.upload(
      selectedFile.value as File,
      values.visibility as DocumentVisibility,
      mlStore.provider,
    );
  };

  return {
    uploadStatus,
    uploadError,
    selectedFile,
    fileError,
    setFile,
    submit,
  };
};
