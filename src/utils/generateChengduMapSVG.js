// 生成成都地图SVG的工具函数
import axios from 'axios'

/**
 * 从GeoJSON数据生成成都地图SVG
 */
export async function generateChengduMapSVG() {
  try {
    // 获取成都地图GeoJSON数据
    const response = await axios.get('https://geo.datav.aliyun.com/areas_v3/bound/510100_full.json')
    const geoData = response.data

    // 计算边界框
    const bounds = calculateBounds(geoData)
    const { minX, minY, maxX, maxY } = bounds
    
    // SVG尺寸
    const width = 1200
    const height = 1200
    const padding = 50
    
    // 计算缩放比例
    const scaleX = (width - padding * 2) / (maxX - minX)
    const scaleY = (height - padding * 2) / (maxY - minY)
    const scale = Math.min(scaleX, scaleY)
    
    // 计算偏移量以居中
    const offsetX = (width - (maxX - minX) * scale) / 2 - minX * scale
    const offsetY = (height - (maxY - minY) * scale) / 2 - minY * scale

    // 生成SVG路径
    let svgPaths = ''
    
    if (geoData.features) {
      geoData.features.forEach((feature, index) => {
        const geometry = feature.geometry
        const properties = feature.properties
        
        if (geometry.type === 'Polygon') {
          const path = generatePolygonPath(geometry.coordinates[0], scale, offsetX, offsetY)
          svgPaths += `
            <path 
              d="${path}" 
              fill="none" 
              stroke="#ffffff" 
              stroke-width="1" 
              opacity="0.4"
              data-name="${properties.name || ''}"
            />
          `
        } else if (geometry.type === 'MultiPolygon') {
          geometry.coordinates.forEach(polygon => {
            const path = generatePolygonPath(polygon[0], scale, offsetX, offsetY)
            svgPaths += `
              <path 
                d="${path}" 
                fill="none" 
                stroke="#ffffff" 
                stroke-width="1" 
                opacity="0.4"
                data-name="${properties.name || ''}"
              />
            `
          })
        }
      })
    }

    // 生成完整的SVG
    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- 成都市区县边界 -->
        <g opacity="0.6">
          ${svgPaths}
        </g>
        
        <!-- 主城区高亮 -->
        <g opacity="0.8" stroke="#ffffff" stroke-width="2" fill="none">
          <!-- 这里可以添加主城区的特殊标记 -->
        </g>
        
        <!-- 重要地标 -->
        <g opacity="0.7" fill="#ffffff">
          <!-- 天府广场 -->
          <circle cx="${width/2}" cy="${height/2}" r="4" filter="url(#glow)"/>
          
          <!-- 其他重要地标可以根据实际坐标添加 -->
        </g>
        
        <!-- 标题 -->
        <g opacity="0.6" fill="#ffffff" font-family="Arial" font-size="16" text-anchor="middle">
          <text x="${width/2}" y="40">成都市</text>
          <text x="${width/2}" y="60" font-size="12" opacity="0.8">Chengdu</text>
        </g>
      </svg>
    `

    return svg.trim()

  } catch (error) {
    console.error('生成成都地图SVG失败:', error)
    return null
  }
}

/**
 * 计算GeoJSON的边界框
 */
function calculateBounds(geoData) {
  let minX = Infinity, minY = Infinity
  let maxX = -Infinity, maxY = -Infinity

  function processCoordinates(coordinates) {
    if (Array.isArray(coordinates[0])) {
      coordinates.forEach(coord => processCoordinates(coord))
    } else {
      const [x, y] = coordinates
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)
    }
  }

  if (geoData.features) {
    geoData.features.forEach(feature => {
      const geometry = feature.geometry
      if (geometry.type === 'Polygon') {
        geometry.coordinates.forEach(ring => processCoordinates(ring))
      } else if (geometry.type === 'MultiPolygon') {
        geometry.coordinates.forEach(polygon => {
          polygon.forEach(ring => processCoordinates(ring))
        })
      }
    })
  }

  return { minX, minY, maxX, maxY }
}

/**
 * 生成多边形SVG路径
 */
function generatePolygonPath(coordinates, scale, offsetX, offsetY) {
  if (!coordinates || coordinates.length === 0) return ''

  let path = ''
  
  coordinates.forEach((coord, index) => {
    const x = coord[0] * scale + offsetX
    const y = coord[1] * scale + offsetY
    
    if (index === 0) {
      path += `M ${x.toFixed(2)} ${y.toFixed(2)}`
    } else {
      path += ` L ${x.toFixed(2)} ${y.toFixed(2)}`
    }
  })
  
  path += ' Z'
  return path
}

/**
 * 将SVG转换为Data URL
 */
export function svgToDataUrl(svgString) {
  const encoded = encodeURIComponent(svgString)
  return `data:image/svg+xml,${encoded}`
}

/**
 * 生成并保存成都地图SVG文件
 */
export async function generateAndSaveChengduMap() {
  try {
    const svg = await generateChengduMapSVG()
    if (svg) {
      // 创建下载链接
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = 'chengdu-map-real.svg'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
      
      console.log('成都地图SVG已生成并下载')
      return svg
    }
  } catch (error) {
    console.error('生成和保存地图失败:', error)
  }
  return null
}
