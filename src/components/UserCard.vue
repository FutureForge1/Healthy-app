<template>
  <div class="card">
    <button class="mail" @click="sendEmail">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail">
        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
      </svg>
    </button>
    
    <div class="profile-pic">
      <img v-if="userInfo.avatar" :src="userInfo.avatar" :alt="userInfo.realName || userInfo.username" />
      <div v-else class="default-avatar">
        <el-icon><UserFilled /></el-icon>
      </div>
    </div>
    
    <div class="bottom">
      <div class="content">
        <span class="name">{{ userInfo.realName || userInfo.username }}</span>
        <span class="about-me">{{ getRoleDisplayName(userInfo.role) }}</span>
      </div>
      
      <div class="bottom-bottom">
        <div class="social-links-container">
          <svg v-if="userInfo.phone" @click="callPhone" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
          
          <svg v-if="userInfo.email" @click="sendEmail" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          
          <svg @click="viewProfile" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        
        <button class="button" @click="editProfile">编辑资料</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { UserFilled } from '@element-plus/icons-vue'
import { ROLE_DISPLAY_NAMES } from '@/utils/permission'

// Props
const props = defineProps({
  userInfo: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['edit-profile', 'send-email', 'call-phone', 'view-profile'])

// 方法
const getRoleDisplayName = (role) => {
  return ROLE_DISPLAY_NAMES[role] || role || '未知角色'
}

const editProfile = () => {
  emit('edit-profile')
}

const sendEmail = () => {
  if (props.userInfo.email) {
    window.open(`mailto:${props.userInfo.email}`)
  }
  emit('send-email')
}

const callPhone = () => {
  if (props.userInfo.phone) {
    window.open(`tel:${props.userInfo.phone}`)
  }
  emit('call-phone')
}

const viewProfile = () => {
  emit('view-profile')
}
</script>

<style scoped>
.card {
  width: 95%; /* 改为100%宽度，自适应容器 */
  height: 530px; /* 固定合适的高度 */
  background: white;
  border-radius: 32px;
  padding: 3px;
  position: relative;
  box-shadow: #604b4a30 0px 70px 30px -50px;
  transition: all 0.5s ease-in-out;
}

.card .mail {
  position: absolute;
  right: 2rem;
  top: 1.4rem;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 4;
}

.card .mail svg {
  stroke: #fbb9b6;
  stroke-width: 3px;
  transition: all 0.3s ease;
}

.card .mail svg:hover {
  stroke: #f55d56;
  transform: scale(1.1);
}

.card .profile-pic {
  position: absolute;
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  top: 3px;
  left: 3px;
  border-radius: 29px;
  z-index: 1;
  border: 0px solid #fbb9b6;
  overflow: hidden;
  transition: all 0.5s ease-in-out 0.2s, z-index 0.5s ease-in-out 0.2s;
}

.card .profile-pic img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  object-position: 0px 0px;
  transition: all 0.5s ease-in-out 0s;
}

.card .profile-pic .default-avatar {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 80px;
}

.card .bottom {
  position: absolute;
  bottom: 3px;
  left: 3px;
  right: 3px;
  background: #fbb9b6;
  top: 80%;
  border-radius: 29px;
  z-index: 2;
  box-shadow: rgba(96, 75, 74, 0.1882352941) 0px 5px 5px 0px inset;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
}

.card .bottom .content {
  position: absolute;
  bottom: 0;
  left: 1.5rem;
  right: 1.5rem;
  height: 160px;
}

.card .bottom .content .name {
  display: block;
  font-size: 1.2rem;
  color: white;
  font-weight: bold;
  margin-top: 1rem;
}

.card .bottom .content .about-me {
  display: block;
  font-size: 0.9rem;
  color: white;
  margin-top: 0.5rem;
  opacity: 0.9;
}

.card .bottom .bottom-bottom {
  position: absolute;
  bottom: 1rem;
  left: 1.5rem;
  right: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card .bottom .bottom-bottom .social-links-container {
  display: flex;
  gap: 1rem;
}

.card .bottom .bottom-bottom .social-links-container svg {
  height: 20px;
  fill: white;
  filter: drop-shadow(0 5px 5px rgba(165, 132, 130, 0.1333333333));
  cursor: pointer;
  transition: all 0.3s ease;
}

.card .bottom .bottom-bottom .social-links-container svg:hover {
  fill: #f55d56;
  transform: scale(1.2);
}

.card .bottom .bottom-bottom .button {
  background: white;
  color: #fbb9b6;
  border: none;
  border-radius: 20px;
  font-size: 0.6rem;
  padding: 0.4rem 0.6rem;
  box-shadow: rgba(165, 132, 130, 0.1333333333) 0px 5px 5px 0px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.card .bottom .bottom-bottom .button:hover {
  background: #f55d56;
  color: white;
  transform: translateY(-2px);
}

.card:hover {
  border-top-left-radius: 55px;
  transform: translateY(-5px);
  box-shadow: #604b4a40 0px 80px 40px -60px;
}

.card:hover .bottom {
  top: 20%;
  border-radius: 80px 29px 29px 29px;
  transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1) 0.2s;
}

.card:hover .profile-pic {
  width: 100px;
  height: 100px;
  aspect-ratio: 1;
  top: 10px;
  left: 10px;
  border-radius: 50%;
  z-index: 3;
  border: 7px solid #fbb9b6;
  box-shadow: rgba(96, 75, 74, 0.1882352941) 0px 5px 5px 0px;
  transition: all 0.5s ease-in-out, z-index 0.5s ease-in-out 0.1s;
}

.card:hover .profile-pic:hover {
  transform: scale(1.3);
  border-radius: 0px;
}

.card:hover .profile-pic img {
  transform: scale(2.5);
  object-position: 0px 25px;
  transition: all 0.5s ease-in-out 0.5s;
}

.card:hover .profile-pic .default-avatar {
  transform: scale(0.4);
  transition: all 0.5s ease-in-out 0.5s;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card {
    height: 240px; /* 移动端固定高度 */
  }

  .card .bottom .content .name {
    font-size: 1rem;
  }

  .card .bottom .content .about-me {
    font-size: 0.8rem;
  }

  .card .bottom .bottom-bottom .button {
    font-size: 0.5rem;
    padding: 0.3rem 0.5rem;
  }
}
</style>
