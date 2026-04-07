<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Daftar Tryout</h1>
        <p class="text-slate-500 text-sm">
          Kelola semua paket tryout yang dibuat dari Bank Soal
        </p>
      </div>

      <router-link
        to="/tryout-builder/create"
        class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
      >
        + Tambah Tryout
      </router-link>
    </div>

    <div class="mb-4 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4">
      <div>
        <p class="text-sm font-semibold text-slate-700">Filter Data</p>
        <p class="text-xs text-slate-500">
          Saring tryout berdasarkan masa akses paket gratis.
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div class="w-full">
          <label class="mb-1 block text-xs font-medium text-slate-500">
            Tipe Tryout
          </label>
          <select
            v-model="filters.type"
            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            <option value="all">Semua tipe</option>
            <option value="free">Gratis</option>
            <option value="premium">Premium</option>
          </select>
        </div>

        <div class="w-full">
          <label class="mb-1 block text-xs font-medium text-slate-500">
            Masa Akses
          </label>
          <select
            v-model="filters.accessPeriod"
            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            <option value="all">Semua masa akses</option>
            <option value="active">Sedang aktif</option>
            <option value="upcoming">Akan datang</option>
            <option value="expired">Sudah berakhir</option>
            <option value="unlimited">Tanpa batas</option>
          </select>
        </div>

        <div class="w-full">
          <label class="mb-1 block text-xs font-medium text-slate-500">
            Diskon
          </label>
          <select
            v-model="filters.discount"
            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            <option value="all">Semua tryout</option>
            <option value="discounted">Sedang diskon</option>
            <option value="non_discounted">Tanpa diskon</option>
          </select>
        </div>

        <div class="w-full">
          <label class="mb-1 block text-xs font-medium text-slate-500">
            Status Tryout
          </label>
          <select
            v-model="filters.status"
            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            <option value="all">Semua status</option>
            <option value="publish">Publish</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>
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
            <th class="px-4 py-3 text-left">Tipe</th>
            <th class="px-4 py-3 text-left">Masa Akses</th>
            <th class="px-4 py-3 text-left">Harga</th>
            <th class="px-4 py-3 text-left">Kuota</th>
            <th class="px-4 py-3 text-left">Info Link</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-left">Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, index) in filteredTryouts"
            :key="item.id"
            class="border-t hover:bg-slate-50"
          >
            <td class="px-4 py-3">{{ index + 1 }}</td>

            <td class="px-4 py-3 font-medium">
              {{ item.title }}
            </td>

            <td class="px-4 py-3">{{ item.soals_count ?? 0 }} soal</td>

            <td class="px-4 py-3">{{ item.duration }} menit</td>

            <td class="px-4 py-3">
              <span
                class="px-2 py-1 rounded-full text-xs"
                :class="
                  item.type === 'free'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-purple-100 text-purple-600'
                "
              >
                {{ item.type === "free" ? "Gratis" : "Premium" }}
              </span>
            </td>

            <td class="px-4 py-3">
              <span v-if="item.type === 'free'" class="text-[11px] text-slate-500 whitespace-nowrap">
                {{ formatTimeline(item.free_start_date, item.free_valid_until) }}
              </span>
              <span v-else class="text-slate-400">-</span>
            </td>

            <!-- PERBAIKAN HARGA -->
            <td class="px-4 py-3">
              <span
                v-if="(item.price ?? 0) > 0"
                class="font-medium text-purple-600"
              >
                {{ item.price }} koin
              </span>
              <span v-else class="text-green-600 font-medium"> Gratis </span>
            </td>

            <td class="px-4 py-3">
              <span v-if="item.type === 'free'">
                {{ item.quota ?? "-" }}
              </span>
              <span v-else>-</span>
            </td>

            <td class="px-4 py-3 text-xs">
              <div v-if="item.type === 'free'" class="flex flex-col gap-1">
                <input v-model="item.info_ig" @change="updateStatus(item, 'Link diperbarui')" placeholder="IG Link" class="border rounded px-2 py-1 w-24 bg-white" />
                <input v-model="item.info_wa" @change="updateStatus(item, 'Link diperbarui')" placeholder="WA Link" class="border rounded px-2 py-1 w-24 bg-white" />
              </div>
              <span v-else>-</span>
            </td>

            <td class="px-4 py-3">
              <select
                v-model="item.status"
                @change="updateStatus(item, 'Status diperbarui')"
                class="border rounded-md text-xs px-2 py-1 bg-white"
              >
                <option value="draft">Draft</option>
                <option value="publish">Publish</option>
              </select>
            </td>

            <td class="px-4 py-3 flex gap-3">
              <router-link
                :to="`/tryout-builder/${item.id}`"
                class="text-blue-600 hover:underline text-xs"
              >
                Detail
              </router-link>

              <router-link
                :to="`/tryout-builder/${item.id}/manage`"
                class="text-purple-600 hover:underline text-xs"
              >
                Kelola Soal
              </router-link>

              <button
                v-if="item.status !== 'publish'"
                @click="publishTryout(item)"
                class="text-green-600 hover:underline text-xs"
              >
                Terbitkan
              </button>

              <button
                @click="deleteTryout(item.id)"
                class="text-red-600 hover:underline text-xs"
              >
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty -->
      <div
        v-if="filteredTryouts.length === 0 && !loading"
        class="text-center text-slate-400 py-10"
      >
        Belum ada tryout yang cocok dengan filter masa akses
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-6 text-slate-500">
        Loading data...
      </div>
    </div>

    <!-- Toast -->
    <BaseToast v-model="showToast" :type="toastType" :message="toastMessage" />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import api from "../../services/api.js";
import BaseToast from "../Toast/BaseToast.vue";

