<template>
  <div class="product-list">
    <!-- expand-row-keys: 可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。
          row-key:行数据的 Key，用来优化 Table 的渲染；
          事件：
          expand-change 当用户对某一行展开或者关闭的时候会触发该事件
    -->
    <el-card>
      <div slot="header" class="card-title">
        <h3>商品列表</h3>
      </div>
      <el-form :inline="true" :model="searchForm" ref="searchForm">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="searchForm.name" placeholder="商品名称" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="起始价(元)" prop="priceStart">
          <el-input-number v-model="searchForm.priceStart" :min="1" label="描述文字" size="mini"></el-input-number>
        </el-form-item>
        <el-form-item label="结束价(元)" prop="priceEnd">
          <el-input-number v-model="searchForm.priceEnd" :min="1" label="描述文字" size="mini"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch" size="mini">查询</el-button>
          <el-button type="success" @click="doreset" size="mini">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        style="width: 100%"
        ref="listtable"
        highlight-current-row
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        @expand-change="toggle"
        height="380"
      >
        <el-table-column type="expand" label="详情展开" width="80px">
          <template slot-scope="props">
            <el-form label-position="left" inline class="expand-form">
              <el-form-item label="商品名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="商品特色">
                <span>{{ props.row.feature | formatfeature}}</span>
              </el-form-item>
              <el-form-item label="商品ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="是否促销">
                <span>{{ props.row.isPromotion}}</span>
              </el-form-item>
              <el-form-item label="商品单价(元)">
                <span>{{ (props.row.price).toFixed(2) }}</span>
              </el-form-item>
              <el-form-item label="商品包装费(元)">
                <span>{{ (props.row.packingexpense).toFixed(2) }}</span>
              </el-form-item>
              <el-form-item label="商品描述">
                <span>{{ props.row.desc }}</span>
              </el-form-item>
              <el-form-item label="商品图片">
                <span>
                  <img :src="uploadDir+props.row.imageUrl" class="daily-img" />
                </span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="商品ID" prop="id" width="80px"></el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column label="描述" prop="desc"></el-table-column>
        <el-table-column label="录入时间" prop="inputtime" :formatter="formatdate"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑弹出框 -->
      <el-dialog title="商品修改" :visible.sync="edit">
        <el-form
          :model="editForm"
          :rules="rules"
          ref="editForm"
          label-width="100px"
          class="edit-form">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="editForm.name" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-select v-model="editForm.category" placeholder="请选择分类项" size="mini">
              <el-option  v-for="item in typeList" :key="item.id" :label="item.name" :value="item.name"></el-option>
              <!-- <el-option label="热菜" value="热菜"></el-option>
              <el-option label="甜品" value="甜品"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="商品特色" prop="feature">
            <el-checkbox-group v-model="editForm.feature">
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
              on-success	文件上传成功时的钩子 -->
            <el-upload :action="productUpload" :show-file-list="false" :on-success="doUpload">
              <img v-if="imageUrl" :src="imageUrl" class="product" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="是否促销" prop="isPromotion">
            <el-radio-group v-model="editForm.isPromotion">
              <el-radio label="促销"></el-radio>
              <el-radio label="不促销"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="包装费(元)" prop="packingexpense">
            <el-input-number size="mini" v-model="editForm.packingexpense" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="价格(元)" prop="price">
            <el-input-number size="mini" v-model="editForm.price" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="商品描述" prop="desc">
            <el-input type="textarea" v-model="editForm.desc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">  
          <el-button type="primary" @click="save">确 定</el-button>
          <el-button @click="edit = false">取 消</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  productList,
  productDel,
  productSearch,
  uploadDir,productUpload,productEdit} from "@/api/product.js";
