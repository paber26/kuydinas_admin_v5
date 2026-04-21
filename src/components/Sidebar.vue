<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { watch } from "vue";

import {
  Home,
  FileText,
  Users,
  Book,
  Database,
  Layers,
  Zap,
  Trophy,
  Activity,
} from "lucide-vue-next";

const route = useRoute();
const router = useRouter();

const icons: any = {
  home: Home,
  document: FileText,
  users: Users,
  book: Book,
  database: Database,
  layers: Layers,
  zap: Zap,
  trophy: Trophy,
  activity: Activity,
};

const menus = [
  { name: "Dashboard", path: "/", icon: "home" },
  // { name: "Try Out SKD CPNS", path: "/tryoutskd", icon: "document" },
  { name: "Daftar Akun", path: "/accounts", icon: "users" },
  // { name: "Materi SKD", path: "/materiskd", icon: "book" },
  { name: "Bank Soal SKD", path: "/banksoal", icon: "database" },
  { name: "Buat Tryout", path: "/tryout-builder", icon: "layers" },
  { name: "Paket Top Up", path: "/topup-packages", icon: "zap" },
  { name: "Peringkat", path: "/peringkat", icon: "trophy" },
  { name: "User Aktif", path: "/progress-user", icon: "activity" },
  { name: "Rekapan Tryout", path: "/rekapan-tryout", icon: "document" },
  { name: "Rekap Status Tryout", path: "/rekap-status-tryout", icon: "document" },
  // { name: "Axios Test", path: "/axiostest", icon: "zap" },
];

const props = defineProps({
  isHidden: Boolean,
});

const emit = defineEmits(["toggle"]);


const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
</script>

<template>
  <aside
    class="sidebar bg-white border-r border-slate-200 flex flex-col"
    :class="[
      isHidden ? 'w-0 -translate-x-full md:w-0' : 'w-72 translate-x-0',
      'fixed md:static inset-y-0 left-0 z-50',
    ]"
  >
    <!-- Logo -->
    <div class="p-5 border-b border-slate-100 flex items-center gap-3">
      <img src="/src/assets/logo-kuydinas.png" class="w-10 h-10" />

      <div>
        <h1 class="text-lg font-semibold text-slate-800">KuyDinas</h1>

        <p class="text-xs text-slate-500">Admin Panel</p>
      </div>
    </div>

    <!-- Menu -->
    <nav class="flex-1 p-3 space-y-1">
      <router-link
        v-for="menu in menus"
        :key="menu.path"
        :to="menu.path"
        class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition"
        active-class="bg-purple-100 text-purple-600"
      >
        <!-- icon -->
        <component :is="icons[menu.icon]" class="w-5 h-5" />

        <span>
          {{ menu.name }}
        </span>
      </router-link>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-slate-100">
      <button
        @click="logout"
        class="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-red-500 hover:bg-red-50 transition"
      >
        Logout
      </button>

      <div class="mt-3 text-xs text-slate-400">Versi 1.0.0</div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  transition:
    width 0.3s ease,
    transform 0.3s ease;
  overflow: hidden;
}

@media (max-width: 768px) {
  .sidebar {
    width: 18rem; /* 72px * 4 = 288px = 18rem */
    position: fixed;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  }
}
</style>
