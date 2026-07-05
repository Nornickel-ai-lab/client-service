export const INGESTIBLE_EXTENSIONS = ['.pdf', '.docx'] as const;

export const SINGLE_UPLOAD_EXTENSIONS = ['.pdf', '.docx', '.pptx', '.zip'] as const;

export type UploadMode = 'file' | 'directory';

export const isIngestibleFile = (name: string): boolean => {
  const lower = name.toLowerCase();
  return INGESTIBLE_EXTENSIONS.some((ext) => {
    return lower.endsWith(ext);
  });
};

export const isSingleUploadFile = (name: string): boolean => {
  const lower = name.toLowerCase();
  return SINGLE_UPLOAD_EXTENSIONS.some((ext) => {
    return lower.endsWith(ext);
  });
};

export const fileRelativePath = (file: File): string => {
  const relative = (file as File & { webkitRelativePath?: string }).webkitRelativePath;
  return relative?.trim() || file.name;
};

export const collectDirectoryFiles = (fileList: FileList | File[]): File[] => {
  const files = Array.from(fileList);
  return files.filter((file) => {
    return isIngestibleFile(fileRelativePath(file));
  });
};
