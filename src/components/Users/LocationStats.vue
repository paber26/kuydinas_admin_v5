<script setup>
import { ref, onMounted, computed } from "vue"
import { RefreshCw, X, MapPin } from "lucide-vue-next"
import api from "../../services/api.js"

// ─── State ───────────────────────────────────────────────────────────────────
const provinces = ref([])
const total = ref(0)
const loading = ref(false)
const error = ref(null)

const modalOpen = ref(false)
const selectedProvince = ref(null)
const regencies = ref([])
const regencyTotal = ref(0)
const loadingRegencies = ref(false)
const regencyError = ref(null)

// ─── Fetch provinsi ───────────────────────────────────────────────────────────
async function fetchProvinces() {
  loading.value = true
  error.value = null
  try {
    const res = await api.get("/users/location-stats")
    provinces.value = res.data.data || []
    total.value = res.data.total || 0
  } catch (e) {
    error.value = "Gagal memuat data. Silakan coba lagi."
  } finally {
    loading.value = false
  }
}

// ─── Fetch kabupaten ──────────────────────────────────────────────────────────
async function openProvince(province) {
  selectedProvince.value = province
  modalOpen.value = true
  regencies.value = []
  regencyError.value = null
  loadingRegencies.value = true

  try {
    const res = await api.get("/users/location-stats", {
      params: { province_name: province.province_name }
    })
    regencies.value = res.data.data || []
    regencyTotal.value = province.count
  } catch (e) {
    regencyError.value = "Gagal memuat data kabupaten."
  } finally {
    loadingRegencies.value = false
  }
}

function closeModal() {
  modalOpen.value = false
  selectedProvince.value = null
  regencies.value = []
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n) {
  return Number(n).toLocaleString("id-ID")
}

function pct(count) {
  if (!total.value) return 0
  return ((count / total.value) * 100).toFixed(1)
}

function pctRegency(count) {
  if (!regencyTotal.value) return 0
  return ((count / regencyTotal.value) * 100).toFixed(1)
}

// Pisahkan "Tidak Diketahui" ke bawah (sudah diurutkan dari API, tapi pastikan)
const sortedProvinces = computed(() => {
  const known = provinces.value.filter((p) => p.province_name !== "Tidak Diketahui")
  const unknown = provinces.value.filter((p) => p.province_name === "Tidak Diketahui")
  return [...known, ...unknown]
})

