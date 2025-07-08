<template>
  <div class="ggbond-cards">
    <div 
      v-for="(item, index) in items" 
      :key="index"
      class="ggbond-card"
      :class="getCardClass(index)"
      @click="handleCardClick(item, index)"
    >
      <p class="tip">{{ item.title }}</p>
      <p class="second-text">{{ item.subtitle }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// Props
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  colors: {
    type: Array,
    default: () => ['red', 'blue', 'green', 'purple', 'orange', 'teal']
  },
  direction: {
    type: String,
    default: 'column', // 'column' or 'row'
    validator: (value) => ['column', 'row'].includes(value)
  },
  cardWidth: {
    type: String,
    default: '250px'
  },
  cardHeight: {
    type: String,
    default: '100px'
  },
  gap: {
    type: String,
    default: '15px'
  }
})

// Emits
const emit = defineEmits(['card-click'])

// Methods
const getCardClass = (index) => {
  const colorIndex = index % props.colors.length
  return props.colors[colorIndex]
}

const handleCardClick = (item, index) => {
  emit('card-click', { item, index })
}
</script>

<style scoped>
.ggbond-cards {
  display: flex;
  flex-direction: v-bind(direction);
  gap: v-bind(gap);
}

.ggbond-cards .red {
  background-color: #f43f5e;
}

.ggbond-cards .blue {
  background-color: #3b82f6;
}

.ggbond-cards .green {
  background-color: #22c55e;
}

.ggbond-cards .purple {
  background-color: #8b5cf6;
}

.ggbond-cards .orange {
  background-color: #f97316;
}

.ggbond-cards .teal {
  background-color: #14b8a6;
}

.ggbond-card {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  height: v-bind(cardHeight);
  width: v-bind(cardWidth);
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: 400ms;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.ggbond-card p.tip {
  font-size: 1em;
  font-weight: 700;
  margin: 0;
  margin-bottom: 4px;
}

.ggbond-card p.second-text {
  font-size: 0.7em;
  margin: 0;
  opacity: 0.9;
}

.ggbond-card:hover {
  transform: scale(1.1, 1.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.ggbond-cards:hover > .ggbond-card:not(:hover) {
  filter: blur(10px);
  transform: scale(0.9, 0.9);
}
</style>
