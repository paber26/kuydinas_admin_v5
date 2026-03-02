<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Kelola Tryout</h1>
        <p class="text-slate-500 text-sm">ID Tryout: {{ route.params.id }}</p>
      </div>

      <router-link to="/tryout-builder" class="px-4 py-2 rounded-lg border text-sm">Kembali</router-link>
    </div>

    <!-- Informasi Tryout -->
    <div class="bg-white rounded-xl shadow-sm border p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p class="text-xs text-slate-500">Nama Tryout</p>
          <p class="font-semibold">Tryout SKD Paket {{ route.params.id }}</p>
        </div>

        <div>
          <p class="text-xs text-slate-500">Total Soal</p>
          <p class="font-semibold">{{ questions.length }} Soal</p>
        </div>

        <div>
          <p class="text-xs text-slate-500">Status</p>
          <span class="px-2 py-1 rounded-full text-xs bg-slate-200 text-slate-600">Draft</span>
        </div>
      </div>
    </div>

    <!-- Tombol Tambah Soal -->
    <div class="flex justify-end mb-4">
      <button
        @click="showBankSoal = !showBankSoal"
        class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
      >
        + Tambah Soal dari Bank Soal
      </button>
    </div>

    <!-- Tabel Soal -->
    <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-slate-600">
          <tr>
            <th class="px-4 py-3 text-left">No</th>
            <th class="px-4 py-3 text-left">Kategori</th>
            <th class="px-4 py-3 text-left">Pertanyaan</th>
            <th class="px-4 py-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in questions" :key="item.id" class="border-t hover:bg-slate-50">
            <td class="px-4 py-3">{{ index + 1 }}</td>
            <td class="px-4 py-3">{{ item.category }}</td>
            <td class="px-4 py-3 max-w-md truncate">
              {{ item.question }}
            </td>
            <td class="px-4 py-3">
              <button @click="removeQuestion(index)" class="text-red-600 hover:underline text-xs">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="questions.length === 0" class="text-center text-slate-400 py-10">Belum ada soal dalam tryout ini</div>
    </div>

    <!-- Bank Soal Inline -->
    <div v-if="showBankSoal" class="mt-8 bg-white rounded-xl shadow-sm border p-6">
      <h2 class="text-lg font-semibold mb-4">Pilih Soal dari Bank Soal</h2>

      <div class="space-y-3">
        <div
          v-for="item in bankSoalDummy"
          :key="item.id"
          class="border rounded-lg p-3 flex justify-between items-center"
        >
          <div>
            <p class="text-xs text-slate-500">{{ item.category }}</p>
            <p class="text-sm">{{ item.question }}</p>
          </div>

          <button @click="addQuestion(item)" class="text-purple-600 text-xs hover:underline">Tambahkan</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()

const questions = ref([])

const showBankSoal = ref(false)

const bankSoalDummy = ref([
  { id: 1, category: "TWK", question: "Pancasila ditetapkan pada tanggal..." },
  { id: 2, category: "TWK", question: "Isi dari sila ke-3 Pancasila adalah..." },
  { id: 3, category: "TWK", question: "UUD 1945 pertama kali disahkan pada..." },
  { id: 4, category: "TWK", question: "Makna Bhinneka Tunggal Ika adalah..." },
  { id: 5, category: "TWK", question: "Tujuan nasional dalam Pembukaan UUD 1945 adalah..." },

  { id: 6, category: "TIU", question: "Jika 2, 4, 8, 16 maka angka berikutnya adalah..." },
  { id: 7, category: "TIU", question: "Sinonim dari kata 'abstrak' adalah..." },
  { id: 8, category: "TIU", question: "Antonim dari kata 'optimis' adalah..." },
  { id: 9, category: "TIU", question: "Jika semua A adalah B dan semua B adalah C, maka..." },
  { id: 10, category: "TIU", question: "Deret angka 3, 6, 12, 24, ... berikutnya adalah..." },

  { id: 11, category: "TKP", question: "Saat rekan kerja melakukan kesalahan, Anda akan..." },
  { id: 12, category: "TKP", question: "Jika atasan memberi tugas mendadak, Anda..." },
  { id: 13, category: "TKP", question: "Ketika terjadi konflik dalam tim, Anda..." },
  { id: 14, category: "TKP", question: "Jika target pekerjaan tidak tercapai, Anda..." },
  { id: 15, category: "TKP", question: "Saat menghadapi tekanan kerja tinggi, Anda..." },

  { id: 16, category: "TWK", question: "Lambang negara Indonesia adalah..." },
  { id: 17, category: "TIU", question: "Jika 5 orang menyelesaikan pekerjaan dalam 10 hari..." },
  { id: 18, category: "TKP", question: "Ketika diminta membantu rekan kerja di luar tugas Anda..." },
  { id: 19, category: "TWK", question: "Sistem pemerintahan Indonesia menganut sistem..." },
  { id: 20, category: "TIU", question: "Pola gambar yang tepat untuk melanjutkan seri adalah..." }
])

function addQuestion(item) {
  questions.value.push(item)
}

function removeQuestion(index) {
  questions.value.splice(index, 1)
}
</script>

<style scoped>
table th {
  font-weight: 600;
}
</style>
