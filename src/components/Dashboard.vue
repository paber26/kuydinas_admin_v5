<template>
  <!-- Content -->
  <main class="p-6">
    <!-- KPI Cards -->
    <section class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs text-slate-400">Pengguna Aktif</div>
            <div class="text-2xl font-semibold">1,248</div>
          </div>
          <div class="p-2 bg-emerald-100 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-emerald-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
        <div class="text-xs text-slate-400 mt-3">+3.2% dari minggu lalu</div>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs text-slate-400">Tryout Hari Ini</div>
            <div class="text-2xl font-semibold">24</div>
          </div>
          <div class="p-2 bg-indigo-100 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-indigo-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3"
              />
            </svg>
          </div>
        </div>
        <div class="text-xs text-slate-400 mt-3">+1.1% dari kemarin</div>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs text-slate-400">Pendaftar Baru</div>
            <div class="text-2xl font-semibold">312</div>
          </div>
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-yellow-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 12h14"
              />
            </svg>
          </div>
        </div>
        <div class="text-xs text-slate-400 mt-3">+8.6% bulan ini</div>
      </div>

      <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs text-slate-400">Pendapatan</div>
            <div class="text-2xl font-semibold">Rp 18,450,000</div>
          </div>
          <div class="p-2 bg-pink-100 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-pink-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3v18h18"
              />
            </svg>
          </div>
        </div>
        <div class="text-xs text-slate-400 mt-3">+12.4% bulan lalu</div>
      </div>
    </section>

    <!-- Section: Sedang Mengerjakan -->
    <section
      class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6"
    >
      <h3 class="font-semibold mb-3">Sedang Mengerjakan</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="text-slate-500 text-xs text-left bg-slate-50">
            <tr>
              <th class="py-3 pr-6">Nama Akun</th>
              <th class="py-3 pr-6">Try Out</th>
              <th class="py-3 pr-6">Jumlah Koin</th>
              <th class="py-3 pr-6">Jam Mulai</th>
            </tr>
          </thead>
          <tbody class="text-slate-700 bg-white">
            <tr class="border-t">
              <td class="py-3 flex items-center gap-3">
                <img
                  src="../mnt/data/ADCD5DD8-A0A1-4C40-A2D9-63D9E2449E55.jpeg"
                  alt="avatar Robert Clinton"
                  class="w-9 h-9 rounded-full"
                />
                <div>
                  <div class="font-medium">Robert Clinton</div>
                  <div class="text-xs text-slate-400">ID: 2381</div>
                </div>
              </td>
              <td class="py-3">Samsung</td>
              <td class="py-3">$38,536</td>
              <td class="py-3">Smart Phone</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Section: Asal Provinsi Peserta -->
    <section
      class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mt-6"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-semibold">Asal Provinsi Peserta</h3>
        <p class="text-xs text-slate-400">
          Ringkasan jumlah peserta yang mendaftar berdasarkan provinsi asal.
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="text-slate-500 text-xs text-left bg-slate-50">
            <tr>
              <th
                class="py-3 pr-6 text-center cursor-pointer select-none"
                @click="sortData('provinsi')"
              >
                Provinsi
                <span v-if="sortBy === 'provinsi'">
                  {{ sortDir === "asc" ? "▲" : "▼" }}
                </span>
              </th>

              <th
                class="py-3 pr-6 text-center cursor-pointer select-none"
                @click="sortData('jumlah')"
              >
                Jumlah Peserta
                <span v-if="sortBy === 'jumlah'">
                  {{ sortDir === "asc" ? "▲" : "▼" }}
                </span>
              </th>
            </tr>
          </thead>
          <tbody class="text-slate-700 bg-white">
            <tr
              v-for="row in provinsiStats"
              :key="row.kode || row.nama || row.provinsi"
              class="border-t"
            >
              <td class="py-3 text-center">
                {{ row.nama || row.provinsi || "-" }}
              </td>
              <td class="py-3 text-center font-medium">
                {{
                  row.jumlah?.toLocaleString?.() ||
                  row.total?.toLocaleString?.() ||
                  row.count?.toLocaleString?.() ||
                  row.jumlah ||
                  row.total ||
                  row.count ||
                  0
                }}
              </td>
            </tr>
            <tr v-if="!provinsiStats.length">
              <td class="py-3 text-xs text-slate-400" colspan="2">
                Belum ada data provinsi. Silakan hubungkan ke API peserta atau
                isi data secara manual di variabel <code>provinsiStats</code>.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";

const provinsiStats = ref([]);

const sortBy = ref("provinsi"); // or 'jumlah'
const sortDir = ref("asc");

function sortData(key) {
  if (sortBy.value === key) {
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = key;
    sortDir.value = "asc";
  }

  provinsiStats.value = [...provinsiStats.value].sort((a, b) => {
    const valA =
      key === "provinsi"
        ? (a.nama || a.provinsi || "").toString().toLowerCase()
        : Number(a.jumlah || a.total || a.count || 0);
    const valB =
      key === "provinsi"
        ? (b.nama || b.provinsi || "").toString().toLowerCase()
        : Number(b.jumlah || b.total || b.count || 0);

    if (valA < valB) return sortDir.value === "asc" ? -1 : 1;
    if (valA > valB) return sortDir.value === "asc" ? 1 : -1;
    return 0;
  });
}

onMounted(async () => {
  try {
    const resp = await api.get("/getakunperprovinsi");
    provinsiStats.value = resp.data || [];
    sortData(sortBy.value);
  } catch (e) {
    console.error("Error fetch provinsi:", e);
    provinsiStats.value = [];
  }
});
</script>
