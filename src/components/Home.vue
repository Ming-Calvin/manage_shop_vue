<template>
  <el-container class="home-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <div class="togge-blutton" @click="toggeCollapse">
        <i class="el-icon-open"></i>
      </div>
      <!--侧边栏菜单区域-->
      <el-menu
        background-color= "#303133"
        text-color="#fff"
        active-text-color="#409EFF"
        :unique-opened="true"
        :collapse="isCollapse"
        :collapse-transition="false"
        :router="true"
        :default-active="activePath">
        <!--一级菜单-->
        <el-menu-item :index="item.path +''" v-for="item in menuList" :key="item.id">
          <!--图标-->
          <i :class="iconsObj[item.id]"></i>
          <!--文本-->
          <span>{{item.name}}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <!--头部区域-->
      <el-header>
        <div>
          <span>电商后台管理系统</span>
        </div>
        <el-button type="danger" @click="loginOut">
          退出
        </el-button>
      </el-header>
      <!--页面主体区-->
      <el-main>
        <!--路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      open: '打开',
      // 左侧菜单数据
      menuList: [],
      // 一级菜单图标
      iconsObj: {
        1: 'el-icon-goods',
        2: 'el-icon-medal',
        3: 'el-icon-box',
        4: 'el-icon-price-tag',
        5: 'el-icon-goods',
        6: 'el-icon-shopping-cart-2',
        7: 'el-icon-shopping-bag-1'
      },
      // 是否折叠
      isCollapse: true,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    loginOut () {
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      this.menuList = res.data
    },
    // 点击按钮切换菜单折叠与展开
    toggeCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: black;
  font-family: PingFang SC;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #303133;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #ebebeb;
}
.iconfont {
  margin-right: 10px;
}
.togge-blutton {
  background-color: #262a30;
  font-size: 20px;
  line-height: 35px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;    /*鼠标放上后变成小手*/
}
</style>
