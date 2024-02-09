<template>
  <div>
    <div @drop.prevent="drop" @change="selectedFile">
      <div
        :class="{ 'active-dropzone': active }"
        class="dropzone"
        @dragenter.prevent="toggleActive"
        @dragleave.prevent="toggleActive"
        @dragover.prevent
        @drop.prevent="toggleActive"
      >
        <span>Arraste uma foto</span>
        <span>ou</span>
        <label for="file" class="btn btn-primary btn-sm rounded-md"
          >Selecione sua foto</label
        >
        <input
          id="file"
          ref="dropRef"
          type="file"
          :multiple="true"
          class="modelValue"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  modelValue: Array<File>;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: Array<File>): void;
}>();
const modelValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits("update:modelValue", value);
  },
});

const dropRef = ref<HTMLInputElement>();

const active = ref(false);
const toggleActive = () => {
  active.value = !active.value;
};

const drop = (e: DragEvent) => {
  if (e.dataTransfer) {
    Array.prototype.forEach.call(e.dataTransfer.files, function (file) {
      if (!(file instanceof File)) {
        return console.error("Not a valid File");
      }
      if (!file.type.startsWith("image/")) {
        return console.error("The selected file is not an image!");
      }
      if (file.size > 5242880) {
        return console.error("The dropped file is larger than 5MB!");
      }
      modelValue.value.push(file);
    });
  }
};
const selectedFile = () => {
  try {
    if (dropRef.value) {
      Array.prototype.forEach.call(dropRef.value.files, function (file) {
        if (!(file instanceof File)) {
          return console.error("Not a valid File");
        }
        if (!file.type.startsWith("image/")) {
          return console.error("The selected file is not an image!");
        }
        if (file.size > 5242880) {
          return console.error("The dropped file is larger than 5MB!");
        }
        modelValue.value.push(file);
      });
    }
  } catch (e) {
    console.error("Selection stopped by user.");
  }
};
// emit to parent on change
</script>

<style scoped lang="scss">
.dropzone {
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 16px;
  @apply border-dashed border-2 rounded-xl bg-blue-100 border-blue-300;
  transition: 0.3s ease all;

  label {
    padding: 8px 12px;
    color: #fff;
    @apply bg-primary;
    transition: 0.3s ease all;
  }

  input {
    display: none;
  }
}

.active-dropzone {
  color: #fff;
  border-color: #fff;
  @apply bg-primary border-none;

  label {
    background-color: #fff;
    @apply text-black;
  }
}
</style>
