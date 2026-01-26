<template>
  <v-card class="mb-2" elevation="5">
    <v-card-text>
      <v-row dense>
        <v-col cols="12" md="7">
          <v-alert
            type="error"
            variant="text"
            density="compact"
            class="mb-2 border"
          >
            <v-icon size="small">mdi-star-off-outline</v-icon>
            号为隐藏选手
          </v-alert>

          <v-sheet
            border
            rounded
            class="mt-1 pa-2 overflow-y-auto"
            height="250"
          >
            <v-list density="compact">
              <v-list-item
                v-for="p in playerStore.list"
                :key="p.playername"
                color="primary"
                :active="playerStore.selected?.playername === p.playername"
                @click="selectPlayer(p.playername)"
              >
                <template #prepend>
                  <v-icon
                    :icon="p.is_hide ? 'mdi-star-off-outline' : 'mdi-star'"
                  />
                </template>

                <v-list-item-title>
                  {{ p.playername }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-sheet>
        </v-col>

        <v-col cols="12" md="5" class="mt-11">
          <v-btn
            v-for="btn in actions"
            :key="btn.action"
            block
            color="#d17b4d"
            class="mb-2"
            :disabled="btn.needPlayer && !hasSelectedPlayer"
            @click="handleAction(btn.action)"
          >
            {{ btn.label }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <!-- DIALOGS -->
  <CreatePlayerDialog v-model="dlgCreate" />
  <UpdatePlayerDialog v-model="dlgUpdate" :player="playerStore.selected" />
  <DeletePlayerDialog v-model="dlgDelete" :player="playerStore.selected" />
  <TopPlayerDialog v-model="dlgTop" :player="playerStore.selected" />
  <HidePlayerDialog v-model="dlgHide" :player="playerStore.selected" />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { usePlayerStore } from "@/stores/player.store";

import {
  CreatePlayerDialog,
  UpdatePlayerDialog,
  DeletePlayerDialog,
  TopPlayerDialog,
  HidePlayerDialog,
} from "@/views/dialogs";

const playerStore = usePlayerStore();

const dlgCreate = ref(false);
const dlgUpdate = ref(false);
const dlgDelete = ref(false);
const dlgTop = ref(false);
const dlgHide = ref(false);

const hasSelectedPlayer = computed(() => !!playerStore.selected);

const actions = [
  { label: "刷新选手", action: "refresh", needPlayer: false },
  { label: "新增选手", action: "create", needPlayer: false },
  { label: "修改选手", action: "update", needPlayer: true },
  { label: "删除选手", action: "delete", needPlayer: true },
  { label: "置顶选手", action: "top", needPlayer: true },
  { label: "隐藏选手", action: "hide", needPlayer: true },
];

onMounted(() => {
  playerStore.fetchPlayers();
});

const selectPlayer = (name) => {
  playerStore.setSelectedByName(name);
};

const handleAction = async (action) => {
  switch (action) {
    case "refresh":
      await playerStore.fetchPlayers(true);
      playerStore.selected = null
      break;

    case "create":
      dlgCreate.value = true;
      break;

    case "update":
      dlgUpdate.value = true;
      break;

    case "delete":
      dlgDelete.value = true;
      break;

    case "top":
      dlgTop.value = true;
      break;

    case "hide":
      dlgHide.value = true;
      break;
  }
};
</script>
