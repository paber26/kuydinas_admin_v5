<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Bank Soal SKD</h1>
        <p class="text-slate-500 text-sm">
          Kelola soal TWK, TIU, dan TKP untuk tryout CPNS
        </p>
      </div>

      <router-link
        to="/banksoal/create"
        class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
      >
        + Tambah Soal
      </router-link>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="item in categories"
        :key="item"
        @click="activeTab = item"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium',
          activeTab === item
            ? 'bg-purple-100 text-purple-600'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
        ]"
      >
        {{ item }}
      </button>
    </div>

    <!-- Filter Section -->
    <div class="bg-white rounded-xl shadow-sm border p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Subkategori -->
        <div>
          <label class="text-xs text-slate-500">Subkategori</label>
          <input
            v-model="filterSubCategory"
            type="text"
            class="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
            placeholder="Contoh: Pancasila"
          />
        </div>

        <!-- Tingkat Kesulitan -->
        <div>
          <label class="text-xs text-slate-500">Tingkat Kesulitan</label>
          <select
            v-model="filterDifficulty"
            class="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Semua</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <!-- Status -->
        <div>
          <label class="text-xs text-slate-500">Status</label>
          <select
            v-model="filterStatus"
            class="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Semua</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
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
            <th class="px-4 py-3 text-left">Soal</th>
            <th class="px-4 py-3 text-left">Subkategori</th>
            <th class="px-4 py-3 text-left">Kesulitan</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-left">Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, index) in filteredQuestions"
            :key="item.id"
            class="border-t hover:bg-slate-50"
          >
            <td class="px-4 py-3">{{ index + 1 }}</td>

            <td class="px-4 py-3 max-w-md truncate">
              {{ item.question }}
            </td>

            <td class="px-4 py-3">
              {{ item.sub_category || "-" }}
            </td>

            <td class="px-4 py-3">
              <span
                class="px-2 py-1 rounded-full text-xs"
                :class="{
                  'bg-green-100 text-green-600': item.difficulty === 'Easy',
                  'bg-yellow-100 text-yellow-600': item.difficulty === 'Medium',
                  'bg-red-100 text-red-600': item.difficulty === 'Hard',
                }"
              >
                {{ item.difficulty || "-" }}
              </span>
            </td>

            <td class="px-4 py-3">
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-green-100 text-green-600': item.status === 'aktif',
                  'bg-gray-200 text-gray-600': item.status === 'nonaktif',
                }"
              >
                {{ item.status }}
              </span>
            </td>

            <td class="px-4 py-3 flex gap-2">
              <button
                @click="openPreview(item)"
                class="text-blue-600 hover:underline text-xs"
              >
                Preview
              </button>

              <button
                @click="openEdit(item)"
                class="text-yellow-600 hover:underline text-xs"
              >
                Edit
              </button>

              <button
                @click="deleteSoal(item.id)"
                class="text-red-600 hover:underline text-xs"
              >
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="filteredQuestions.length === 0 && !loading"
        class="text-center text-slate-400 py-10"
      >
        Belum ada soal pada kategori ini
      </div>

      <div v-if="loading" class="text-center py-6 text-slate-500">
        Loading data...
      </div>
    </div>

    <!-- MODALS -->
    <PreviewModal v-model="showPreview" :soal="selectedSoal" />
    <EditModal v-model="showEdit" :soal="selectedSoal" @update="updateSoal" />

    <!-- TOAST -->
    <BaseToast v-model="showToast" :message="toastMessage" :type="toastType" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../../services/api";
import BaseToast from "../Toast/BaseToast.vue";
import PreviewModal from "./PreviewModal.vue";
import EditModal from "./EditModal.vue";

const categories = ["TWK", "TIU", "TKP"];
const activeTab = ref("TWK");

const questions = ref([]);
const loading = ref(false);

/* ============================
   FILTER STATE
============================ */
const filterSubCategory = ref("");
const filterDifficulty = ref("");
const filterStatus = ref("");

/* ============================
   TOAST
============================ */
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("success");

function showNotification(message, type = "success") {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
}

/* ============================
   MODAL STATE
============================ */
const showPreview = ref(false);
const showEdit = ref(false);
const selectedSoal = ref(null);

/* ============================
   FETCH DATA
============================ */
async function fetchQuestions() {
  try {
    loading.value = true;
    const response = await api.get("/soal");
    questions.value = response.data.data;
  } catch (error) {
    showNotification("Gagal mengambil data soal", "error");
  } finally {
    loading.value = false;
  }
}

/* ============================
   FILTERED DATA
============================ */
const filteredQuestions = computed(() => {
  return questions.value
    .filter((q) => q.category === activeTab.value)
    .filter((q) =>
      filterSubCategory.value
        ? q.sub_category
            ?.toLowerCase()
            .includes(filterSubCategory.value.toLowerCase())
        : true,
    )
    .filter((q) =>
      filterDifficulty.value ? q.difficulty === filterDifficulty.value : true,
    )
    .filter((q) =>
      filterStatus.value ? q.status === filterStatus.value : true,
    );
});

/* ============================
   MODAL ACTIONS
============================ */
function openPreview(soal) {
  selectedSoal.value = soal;
  showPreview.value = true;
}

function openEdit(soal) {
  selectedSoal.value = soal;
  showEdit.value = true;
}

async function updateSoal(data) {
  try {
    await api.put(`/soal/${data.id}`, data);
    showNotification("Soal berhasil diperbarui", "success");
    showEdit.value = false;
    fetchQuestions();
  } catch (error) {
    showNotification("Gagal memperbarui soal", "error");
  }
}

async function deleteSoal(id) {
  if (!confirm("Yakin ingin menghapus soal ini?")) return;

  try {
    await api.delete(`/soal/${id}`);
    showNotification("Soal berhasil dihapus", "success");
    fetchQuestions();
  } catch (error) {
    showNotification("Gagal menghapus soal", "error");
  }
}

onMounted(fetchQuestions);
</script>

<style scoped>
table th {
  font-weight: 600;
}
</style>
