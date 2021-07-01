<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据分析</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card class="box-card">
      <!-- 提示区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="购买数量" name="first">
          <el-alert title="客户购买商品的数量" type="info" center show-icon :closable="false">
          </el-alert>
          <el-row :gutter="20">
            <el-col :span="20" :offset="5">
              <!-- 2. 为ECharts准备一个具备大小（宽高）的Dom -->
              <div id="main" style="width: 750px;height: 600px;margin-top: 10px"></div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="性别比例" name="second">
          <el-alert title="客户购买商品的性别比例" type="info" center show-icon :closable="false">
          </el-alert>
          <el-row :gutter="20">
            <el-col :span="20" :offset="5">
              <!-- 2. 为ECharts准备一个具备大小（宽高）的Dom -->
              <div id="noMain" style="width: 750px;height: 600px;margin-top: 10px"></div>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>

export default {
  data () {
    return {
      activeName: 'first'
    }
  },
  mounted () {
    var echarts = require('echarts')
    // 3. 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    var youChart = echarts.init(document.getElementById('noMain'))
    // 指定图表的配置项和数据
    var option = {
      legend: {
        top: 'bottom'
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      series: [
        {
          name: '面积模式',
          type: 'pie',
          radius: [50, 250],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 8
          },
          data: [
            { value: 40, name: '女装' },
            { value: 38, name: '女鞋' },
            { value: 32, name: '男鞋' },
            { value: 30, name: '箱包' },
            { value: 28, name: '男装' },
            { value: 26, name: '美妆' },
            { value: 22, name: '家居' },
            { value: 18, name: '厨具' }
          ]
        }
      ]
    }
    var noOption = {
      tooltip: {},
      legend: {
        data: ['男性', '女性']
      },
      radar: {
        // shape: 'circle',
        name: {
          textStyle: {
            color: '#fff',
            backgroundColor: '#999',
            borderRadius: 3,
            padding: [3, 5]
          }
        },
        indicator: [
          { name: '女装', max: 6500 },
          { name: '女鞋', max: 16000 },
          { name: '男鞋', max: 30000 },
          { name: '箱包', max: 38000 },
          { name: '男装', max: 52000 },
          { name: '美妆', max: 25000 }
        ]
      },
      series: [{
        type: 'radar',
        // areaStyle: {normal: {}},
        data: [
          {
            value: [4300, 10000, 28000, 35000, 50000, 19000],
            name: '男性'
          },
          {
            value: [5000, 14000, 28000, 31000, 42000, 21000],
            name: '女性'
          }
        ]
      }]
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
    youChart.setOption(noOption)
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
