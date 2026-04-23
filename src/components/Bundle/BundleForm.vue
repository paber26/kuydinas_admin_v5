<template>
  <div class="min-h-full bg-slate-50">
    <div class="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <section class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Admin: Bundle
            </p>
            <h1 class="mt-1 text-xl font-semibold text-slate-800 sm:text-2xl">
              {{ isEdit ? "Edit Bundle" : "Buat Bundle Baru" }}
            </h1>
          </div>
          <router-link
            to="/bundles"
            class="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:text-sm"
          >
            Kembali
          </router-link>
        </div>
      </section>

      <div
        v-if="loadingInit"
        class="space-y-3"
      >
        <div class="h-16 animate-pulse rounded-2xl bg-slate-100"></div>
        <div class="h-32 animate-pulse rounded-2xl bg-slate-100"></div>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <section class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5 space-y-4">
          <h2 class="text-sm font-semibold text-slate-700">Informasi Bundle</h2>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label class="block text-xs font-medium text-slate-600 mb-1">Nama Bundle *</label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="Contoh: Paket Hemat SKD 3 in 1"
                class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
            </div>

            <div class="sm:col-span-2">
              <label class="block text-xs font-medium text-slate-600 mb-1">Deskripsi</label>
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Deskripsi lengkap bundle..."
                class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">Harga (Rupiah) *</label>
              <input
                v-model.number="form.price"
                type="number"
                required
                min="1"
                placeholder="50000"
                class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
            </div>

            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">Cover Image URL</label>
              <input
                v-model="form.cover_image"
                type="text"
                placeholder="https://..."
                class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
            </div>
          </div>
        </section>

        <section class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5 space-y-4">
          <h2 class="text-sm font-semibold text-slate-700">Limitasi Bundle</h2>

          <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="form.limit_type"
                type="radio"
                value="quota"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              >
              <span class="text-sm text-slate-700">Batas Kuota</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="form.limit_type"
                type="radio"
                value="time"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              >
              <span class="text-sm text-slate-700">Batas Waktu</span>
            </label>
          </div>

          <div v-if="form.limit_type === 'quota'" class="max-w-xs">
            <label class="block text-xs font-medium text-slate-600 mb-1">Maksimal Pembeli</label>
            <input
              v-model.number="form.limit_quota"
              type="number"
              min="1"
              placeholder="100"
              class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
          </div>

          <div v-if="form.limit_type === 'time'" class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">Tanggal Mulai</label>
              <input
                v-model="form.limit_start_date"
                type="date"
                class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">Tanggal Berakhir</label>
              <input
                v-model="form.limit_end_date"
                type="date"
                class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
            </div>
          </div>

          <label class="flex items-center gap-2 cursor-pointer">
            <input
              v-model="form.is_active"
              type="checkbox"
              class="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
            >
            <span class="text-sm text-slate-700">Bundle Aktif</span>
          </label>
        </section>

        <section class="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-sm font-semibold text-slate-700">Pilih Tryout *</h2>
              <p class="text-[11px] text-slate-400 mt-0.5">Hanya menampilkan tryout yang sudah publish</p>
            </div>
            <span
              class="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700"
            >{{ selectedTryoutIds.length }} dipilih</span>
          </div>

          <!-- Search & filter -->
          <div class="flex gap-2">
            <input
              v-model="tryoutSearch"
              type="text"
              placeholder="Cari nama tryout..."
              class="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
            <select
              v-model="tryoutTypeFilter"
              class="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="all">Semua tipe</option>
              <option value="free">Gratis</option>
              <option value="premium">Premium</option>
              <option value="regular">Regular</option>
            </select>
          </div>

          <div v-if="loadingTryouts" class="h-20 animate-pulse rounded-xl bg-slate-100"></div>

          <div v-else-if="!filteredTryouts.length" class="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            {{ availableTryouts.length === 0 ? 'Belum ada tryout yang publish.' : 'Tidak ada tryout yang cocok.' }}
          </div>

          <div v-else class="max-h-72 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100">
            <label
              v-for="tryout in filteredTryouts"
              :key="tryout.id"
              class="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-slate-50"
              :class="{ 'bg-indigo-50/50': selectedTryoutIds.includes(tryout.id) }"
            >
              <input
                type="checkbox"
                :value="tryout.id"
                v-model="selectedTryoutIds"
                class="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
              >
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-slate-800 truncate">{{ tryout.title }}</p>
                <p class="text-[11px] text-slate-400">
                  <span
                    class="inline-block rounded-full px-1.5 py-0.5 mr-1"
                    :class="{
                      'bg-green-100 text-green-700': tryout.type === 'free',
                      'bg-purple-100 text-purple-700': tryout.type === 'premium',
                      'bg-blue-100 text-blue-700': tryout.type === 'regular',
                    }"
                  >{{ tryout.type }}</span>
                  {{ tryout.duration }} menit
                  <span v-if="tryout.soals_count != null"> • {{ tryout.soals_count }} soal</span>
                </p>
              </div>
              <span class="shrink-0 text-[10px] text-slate-400">#{{ tryout.id }}</span>
            </label>
          </div>

          <!-- Select all / clear -->
          <div v-if="filteredTryouts.length" class="flex gap-3">
            <button
              type="button"
              @click="selectAllFiltered"
              class="text-xs text-indigo-600 hover:underline"
            >Pilih semua ({{ filteredTryouts.length }})</button>
            <span class="text-slate-300">|</span>
            <button
              type="button"
              @click="selectedTryoutIds = []"
              class="text-xs text-slate-500 hover:underline"
            >Hapus pilihan</button>
          </div>
        </section>

        <div
          v-if="formError"
          class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {{ formError }}
        </div>

        <div class="flex gap-3">
          <button
            type="submit"
            :disabled="submitting"
            class="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
          >
            {{ submitting ? "Menyimpan..." : isEdit ? "Perbarui Bundle" : "Simpan Bundle" }}
          </button>
          <router-link
            to="/bundles"
            class="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Batal
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../../services/api";

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => !!route.params.id);
const loadingInit = ref(false);
const loadingTryouts = ref(false);
const submitting = ref(false);
const formError = ref("");

