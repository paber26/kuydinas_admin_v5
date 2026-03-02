<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Bank Soal SKD</h1>
        <p class="text-slate-500 text-sm">Kelola soal TWK, TIU, dan TKP untuk tryout CPNS</p>
      </div>

      <router-link
        to="/banksoal/create"
        class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
      >
        + Tambah Soal
      </router-link>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="item in categories"
        :key="item"
        @click="activeTab = item"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium',
          activeTab === item ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        ]"
      >
        {{ item }}
      </button>
    </div>

    <!-- Filter Section -->
    <div class="bg-white rounded-xl shadow-sm border p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="text-xs text-slate-500">Subkategori</label>
          <input type="text" class="w-full mt-1 border rounded-lg px-3 py-2 text-sm" placeholder="Contoh: Pancasila" />
        </div>

        <div>
          <label class="text-xs text-slate-500">Tingkat Kesulitan</label>
          <select class="w-full mt-1 border rounded-lg px-3 py-2 text-sm">
            <option value="">Semua</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div>
          <label class="text-xs text-slate-500">Status</label>
          <select class="w-full mt-1 border rounded-lg px-3 py-2 text-sm">
            <option value="">Semua</option>
            <option>Aktif</option>
            <option>Nonaktif</option>
          </select>
        </div>

        <div class="flex items-end">
          <button class="w-full bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-sm">Filter</button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-slate-600">
          <tr>
            <th class="px-4 py-3 text-left">No</th>
            <th class="px-4 py-3 text-left">Soal</th>
            <th class="px-4 py-3 text-left">Subkategori</th>
            <th class="px-4 py-3 text-left">Kesulitan</th>
            <th class="px-4 py-3 text-left">Digunakan</th>
            <th class="px-4 py-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in dummyQuestions" :key="item.id" class="border-t hover:bg-slate-50">
            <td class="px-4 py-3">{{ index + 1 }}</td>
            <td class="px-4 py-3 max-w-md truncate">
              {{ item.question }}
            </td>
            <td class="px-4 py-3">{{ item.sub_category }}</td>
            <td class="px-4 py-3">
              <span
                class="px-2 py-1 rounded-full text-xs"
                :class="{
                  'bg-green-100 text-green-600': item.difficulty === 'Easy',
                  'bg-yellow-100 text-yellow-600': item.difficulty === 'Medium',
                  'bg-red-100 text-red-600': item.difficulty === 'Hard'
                }"
              >
                {{ item.difficulty }}
              </span>
            </td>
            <td class="px-4 py-3">{{ item.used }}</td>
            <td class="px-4 py-3 flex gap-2">
              <button class="text-blue-600 hover:underline text-xs">Preview</button>
              <button class="text-yellow-600 hover:underline text-xs">Edit</button>
              <button class="text-red-600 hover:underline text-xs">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="dummyQuestions.length === 0" class="text-center text-slate-400 py-10">
        Belum ada soal pada kategori ini
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const categories = ["TWK", "TIU", "TKP"]
const activeTab = ref("TWK")

const dummyQuestions = ref([
  {
    id: 1,
    question: "Pancasila sebagai dasar negara ditetapkan pada tanggal...",
    sub_category: "Sejarah",
    difficulty: "Easy",
    used: 12
  },
  {
    id: 2,
    question: "Jika 2, 4, 8, 16, maka angka berikutnya adalah...",
    sub_category: "Deret Angka",
    difficulty: "Medium",
    used: 8
  }
])
</script>

<style scoped>
table th {
  font-weight: 600;
}
</style>
