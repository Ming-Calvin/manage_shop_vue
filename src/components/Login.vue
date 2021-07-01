<template>
  <div class="container">
    <div class="box">
      <div class="portrait">
        <!-- 头像区 -->
        <img src="https://calvin-typora-image.oss-cn-hangzhou.aliyuncs.com/img/20210429183739.jpg" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form :model="loginForm" ref="loginFormRef" :rules="loginFormRules" label-width="0px" class="form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-key" show-password></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <div class="btns">
          <el-button type="primary" @click="loginIn">登录</el-button>
          <el-button type="danger"  @click="dialogVisible = true">注册</el-button>
        </div>
      </el-form>
    </div>
    <el-dialog
      title="注册账号"
      :visible.sync="dialogVisible"
      width="50%"
      @close="editDialogClosed"
      center>
      <el-form ref="registerFormRef" :model="registerForm" label-width="80px" :rules="registerFormRules">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" clearable></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" clearable show-password></el-input>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="registerForm.phone" clearable></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="btns">
          <el-button :plain="true" @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" :plain="true" @click="register">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ]
      },
      registerForm: {
        username: '',
        password: '',
        phone: '',
        email: ''
      },
      registerFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在3~10之间', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      userList: []
    }
  },
  methods: {
    // 登入函数（查找是否存在用户名，若存在再校验密码）
    async loginIn () {
      const { data: res } = await this.$http.get('logins', {
        params: {
          username: this.loginForm.username
        }
      })
      if (res.data.length === 0) {
        return this.$message.error('暂无用户名')
      }
      if (res.data[0].password !== this.loginForm.password) {
        return this.$message.error('密码错误')
      }
      await this.$router.push('/home')
      this.$message.success('登入成功')
    },
    // 注册函数（查找是否存在用户名，若不存在则添加至数据库）
    async register () {
      // 是否所有校验函数都通过
      this.$refs.registerFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.get('logins', {
          params: {
            username: this.registerForm.username
          }
        })
        if (res.data.length !== 0) {
          return this.$message.error('已存在用户名')
        }
        // 可以发起添加用户的网络请求
        const { data: result } = await this.$http.post('logins', this.registerForm)
        this.dialogVisible = false
        for (var i in result) { // 如果不为空，则会执行到这一步，返回true
          return this.$message.success('注册成功')
        }
        return this.$message.error('注册失败')
      })
    },
    // 监听注册用户对话框的关闭事件
    editDialogClosed () {
      this.$refs.registerFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  background-color: pink; /* 不支持线性的时候显示 */
  background-image: linear-gradient(to bottom right, #a3bbb1 , #36b8e9);
  height: 100%;
}
.box {
  width: 500px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.portrait {
  height: 130px;
  width: 130px;
  border: 1px solid #eeeeee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
  background-color: #fff;
  img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.form {
  position: absolute;
  top: 100px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
