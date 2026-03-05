<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm border rounded-xl overflow-hidden">
      <thead class="bg-slate-100 text-slate-700">
        <tr>
          <th class="px-4 py-3 text-left">Kategori</th>
          <th class="px-4 py-3 text-left">Pertanyaan</th>
          <th class="px-4 py-3 text-left">Aksi</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="item in bankSoal"
          :key="item.id"
          class="border-t hover:bg-purple-50 transition"
        >
          <td class="px-4 py-3">
            <span
              class="px-3 py-1 text-xs font-medium rounded-full"
              :class="badge(item.category)"
            >
              {{ item.category }}
            </span>
          </td>

          <td class="px-4 py-3 max-w-lg truncate">
            {{ item.question }}
          </td>

          <td class="px-4 py-3">
            <button
              @click="emit('add', item)"
              :disabled="isQuotaFull(item.category)"
              class="bg-purple-600 hover:bg-purple-700 text-white text-xs px-4 py-1 rounded-md disabled:opacity-40"
            >
              Tambahkan
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="bankSoal.length === 0" class="text-center text-slate-400 py-6">
      Tidak ada soal
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  bankSoal: Array,
  badge: Function,
  isQuotaFull: Function,
});

const emit = defineEmits(["add"]);
</script>
