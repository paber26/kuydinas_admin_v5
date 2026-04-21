<template>
  <div class="min-h-full bg-slate-50">
    <div class="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div class="min-w-0 flex-1 space-y-6">
        <section class="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div class="flex flex-col gap-1">
              <p class="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                Admin: Monitoring Tryout
              </p>
              <h1 class="text-xl font-semibold text-slate-800 sm:text-2xl">
                Rekapan Registrasi dan Hasil Tryout
              </h1>
              <p class="text-xs text-slate-600 sm:text-sm">
                Gabungkan data peserta belum mulai dan yang sudah selesai, lalu klik nama user untuk melihat seluruh tryout yang dia register.
              </p>
            </div>

            <button
              @click="loadActiveTab()"
              :disabled="isCurrentLoading"
              class="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            >
              <svg
                class="h-4 w-4 transition-transform"
                :class="{ 'animate-spin': isCurrentLoading }"
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
              {{ isCurrentLoading ? "Memuat..." : "Refresh Data" }}
            </button>
          </div>

          <div class="flex flex-wrap gap-2 rounded-2xl bg-slate-100 p-1">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              @click="activeTab = tab.value"
              class="inline-flex items-center rounded-xl px-4 py-2 text-xs font-semibold transition-colors sm:text-sm"
              :class="activeTab === tab.value ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
            >
              {{ tab.label }}
            </button>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div
              v-for="card in summaryCards"
              :key="card.label"
              class="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div
                class="flex h-10 w-10 items-center justify-center rounded-lg"
                :class="card.iconBg"
              >
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="card.icon" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-slate-500">{{ card.label }}</p>
                <p class="text-2xl font-bold" :class="card.valueClass">{{ card.value }}</p>
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
            <h2 class="text-sm font-semibold text-slate-700">{{ tableTitle }}</h2>

            <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <div class="w-full sm:w-64">
                <select
                  v-model="selectedTryoutId"
                  :disabled="loadingTryouts"
                  class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-100 sm:text-sm"
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
                  class="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                >
              </div>
            </div>
          </div>

          <div v-if="isCurrentLoading && !currentRows.length" class="space-y-3">
            <div
              v-for="placeholder in 5"
              :key="placeholder"
              class="h-16 animate-pulse rounded-2xl border border-slate-200 bg-slate-50"
            ></div>
          </div>

          <div
            v-else-if="!currentRows.length"
            class="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center"
          >
            <svg class="mx-auto h-12 w-12 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
            </svg>
            <p class="mt-3 text-sm font-medium text-slate-500">{{ emptyState.title }}</p>
            <p class="mt-1 text-xs text-slate-400">{{ emptyState.description }}</p>
          </div>

          <div v-else class="overflow-x-auto rounded-xl border border-slate-200">
            <table class="w-full border-collapse text-xs sm:text-sm">
              <thead class="sticky top-0 z-10 bg-slate-100 text-slate-700 shadow-sm">
                <tr>
                  <th class="px-3 py-3 text-left">No</th>
                  <th class="px-3 py-3 text-left">User</th>
                  <th class="px-3 py-3 text-left">Tryout</th>
                  <th
                    v-for="column in tableColumns"
                    :key="column.key"
                    class="px-3 py-3"
                    :class="column.align === 'center' ? 'text-center' : 'text-left'"
                  >
                    {{ column.label }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, index) in currentRows"
                  :key="`${activeTab}-${row.id}`"
                  class="border-b bg-white transition-colors hover:bg-slate-50/50"
                >
                  <td class="px-3 py-3 text-slate-500">{{ rowNumber(index) }}</td>
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
                        <p class="truncate font-medium text-indigo-700 hover:text-indigo-800">
                          {{ row.user?.name || "-" }}
                        </p>
                        <p class="truncate text-[10px] text-slate-400">{{ row.user?.email || "-" }}</p>
                      </div>
                    </button>
                  </td>
                  <td class="px-3 py-3">
                    <div class="min-w-[180px]">
                      <p class="truncate text-slate-800">{{ row.tryout?.title || "-" }}</p>
                      <p class="text-[10px] text-slate-400">
                        {{ activeTab === "completed" ? `Attempt ${row.attempt_number || 1}` : (row.tryout?.type || "regular") }}
                      </p>
                    </div>
                  </td>

                  <template v-if="activeTab === 'registered'">
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
                  </template>

                  <template v-else>
                    <td class="px-3 py-3 text-center text-slate-700">{{ row.score?.twk ?? 0 }}</td>
                    <td class="px-3 py-3 text-center text-slate-700">{{ row.score?.tiu ?? 0 }}</td>
                    <td class="px-3 py-3 text-center text-slate-700">{{ row.score?.tkp ?? 0 }}</td>
                    <td class="px-3 py-3 text-center">
                      <span class="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        {{ row.score?.total ?? 0 }}
                      </span>
                    </td>
                    <td class="px-3 py-3 text-center text-slate-500">{{ formatDate(row.finished_at) }}</td>
                  </template>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p class="text-xs text-slate-500">
              Menampilkan {{ currentMeta.from || 0 }}-{{ currentMeta.to || 0 }} dari {{ currentMeta.total }} data
            </p>

            <div class="flex items-center justify-between gap-3 sm:justify-end">
              <button
                @click="changePage(currentMeta.current_page - 1)"
                :disabled="isCurrentLoading || currentMeta.current_page <= 1"
                class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sebelumnya
              </button>

              <span class="text-xs text-slate-500">
                Halaman {{ currentMeta.current_page }} dari {{ currentMeta.last_page }}
              </span>

              <button
                @click="changePage(currentMeta.current_page + 1)"
                :disabled="isCurrentLoading || currentMeta.current_page >= currentMeta.last_page"
                class="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Selanjutnya
              </button>
            </div>
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
                      {{ statusLabel(item.status, item.is_expired) }}
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
                  {{ statusLabel(item.status, item.is_expired) }}
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

