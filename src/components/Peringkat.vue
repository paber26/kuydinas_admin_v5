<template>
  <div class="min-h-full bg-slate-50">
    <div class="max-w-6xl mx-auto space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <section
        class="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"
      >
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex flex-col gap-1">
            <p class="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Admin: Leaderboard Tryout SKD
            </p>
            <h1 class="text-xl font-semibold text-slate-800 sm:text-2xl">
              Peringkat Peserta Tryout SKD
            </h1>
            <p class="text-xs text-slate-600 sm:text-sm">
              Pilih tryout untuk melihat peringkat peserta.
            </p>
          </div>

          <div id="tryout-dropdown-container" class="relative w-full sm:w-80">
            <label class="mb-1 block text-[11px] font-medium text-slate-500">
              Pilih Try Out
            </label>
            
            <div 
              @click="!loadingTryouts && (isDropdownOpen = !isDropdownOpen)"
              class="relative w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm sm:text-sm transition-colors"
              :class="loadingTryouts ? 'opacity-50 cursor-not-allowed bg-slate-100' : 'hover:border-emerald-400 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500'"
            >
              <div class="flex items-center justify-between">
                <span class="truncate">{{ selectedTryoutName || (loadingTryouts ? 'Memuat tryout...' : 'Belum ada tryout') }}</span>
                <svg class="h-4 w-4 text-slate-400 shrink-0 transition-transform" :class="{'rotate-180': isDropdownOpen}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <!-- Dropdown Menu -->
            <transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <div 
                v-if="isDropdownOpen" 
                class="absolute z-50 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden"
              >
                <div class="p-2 border-b border-slate-100 bg-slate-50/50">
                  <div class="relative">
                    <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input 
                      v-model="searchTryoutQuery"
                      ref="searchInputRef"
                      type="text"
                      class="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
                      placeholder="Ketik untuk mencari opsi tryout..."
                      @click.stop
                    >
                  </div>
                </div>
                <ul class="max-h-60 overflow-y-auto py-1">
                  <li v-if="filteredTryouts.length === 0" class="px-4 py-3 text-xs text-slate-500 text-center flex flex-col items-center gap-1">
                    <svg class="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Tidak ditemukan hasil untuk "{{ searchTryoutQuery }}"</span>
                  </li>
                  <li 
                    v-for="t in filteredTryouts" 
                    :key="t.id"
                    @click="selectTryout(t.id)"
                    class="cursor-pointer px-4 py-2.5 text-xs sm:text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors border-b border-slate-50 last:border-0 flex items-center justify-between"
                  >
                    <span :class="{'font-medium text-emerald-700': t.id === selectedTryoutId}">{{ t.name }}</span>
                    <svg v-if="t.id === selectedTryoutId" class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </li>
                </ul>
              </div>
            </transition>
          </div>
        </div>

        <div
          class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4"
        >
          <div>
            <p class="text-xs text-slate-500">Total Peserta Mengerjakan Tryout ini:</p>
            <p class="mt-1 text-2xl font-bold text-slate-800">
              {{ rankingData.summary?.total_participants || 0 }}
            </p>
          </div>
        </div>
      </section>

      <div
        v-if="errorMessage"
        class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
      >
        {{ errorMessage }}
      </div>

      <section v-if="loadingRanking" class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div
          v-for="placeholder in 3"
          :key="placeholder"
          class="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white"
        ></div>
      </section>

      <section v-else class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div
          v-for="p in topThreeDisplay"
          :key="`${p.rank}-${p.user_id || p.name}`"
          class="rounded-2xl border p-4 text-center shadow-sm"
          :class="
            p.rank === 1
              ? 'border-amber-300 bg-amber-100/70'
              : p.rank === 2
                ? 'border-slate-300 bg-slate-100'
                : 'border-emerald-300 bg-emerald-100/60'
          "
        >
          <p class="text-sm font-semibold text-slate-700">Peringkat {{ p.rank }}</p>
          <p class="mt-2 text-lg font-bold text-slate-900">{{ p.name }}</p>
          <p class="text-xs text-slate-500">{{ p.region }}</p>
          <p class="mt-3 text-xl font-bold">{{ p.total }}</p>
        </div>

        <div
          v-if="!topThreeDisplay.length"
          class="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-500"
        >
          Belum ada peserta yang menyelesaikan tryout ini.
        </div>
      </section>

      <section
        class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5"
      >
        <h2 class="mb-3 text-sm font-semibold text-slate-700">
          Daftar Peringkat Lengkap
        </h2>

        <div v-if="!loadingRanking && leaderboardDisplay.length" class="mb-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div class="relative w-full sm:w-64">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Cari nama peserta..." 
              class="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 sm:text-sm"
            >
          </div>
          <div class="text-xs text-slate-500">
            Menampilkan {{ paginatedLeaderboard.length }} dari {{ filteredLeaderboard.length }} data
          </div>
        </div>

        <div v-if="loadingRanking" class="py-8 text-center text-sm text-slate-500">
          Memuat leaderboard...
        </div>

        <div
          v-else-if="!leaderboardDisplay.length"
          class="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500"
        >
          Belum ada data leaderboard untuk tryout ini.
        </div>

        <div v-else class="overflow-x-auto rounded-xl border border-slate-200 max-h-[500px]">
          <table class="w-full border-collapse text-xs sm:text-sm">
            <thead class="sticky top-0 bg-slate-100 text-slate-700 shadow-sm z-10">
              <tr>
                <th class="px-3 py-3 text-left">Peringkat</th>
                <th class="px-3 py-3 text-left">Nama</th>
                <th class="px-3 py-3 text-left">Asal Daerah</th>
                <th class="px-3 py-3 text-center">TWK</th>
                <th class="px-3 py-3 text-center">TIU</th>
                <th class="px-3 py-3 text-center">TKP</th>
                <th class="px-3 py-3 text-center">Total</th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="!paginatedLeaderboard.length && searchQuery">
                <td colspan="7" class="py-8 text-center text-sm text-slate-400 bg-white">
                  Pencarian "{{ searchQuery }}" tidak ditemukan.
                </td>
              </tr>
              <tr
                v-for="row in paginatedLeaderboard"
                :key="`${row.rank}-${row.user_id}`"
                class="border-b bg-white"
              >
                <td class="px-3 py-2">{{ row.rank }}</td>
                <td class="px-3 py-2">{{ row.name }}</td>
                <td class="px-3 py-2">{{ row.region }}</td>
                <td class="px-3 py-2 text-center">{{ row.twk }}</td>
                <td class="px-3 py-2 text-center">{{ row.tiu }}</td>
                <td class="px-3 py-2 text-center">{{ row.tkp }}</td>
                <td class="px-3 py-2 text-center font-bold">{{ row.total }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="totalPages > 1" class="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            class="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Sebelumnya
          </button>
          
          <span class="text-xs text-slate-500">
            Halaman {{ currentPage }} dari {{ totalPages }}
          </span>

          <button 
            @click="currentPage++" 
            :disabled="currentPage >= totalPages"
            class="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Selanjutnya
          </button>
        </div>
      </section>
    </div>

    <!-- TODO DEBUG: Hanya muncul di mode development (npm run dev) untuk mengecek kecocokan data database ke UI -->
   
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref, watch, nextTick } from "vue";
import api from "../services/api";

