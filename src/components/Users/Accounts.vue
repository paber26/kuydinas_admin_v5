<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Daftar Akun</h1>
        <p class="text-slate-500 text-sm">Kelola status aktif akun pengguna</p>
      </div>
      <div class="text-sm text-slate-500">
        <span class="px-2 py-1 rounded-full bg-slate-100">Admin</span>
      </div>
    </div>

    <div
      v-if="errorMessage"
      class="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg"
    >
      {{ errorMessage }}
    </div>

    <div class="flex items-center gap-3 mb-4">
      <input
        v-model="q"
        type="text"
        placeholder="Cari nama/email..."
        class="w-72 border border-slate-300 rounded-lg px-3 py-2 outline-none"
      />

      <select
        v-model="coinFilter"
        class="border rounded-md text-sm px-2 py-2 bg-white"
      >
        <option value="">Semua Koin</option>
        <option value="has_coin">Punya Koin (>0)</option>
        <option value="no_coin">0 Koin</option>
      </select>

      <div class="flex items-center gap-2 bg-slate-50 border rounded-lg px-2 py-1">
        <span class="text-[10px] uppercase font-bold text-slate-400">Rentang:</span>
        <input
          v-model="startDate"
          type="date"
          class="bg-transparent border-none text-xs outline-none focus:ring-0"
        />
        <span class="text-slate-300">-</span>
        <input
          v-model="endDate"
          type="date"
          class="bg-transparent border-none text-xs outline-none focus:ring-0"
        />
      </div>

      <select
        v-model.number="perPage"
        class="border rounded-md text-sm px-2 py-2 bg-white ml-auto"
      >
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
    </div>

    <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-slate-600">
          <tr>
            <th class="px-4 py-3 text-left">ID</th>
            <th class="px-4 py-3 text-left">Nama</th>
            <th class="px-4 py-3 text-left">Email</th>
            <th class="px-4 py-3 text-left">Jumlah Koin</th>
            <th class="px-4 py-3 text-left">Tgl Pendaftaran</th>
            <th class="px-4 py-3 text-left">Kelengkapan Profil</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="item in items"
            :key="item.id"
            class="border-t hover:bg-slate-50"
          >
            <td class="px-4 py-3">{{ item.id }}</td>
            <td class="px-4 py-3 font-medium">
              <div class="flex items-center gap-3">
                <img
                  :src="item.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.name) + '&background=random'"
                  class="w-8 h-8 rounded-full object-cover border border-slate-100"
                  alt="Avatar"
                />
                <router-link
                  :to="'/accounts/' + item.id"
                  class="text-blue-600 hover:underline"
                >
                  {{ item.name || "-" }}
                </router-link>
              </div>
            </td>
            <td class="px-4 py-3">{{ item.email || "-" }}</td>
            <td class="px-4 py-3">{{ formatNumber(item.coin_balance) }}</td>
            <td class="px-4 py-3">{{ formatDate(item.created_at) }}</td>
            <td class="px-4 py-3">
              <span
                class="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight"
                :class="isProfileComplete(item) ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'"
              >
                {{ isProfileComplete(item) ? 'Lengkap' : 'Belum Lengkap' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="items.length === 0 && !loading"
        class="text-center text-slate-400 py-10"
      >
        Tidak ada data
      </div>
      <div v-if="loading" class="text-center py-6 text-slate-500">
        Memuat...
      </div>
    </div>

    <div class="flex items-center justify-between mt-4">
      <div class="text-sm text-slate-500">
        Halaman {{ page }} / {{ lastPage }}
      </div>
      <div class="flex gap-2">
        <button
          @click="prevPage"
          :disabled="page <= 1 || loading"
          class="px-3 py-2 border rounded disabled:opacity-60"
        >
          Sebelumnya
        </button>
        <button
          @click="nextPage"
          :disabled="page >= lastPage || loading"
          class="px-3 py-2 border rounded disabled:opacity-60"
        >
          Berikutnya
        </button>
      </div>
    </div>

    <BaseToast v-model="showToast" :type="toastType" :message="toastMessage" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import debounce from "lodash/debounce";
import BaseToast from "../Toast/BaseToast.vue";
import adminUsersApi from "../../services/adminUsersApi.js";

const items = ref([]);
const loading = ref(false);
const page = ref(1);
const lastPage = ref(1);
const perPage = ref(20);
const q = ref("");
const coinFilter = ref("");
const startDate = ref("");
const endDate = ref("");

const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("success");
const errorMessage = ref("");

function showNotification(message, type = "success") {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
}

function formatNumber(val) {
  try {
    return Number(val || 0).toLocaleString("id-ID");
  } catch {
    return String(val ?? 0);
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function isProfileComplete(user) {
  return !!(user.whatsapp && user.province_name && user.regency_name);
}

function readPaginated(res) {
  const root = res?.data;
  const pager = root?.data;

  if (pager && Array.isArray(pager.data)) {
    return {
      rows: pager.data,
      lastPage: Number(pager.last_page ?? 1) || 1,
      currentPage: Number(pager.current_page ?? page.value) || page.value,
    };
  }

  if (root && Array.isArray(root.data)) {
    const rows = root.data;
    const total = Number(root.total ?? rows.length) || 0;
    const last =
      Number(root.last_page ?? Math.max(1, Math.ceil(total / perPage.value))) ||
      1;
    const current = Number(root.current_page ?? page.value) || page.value;
    return { rows, lastPage: last, currentPage: current };
  }

  return { rows: [], lastPage: 1, currentPage: page.value };
}

async function fetchList() {
  loading.value = true;
  errorMessage.value = "";
  try {
    const params = { page: page.value, per_page: perPage.value };
    if (q.value) params.q = q.value;
    if (coinFilter.value !== "") params.coin_filter = coinFilter.value;
    if (startDate.value) params.start_date = startDate.value;
    if (endDate.value) params.end_date = endDate.value;

    const res = await adminUsersApi.list(params);
    const parsed = readPaginated(res);
    items.value = parsed.rows || [];
    lastPage.value = parsed.lastPage || 1;
    page.value = parsed.currentPage || page.value;
  } catch (error) {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
      return;
    }
    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Gagal memuat akun";
    errorMessage.value = msg;
    showNotification(msg, "error");
  } finally {
    loading.value = false;
  }
}


function nextPage() {
  if (page.value < lastPage.value) {
    page.value += 1;
    fetchList();
  }
}

function prevPage() {
  if (page.value > 1) {
    page.value -= 1;
    fetchList();
  }
}

const runSearch = debounce(() => {
  page.value = 1;
  fetchList();
}, 400);

watch(q, runSearch);
watch(coinFilter, () => {
  page.value = 1;
  fetchList();
});
watch(startDate, () => {
  page.value = 1;
  fetchList();
});
watch(endDate, () => {
  page.value = 1;
  fetchList();
});
watch(perPage, () => {
  page.value = 1;
  fetchList();
});

onMounted(fetchList);
</script>
