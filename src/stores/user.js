import { defineStore } from "pinia";
import { ref } from 'vue'; // 添加这一行导入ref
import { userGetInfoService } from '../api/user'
export const useUserStore = defineStore('Big-user',()=>{
    const token = ref('');
    const setToken = (newToken) => {
        token.value = newToken
    }
    const removeToken = () => {
        token.value = ''
    }

   const user = ref([])
   const getUser = async () =>{
   const res =  await userGetInfoService()//请求获取数据
   user.value = res.data.data
   }
    const setUser = (obj) =>{
        user.value = obj
    }

    return {
            setToken,
            removeToken,
            token,
            user,
            getUser,
            setUser
    }
})
