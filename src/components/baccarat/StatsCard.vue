<script setup>
import { useResultSettingStore } from "@/stores/resultsetting.store"
import { percent } from "@/composables/useBaccaratStatistics"

const store = useResultSettingStore()
</script>

<template>
<div class="vip-container">

  <!-- TODAY -->
  <div class="vip-card today">

    <div class="vip-title">
      今天局数 <span>{{ store.statistics.total }}</span>
    </div>

    <div class="vip-row">
      <span>庄</span>
      <span>{{ store.statistics.banker }}</span>
      <span>{{ percent(store.statistics.banker, store.statistics.total) }}</span>
    </div>

    <div class="vip-row">
      <span>闲</span>
      <span>{{ store.statistics.player }}</span>
      <span>{{ percent(store.statistics.player, store.statistics.total) }}</span>
    </div>

    <div class="vip-row">
      <span>和</span>
      <span>{{ store.statistics.tie }}</span>
      <span>{{ percent(store.statistics.tie, store.statistics.total) }}</span>
    </div>
    
    <hr>

    <div class="vip-row">
      <span>庄对</span>
      <span>{{ store.statistics.bankerPair }}</span>
    </div>

    <div class="vip-row">
      <span>闲对</span>
      <span>{{ store.statistics.playerPair }}</span>
    </div>

    <div class="vip-row">
      <span>幸运6-2</span>
      <span>{{ store.statistics.lucky6_2 }}</span>
    </div>

    <div class="vip-row">
      <span>幸运6-3</span>
      <span>{{ store.statistics.lucky6_3 }}</span>
    </div>

  </div>

</div>
</template>

<style scoped>
.vip-container{
  display:flex;
  gap:12px;
  font-family: Arial;
}

/* CARD */

.vip-card{
  width:230px;
  height: 245px;
  border-radius:8px;
  color:white;
  padding:10px;
  box-shadow:0 3px 6px rgba(0,0,0,0.4);
}

/* TITLE */

.vip-title{
  background:#ffe600;
  color:#d10000;
  font-weight:bold;
  padding:4px 8px;
  border-radius:4px;
  margin-bottom:8px;
}

/* ROW */

.vip-row{
  display:flex;
  justify-content:space-between;
  padding:3px 0;
  font-size:14px;
}

/* COLORS */

.today{
  background:linear-gradient(#ff4a4a,#a50000);
}

</style>