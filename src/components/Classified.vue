<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddClassDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table class="treeTable" :data="classifiedList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
        <!-- 是否有效 -->
        <template slot="effective" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.effective === true" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="sort" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operate" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteClass(scope.row)">删除</el-button>
        </template>
      </tree-table>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addClassDialogVisible"
      width="50%"
      @close="addClassDialogClosed">
      <!-- 添加分类的表单 -->
      <el-form
        :model="addClassForm"
        :rules="addClassFormRules"
        ref="addClassFormRef"
        label-width="100px">
        <el-form-item label="分类名称：" prop="name">
          <el-input v-model="addClassForm.name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader
            expand-trigger="hover"
            :options="parentClassList"
            :props="cascaderProps"
            v-model="selectedKeys"
            @change="parentCateChanged"
            clearable
            change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addClassDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClass">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="是否有效" prop="effective">
          <el-radio-group v-model="editForm.effective">
            <el-radio :label="true">有效</el-radio>
            <el-radio :label="false">无效</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="等级" prop="level">
<!--          <el-input v-model="editForm.level"></el-input>-->
          <el-radio-group v-model="editForm.level" disabled>
            <el-radio :label="0">一级</el-radio>
            <el-radio :label="1">二级</el-radio>
            <el-radio :label="2">三级</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品分类的数据列表，默认为空
      classifiedList: [],
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'name'
        },
        {
          label: '是否有效',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'effective'
        },
        {
          label: '排序',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'sort'
        },
        {
          label: '操作',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'operate'
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addClassDialogVisible: false,
      // 添加分类的表单数据对象
      addClassForm: {
        // 将要添加的分类的名称
        name: '',
        // 父级分类的Id
        pid: 0,
        // 分类的等级，默认要添加的是1级分类
        level: 0
      },
      // 添加分类表单的验证规则对象
      addClassFormRules: {
        name: [{
          required: true,
          message: '请输入分类名称',
          trigger: 'blur'
        }]
      },
      // 父级分类的列表
      parentClassList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      // 选中的父级分类的Id数组
      selectedKeys: [],
      editDialogVisible: false,
      // 查询到的分类信息
      editForm: {},
      // 修改规则
      editFormRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getClassList()
  },
  methods: {
    // 获取分类数据
    async getClassList () {
      const { data: res } = await this.$http.get('classifieds')
      // 把分类数据列表赋值给List
      this.classifiedList = this.toTree(res.data)
      // console.log(this.List)
    },
    // 创建树状结构
    toTree (data) {
      const map = {}
      const val = []
      data.forEach((item) => {
        map[item.id] = item
      })
      data.forEach((item) => {
        const parent = map[item.pid]
        if (parent) {
          (parent.children || (parent.children = [])).push(item)
        } else {
          val.push(item)
        }
      })
      return val
    },
    // 显示添加分类窗口
    showAddClassDialog () {
      // 先获取父级分类的数据列表
      this.getParentClassList()
      // 再展示出对话框
      this.addClassDialogVisible = true
    },
    // 只获取2级分类以上的分类数据
    onlyTwo (data) {
      var list = []
      for (var i in data) {
        if (data[i].level !== 2) {
          list.push(data[i])
        }
      }
      return list
    },
    // 获取父级分类的数据列表
    async getParentClassList () {
      const { data: res } = await this.$http.get('classifieds')
      var list = this.onlyTwo(res.data)
      this.parentClassList = this.toTree(list)
    },
    // 选择项发生变化触发这个函数
    parentCateChanged () {
      // 如果 selectedKeys 数组中的 length 大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addClassForm.pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addClassForm.level = this.selectedKeys.length
      } else {
        // 父级分类的Id
        this.addClassForm.pid = 0
        // 为当前分类的等级赋值
        this.addClassForm.level = 0
      }
    },
    // 添加分类按钮
    addClass () {
      this.$refs.addClassFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('classifieds', this.addClassForm)
        console.log(res)
        this.$message.success('添加分类成功！')
        await this.getClassList()
        this.addClassDialogVisible = false
      })
    },
    // 关闭添加对话框
    addClassDialogClosed () {
      this.$refs.addClassFormRef.resetFields()
      this.selectedKeys = []
      this.addClassForm.level = 0
      this.addClassForm.pid = 0
    },
    // 删除分类
    async deleteClass (item) {
      if ('children' in item) {
        return this.$message.error('存在下级，无法删除')
      }
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

      const { data: res } = await this.$http.delete('classifieds/' + item.id)
      console.log(res)
      this.$message.success('删除用户成功！')
      await this.getClassList()
    },
    // 展示编辑的对话框
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('classifieds/' + id)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改分类对话框关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    async editUserInfo () {
      await this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        console.log(this.editForm.id)
        const { data: res } = await this.$http.put(
          'classifieds/' + this.editForm.id,
          {
            name: this.editForm.name,
            level: this.editForm.level,
            effective: this.editForm.effective
          }
        )
        console.log(res)
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新分类数据列表
        await this.getClassList()
        // 提示修改成功
        this.$message.success('更新用户信息成功！')
      })
    }
  }
}
</script>

<style scoped>
.el-select .el-input {
  width: 150px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.treeTable {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
