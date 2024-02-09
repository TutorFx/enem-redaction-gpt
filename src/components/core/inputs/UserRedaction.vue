<template>
    <div class="w-full rounded-sm bg-stone-50 p-12">
        <ClientOnly>
            <CoreHandlersTiptap v-model="state" />
            <template #fallback>
                <div>
                    
                </div>
            </template>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: string }>();
const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const state = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits("update:modelValue", value);
  },
});
</script>