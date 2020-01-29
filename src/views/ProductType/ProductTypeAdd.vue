<template>
  <div class="producttype-add">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>商品分类增加</h3>
      </div>
      <el-form
        :model="productTypeAddForm"
        status-icon
        :rules="rules"
        ref="productTypeAddForm"
        label-width="120px">
      <!--el-input-number: 事件 @change="handleChange" 绑定值被改变时触发	回调参数currentValue, oldValue  -->
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="productTypeAddForm.name" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item label="分类序号" prop="order">
            <el-input-number v-model="productTypeAddForm.order" controls-position="right"  :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="商品分类描述" prop="desc">
          <el-input type="textarea" :rows="3" v-model="productTypeAddForm.desc" autocomplete="on"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script> 
import {productTypeAdd} from '@/api/productType.js'
export default {
  data() {
    return {
      productTypeAddForm: {
        name: "",
        order: "",
        desc:""
      },
      rules: {
          name:[
          { required: true, message: "分类名称", trigger: "blur" },
          { min: 2, max: 6, message: "长度在 2 到 6 个字符", trigger: "blur" }
        ],
        desc:[ { required: true, message: "商品分类描述必填", trigger: "blur" }]
      }
    };
  },
  methods: {
      submitForm() {
         this.$refs.productTypeAddForm.validate((valid) => {
          if (valid) {
            productTypeAdd(this.productTypeAddForm).then(data => {
              if(data.success){
                this.$message({
                  type:"success",
                  showClose:true,
                  message:data.message,
                  duration:1000,
                  onClose:()=>{
                   this.$router.push('/home/producttype-list')
                  }
                })
              }else{
                this.$message.error(data.message)
              }
            }); 
          } else {
            this.$message.error("添加失败")
            return false;
          }
        });
    },
    resetForm() {
        this.$refs.productTypeAddForm.resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.producttype-add {
  /deep/.el-card__header {
    padding-top: 0px;
    padding-bottom: 0px;
  }
  .el-form {
    width: 60%;
  }
}
</style>