<template>
  <div class="p-8 bg-slate-50 min-h-screen">
    <!-- ================= HEADER ================= -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Detail Tryout</h1>
        <p class="text-slate-500 text-sm mt-1">
          {{ tryout?.title }}
        </p>
      </div>

      <router-link
        to="/tryout-builder"
        class="px-4 py-2 bg-white border rounded-lg hover:bg-slate-100 text-sm"
      >
        Kembali
      </router-link>
    </div>

    <!-- ================= INFO CARD ================= -->
    <div v-if="tryout" class="bg-white rounded-2xl shadow-sm border p-6 mb-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <p class="text-xs text-slate-500">Durasi</p>
          <p class="font-semibold">{{ tryout.duration }} menit</p>
        </div>

        <div>
          <p class="text-xs text-slate-500">Total Soal</p>
          <p class="font-semibold">{{ tryout.soals.length }}</p>
        </div>

        <div>
          <p class="text-xs text-slate-500">Total Ditampilkan</p>
          <p class="font-semibold">{{ filteredSoals.length }}</p>
        </div>

        <div>
          <p class="text-xs text-slate-500">Status</p>
          <span
            class="px-3 py-1 rounded-full text-xs"
            :class="
              tryout.status === 'publish'
                ? 'bg-green-100 text-green-600'
                : 'bg-yellow-100 text-yellow-600'
            "
          >
            {{ tryout.status }}
          </span>
        </div>

        <div v-if="tryout.type === 'free'">
          <p class="text-xs text-slate-500">Masa berlaku gratis</p>
          <p class="font-semibold">
            {{ formatFreeValidity(tryout) }}
          </p>
        </div>
      </div>
    </div>

    <!-- ================= LIST SOAL ================= -->
    <div v-if="tryout" class="bg-white rounded-2xl shadow-sm border p-8">
      <h2 class="text-xl font-semibold mb-8">Daftar Soal</h2>
      <!-- FILTER KATEGORI -->
      <div class="mb-6 flex items-center gap-4">
        <label class="text-sm text-slate-600">Filter Kategori:</label>
        <select
          v-model="selectedCategory"
          class="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">Semua</option>
          <option value="TWK">TWK</option>
          <option value="TIU">TIU</option>
          <option value="TKP">TKP</option>
        </select>
      </div>

      <div class="space-y-6">
        <div
          v-for="(soal, index) in filteredSoals"
          :key="soal.id"
          class="border rounded-xl p-6 bg-white shadow-sm"
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <span class="text-sm font-semibold text-slate-500">
                Soal {{ index + 1 }}
              </span>

              <span
                class="px-3 py-1 text-xs rounded-full font-medium"
                :class="badge(soal.category)"
              >
                {{ soal.category }}
              </span>
            </div>

            <button
              @click="openEditModal(soal)"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-xs"
            >
              Edit
            </button>
          </div>

          <!-- Pertanyaan -->
          <div
            class="text-sm text-slate-800 whitespace-pre-line mb-4"
            v-html="renderLatex(soal.question)"
          ></div>

          <!-- Opsi Jawaban -->
          <div v-if="soal.options" class="space-y-2 mb-4">
            <div
              v-for="opt in soal.options"
              :key="opt.label"
              class="flex items-start justify-between text-sm gap-4"
            >
              <div class="flex gap-2 flex-1">
                <span class="font-semibold">{{ opt.label }}.</span>
                <span
                  class="whitespace-pre-line"
                  v-html="renderLatex(opt.text)"
                ></span>
              </div>
              <div class="flex items-center gap-2">
                <!-- skor untuk TKP -->
                <span
                  v-if="soal.category === 'TKP' && opt.score !== undefined"
                  class="ml-2 text-xs px-2 py-1 rounded bg-slate-100 text-slate-600"
                >
                  Skor: {{ opt.score }}
                </span>
                <!-- TWK / TIU -->
                <span
                  v-if="
                    soal.category !== 'TKP' && soal.correct_answer === opt.label
                  "
                  class="text-green-600 font-semibold ml-2"
                >
                  ✔ Jawaban Benar
                </span>
                <!-- TKP (score tertinggi) -->
                <span
                  v-if="soal.category === 'TKP' && opt.score === 5"
                  class="text-green-600 font-semibold ml-2"
                >
                  ✔ Skor Tertinggi
                </span>
              </div>
            </div>
          </div>

          <!-- Jawaban benar -->
          <div
            v-if="soal.category !== 'TKP' && soal.correct_answer"
            class="text-sm mb-3"
          >
            <span class="font-semibold text-slate-600">Jawaban Benar:</span>
            <span class="text-green-600 font-semibold">
              {{ soal.correct_answer }}</span
            >
          </div>

          <!-- Pembahasan -->
          <div v-if="soal.explanation" class="border-t pt-4 mt-4">
            <p class="text-xs text-slate-500 mb-1">Pembahasan</p>
            <div
              class="text-sm text-slate-700 whitespace-pre-line"
              v-html="renderLatex(soal.explanation)"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <EditModal
      v-model="showEditModal"
      :soal="selectedSoal"
      :saving="savingEdit"
      submit-label="Simpan ke API"
      @update="updateSoal"
    />

    <BaseToast v-model="showToast" :type="toastType" :message="toastMessage" />

    <div v-if="loading" class="text-center py-10">Loading...</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import "katex/dist/katex.min.css";
