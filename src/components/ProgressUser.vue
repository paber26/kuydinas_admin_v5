<template>
  <div class="min-h-full bg-slate-50">
    <div class="max-w-6xl mx-auto space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <section
        class="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"
      >
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex flex-col gap-1">
            <p class="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Admin: User Aktif
            </p>
            <h1 class="text-xl font-semibold text-slate-800 sm:text-2xl">
              User Sedang Mengerjakan Tryout
            </h1>
            <p class="text-xs text-slate-600 sm:text-sm">
              Pantau secara langsung siapa saja yang sedang mengerjakan tryout.
            </p>
          </div>

          <button
            @click="loadProgress"
            :disabled="loading"
            class="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              class="h-4 w-4 transition-transform"
              :class="{ 'animate-spin': loading }"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {{ loading ? 'Memuat...' : 'Refresh Data' }}
          </button>
        </div>

        <!-- Ringkasan -->
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500">Total User Aktif</p>
              <p class="text-2xl font-bold text-slate-800">{{ progressData.length }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500">Waktu Hampir Habis</p>
              <p class="text-2xl font-bold text-amber-600">{{ almostExpiredCount }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500">Rata-rata Progress</p>
              <p class="text-2xl font-bold text-emerald-600">{{ averageProgress }}%</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Error -->
      <div
        v-if="errorMessage"
        class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
      >
        {{ errorMessage }}
      </div>

      <!-- Loading Skeleton -->
      <section v-if="loading && !progressData.length" class="space-y-3">
        <div
          v-for="i in 4"
          :key="i"
          class="h-20 animate-pulse rounded-2xl border border-slate-200 bg-white"
        ></div>
      </section>

      <!-- Tabel Data -->
      <section
        class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"
      >
        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-sm font-semibold text-slate-700">
            Daftar User Sedang Mengerjakan
          </h2>

          <div v-if="progressData.length" class="relative w-full sm:w-64">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama atau tryout..."
              class="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
            >
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="!loading && !progressData.length"
          class="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center"
        >
          <svg class="mx-auto h-12 w-12 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <p class="mt-3 text-sm font-medium text-slate-500">Tidak ada user yang sedang mengerjakan tryout saat ini.</p>
          <p class="mt-1 text-xs text-slate-400">Data akan muncul ketika ada user yang memulai tryout.</p>
        </div>

        <!-- Tabel -->
        <div v-else-if="!loading || progressData.length" class="overflow-x-auto rounded-xl border border-slate-200">
          <table class="w-full border-collapse text-xs sm:text-sm">
            <thead class="sticky top-0 bg-slate-100 text-slate-700 shadow-sm z-10">
              <tr>
                <th class="px-3 py-3 text-left">No</th>
                <th class="px-3 py-3 text-left">User</th>
                <th class="px-3 py-3 text-left">Tryout</th>
                <th class="px-3 py-3 text-center">Progress</th>
                <th class="px-3 py-3 text-center">Dijawab</th>
                <th class="px-3 py-3 text-center">Sisa Waktu</th>
                <th class="px-3 py-3 text-center">Mulai</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!filteredData.length && searchQuery">
                <td colspan="7" class="py-8 text-center text-sm text-slate-400 bg-white">
                  Pencarian "{{ searchQuery }}" tidak ditemukan.
                </td>
              </tr>
              <tr
                v-for="(row, index) in paginatedData"
                :key="row.id"
                class="border-b bg-white hover:bg-slate-50/50 transition-colors"
              >
                <td class="px-3 py-3 text-slate-500">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                <td class="px-3 py-3">
                  <div class="flex items-center gap-2">
                    <div class="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold shrink-0">
                      {{ getInitials(row.user.name) }}
                    </div>
                    <div class="min-w-0">
                      <p class="font-medium text-slate-800 truncate">{{ row.user.name }}</p>
                      <p class="text-[10px] text-slate-400 truncate">{{ row.user.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-3">
                  <span class="inline-block max-w-[180px] truncate text-slate-700">{{ row.tryout.title }}</span>
                </td>
                <td class="px-3 py-3">
                  <div class="flex flex-col items-center gap-1">
                    <div class="w-full max-w-[100px] h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-500"
                        :class="progressBarColor(row.progress_percent)"
                        :style="{ width: row.progress_percent + '%' }"
                      ></div>
                    </div>
                    <span class="text-[10px] font-semibold" :class="progressTextColor(row.progress_percent)">
                      {{ row.progress_percent }}%
                    </span>
                  </div>
                </td>
                <td class="px-3 py-3 text-center text-slate-600">
                  {{ row.answered_count }} / {{ row.total_questions }}
                </td>
                <td class="px-3 py-3 text-center">
                  <span
                    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    :class="remainingTimeClass(row.remaining_seconds)"
                  >
                    <span v-if="row.remaining_seconds !== null && row.remaining_seconds <= 0" class="flex items-center gap-1">
                      <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Waktu habis
                    </span>
                    <span v-else>{{ formatRemainingTime(row.remaining_seconds) }}</span>
                  </span>
                </td>
                <td class="px-3 py-3 text-center text-slate-500">
                  {{ formatDate(row.started_at) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Sebelumnya
          </button>

          <span class="text-xs text-slate-500">
            Halaman {{ currentPage }} dari {{ totalPages }}
          </span>

          <button
            @click="currentPage++"
            :disabled="currentPage >= totalPages"
            class="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Selanjutnya
          </button>
        </div>

        <!-- Info terakhir dimuat -->
        <div v-if="lastLoadedAt" class="mt-3 text-right text-[10px] text-slate-400">
          Terakhir dimuat: {{ lastLoadedAt }}
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch } from "vue";
import api from "../services/api";

const progressData = ref([]);
const loading = ref(false);
const errorMessage = ref("");
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(15);
const lastLoadedAt = ref("");
let refreshInterval = null;

const almostExpiredCount = computed(() => {
  return progressData.value.filter(
    (row) => row.remaining_seconds !== null && row.remaining_seconds > 0 && row.remaining_seconds <= 300
  ).length;
});

const averageProgress = computed(() => {
  if (!progressData.value.length) return 0;
  const total = progressData.value.reduce((sum, row) => sum + (row.progress_percent || 0), 0);
  return Math.round(total / progressData.value.length);
});

const filteredData = computed(() => {
  if (!searchQuery.value) return progressData.value;
  const q = searchQuery.value.toLowerCase();
  return progressData.value.filter(
    (row) =>
      (row.user?.name && row.user.name.toLowerCase().includes(q)) ||
      (row.user?.email && row.user.email.toLowerCase().includes(q)) ||
      (row.tryout?.title && row.tryout.title.toLowerCase().includes(q))
  );
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredData.value.length / itemsPerPage.value))
);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredData.value.slice(start, start + itemsPerPage.value);
});

watch(searchQuery, () => {
  currentPage.value = 1;
});

async function loadProgress() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await api.get("/tryout-progress");
    const data = response.data?.data ?? response.data ?? [];
    progressData.value = Array.isArray(data) ? data : [];
    lastLoadedAt.value = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch (error) {
    console.error("Gagal memuat data progress:", error);
    errorMessage.value = "Data progress tidak bisa dimuat. Silakan coba lagi.";
  } finally {
    loading.value = false;
  }
}

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0].substring(0, 2).toUpperCase();
}

function progressBarColor(percent) {
  if (percent >= 80) return "bg-emerald-500";
  if (percent >= 50) return "bg-blue-500";
  if (percent >= 25) return "bg-amber-500";
  return "bg-slate-400";
}

function progressTextColor(percent) {
  if (percent >= 80) return "text-emerald-600";
  if (percent >= 50) return "text-blue-600";
  if (percent >= 25) return "text-amber-600";
  return "text-slate-500";
}

function remainingTimeClass(seconds) {
  if (seconds === null) return "bg-slate-100 text-slate-500";
  if (seconds <= 0) return "bg-rose-100 text-rose-700";
  if (seconds <= 300) return "bg-amber-100 text-amber-700";
  return "bg-emerald-100 text-emerald-700";
}

function formatRemainingTime(seconds) {
  if (seconds === null) return "-";
  if (seconds <= 0) return "Waktu habis";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}j ${minutes}m`;
  }
  return `${minutes}m ${secs}d`;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

onMounted(async () => {
  await loadProgress();

  // Auto-refresh setiap 30 detik
  refreshInterval = setInterval(() => {
    loadProgress();
  }, 30000);
});

onBeforeUnmount(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>