// ─── Init ─────────────────────────────────────────────────────────────────────
onMounted(fetchProvinces)
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex items-start justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <MapPin class="w-5 h-5 text-purple-500" />
          Sebaran Lokasi User
        </h1>
        <p class="text-sm text-slate-500 mt-1">Data lokasi user untuk targeting Facebook Ads</p>
      </div>

      <div class="flex items-center gap-3">
        <!-- Badge total -->
        <span
          v-if="!loading && total > 0"
          class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700"
        >
          {{ fmt(total) }} user
        </span>

        <!-- Tombol refresh -->
        <button
          @click="fetchProvinces"
          :disabled="loading"
          class="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
        >
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
          Refresh
        </button>
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
      {{ error }}
    </div>

    <!-- Tabel provinsi -->
    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-slate-50 border-b border-slate-200">
            <th class="px-4 py-3 text-left text-slate-500 font-medium w-12">#</th>
            <th class="px-4 py-3 text-left text-slate-500 font-medium">Provinsi</th>
            <th class="px-4 py-3 text-right text-slate-500 font-medium">Jumlah User</th>
            <th class="px-4 py-3 text-right text-slate-500 font-medium w-20">%</th>
            <th class="px-4 py-3 text-left text-slate-500 font-medium w-40">Distribusi</th>
          </tr>
        </thead>
        <tbody>
          <!-- Skeleton loading -->
          <template v-if="loading">
            <tr v-for="i in 8" :key="i" class="border-b border-slate-100">
              <td class="px-4 py-3">
                <div class="h-4 w-6 bg-slate-200 rounded animate-pulse" />
              </td>
              <td class="px-4 py-3">
                <div class="h-4 w-40 bg-slate-200 rounded animate-pulse" />
              </td>
              <td class="px-4 py-3 text-right">
                <div class="h-4 w-16 bg-slate-200 rounded animate-pulse ml-auto" />
              </td>
              <td class="px-4 py-3 text-right">
                <div class="h-4 w-10 bg-slate-200 rounded animate-pulse ml-auto" />
              </td>
              <td class="px-4 py-3">
                <div class="h-3 w-full bg-slate-200 rounded animate-pulse" />
              </td>
            </tr>
          </template>

          <!-- Data -->
          <template v-else>
            <tr
              v-for="(row, idx) in sortedProvinces"
              :key="row.province_name"
              @click="row.province_name !== 'Tidak Diketahui' && openProvince(row)"
              :class="[
                'border-b border-slate-100 transition',
                row.province_name === 'Tidak Diketahui'
                  ? 'bg-slate-50 text-slate-400'
                  : 'hover:bg-purple-50 cursor-pointer'
              ]"
            >
              <td class="px-4 py-3 text-slate-400 text-xs">
                {{ row.province_name === "Tidak Diketahui" ? "—" : idx + 1 }}
              </td>
              <td
                class="px-4 py-3 font-medium"
                :class="row.province_name === 'Tidak Diketahui' ? 'text-slate-400' : 'text-slate-700'"
              >
                {{ row.province_name }}
              </td>
              <td
                class="px-4 py-3 text-right font-semibold"
                :class="row.province_name === 'Tidak Diketahui' ? 'text-slate-400' : 'text-slate-800'"
              >
                {{ fmt(row.count) }}
              </td>
              <td class="px-4 py-3 text-right text-slate-500 text-xs">{{ pct(row.count) }}%</td>
              <td class="px-4 py-3">
                <div class="w-full bg-slate-100 rounded-full h-2">
                  <div
                    class="h-2 rounded-full transition-all"
                    :class="row.province_name === 'Tidak Diketahui' ? 'bg-slate-300' : 'bg-purple-400'"
                    :style="{ width: pct(row.count) + '%' }"
                  />
                </div>
              </td>
            </tr>

            <!-- Empty state -->
            <tr v-if="sortedProvinces.length === 0">
              <td colspan="5" class="px-4 py-10 text-center text-slate-400">Belum ada data lokasi user.</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <p class="mt-3 text-xs text-slate-400">Klik baris provinsi untuk melihat breakdown per kabupaten/kota.</p>
  </div>

  <!-- ─── Modal kabupaten ──────────────────────────────────────────────────── -->
  <Teleport to="body">
    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40" @click="closeModal" />

      <!-- Panel -->
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <!-- Header modal -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 class="font-semibold text-slate-800">
              {{ selectedProvince?.province_name }}
            </h2>
            <p class="text-xs text-slate-500 mt-0.5">{{ fmt(selectedProvince?.count) }} user di provinsi ini</p>
          </div>
          <button @click="closeModal" class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Body modal -->
        <div class="overflow-y-auto flex-1">
          <!-- Error -->
          <div v-if="regencyError" class="m-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {{ regencyError }}
          </div>

          <table class="w-full text-sm">
            <thead class="sticky top-0 bg-slate-50">
              <tr class="border-b border-slate-200">
                <th class="px-4 py-3 text-left text-slate-500 font-medium w-10">#</th>
                <th class="px-4 py-3 text-left text-slate-500 font-medium">Kabupaten/Kota</th>
                <th class="px-4 py-3 text-right text-slate-500 font-medium">Jumlah</th>
                <th class="px-4 py-3 text-right text-slate-500 font-medium w-16">%</th>
              </tr>
            </thead>
            <tbody>
              <!-- Skeleton -->
              <template v-if="loadingRegencies">
                <tr v-for="i in 5" :key="i" class="border-b border-slate-100">
                  <td class="px-4 py-3"><div class="h-4 w-5 bg-slate-200 rounded animate-pulse" /></td>
                  <td class="px-4 py-3"><div class="h-4 w-36 bg-slate-200 rounded animate-pulse" /></td>
                  <td class="px-4 py-3 text-right">
                    <div class="h-4 w-12 bg-slate-200 rounded animate-pulse ml-auto" />
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="h-4 w-10 bg-slate-200 rounded animate-pulse ml-auto" />
                  </td>
                </tr>
              </template>

              <!-- Data -->
              <template v-else>
                <tr
                  v-for="(row, idx) in regencies"
                  :key="row.regency_name"
                  class="border-b border-slate-100"
                  :class="row.regency_name === 'Tidak Diketahui' ? 'bg-slate-50 text-slate-400' : ''"
                >
                  <td class="px-4 py-3 text-slate-400 text-xs">
                    {{ row.regency_name === "Tidak Diketahui" ? "—" : idx + 1 }}
                  </td>
                  <td
                    class="px-4 py-3"
                    :class="row.regency_name === 'Tidak Diketahui' ? 'text-slate-400' : 'text-slate-700'"
                  >
                    {{ row.regency_name }}
                  </td>
                  <td
                    class="px-4 py-3 text-right font-semibold"
                    :class="row.regency_name === 'Tidak Diketahui' ? 'text-slate-400' : 'text-slate-800'"
                  >
                    {{ fmt(row.count) }}
                  </td>
                  <td class="px-4 py-3 text-right text-slate-500 text-xs">{{ pctRegency(row.count) }}%</td>
                </tr>

                <tr v-if="regencies.length === 0 && !loadingRegencies">
                  <td colspan="4" class="px-4 py-8 text-center text-slate-400">Tidak ada data kabupaten.</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Teleport>
</template>
