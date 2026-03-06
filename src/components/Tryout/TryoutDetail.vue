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
import katex from "katex";
import "katex/dist/katex.min.css";
import { useRoute } from "vue-router";
import api from "../../services/api";

const route = useRoute();

const tryout = ref(null);
const loading = ref(false);
const showEditModal = ref(false);
const selectedSoal = ref(null);
const selectedCategory = ref("");

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
  selectedSoal.value = { ...soal };
  showEditModal.value = true;
}

async function updateSoal() {
  await api.put(`/soal/${selectedSoal.value.id}`, selectedSoal.value);
  fetchTryout();
  showEditModal.value = false;
}

function renderLatex(text) {
  if (!text) return "";

  return text.replace(/\$(.*?)\$/g, (_, formula) => {
    try {
      return katex.renderToString(formula, { throwOnError: false });
    } catch {
      return formula;
    }
  });
}

onMounted(fetchTryout);
</script>
