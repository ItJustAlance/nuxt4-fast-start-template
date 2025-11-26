<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  imgDefault?: string | null;
  image?: string | null;
  disabled: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  imgDefault: '',
  image: '',
  disabled: false,
});

const fileUploadRef = ref();

const srcImg = ref(null);
const totalSize = ref(0);
const totalSizePercent = ref(0);

const emit = defineEmits<{
  (e: 'update:image', value: string | null): void;
  (e: 'selectedFile', value: File): void;
  (e: 'deleteFile', value: File): void;
}>();

const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
  removeFileCallback(index);
  totalSize.value -= parseInt(formatSize(file.size));
  totalSizePercent.value = totalSize.value / 10;
};

const browseFiles = () => {
  if (fileUploadRef.value) {
    fileUploadRef.value.choose(); // Открывает диалог выбора файлов
  }
};

const deleteFiles = (clear) => {
  emit('update:image', '');
  emit('deleteFile');
  totalSize.value = 0;
  totalSizePercent.value = 0;
  console.log('deleteFile');
};

// const onSelectedFiles = (event) => {
//   const file = event.files[0];
//   const reader = new FileReader();
//
//   reader.onload = async (e) => {
//     srcImg.value = e.target.result;
//   };
//
//   reader.readAsDataURL(file);
//
//   file.value.forEach((file) => {
//     totalSize.value += parseInt(formatSize(file.size));
//   });
// };
//
// const uploadEvent = (callback) => {
//   totalSizePercent.value = totalSize.value / 10;
//   callback();
// };
//
// const onTemplatedUpload = () => {
//   toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
// };

const formatSize = (bytes) => {
  const k = 1024;
  const dm = 3;
  const sizes = 100;

  if (bytes === 0) {
    return `0 ${sizes[0]}`;
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${formattedSize} ${sizes[i]}`;
};

function onFileSelect(event) {
  const file = event.files[0];
  const reader = new FileReader();
  reader.onload = async (e) => {
    emit('selectedFile', file);
    srcImg.value = e.target.result;
  };

  reader.readAsDataURL(file);
}

watchEffect(async () => {
  srcImg.value = props.image;
});
</script>

<template>
  <div class="file-upload-box">
    <img v-if="srcImg" :src="srcImg" alt="preview" class="file-upload-box__preview" />

    <FileUpload
      ref="fileUploadRef"
      :disabled="disabled"
      name="demo[]"
      url="/api/upload"
      :auto="true"
      severity="secondary"
      accept="image/*"
      :max-file-size="10000000"
      @select="onFileSelect"
    >
      <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
        <div style="display: none" class="file-upolad-box-content">
          <div v-if="!disabled" class="upload-up">
            <div v-if="!!srcImg" class="upload-up__btn --btn-delete" @click="deleteFiles">
              <slot name="btnDelete">
                <button class="btn btn--gray --btn-delete">
                  <span class="btn-label">Удалить файл</span>
                  <SvgIcon name="upload-simple" class="fnone ic16" />
                </button>
              </slot>
            </div>
            <div v-else class="upload-up__btn --btn-add2" @click="chooseCallback()">
              <slot name="btnUpload">
                <button class="btn btn--gray --btn-add">
                  <span class="btn-label">Добавить файл</span>
                  <SvgIcon name="upload-simple" class="fnone ic16" />
                </button>
              </slot>
            </div>

            <button
              v-if="files.length > 0"
              icon="pi pi-times"
              rounded
              outlined
              severity="danger"
              :disabled="!files || files.length === 0"
              @click="clearCallback()"
            ></button>
            <ProgressBar
              style="display: none"
              :value="totalSizePercent"
              :show-value="false"
              class="md:w-20rem h-1 w-full md:ml-auto"
            >
              <span class="whitespace-nowrap">{{ totalSize }}B / 1Mb</span>
            </ProgressBar>
          </div>
          <!--end upload-up -->
          <div class="upload-content">
            <div v-if="files.length == 0" class="upload-empty">
              <slot name="uploadEmpty">
                <div class="file-text">или перетащите файл для загрузки</div>
                <div class="file-text-types">SVG или PNG, 1000x1000 px</div>
              </slot>
            </div>
          </div>
          <!--end upload-content -->
        </div>
      </template>
      <template #content="{ files, uploadedFiles, removeUploadedFileCallback, removeFileCallback, messages }">
        <div class="file-upolad-box-content">
          <div v-if="!disabled" class="upload-up">
            <div v-if="!!srcImg" class="upload-up__btn --btn-delete" @click="deleteFiles">
              <slot name="btnDelete">
                <button class="btn btn--gray --btn-delete">
                  <span class="btn-label">Удалить файл</span>
                  <SvgIcon name="upload-simple" class="fnone ic16" />
                </button>
              </slot>
            </div>
            <div v-else class="upload-up__btn --btn-add" @click="browseFiles">
              <slot name="btnUpload">
                <button class="btn btn--gray --btn-add">
                  <span class="btn-label">Добавить файл</span>
                  <SvgIcon name="upload-simple" class="fnone ic16" />
                </button>
              </slot>
            </div>
          </div>

          <div class="upload-content">
            <Message
              v-for="message of messages"
              :key="message"
              :class="{ 'mb-8': !files.length && !uploadedFiles.length }"
              severity="error"
            >
              {{ message }}
            </Message>
            <div v-if="files.length == 0" class="upload-empty">
              <div v-if="props.imgDefault" class="img-default-wrapper">
                <img :src="props.imgDefault" alt="defaultPreview" />
              </div>
              <slot name="uploadEmpty">
                <div class="file-text">или перетащите файл для загрузки</div>
                <div class="file-text-types">SVG3 или PNG, 1000x1000 px</div>
              </slot>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-8 pt-4">
          <div v-if="files.length > 0">
            <h5>Pending</h5>
            <div class="flex flex-wrap gap-4">
              <div
                v-for="(file, index) of files"
                :key="file.name + file.type + file.size"
                class="p-8 rounded-border flex flex-col border border-surface items-center gap-4"
              >
                <div>
                  <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" />
                </div>
                <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{
                  file.name
                }}</span>
                <div>{{ formatSize(file.size) }}</div>
                <Badge value="Pending" severity="warn" />
                <Button
                  icon="pi pi-times"
                  outlined
                  rounded
                  severity="danger"
                  @click="onRemoveTemplatingFile(file, removeFileCallback, index)"
                />
              </div>
            </div>
          </div>

          <div v-if="uploadedFiles.length > 0">
            <h5>Completed</h5>
            <div class="flex flex-wrap gap-4">
              <div
                v-for="(file, index) of uploadedFiles"
                :key="file.name + file.type + file.size"
                class="p-8 rounded-border flex flex-col border border-surface items-center gap-4"
              >
                <div>
                  <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" />
                </div>
                <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{
                  file.name
                }}</span>
                <div>{{ formatSize(file.size) }}</div>
                <Badge value="Completed" class="mt-4" severity="success" />
                <Button
                  icon="pi pi-times"
                  outlined
                  rounded
                  severity="danger"
                  @click="removeUploadedFileCallback(index)"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </FileUpload>
  </div>
</template>
