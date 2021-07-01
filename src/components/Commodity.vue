<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="warning" icon="el-icon-circle-plus-outline" round @click="returnToNew">
        添加商品
      </el-button>
      <!-- table表格区域 -->
      <el-table :data="goodList" border stripe>
        <el-table-column label="商品ID" prop="id" width="80px"></el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column label="商品品牌" prop="brand"></el-table-column>
        <el-table-column label="商品分类" prop="class"></el-table-column>
        <el-table-column label="商品价格(元)" prop="price"></el-table-column>
        <el-table-column label="数量" prop="number"></el-table-column>
        <el-table-column label="商品状态" prop="status">
          <template slot-scope="scope">
            <el-tag type="success" size="mini" v-if="scope.row.status === true">通过</el-tag>
            <el-tag type="success" size="mini" v-else >未通过</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否是热销品">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.sell"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="returnToEdit(scope.row)">编辑</el-button>
            <el-button type="warning" icon="el-icon-circle-close" size="mini" v-if="scope.row.status === true" @click="statusClick(scope.row)">违规</el-button>
            <el-button type="success" icon="el-icon-circle-check" size="mini" v-else @click="statusClick(scope.row)">审核</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGood(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品列表
      goodList: []
    }
  },
  created () {
    this.getGoodList()
  },
  methods: {
    // 获取商品信息
    async getGoodList () {
      const { data: res } = await this.$http.get('commoditys')
      // 把分类数据列表赋值给List
      this.goodList = res.data
      console.log(this.goodList)
    },
    // 跳转至新增商品
    returnToNew () {
      this.$router.push('/Add')
    },
    // 跳转至修改商品
    returnToEdit (item) {
      console.log(item)
      this.$router.push({
        path: '/Edit',
        query: item
      })
    },
    // 删除商品
    async deleteGood (id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete('commoditys/' + id)
      console.log(res)
      this.$message.success('删除商品成功！')
      await this.getGoodList()
    },
    // 状态改变
    async statusClick (userinfo) {
      const { data: res } = await this.$http.put(
        'commoditys/' + userinfo.id, {
          status: !userinfo.status
        })
      console.log(res)
      await this.getGoodList()
      this.$message.success('更新商品状态成功！')
    }
  }
}
</script>

<style scoped>

</style>
