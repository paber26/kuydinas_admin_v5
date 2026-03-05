<template>
  <div class="mb-6 flex items-center gap-4">
    <label class="text-sm text-slate-600"> Filter Kategori: </label>

    <select
      :value="modelValue"
      @change="updateCategory"
      class="border rounded-lg px-3 py-2 text-sm"
    >
      <option value="">Semua</option>
      <option value="TWK">TWK</option>
      <option value="TIU">TIU</option>
      <option value="TKP">TKP</option>
    </select>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(["update:modelValue"]);

function updateCategory(event) {
  emit("update:modelValue", event.target.value);
}
</script>
