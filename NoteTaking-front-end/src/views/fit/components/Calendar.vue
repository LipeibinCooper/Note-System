<script lang="ts" setup>
import { ref, onMounted } from 'vue'

interface SetDetail {
  weight: number
  reps: number
}

interface EquipmentDetail {
  equipment: string
  sets: SetDetail[]
}

interface RowData {
  date: string
  summaryValue: string[]
  details: { [key: string]: EquipmentDetail[] }
  expanded: boolean
}

const rowData = ref<RowData[]>([])
const dates = ref<string[]>([])

const generateCalendar = () => {
  const today = new Date()
  const month = today.getMonth() + 1 // 获取当前月份
  const year = today.getFullYear()
  const daysInMonth = new Date(year, month, 0).getDate() // 获取当前月份的天数
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day)
    const weekDay = weekDays[date.getDay()]
    const formattedDate = `${year}.${month}.${day} ${weekDay}`
    dates.value.push(formattedDate)
    rowData.value.push({ date: formattedDate, summaryValue: [], details: {}, expanded: true })
  }
}

onMounted(() => {
  generateCalendar()
})

// 计划选项
const options = [
  { value: '胸', label: '胸', color: '#FF6347' }, // 红色
  { value: '肩', label: '肩', color: '#FFD700' }, // 金色
  { value: '背', label: '背', color: '#8A2BE2' }, // 蓝紫色
  { value: '臂', label: '臂', color: '#7FFF00' }, // 春绿色
  { value: '腿', label: '腿', color: '#00BFFF' }, // 深天蓝色
  { value: '腹', label: '腹', color: '#FF69B4' } // 热粉色
]

const getColor = (value: string) => {
  const option = options.find(option => option.value === value)
  return option ? option.color : ''
}

const getLabel = (value: string) => {
  const option = options.find(option => option.value === value)
  return option ? option.label : ''
}

const addEquipment = (rowIndex: number, summaryValue: string) => {
  if (!rowData.value[rowIndex].details[summaryValue]) {
    rowData.value[rowIndex].details[summaryValue] = []
  }
  rowData.value[rowIndex].details[summaryValue].push({
    equipment: '',
    sets: []
  })
}

const addSet = (rowIndex: number, summaryValue: string, equipmentIndex: number) => {
  const equipment = rowData.value[rowIndex].details[summaryValue][equipmentIndex]
  equipment.sets.push({
    weight: 0,
    reps: 0
  })
}

const removeEquipment = (rowIndex: number, summaryValue: string, equipmentIndex: number) => {
  rowData.value[rowIndex].details[summaryValue].splice(equipmentIndex, 1)
}

const removeSet = (
  rowIndex: number,
  summaryValue: string,
  equipmentIndex: number,
  setIndex: number
) => {
  rowData.value[rowIndex].details[summaryValue][equipmentIndex].sets.splice(setIndex, 1)
}
</script>

<template>
  <div class="calendar">
    <ul>
      <li class="item" v-for="(row, rowIndex) in rowData" :key="rowIndex">
        <div class="date" @click="row.expanded = !row.expanded">{{ row.date }}</div>
        <div class="plan">
          <el-select
            v-model="row.summaryValue"
            multiple
            placeholder="请选择一个计划"
            style="width: 200px"
          >
            <template #default>
              <el-option
                v-for="option in options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              >
                <div class="flex items-center">
                  <el-tag :color="option.color" style="margin-right: 8px" size="small" />
                  <span :style="{ color: option.color }">{{ option.label }}</span>
                </div>
              </el-option>
            </template>
            <template #tag>
              <el-tag
                v-for="summary in row.summaryValue"
                :key="summary"
                :color="getColor(summary)"
                style="width: 50px; color: #f5f5f5"
              >
                {{ getLabel(summary) }}
              </el-tag>
            </template>
          </el-select>
          <el-collapse-transition>
            <div v-show="row.expanded">
              <div v-for="summary in row.summaryValue" :key="summary" class="summary-details">
                <el-button @click="addEquipment(rowIndex, summary)">
                  添加{{ getLabel(summary) }}的器械
                </el-button>
                <div
                  v-for="(equipment, equipmentIndex) in row.details[summary]"
                  :key="equipmentIndex"
                  class="equipment-item"
                >
                  <el-input class="input" v-model="equipment.equipment" placeholder="器械" />
                  <el-button
                    style="height: 40px; margin-right: 20px"
                    @click="removeEquipment(rowIndex, summary, equipmentIndex)"
                  >
                    删除器械
                  </el-button>
                  <el-button
                    style="height: 40px; margin-right: 20px"
                    @click="addSet(rowIndex, summary, equipmentIndex)"
                  >
                    添加组
                  </el-button>
                  <div class="Group">
                    <div v-for="(set, setIndex) in equipment.sets" :key="setIndex" class="set-item">
                      重量：<el-input
                        style="width: 100px"
                        class="input"
                        v-model="set.weight"
                        placeholder="重量（kg）"
                      />
                      次数：<el-input-number
                        style="width: 120px"
                        v-model="set.reps"
                        placeholder="次数"
                      />
                      <el-button @click="removeSet(rowIndex, summary, equipmentIndex, setIndex)"
                        >删除组</el-button
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-collapse-transition>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.calendar {
  width: 100%;
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    .item {
      width: 100%;
      padding: 20px 50px;
      border-bottom: 1px solid #ddd;
      display: flex;
      .date {
        width: 200px;
        color: #757575;
        font-weight: bold;
      }
      .plan {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .summary-details {
          margin-top: 10px;
          .equipment-item {
            margin-top: 10px;
            display: flex;
            .input {
              width: 200px;
              height: 40px;
              margin-right: 10px;
            }
            .set-item {
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 5px;
              color: #757575;
            }
          }
        }
      }
    }
  }
}
.el-tag {
  border: none;
  aspect-ratio: 1;
}
</style>
