// 点击外部关闭指令
export const clickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function(event) {
      // 检查点击是否在元素外部
      if (!(el === event.target || el.contains(event.target))) {
        // 调用绑定的方法
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

export default clickOutside
