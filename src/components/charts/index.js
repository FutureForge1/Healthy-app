// 图表组件统一导出
import BaseChart from './BaseChart.vue'
import BarChart from './BarChart.vue'
import LineChart from './LineChart.vue'
import PieChart from './PieChart.vue'

// 导出所有图表组件
export {
  BaseChart,
  BarChart,
  LineChart,
  PieChart
}

// 默认导出
export default {
  BaseChart,
  BarChart,
  LineChart,
  PieChart
}

// 图表组件安装函数（用于全局注册）
export const install = (app) => {
  app.component('BaseChart', BaseChart)
  app.component('BarChart', BarChart)
  app.component('LineChart', LineChart)
  app.component('PieChart', PieChart)
}
