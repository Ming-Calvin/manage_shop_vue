<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!--搜索与添加区-->
      <div style="margin-top: 15px;">
        <el-row :gutter="20">
          <el-col :span="8">
              <el-radio-group v-model="topForm.status" @change="findOrder">
                <el-radio-button :label="true">全部订单</el-radio-button>
                <el-radio-button :label="false">未支付</el-radio-button>
              </el-radio-group>
          </el-col>
          <el-col :span="3" :offset="13">
            <el-button type="warning" icon="el-icon-circle-plus-outline" round @click="addOrderDialogVisible=true">
              新建订单
            </el-button>
          </el-col>
        </el-row>
      </div>
      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column label="订单编号" prop="id" width="70px"></el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column label="购买数量" prop="number"></el-table-column>
        <el-table-column label="购买单价" prop="price"></el-table-column>
        <el-table-column label="支付金额（/元）" prop="money"></el-table-column>
        <el-table-column label="状态" width="140px" prop="status">
          <template slot-scope="scope">
            <el-tag type="success" size="mini" v-if="scope.row.status === true">已支付</el-tag>
            <el-tag type="success" size="mini" v-else >未支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260px">
          <template slot-scope="scope">
            <!--删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteOrder(scope.row.id) ">删除</el-button>
            <!--支付按钮-->
            <el-button type="success" icon="el-icon-coin" size="mini" v-if="scope.row.status === false" @click="statusClick(scope.row)">支付</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="添加订单"
        :visible.sync="addOrderDialogVisible"
        width="50%"
        center
        @close="addOrderDialogClosed">
        <el-form ref="addOrderFormRef" :model="addOrderForm" label-width="80px" :rules="addOrderFormRules">
          <!-- 商品名称 -->
          <el-form-item label="商品名称" prop="name">
            <el-select v-model="addOrderForm.name" placeholder="请选择" style="width:100%" @change="showPrice">
              <el-option
                v-for="item in goodList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                ref="goodName"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 购买数量 -->
          <el-form-item label="购买数量" prop="number">
            <el-input v-model="addOrderForm.number" clearable></el-input>
          </el-form-item>
          <!-- 购买单价 -->
          <el-form-item label="购买单价" prop="price">
            <el-input v-model="addOrderForm.price" disabled></el-input>
          </el-form-item>
          <!-- 支付金额 -->
          <el-form-item label="支付金额" prop="money">
            <el-input v-model="addOrderForm.money" disabled></el-input>
          </el-form-item>
          <!-- 状态 -->
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="addOrderForm.status">
              <el-radio :label="true">支付</el-radio>
              <el-radio :label="false">未支付</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="btns">
          <el-button :plain="true" @click="addOrderDialogVisible = false">取 消</el-button>
          <el-button type="primary" :plain="true" @click="addOrder">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>

export default {
  data () {
    return {
      // 头部表格
      topForm: {
        status: true
      },
      // 订单列表
      orderList: [],
      // 物品列表
      goodList: [],
      form: [],
      addOrderDialogVisible: false,
      addOrderForm: {
        name: '',
        number: 0,
        price: 0,
        money: 0,
        status: false
      },
      addOrderFormRules: {}
    }
  },
  created () {
    this.getOrderList()
    this.getGoodList()
  },
  methods: {
    // 获取物品列表
    async getGoodList () {
      const { data: res } = await this.$http.get('commoditys')
      // 把分类数据列表赋值给List
      this.goodList = res.data
      console.log(this.goodList)
    },
    // 展示修改地址的对话框
    showBox () {
      this.addressVisible = true
    },
    // 获取订单列表
    async getOrderList () {
      const { data: res } = await this.$http.get('orders')
      this.orderList = res.data
    },
    showAddOrderDialog () {},
    // 当新增框取消后
    addOrderDialogClosed () {
      this.$refs.addOrderFormRef.resetFields()
      this.addOrderForm = {}
    },
    // 提交新的订单
    async addOrder () {
      this.addOrderForm.money = this.addOrderForm.number * this.addOrderForm.price
      const { data: res } = await this.$http.post('orders', this.addOrderForm)
      console.log(res)
      await this.getOrderList()
      this.addOrderDialogVisible = false
    },
    // 当选择器变量之后获取单价
    showPrice (vId) {
      for (const v of this.goodList) {
        if (v.id === vId) {
          this.addOrderForm.name = v.name
          this.addOrderForm.price = v.price
        }
      }
      this.addOrderForm.money = this.addOrderForm.number * this.addOrderForm.price
    },
    // 状态改变
    async statusClick (userinfo) {
      const { data: res } = await this.$http.put(
        'orders/' + userinfo.id, {
          status: !userinfo.status
        })
      console.log(res)
      await this.getOrderList()
      this.$message.success('更新商品状态成功！')
    },
    // 删除订单
    async deleteOrder (id) {
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

      const { data: res } = await this.$http.delete('orders/' + id)
      console.log(res)
      this.$message.success('删除用户成功！')
      await this.getOrderList()
    },
    async findOrder (val) {
      if (val === false) {
        const { data: res } = await this.$http.get('orders/ordertrue')
        this.orderList = res
      } else {
        this.getOrderList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
