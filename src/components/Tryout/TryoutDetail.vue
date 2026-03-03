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
          <p class="text-xs text-slate-500">Halaman</p>
          <p class="font-semibold">{{ currentPage }} / {{ totalPages }}</p>
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

      <div class="overflow-x-auto">
        <table class="w-full text-sm border rounded-xl overflow-hidden">
          <thead class="bg-slate-100 text-slate-600">
            <tr>
              <th class="px-4 py-3 text-left">No</th>
              <th class="px-4 py-3 text-left">Kategori</th>
              <th class="px-4 py-3 text-left">Pertanyaan</th>
              <th class="px-4 py-3 text-left">Aksi</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(soal, index) in paginatedSoals"
              :key="soal.id"
              class="border-t hover:bg-slate-50 transition"
            >
              <td class="px-4 py-3">
                {{ startIndex + index + 1 }}
              </td>

              <td class="px-4 py-3">
                <span
                  class="px-3 py-1 text-xs rounded-full font-medium"
                  :class="badge(soal.category)"
                >
                  {{ soal.category }}
                </span>
              </td>

              <td class="px-4 py-3 max-w-lg truncate">
                {{ soal.question }}
              </td>

              <td class="px-4 py-3">
                <button
                  @click="openEditModal(soal)"
                  class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-xs"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ================= PAGINATION ================= -->
      <div class="flex justify-center items-center gap-2 mt-10">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded-lg text-sm bg-slate-100 disabled:opacity-40"
        >
          Prev
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          :class="[
            'px-3 py-1 rounded-lg text-sm',
            currentPage === page
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 hover:bg-slate-200',
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded-lg text-sm bg-slate-100 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>

    <!-- ================= EDIT MODAL ================= -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8">
        <h3 class="text-xl font-semibold mb-6">Edit Soal</h3>

        <div class="space-y-5">
          <div>
            <label class="text-xs text-slate-500">Kategori</label>
            <input
              v-model="selectedSoal.category"
              type="text"
              disabled
              class="w-full border rounded-lg px-3 py-2 text-sm mt-1 bg-slate-100"
            />
          </div>

          <div>
            <label class="text-xs text-slate-500">Subkategori</label>
            <input
              v-model="selectedSoal.sub_category"
              type="text"
              disabled
              class="w-full border rounded-lg px-3 py-2 text-sm mt-1 bg-slate-100"
            />
          </div>

          <div>
            <label class="text-xs text-slate-500">Pertanyaan</label>
            <textarea
              v-model="selectedSoal.question"
              rows="4"
              class="w-full border rounded-lg px-3 py-2 text-sm mt-1"
            ></textarea>
          </div>

          <div>
            <label class="text-xs text-slate-500">Tingkat Kesulitan</label>
            <select
              v-model="selectedSoal.difficulty"
              class="w-full border rounded-lg px-3 py-2 text-sm mt-1"
            >
              <option value="">Pilih Kesulitan</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div v-if="selectedSoal.options">
            <label class="text-xs text-slate-500 block mb-2">
              Opsi Jawaban
            </label>

            <div
              v-for="(opt, i) in selectedSoal.options"
              :key="i"
              class="flex items-center gap-3 mb-3"
            >
              <span class="w-6 font-semibold text-sm">
                {{ opt.label }}
              </span>

              <input
                v-model="opt.text"
                type="text"
                class="flex-1 border rounded-lg px-3 py-2 text-sm"
              />

              <template v-if="selectedSoal.category !== 'TKP'">
                <input
                  type="radio"
                  :value="opt.label"
                  v-model="selectedSoal.correct_answer"
                />
              </template>

              <template v-else>
                <input
                  v-model.number="opt.score"
                  type="number"
                  min="1"
                  max="5"
                  class="w-16 border rounded-lg px-2 py-1 text-sm"
                />
              </template>
            </div>
          </div>

          <div>
            <label class="text-xs text-slate-500">Pembahasan</label>
            <textarea
              v-model="selectedSoal.explanation"
              rows="3"
              class="w-full border rounded-lg px-3 py-2 text-sm mt-1"
            ></textarea>
          </div>

          <div>
            <label class="text-xs text-slate-500">Status</label>
            <select
              v-model="selectedSoal.status"
              class="w-full border rounded-lg px-3 py-2 text-sm mt-1"
            >
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-8">
          <button
            @click="showEditModal = false"
            class="px-4 py-2 text-sm border rounded-lg"
          >
            Batal
          </button>

          <button
            @click="updateSoal"
            class="px-5 py-2 text-sm bg-indigo-600 text-white rounded-lg"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-10">Loading...</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "../../services/api";

const route = useRoute();

const tryout = ref(null);
const loading = ref(false);
const showEditModal = ref(false);
const selectedSoal = ref(null);
const selectedCategory = ref("");

const currentPage = ref(1);
const perPage = 10;

/* ================= FETCH ================= */
async function fetchTryout() {
  try {
    loading.value = true;
    const res = await api.get(`/tryouts/${route.params.id}`);
    tryout.value = res.data.data;
  } finally {
    loading.value = false;
  }
}

/* ================= PAGINATION ================= */
const startIndex = computed(() => (currentPage.value - 1) * perPage);

const paginatedSoals = computed(() => {
  if (!tryout.value) return [];

  const filtered = selectedCategory.value
    ? tryout.value.soals.filter((s) => s.category === selectedCategory.value)
    : tryout.value.soals;

  return filtered.slice(startIndex.value, startIndex.value + perPage);
});

const totalPages = computed(() => {
  if (!tryout.value) return 1;

  const filteredLength = selectedCategory.value
    ? tryout.value.soals.filter((s) => s.category === selectedCategory.value)
        .length
    : tryout.value.soals.length;

  return Math.ceil(filteredLength / perPage) || 1;
});

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

/* ================= BADGE ================= */
function badge(category) {
  if (category === "TWK") return "bg-blue-100 text-blue-600";
  if (category === "TIU") return "bg-green-100 text-green-600";
  if (category === "TKP") return "bg-orange-100 text-orange-600";
  return "bg-gray-100 text-gray-600";
}

/* ================= EDIT ================= */
function openEditModal(soal) {
  selectedSoal.value = { ...soal };
  showEditModal.value = true;
}

async function updateSoal() {
  await api.put(`/soal/${selectedSoal.value.id}`, selectedSoal.value);
  fetchTryout();
  showEditModal.value = false;
}

onMounted(fetchTryout);
</script>
