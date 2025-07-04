import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// 注册GSAP插件
gsap.registerPlugin(ScrollTrigger)

// 全局动画配置
export const ANIMATION_CONFIG = {
  // 缓动函数
  easing: {
    smooth: "power3.out",
    bounce: "back.out(1.7)",
    elastic: "elastic.out(1, 0.5)",
    quick: "power2.out"
  },
  
  // 持续时间
  duration: {
    fast: 0.3,
    normal: 0.6,
    slow: 1.2,
    verySlow: 2.0
  },
  
  // 延迟时间
  delay: {
    short: 0.1,
    normal: 0.2,
    long: 0.5
  },
  
  // 错开时间
  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.2
  }
}

// 通用动画函数
export const createFadeInUp = (element, options = {}) => {
  const config = {
    y: 50,
    opacity: 0,
    duration: ANIMATION_CONFIG.duration.normal,
    ease: ANIMATION_CONFIG.easing.smooth,
    ...options
  }
  
  return gsap.from(element, config)
}

export const createFadeInLeft = (element, options = {}) => {
  const config = {
    x: -50,
    opacity: 0,
    duration: ANIMATION_CONFIG.duration.normal,
    ease: ANIMATION_CONFIG.easing.smooth,
    ...options
  }
  
  return gsap.from(element, config)
}

export const createFadeInRight = (element, options = {}) => {
  const config = {
    x: 50,
    opacity: 0,
    duration: ANIMATION_CONFIG.duration.normal,
    ease: ANIMATION_CONFIG.easing.smooth,
    ...options
  }
  
  return gsap.from(element, config)
}

export const createScaleIn = (element, options = {}) => {
  const config = {
    scale: 0,
    opacity: 0,
    duration: ANIMATION_CONFIG.duration.normal,
    ease: ANIMATION_CONFIG.easing.bounce,
    ...options
  }
  
  return gsap.from(element, config)
}

export const createRotateIn = (element, options = {}) => {
  const config = {
    rotation: 180,
    scale: 0,
    opacity: 0,
    duration: ANIMATION_CONFIG.duration.slow,
    ease: ANIMATION_CONFIG.easing.bounce,
    ...options
  }
  
  return gsap.from(element, config)
}

// 悬停动画
export const createHoverLift = (element, options = {}) => {
  const config = {
    y: -10,
    scale: 1.05,
    duration: ANIMATION_CONFIG.duration.fast,
    ease: ANIMATION_CONFIG.easing.quick,
    ...options
  }
  
  element.addEventListener('mouseenter', () => {
    gsap.to(element, config)
  })
  
  element.addEventListener('mouseleave', () => {
    gsap.to(element, {
      y: 0,
      scale: 1,
      duration: ANIMATION_CONFIG.duration.fast,
      ease: ANIMATION_CONFIG.easing.quick
    })
  })
}

export const createHoverGlow = (element, options = {}) => {
  const config = {
    boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)",
    duration: ANIMATION_CONFIG.duration.fast,
    ease: ANIMATION_CONFIG.easing.quick,
    ...options
  }
  
  element.addEventListener('mouseenter', () => {
    gsap.to(element, config)
  })
  
  element.addEventListener('mouseleave', () => {
    gsap.to(element, {
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      duration: ANIMATION_CONFIG.duration.fast,
      ease: ANIMATION_CONFIG.easing.quick
    })
  })
}

// 数字计数动画
export const createCountUp = (target, endValue, key, options = {}) => {
  const config = {
    duration: ANIMATION_CONFIG.duration.verySlow,
    ease: ANIMATION_CONFIG.easing.quick,
    ...options
  }
  
  return gsap.to(target, {
    [key]: endValue,
    ...config,
    onUpdate: () => {
      target[key] = Math.floor(target[key])
    }
  })
}

// 页面过渡动画
export const createPageTransition = (container, options = {}) => {
  const config = {
    opacity: 0,
    duration: ANIMATION_CONFIG.duration.normal,
    ease: ANIMATION_CONFIG.easing.smooth,
    ...options
  }
  
  gsap.set(container, { opacity: 0 })
  
  return gsap.to(container, {
    opacity: 1,
    ...config
  })
}

// ScrollTrigger 辅助函数
export const createScrollTrigger = (trigger, animation, options = {}) => {
  const config = {
    trigger,
    start: "top 80%",
    ...options
  }
  
  return ScrollTrigger.create({
    ...config,
    onEnter: () => animation.play()
  })
}

// 清理动画函数
export const cleanupAnimations = (timelines = [], triggers = []) => {
  // 清理时间线
  timelines.forEach(timeline => {
    if (timeline && timeline.kill) {
      timeline.kill()
    }
  })
  
  // 清理ScrollTrigger
  triggers.forEach(trigger => {
    if (trigger && trigger.kill) {
      trigger.kill()
    }
  })
  
  // 清理所有ScrollTrigger实例
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
}

// 预设动画组合
export const PRESET_ANIMATIONS = {
  // 页面加载动画
  pageLoad: (container) => {
    const tl = gsap.timeline()
    tl.add(createPageTransition(container))
    return tl
  },
  
  // 卡片网格动画
  cardGrid: (cards) => {
    const tl = gsap.timeline()
    tl.add(createFadeInUp(cards, {
      stagger: ANIMATION_CONFIG.stagger.normal,
      duration: ANIMATION_CONFIG.duration.slow
    }))
    return tl
  },
  
  // 表单动画
  form: (formElements) => {
    const tl = gsap.timeline()
    tl.add(createFadeInUp(formElements, {
      stagger: ANIMATION_CONFIG.stagger.fast,
      duration: ANIMATION_CONFIG.duration.normal
    }))
    return tl
  },
  
  // 导航栏动画
  navbar: (navElements) => {
    const tl = gsap.timeline()
    tl.add(createFadeInUp(navElements, {
      stagger: ANIMATION_CONFIG.stagger.fast,
      duration: ANIMATION_CONFIG.duration.normal
    }))
    return tl
  }
}

export default {
  ANIMATION_CONFIG,
  createFadeInUp,
  createFadeInLeft,
  createFadeInRight,
  createScaleIn,
  createRotateIn,
  createHoverLift,
  createHoverGlow,
  createCountUp,
  createPageTransition,
  createScrollTrigger,
  cleanupAnimations,
  PRESET_ANIMATIONS
}
