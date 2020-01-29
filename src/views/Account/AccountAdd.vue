<template>
  <div class="account-add">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>账号增加</span>
      </div>
      <el-form :model="accountAddForm" status-icon :rules="rules" ref="accountAddForm" label-width="100px">
        <el-form-item label="账号" prop="username">
          <el-input v-model="accountAddForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="accountAddForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="accountAddForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="role" fromat>
            <el-select v-model="accountAddForm.role" placeholder="请选择用户角色类型">
              <el-option label="普通管理员" :value="2"></el-option>
              <el-option label="超级管理员" :value="1"></el-option>
            </el-select>
        </el-form-item>    
        <el-form-item>
          <el-button type="primary" @click="submitForm">新增</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {accountAdd} from "@/api/account.js"//引入接口
export default {
  data() {
     const checkpass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.accountAddForm.checkPass !== '') {
            this.$refs.accountAddForm.validateField('checkPass');
          }
          callback();
        }
      };
      const checkPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.accountAddForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
      accountAddForm: {
        password: "",
        checkPass: "",
        username: "",
        role:""
      },
      rules: {
        username: [
          { required: true, message: "账户名", trigger: "blur" },
          { min: 2, max: 6, message: "长度在 2 到 6 个字符", trigger: "blur" }
        ],
        password: [//自定义规则中对象key值不能和定义的函数名一致;
        { validator: checkpass, trigger: 'blur',required:true}
        ],
        checkPass: [
        { validator: checkPassword, trigger: 'blur',required:true }
        ],
        role:[{required:true, message: "必选角色类型", trigger: "change"} ]
      }
    };
  },
  methods: {
    submitForm() {
         this.$refs.accountAddForm.validate((valid) => {
          if (valid) {
            accountAdd(this.accountAddForm).then(data => {
                if(data.success){
                  this.$message({
                  type:"success",
                  message:data.message,
                  duration: 1000,
                  showClose: true,
                  // onClose: () => {
                  //   this.$router.push('/home/account-list');
                  // }
                })
              }else{
                this.$message.error(data.message);
              }
             
            })
          //前台验证不合法以下 
          } else {
            this.$message.error('添加失败，不合法');
            return false;
          }
        });
    },
    resetForm() {
        this.$refs.accountAddForm.resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.account-add {
  .el-card {
    .el-form {
      width: 60%;
    }
  }
}
</style>