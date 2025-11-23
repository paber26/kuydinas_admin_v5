<template>
  <section class="p-6">
    <h1 class="text-xl font-semibold mb-4">Daftar Akun</h1>

    <div class="mb-4 flex items-center gap-3">
      <input
        v-model="q"
        @input="onSearchInput"
        @keyup.enter="resetAndLoad"
        placeholder="Cari nama / email / username..."
        class="border px-3 py-2 rounded w-full md:w-1/3"
      />

      <!-- explicit search button in case user wants to click -->
      <button
        @click="resetAndLoad"
        class="px-4 py-2 bg-indigo-600 text-white rounded"
      >
        Cari
      </button>

      <select
        v-model.number="perPage"
        @change="resetAndLoad"
        class="border px-2 py-2 rounded"
      >
        <option :value="10">10 / halaman</option>
        <option :value="20">20 / halaman</option>
        <option :value="50">50 / halaman</option>
        <option :value="100">100 / halaman</option>
      </select>
    </div>

    <div class="bg-white rounded shadow divide-y">
      <div
        v-for="user in users"
        :key="user.id"
        class="p-4 flex items-center justify-between"
      >
        <div class="flex items-center gap-4">
          <img
            v-if="user.picture"
            :src="user.picture"
            alt="avatar"
            class="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div class="font-medium text-slate-800">{{ user.name }}</div>
            <div class="text-sm text-slate-500">
              {{ user.email }} • {{ user.username }}
            </div>
          </div>
        </div>
        <div class="text-sm text-slate-500">Koin: {{ user.koin ?? 0 }}</div>
      </div>

      <!-- sentinel / loading row -->
      <div
        ref="sentinel"
        class="p-4 text-center text-slate-500"
        v-if="(!users || users.length === 0) && !loading"
      >
        Tidak ada data
      </div>
      <div class="p-4 text-center" v-if="loading">Memuat...</div>
    </div>

    <div class="mt-4 flex justify-center gap-3">
      <button
        v-if="!loading && page < lastPage"
        @click="loadMore"
        class="px-4 py-2 bg-indigo-600 text-white rounded"
      >
        Load more
      </button>
      <div v-else class="text-sm text-slate-500">
        Halaman {{ page }} / {{ lastPage }}
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from "vue";
import api from "../services/api.js";
import debounce from "lodash/debounce"; // jika belum, `npm install lodash`

const users = ref([]);
const page = ref(1);
const perPage = ref(20);
const lastPage = ref(1);
const loading = ref(false);
const q = ref("");

const sentinel = ref(null);
let observer = null;

async function fetchPage() {
  loading.value = true;
  try {
    // call the new backend paginated endpoint
    const res = await api.get("/getakunv2", {
      params: { page: page.value, per_page: perPage.value, q: q.value },
    });

    // Laravel paginator shape expected: { current_page, data: [...], last_page, per_page, total }
    const payload = res.data;

    if (payload && Array.isArray(payload.data)) {
      // proper paginator response
      if (page.value === 1) users.value = payload.data;
      else users.value = users.value.concat(payload.data);

      // prefer last_page if present, otherwise compute from total
      if (typeof payload.last_page === "number") {
        lastPage.value = payload.last_page;
      } else if (typeof payload.total === "number") {
        lastPage.value = Math.max(1, Math.ceil(payload.total / perPage.value));
      } else {
        lastPage.value = Math.max(
          1,
          Math.ceil((payload.data || []).length / perPage.value)
        );
      }
    } else if (Array.isArray(payload)) {
      // Defensive fallback: backend still returns full array. Slice to current page to avoid loading everything into UI.
      console.warn(
        "Backend returned full array. Consider updating to paginated endpoint `/getakunv2`. Using client-side slice fallback."
      );
      const start = (page.value - 1) * perPage.value;
      const pageSlice = payload.slice(start, start + perPage.value);
      if (page.value === 1) users.value = pageSlice;
      else users.value = users.value.concat(pageSlice);
      lastPage.value = Math.max(1, Math.ceil(payload.length / perPage.value));
    } else {
      // unexpected shape -> empty
      console.warn("Unexpected payload shape from /getakunv2", payload);
      if (page.value === 1) users.value = [];
      lastPage.value = 1;
    }
  } catch (err) {
    console.error("Gagal ambil users", err);
  } finally {
    loading.value = false;
  }
}

function resetAndLoad() {
  page.value = 1;
  users.value = [];
  fetchPage();
}

function loadMore() {
  if (loading.value) return;
  if (page.value < lastPage.value) {
    page.value += 1;
    fetchPage();
  }
}

// search debounce
const onSearchInput = debounce(() => {
  resetAndLoad();
}, 450);

onMounted(() => {
  fetchPage();

  // IntersectionObserver untuk infinite scroll
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          !loading.value &&
          page.value < lastPage.value
        ) {
          loadMore();
        }
      });
    },
    { root: null, rootMargin: "0px", threshold: 1.0 }
  );

  if (sentinel.value) observer.observe(sentinel.value);
});

watch(perPage, () => resetAndLoad());

// cleanup observer
onUnmounted(() => {
  if (observer && sentinel.value) observer.unobserve(sentinel.value);
});
</script>

<style scoped>
/* tambahkan styling kecil jika perlu */
</style>
