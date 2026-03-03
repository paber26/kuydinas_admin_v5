<template>
  <div class="p-8 bg-slate-50 min-h-screen">
    <!-- HEADER -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-slate-800">Kelola Tryout</h1>
        <p class="text-slate-500 text-sm mt-1">
          ID Tryout: {{ route.params.id }}
        </p>
      </div>

      <router-link
        to="/tryout-builder"
        class="px-4 py-2 rounded-lg bg-white border hover:bg-slate-100 transition text-sm"
      >
        Kembali
      </router-link>
    </div>

    <!-- INFO TRYOUT CARD -->
    <div v-if="tryout" class="bg-white rounded-2xl shadow-sm border p-6 mb-8">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div class="bg-slate-50 p-4 rounded-xl">
          <p class="text-xs text-slate-500">Nama</p>
          <p class="font-semibold mt-1">{{ tryout.title }}</p>
        </div>

        <div class="bg-purple-50 p-4 rounded-xl">
          <p class="text-xs text-purple-600">Total</p>
          <p class="font-bold text-lg text-purple-700">
            {{ questions.length }} / {{ totalTarget }}
          </p>
        </div>

        <div class="bg-blue-50 p-4 rounded-xl">
          <p class="text-xs text-blue-600">TWK</p>
          <p class="font-bold text-lg text-blue-700">
            {{ totalTWK }} / {{ tryout.twk_target }}
          </p>
        </div>

        <div class="bg-green-50 p-4 rounded-xl">
          <p class="text-xs text-green-600">TIU</p>
          <p class="font-bold text-lg text-green-700">
            {{ totalTIU }} / {{ tryout.tiu_target }}
          </p>
        </div>

        <div class="bg-orange-50 p-4 rounded-xl">
          <p class="text-xs text-orange-600">TKP</p>
          <p class="font-bold text-lg text-orange-700">
            {{ totalTKP }} / {{ tryout.tkp_target }}
          </p>
        </div>
      </div>

      <!-- PROGRESS BAR KOMPOSISI -->
      <div class="mt-6">
        <div class="flex justify-between text-xs text-slate-500 mb-3">
          <span>Progress Komposisi Soal</span>
          <span>{{ questions.length }} / {{ totalTarget }}</span>
        </div>

        <div class="w-full bg-slate-200 h-3 rounded-full overflow-hidden flex">
          <!-- TWK -->
          <div
            class="bg-blue-500 h-3 transition-all duration-500"
            :style="{ width: twkPercentage + '%' }"
          ></div>

          <!-- TIU -->
          <div
            class="bg-green-500 h-3 transition-all duration-500"
            :style="{ width: tiuPercentage + '%' }"
          ></div>

          <!-- TKP -->
          <div
            class="bg-orange-500 h-3 transition-all duration-500"
            :style="{ width: tkpPercentage + '%' }"
          ></div>
        </div>

        <!-- LEGEND -->
        <div class="flex gap-6 mt-3 text-xs">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 bg-blue-500 rounded-full"></span>
            <span>TWK ({{ totalTWK }}/{{ tryout.twk_target }})</span>
          </div>

          <div class="flex items-center gap-2">
            <span class="w-3 h-3 bg-green-500 rounded-full"></span>
            <span>TIU ({{ totalTIU }}/{{ tryout.tiu_target }})</span>
          </div>

          <div class="flex items-center gap-2">
            <span class="w-3 h-3 bg-orange-500 rounded-full"></span>
            <span>TKP ({{ totalTKP }}/{{ tryout.tkp_target }})</span>
          </div>
        </div>
      </div>
    </div>

    <!-- BUTTON TAMBAH -->
    <div class="flex justify-end mb-6">
      <button
        @click="toggleBankSoal"
        class="group relative inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-black px-6 py-2.5 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out active:scale-95"
      >
        <!-- ICON -->
        <svg
          class="w-4 h-4 transition-transform duration-300"
          :class="{ 'rotate-45': showBankSoal }"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>

        <span>
          {{ showBankSoal ? "Tutup Bank Soal" : "Tambah Soal" }}
        </span>
      </button>
    </div>

    <!-- TABEL TRYOUT -->
    <div class="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-100 text-slate-700">
          <tr>
            <th class="px-6 py-4 text-left">No</th>
            <th class="px-6 py-4 text-left">Kategori</th>
            <th class="px-6 py-4 text-left">Pertanyaan</th>
            <th class="px-6 py-4 text-left">Aksi</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, index) in questions"
            :key="item.id"
            class="border-t hover:bg-purple-50 transition"
          >
            <td class="px-6 py-4">{{ index + 1 }}</td>

            <td class="px-6 py-4">
              <span
                class="px-3 py-1 text-xs font-medium rounded-full"
                :class="badge(item.category)"
              >
                {{ item.category }}
              </span>
            </td>

            <td class="px-6 py-4 truncate max-w-md">
              {{ item.question }}
            </td>

            <td class="px-6 py-4">
              <button
                @click="removeQuestion(item.id)"
                class="text-red-600 hover:underline text-xs"
              >
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- EMPTY STATE -->
      <div v-if="questions.length === 0" class="text-center py-16">
        <div class="text-4xl mb-2">📄</div>
        <p class="text-slate-400">Belum ada soal dalam tryout ini</p>
      </div>
    </div>

    <!-- BANK SOAL -->
    <div
      v-if="showBankSoal"
      class="mt-10 bg-white rounded-2xl shadow-sm border p-6"
    >
      <h2 class="text-xl font-semibold mb-6">Pilih Soal</h2>

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

      <div v-if="loadingBank" class="text-center py-6 text-slate-400">
        Loading...
      </div>

      <div v-else>
        <div class="overflow-x-auto">
          <table class="w-full text-sm border rounded-xl overflow-hidden">
            <thead class="bg-slate-100 text-slate-700">
              <tr>
                <th class="px-4 py-3 text-left">Kategori</th>
                <th class="px-4 py-3 text-left">Pertanyaan</th>
                <th class="px-4 py-3 text-left">Aksi</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="item in filteredBankSoal"
                :key="item.id"
                class="border-t hover:bg-purple-50 transition"
              >
                <td class="px-4 py-3">
                  <span
                    class="px-3 py-1 text-xs font-medium rounded-full"
                    :class="badge(item.category)"
                  >
                    {{ item.category }}
                  </span>
                </td>

                <td class="px-4 py-3 max-w-lg truncate">
                  {{ item.question }}
                </td>

                <td class="px-4 py-3">
                  <button
                    @click="addQuestion(item)"
                    :disabled="isQuotaFull(item.category)"
                    class="bg-purple-600 hover:bg-purple-700 text-white text-xs px-4 py-1 rounded-md disabled:opacity-40"
                  >
                    Tambahkan
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="filteredBankSoal.length === 0"
          class="text-center text-slate-400 py-6"
        >
          Semua soal sudah dipilih
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "../../services/api";

