<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/Commodity' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 步骤条区域 -->
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="商品信息" icon="el-icon-s-order"></el-step>
        <el-step title="确认信息" icon="el-icon-success"></el-step>
      </el-steps>
      <el-divider><i class="el-icon-edit"></i></el-divider>
      <div style="margin-top: 30px;" v-if="active === 0">
        <el-row :gutter="20">
          <el-col :span="15" :offset="4">
            <el-form ref="addFormRef" :model="addForm" label-width="80px" :rules="addFormRules">
              <!-- 商品名 -->
              <el-form-item label="商品名" prop="name">
                <el-input v-model="addForm.name" clearable></el-input>
              </el-form-item>
              <!-- 品牌 -->
              <el-form-item label="品牌" prop="brand">
                <el-select v-model="addForm.brand" placeholder="请选择" style="width:100%">
                  <el-option
                    v-for="item in brandList"
                    :key="item.id"
                    :label="item.cName"
                    :value="item.cName">
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- 分类 -->
              <el-form-item label="分类" prop="class">
                <el-cascader
                  ref="refClass"
                  expand-trigger="hover"
                  :options="parentClassList"
                  :props="cascaderProps"
                  v-model="selectedKeys"
                  @change="parentCateChanged"
                  clearable
                  change-on-select
                  style="width:100%">
                </el-cascader>
              </el-form-item>
              <!-- 价格 -->
              <el-form-item label="价格" prop="price">
                <el-input v-model="addForm.price" clearable></el-input>
              </el-form-item>
              <!-- 数量 -->
              <el-form-item label="数量" prop="number">
                <el-input v-model="addForm.number" clearable></el-input>
              </el-form-item>
              <!-- 状态 -->
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="addForm.status">
                  <el-radio :label="true">通过</el-radio>
                  <el-radio :label="false">不通过</el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- 热卖 -->
              <el-form-item label="热卖" prop="sell">
                <el-radio-group v-model="addForm.sell">
                  <el-radio :label="true">热卖</el-radio>
                  <el-radio :label="false">不热卖</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <el-row :gutter="20">
        <el-col :span="4" :offset="17">
          <el-button style="margin-top: 12px;" @click="next">确认</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  data () {
    return {
      active: 0,
      // 新增的表格
      addForm: {
        name: '',
        brand: '',
        class: '',
        price: 0,
        number: 0,
        status: false,
        sell: false
      },
      // 新增表格的规则
      addFormRules: {
        name: [{
          required: true,
          message: '请输入分类名称',
          trigger: 'blur'
        }],
        brand: [{
          required: true,
          message: '请选择品牌',
          trigger: 'change'
        }],
        class: [{
          required: true,
          message: '请选择分类',
          trigger: 'change'
        }],
        price: [{
          required: true,
          message: '请输入价格',
          trigger: 'blur'
        }, {
          pattern: /^[0-9]*$/,
          message: '必须为数字',
          trigger: 'blur'
        }],
        number: [{
          required: true,
          message: '请输入剩余数量',
          trigger: 'blur'
        }, {
          pattern: /^[0-9]*$/,
          message: '必须为数字',
          trigger: 'blur'
        }]
      },
      // 品牌列表
      brandList: [],
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
      // 设置初始id为0，修改时用
      editId: 0
    }
  },
  created () {
    this.getBrandList()
    this.getParentClassList()
  },
  methods: {
    // 获取品牌列表
    async getBrandList () {
      const { data: res } = await this.$http.get('commoditys/brands')
      this.brandList = res.data
      console.log(this.brandList)
    },
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
    // 只获取2级分类以上的分类数据
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
      const { data: res } = await this.$http.get('classifieds')
      var list = this.onlyTwo(res.data)
      this.parentClassList = this.toTree(list)
    },
    // 选择项发生变化触发这个函数
    parentCateChanged (value) {
      this.addForm.class = this.$refs.refClass.getCheckedNodes()[0].label
    },
    // 向下
    async next () {
      await this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // console.log(this.addForm)
        this.active++
        const { data: res } = await this.$http.post('commoditys', this.addForm)
        console.log(res)
        this.$message.success('添加分类成功！')
        console.log(this.active)
        await this.$router.push('/Commodity')
        this.active = 0
      })
    }
  }
}
</script>

<style scoped>

</style>
