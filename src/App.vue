<template>
  <div class="min-h-screen flex flex-col">
    <!-- LOGIN PAGE -->
    <router-view v-if="route.meta.authPage" />

    <!-- ADMIN LAYOUT -->
    <div v-else class="flex flex-1 overflow-hidden relative">
      <div
        v-if="isMobile && !isSidebarHidden"
        class="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
        @click="toggleSidebar"
      />
      <Sidebar :is-hidden="isSidebarHidden" @toggle="toggleSidebar" />

      <div
        class="flex-1 flex flex-col min-w-0 bg-slate-50 transition-all duration-300"
      >
        <!-- HEADER -->
        <header
          class="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 sm:px-6 sm:py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-center gap-3 min-w-0">
            <button
              id="mobileMenuBtn"
              class="p-2 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors md:hidden"
              @click="toggleSidebar"
            >
              ☰
            </button>

            <h2
              class="text-lg sm:text-xl font-semibold text-slate-900 truncate"
            >
              Dashboard
            </h2>

            <div class="ml-2 hidden lg:block text-sm text-slate-500 truncate">
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
        <main class="flex-1 overflow-y-auto">
          <router-view />
          <Footer />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";

import Sidebar from "./components/Sidebar.vue";
import Footer from "./components/Footer.vue";

const route = useRoute();

const isSidebarHidden = ref(false);
const windowWidth = ref(
  typeof window !== "undefined" ? window.innerWidth : 1024,
);

const isMobile = computed(() => windowWidth.value < 768);

function toggleSidebar() {
  isSidebarHidden.value = !isSidebarHidden.value;
}

function handleResize() {
  windowWidth.value = window.innerWidth;

  if (windowWidth.value >= 768) {
    isSidebarHidden.value = false;
    return;
  }

  isSidebarHidden.value = true;
}

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
