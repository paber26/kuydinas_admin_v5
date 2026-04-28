<template>
  <div class="min-h-full bg-slate-50/50 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Breadcrumbs -->
      <div class="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <router-link to="/accounts" class="hover:text-blue-600 transition-colors">Daftar Akun</router-link>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        <span class="text-slate-800 font-medium">Profil Peserta</span>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center py-20 text-slate-400">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
        <p>Memuat profil peserta...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-100 text-red-600 p-6 rounded-2xl text-center">
        <p class="font-medium">{{ error }}</p>
        <button @click="fetchData" class="mt-4 text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
          Coba Lagi
        </button>
      </div>

      <div v-else-if="userData" class="space-y-6 animate-in fade-in duration-500">
        <!-- User Profile Card -->
        <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          <div class="px-8 pb-8">
            <div class="relative flex justify-between items-end -mt-12 mb-6">
              <div class="p-1 bg-white rounded-2xl shadow-sm">
                <img 
                  :src="userData.user.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userData.user.name) + '&background=0D8ABC&color=fff'" 
                  class="w-32 h-32 rounded-xl object-cover border-4 border-white"
                  alt="Avatar"
                />
              </div>
              <div class="flex gap-3">
                <span 
                  class="px-4 py-1.5 rounded-full text-xs font-semibold"
                  :class="userData.user.is_active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-500 border border-slate-100'"
                >
                  {{ userData.user.is_active ? 'Akun Aktif' : 'Akun Nonaktif' }}
                </span>
                <button 
                  @click="openEditModal"
                  class="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                  Edit Profil
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="md:col-span-2 space-y-4">
                <div>
                  <h1 class="text-3xl font-bold text-slate-900">{{ userData.user.name }}</h1>
                  <p class="text-slate-500">{{ userData.user.email }}</p>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="flex items-center gap-3 text-slate-600">
                    <div class="p-2 bg-slate-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </div>
                    <span>{{ userData.user.whatsapp || '-' }}</span>
                  </div>
                  <div class="flex items-center gap-3 text-slate-600">
                    <div class="p-2 bg-slate-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <span class="truncate">{{ formatLocation(userData.user) }}</span>
                  </div>
                  <div class="flex items-center gap-3 text-slate-600">
                    <div class="p-2 bg-slate-50 rounded-lg text-amber-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="M17.22 15.35a.5.5 0 1 0-.44.89l.44-.89ZM17 19a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"/></svg>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Coin Balance</span>
                      <span class="font-bold text-slate-700">{{ formatNumber(userData.user.coin_balance) }}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 text-slate-600">
                    <div class="p-2 bg-slate-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Terakhir Login</span>
                      <span>{{ formatDate(userData.user.last_login) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-slate-50 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                <p class="text-slate-500 text-sm mb-1 uppercase tracking-wider font-semibold">Total Pengerjaan</p>
                <h2 class="text-4xl font-bold text-blue-600">{{ userData.summary.total_completed }}</h2>
                <div class="mt-4 flex gap-4 text-xs">
                  <div class="flex flex-col">
                    <span class="text-slate-400">Terdaftar</span>
                    <span class="font-bold text-slate-700">{{ userData.summary.total_registered }}</span>
                  </div>
                  <div class="w-px h-8 bg-slate-200"></div>
                  <div class="flex flex-col">
                    <span class="text-slate-400">Pending</span>
                    <span class="font-bold text-slate-700">{{ userData.summary.total_pending }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tryout History -->
        <div class="grid grid-cols-1 gap-6">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-slate-800">Riwayat Tryout</h2>
          </div>

          <div v-if="!userData.registrations.length" class="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <p>Belum ada riwayat tryout</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="reg in userData.registrations" 
              :key="reg.id"
              class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div class="flex justify-between items-start mb-4">
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span 
                      class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                      :class="reg.tryout.type === 'skd' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'"
                    >
                      {{ reg.tryout.type }}
                    </span>
                    <span class="text-slate-300">•</span>
                    <span class="text-[10px] text-slate-400 font-medium">ID #{{ reg.id }}</span>
                  </div>
                  <h3 class="font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                    {{ reg.tryout.title }}
                  </h3>
                </div>
                <div 
                  class="px-3 py-1 rounded-full text-[10px] font-bold"
                  :class="getStatusClasses(reg.status)"
                >
                  {{ formatStatus(reg.status) }}
                </div>
              </div>

              <div v-if="reg.score" class="mb-4 grid grid-cols-4 gap-2">
                <div class="bg-slate-50 rounded-xl p-2 text-center">
                  <p class="text-[10px] text-slate-400 mb-0.5">TWK</p>
                  <p class="font-bold text-slate-700">{{ reg.score.twk }}</p>
                </div>
                <div class="bg-slate-50 rounded-xl p-2 text-center">
                  <p class="text-[10px] text-slate-400 mb-0.5">TIU</p>
                  <p class="font-bold text-slate-700">{{ reg.score.tiu }}</p>
                </div>
                <div class="bg-slate-50 rounded-xl p-2 text-center">
                  <p class="text-[10px] text-slate-400 mb-0.5">TKP</p>
                  <p class="font-bold text-slate-700">{{ reg.score.tkp }}</p>
                </div>
                <div class="bg-blue-50 rounded-xl p-2 text-center">
                  <p class="text-[10px] text-blue-400 mb-0.5 font-bold">TOTAL</p>
                  <p class="font-bold text-blue-600">{{ reg.score.total }}</p>
                </div>
              </div>
              <div v-else class="mb-4 py-3 bg-slate-50 rounded-xl text-center">
                <p class="text-xs text-slate-400">Belum ada skor</p>
              </div>

              <div class="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-50">
                <div class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M16 2v4"/></svg>
                  <span>{{ formatDate(reg.finished_at || reg.started_at || reg.registered_at) }}</span>
                </div>
                <div v-if="reg.attempt_count > 0" class="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                  <span>{{ reg.attempt_count }}x Upaya</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="isEditModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="isEditModalOpen = false"></div>
      <div class="relative bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 class="text-xl font-bold text-slate-800">Edit Profil Peserta</h3>
          <button @click="isEditModalOpen = false" class="text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <form @submit.prevent="updateProfile" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nama Lengkap</label>
            <input v-model="editForm.name" type="text" class="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 transition-colors" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</label>
            <input v-model="editForm.email" type="email" class="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 transition-colors" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">WhatsApp</label>
            <input v-model="editForm.whatsapp" type="text" class="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 transition-colors" />
          </div>

          <div class="pt-2 border-t border-slate-50">
            <label class="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Ubah Password</label>
            <input 
              v-model="editForm.password" 
              type="password" 
              placeholder="Kosongkan jika tidak ingin mengubah"
              class="w-full px-4 py-2 bg-blue-50/30 border border-blue-100 rounded-xl outline-none focus:border-blue-500 transition-colors" 
            />
            <p class="mt-1 text-[10px] text-slate-400 italic">*Minimal 6 karakter jika ingin diubah</p>
          </div>

          <div class="pt-4 flex gap-3">
            <button 
              type="button" 
              @click="isEditModalOpen = false" 
              class="flex-1 px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              :disabled="updating"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-200"
            >
              {{ updating ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <BaseToast v-model="showToast" :type="toastType" :message="toastMessage" />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import adminUsersApi from '../../services/adminUsersApi'
import BaseToast from '../Toast/BaseToast.vue'

const route = useRoute()
const userData = ref(null)
const loading = ref(true)
const updating = ref(false)
const error = ref(null)

const isEditModalOpen = ref(false)
const editForm = reactive({
  name: '',
  email: '',
  whatsapp: '',
  password: ''
})

const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

function showNotification(message, type = 'success') {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
}

async function fetchData() {
  loading.value = true
  error.value = null
  try {
    const res = await adminUsersApi.tryoutSummary(route.params.id)
    userData.value = res.data.data
  } catch (err) {
    console.error('Gagal memuat profil peserta:', err)
    error.value = err.response?.data?.message || 'Terjadi kesalahan saat memuat data'
  } finally {
    loading.value = false
  }
}

function openEditModal() {
  const user = userData.value.user
  editForm.name = user.name
  editForm.email = user.email
  editForm.whatsapp = user.whatsapp || ''
  editForm.password = ''
  isEditModalOpen.value = true
}

async function updateProfile() {
  updating.value = true
  try {
    const payload = {
      name: editForm.name,
      email: editForm.email,
      whatsapp: editForm.whatsapp,
    }

    if (editForm.password) {
      if (editForm.password.length < 6) {
        showNotification('Password minimal 6 karakter', 'error')
        updating.value = false
        return
      }
      payload.password = editForm.password
    }

    await adminUsersApi.update(userData.value.user.id, payload)
    
    showNotification('Profil peserta berhasil diperbarui')
    isEditModalOpen.value = false
    
    // Refresh data
    await fetchData()
  } catch (err) {
    console.error('Gagal memperbarui profil:', err)
    const msg = err.response?.data?.message || 'Terjadi kesalahan saat memperbarui profil'
    showNotification(msg, 'error')
  } finally {
    updating.value = false
  }
}

function formatNumber(val) {
  try {
    return Number(val || 0).toLocaleString("id-ID");
  } catch {
    return String(val ?? 0);
  }
}

function formatLocation(user) {
  const parts = [user.regency_name, user.province_name].filter(Boolean)
  return parts.length ? parts.join(', ') : 'Lokasi belum disetel'
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateStr
  }
}

function formatStatus(status) {
  const map = {
    'registered': 'Terdaftar',
    'started': 'Mengerjakan',
    'completed': 'Selesai',
    'failed': 'Gagal'
  }
  return map[status] || status
}

function getStatusClasses(status) {
  const map = {
    'registered': 'bg-slate-100 text-slate-600',
    'started': 'bg-blue-100 text-blue-600',
    'completed': 'bg-emerald-100 text-emerald-600',
    'failed': 'bg-rose-100 text-rose-600'
  }
  return map[status] || 'bg-slate-100 text-slate-600'
}

onMounted(fetchData)
</script>

<style scoped>
.animate-in {
  animation: animate-in 0.5s ease-out;
}

@keyframes animate-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
