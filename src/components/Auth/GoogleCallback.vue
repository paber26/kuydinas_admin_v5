<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  clearAuthSession,
  fetchAdminProfile,
  getGoogleCallbackSession,
  redirectToUserApp,
  saveAuthSession,
} from "../../utils/auth";

const router = useRouter();

const loadingMessage = ref("Memproses login Google...");
const error = ref("");

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  const { token, role, user, error: authError } = getGoogleCallbackSession(params);

  if (authError) {
    clearAuthSession();
    error.value = decodeURIComponent(authError);
    return;
  }

  if (!token) {
    clearAuthSession();
    error.value = "Token Google tidak ditemukan.";
    return;
  }

  if (role !== "admin") {
    clearAuthSession();
    loadingMessage.value = "Mengalihkan ke aplikasi user...";
    redirectToUserApp("/login");
    return;
  }

  saveAuthSession({ token, role, user });
  loadingMessage.value = "Menyiapkan sesi admin...";

  try {
    const confirmedUser = await fetchAdminProfile(token);
    const confirmedRole = confirmedUser.role || role || user?.role;

    if (confirmedRole && confirmedRole !== "admin") {
      clearAuthSession();
      loadingMessage.value = "Mengalihkan ke aplikasi user...";
      redirectToUserApp("/login");
      return;
    }

    saveAuthSession({
      token,
      role: confirmedRole,
      user: confirmedUser || user,
    });

    await router.replace("/");
  } catch (err) {
    if (!user) {
      clearAuthSession();
      error.value = err.message || "Sesi Google admin gagal diverifikasi.";
      return;
    }

    await router.replace("/");
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100">
    <div class="bg-white w-full max-w-md rounded-xl shadow-lg p-8 text-center">
      <h1 class="text-2xl font-bold text-slate-800">Google Auth</h1>
      <p class="mt-3 text-sm text-slate-500">
        {{ error || loadingMessage }}
      </p>

      <router-link
        v-if="error"
        to="/login"
        class="inline-flex mt-6 px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-700 transition"
      >
        Kembali ke Login
      </router-link>
    </div>
  </div>
</template>
