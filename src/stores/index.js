import persist from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'
import { useUserStore } from './user' // 导入

const pinia = createPinia()
pinia.use(persist)

export default pinia
export { useUserStore } // 重新导出