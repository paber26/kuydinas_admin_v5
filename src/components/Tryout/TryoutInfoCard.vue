<template>
  <div class="bg-white rounded-2xl shadow-sm border p-6 mb-8">
    <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
      <!-- NAMA TRYOUT -->
      <div class="bg-slate-50 p-4 rounded-xl">
        <p class="text-xs text-slate-500">Nama</p>
        <p class="font-semibold mt-1">{{ tryout.title }}</p>
      </div>

      <!-- TOTAL -->
      <div class="bg-purple-50 p-4 rounded-xl">
        <p class="text-xs text-purple-600">Total</p>
        <p class="font-bold text-lg text-purple-700">
          {{ total }} / {{ totalTarget }}
        </p>
      </div>

      <!-- TWK -->
      <div class="bg-blue-50 p-4 rounded-xl">
        <p class="text-xs text-blue-600">TWK</p>

        <div class="flex items-center gap-2 mt-1">
          <span class="font-bold text-lg text-blue-700"> {{ twk }} / </span>

          <input
            v-model.number="target.twk"
            type="number"
            class="w-16 border rounded px-2 py-1 text-sm"
          />
        </div>
      </div>

      <!-- TIU -->
      <div class="bg-green-50 p-4 rounded-xl">
        <p class="text-xs text-green-600">TIU</p>

        <div class="flex items-center gap-2 mt-1">
          <span class="font-bold text-lg text-green-700"> {{ tiu }} / </span>

          <input
            v-model.number="target.tiu"
            type="number"
            class="w-16 border rounded px-2 py-1 text-sm"
          />
        </div>
      </div>

      <!-- TKP -->
      <div class="bg-orange-50 p-4 rounded-xl">
        <p class="text-xs text-orange-600">TKP</p>

        <div class="flex items-center gap-2 mt-1">
          <span class="font-bold text-lg text-orange-700"> {{ tkp }} / </span>

          <input
            v-model.number="target.tkp"
            type="number"
            class="w-16 border rounded px-2 py-1 text-sm"
          />
        </div>
      </div>
    </div>

    <!-- BUTTON -->
    <div class="mt-6 flex justify-end">
      <button
        @click="$emit('save')"
        class="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm"
      >
        Simpan Komposisi
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps(["tryout", "total", "totalTarget", "twk", "tiu", "tkp", "target"]);
</script>
