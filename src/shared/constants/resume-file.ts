export const RESUME_FILE_MAX_SIZE = 5 * 1024 * 1024;

export const RESUME_FILE_ALLOWED_EXTENSIONS = ['doc', 'docx', 'pdf'] as const;

export const RESUME_FILE_ACCEPT = '.doc,.docx,.pdf';

export const RESUME_FILE_ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export type ResumeFileValidationError = 'required' | 'type' | 'size';

export const getResumeFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const validateResumeFile = (
  file: File | null | undefined,
): { valid: true } | { valid: false; error: ResumeFileValidationError } => {
  if (!file) {
    return { valid: false, error: 'required' };
  }

  const extension = getResumeFileExtension(file.name);

  if (!RESUME_FILE_ALLOWED_EXTENSIONS.includes(extension as typeof RESUME_FILE_ALLOWED_EXTENSIONS[number])) {
    return { valid: false, error: 'type' };
  }

  if (file.size > RESUME_FILE_MAX_SIZE) {
    return { valid: false, error: 'size' };
  }

  return { valid: true };
};
