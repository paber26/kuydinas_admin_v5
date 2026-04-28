<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { buildAdminGoogleLoginUrl, loginAdminWithPassword, saveAuthSession } from "../../utils/auth"

const router = useRouter()

const email = ref("")
const password = ref("")
const loading = ref(false)
const error = ref("")
const showPassword = ref(false)

const login = async () => {
  error.value = ""

  if (!email.value || !password.value) {
    error.value = "Email dan password wajib diisi"
    return
  }

  loading.value = true

  try {
    const { token, user } = await loginAdminWithPassword({
      email: email.value,
      password: password.value
    })

    if (!token || !user) {
      error.value = "Login gagal"
      return
    }

    // 🚨 cek role
    if (user.role !== "admin") {
      error.value = "Akun ini bukan admin"
      return
    }

    saveAuthSession({ token, role: user.role, user })

    router.replace("/")
  } catch (err) {
    error.value = err.message || "Server tidak dapat dihubungi"
  } finally {
    loading.value = false
  }
}

const loginGoogle = () => {
  try {
    window.location.href = buildAdminGoogleLoginUrl()
  } catch (err) {
    error.value = err.message || "Konfigurasi Google Login tidak ditemukan"
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100">
    <div class="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
      <!-- LOGO -->
      <div class="flex flex-col items-center mb-6">
        <img src="/src/assets/logo-kuydinas.png" class="w-16 h-16 mb-3" />

        <h1 class="text-2xl font-bold text-slate-800">Admin KuyDinas</h1>

        <p class="text-sm text-slate-500">Login untuk mengelola tryout dan soal</p>
      </div>

      <!-- ERROR -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-4">
        {{ error }}
      </div>

      <!-- FORM -->
      <div class="space-y-4">
        <!-- EMAIL -->
        <div>
          <label class="text-sm text-slate-600">Email</label>

          <input
            v-model="email"
            type="email"
            placeholder="admin@gmail.com"
            class="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <!-- PASSWORD -->
        <div>
          <label class="text-sm text-slate-600">Password</label>

          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-emerald-500 outline-none"
            />

            <button type="button" @click="showPassword = !showPassword" class="absolute right-2 top-2 text-slate-400">
              👁
            </button>
          </div>
        </div>

        <!-- BUTTON -->
        <button
          @click="login"
          class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
          :disabled="loading"
        >
          <span v-if="loading">Login...</span>

          <span v-else>Login</span>
        </button>

        <!-- GOOGLE LOGIN -->
        <button
          @click="loginGoogle"
          class="w-full mt-3 flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-lg transition"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5" />

          Login dengan Google
        </button>
      </div>
    </div>
  </div>
</template>
