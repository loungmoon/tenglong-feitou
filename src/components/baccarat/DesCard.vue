<template>
  <div class="vip-container">
    <div class="vip-card explanation">
      <div class="vip-title">小圈说明</div>
      <v-row>
        <v-col cols="6">
          <div class="vip-row">
            <span class="small-ring" style="border-color: blue"></span>
            <span class="text-black">闲</span>
          </div>

          <div class="vip-row">
            <span class="small-ring" style="border-color: red"></span>
            <span class="text-black">庄</span>
          </div>

          <div class="vip-row">
            <span class="small-ring black-ring">
              <span class="tie-dot">1</span>
            </span>
            <span class="text-black">和</span>
          </div>

          <div class="vip-row">
            <span class="small-ring black-ring">
              <span class="banker-pair"></span>
            </span>
            <span class="text-black">庄对</span>
          </div>
        </v-col>
        <v-col cols="6">
          <div class="vip-row">
            <span class="small-ring black-ring">
              <span class="player-pair"></span>
            </span>
            <span class="text-black">闲对</span>
          </div>
          <div class="vip-row">
            <span class="small-ring" style="border-color: #fca603"></span>
            <span class="text-black">完美</span>
          </div>

          <div class="vip-row">
            <span class="small-ring black-ring">
              <span class="lucky6-gold"></span>
            </span>
            <span class="text-black">幸运6-普通</span>
          </div>

          <div class="vip-row">
            <span class="small-ring black-ring">
              <span class="lucky6-gold strong"></span>
            </span>
            <span class="text-black">幸运6-强</span>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<style scoped>
.vip-container {
  display: flex;
  gap: 12px;
  font-family: Arial;
  line-height: 30px;;
}

.vip-card {
  width: 290px;
  height: 245px;
  border-radius: 8px;
  color: white;
  padding: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
}

.vip-title {
  background: #ffe600;
  color: #d10000;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.vip-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  padding: 4px 0;
}

.explanation {
  background: linear-gradient(#dbc12d, #ffffff);
}

/* Small ring base */
.small-ring {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid white;
  box-sizing: border-box;
  position: relative;
  display: inline-block;
}

/* Black ring */
.black-ring {
  border-color: black;
}

/* Tie dot with number */
.tie-dot {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #2e7d32;
  color: white;
  font-size: 8px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Banker pair small dot */
.banker-pair {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d32f2f;
  top: -3px;
  left: -3px;
}

/* Player pair small dot */
.player-pair {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #1976d2;
  bottom: -2px;
  right: -2px;
}

/* Lucky6 effect */
.lucky6-gold {
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 215, 0, 0.35) 0%,
    rgba(46, 125, 50, 0.5) 60%,
    transparent 70%
  );
}

.lucky6-gold.strong {
  background: radial-gradient(
    circle,
    rgba(255, 136, 0, 0.35) 0%,
    rgba(190, 19, 13, 0.5) 60%,
    transparent 70%
  );
}
</style>
