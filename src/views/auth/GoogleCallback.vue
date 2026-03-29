<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const message = ref("Memproses login Google...");

function redirectToLogin(error) {
  router.replace({ path: "/login", query: error ? { error } : undefined });
}

onMounted(() => {
  const token = route.query.token ? String(route.query.token) : "";
  const role = route.query.role ? String(route.query.role) : "";
  const userRaw = route.query.user ? String(route.query.user) : "";
  const error = route.query.error ? String(route.query.error) : "";

  if (error) {
    message.value = error;
    redirectToLogin(error);
    return;
  }

  if (!token) {
    const err = "Token tidak ditemukan dari Google callback";
    message.value = err;
    redirectToLogin(err);
    return;
  }

  let user = null;
  if (userRaw) {
    try {
      user = JSON.parse(userRaw);
    } catch {
      try {
        user = JSON.parse(decodeURIComponent(userRaw));
      } catch {
        user = null;
      }
    }
  }

  localStorage.setItem("token", token);
  localStorage.setItem("admin_token", token);

  if (role) localStorage.setItem("role", role);
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("admin_user", JSON.stringify(user));
  }

  if (role === "admin") {
    router.replace("/");
  } else {
    const err = "Akun ini bukan admin";
    message.value = err;
    redirectToLogin(err);
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100 p-6">
    <div class="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
      <h1 class="text-lg font-semibold text-slate-800">Login Google</h1>
      <p class="text-sm text-slate-500 mt-2">{{ message }}</p>
    </div>
  </div>
</template>