const form = ref({
  name: "",
  description: "",
  price: null,
  cover_image: "",
  limit_type: "quota",
  limit_quota: null,
  limit_start_date: "",
  limit_end_date: "",
  is_active: true,
});

const availableTryouts = ref([]);
const selectedTryoutIds = ref([]);
const tryoutSearch = ref("");
const tryoutTypeFilter = ref("all");

const filteredTryouts = computed(() => {
  return availableTryouts.value.filter((t) => {
    const matchSearch = !tryoutSearch.value || t.title.toLowerCase().includes(tryoutSearch.value.toLowerCase());
    const matchType = tryoutTypeFilter.value === "all" || t.type === tryoutTypeFilter.value;
    return matchSearch && matchType;
  });
});

function selectAllFiltered() {
  const ids = filteredTryouts.value.map((t) => t.id);
  const merged = [...new Set([...selectedTryoutIds.value, ...ids])];
  selectedTryoutIds.value = merged;
}

async function loadTryouts() {
  loadingTryouts.value = true;
  try {
    const response = await api.get("/tryouts");
    const data = response.data?.data || response.data || [];
    const all = Array.isArray(data) ? data : [];
    // Hanya tampilkan tryout yang sudah publish
    availableTryouts.value = all.filter((t) => t.status === "publish");
  } catch (err) {
    console.error("Gagal memuat tryout:", err);
  } finally {
    loadingTryouts.value = false;
  }
}

async function loadBundle() {
  if (!route.params.id) return;

  loadingInit.value = true;
  try {
    const response = await api.get(`/bundles/${route.params.id}`);
    const bundle = response.data?.data;

    if (bundle) {
      form.value = {
        name: bundle.name || "",
        description: bundle.description || "",
        price: bundle.price || null,
        cover_image: bundle.cover_image || "",
        limit_type: bundle.limit_type || "quota",
        limit_quota: bundle.limit_quota || null,
        limit_start_date: bundle.limit_start_date || "",
        limit_end_date: bundle.limit_end_date || "",
        is_active: bundle.is_active ?? true,
      };

      selectedTryoutIds.value = (bundle.tryouts || []).map((t) => t.id);
    }
  } catch (err) {
    console.error("Gagal memuat bundle:", err);
    formError.value = "Gagal memuat data bundle.";
  } finally {
    loadingInit.value = false;
  }
}

async function handleSubmit() {
  formError.value = "";

  if (!form.value.name.trim()) {
    formError.value = "Nama bundle wajib diisi.";
    return;
  }

  if (!form.value.price || form.value.price < 1) {
    formError.value = "Harga wajib diisi dan minimal Rp 1.";
    return;
  }

  if (!selectedTryoutIds.value.length) {
    formError.value = "Pilih minimal 1 tryout untuk bundle.";
    return;
  }

  submitting.value = true;

  const payload = {
    ...form.value,
    tryout_ids: selectedTryoutIds.value,
    limit_quota: form.value.limit_type === "quota" ? form.value.limit_quota : null,
    limit_start_date: form.value.limit_type === "time" ? form.value.limit_start_date || null : null,
    limit_end_date: form.value.limit_type === "time" ? form.value.limit_end_date || null : null,
  };

  try {
    if (isEdit.value) {
      await api.put(`/bundles/${route.params.id}`, payload);
    } else {
      await api.post("/bundles", payload);
    }

    router.push("/bundles");
  } catch (err) {
    const msg = err?.response?.data?.message || "Gagal menyimpan bundle.";
    formError.value = msg;
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  loadTryouts();
  loadBundle();
});
</script>