import { useRoute } from "vue-router";
import api from "../../services/api";
import BaseToast from "../Toast/BaseToast.vue";
import EditModal from "../BankSoal/EditModal.vue";
import { renderRichHtmlWithLatex } from "../../utils/richText.js";

const route = useRoute();

const tryout = ref(null);
const loading = ref(false);
const showEditModal = ref(false);
const selectedSoal = ref(null);
const selectedCategory = ref("");
const savingEdit = ref(false);
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("success");

function showNotification(message, type = "success") {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
}

/* ================= FETCH ================= */
async function fetchTryout() {
  try {
    loading.value = true;

    const res = await api.get(`/tryouts/${route.params.id}`);

    const data = res.data.data;

    const soals = data.soals || [];

    // pisahkan kategori
    const twk = soals
      .filter((s) => s.category === "TWK")
      .sort((a, b) => a.pivot?.urutan_soal - b.pivot?.urutan_soal);

    const tiu = soals
      .filter((s) => s.category === "TIU")
      .sort((a, b) => a.pivot?.urutan_soal - b.pivot?.urutan_soal);

    const tkp = soals
      .filter((s) => s.category === "TKP")
      .sort((a, b) => a.pivot?.urutan_soal - b.pivot?.urutan_soal);

    // gabungkan urutan kategori
    data.soals = [...twk, ...tiu, ...tkp];

    tryout.value = data;
  } finally {
    loading.value = false;
  }
}

const filteredSoals = computed(() => {
  if (!tryout.value) return [];

  if (!selectedCategory.value) return tryout.value.soals;

  return tryout.value.soals.filter(
    (s) => s.category === selectedCategory.value,
  );
});

/* ================= BADGE ================= */
function badge(category) {
  if (category === "TWK") return "bg-blue-100 text-blue-600";
  if (category === "TIU") return "bg-green-100 text-green-600";
  if (category === "TKP") return "bg-orange-100 text-orange-600";
  return "bg-gray-100 text-gray-600";
}

/* ================= EDIT ================= */
function openEditModal(soal) {
  selectedSoal.value = JSON.parse(JSON.stringify(soal));
  showEditModal.value = true;
}

async function updateSoal(data) {
  try {
    savingEdit.value = true;
    await api.put(`/soal/${data.id}`, data);
    await fetchTryout();
    showEditModal.value = false;
    showNotification("Soal berhasil disimpan ke API.", "success");
  } catch (error) {
    showNotification(
      error.response?.data?.message || "Gagal menyimpan perubahan soal.",
      "error",
    );
  } finally {
    savingEdit.value = false;
  }
}

function renderLatex(text) {
  return renderRichHtmlWithLatex(text);
}

function formatFreeValidity(item) {
  if (item?.free_valid_until) {
    const date = new Date(item.free_valid_until);

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    }

    return item.free_valid_until;
  }

  return `${item?.free_valid_days ?? 7} hari`;
}

onMounted(fetchTryout);
</script>
