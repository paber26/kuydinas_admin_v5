<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Galeri</h1>
        <p class="text-sm text-slate-500">
          Kelola konten galeri untuk user (gambar + video YouTube)
        </p>
      </div>
      <button
        @click="openCreate"
        class="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700"
      >
        + Tambah Galeri
      </button>
    </div>

    <div class="mb-4 flex flex-wrap items-center gap-3">
      <input
        v-model="q"
        type="text"
        placeholder="Cari judul gambar / video..."
        class="w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 outline-none"
      />
      <select
        v-model="isActive"
        class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
      >
        <option value="">Semua</option>
        <option value="1">Aktif</option>
        <option value="0">Nonaktif</option>
      </select>
      <select
        v-model.number="perPage"
        class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
      >
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
    </div>

    <div class="overflow-hidden rounded-xl border bg-white shadow-sm">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-slate-600">
          <tr>
            <th class="px-4 py-3 text-left">Gambar</th>
            <th class="px-4 py-3 text-left">Judul</th>
            <th class="px-4 py-3 text-left">Video</th>
            <th class="px-4 py-3 text-left">Urutan</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-left">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="item.id"
            class="border-t hover:bg-slate-50"
          >
            <td class="px-4 py-3">
              <div class="h-12 w-16 overflow-hidden rounded-lg border bg-slate-100">
                <img
                  v-if="item.image_url"
                  :src="item.image_url"
                  alt="Gambar"
                  class="h-full w-full object-cover"
                />
              </div>
            </td>
            <td class="px-4 py-3">
              <p class="font-medium text-slate-800">{{ item.image_title }}</p>
              <p class="mt-1 text-xs text-slate-500">
                {{ item.youtube_url ? item.youtube_url : "-" }}
              </p>
            </td>
            <td class="px-4 py-3">
              <p class="text-slate-700">{{ item.video_title || "-" }}</p>
            </td>
            <td class="px-4 py-3">{{ item.sort_order ?? 0 }}</td>
            <td class="px-4 py-3">
              <span
                class="rounded-full px-2 py-1 text-xs"
                :class="item.is_active ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'"
              >
                {{ item.is_active ? "Aktif" : "Nonaktif" }}
              </span>
            </td>
            <td class="px-4 py-3 flex gap-3">
              <button
                @click="openEdit(item)"
                class="text-xs text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                @click="removeItem(item.id)"
                class="text-xs text-red-600 hover:underline"
              >
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="items.length === 0 && !loading" class="py-10 text-center text-slate-400">
        Tidak ada data
      </div>
      <div v-if="loading" class="py-6 text-center text-slate-500">Memuat...</div>
    </div>

    <div class="mt-4 flex items-center justify-between">
      <div class="text-sm text-slate-500">Halaman {{ page }} / {{ lastPage }}</div>
      <div class="flex gap-2">
        <button
          @click="prevPage"
          :disabled="page <= 1 || loading"
          class="rounded border px-3 py-2 disabled:opacity-60"
        >
          Sebelumnya
        </button>
        <button
          @click="nextPage"
          :disabled="page >= lastPage || loading"
          class="rounded border px-3 py-2 disabled:opacity-60"
        >
          Berikutnya
        </button>
      </div>
    </div>

    <GalleryForm v-model="showForm" :item="editingItem" @submit="submitForm" />
    <BaseToast v-model="showToast" :type="toastType" :message="toastMessage" />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue"
import debounce from "lodash/debounce"
import BaseToast from "../Toast/BaseToast.vue"
import GalleryForm from "./GalleryForm.vue"
import api from "../../services/galleryApi.js"

const items = ref([])
const loading = ref(false)
const page = ref(1)
const lastPage = ref(1)
const perPage = ref(20)
const q = ref("")
const isActive = ref("")

const showForm = ref(false)
const editingItem = ref(null)

const showToast = ref(false)
const toastMessage = ref("")
const toastType = ref("success")

function showNotification(message, type = "success") {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
}

async function fetchList() {
  loading.value = true
  try {
    const params = { page: page.value, per_page: perPage.value }
    if (q.value) params.q = q.value
    if (isActive.value !== "") params.is_active = isActive.value

    const res = await api.list(params)
    const payload = res.data
    const pager = payload?.data || payload
    const rows = Array.isArray(pager?.data) ? pager.data : []

    items.value = rows
    lastPage.value = pager?.last_page ?? 1
    page.value = pager?.current_page ?? page.value
  } catch (error) {
    showNotification("Gagal memuat galeri", "error")
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingItem.value = null
  showForm.value = true
}

function openEdit(item) {
  editingItem.value = { ...item }
  showForm.value = true
}

async function submitForm(payload) {
  try {
    if (editingItem.value && editingItem.value.id) {
      await api.update(editingItem.value.id, payload)
      showNotification("Galeri berhasil diperbarui")
    } else {
      await api.create(payload)
      showNotification("Galeri berhasil ditambahkan")
    }
    showForm.value = false
    await fetchList()
  } catch (error) {
    const msg =
      error?.response?.data?.message || error?.response?.data?.error || "Gagal menyimpan galeri"
    showNotification(msg, "error")
  }
}

async function removeItem(id) {
  if (!confirm("Yakin ingin menghapus galeri ini?")) return
  try {
    await api.remove(id)
    showNotification("Galeri berhasil dihapus")
    await fetchList()
  } catch (error) {
    const msg = error?.response?.data?.message || "Gagal menghapus galeri"
    showNotification(msg, "error")
  }
}

function nextPage() {
  if (page.value < lastPage.value) {
    page.value += 1
    fetchList()
  }
}

function prevPage() {
  if (page.value > 1) {
    page.value -= 1
    fetchList()
  }
}

const runSearch = debounce(() => {
  page.value = 1
  fetchList()
}, 400)

watch(q, runSearch)
watch([isActive, perPage], () => {
  page.value = 1
  fetchList()
})

onMounted(fetchList)
</script>