const tabs = [
  { label: "Belum Mulai", value: "registered" },
  { label: "Sudah Selesai", value: "completed" },
];

const route = useRoute();
const activeTab = ref(route.path === "/pendaftar-belum-mulai" ? "registered" : "completed");
const registrations = ref([]);
const historyData = ref([]);
const tryoutOptions = ref([]);
const loadingRegistrations = ref(false);
const loadingHistory = ref(false);
const loadingTryouts = ref(false);
const loadingUserDetail = ref(false);
const errorMessage = ref("");
const userDetailError = ref("");
const searchQuery = ref("");
const selectedTryoutId = ref("");
const searchDebounce = ref(null);
const selectedUserDetail = ref(null);
const userDetailOpen = ref(false);

const defaultMeta = () => ({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0,
});

const registeredMeta = ref(defaultMeta());
const historyMeta = ref(defaultMeta());

const isCurrentLoading = computed(() => {
  return activeTab.value === "registered"
    ? loadingRegistrations.value
    : loadingHistory.value;
});

const currentRows = computed(() => {
  return activeTab.value === "registered"
    ? registrations.value
    : historyData.value;
});

const currentMeta = computed(() => {
  return activeTab.value === "registered"
    ? registeredMeta.value
    : historyMeta.value;
});

const expiredCount = computed(() => {
  return registrations.value.filter((item) => item.is_expired).length;
});

const latestRegisteredAt = computed(() => {
  const latest = registrations.value[0]?.registered_at;
  return latest ? formatDate(latest) : "-";
});

const averageTotalScore = computed(() => {
  if (!historyData.value.length) return 0;

  const total = historyData.value.reduce(
    (sum, row) => sum + Number(row.score?.total || 0),
    0,
  );

  return Math.round(total / historyData.value.length);
});

const latestFinishedAt = computed(() => {
  const latest = historyData.value[0]?.finished_at;
  return latest ? formatDate(latest) : "-";
});

