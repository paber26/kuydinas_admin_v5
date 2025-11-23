<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex flex-1">
      <Sidebar />
      <div class="flex-1">
        <!-- Topbar -->
        <header
          class="bg-white border-b border-slate-200 p-4 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <button
              id="mobileMenuBtn"
              class="md:hidden p-2 rounded-md bg-slate-100"
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
              Halo, admin — ringkasan singkat performa aplikasi
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="relative">
              <input
                placeholder="Cari..."
                class="border rounded-full px-4 py-2 w-64 text-sm bg-slate-50 border-slate-200"
              />
              <button
                class="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
            <button
              class="p-2 rounded-full hover:bg-slate-100"
              title="Notifications"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            <div class="flex items-center gap-3 p-1 rounded-md">
              <img
                src="https://i.pravatar.cc/40"
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
import Sidebar from "./components/Sidebar.vue";
import Footer from "./components/Footer.vue";
</script>
