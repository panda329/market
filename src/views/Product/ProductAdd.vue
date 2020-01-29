<template>
  <div class="product-add">
    <el-card class="box-card">
      <div slot="header">
        <h3>添加商品</h3>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="ruleForm.name" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="category">
          <el-select v-model="ruleForm.category" placeholder="请选择分类项" size="mini">
            <el-option v-for='item in typelist' :key='item.id' :label="item.name" :value="item.name"></el-option>
            <!-- <el-option label="热菜" value="recai"></el-option>
            <el-option label="甜品" value="cake"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="商品特色" prop="feature">
          <el-checkbox-group v-model="ruleForm.feature" size="mini">
            <el-checkbox label="新品上市" name="feature"></el-checkbox>
            <el-checkbox label="第二单半价" name="feature"></el-checkbox>
            <el-checkbox label="主打产品" name="feature"></el-checkbox>
            <el-checkbox label="火爆产品" name="feature"></el-checkbox>
            <el-checkbox label="祖传手艺" name="feature"></el-checkbox>
            <el-checkbox label="源自四川" name="feature"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="商品图片" prop="imageUrl" class="product-img">
          <!-- el-upload属性
              action 必选参数，上传的地址 相当于发送请求的地址
              on-success	文件上传成功时的钩子
           -->
          <el-upload
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="doUpload">
            <img v-if="imageUrl" :src="imageUrl" class="product" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="是否促销" prop="isPromotion">
          <el-radio-group v-model="ruleForm.isPromotion" size="mini">
            <el-radio label="促销"></el-radio>
            <el-radio label="不促销"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="包装费(元)" prop="packingexpense">
          <el-input-number v-model="ruleForm.packingexpense" size="mini" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="价格(元)" prop="price">
          <el-input-number v-model="ruleForm.price" size="mini" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="商品描述" prop="desc">
          <el-input type="textarea" size="mini" v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button size="mini" @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// uploadDir是图片存储在服务器的地址，uploadUrl是请求地址
import { productAdd,productUpload,uploadDir} from "@/api/product.js";
import { productTypeList } from "@/api/productType.js";
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        category: "",
        feature:[],
        isPromotion: "",
        desc: "",
        imageUrl: "",
        price: 1,
        packingexpense: 1
      },
      rules: {
        name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8个字符", trigger: "blur" }
        ],
        category: [
          { required: true, message: "请选择商品分类", trigger: "change" }
        ],
        feature: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个商品特色",
            trigger: "change"
          }
        ],
        isPromotion: [
          { required: true, message: "请选择是否促销", trigger: "change" }
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
        imageUrl:[
            { required: true, message: "至少上传一张图片", trigger: "change" }
        ]
      },
      //动态数据选择商品类型
      typelist:[],
      uploadUrl:productUpload
    };
  },
  methods: {
    submitForm(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.feature = JSON.stringify(this.ruleForm.feature)//转换json需要的格式
          productAdd(this.ruleForm).then(data => {
            if(data.success){
              this.$message({
                type:'success',
                duration:1000,
                message:data.message
              });
              this.ruleForm.feature =JSON.parse(this.ruleForm.feature)
            }else{
              this.$message.error(data.message)
            }
          })
        } else {
          this.$message.error('填写不符合规范，添加失败')
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //接收图片上传的请求
    doUpload(res){
      if(res.success){  
        this.ruleForm.imageUrl = res.fileName;
      }
    }
  },
  created(){
    productTypeList().then(data => {
      this.typelist = data;
    })
  },
  computed:{//计算属性封装服务器图片地址
    imageUrl(){
      if(this.ruleForm.imageUrl){ //方便返回数据库的数据imageUrl不是很长地址，只是图片名
        return uploadDir+this.ruleForm.imageUrl
      }else{
        return ""
      }
    }
  }
};
</script>

<style lang="less" scoped>
.product-add {
  .el-card {
    h3 {
      margin: 0px;
    }
    .el-form {
      width: 60%;
      .el-checkbox-group {
        display: flex;
        flex-wrap: wrap;
        .el-checkbox {
          width: 23%;
        }
      }
      .product-img {
        /deep/.el-upload {
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          &:hover{
            border-color: #409eff;
          }
            .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
            }
            .product {
            width: 178px;
            height: 178px;
            display: block;
            }
        }
        
      }
    }
  }
}
</style>