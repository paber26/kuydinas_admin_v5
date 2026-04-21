<template>
  <div class="min-h-full bg-slate-50">
    <div class="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div class="min-w-0 flex-1 space-y-6">
      <section class="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex flex-col gap-1">
            <p class="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Admin: Detail Peserta Tryout
            </p>
            <h1 class="text-xl font-semibold text-slate-800 sm:text-2xl">
              {{ pageTitle }}
            </h1>
            <p class="text-xs text-slate-600 sm:text-sm">
              Tryout: {{ tryout.title || "-" }} • {{ tryout.type || "regular" }} • {{ tryout.duration || 0 }} menit
            </p>
          </div>

          <router-link
            to="/rekap-status-tryout"
            class="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:text-sm"
          >
            Kembali ke Rekap
          </router-link>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="text-xs text-slate-500">Total Peserta</p>
            <p class="mt-1 text-2xl font-bold text-slate-800">{{ meta.total }}</p>
          </div>
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="text-xs text-slate-500">Status</p>
            <p class="mt-1 text-2xl font-bold" :class="statusColorClass">{{ statusLabel }}</p>
          </div>
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="text-xs text-slate-500">Kata Kunci</p>
            <p class="mt-1 text-sm font-bold text-slate-700">{{ meta.search || "-" }}</p>
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
          <h2 class="text-sm font-semibold text-slate-700">Daftar Peserta</h2>

          <div class="relative w-full sm:w-72">
            <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari nama atau email..."
              class="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            >
          </div>
        </div>

        <div v-if="loading && !rows.length" class="space-y-3">
          <div
            v-for="placeholder in 5"
            :key="placeholder"
            class="h-16 animate-pulse rounded-2xl border border-slate-200 bg-slate-50"
          ></div>
        </div>

        <div
          v-else-if="!rows.length"
          class="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center"
        >
          <svg class="mx-auto h-12 w-12 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
          </svg>
          <p class="mt-3 text-sm font-medium text-slate-500">Belum ada peserta untuk status ini.</p>
          <p class="mt-1 text-xs text-slate-400">Coba ubah pencarian atau kembali ke rekap.</p>
        </div>

        <div v-else class="overflow-x-auto rounded-xl border border-slate-200">
          <table class="w-full border-collapse text-xs sm:text-sm">
            <thead class="bg-slate-100 text-slate-700">
              <tr>
                <th class="px-3 py-3 text-left">No</th>
                <th class="px-3 py-3 text-left">User</th>
                <th class="px-3 py-3 text-center">Tanggal Daftar</th>
                <th v-if="status === 'started'" class="px-3 py-3 text-center">Progress</th>
                <th v-if="status === 'started'" class="px-3 py-3 text-center">Sisa Waktu</th>
                <th v-if="status === 'started'" class="px-3 py-3 text-center">Mulai</th>
                <th v-if="status === 'completed'" class="px-3 py-3 text-center">Selesai</th>
                <th v-if="status === 'registered'" class="px-3 py-3 text-center">Expired</th>
                <th v-if="status === 'registered'" class="px-3 py-3 text-center">Status Expired</th>
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
                  <button
                    type="button"
                    @click="openUserDetail(row.user)"
                    class="flex w-full items-center gap-2 text-left"
                  >
                    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                      {{ getInitials(row.user?.name) }}
                    </div>
                    <div class="min-w-0">
                      <p class="truncate font-medium text-indigo-700 hover:text-indigo-800">{{ row.user?.name || "-" }}</p>
                      <p class="truncate text-[10px] text-slate-400">{{ row.user?.email || "-" }}</p>
                    </div>
                  </button>
                </td>
                <td class="px-3 py-3 text-center text-slate-500">{{ formatDate(row.registered_at) }}</td>

                <template v-if="status === 'started'">
                  <td class="px-3 py-3">
                    <div class="flex flex-col items-center gap-1">
                      <div class="h-2 w-full max-w-[100px] overflow-hidden rounded-full bg-slate-200">
                        <div
                          class="h-full rounded-full bg-sky-500 transition-all"
                          :style="{ width: `${row.progress_percent || 0}%` }"
                        ></div>
                      </div>
                      <span class="text-[10px] font-semibold text-sky-700">{{ row.progress_percent || 0 }}%</span>
                    </div>
                  </td>
                  <td class="px-3 py-3 text-center">
                    <span class="inline-flex rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-semibold text-sky-700">
                      {{ formatRemainingTime(row.remaining_seconds) }}
                    </span>
                  </td>
                  <td class="px-3 py-3 text-center text-slate-500">{{ formatDate(row.started_at) }}</td>
                </template>

                <template v-if="status === 'completed'">
                  <td class="px-3 py-3 text-center text-slate-500">{{ formatDate(row.finished_at) }}</td>
                </template>

                <template v-if="status === 'registered'">
                  <td class="px-3 py-3 text-center text-slate-500">{{ formatDate(row.expires_at) }}</td>
                  <td class="px-3 py-3 text-center">
                    <span
                      class="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold"
                      :class="row.is_expired ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'"
                    >
                      {{ row.is_expired ? "Expired" : "Aktif" }}
                    </span>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      </div>

      <aside
        v-if="userDetailOpen"
        class="hidden w-full max-w-sm shrink-0 lg:block"
      >
        <div class="sticky top-6 space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-indigo-600">Detail User</p>
              <h2 class="mt-1 text-lg font-semibold text-slate-800">{{ selectedUserDetail?.user?.name || "Memuat..." }}</h2>
              <p class="text-sm text-slate-500">{{ selectedUserDetail?.user?.email || "-" }}</p>
            </div>
            <button
              type="button"
              @click="closeUserDetail"
              class="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-50"
            >
              Tutup
            </button>
          </div>

          <div v-if="loadingUserDetail" class="space-y-3">
            <div class="h-20 animate-pulse rounded-2xl bg-slate-100"></div>
            <div class="h-32 animate-pulse rounded-2xl bg-slate-100"></div>
          </div>

          <div
            v-else-if="userDetailError"
            class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {{ userDetailError }}
          </div>

          <template v-else-if="selectedUserDetail">
            <div class="grid grid-cols-2 gap-3">
              <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p class="text-[11px] uppercase tracking-wide text-slate-500">Total Register</p>
                <p class="mt-1 text-xl font-bold text-slate-800">{{ selectedUserDetail.summary.total_registered }}</p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p class="text-[11px] uppercase tracking-wide text-slate-500">Selesai</p>
                <p class="mt-1 text-xl font-bold text-emerald-600">{{ selectedUserDetail.summary.total_completed }}</p>
              </div>
            </div>

            <div class="space-y-2 text-sm text-slate-600">
              <p><span class="font-medium text-slate-700">WhatsApp:</span> {{ selectedUserDetail.user.whatsapp || "-" }}</p>
              <p><span class="font-medium text-slate-700">Lokasi:</span> {{ formatLocation(selectedUserDetail.user) }}</p>
              <p><span class="font-medium text-slate-700">Status Akun:</span> {{ selectedUserDetail.user.is_active ? "Aktif" : "Nonaktif" }}</p>
              <p><span class="font-medium text-slate-700">Login Terakhir:</span> {{ formatDate(selectedUserDetail.user.last_login) }}</p>
            </div>

            <div class="space-y-3 border-t border-slate-100 pt-4">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-semibold text-slate-700">Tryout Yang Diregister</h3>
                <span class="text-xs text-slate-400">{{ selectedUserDetail.registrations.length }} item</span>
              </div>

              <div v-if="!selectedUserDetail.registrations.length" class="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                User ini belum memiliki data registrasi tryout.
              </div>

              <div v-else class="space-y-3">
                <article
                  v-for="item in selectedUserDetail.registrations"
                  :key="item.id"
                  class="rounded-xl border border-slate-200 p-4"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div>
                      <p class="font-medium text-slate-800">{{ item.tryout?.title || "-" }}</p>
                      <p class="text-[11px] text-slate-400">
                        {{ item.tryout?.type || "regular" }} • {{ item.tryout?.duration || 0 }} menit
                      </p>
                    </div>
                    <span
                      class="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold"
                      :class="statusBadgeClass(item.status, item.is_expired)"
                    >
                      {{ detailStatusLabel(item.status, item.is_expired) }}
                    </span>
                  </div>

                  <div class="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                    <p>Daftar: {{ formatDate(item.registered_at) }}</p>
                    <p>Expired: {{ formatDate(item.expires_at) }}</p>
                    <p>Mulai: {{ formatDate(item.started_at) }}</p>
                    <p>Selesai: {{ formatDate(item.finished_at || item.latest_completed_at) }}</p>
                  </div>

                  <div v-if="item.score" class="mt-3 flex flex-wrap gap-2">
                    <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">TWK {{ item.score.twk }}</span>
                    <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">TIU {{ item.score.tiu }}</span>
                    <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">TKP {{ item.score.tkp }}</span>
                    <span class="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">Total {{ item.score.total }}</span>
                  </div>
                </article>
              </div>
            </div>
          </template>
        </div>
      </aside>
    </div>

    <div
      v-if="userDetailOpen"
      class="fixed inset-0 z-40 bg-slate-900/30 lg:hidden"
      @click="closeUserDetail"
    ></div>

    <aside
      v-if="userDetailOpen"
      class="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-white p-5 shadow-2xl lg:hidden"
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-indigo-600">Detail User</p>
          <h2 class="mt-1 text-lg font-semibold text-slate-800">{{ selectedUserDetail?.user?.name || "Memuat..." }}</h2>
          <p class="text-sm text-slate-500">{{ selectedUserDetail?.user?.email || "-" }}</p>
        </div>
        <button
          type="button"
          @click="closeUserDetail"
          class="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-50"
        >
          Tutup
        </button>
      </div>

      <div v-if="loadingUserDetail" class="mt-4 space-y-3">
        <div class="h-20 animate-pulse rounded-2xl bg-slate-100"></div>
        <div class="h-32 animate-pulse rounded-2xl bg-slate-100"></div>
      </div>

      <div
        v-else-if="userDetailError"
        class="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
      >
        {{ userDetailError }}
      </div>

      <template v-else-if="selectedUserDetail">
        <div class="mt-4 grid grid-cols-2 gap-3">
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p class="text-[11px] uppercase tracking-wide text-slate-500">Total Register</p>
            <p class="mt-1 text-xl font-bold text-slate-800">{{ selectedUserDetail.summary.total_registered }}</p>
          </div>
          <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p class="text-[11px] uppercase tracking-wide text-slate-500">Selesai</p>
            <p class="mt-1 text-xl font-bold text-emerald-600">{{ selectedUserDetail.summary.total_completed }}</p>
          </div>
        </div>

        <div class="mt-4 space-y-2 text-sm text-slate-600">
          <p><span class="font-medium text-slate-700">WhatsApp:</span> {{ selectedUserDetail.user.whatsapp || "-" }}</p>
          <p><span class="font-medium text-slate-700">Lokasi:</span> {{ formatLocation(selectedUserDetail.user) }}</p>
          <p><span class="font-medium text-slate-700">Status Akun:</span> {{ selectedUserDetail.user.is_active ? "Aktif" : "Nonaktif" }}</p>
          <p><span class="font-medium text-slate-700">Login Terakhir:</span> {{ formatDate(selectedUserDetail.user.last_login) }}</p>
        </div>

        <div class="mt-4 space-y-3 border-t border-slate-100 pt-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-slate-700">Tryout Yang Diregister</h3>
            <span class="text-xs text-slate-400">{{ selectedUserDetail.registrations.length }} item</span>
          </div>

          <div v-if="!selectedUserDetail.registrations.length" class="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            User ini belum memiliki data registrasi tryout.
          </div>

          <div v-else class="space-y-3">
            <article
              v-for="item in selectedUserDetail.registrations"
              :key="item.id"
              class="rounded-xl border border-slate-200 p-4"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-medium text-slate-800">{{ item.tryout?.title || "-" }}</p>
                  <p class="text-[11px] text-slate-400">
                    {{ item.tryout?.type || "regular" }} • {{ item.tryout?.duration || 0 }} menit
                  </p>
                </div>
                <span
                  class="inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold"
                  :class="statusBadgeClass(item.status, item.is_expired)"
                >
                  {{ detailStatusLabel(item.status, item.is_expired) }}
                </span>
              </div>

              <div class="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                <p>Daftar: {{ formatDate(item.registered_at) }}</p>
                <p>Expired: {{ formatDate(item.expires_at) }}</p>
                <p>Mulai: {{ formatDate(item.started_at) }}</p>
                <p>Selesai: {{ formatDate(item.finished_at || item.latest_completed_at) }}</p>
              </div>

              <div v-if="item.score" class="mt-3 flex flex-wrap gap-2">
                <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">TWK {{ item.score.twk }}</span>
                <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">TIU {{ item.score.tiu }}</span>
                <span class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">TKP {{ item.score.tkp }}</span>
                <span class="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">Total {{ item.score.total }}</span>
              </div>
            </article>
          </div>
        </div>
      </template>
    </aside>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import api from "../services/api";

