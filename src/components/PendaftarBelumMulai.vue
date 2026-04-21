<template>
  <div class="min-h-full bg-slate-50">
    <div class="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <section class="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex flex-col gap-1">
            <p class="text-xs font-semibold uppercase tracking-wide text-cyan-600">
              Admin: Registrasi Tryout
            </p>
            <h1 class="text-xl font-semibold text-slate-800 sm:text-2xl">
              Pendaftar Belum Mulai Tryout
            </h1>
            <p class="text-xs text-slate-600 sm:text-sm">
              Pantau user yang sudah register tetapi belum mulai mengerjakan tryout.
            </p>
          </div>

          <button
            @click="loadRegistrations()"
            :disabled="loading"
            class="inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-medium text-cyan-700 transition-colors hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
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

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500">Total Registrasi</p>
              <p class="text-2xl font-bold text-slate-800">{{ meta.total }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500">Sudah Expired</p>
              <p class="text-2xl font-bold text-rose-600">{{ expiredCount }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10m-11 8h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500">Terbaru Register</p>
              <p class="text-sm font-bold text-emerald-600 sm:text-base">{{ latestRegisteredAt }}</p>
            </div>
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
          <h2 class="text-sm font-semibold text-slate-700">Daftar Pendaftar</h2>

          <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <div class="w-full sm:w-64">
              <select
                v-model="selectedTryoutId"
                :disabled="loadingTryouts"
                class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:bg-slate-100 sm:text-sm"
              >
                <option value="">Semua Tryout</option>
                <option
                  v-for="tryout in tryoutOptions"
                  :key="tryout.id"
                  :value="String(tryout.id)"
                >
                  {{ tryout.name }}
                </option>
              </select>
            </div>

            <div class="relative w-full sm:w-72">
              <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari nama, email, atau tryout..."
                class="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-700 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 sm:text-sm"
              >
            </div>
          </div>
        </div>

        <div v-if="loading && !registrations.length" class="space-y-3">
          <div
            v-for="placeholder in 5"
            :key="placeholder"
            class="h-16 animate-pulse rounded-2xl border border-slate-200 bg-slate-50"
          ></div>
        </div>

        <div
          v-else-if="!registrations.length"
          class="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center"
        >
          <svg class="mx-auto h-12 w-12 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
          </svg>
          <p class="mt-3 text-sm font-medium text-slate-500">Tidak ada registrasi pending saat ini.</p>
          <p class="mt-1 text-xs text-slate-400">Registrasi berstatus registered akan tampil di halaman ini, termasuk yang expired.</p>
        </div>

        <div v-else class="overflow-x-auto rounded-xl border border-slate-200">
          <table class="w-full border-collapse text-xs sm:text-sm">
            <thead class="sticky top-0 z-10 bg-slate-100 text-slate-700 shadow-sm">
              <tr>
                <th class="px-3 py-3 text-left">No</th>
                <th class="px-3 py-3 text-left">User</th>
                <th class="px-3 py-3 text-left">Tryout</th>
                <th class="px-3 py-3 text-center">Tanggal Daftar</th>
                <th class="px-3 py-3 text-center">Expired</th>
                <th class="px-3 py-3 text-center">Status Expired</th>
                <th class="px-3 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in registrations"
                :key="row.id"
                class="border-b bg-white transition-colors hover:bg-slate-50/50"
              >
                <td class="px-3 py-3 text-slate-500">{{ rowNumber(index) }}</td>
                <td class="px-3 py-3">
                  <div class="flex items-center gap-2">
                    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-[10px] font-bold text-cyan-700">
                      {{ getInitials(row.user?.name) }}
                    </div>
                    <div class="min-w-0">
                      <p class="truncate font-medium text-slate-800">{{ row.user?.name || "-" }}</p>
                      <p class="truncate text-[10px] text-slate-400">{{ row.user?.email || "-" }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-3">
                  <div class="min-w-[180px]">
                    <p class="truncate text-slate-800">{{ row.tryout?.title || "-" }}</p>
                    <p class="text-[10px] text-slate-400">{{ row.tryout?.type || "regular" }}</p>
                  </div>
                </td>
                <td class="px-3 py-3 text-center text-slate-500">{{ formatDate(row.registered_at) }}</td>
                <td class="px-3 py-3 text-center text-slate-500">{{ formatDate(row.expires_at) }}</td>
                <td class="px-3 py-3 text-center">
                  <span
                    class="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    :class="row.is_expired ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'"
                  >
                    {{ row.is_expired ? "Expired" : "Aktif" }}
                  </span>
                </td>
                <td class="px-3 py-3 text-center">
                  <span class="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                    Belum Mulai
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-xs text-slate-500">
            Menampilkan {{ meta.from || 0 }}-{{ meta.to || 0 }} dari {{ meta.total }} data
          </p>

          <div class="flex items-center justify-between gap-3 sm:justify-end">
            <button
              @click="changePage(meta.current_page - 1)"
              :disabled="loading || meta.current_page <= 1"
              class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sebelumnya
            </button>

            <span class="text-xs text-slate-500">
              Halaman {{ meta.current_page }} dari {{ meta.last_page }}
            </span>

            <button
              @click="changePage(meta.current_page + 1)"
              :disabled="loading || meta.current_page >= meta.last_page"
              class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import api from "../services/api";

const registrations = ref([]);
const tryoutOptions = ref([]);
const loading = ref(false);
const loadingTryouts = ref(false);
const errorMessage = ref("");
const searchQuery = ref("");
const selectedTryoutId = ref("");
const searchDebounce = ref(null);
const meta = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0,
});

const expiredCount = computed(() => {
  return registrations.value.filter((item) => item.is_expired).length;
});

const latestRegisteredAt = computed(() => {
  const latest = registrations.value[0]?.registered_at;
  return latest ? formatDate(latest) : "-";
});

async function loadTryouts() {
  loadingTryouts.value = true;

  try {
    const response = await api.get("/tryouts");
    const list = Array.isArray(response.data?.data) ? response.data.data : response.data ?? [];

    tryoutOptions.value = list.map((item) => ({
      id: item.id || item.eid,
      name: item.title || item.name || `Tryout #${item.id || item.eid}`,
    }));
  } catch (error) {
    console.error("Gagal memuat daftar tryout:", error);
  } finally {
    loadingTryouts.value = false;
  }
}

async function loadRegistrations(page = meta.value.current_page || 1) {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await api.get("/tryout-registrations/pending", {
      params: {
        page,
        per_page: meta.value.per_page || 15,
        search: searchQuery.value.trim() || undefined,
        tryout_id: selectedTryoutId.value || undefined,
      },
    });

    registrations.value = Array.isArray(response.data?.data) ? response.data.data : [];
    meta.value = {
      ...meta.value,
      ...(response.data?.meta || {}),
    };
  } catch (error) {
    console.error("Gagal memuat data registrasi pending:", error);
    errorMessage.value = "Data pendaftar belum mulai belum bisa dimuat.";
    registrations.value = [];
  } finally {
    loading.value = false;
  }
}

function changePage(page) {
  if (page < 1 || page > meta.value.last_page || loading.value) {
    return;
  }

  loadRegistrations(page);
}

function rowNumber(index) {
  return ((meta.value.current_page - 1) * meta.value.per_page) + index + 1;
}

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);

  return parts.length >= 2
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
}

function formatDate(dateStr) {
  if (!dateStr) return "-";

  return new Date(dateStr).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

watch(searchQuery, () => {
  if (searchDebounce.value) {
    clearTimeout(searchDebounce.value);
  }

  searchDebounce.value = setTimeout(() => {
    loadRegistrations(1);
  }, 400);
});

watch(selectedTryoutId, () => {
  loadRegistrations(1);
});

onMounted(async () => {
  await loadTryouts();
  await loadRegistrations(1);
});

onBeforeUnmount(() => {
  if (searchDebounce.value) {
    clearTimeout(searchDebounce.value);
  }
});
</script>
