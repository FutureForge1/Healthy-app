<template>
  <el-dialog
    v-model="dialogVisible"
    title="更换头像"
    width="550px"
    :before-close="handleClose"
    center
  >
    <!-- 提示信息区域 -->
    <div class="tips-section">
      <div class="tip-item">
        <el-icon color="#409EFF"><InfoFilled /></el-icon>
        <span>支持 JPG、PNG 格式的图片文件</span>
      </div>
      <div class="tip-item">
        <el-icon color="#409EFF"><InfoFilled /></el-icon>
        <span>文件大小不超过 2MB</span>
      </div>
      <div class="tip-item">
        <el-icon color="#409EFF"><InfoFilled /></el-icon>
        <span>建议尺寸：200x200 像素，获得最佳显示效果</span>
      </div>
    </div>

    <div class="container">
      <div class="header">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          </g>
        </svg>
        <p>{{ selectedFile ? selectedFile.name : '点击下方按钮选择图片文件' }}</p>
        <!-- 预览区域 -->
        <div v-if="previewUrl" class="preview-area">
          <img :src="previewUrl" alt="预览" class="preview-image" />
        </div>
      </div>
      
      <label for="avatar-file" class="footer">
        <svg fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path d="M15.331 6H8.5v20h15V14.154h-8.169z"></path>
            <path d="M18.153 6h-.009v5.342H23.5v-.002z"></path>
          </g>
        </svg>
        <p>{{ selectedFile ? selectedFile.name : 'Not selected file' }}</p>
        <svg v-if="selectedFile" @click.stop="clearFile" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path d="M5.16565 10.1534C5.07629 8.99181 5.99473 8 7.15975 8H16.8402C18.0053 8 18.9237 8.9918 18.8344 10.1534L18.142 19.1534C18.0619 20.1954 17.193 21 16.1479 21H7.85206C6.80699 21 5.93811 20.1954 5.85795 19.1534L5.16565 10.1534Z" stroke="#000000" stroke-width="2"></path>
            <path d="M19.5 5H4.5" stroke="#000000" stroke-width="2" stroke-linecap="round"></path>
            <path d="M10 3C10 2.44772 10.4477 2 11 2H13C13.5523 2 14 2.44772 14 3V5H10V3Z" stroke="#000000" stroke-width="2"></path>
          </g>
        </svg>
      </label>
      
      <input 
        id="avatar-file" 
        type="file" 
        accept="image/jpeg,image/png,image/jpg"
        @change="handleFileSelect"
      />
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button 
          type="primary" 
          @click="handleUpload" 
          :loading="uploading"
          :disabled="!selectedFile"
        >
          {{ uploading ? '上传中...' : '确认上传' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:visible', 'upload-success', 'upload-error'])

// 响应式数据
const dialogVisible = ref(false)
const selectedFile = ref(null)
const previewUrl = ref('')
const uploading = ref(false)

// 计算属性
const isValidFile = computed(() => {
  if (!selectedFile.value) return false
  
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const maxSize = 2 * 1024 * 1024 // 2MB
  
  return validTypes.includes(selectedFile.value.type) && selectedFile.value.size <= maxSize
})

// 监听props变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
})

watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal)
  if (!newVal) {
    // 对话框关闭时清理数据
    clearFile()
  }
})

// 方法
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // 验证文件
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const maxSize = 2 * 1024 * 1024 // 2MB

  if (!validTypes.includes(file.type)) {
    ElMessage.error('只支持 JPG、PNG 格式的图片')
    return
  }

  if (file.size > maxSize) {
    ElMessage.error('图片大小不能超过 2MB')
    return
  }

  selectedFile.value = file
  
  // 创建预览
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = URL.createObjectURL(file)
  
  console.log('文件选择成功:', {
    name: file.name,
    size: file.size,
    type: file.type
  })
}

const clearFile = () => {
  selectedFile.value = null
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }
  // 清空input
  const input = document.getElementById('avatar-file')
  if (input) {
    input.value = ''
  }
}

const handleUpload = async () => {
  if (!selectedFile.value || !isValidFile.value) {
    ElMessage.error('请选择有效的图片文件')
    return
  }

  uploading.value = true
  
  try {
    // 触发上传事件，传递文件给父组件处理
    emit('upload-success', selectedFile.value)
    
    // 上传成功后关闭对话框
    dialogVisible.value = false
    ElMessage.success('头像上传成功')
  } catch (error) {
    console.error('上传失败:', error)
    emit('upload-error', error)
    ElMessage.error('头像上传失败')
  } finally {
    uploading.value = false
  }
}

const handleClose = () => {
  if (uploading.value) {
    ElMessage.warning('正在上传中，请稍候...')
    return
  }
  dialogVisible.value = false
}

// 组件卸载时清理
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
</script>

<style scoped>
.tips-section {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #bae6fd;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #374151;
}

.tip-item:last-child {
  margin-bottom: 0;
}

.tip-item span {
  line-height: 1.4;
}

.container {
  height: 320px;
  width: 400px;
  border-radius: 10px;
  box-shadow: 4px 4px 30px rgba(0, 0, 0, .2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  gap: 5px;
  background-color: rgba(0, 110, 255, 0.041);
  margin: 0 auto;
}

.header {
  flex: 1;
  width: 100%;
  border: 2px dashed royalblue;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.header svg {
  height: 100px;
}

.header p {
  text-align: center;
  color: black;
  margin: 10px 0;
  font-size: 14px;
  word-break: break-all;
}

.preview-area {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
}

.preview-image {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.footer {
  background-color: rgba(0, 110, 255, 0.075);
  width: 100%;
  height: 40px;
  padding: 8px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: black;
  border: none;
  transition: all 0.3s ease;
}

.footer:hover {
  background-color: rgba(0, 110, 255, 0.1);
}

.footer svg {
  height: 130%;
  fill: royalblue;
  background-color: rgba(70, 66, 66, 0.103);
  border-radius: 50%;
  padding: 2px;
  cursor: pointer;
  box-shadow: 0 2px 30px rgba(0, 0, 0, 0.205);
  transition: all 0.3s ease;
}

.footer svg:hover {
  transform: scale(1.1);
}

.footer p {
  flex: 1;
  text-align: center;
  margin: 0 8px;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#avatar-file {
  display: none;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Element Plus 对话框样式覆盖 */
:deep(.el-dialog) {
  border-radius: 16px;
}

:deep(.el-dialog__header) {
  padding: 20px 20px 10px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-dialog__footer) {
  padding: 10px 20px 20px;
  border-top: 1px solid #ebeef5;
}
</style>