const route = useRoute();
const rows = ref([]);
const loading = ref(false);
const errorMessage = ref("");
const searchQuery = ref("");
const searchDebounce = ref(null);
const loadingUserDetail = ref(false);
const userDetailError = ref("");
const selectedUserDetail = ref(null);
const userDetailOpen = ref(false);
const tryout = ref({
  title: "",
  type: "",
  duration: 0,
});
const meta = ref({
  total: 0,
  search: "",
});

const status = computed(() => String(route.query.status || "registered"));

const statusLabel = computed(() => {
  if (status.value === "completed") return "Selesai";
  if (status.value === "started") return "Sedang Mengerjakan";
  return "Belum Mengerjakan";
});

const statusColorClass = computed(() => {
  if (status.value === "completed") return "text-emerald-600";
  if (status.value === "started") return "text-sky-600";
  return "text-amber-600";
});

const pageTitle = computed(() => `${statusLabel.value} - ${tryout.value.title || "Tryout"}`);

async function loadParticipants() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await api.get(`/tryouts/${route.params.id}/participants`, {
      params: {
        status: status.value,
        search: searchQuery.value.trim() || undefined,
      },
    });

    rows.value = Array.isArray(response.data?.data) ? response.data.data : [];
    tryout.value = response.data?.tryout || tryout.value;
    meta.value = {
      ...meta.value,
      ...(response.data?.meta || {}),
    };
  } catch (error) {
    console.error("Gagal memuat detail peserta tryout:", error);
    errorMessage.value = "Data peserta tryout belum bisa dimuat.";
    rows.value = [];
  } finally {
    loading.value = false;
  }
}

