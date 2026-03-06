<template>
  <div
    v-if="modelValue && soal"
    class="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-6"
  >
    <div
      class="bg-white w-full max-w-6xl rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto"
    >
      <!-- ================= HEADER ================= -->
      <div
        class="flex justify-between items-start px-10 py-7 border-b bg-gradient-to-r from-slate-50 to-white rounded-t-3xl"
      >
        <div>
          <h2 class="text-3xl font-bold text-slate-800 tracking-tight">
            Detail Soal
          </h2>
          <p class="text-sm text-slate-500 mt-2">
            Informasi lengkap soal dari Bank Soal
          </p>

          <!-- BADGES -->
          <div class="flex gap-3 mt-4">
            <span
              class="px-3 py-1 text-xs rounded-full font-semibold"
              :class="{
                'bg-blue-100 text-blue-700': soal.category === 'TWK',
                'bg-green-100 text-green-700': soal.category === 'TIU',
                'bg-orange-100 text-orange-700': soal.category === 'TKP',
              }"
            >
              {{ soal.category }}
            </span>

            <span
              class="px-3 py-1 text-xs rounded-full bg-slate-200 text-slate-700 font-medium"
            >
              {{ soal.difficulty || "Tanpa Kesulitan" }}
            </span>

            <span
              class="px-3 py-1 text-xs rounded-full font-medium"
              :class="{
                'bg-emerald-100 text-emerald-700': soal.status === 'aktif',
                'bg-gray-200 text-gray-600': soal.status !== 'aktif',
              }"
            >
              {{ soal.status || "-" }}
            </span>
          </div>
        </div>

        <button
          @click="$emit('update:modelValue', false)"
          class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-slate-100 transition text-lg"
        >
          ✕
        </button>
      </div>

      <!-- ================= CONTENT ================= -->
      <div class="p-10 space-y-12">
        <!-- INFO GRID -->
        <div class="grid md:grid-cols-3 gap-6 text-sm">
          <div class="bg-slate-50 rounded-2xl p-6">
            <p class="text-xs text-slate-500">Subkategori</p>
            <p class="mt-2 font-semibold text-slate-800">
              {{ soal.sub_category || "-" }}
            </p>
          </div>

          <div class="bg-slate-50 rounded-2xl p-6">
            <p class="text-xs text-slate-500">ID Soal</p>
            <p class="mt-2 font-semibold text-slate-800">
              {{ soal.id }}
            </p>
          </div>

          <div v-if="soal.created_at" class="bg-slate-50 rounded-2xl p-6">
            <p class="text-xs text-slate-500">Dibuat Pada</p>
            <p class="mt-2 font-semibold text-slate-800">
              {{ new Date(soal.created_at).toLocaleString() }}
            </p>
          </div>
        </div>

        <!-- ================= PERTANYAAN ================= -->
        <div>
          <h3 class="text-lg font-semibold text-slate-700 mb-4">Pertanyaan</h3>

          <div
            class="border rounded-2xl px-8 py-6 bg-slate-50 text-slate-800 leading-relaxed text-[16px]"
            v-html="renderLatex(soal.question)"
          ></div>
        </div>

        <!-- ================= OPSI JAWABAN ================= -->
        <div>
          <h3 class="text-lg font-semibold text-slate-700 mb-6">
            Opsi Jawaban
          </h3>

          <div
            v-for="(option, index) in soal.options || []"
            :key="index"
            class="flex items-start gap-5 border rounded-2xl px-8 py-5 mb-5 transition-all duration-200 hover:shadow-md"
            :class="{
              'border-green-500 bg-green-50':
                soal.category !== 'TKP' && option.label === soal.correct_answer,

              'border-purple-500 bg-purple-50':
                soal.category === 'TKP' && option.score === maxScore,
            }"
          >
            <div
              class="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200 text-slate-700 font-semibold"
            >
              {{ option.label }}
            </div>

            <div
              class="flex-1 text-slate-800 text-sm leading-relaxed"
              v-html="renderLatex(option.text)"
            ></div>

            <!-- TWK / TIU -->
            <div
              v-if="
                soal.category !== 'TKP' && option.label === soal.correct_answer
              "
              class="text-green-600 text-xs font-bold"
            >
              ✔ Jawaban Benar
            </div>

            <!-- TKP -->
            <div
              v-if="soal.category === 'TKP'"
              class="text-xs bg-slate-200 px-3 py-1 rounded-lg text-slate-700 font-medium"
            >
              Skor {{ option.score }}
            </div>
          </div>

          <p v-if="soal.category === 'TKP'" class="text-xs text-slate-500 mt-2">
            Opsi dengan skor tertinggi ditandai sebagai pilihan terbaik.
          </p>
        </div>

        <!-- ================= PEMBAHASAN ================= -->
        <div v-if="soal.explanation">
          <h3 class="text-lg font-semibold text-slate-700 mb-4">Pembahasan</h3>

          <div
            class="border border-indigo-100 rounded-2xl px-8 py-6 bg-indigo-50 text-slate-800 text-sm leading-relaxed"
            v-html="renderLatex(soal.explanation)"
          ></div>
        </div>
      </div>

      <!-- ================= FOOTER ================= -->
      <div
        class="flex justify-end px-10 py-6 border-t bg-slate-50 rounded-b-3xl"
      >
        <button
          @click="$emit('update:modelValue', false)"
          class="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-8 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import katex from "katex";
import "katex/dist/katex.min.css";

const props = defineProps({
  modelValue: Boolean,
  soal: Object,
});

/* ========================
   MAX SCORE (FOR TKP)
======================== */
const maxScore = computed(() => {
  if (!props.soal || !props.soal.options) return null;

  const scores = props.soal.options
    .map((o) => o.score)
    .filter((s) => typeof s === "number");

  if (!scores.length) return null;

  return Math.max(...scores);
});

function renderLatex(text) {
  if (!text) return "";

  return text.replace(/\$(.*?)\$/g, (_, formula) => {
    try {
      return katex.renderToString(formula, { throwOnError: false });
    } catch {
      return formula;
    }
  });
}
</script>