const route = useRoute();
const tryoutId = route.params.id;

/* ================= STATE ================= */
const tryout = ref(null);
const questions = ref([]);
const bankSoal = ref([]);
const selectedCategory = ref("");

const showBankSoal = ref(false);
const loadingPage = ref(false);
const loadingBank = ref(false);

/* ================= FETCH DATA ================= */
async function fetchTryout() {
  try {
    loadingPage.value = true;
    const res = await api.get(`/tryouts/${tryoutId}`);
    tryout.value = res.data.data;
    questions.value = res.data.data.soals || [];
  } catch (err) {
    console.error("Gagal fetch tryout:", err);
  } finally {
    loadingPage.value = false;
  }
}

async function fetchBankSoal() {
  try {
    loadingBank.value = true;
    const res = await api.get("/soal");
    bankSoal.value = res.data.data || [];
  } catch (err) {
    console.error("Gagal fetch bank soal:", err);
  } finally {
    loadingBank.value = false;
  }
}

/* ================= COMPUTED ================= */
const totalTWK = computed(
  () => questions.value.filter((q) => q.category === "TWK").length,
);

const totalTIU = computed(
  () => questions.value.filter((q) => q.category === "TIU").length,
);

const totalTKP = computed(
  () => questions.value.filter((q) => q.category === "TKP").length,
);

const totalTarget = computed(() => {
  if (!tryout.value) return 0;
  return (
    tryout.value.twk_target + tryout.value.tiu_target + tryout.value.tkp_target
  );
});

const twkPercentage = computed(() => {
  if (!tryout.value || !totalTarget.value) return 0;
  return (totalTWK.value / totalTarget.value) * 100;
});

const tiuPercentage = computed(() => {
  if (!tryout.value || !totalTarget.value) return 0;
  return (totalTIU.value / totalTarget.value) * 100;
});

const tkpPercentage = computed(() => {
  if (!tryout.value || !totalTarget.value) return 0;
  return (totalTKP.value / totalTarget.value) * 100;
});

const filteredBankSoal = computed(() => {
  return bankSoal.value
    .filter((soal) =>
      selectedCategory.value ? soal.category === selectedCategory.value : true,
    )
    .filter((soal) => !questions.value.some((q) => q.id === soal.id));
});

/* ================= QUOTA CHECK ================= */
function isQuotaFull(category) {
  if (!tryout.value) return false;

  if (category === "TWK") return totalTWK.value >= tryout.value.twk_target;

  if (category === "TIU") return totalTIU.value >= tryout.value.tiu_target;

  if (category === "TKP") return totalTKP.value >= tryout.value.tkp_target;

  return false;
}

/* ================= ACTIONS ================= */
async function addQuestion(item) {
  try {
    await api.post(`/tryouts/${tryoutId}/attach`, {
      soal_id: item.id,
    });

    // Optimistic update (lebih cepat & smooth)
    questions.value.push(item);
  } catch (err) {
    alert(err.response?.data?.message || "Gagal menambahkan soal");
  }
}

async function removeQuestion(id) {
  try {
    await api.delete(`/tryouts/${tryoutId}/detach/${id}`);

    questions.value = questions.value.filter((q) => q.id !== id);
  } catch (err) {
    alert("Gagal menghapus soal");
  }
}

async function toggleBankSoal() {
  showBankSoal.value = !showBankSoal.value;

  if (showBankSoal.value && bankSoal.value.length === 0) {
    await fetchBankSoal();
  }
}

/* ================= BADGE ================= */
function badge(category) {
  if (category === "TWK") return "bg-blue-100 text-blue-600";
  if (category === "TIU") return "bg-green-100 text-green-600";
  if (category === "TKP") return "bg-orange-100 text-orange-600";
  return "bg-gray-100 text-gray-600";
}

/* ================= INIT ================= */
onMounted(() => {
  fetchTryout();
});
</script>

<style scoped>
table th {
  font-weight: 600;
}
</style>
