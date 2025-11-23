<script setup lang="ts">
import router from "../router";
</script>

<template>
  <aside
    class="sidebar w-72 bg-white border-r border-slate-200 p-4 hidden md:block"
  >
    <div class="mb-6">
      <a href="/" class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center">
          <img src="../src/assets/logo-kuydinas.png" alt="" srcset="" />
        </div>
        <div>
          <h1 class="text-lg font-semibold">KuyDinas</h1>
          <p class="text-sm text-slate-500">Admin Panel</p>
        </div>
      </a>
    </div>

    <nav class="space-y-1">
      <router-link
        to="/"
        class="flex items-center gap-3 p-2 rounded-lg text-slate-700 hover:bg-slate-50"
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
            d="M3 7h18M3 12h18M3 17h18"
          />
        </svg>
        <span>Dashboard</span>
      </router-link>
      <router-link
        to="/tryoutskd"
        class="flex items-center gap-3 p-2 rounded-lg text-slate-700 hover:bg-slate-50"
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
            d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6M9 7h6"
          />
        </svg>
        <span>Try Out SKD CPNS</span>
      </router-link>
      <router-link
        to="/akun"
        class="flex items-center gap-3 p-2 rounded-lg text-slate-700 hover:bg-slate-50"
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
            d="M3 10h2l1 9h12l1-9h2M16 3v4M8 3v4"
          />
        </svg>
        <span>Akun</span>
      </router-link>
      <router-link
        to="/materiskd"
        class="flex items-center gap-3 p-2 rounded-lg text-slate-700 hover:bg-slate-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3"
          />
        </svg>
        <span>Materi SKD</span>
      </router-link>
      <a
        class="flex items-center gap-3 p-2 rounded-lg text-slate-700 hover:bg-slate-50"
        href="#"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>Settings</span>
      </a>
    </nav>

    <div class="mt-6 pt-4 border-t border-slate-100">
      <div class="text-xs text-slate-400">Versi</div>
      <div class="text-sm font-medium">1.0.0</div>
    </div>
  </aside>
</template>
