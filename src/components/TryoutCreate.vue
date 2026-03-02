<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Tambah Tryout</h1>
      <p class="text-slate-500 text-sm">Buat paket tryout baru dengan mengambil soal dari Bank Soal</p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border p-6 space-y-8">
      <!-- Informasi Dasar -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="text-sm font-medium text-slate-700">Nama Tryout</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full mt-2 border rounded-lg px-3 py-2 text-sm"
            placeholder="Contoh: Tryout SKD Paket 1"
          />
        </div>

        <div>
          <label class="text-sm font-medium text-slate-700">Durasi (menit)</label>
          <input
            v-model.number="form.duration"
            type="number"
            class="w-full mt-2 border rounded-lg px-3 py-2 text-sm"
            placeholder="Contoh: 100"
          />
        </div>
      </div>

      <!-- Komposisi Soal -->
      <div>
        <h2 class="text-lg font-semibold text-slate-800 mb-4">Komposisi Soal</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="border rounded-xl p-4">
            <h3 class="font-semibold text-purple-600 mb-3">TWK</h3>
            <label class="text-xs text-slate-500">Jumlah Soal</label>
            <input
              v-model.number="form.twk_count"
              type="number"
              class="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div class="border rounded-xl p-4">
            <h3 class="font-semibold text-purple-600 mb-3">TIU</h3>
            <label class="text-xs text-slate-500">Jumlah Soal</label>
            <input
              v-model.number="form.tiu_count"
              type="number"
              class="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div class="border rounded-xl p-4">
            <h3 class="font-semibold text-purple-600 mb-3">TKP</h3>
            <label class="text-xs text-slate-500">Jumlah Soal</label>
            <input
              v-model.number="form.tkp_count"
              type="number"
              class="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      <!-- Passing Grade -->
      <div>
        <h2 class="text-lg font-semibold text-slate-800 mb-4">Passing Grade</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="text-xs text-slate-500">TWK</label>
            <input v-model.number="form.twk_pg" type="number" class="w-full mt-1 border rounded-lg px-3 py-2 text-sm" />
          </div>

          <div>
            <label class="text-xs text-slate-500">TIU</label>
            <input v-model.number="form.tiu_pg" type="number" class="w-full mt-1 border rounded-lg px-3 py-2 text-sm" />
          </div>

          <div>
            <label class="text-xs text-slate-500">TKP</label>
            <input v-model.number="form.tkp_pg" type="number" class="w-full mt-1 border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
      </div>

      <!-- Ringkasan -->
      <div class="bg-slate-50 border rounded-xl p-4">
        <h3 class="font-semibold text-slate-700 mb-2">Ringkasan</h3>
        <p class="text-sm text-slate-600">Total Soal: {{ totalQuestions }} soal</p>
        <p class="text-sm text-slate-600">
          Estimasi Skor Maksimum:
          {{ (form.twk_count + form.tiu_count) * 5 + form.tkp_count * 5 }}
        </p>
      </div>

      <!-- Action -->
      <div class="flex justify-end gap-3 pt-4 border-t">
        <router-link to="/tryout-builder" class="px-4 py-2 rounded-lg border text-sm">Batal</router-link>

        <button @click="submitForm" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm">
          Simpan Tryout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue"

const form = reactive({
  name: "",
  duration: 100,
  twk_count: 30,
  tiu_count: 35,
  tkp_count: 45,
  twk_pg: 65,
  tiu_pg: 80,
  tkp_pg: 166
})

const totalQuestions = computed(() => {
  return form.twk_count + form.tiu_count + form.tkp_count
})

function submitForm() {
  console.log("Data Tryout Baru:", JSON.parse(JSON.stringify(form)))
  alert("Tryout berhasil dibuat (sementara console.log dulu)")
}
</script>

<style scoped>
input {
  outline: none;
}
</style>
