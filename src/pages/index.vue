<template>
  <div>
    <div class="mx-auto grid min-h-screen w-full max-w-2xl items-center py-12">
      <div v-if="Step == Steps.ChooseInput">
        <div class="grid gap-3">
          <h1 class="text-center">
            Para avançar escolha como inserir seu texto:
          </h1>
          <div>
            <div class="mx-auto grid max-w-lg grid-flow-col gap-3">
              <div>
                <CoreHandlersDropzone v-model="files" />
              </div>
              <div class="grid items-center">
                <div>
                  <UButton block @click="Step = Steps.TextField"> Ou digitar </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="Step == Steps.TextField">
        <div class="grid gap-3">
          <div class="grid grid-cols-[max-content_1fr]">
            <UToggle v-model="toggle" />
            <UInput v-model="proposal" placeholder="proposta" :disabled="!toggle" />
          </div>
          <CoreInputsUserRedaction v-model="redaction" />
          <div>
            <UButton color="primary" variant="solid" @click="sendText">Solicitar Análise</UButton>
          </div>
        </div>
      </div>
      <div v-else-if="Step == Steps.Result && analysis" class="grid gap-3">
        <div>
          {{ analysis.recomendations }}
        </div>
        <div class="grid gap-3">
          <div
            v-for="(item, i) in analysis.reportcard" :key="i"
            class="border-2 border-dashed border-primary-200 p-4">
            <div class="grid grid-cols-[1fr_max-content]">
              <div>
                {{ item.field }}
              </div>
              <div>
                {{ item.grade }} / 200
              </div>
            </div>
          </div>
        </div>
        <div class="grid gap-3">
          <div
            v-for="(item, i) in analysis.insights" :key="i"
            class="border-2 border-dashed border-blue-200 p-4">
            <div class="grid grid-cols-[1fr_max-content]">
              <div>
                {{ item.field }}
              </div>
              <div>
                {{ item.message }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ITextAnalysis } from '@/server/utils/schemas'
import type { OpenaiJsonResponse, OpenaiResponse } from '~/types';

const redaction = ref("")
const proposal = ref("")
const toggle = ref(false)
const analysis = ref<OpenaiJsonResponse | null>(null)

enum Steps {
  ChooseInput,
  TextField,
  Result
}

const Step = ref<Steps>(Steps.ChooseInput)

const files = ref<File[]>([])

const sendText = async () => {
  const response = await $fetch<OpenaiResponse>("/api/text-analysis", {
    method: "POST",
    body: {
      redaction: redaction.value,
      proposal: toggle.value ? proposal.value : null
    } as ITextAnalysis
  });

  analysis.value = useAiContent(response.choices.at(0)?.message.content ?? "")
  Step.value = Steps.Result
}

watch(() => files.value.length, (len) => {
  if (len <= 0) {
    return;
  }
  const file = files.value.at(0) as File
  const body = new FormData();
  body.append("file", file)
  $fetch<OpenaiResponse>('/api/image-transcript', {
    method: "POST",
    body,
  }).then((response) => {
    redaction.value = response.choices.at(0)?.message.content ?? ""
    Step.value = Steps.TextField
  })
})
</script>