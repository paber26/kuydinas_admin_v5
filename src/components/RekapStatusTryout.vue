<template>
  <div class="min-h-full bg-slate-50">
    <div class="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <section class="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex flex-col gap-1">
            <p class="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Admin: Rekap Status Tryout
            </p>
            <h1 class="text-xl font-semibold text-slate-800 sm:text-2xl">
              Rekap Peserta Per Tryout
            </h1>
            <p class="text-xs text-slate-600 sm:text-sm">
              Lihat jumlah peserta yang selesai, sedang mengerjakan, dan belum mulai tetapi sudah registrasi untuk setiap tryout.
            </p>
          </div>

          <button
            @click="loadSummary()"
            :disabled="loading"
            class="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
          >
            <svg
              class="h-4 w-4 transition-transform"
              :class="{ 'animate-spin': loading }"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {{ loading ? "Memuat..." : "Refresh Data" }}
          </button>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="text-xs text-slate-500">Total Tryout</p>
            <p class="mt-1 text-2xl font-bold text-slate-800">{{ summary.total_tryouts }}</p>
          </div>
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="text-xs text-slate-500">Selesai</p>
            <p class="mt-1 text-2xl font-bold text-emerald-600">{{ summary.total_completed }}</p>
          </div>
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="text-xs text-slate-500">Sedang Mengerjakan</p>
            <p class="mt-1 text-2xl font-bold text-sky-600">{{ summary.total_started }}</p>
          </div>
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="text-xs text-slate-500">Belum Mulai</p>
            <p class="mt-1 text-2xl font-bold text-amber-600">{{ summary.total_registered }}</p>
          </div>
        </div>
      </section>

      <div
        v-if="errorMessage"
        class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
      >
        {{ errorMessage }}
      </div>

      <section class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
        <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-sm font-semibold text-slate-700">Tabel Rekap Tryout</h2>

          <div class="relative w-full sm:w-72">
            <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama tryout..."
              class="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            >
          </div>
        </div>

        <div v-if="loading && !rows.length" class="space-y-3">
          <div
            v-for="placeholder in 6"
            :key="placeholder"
            class="h-14 animate-pulse rounded-2xl border border-slate-200 bg-slate-50"
          ></div>
        </div>

        <div
          v-else-if="!rows.length"
          class="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center"
        >
          <svg class="mx-auto h-12 w-12 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
          </svg>
          <p class="mt-3 text-sm font-medium text-slate-500">Belum ada data tryout yang cocok.</p>
          <p class="mt-1 text-xs text-slate-400">Coba ubah kata kunci pencarian atau refresh data.</p>
        </div>

        <div v-else class="overflow-x-auto rounded-xl border border-slate-200">
          <table class="w-full border-collapse text-xs sm:text-sm">
            <thead class="bg-slate-100 text-slate-700">
              <tr>
                <th class="px-3 py-3 text-left">No</th>
                <th class="px-3 py-3 text-left">Nama</th>
                <th class="px-3 py-3 text-center">Selesai Mengerjakan</th>
                <th class="px-3 py-3 text-center">Sedang Mengerjakan</th>
                <th class="px-3 py-3 text-center">Belum Mengerjakan</th>
                <th class="px-3 py-3 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in rows"
                :key="row.id"
                class="border-b bg-white transition-colors hover:bg-slate-50/50"
              >
                <td class="px-3 py-3 text-slate-500">{{ index + 1 }}</td>
                <td class="px-3 py-3">
                  <div>
                    <p class="font-medium text-slate-800">{{ row.name }}</p>
                    <p class="text-[11px] text-slate-400">{{ row.type || "regular" }} • {{ row.duration }} menit</p>
                  </div>
                </td>
                <td class="px-3 py-3 text-center">
                  <router-link
                    :to="detailLink(row.id, 'completed')"
                    class="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-200"
                  >
                    {{ row.completed_count }}
                  </router-link>
                </td>
                <td class="px-3 py-3 text-center">
                  <router-link
                    :to="detailLink(row.id, 'started')"
                    class="inline-flex rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-semibold text-sky-700 transition-colors hover:bg-sky-200"
                  >
                    {{ row.started_count }}
                  </router-link>
                </td>
                <td class="px-3 py-3 text-center">
                  <router-link
                    :to="detailLink(row.id, 'registered')"
                    class="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700 transition-colors hover:bg-amber-200"
                  >
                    {{ row.registered_count }}
                  </router-link>
                </td>
                <td class="px-3 py-3 text-center">
                  <span class="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                    {{ row.total_count }}
                  </span>
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-slate-50 text-slate-700">
              <tr class="font-semibold">
                <td class="px-3 py-3" colspan="2">Total</td>
                <td class="px-3 py-3 text-center">{{ summary.total_completed }}</td>
                <td class="px-3 py-3 text-center">{{ summary.total_started }}</td>
                <td class="px-3 py-3 text-center">{{ summary.total_registered }}</td>
                <td class="px-3 py-3 text-center">{{ summary.grand_total }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import api from "../services/api";

const rows = ref([]);
const loading = ref(false);
const errorMessage = ref("");
const searchQuery = ref("");
const searchDebounce = ref(null);
const summary = ref({
  total_tryouts: 0,
  total_completed: 0,
  total_started: 0,
  total_registered: 0,
  grand_total: 0,
});

async function loadSummary() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await api.get("/tryout-registrations/summary", {
      params: {
        search: searchQuery.value.trim() || undefined,
      },
    });

    rows.value = Array.isArray(response.data?.data) ? response.data.data : [];
    summary.value = {
      ...summary.value,
      ...(response.data?.summary || {}),
    };
  } catch (error) {
    console.error("Gagal memuat rekap status tryout:", error);
    errorMessage.value = "Data rekap status tryout belum bisa dimuat.";
    rows.value = [];
  } finally {
    loading.value = false;
  }
}

function detailLink(tryoutId, status) {
  return {
    path: `/rekap-status-tryout/${tryoutId}/peserta`,
    query: { status },
  };
}

watch(searchQuery, () => {
  if (searchDebounce.value) {
    clearTimeout(searchDebounce.value);
  }

  searchDebounce.value = setTimeout(() => {
    loadSummary();
  }, 400);
});

onMounted(() => {
  loadSummary();
});

onBeforeUnmount(() => {
  if (searchDebounce.value) {
    clearTimeout(searchDebounce.value);
  }
});
</script>