const summaryCards = computed(() => {
  if (activeTab.value === "registered") {
    return [
      {
        label: "Total Registrasi",
        value: registeredMeta.value.total,
        valueClass: "text-slate-800",
        iconBg: "bg-cyan-100 text-cyan-600",
        icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
      },
      {
        label: "Sudah Expired",
        value: expiredCount.value,
        valueClass: "text-rose-600",
        iconBg: "bg-rose-100 text-rose-600",
        icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      },
      {
        label: "Terbaru Register",
        value: latestRegisteredAt.value,
        valueClass: "text-emerald-600 text-sm sm:text-base",
        iconBg: "bg-emerald-100 text-emerald-600",
        icon: "M8 7V3m8 4V3m-9 8h10m-11 8h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z",
      },
    ];
  }

  return [
    {
      label: "Total Riwayat",
      value: historyMeta.value.total,
      valueClass: "text-slate-800",
      iconBg: "bg-indigo-100 text-indigo-600",
      icon: "M3 7h18M7 3v4m10-4v4M6 11h12M6 15h6m-6 4h12",
    },
    {
      label: "Rata-rata Total Skor",
      value: averageTotalScore.value,
      valueClass: "text-emerald-600",
      iconBg: "bg-emerald-100 text-emerald-600",
      icon: "M9 17v-6m3 6V7m3 10v-4m3 4V5M4 19h16",
    },
    {
      label: "Terakhir Selesai",
      value: latestFinishedAt.value,
      valueClass: "text-amber-600 text-sm sm:text-base",
      iconBg: "bg-amber-100 text-amber-600",
      icon: "M8 7V3m8 4V3m-9 8h10m-11 8h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
  ];
});

const tableTitle = computed(() => {
  return activeTab.value === "registered"
    ? "Daftar Pendaftar Belum Mulai"
    : "Daftar Rekapan Tryout Selesai";
});

const tableColumns = computed(() => {
  return activeTab.value === "registered"
    ? [
      { key: "registered_at", label: "Tanggal Daftar", align: "center" },
      { key: "expires_at", label: "Expired", align: "center" },
      { key: "expired_status", label: "Status Expired", align: "center" },
      { key: "status", label: "Status", align: "center" },
    ]
    : [
      { key: "twk", label: "TWK", align: "center" },
      { key: "tiu", label: "TIU", align: "center" },
      { key: "tkp", label: "TKP", align: "center" },
      { key: "total", label: "Total", align: "center" },
      { key: "finished_at", label: "Selesai", align: "center" },
    ];
});

const emptyState = computed(() => {
  return activeTab.value === "registered"
    ? {
      title: "Tidak ada registrasi pending saat ini.",
      description: "Registrasi berstatus registered akan tampil di halaman ini, termasuk yang expired.",
    }
    : {
      title: "Belum ada riwayat tryout yang selesai.",
      description: "Data completed akan muncul di halaman ini secara otomatis.",
    };
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

async function loadRegistrations(page = registeredMeta.value.current_page || 1) {
  loadingRegistrations.value = true;
  errorMessage.value = "";

  try {
    const response = await api.get("/tryout-registrations/pending", {
      params: {
        page,
        per_page: registeredMeta.value.per_page || 15,
        search: searchQuery.value.trim() || undefined,
        tryout_id: selectedTryoutId.value || undefined,
      },
    });

    registrations.value = Array.isArray(response.data?.data) ? response.data.data : [];
    registeredMeta.value = {
      ...registeredMeta.value,
      ...(response.data?.meta || {}),
    };
  } catch (error) {
    console.error("Gagal memuat data registrasi pending:", error);
    errorMessage.value = "Data pendaftar belum mulai belum bisa dimuat.";
    registrations.value = [];
  } finally {
    loadingRegistrations.value = false;
  }
}

async function loadHistory(page = historyMeta.value.current_page || 1) {
  loadingHistory.value = true;
  errorMessage.value = "";

  try {
    const response = await api.get("/tryout-history", {
      params: {
        page,
        per_page: historyMeta.value.per_page || 15,
        search: searchQuery.value.trim() || undefined,
        tryout_id: selectedTryoutId.value || undefined,
      },
    });

    historyData.value = Array.isArray(response.data?.data) ? response.data.data : [];
    historyMeta.value = {
      ...historyMeta.value,
      ...(response.data?.meta || {}),
    };
  } catch (error) {
    console.error("Gagal memuat rekapan tryout:", error);
    errorMessage.value = "Data rekapan tryout belum bisa dimuat.";
    historyData.value = [];
  } finally {
    loadingHistory.value = false;
  }
}

async function loadActiveTab(page = 1) {
  if (activeTab.value === "registered") {
    await loadRegistrations(page);
    return;
  }

  await loadHistory(page);
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

function changePage(page) {
  if (page < 1 || page > currentMeta.value.last_page || isCurrentLoading.value) {
    return;
  }

  loadActiveTab(page);
}

function rowNumber(index) {
  return ((currentMeta.value.current_page - 1) * currentMeta.value.per_page) + index + 1;
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

function formatLocation(user) {
  return [
    user?.district_name,
    user?.regency_name,
    user?.province_name,
  ].filter(Boolean).join(", ") || "-";
}

function statusLabel(status, isExpired = false) {
  if (status === "completed") return "Selesai";
  if (status === "started") return "Sedang Berjalan";
  if (isExpired) return "Expired";
  return "Belum Mulai";
}

function statusBadgeClass(status, isExpired = false) {
  if (status === "completed") return "bg-emerald-100 text-emerald-700";
  if (status === "started") return "bg-sky-100 text-sky-700";
  if (isExpired) return "bg-rose-100 text-rose-700";
  return "bg-amber-100 text-amber-700";
}

function syncTabWithRoute() {
  activeTab.value = route.path === "/pendaftar-belum-mulai"
    ? "registered"
    : "completed";
}

watch(searchQuery, () => {
  if (searchDebounce.value) {
    clearTimeout(searchDebounce.value);
  }

  searchDebounce.value = setTimeout(() => {
    loadActiveTab(1);
  }, 400);
});

watch(selectedTryoutId, () => {
  loadActiveTab(1);
});

watch(activeTab, () => {
  errorMessage.value = "";
  loadActiveTab(1);
});

watch(() => route.path, () => {
  syncTabWithRoute();
});

onMounted(async () => {
  await loadTryouts();
  await loadActiveTab(1);
});

onBeforeUnmount(() => {
  if (searchDebounce.value) {
    clearTimeout(searchDebounce.value);
  }
});
</script>
