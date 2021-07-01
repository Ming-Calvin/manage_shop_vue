<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>规格管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddSpecificationDialog">添加规格</el-button>
        </el-col>
      </el-row>
      <!-- 规格列表区域 -->
      <el-table :data="specificationList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级规格 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(item1)">{{item1.name}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级规格 -->
              <el-col :span="20">
                <!-- 通过 for 循环 嵌套渲染二级规格 -->
                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="10">
                    <el-tag type="success" closable @close="removeRightById(item2)">{{item2.name}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="20">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightById(item3)">{{item3.name}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="所属分类" prop="name"></el-table-column>
        <el-table-column label="是否启用" prop="enable">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enable"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userEnableChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加规格的对话框 -->
    <el-dialog
      title="添加规格"
      :visible.sync="addSpecificationDialogVisible"
      width="50%"
      @close="addSpecificationDialogClosed">
      <!-- 添加分类的表单 -->
      <el-form
        :model="addSpecificationForm"
        :rules="addSpecificationFormRules"
        ref="addSpecificationFormRef"
        label-width="100px">
        <el-form-item label="规格名称：" prop="name">
          <el-input v-model="addSpecificationForm.name"></el-input>
        </el-form-item>
        <el-form-item label="父级规格：" >
          <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader
            style="width:100%"
            expand-trigger="hover"
            :options="parentSpecificationList"
            :props="cascaderProps"
            v-model="selectedKeys"
            @change="parentChanged"
            clearable
            change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addSpecificationDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSpecification">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 规格列表
      specificationList: [],
      // 控制添加规格对话框的显示与隐藏
      addSpecificationDialogVisible: false,
      // 添加规格表格
      addSpecificationForm: {
        // 将要添加的规格的名称
        name: '',
        // 父级规格的Id
        pid: 0,
        // 规格的等级，默认要添加的是1级规格
        level: 0
      },
      // 添加规格的规则
      addSpecificationFormRules: {
        name: [{
          required: true,
          message: '请输入规格名称',
          trigger: 'blur'
        }]
      },
      // 父级规格的列表
      parentSpecificationList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      // 选中的父级规格的Id数组
      selectedKeys: []
    }
  },
  created () {
    this.getSpecificationList()
  },
  methods: {
    // 获取规格列表
    async getSpecificationList () {
      const { data: res } = await this.$http.get('specifications')
      // 把分类数据列表赋值给List
      this.specificationList = this.toTree(res.data)
      console.log(this.specificationList)
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
    showAddSpecificationDialog () {
      // 先获取父级分类的数据列表
      this.getParentClassList()
      // 再展示出对话框
      this.addSpecificationDialogVisible = true
    },
    // 只获取3级分类以上的分类数据
    onlyTwo (data) {
      var list = []
      for (var i in data) {
        if (data[i].level !== 3) {
          list.push(data[i])
        }
      }
      return list
    },
    // 获取父级分类的数据列表
    async getParentClassList () {
      const { data: res } = await this.$http.get('specifications')
      var list = this.onlyTwo(res.data)
      this.parentSpecificationList = this.toTree(list)
    },
    // 选择项发生变化触发这个函数
    parentChanged () {
      // 如果 selectedKeys 数组中的 length 大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addSpecificationForm.pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addSpecificationForm.level = this.selectedKeys.length
      } else {
        // 父级分类的Id
        this.addSpecificationForm.pid = 0
        // 为当前分类的等级赋值
        this.addSpecificationForm.level = 0
      }
      console.log(this.selectedKeys.length)
    },
    // 添加规格
    addSpecification () {
      this.$refs.addSpecificationFormRef.validate(async valid => {
        if (!valid) return
        console.log(this.addSpecificationForm.pid)
        const { data: res } = await this.$http.post('specifications', this.addSpecificationForm)
        console.log(res)
        this.$message.success('添加规格成功！')
        await this.getSpecificationList()
        this.addSpecificationDialogVisible = false
      })
    },
    // 关闭添加规格框
    addSpecificationDialogClosed () {
      this.$refs.addSpecificationFormRef.resetFields()
      this.selectedKeys = []
      this.addSpecificationForm.level = 0
      this.addSpecificationForm.pid = 0
    },
    // 根据Id删除对应的参数
    async removeRightById (item) {
      if ('children' in item) {
        return this.$message.error('存在下级，无法删除')
      }
      // 弹框提示用户是否可以删除
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      await this.$http.delete(`specifications/${item.id}`)
      await this.getSpecificationList()
    },
    // 改变状态
    async userEnableChanged (item) {
      const { data: res } = await this.$http.put(
        'specifications/' + item.id, {
          enable: item.enable
        })
      console.log(res)
    }
  }
}
</script>

<style scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
