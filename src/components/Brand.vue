<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>品牌管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card class="box-card">
      <!--搜索与添加区-->
      <div style="margin-top: 15px;">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="brandInput" placeholder="请输入品牌中文名"  clearable >
              <el-button slot="append" icon="el-icon-search" @click="searchBycName"></el-button>
            </el-input>
          </el-col>
          <el-col :span="3" :offset="13">
            <el-button type="warning" icon="el-icon-circle-plus-outline" round @click="addBrandDialogVisible=true">
              添加品牌
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div>
        <!--用户列表区-->
        <el-table :data="brandList" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="中文名" prop="cName"></el-table-column>
          <el-table-column label="英文名" prop="eName"></el-table-column>
          <el-table-column label="logo">
            <template slot-scope="scope" prop="logo">
              <el-image
                style="width: 70px; height: 70px"
                :src= "'https://calvin-typora-image.oss-cn-hangzhou.aliyuncs.com/img/' + scope.row.logo"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column label="推广" prop="promote">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.promote"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="userStateChanged(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="140px" prop="status">
            <template slot-scope="scope">
              <el-tag type="success" size="mini" v-if="scope.row.status === true">上线</el-tag>
              <el-tag type="success" size="mini" v-else >下线</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template  slot-scope="scope">
              <!--修改按钮-->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
              <!--删除按钮-->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteBrand(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--  添加品牌对话框  -->
    <el-dialog
      title="添加品牌"
      :visible.sync="addBrandDialogVisible"
      width="50%"
      center
      @close="addBrandDialogClosed">
      <el-form ref="addBrandFormRef" :model="addBrandForm" label-width="80px" :rules="addBrandFormRules">
        <!-- 中文名 -->
        <el-form-item label="中文名" prop="cName">
          <el-input v-model="addBrandForm.cName" clearable></el-input>
        </el-form-item>
        <!-- 英文名 -->
        <el-form-item label="英文名" prop="eName">
          <el-input v-model="addBrandForm.eName" clearable></el-input>
        </el-form-item>
        <!-- logo -->
        <el-form-item label="logo" prop="logo">
          <el-input v-model="addBrandForm.logo" clearable></el-input>
        </el-form-item>
        <!-- 推广 -->
        <el-form-item label="推广" prop="promote">
          <el-radio-group v-model="addBrandForm.promote">
            <el-radio :label="true">推广</el-radio>
            <el-radio :label="false">不推广</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 状态 -->
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="addBrandForm.status">
            <el-radio :label="true">上线</el-radio>
            <el-radio :label="false">下线</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="btns">
          <el-button :plain="true" @click="addBrandDialogVisible = false">取 消</el-button>
          <el-button type="primary" :plain="true" @click="addBrand">确 定</el-button>
        </span>
    </el-dialog>
    <!--  修改品牌对话框  -->
    <el-dialog
      title="修改品牌"
      :visible.sync="editBrandDialogVisible"
      width="50%"
      center
      @close="editBrandDialogClosed">
      <el-form ref="editBrandFormRef" :model="editBrandForm" label-width="80px" :rules="editBrandFormRules">
        <!-- 中文名 -->
        <el-form-item label="中文名" prop="cName">
          <el-input v-model="editBrandForm.cName" clearable></el-input>
        </el-form-item>
        <!-- 英文名 -->
        <el-form-item label="英文名" prop="eName">
          <el-input v-model="editBrandForm.eName" clearable></el-input>
        </el-form-item>
        <!-- logo -->
        <el-form-item label="logo" prop="logo">
          <el-input v-model="editBrandForm.logo" clearable></el-input>
        </el-form-item>
        <!-- 推广 -->
        <el-form-item label="推广" prop="promote">
          <el-radio-group v-model="editBrandForm.promote">
            <el-radio :label="true">推广</el-radio>
            <el-radio :label="false">不推广</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 状态 -->
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editBrandForm.status">
            <el-radio :label="true">上线</el-radio>
            <el-radio :label="false">下线</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="btns">
          <el-button :plain="true" @click="editBrandDialogVisible = false">取 消</el-button>
          <el-button type="primary" :plain="true" @click="editBrand">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取用户列表的参数
      queryInfo: {
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      total: 0,
      // 品牌列表
      brandList: [],
      // 添加品牌数组
      addBrandForm: {
        cName: '',
        eName: '',
        logo: '',
        promote: true,
        status: true
      },
      // 验证添加品牌对话框
      addBrandFormRules: {
        cName: [
          { required: true, message: '请输入中文名', trigger: 'blur' }
        ],
        eName: [
          { required: true, message: '请输入英文名', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: '请输入logo地址', trigger: 'blur' }
        ]
      },
      // 添加品牌对话框是否可见
      addBrandDialogVisible: false,
      // 输入条件
      brandInput: '',
      // 添加品牌数组
      editBrandForm: {
        cName: '',
        eName: '',
        logo: '',
        promote: true,
        status: true
      },
      // 验证添加品牌对话框
      editBrandFormRules: {
        cName: [
          { required: true, message: '请输入中文名', trigger: 'blur' }
        ],
        eName: [
          { required: true, message: '请输入英文名', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: '请输入logo地址', trigger: 'blur' }
        ]
      },
      // 添加品牌对话框是否可见
      editBrandDialogVisible: false
    }
  },
  created () {
    this.getBrandList()
  },
  methods: {
    // 获取品牌列表
    async getBrandList () {
      var list = {
        // 当前的页数
        pagenum: this.queryInfo.pagenum - 1,
        // 当前每页显示多少条数据
        pagesize: this.queryInfo.pagesize
      }
      const { data: res } = await this.$http.get('brands', { params: list })
      this.brandList = res.brands
      this.total = res.totalItems
      // console.log(this.brandList)
    },
    // 搜索品牌
    async searchBycName () {
      var list = { cName: this.brandInput }
      const { data: res } = await this.$http.get('brands', { params: list })
      this.brandList = res.brands
      this.total = res.totalItems
    },
    // 添加品牌
    addBrand () {
      this.$refs.addBrandFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('brands', this.addBrandForm)
        console.log(res)
        this.$message.success('添加分类成功！')
        await this.getBrandList()
        this.addBrandDialogVisible = false
      })
    },
    // 添加品牌输入框关闭时
    addBrandDialogClosed () {
      this.$refs.addBrandFormRef.resetFields()
      this.addBrandForm = {}
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getBrandList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getBrandList()
    },
    // 监听 switch 开关状态的改变
    async userStateChanged (userinfo) {
      // console.log(!userinfo.promote)
      const { data: res } = await this.$http.put(
        'brands/' + userinfo.id, {
          promote: userinfo.promote
        }
      )
      console.log(res)
      this.getBrandList()
      this.$message.success('修改品牌推广状态成功！')
    },
    // 修改品牌输入框关闭时
    editBrandDialogClosed () {
      this.$refs.editBrandFormRef.resetFields()
      this.editBrandForm = {}
    },
    // 显示品牌修改函数
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('brands/' + id)
      this.editBrandForm = res.data
      this.editBrandDialogVisible = true
    },
    // 修改品牌
    async editBrand () {
      await this.$refs.editBrandFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'brands/' + this.editBrandForm.id, this.editBrandForm)
        console.log(res)
        // 关闭对话框
        this.editBrandDialogVisible = false
        // 刷新分类数据列表
        await this.getBrandList()
        // 提示修改成功
        this.$message.success('更新用户信息成功！')
      })
    },
    // 删除品牌
    async deleteBrand (id) {
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
      const { data: res } = await this.$http.delete('brands/' + id)
      console.log(res)
      this.$message.success('删除用户成功！')
      await this.getBrandList()
    }
  }
}
</script>

<style lang="less" scoped>
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
