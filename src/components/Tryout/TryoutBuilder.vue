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

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-slate-600">
          <tr>
            <th class="px-4 py-3 text-left">No</th>
            <th class="px-4 py-3 text-left">Nama Tryout</th>
            <th class="px-4 py-3 text-left">Total Soal</th>
            <th class="px-4 py-3 text-left">Durasi</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-left">Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, index) in tryouts"
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
                  item.status === 'publish'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-600'
                "
              >
                {{ item.status === "publish" ? "Publish" : "Draft" }}
              </span>
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
        v-if="tryouts.length === 0 && !loading"
        class="text-center text-slate-400 py-10"
      >
        Belum ada tryout yang dibuat
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
import { ref, onMounted } from "vue";
import api from "../../services/api.js";
import BaseToast from "../Toast/BaseToast.vue";

const tryouts = ref([]);
const loading = ref(false);

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

onMounted(fetchTryouts);
</script>

<style scoped>
table th {
  font-weight: 600;
}
</style>