import {productTypeList} from '@/api/productType.js'
import moment from "moment";
export default {
  data() {
    return {
      //动态商品分类下拉数据
      typeList:[],
      //列表数据
      tableData: [],
      //属性中返回的回调函数返回该行的唯一性key值，以方便找到这行数据
      getRowKeys(row) {
        return row.id;
      },
      //接收那些需要暂开的数据关键key
      expands: [],
      //编辑修改表单
      editForm: {
        id: 18,
        name: "麻婆豆腐22",
        category: "熟食",
        feature: "",
        imageUrl:"",
        isPromotion: "不促销",
        price: 12,
        packingexpense: 3,
        desc: "来自记忆中味道"
      },
      edit: false,
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
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      },
      //图片请求地址
      productUpload
      ,
      //图片储存地址
      uploadDir,
      //搜索表单
      searchForm: {
        name: "",
        priceStart: 1,
        priceEnd: 1
      }
    };
  },
  methods: {
    //编辑修改函数
    handleEdit(index, row) {
      this.edit = true;
      this.editForm = Object.assign({}, row);
      this.editForm.feature = JSON.parse(row.feature);
    },
    handleDelete(index) {
      const that = this;
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          productDel(this.tableData[index].id).then(data => {
            if (data.success) {
              this.$message({
                type: "success",
                message: data.message,
                duration: 1000,
                onClose() {
                  //这里是es5在对象里面函数的增强写法，所以里面的this无法指向Vue示例是undefined；解决1：变为箭头函数 此处使用的第二种方式解决在全局挂变量
                  productList().then(data => (that.tableData = data));
                }
              });
            } else {
              this.$message.error(data.message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //图片请求成功的回调函数
    doUpload(res){
      if(res.success){
        this.editForm.imageUrl = res.fileName;
      }
    },
    //切换函数
    toggle(row) {
      if (this.expands.length > 0) {
        //第一次点击时expands为空所以就是走的else
        const oldId = this.expands[0]; //第二次点击时，expands数组中已经有值，就先定义这个旧值
        if (oldId !== row.id) {
          //作比较，如果不相等
          this.expands = []; //清空所有
          this.expands.push(row.id); //展开新的行内容
        } else {
          //否则在展开的哪行再点击关闭时；作比较两行的内容一致，就走以下else；清空所有，则表格所有行内容关闭
          this.expands = [];
        }
      } else {
        this.expands.push(row.id);
      }
    },
    //优化时间格式
    formatdate(row, column, cellValue) {
      return moment(cellValue).format("YYYY-MM-DD hh:mm:ss");
    },
    //表单查询和重置
    doSearch() {
      productSearch(this.searchForm).then(data => {
        this.tableData = data;
      });
    },
    doreset() {
      this.$refs.searchForm.resetFields();
      if (this.searchForm.name === "") {
        productList().then(data => (this.tableData = data));
      }
    },
    //保存修改
    save(){
      this.editForm.feature = JSON.stringify(this.editForm.feature);
      productEdit(this.editForm).then(data =>{
        if(data.success){
          this.edit = false
          this.$message({
            type:'success',
            duration:1000,
            message:data.message,
            onClose:()=>{
               productList().then(data => this.tableData = data);
            }
          })
        }else{
          this.$message.error(data.message)
        }
      });
    }
  },
  created() {
    productList().then(data => this.tableData = data);
    productTypeList().then(data => this.typeList = data);
  },
  filters: {
    formatfeature(v) {
      if (v) {
        return JSON.parse(v).join("、");
      }
    }
  },
  computed:{
    imageUrl(){
      return uploadDir + this.editForm.imageUrl
    }
  }
};
</script>

<style lang="less" scoped>
.product-list {
  .card-title {
    & > h3 {
      margin: 0px;
    }
  }
  .el-table {
    .daily-img {
      width: 100px;
      height: 100px;
      border:1px dashed #ccc;
      box-sizing:border-box;
      border-radius: 5px;
    }
  }
  .expand-form {
    margin-right: 0;
    margin-bottom: 0;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .el-form-item {
      width: 45%;
      margin-bottom: 0;
      /deep/.el-form-item__label {
        color: #99a9bf;
      }
    }
  }
  .el-dialog {
    .edit-form {
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
            width:120px;
            height:120px;
            line-height:120px;
            text-align: center;
            }
            .product {
            width: 120px;
            height: 120px;
            display: block;
            }
        } 
      }
      .el-form-item {
        margin-bottom: 10px;
        /deep/.el-form-item__error {
          margin-top: -2px;
        }
      }
    }
  }
}
</style>