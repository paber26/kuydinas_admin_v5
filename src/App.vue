<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex flex-1">
      <Sidebar />
      <div class="flex-1">
        <header
          class="bg-white border-b border-slate-200 p-4 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <button
              id="mobileMenuBtn"
              class="md:hidden p-2 rounded-md bg-slate-100"
              @click="toggleMobileMenu"
              :aria-expanded="mobileOpen.toString()"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h2 class="text-xl font-semibold">Dashboard</h2>
            <div class="ml-4 text-sm text-slate-500">
              Halo, admin — satu langkah kecil setiap harinya
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="flex items-center gap-3 p-1 rounded-md">
              <img
                src="../src/assets/logo-kuydinas.png"
                class="w-9 h-9 rounded-full"
                alt="avatar"
              />
              <div class="hidden sm:block text-sm">
                <div class="font-medium">Admin</div>
                <div class="text-xs text-slate-400">admin@kuydinas.id</div>
              </div>
            </div>
          </div>
        </header>

        <router-view></router-view>
        <Footer />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Sidebar from "./components/Sidebar.vue";
import Footer from "./components/Footer.vue";

const mobileOpen = ref(false);

function toggleMobileMenu() {
  mobileOpen.value = !mobileOpen.value;
  try {
    document.body.classList.toggle("sidebar-open", mobileOpen.value);
  } catch (e) {
    // ignore if document not available during SSR
  }
}

function handleResize() {
  // if window becomes large, ensure mobile sidebar class is removed
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
