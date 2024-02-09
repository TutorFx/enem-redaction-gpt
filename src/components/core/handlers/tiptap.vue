<template>
  <div>
    <EditorContent :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { EditorContent, useEditor } from "@tiptap/vue-3";
import { Placeholder } from '@tiptap/extension-placeholder';
import { StarterKit } from "@tiptap/starter-kit";

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const state = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const editor = useEditor({
  content: state.value,
  editorProps: {
    attributes: {
      class: "w-full prose focus:outline-none mx-auto min-6xl",
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: 'Digite sua redação...',
    }),
  ],
});
</script>

<style>
.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}
</style>