<template>
  <div class="min-h-screen flex flex-col">
    <!-- LOGIN PAGE -->
    <router-view v-if="route.meta.authPage" />

    <!-- ADMIN LAYOUT -->
    <div v-else class="flex flex-1 overflow-hidden relative">
      <Sidebar :is-hidden="isSidebarHidden" @toggle="toggleSidebar" />

      <div class="flex-1 flex flex-col min-w-0 bg-slate-50 transition-all duration-300">

        <!-- HEADER -->
        <header
          class="bg-white border-b border-slate-200 p-4 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <button
              id="mobileMenuBtn"
              class="p-2 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors"
              @click="toggleSidebar"
            >
              ☰
            </button>

            <h2 class="text-xl font-semibold">Dashboard</h2>

            <div class="ml-4 text-sm text-slate-500">
              Halo, admin — satu langkah kecil setiap harinya
            </div>
          </div>

          <!-- USER -->
          <div class="flex items-center gap-3">
            <img
              src="/src/assets/logo-kuydinas.png"
              class="w-9 h-9 rounded-full"
            />

            <div class="hidden sm:block text-sm">
              <div class="font-medium">Admin</div>
              <div class="text-xs text-slate-400">admin@kuydinas.id</div>
            </div>
          </div>
        </header>

        <!-- PAGE -->
        <router-view />

        <Footer />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";

import Sidebar from "./components/Sidebar.vue";
import Footer from "./components/Footer.vue";

const route = useRoute();

const isSidebarHidden = ref(false);

function toggleSidebar() {
  isSidebarHidden.value = !isSidebarHidden.value;
}

function handleResize() {
  if (window.innerWidth >= 768) {
    mobileOpen.value = false;
    document.body.classList.remove("sidebar-open");
  }
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
