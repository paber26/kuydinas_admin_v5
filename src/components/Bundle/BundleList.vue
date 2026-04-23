<template>
  <div class="min-h-full bg-slate-50">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <section class="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex flex-col gap-1">
            <p class="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Admin: Bundle
            </p>
            <h1 class="text-xl font-semibold text-slate-800 sm:text-2xl">
              Manajemen Bundle Tryout
            </h1>
            <p class="text-xs text-slate-500 sm:text-sm">
              Kelola paket bundle yang berisi beberapa tryout sekaligus
            </p>
          </div>

          <router-link
            to="/bundles/create"
            class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-700 sm:text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Buat Bundle
          </router-link>
        </div>

        <div class="relative w-full sm:w-72">
          <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari bundle..."
            class="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
          >
        </div>
      </section>

      <div
        v-if="errorMessage"
        class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
      >
        {{ errorMessage }}
      </div>

      <div v-if="loading && !bundles.length" class="space-y-3">
        <div
          v-for="i in 4"
          :key="i"
          class="h-20 animate-pulse rounded-2xl border border-slate-200 bg-slate-50"
        ></div>
      </div>

      <div
        v-else-if="!filteredBundles.length"
        class="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center"
      >
        <svg class="mx-auto h-12 w-12 text-slate-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
        <p class="mt-3 text-sm font-medium text-slate-500">Belum ada bundle yang dibuat.</p>
        <router-link
          to="/bundles/create"
          class="mt-3 inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
        >
          Buat Bundle Pertama
        </router-link>
      </div>

      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="bundle in filteredBundles"
          :key="bundle.id"
          class="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
        >
          <div class="flex flex-1 flex-col p-5">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 flex-1">
                <h3 class="truncate text-sm font-semibold text-slate-800">{{ bundle.name }}</h3>
                <p class="mt-1 text-xs text-slate-500 line-clamp-2">{{ bundle.description || 'Tidak ada deskripsi' }}</p>
              </div>
              <span
                class="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold"
                :class="bundle.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ bundle.is_active ? 'Aktif' : 'Nonaktif' }}
              </span>
            </div>

            <div class="mt-4 grid grid-cols-3 gap-2">
              <div class="rounded-lg bg-slate-50 px-2 py-2 text-center">
                <p class="text-[10px] uppercase tracking-wide text-slate-400">Harga</p>
                <p class="mt-0.5 text-xs font-bold text-slate-700">Rp {{ formatNumber(bundle.price) }}</p>
              </div>
              <div class="rounded-lg bg-slate-50 px-2 py-2 text-center">
                <p class="text-[10px] uppercase tracking-wide text-slate-400">Tryout</p>
                <p class="mt-0.5 text-xs font-bold text-slate-700">{{ bundle.tryouts_count }}</p>
              </div>
              <div class="rounded-lg bg-slate-50 px-2 py-2 text-center">
                <p class="text-[10px] uppercase tracking-wide text-slate-400">Terjual</p>
                <p class="mt-0.5 text-xs font-bold text-emerald-600">{{ bundle.paid_count }}</p>
              </div>
            </div>

            <div class="mt-3 flex items-center gap-2">
              <span
                class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                :class="bundle.limit_type === 'quota' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'"
              >
                {{ bundle.limit_type === 'quota' ? `Kuota: ${bundle.limit_quota ?? '∞'}` : `${bundle.limit_start_date || '?'} s/d ${bundle.limit_end_date || '?'}` }}
              </span>
              <span
                v-if="bundle.is_available"
                class="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600"
              >Tersedia</span>
              <span
                v-else
                class="inline-flex rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-600"
              >Tidak Tersedia</span>
            </div>
          </div>

          <div class="flex border-t border-slate-100">
            <router-link
              :to="`/bundles/${bundle.id}`"
              class="flex flex-1 items-center justify-center gap-1 py-3 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
            >
              Detail
            </router-link>
            <router-link
              :to="`/bundles/${bundle.id}/edit`"
              class="flex flex-1 items-center justify-center gap-1 border-l border-slate-100 py-3 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-50"
            >
              Edit
            </router-link>
            <button
              type="button"
              @click="confirmDelete(bundle)"
              class="flex flex-1 items-center justify-center gap-1 border-l border-slate-100 py-3 text-xs font-medium text-rose-500 transition-colors hover:bg-rose-50"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import api from "../../services/api";

const bundles = ref([]);
const loading = ref(false);
const errorMessage = ref("");
const searchQuery = ref("");
const searchDebounce = ref(null);

const filteredBundles = computed(() => {
  if (!searchQuery.value.trim()) return bundles.value;
  const q = searchQuery.value.toLowerCase();
  return bundles.value.filter((b) => b.name.toLowerCase().includes(q));
});

function formatNumber(val) {
  try {
    return Number(val || 0).toLocaleString("id-ID");
  } catch {
    return String(val || 0);
  }
}

async function loadBundles() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await api.get("/admin/bundles");
    bundles.value = Array.isArray(response.data?.data) ? response.data.data : [];
  } catch (err) {
    console.error("Gagal memuat bundle:", err);
    errorMessage.value = "Gagal memuat daftar bundle.";
  } finally {
    loading.value = false;
  }
}

async function confirmDelete(bundle) {
  if (!confirm(`Hapus bundle "${bundle.name}"?`)) return;

  try {
    await api.delete(`/admin/bundles/${bundle.id}`);
    bundles.value = bundles.value.filter((b) => b.id !== bundle.id);
  } catch (err) {
    const msg = err?.response?.data?.message || "Gagal menghapus bundle.";
    alert(msg);
  }
}

watch(searchQuery, () => {
  if (searchDebounce.value) clearTimeout(searchDebounce.value);
  searchDebounce.value = setTimeout(() => {
    // Client-side filtering
  }, 300);
});

onMounted(() => {
  loadBundles();
});
</script>
