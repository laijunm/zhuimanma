import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from "vue-router"

const router = useRouter()
const useMainStore = defineStore('main', {
    // pinia 状态管理的数据，通过箭头函数返回一个对象
    // 相当于 vue 中的 data 数据
    state: () => {
        return {

        }
    },

    // 相当于 vue 中的 computed 计算属性
    getters: {
        
    },

    // 相当于 vue 中的 methods 方法
    actions: {

        routerCartoonPage(id: number) {

            localStorage.setItem("bookId", JSON.stringify(id))
        }
    }
})

// 导出容器
export {
    useMainStore
}


