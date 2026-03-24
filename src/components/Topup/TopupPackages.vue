<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Paket Top Up</h1>
        <p class="text-slate-500 text-sm">Kelola paket top up koin</p>
      </div>
      <button @click="openCreate" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm">
        + Tambah Paket
      </button>
    </div>

    <div class="flex items-center gap-3 mb-4">
      <input
        v-model="q"
        type="text"
        placeholder="Cari paket..."
        class="w-64 border border-slate-300 rounded-lg px-3 py-2 outline-none"
      />
      <select v-model="isActive" class="border rounded-md text-sm px-2 py-2 bg-white">
        <option value="">Semua</option>
        <option value="1">Aktif</option>
        <option value="0">Tidak Aktif</option>
      </select>
    </div>

    <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-slate-600">
          <tr>
            <th class="px-4 py-3 text-left">Nama</th>
            <th class="px-4 py-3 text-left">Coin</th>
            <th class="px-4 py-3 text-left">Bonus</th>
            <th class="px-4 py-3 text-left">Harga</th>
            <th class="px-4 py-3 text-left">Aktif</th>
            <th class="px-4 py-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="border-t hover:bg-slate-50">
            <td class="px-4 py-3 font-medium">{{ item.name }}</td>
            <td class="px-4 py-3">{{ item.coin_amount }}</td>
            <td class="px-4 py-3">{{ item.bonus_coin ?? 0 }}</td>
            <td class="px-4 py-3">{{ formatPrice(item.price) }}</td>
            <td class="px-4 py-3">
              <span class="px-2 py-1 rounded-full text-xs" :class="item.is_active ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'">
                {{ item.is_active ? "Aktif" : "Nonaktif" }}
              </span>
            </td>
            <td class="px-4 py-3 flex gap-3">
              <button @click="openEdit(item)" class="text-blue-600 hover:underline text-xs">Edit</button>
              <button @click="removeItem(item.id)" class="text-red-600 hover:underline text-xs">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="items.length === 0 && !loading" class="text-center text-slate-400 py-10">
        Tidak ada data
      </div>
      <div v-if="loading" class="text-center py-6 text-slate-500">Memuat...</div>
    </div>

    <div class="flex items-center justify-between mt-4">
      <div class="text-sm text-slate-500">Halaman {{ page }} / {{ lastPage }}</div>
      <div class="flex gap-2">
        <button @click="prevPage" :disabled="page <= 1 || loading" class="px-3 py-2 border rounded disabled:opacity-60">Sebelumnya</button>
        <button @click="nextPage" :disabled="page >= lastPage || loading" class="px-3 py-2 border rounded disabled:opacity-60">Berikutnya</button>
      </div>
    </div>

    <TopupPackageForm v-model="showForm" :item="editingItem" @submit="submitForm" />
    <BaseToast v-model="showToast" :type="toastType" :message="toastMessage" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import debounce from "lodash/debounce";
import BaseToast from "../Toast/BaseToast.vue";
import TopupPackageForm from "./TopupPackageForm.vue";
import api from "../../services/topupPackagesApi.js";

const items = ref([]);
const loading = ref(false);
const page = ref(1);
const lastPage = ref(1);
const perPage = ref(20);
const q = ref("");
const isActive = ref("");

const showForm = ref(false);
const editingItem = ref(null);

const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("success");

function showNotification(message, type = "success") {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
}

function formatPrice(val) {
  const n = Number(val || 0);
  return new Intl.NumberFormat("id-ID").format(n);
}

async function fetchList() {
  loading.value = true;
  try {
    const params = { page: page.value, per_page: perPage.value };
    if (q.value) params.q = q.value;
    if (isActive.value !== "") params.is_active = isActive.value;
    const res = await api.list(params);
    const payload = res.data;
    const rows = Array.isArray(payload.data) ? payload.data : (payload?.data?.data ?? []);
    items.value = rows || [];
    lastPage.value =
      payload?.last_page ??
      payload?.data?.last_page ??
      payload?.meta?.last_page ??
      1;
    page.value =
      payload?.current_page ??
      payload?.data?.current_page ??
      payload?.meta?.current_page ??
      page.value;
  } catch (error) {
    showNotification("Gagal memuat paket", "error");
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editingItem.value = null;
  showForm.value = true;
}

function openEdit(item) {
  editingItem.value = { ...item };
  showForm.value = true;
}

async function submitForm(payload) {
  try {
    if (editingItem.value && editingItem.value.id) {
      await api.update(editingItem.value.id, payload);
      showNotification("Paket berhasil diperbarui");
    } else {
      await api.create(payload);
      showNotification("Paket berhasil ditambahkan");
    }
    showForm.value = false;
    await fetchList();
  } catch (error) {
    const status = error?.response?.status;
    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Gagal menyimpan paket";
    if (status === 401 || status === 403) {
      showNotification("Unauthorized", "error");
    } else if (status === 422) {
      showNotification(msg, "error");
    } else {
      showNotification(msg, "error");
    }
  }
}

async function removeItem(id) {
  if (!confirm("Yakin ingin menghapus paket ini?")) return;
  try {
    await api.remove(id);
    showNotification("Paket berhasil dihapus");
    await fetchList();
  } catch (error) {
    const status = error?.response?.status;
    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Gagal menghapus paket";
    if (status === 422) {
      showNotification(msg, "error");
    } else {
      showNotification("Gagal menghapus paket", "error");
    }
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
watch(isActive, () => {
  page.value = 1;
  fetchList();
});

onMounted(fetchList);
</script>
