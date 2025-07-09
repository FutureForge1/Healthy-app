<template>
  <el-dialog
      v-model="dialogVisible"
      title="操作日志明细"
      width="80%"
      top="5vh"
      :before-close="handleClose"
      class="log-dialog"
      :close-on-click-modal="false"
      align-center
  >
    <div v-if="loading" class="log-loading">
      <CubeSpinner />
      <div class="log-loading-text">日志加载中...</div>
    </div>
    <el-table
        v-else
        :data="logData"
        height="60vh"
        border
        style="width: 100%;"
        size="small"
        class="log-table"
    >
      <el-table-column
          v-for="header in headers"
          :key="header"
          :prop="header"
          :label="header"
          :min-width="header.length > 10 ? 160 : 100"
          show-overflow-tooltip
      />
    </el-table>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import CubeSpinner from './CubeSpinner.vue'
import Papa from 'papaparse';

const props = defineProps({
  visible: Boolean
})
const emit = defineEmits(['update:visible'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const logData = ref([])
const headers = ref([])
const loading = ref(true)

watch(() => props.visible, async (val) => {
  if (val) {
    loading.value = true
    const res = await fetch('/aaa.csv')
    const text = await res.text()
    const { data, headerList } = parseCSV(text)
    logData.value = data
    headers.value = headerList
    setTimeout(() => { loading.value = false }, 800) // 保证动画可见
  }
})

function handleClose() {
  emit('update:visible', false)
}

// 动态CSV解析，返回数据和表头
function parseCSV(text) {
  const result = Papa.parse(text, { header: true, skipEmptyLines: true })
  return {
    data: result.data,
    headerList: result.meta.fields
  }
}
</script>

<style scoped>
.log-dialog .el-dialog__body {
  padding: 0 24px 24px 24px;
  background: #f8f9fa;
}
.log-dialog :deep(.el-dialog__title) {
  font-weight: bold;
}

.log-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.log-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  min-height: 300px;
  position: relative;
}
.log-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  min-height: 300px;
  position: relative;
}
.log-loading-text {
  font-size: 1.3em;
  color: #fe4252;
  font-weight: bold;
  letter-spacing: 2px;
  margin-top: 40px;
  text-shadow: 0 2px 8px rgba(254,66,82,0.15);
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  text-align: center;
  animation: fadeIn 1s;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px);}
  to { opacity: 1; transform: translateY(0);}
}
</style>