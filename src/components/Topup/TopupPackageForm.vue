<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
      <h2 class="text-lg font-semibold mb-4">{{ editing ? "Edit Paket" : "Tambah Paket" }}</h2>
      <div class="space-y-4">
        <div>
          <label class="text-sm text-slate-600">Nama Paket</label>
          <input v-model="form.name" type="text" class="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 outline-none" />
          <p v-if="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name }}</p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm text-slate-600">Coin</label>
            <input v-model.number="form.coin_amount" type="number" min="1" class="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 outline-none" />
            <p v-if="errors.coin_amount" class="text-xs text-red-600 mt-1">{{ errors.coin_amount }}</p>
          </div>
          <div>
            <label class="text-sm text-slate-600">Bonus Coin</label>
            <input v-model.number="form.bonus_coin" type="number" min="0" class="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 outline-none" />
            <p v-if="errors.bonus_coin" class="text-xs text-red-600 mt-1">{{ errors.bonus_coin }}</p>
          </div>
        </div>
        <div>
          <label class="text-sm text-slate-600">Harga</label>
          <input v-model.number="form.price" type="number" min="1" class="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 outline-none" />
          <p v-if="errors.price" class="text-xs text-red-600 mt-1">{{ errors.price }}</p>
        </div>
        <div class="flex items-center gap-2">
          <input id="active" type="checkbox" v-model="form.is_active" />
          <label for="active" class="text-sm text-slate-600">Aktif</label>
        </div>
      </div>
      <div class="mt-6 flex justify-end gap-3">
        <button @click="close" class="px-4 py-2 rounded-md border">Batal</button>
        <button @click="submit" class="px-4 py-2 rounded-md bg-emerald-600 text-white">Simpan</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  item: { type: Object, default: null },
});

const emit = defineEmits(["update:modelValue", "submit"]);

const form = reactive({
  name: "",
  coin_amount: 1,
  bonus_coin: 0,
  price: 1,
  is_active: true,
});

const errors = reactive({
  name: "",
  coin_amount: "",
  bonus_coin: "",
  price: "",
});

const editing = computed(() => !!props.item);

watch(
  () => props.item,
  (val) => {
    if (val) {
      form.name = val.name ?? "";
      form.coin_amount = Number(val.coin_amount ?? 1);
      form.bonus_coin = Number(val.bonus_coin ?? 0);
      form.price = Number(val.price ?? 1);
      form.is_active = !!val.is_active;
    } else {
      form.name = "";
      form.coin_amount = 1;
      form.bonus_coin = 0;
      form.price = 1;
      form.is_active = true;
    }
  },
  { immediate: true },
);

function close() {
  emit("update:modelValue", false);
}

function validate() {
  errors.name = form.name ? "" : "Nama wajib diisi";
  errors.coin_amount = form.coin_amount >= 1 ? "" : "Coin minimal 1";
  errors.bonus_coin = form.bonus_coin >= 0 ? "" : "Bonus minimal 0";
  errors.price = form.price >= 1 ? "" : "Harga minimal 1";
  return !errors.name && !errors.coin_amount && !errors.bonus_coin && !errors.price;
}

function submit() {
  if (!validate()) return;
  const payload = {
    name: form.name.trim(),
    coin_amount: Number(form.coin_amount),
    bonus_coin: Number(form.bonus_coin),
    price: Number(form.price),
    is_active: !!form.is_active,
  };
  emit("submit", payload);
}
</script>
