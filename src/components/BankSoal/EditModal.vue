<template>
  <div
    v-if="modelValue && localForm"
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
  >
    <div
      class="bg-white w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto"
    >
      <h2 class="text-lg font-bold mb-6">Edit Soal</h2>

      <!-- PERTANYAAN -->
      <div class="mb-4">
        <label class="text-sm font-medium">Pertanyaan</label>
        <textarea
          v-model="localForm.question"
          class="w-full border px-3 py-2 rounded-lg mt-1"
          rows="3"
        ></textarea>
      </div>

      <!-- SUBKATEGORI -->
      <div class="mb-4">
        <label class="text-sm font-medium">Subkategori</label>
        <input
          v-model="localForm.sub_category"
          class="w-full border px-3 py-2 rounded-lg mt-1"
        />
      </div>

      <!-- DIFFICULTY -->
      <div class="mb-4">
        <label class="text-sm font-medium">Tingkat Kesulitan</label>
        <select
          v-model="localForm.difficulty"
          class="w-full border px-3 py-2 rounded-lg mt-1"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>

      <!-- OPSI JAWABAN -->
      <div class="mb-6">
        <label class="text-sm font-medium mb-2 block"> Opsi Jawaban </label>

        <div
          v-for="(option, index) in localForm.options"
          :key="index"
          class="flex items-center gap-3 mb-3 border rounded-lg p-3"
        >
          <span class="font-semibold w-6">
            {{ option.label }}
          </span>

          <input
            v-model="option.text"
            class="flex-1 border px-3 py-2 rounded-lg"
          />

          <!-- TWK / TIU -->
          <template v-if="localForm.category !== 'TKP'">
            <input
              type="radio"
              :value="option.label"
              v-model="localForm.correct_answer"
            />
          </template>

          <!-- TKP -->
          <template v-else>
            <input
              v-model.number="option.score"
              type="number"
              min="1"
              max="5"
              class="w-16 border px-2 py-1 rounded-lg"
            />
          </template>
        </div>
      </div>

      <!-- PEMBAHASAN -->
      <div class="mb-4">
        <label class="text-sm font-medium">Pembahasan</label>
        <textarea
          v-model="localForm.explanation"
          class="w-full border px-3 py-2 rounded-lg mt-1"
          rows="3"
        ></textarea>
      </div>

      <!-- ACTION -->
      <div class="flex justify-end gap-3 mt-6">
        <button
          @click="$emit('update:modelValue', false)"
          class="border px-4 py-2 rounded-lg text-sm"
        >
          Batal
        </button>

        <button
          @click="submit"
          class="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Simpan
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: Boolean,
  soal: Object,
});

const emit = defineEmits(["update:modelValue", "update"]);

const localForm = ref(null);

watch(
  () => props.soal,
  (newVal) => {
    if (newVal) {
      localForm.value = JSON.parse(JSON.stringify(newVal));
    }
  },
  { immediate: true },
);

function submit() {
  emit("update", localForm.value);
}
</script>
