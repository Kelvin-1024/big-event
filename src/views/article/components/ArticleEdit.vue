<script setup>
import {ref,onMounted} from 'vue'
import {artGetChannelsService,artPublishService} from '@/api/article'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ElMessage } from 'element-plus'

const editorRef = ref()
const channelList = ref([])
const getChannelList = async () =>{
 const res = await artGetChannelsService()
  channelList.value = res.data.data
  console.log(channelList.value);
}
onMounted(() =>{
    getChannelList()
})
const visibleDrawer = ref(false)
const defaultForm = {
    title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
}


//准备数据
const formModel = ref({
 ...defaultForm
})

const imgUrl = ref('')

const onUploadFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  formModel.value.cover_img = uploadFile.raw
}

// 提交
const emit = defineEmits(['success'])
const onPublish = async (state) =>{
  formModel.value.state = state
  const fd = new FormData()
    for(let key in  formModel.value){
      fd.append(key, formModel.value[key])
    }
  
    //发请求
    if(formModel.value.id){
      console.log('编辑操作');      
    }else{
      await artPublishService(fd)
      ElMessage.success('添加成功')
      visibleDrawer.value = false
      emit('success','add')
    }
}




const open = (row) =>{
    visibleDrawer.value = true
    if(row.id){
      console.log('编辑回显');
    }else{
      formModel.value = {...defaultForm}
      imgUrl.value = ''
    editorRef.value.setHTML('')
    }    
}

defineExpose({
    open
})

</script>

<template>
    <el-drawer
      v-model="visibleDrawer"
      :title="formModel.id ? '编辑文章' : '添加文章'"
      direction="rtl"
      size="50%"
    >
      <!-- 发表文章表单 -->
      <el-form :model="formModel" ref="formRef" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select
            v-model="formModel.cate_id"
            width="100%"
          > <el-option 
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.cate_name"
      :value="channel.id"
      ></el-option>
    </el-select>
        </el-form-item>

        <el-form-item label="文章封面" prop="cover_img"> 
          <el-upload
            class="avatar-uploader"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="onUploadFile"
          >
  <img v-if="imgUrl" :src="imgUrl" class="avatar" />
  <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
</el-upload>
         </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <div class="editor">
            <quill-editor 
            ref="editorRef"
            theme="snow"
            v-model:content="formModel.content"
            content-type="html"
            >
            </quill-editor>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
          <el-button type="info" @click="onPublish('草稿')">草稿</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </template>


<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
  .editor {
    width: 100%;
    :deep(.ql-editor) {
      min-height: 300px; /* 将高度从200px增加到300px */
    }
  }
}
</style>