<template>
  <v-toolbar
    density="comfortable"
    height="64"
    elevation="2"
    class="px-2"
    color="white"
  >
    <v-menu v-for="menu in menus" :key="menu.title">
      <template #activator="{ props }">
        <v-btn v-bind="props" variant="text" class="px-3 text-high-emphasis">
          {{ menu.title }}
        </v-btn>
      </template>

      <v-list density="compact">
        <v-list-item
          v-for="item in menu.items"
          :key="item.key"
          @click="$emit('action', item.key)"
          :class="['cursor-pointer', isActive(item.key) && 'bg-primary/10']"
        >
          <v-list-item-title
            :class="
              isActive(item.key)
                ? 'text-primary font-semibold'
                : 'text-black'
            "
            class="text-caption"
          >
            {{ item.label }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn
      variant="text"
      class="px-2 text-high-emphasis"
      color="black"
      @click="$emit('action', 'statistics')"
    >
      点击停止统计 当前统计日期: {{ statsDate }}
    </v-btn>

    <v-btn
      variant="text"
      class="px-2 text-high-emphasis"
      @click="$emit('action', 'clear')"
    >
      清空投注表
    </v-btn>

    <v-btn variant="text" class="px-2 text-high-emphasis text-error">
      【汇总:{{ summary.total }} | N盘:{{ summary.n }} | 零散:{{
        summary.misc
      }}
      | 对冲:{{ summary.hedge }} 】
    </v-btn>

    <v-spacer />

    <v-btn variant="text" class="font-mono text-error">
      {{ now }}
    </v-btn>
  </v-toolbar>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useDialogStore } from "../../stores/dialog.store";

const dialog = useDialogStore();

const isActive = (key) => dialog.activeMenu === key;

defineProps({
  menus: { type: Array, required: true },
  statsDate: String,
  summary: {
    type: Object,
    default: () => ({
      total: 0,
      n: 0,
      misc: 0,
      hedge: 0,
    }),
  },
});

defineEmits(["action"]);

const now = ref("");
let timer;

const updateTime = () => {
  now.value = new Date().toLocaleString("sv-SE");
};

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => clearInterval(timer));
</script>
