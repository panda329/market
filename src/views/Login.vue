<template>
  <div class="login">
    <!-- el-form中的属性：class="demo-ruleForm" -->
    <h3>ME超市管理系统</h3>
    <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm">
      <el-form-item prop="username">
        <el-input
          type="text"
          v-model="loginForm.username"
          autocomplete="off"
          prefix-icon="el-icon-user-solid"
          placeholder="用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="loginForm.password"
          autocomplete="off"
          show-password
          prefix-icon="el-icon-lock"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {dologin} from "@/api/index.js";
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "用户名", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm() {
      const loginForm = this.$refs.loginForm;
      loginForm.validate(valid => {
        if (valid) {
          dologin(this.loginForm).then(data => {
            if (data.success) {
              localStorage.setItem("token", data.token);
              localStorage.setItem('username',this.loginForm.username)
              this.$message({
                message: data.message,
                type: "success",
                duration: 500,
                onClose: () => {
                  this.$router.replace("/home/dashboard");
                }
              });
            } else {
              this.$message.error(data.message);
            }
          });
        } else {
          this.$message({
            message: "登录失败,请检查用户名",
            type: "error"
          });
          return false;
        }
      });
    }
  }
};
</script>



<style lang="less" scoped>
.login {
  height: 100%;
  background: #2d3a4b url(../assets/images/bglogin.jpg) no-repeat;
  background-size: 1400px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  & > h3 {
    color: #fff;
    margin-bottom: 35px;
  }
  .el-form {
    .el-form-item {
      .el-input {
        width: 400px;
        /deep/.el-input__inner {
          background: #2d3a4b;
          border: 1px solid hsla(0, 0%, 100%, 0.1);
          height: 45px;
          color: #fff;
        }
      }
      .el-button {
        width: 100%;
        color: #fff;
        background-color: #1890ff;
        border-color: #1890ff;
      }
    }
  }
}
</style>
