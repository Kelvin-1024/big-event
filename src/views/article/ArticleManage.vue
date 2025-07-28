<script setup>
import PageContainer from "@/components/PageContainer.vue";
import { ref,onMounted } from "vue";
import {artGetChannelsService,artGetListService} from '@/api/article'
import { formatTime } from '@/utils/format'
import ArticleEdit from "./components/ArticleEdit.vue";

const articleEditRef = ref()

const onAddArticle = () => {
  articleEditRef.value.open({})
}

const loading = ref(false)

const channelList = ref([])

const getChannelList = async () =>{
 const res = await artGetChannelsService()
  channelList.value = res.data.data
  console.log(channelList.value);
}

const params = ref({
  pagenum: 1, //当前页
  pagesize: 5,//当前生效的每页条数
  cate_id: '',
  state: ''
})
const articleList = ref([])
const total = ref(0)

const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}


onMounted(()=>{
  getChannelList(),
  getArticleList()

})

const onSizeChange = (size) =>{
  //console.log('当前每页条数',size);
  params.value.pagenum = 1
  params.value.pageSize = size
  getArticleList()
}

const onCurrentChange = (page) => {
  params.value.pagenum = page
  getArticleList()
}
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}
const onDeleteArticle = (row) => {
  console.log(row)
}

const onSearch = () =>{
  params.value.pagenum = 1
  getArticleList()
}

const onReset = () =>{
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

const onSuccess = (type) =>{
  if(type === 'add') {
    //如果是添加渲染最后一页
    const lastPage = Math.ceil(( total.value + 1) / params.value.pageSize)
    params.value.pagenum = lastPage
  } 
  getArticleList()
}

</script>



  <template>
 <page-container title="文章管理">
  <template #extra>
    <el-button type="primary" @click="onAddArticle">添加文章</el-button>
  </template>

  <!--表单区域-->
  <el-form inline>
  <el-form-item label="文章分类：">
    <el-select  v-model="params.cate_id" style="width:200px">
      <el-option 
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.cate_name"
      :value="channel.id"
      >
    </el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="发布状态：">
    <el-select v-model="params.state" style="width:200px">
      <el-option label="已发布" value="已发布"></el-option>
      <el-option label="草稿" value="草稿"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSearch">搜索</el-button>
    <el-button @click="onReset">重置</el-button>
  </el-form-item>
</el-form>

   <!--表格区域-->
   <el-table  v-loading="loading" :data="articleList" style="width: 100%">
  <el-table-column label="文章标题" width="400">
    <template #default="{ row }">
      <el-link type="primary" :underline="false">{{ row.title }}</el-link>
    </template>
  </el-table-column>
  <el-table-column label="分类" prop="cate_name"></el-table-column>
  <el-table-column label="发表时间" prop="pub_date">
    <template #default="{ row }">
    {{ formatTime(row.pub_date) }}
  </template> </el-table-column>
  <el-table-column label="状态" prop="state"></el-table-column>
  <el-table-column label="操作" width="100">
    <template #default="{ row }">
      <el-button
        icon="Edit"
        circle
        plain
        type="primary"
        @click="onEditArticle(row)"
      ></el-button>
      <el-button
        icon="Delete"
        circle
        plain
        type="danger"
        @click="onDeleteArticle(row)"
      ></el-button>
    </template>
  </el-table-column>
  <template #empty>
    <el-empty description="没有数据" />
  </template>
</el-table>

<!--分页区域-->
<el-pagination
  v-model:current-page="params.pagenum"
  v-model:page-size="params.pagesize"
  :page-sizes="[2, 3, 4, 5, 6, 10]"
  layout="jumper, total, sizes, prev, pager, next"
  :background = "true"
  :total="total"
  @size-change="onSizeChange"
  @current-change="onCurrentChange"
  style="margin-top: 20px; justify-content: flex-end"
/>

<!--添加编辑的抽屉-->
<article-edit ref="articleEditRef" @success="onSuccess"></article-edit>

</page-container>
  </template>



