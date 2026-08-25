<script setup lang="ts">
import FileDrop from '@l-work/assets/icons/vacancies/file-drop.svg';
import FileIcon from '@l-work/assets/icons/vacancies/file.svg';
import CloseIcon from '@/assets/icons/close-icon.svg';
import {
  RESUME_FILE_ACCEPT,
  RESUME_FILE_ALLOWED_EXTENSIONS,
  RESUME_FILE_MAX_SIZE,
  getResumeFileExtension,
} from '~/shared/constants/resume-file';

interface Props {
  maxSize?: number;
  allowedExtensions?: string[];
  accept?: string;
}

const props = withDefaults(defineProps<Props>(), {
  maxSize: RESUME_FILE_MAX_SIZE,
  allowedExtensions: () => [...RESUME_FILE_ALLOWED_EXTENSIONS],
  accept: RESUME_FILE_ACCEPT,
});

const { t } = useI18n();

const model = defineModel<File | null>({ default: null });
const { fieldValue, isErrorState: isFormErrorState } = useFormField(model);

const fileInput = ref<HTMLInputElement>();
const isDragging = ref(false);
const isLocalFileError = ref(false);

const selectedFile = computed({
  get: () => fieldValue.value,
  set: (value: File | null) => {
    fieldValue.value = value;
  },
});

const isFileError = computed(() => isLocalFileError.value || isFormErrorState.value);

const isValidFile = (file: File) => {
  const extension = getResumeFileExtension(file.name);
  return (
    props.allowedExtensions.includes(extension) && file.size <= props.maxSize
  );
};

const handleFileSelect = (file: File) => {
  selectedFile.value = file;

  if (isValidFile(file)) {
    isLocalFileError.value = false;
    return;
  }

  selectedFile.value = null;
  isLocalFileError.value = true;
};

const removeFile = () => {
  selectedFile.value = null;
  isLocalFileError.value = false;

  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.[0]) {
    handleFileSelect(input.files[0]);
  }
};

const onDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = false;

  if (event.dataTransfer?.files?.[0]) {
    handleFileSelect(event.dataTransfer.files[0]);
  }
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = true;
};

const onDragLeave = () => {
  isDragging.value = false;
};

const triggerFileInput = () => {
  fileInput.value?.click();
};
</script>

<template>
  <div class="file-upload">
    <div
      class="file-upload__dropzone"
      :class="{ 'file-upload__dropzone_dragging': isDragging }"
      @click="triggerFileInput"
      @drop="onDrop"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
    >
      <input
        ref="fileInput"
        type="file"
        class="file-upload__input"
        :accept="accept"
        @change="onFileChange"
      />

      <div class="file-upload__content">
        <FileDrop class="file-upload__icon" />
        <p class="file-upload__placeholder" v-html="t('fileUpload.placeholder')" />
        <p class="file-upload__hint">
          {{ t('fileUpload.formats') }}{{ allowedExtensions.join(", ").toUpperCase() }}. {{ t('fileUpload.noMore') }} {{ Math.floor(maxSize / 1024 / 1024) }} {{ t('fileUpload.mb') }}
        </p>
      </div>
    </div>
    <div v-if="selectedFile" class="file-upload__files">
      <div
        class="file-upload__files-file"
        :class="{ 'file-upload__files-file_error': isFileError }"
      >
        <FileIcon class="file-upload__files-file-icon" />
        <p class="file-upload__files-file-text">{{ selectedFile.name }}</p>
        <CloseIcon class="file-upload__files-file-close" @click="removeFile" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "assets/styles/typography" as t;
@use "assets/styles/adaptive" as a;
@use "assets/styles/shared" as s;

.file-upload {
  &__dropzone {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 200px;

    background: var(--bg);
    border: dashed 1px transparent;
    border-radius: 16px;

    transition: all 0.3s ease;

    @include a.mobile {
      padding: 24px;
    }

    &:hover,
    &_dragging {
      border: dashed 1px var(--dark-blue-60);
      opacity: 0.6;
    }
  }

  &__icon {
    width: 32px;
    height: 32px;
    margin-bottom: 14px;
  }

  &__input {
    display: none;
  }

  &__content {
    text-align: center;
  }

  &__placeholder {
    margin-bottom: 6px;

    color: var(--dark-blue);
    font-weight: 600;
    font-size: 16px;

    font-family: Manrope;
    font-style: normal;
    line-height: 128%;

    @include a.tablet {
      color: var(--dark-blue-80);
    }

    @include a.mobile {
      @include t.caption-xs-medium;
    }
  }

  &__hint {
    color: var(--dark-blue-70);

    @include t.caption-xs-medium;
  }

  &__file-info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__files {
    margin-top: 16px;

    &-file {
      display: flex;
      gap: 12px;
      width: max-content;
      padding: 16px 24px;

      background: #e8eeff;
      border-radius: 32px;

      @include a.mobile {
        width: 100%;
      }

      &_error {
        color: #f06565;

        background: #fef7f7;
      }

      &-icon {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
      }

      &-text {
        max-width: 72px;

        white-space: nowrap;

        @include s.max-lines(1);

        @include a.mobile {
          max-width: 192px;
        }
      }

      &-close {
        flex-shrink: 0;
        width: 25px;
        height: 25px;

        @include a.mobile {
          margin-left: auto;
        }
      }
    }
  }
}
</style>