async function openUserDetail(user) {
  if (!user?.id) return;

  userDetailOpen.value = true;
  loadingUserDetail.value = true;
  userDetailError.value = "";

  try {
    const response = await api.get(`/users/${user.id}/tryout-summary`);
    selectedUserDetail.value = response.data?.data || null;
  } catch (error) {
    console.error("Gagal memuat detail user:", error);
    userDetailError.value = "Detail user belum bisa dimuat.";
    selectedUserDetail.value = null;
  } finally {
    loadingUserDetail.value = false;
  }
}

function closeUserDetail() {
  userDetailOpen.value = false;
  userDetailError.value = "";
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

function formatRemainingTime(seconds) {
  if (seconds === null || seconds === undefined) return "-";
  if (seconds <= 0) return "Waktu habis";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}j ${minutes}m`;
  }

  return `${minutes}m ${secs}d`;
}

function formatLocation(user) {
  return [
    user?.district_name,
    user?.regency_name,
    user?.province_name,
  ].filter(Boolean).join(", ") || "-";
}

function detailStatusLabel(statusValue, isExpired = false) {
  if (statusValue === "completed") return "Selesai";
  if (statusValue === "started") return "Sedang Berjalan";
  if (isExpired) return "Expired";
  return "Belum Mulai";
}

function statusBadgeClass(statusValue, isExpired = false) {
  if (statusValue === "completed") return "bg-emerald-100 text-emerald-700";
  if (statusValue === "started") return "bg-sky-100 text-sky-700";
  if (isExpired) return "bg-rose-100 text-rose-700";
  return "bg-amber-100 text-amber-700";
}

watch(() => searchQuery.value, () => {
  if (searchDebounce.value) {
    clearTimeout(searchDebounce.value);
  }

  searchDebounce.value = setTimeout(() => {
    loadParticipants();
  }, 400);
});

watch(() => route.fullPath, () => {
  loadParticipants();
});

onMounted(() => {
  loadParticipants();
});

onBeforeUnmount(() => {
  if (searchDebounce.value) {
    clearTimeout(searchDebounce.value);
  }
});
</script>
