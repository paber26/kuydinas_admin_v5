<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Daftar Tryout</h1>
        <p class="text-slate-500 text-sm">Kelola semua paket tryout yang dibuat dari Bank Soal</p>
      </div>

      <router-link
        to="/tryout-builder/create"
        class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
      >
        + Tambah Tryout
      </router-link>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-slate-600">
          <tr>
            <th class="px-4 py-3 text-left">No</th>
            <th class="px-4 py-3 text-left">Nama Tryout</th>
            <th class="px-4 py-3 text-left">Total Soal</th>
            <th class="px-4 py-3 text-left">Durasi</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in dummyTryouts" :key="item.id" class="border-t hover:bg-slate-50">
            <td class="px-4 py-3">{{ index + 1 }}</td>
            <td class="px-4 py-3 font-medium">{{ item.name }}</td>
            <td class="px-4 py-3">{{ item.total }} soal</td>
            <td class="px-4 py-3">{{ item.duration }} menit</td>
            <td class="px-4 py-3">
              <span
                class="px-2 py-1 rounded-full text-xs"
                :class="item.active ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-600'"
              >
                {{ item.active ? "Aktif" : "Draft" }}
              </span>
            </td>
            <td class="px-4 py-3 flex gap-2">
              <router-link :to="`/tryout-builder/${item.id}`" class="text-blue-600 hover:underline text-xs">
                Detail
              </router-link>
              <button class="text-yellow-600 hover:underline text-xs">Edit</button>
              <button class="text-red-600 hover:underline text-xs">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="dummyTryouts.length === 0" class="text-center text-slate-400 py-10">Belum ada tryout yang dibuat</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const dummyTryouts = ref([
  {
    id: 1,
    name: "Tryout SKD Paket 1",
    total: 110,
    duration: 100,
    active: true
  },
  {
    id: 2,
    name: "Tryout SKD Latihan TWK Fokus",
    total: 50,
    duration: 60,
    active: false
  }
])
</script>

<style scoped>
table th {
  font-weight: 600;
}
</style>
