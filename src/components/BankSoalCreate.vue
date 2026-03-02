<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Tambah Soal SKD</h1>
      <p class="text-slate-500 text-sm">Tambahkan soal baru untuk TWK, TIU, atau TKP</p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border p-6 space-y-6">
      <!-- Kategori -->
      <div>
        <label class="text-sm font-medium text-slate-700">Kategori</label>
        <select v-model="form.category" class="w-full mt-2 border rounded-lg px-3 py-2 text-sm">
          <option value="">Pilih Kategori</option>
          <option value="TWK">TWK</option>
          <option value="TIU">TIU</option>
          <option value="TKP">TKP</option>
        </select>
      </div>

      <!-- Subkategori -->
      <div>
        <label class="text-sm font-medium text-slate-700">Subkategori</label>
        <input
          v-model="form.sub_category"
          type="text"
          class="w-full mt-2 border rounded-lg px-3 py-2 text-sm"
          placeholder="Contoh: Pancasila"
        />
      </div>

      <!-- Tingkat Kesulitan -->
      <div>
        <label class="text-sm font-medium text-slate-700">Tingkat Kesulitan</label>
        <select v-model="form.difficulty" class="w-full mt-2 border rounded-lg px-3 py-2 text-sm">
          <option value="">Pilih Kesulitan</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <!-- Pertanyaan -->
      <div>
        <label class="text-sm font-medium text-slate-700">Pertanyaan</label>
        <textarea
          v-model="form.question"
          rows="4"
          class="w-full mt-2 border rounded-lg px-3 py-2 text-sm"
          placeholder="Masukkan pertanyaan soal..."
        ></textarea>
      </div>

      <!-- Opsi Jawaban -->
      <div>
        <label class="text-sm font-medium text-slate-700 mb-2 block">Opsi Jawaban</label>

        <div v-for="(option, index) in form.options" :key="index" class="flex items-center gap-3 mb-3">
          <span class="w-6 font-semibold">
            {{ option.label }}
          </span>

          <input
            v-model="option.text"
            type="text"
            class="flex-1 border rounded-lg px-3 py-2 text-sm"
            placeholder="Isi opsi jawaban"
          />

          <!-- Jika TWK/TIU -->
          <template v-if="form.category !== 'TKP'">
            <input type="radio" :value="option.label" v-model="form.correct_answer" />
          </template>

          <!-- Jika TKP -->
          <template v-else>
            <input
              v-model.number="option.score"
              type="number"
              min="1"
              max="5"
              class="w-16 border rounded-lg px-2 py-1 text-sm"
              placeholder="Skor"
            />
          </template>
        </div>

        <p v-if="form.category === 'TKP'" class="text-xs text-slate-500 mt-2">
          Untuk TKP, setiap opsi harus memiliki skor (1–5).
        </p>

        <p v-else class="text-xs text-slate-500 mt-2">Pilih satu jawaban yang benar.</p>
      </div>

      <!-- Pembahasan -->
      <div>
        <label class="text-sm font-medium text-slate-700">Pembahasan</label>
        <textarea
          v-model="form.explanation"
          rows="3"
          class="w-full mt-2 border rounded-lg px-3 py-2 text-sm"
          placeholder="Masukkan pembahasan soal..."
        ></textarea>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-4 border-t">
        <router-link to="/banksoal" class="px-4 py-2 rounded-lg border text-sm">Batal</router-link>

        <button @click="submitForm" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm">
          Simpan Soal
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue"

const form = reactive({
  category: "",
  sub_category: "",
  difficulty: "",
  question: "",
  correct_answer: "",
  explanation: "",
  options: [
    { label: "A", text: "", score: 0 },
    { label: "B", text: "", score: 0 },
    { label: "C", text: "", score: 0 },
    { label: "D", text: "", score: 0 },
    { label: "E", text: "", score: 0 }
  ]
})

function submitForm() {
  console.log("Data Soal:", JSON.parse(JSON.stringify(form)))
  alert("Soal berhasil disimpan (sementara console.log dulu)")
}
</script>

<style scoped>
textarea {
  resize: none;
}
</style>