const tryouts = ref([]);
const loading = ref(false);
const filters = ref({
  type: "all",
  accessPeriod: "all",
  discount: "all",
  status: "all",
});

/* =========================
   TOAST
========================= */

const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("success");

function showNotification(message, type = "success") {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
}

/* =========================
   FETCH TRYOUT
========================= */

async function fetchTryouts() {
  try {
    loading.value = true;

    const response = await api.get("/tryouts");

    const data = response.data.data;

    tryouts.value = Array.isArray(data) ? data : (data.data ?? []);
  } catch (error) {
    console.error("Gagal mengambil tryout:", error.response?.data || error);

    showNotification("Gagal mengambil data tryout", "error");
  } finally {
    loading.value = false;
  }
}

/* =========================
   DELETE TRYOUT
========================= */

async function deleteTryout(id) {
  if (!confirm("Yakin ingin menghapus tryout ini?")) return;

  try {
    await api.delete(`/tryouts/${id}`);

    tryouts.value = tryouts.value.filter((item) => item.id !== id);

    showNotification("Tryout berhasil dihapus");
  } catch (error) {
    console.error("Gagal menghapus:", error.response?.data || error);

    showNotification("Gagal menghapus tryout", "error");
  }
}

/* =========================
   UPDATE STATUS
========================= */

async function updateStatus(item, message = 'Tryout berhasil diperbarui') {
  try {
    if (item.status === "publish") {
      await api.post(`/tryouts/${item.id}/publish`);
      // Update the rest of the metadata even if published (sometimes needed)
      await api.put(`/tryouts/${item.id}`, {
        status: item.status,
        title: item.title,
        duration: item.duration,
        type: item.type,
        price: item.price,
        discount: item.discount,
        info_ig: item.info_ig,
        info_wa: item.info_wa,
        twk_count: item.twk_target,
        tiu_count: item.tiu_target,
        tkp_count: item.tkp_target,
        twk_pg: item.twk_pg,
        tiu_pg: item.tiu_pg,
        tkp_pg: item.tkp_pg,
      });
    } else {
      await api.put(`/tryouts/${item.id}`, {
        status: item.status,
        title: item.title,
        duration: item.duration,
        type: item.type,
        price: item.price,
        discount: item.discount,
        info_ig: item.info_ig,
        info_wa: item.info_wa,
        twk_count: item.twk_target,
        tiu_count: item.tiu_target,
        tkp_count: item.tkp_target,
        twk_pg: item.twk_pg,
        tiu_pg: item.tiu_pg,
        tkp_pg: item.tkp_pg,
      });
    }

    showNotification(message);
  } catch (error) {
    console.error("Gagal mengubah status:", error.response?.data || error);
    showNotification("Gagal mengubah status tryout", "error");
  }
}

async function publishTryout(item) {
  try {
    await api.post(`/tryouts/${item.id}/publish`);
    item.status = "publish";
    showNotification("Tryout berhasil dipublish");
  } catch (error) {
    console.error("Gagal publish:", error.response?.data || error);
    const msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Gagal publish tryout";
    showNotification(msg, "error");
  }
}

const parseDateTime = (value) => {
  if (!value) return null;

  const parsed = new Date(String(value).replace(" ", "T"));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const isAccessActive = (item) => {
  if (item.type !== "free") return true;

  const now = new Date();
  const start = parseDateTime(item.free_start_date);
  const end = parseDateTime(item.free_valid_until);

  if (!start && !end) return false;
  if (start && now < start) return false;
  if (end && now > end) return false;

  return true;
};

const isAccessUpcoming = (item) => {
  if (item.type !== "free") return false;

  const now = new Date();
  const start = parseDateTime(item.free_start_date);
  return Boolean(start && now < start);
};

const isAccessExpired = (item) => {
  if (item.type !== "free") return false;

  const now = new Date();
  const end = parseDateTime(item.free_valid_until);
  return Boolean(end && now > end);
};

const isAccessUnlimited = (item) => {
  if (item.type !== "free") return false;
  return !item.free_start_date && !item.free_valid_until;
};

const filteredTryouts = computed(() => {
  const selectedType = filters.value.type;
  const selectedFilter = filters.value.accessPeriod;
  const selectedDiscount = filters.value.discount;
  const selectedStatus = filters.value.status;

  return tryouts.value.filter((item) => {
    if (selectedType !== "all" && item.type !== selectedType) {
      return false;
    }

    if (selectedStatus !== "all" && item.status !== selectedStatus) {
      return false;
    }

    const discountValue = Number(item.discount ?? 0);

    if (selectedDiscount === "discounted" && discountValue <= 0) {
      return false;
    }

    if (selectedDiscount === "non_discounted" && discountValue > 0) {
      return false;
    }

    if (selectedFilter === "all") {
      return true;
    }

    if (selectedFilter === "active") return isAccessActive(item);
    if (selectedFilter === "upcoming") return isAccessUpcoming(item);
    if (selectedFilter === "expired") return isAccessExpired(item);
    if (selectedFilter === "unlimited") return isAccessUnlimited(item);
    return true;
  });
});

const formatTimeline = (start, end) => {
  if (!start && !end) return "Tanpa batas";
  
  const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  
  const startStr = start ? new Date(start.replace(' ', 'T')).toLocaleDateString('id-ID', options).replace(/\./g, ':') : "Sekarang";
  const endStr = end ? new Date(end.replace(' ', 'T')).toLocaleDateString('id-ID', options).replace(/\./g, ':') : "Seterusnya";
  return `${startStr} - ${endStr}`;
};

onMounted(fetchTryouts);
</script>

<style scoped>
table th {
  font-weight: 600;
}
</style>