const isDev = import.meta.env.DEV;

const tryouts = ref([]);
const selectedTryoutId = ref(null);
const loadingTryouts = ref(true);
const loadingRanking = ref(false);
const errorMessage = ref("");
const searchQuery = ref("");
const searchTryoutQuery = ref("");
const isDropdownOpen = ref(false);
const searchInputRef = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(15);
const rankingData = ref({
  summary: {
    total_participants: 0,
    user_rank: null,
    user_score: null,
  },
  top_three: [],
  leaderboard: [],
});

const selectedTryout = computed(() => {
  const activeTryout = tryouts.value.find(
    (tryout) => String(tryout.id) === String(selectedTryoutId.value),
  );

  return {
    id: activeTryout?.id ?? null,
    name: activeTryout?.name ?? "",
    totalPeserta: rankingData.value.summary?.total_participants ?? 0,
    topThree: rankingData.value.top_three ?? [],
    leaderboard: rankingData.value.leaderboard ?? [],
  };
});

const topThreeDisplay = computed(() => selectedTryout.value.topThree || []);
const leaderboardDisplay = computed(() => selectedTryout.value.leaderboard || []);

const filteredTryouts = computed(() => {
  if (!searchTryoutQuery.value) return tryouts.value;
  const q = searchTryoutQuery.value.toLowerCase();
  return tryouts.value.filter(t => t.name.toLowerCase().includes(q));
});

