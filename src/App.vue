<template>
  <div class="min-h-screen flex">
    <Sidebar />
    <router-view></router-view>
  </div>
</template>

<script setup>
import Sidebar from "./components/Sidebar.vue";
</script>
