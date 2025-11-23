<template>
  <section class="p-6">
    <h1 class="text-2xl font-bold mb-4 text-slate-800">Axios Test Page</h1>

    <div class="mb-4 flex gap-4">
      <button
        @click="getPosts"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        GET Posts
      </button>

      <button
        @click="createPost"
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        POST New Post
      </button>
    </div>

    <div v-if="loading" class="text-slate-500">Loading...</div>

    <ul v-else class="space-y-2">
      <li
        v-for="post in posts"
        :key="post.id"
        class="p-4 bg-white shadow rounded border"
      >
        <h2 class="font-semibold">{{ post.title }}</h2>
        <p class="text-sm text-slate-600">{{ post.body }}</p>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref } from "vue";
import api from "../services/api.js";

const posts = ref([]);
const loading = ref(false);

async function getPosts() {
  loading.value = true;
  try {
    const res = await api.get("/posts");
    posts.value = res.data;
  } catch (err) {
    console.error("Error GET:", err);
  } finally {
    loading.value = false;
  }
}

async function createPost() {
  try {
    const payload = {
      title: "Postingan Baru Dari KuyDinas",
      body: "Ini adalah data uji axios.",
      userId: 1,
    };

    const res = await api.post("/posts", payload);
    alert("POST berhasil! ID: " + res.data.id);
  } catch (err) {
    console.error("Error POST:", err);
  }
}
</script>

<style scoped></style>
