<template>
  <v-dialog
    v-model="model"
    max-width="1000"
    persistent
  >
    <v-card>

      <!-- Header -->
      <v-card-title class="bg-grey-lighten-4">
        <div class="d-flex align-center w-100">
          <v-icon class="mr-2">mdi-cog</v-icon>
          <span class="text-subtitle-1 font-weight-medium">
            每局盈亏明细
          </span>

          <v-spacer />

          <v-btn
            icon
            variant="text"
            size="small"
            @click="model = false"
          >
            <v-icon size="18">mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <!-- Body -->
      <v-card-text>
        <v-row>

          <!-- Left: Filters & Actions -->
          <v-col cols="12" md="4">
            <v-card class="pa-3">

              <!-- Date -->
              <v-menu
                v-model="dateMenu"
                :close-on-content-click="false"
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="date"
                    label="日期"
                    density="compact"
                    variant="outlined"
                    readonly
                  />
                </template>

                <v-date-picker
                  v-model="date"
                  locale="zh-CN"
                  @update:model-value="dateMenu = false"
                />
              </v-menu>

              <!-- Shoe & Round -->
              <v-row dense class="mt-2" align="center">
                <span class="text-body-2 mr-1">第</span>

                <v-select
                  v-model="shoe"
                  :items="shoes"
                  density="compact"
                  variant="outlined"
                  hide-details
                />

                <span class="text-body-2 mx-1">靴</span>

                <v-select
                  v-model="round"
                  :items="rounds"
                  density="compact"
                  variant="outlined"
                  hide-details
                 
                />

                <span class="text-body-2 ml-1">局</span>
              </v-row>

              <!-- Actions -->
              <v-btn
                block
                color="warning"
                class="mt-4"
                @click="changeTable('summary')"
              >
                查询下注选手明细
              </v-btn>

              <v-btn
                block
                color="grey"
                variant="flat"
                class="mt-2"
                @click="changeTable('result')"
              >
                开奖结果
              </v-btn>

            </v-card>
          </v-col>

          <!-- Right: Table -->
          <v-col cols="12" md="8">
            <v-card>
              <v-table
                striped="even" fixed-header
              >
                <thead>
                  <tr>
                    <th
                      v-for="header in activeTable.headers"
                      :key="header.key"
                      class="text-left font-weight-medium"
                    >
                      {{ header.title }}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="(row, index) in activeTable.rows"
                    :key="index"
                  >
                    <td
                      v-for="header in activeTable.headers"
                      :key="header.key"
                    >
                      {{ row[header.key] ?? "-" }}
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>

        </v-row>
      </v-card-text>

    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from "vue"

/* dialog */
const model = defineModel()

/* filters */
const date = ref(null)
const dateMenu = ref(false)

const shoes = [1, 2, 3, 4, 5]
const rounds = [20, 21, 22, 23, 24]

const shoe = ref(1)
const round = ref(23)

/* table state */
const activeType = ref("result")

/* mock data (replace with API later) */
const tables = {
  summary: {
    headers: [
      { title: "项目", key: "label" },
      { title: "金额", key: "amount" },
    ],
    rows: [
      { label: "总盈亏", amount: 159 },
      { label: "总洗码", amount: 237 },
    ],
  },

  result: {
    headers: [
      { title: "名称", key: "name" },
      { title: "热量", key: "calories" },
      { title: "编号", key: "code" },
    ],
    rows: [
      { name: "Frozen Yogurt", calories: 159, code: 1001 },
      { name: "Ice cream sandwich", calories: 237, code: 1002 },
      { name: "Eclair", calories: 262, code: 1003 },
    ],
  },
}

const activeTable = computed(() => tables[activeType.value])

const changeTable = (type) => {
  activeType.value = type
}
</script>