const selectedTryoutName = computed(() => {
  const t = tryouts.value.find(x => String(x.id) === String(selectedTryoutId.value));
  return t ? t.name : '';
});

function selectTryout(id) {
  selectedTryoutId.value = id;
  isDropdownOpen.value = false;
  searchTryoutQuery.value = "";
}

function onClickOutsideDropdown(e) {
  if (isDropdownOpen.value) {
    const container = document.getElementById('tryout-dropdown-container');
    if (container && !container.contains(e.target)) {
      isDropdownOpen.value = false;
    }
  }
}

watch(isDropdownOpen, async (isOpen) => {
  if (isOpen) {
    await nextTick();
    if (searchInputRef.value) searchInputRef.value.focus();
  }
});

const filteredLeaderboard = computed(() => {
  if (!searchQuery.value) return leaderboardDisplay.value;
  const q = searchQuery.value.toLowerCase();
  return leaderboardDisplay.value.filter(row => 
    (row.name && String(row.name).toLowerCase().includes(q)) || 
    (row.region && String(row.region).toLowerCase().includes(q))
  );
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredLeaderboard.value.length / itemsPerPage.value)));

const paginatedLeaderboard = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredLeaderboard.value.slice(start, start + itemsPerPage.value);
});

watch(searchQuery, () => {
  currentPage.value = 1;
});

async function loadTryouts() {
  loadingTryouts.value = true;
  errorMessage.value = "";

  try {
    const response = await api.get("/tryouts");
    const list = Array.isArray(response.data?.data) ? response.data.data : response.data ?? [];

    tryouts.value = list.map((item) => ({
      id: item.id || item.eid,
      name: item.title || item.name || `Tryout #${item.id || item.eid}`,
    }));

    if (!selectedTryoutId.value && tryouts.value.length) {
      selectedTryoutId.value = tryouts.value[0].id;
    }
  } catch (error) {
    console.error("Gagal memuat daftar tryout ranking:", error);
    errorMessage.value = "Daftar tryout belum bisa dimuat.";
  } finally {
    loadingTryouts.value = false;
  }
}

async function loadRanking(tryoutId) {
  if (!tryoutId) {
    rankingData.value = {
      summary: {
        total_participants: 0,
      },
      top_three: [],
      leaderboard: [],
    };
    return;
  }

  loadingRanking.value = true;
  errorMessage.value = "";

  try {
    const response = await api.get(`/tryouts/${tryoutId}/ranking`);
    console.log("📥 [DEBUG] Data Peringkat dari Database:", response.data?.data ?? response.data);
    rankingData.value = response.data?.data ?? response.data ?? rankingData.value;
  } catch (error) {
    console.error("Gagal memuat ranking tryout:", error);
    errorMessage.value = "Leaderboard tryout belum bisa dimuat.";
    rankingData.value = {
      summary: {
        total_participants: 0,
      },
      top_three: [],
      leaderboard: [],
    };
  } finally {
    loadingRanking.value = false;
  }
}

watch(selectedTryoutId, (value) => {
  searchQuery.value = "";
  currentPage.value = 1;
  loadRanking(value);
});

onMounted(async () => {
  document.addEventListener('click', onClickOutsideDropdown);
  await loadTryouts();
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutsideDropdown);
});
</script>
