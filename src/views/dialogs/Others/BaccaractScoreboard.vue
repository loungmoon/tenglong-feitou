<template>
  <v-dialog v-model="model" max-width="1200" persistent>
    <v-card height="700">
      <v-card-title class="bg-grey-lighten-4">
        <div class="d-flex align-center w-100">
          <v-icon class="mr-2">mdi-cog</v-icon>
          <span class="text-subtitle-1 font-weight-medium">
            Baccaract Scoreboard
          </span>

          <v-spacer />

          <v-btn icon variant="text" size="small" @click="model = false">
            <v-icon size="18">mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-5 h-100 table-bg">
        <v-row dense class="mb-1">
          <v-col cols="6">
            <BeadRoad :road="store.beadRoad" />
          </v-col>
          <v-col cols="6"> </v-col>
        </v-row>
        <!-- Big Road -->
        <BigRoad :road="store.bigRoad" class="mb-1"/>

        <DerivedRoadBoard
          :road="store.bigEyeRoadRaw" 
          type="bigEye"
        />

        <v-row dense class="mt-1">
          <v-col cols="6">
           <DerivedRoadBoard :road="store.smallRoadRaw"  type="small" />
          </v-col>
          <v-col cols="6">
             <DerivedRoadBoard :road="store.cockroachRoadRaw"  type="cockroach" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useResultSettingStore } from "@/stores/resultsetting.store";
import BigRoad from "@/components/baccarat/BigRoad.vue";
import BeadRoad from "@/components/baccarat/BeadRoad.vue";
import DerivedRoadBoard from "@/components/baccarat/DerivedRoadBoard.vue";
const model = defineModel({ type: Boolean });
const store = useResultSettingStore();
</script>
