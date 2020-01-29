<template>
  <div class="account-pwd-change">
    <el-card class="box-card">
      <div slot="header">
        <span>密码修改</span>
      </div>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input type="password" v-model="ruleForm.oldPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="ruleForm.newPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { dochangePwd } from "@/api/account.js";
export default {
  data() {
    //密码验证
    const checkpass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    const checkpassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (this.ruleForm.newPassword !== value) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        token: "",
        oldPassword: "",
        newPassword: "",
        checkPass: ""
      },
      rules: {
        oldPassword: [
          { trigger: "blur", required: true, message: "请输入原密码" }
        ],
        newPassword: [
          { validator: checkpass, trigger: "blur", required: true }
        ],
        checkPass: [
          { validator: checkpassword, trigger: "blur", required: true }
        ]
      }
    };
  },
  methods: {
    submitForm(){
      // const vm =this;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.ruleForm.token = localStorage.getItem('token');
          dochangePwd(this.ruleForm).then(data => {
            if (data.success) {
              localStorage.setItem("token", "");
              this.$message({
                message: data.message,
                type: "success",
                duration: 500,
                showClose: true,
                onClose: () => {
                  this.$router.replace("/login");
                }
              });
            }else{
              this.$message.error(data.message)
            }
          });
        }else{
              this.$message.error('修改失败')
        }
        
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.account-pwd-change {
  .el-form {
    width: 60%;
  }
}
</style>