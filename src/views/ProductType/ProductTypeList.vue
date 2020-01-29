<template>
  <div class="producttype-list">
    <!--
        el-table=>
        data:  表格数据
        label：表格的标题名
        prop：对应列内容的字段名，也可以使用 property 属性
    -->
    <el-card>
      <div slot="header" class="card-head">
        <h3>商品分类列表</h3>
      </div>
      <el-form :inline="true" :model="page" ref="searchForm">
        <el-form-item label="商品分类名称" prop="name">
          <el-input size="mini" v-model="page.name" placeholder="商品分类名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="dosearch">查询</el-button>
          <el-button size="mini" @click="doreset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="ProductTypeList" style="width: 100%" max-height="400" stripe>
        <el-table-column prop="id" label="分类ID" width="80px"></el-table-column>
        <el-table-column prop="name" label="分类名称"></el-table-column>
        <el-table-column prop="order" label="分类序号"></el-table-column>
        <el-table-column prop="desc" label="描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row,scope.$index)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--page-size： 默认选择20条一页 
          page-sizes： [20, 50, 100, 200]数组内条数可选 
          @size-change="handleSizeChange" pageSize 改变时会触发 回调参数每页条数
          @current-change="handleCurrentChange" currentPage 改变时会触发 回调参数当前页
      -->
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="page.currentPage"
        :page-sizes="[2, 5, 10]"
        :page-size="page.pageSize"
        layout="total,prev,pager,next,sizes,jumper"
        :total="total"
      ></el-pagination>
      <el-dialog title="商品分类修改" :visible.sync="edit" :show-close="false">
        <el-form :model="editForm" status-icon :rules="rules" ref="editForm" label-width="100px">
          <el-form-item label="商品分类名称" prop="name">
            <el-input v-model="editForm.name" autocomplete="on"></el-input>
          </el-form-item>
          <el-form-item label="商品分类序号" prop="order">
            <el-input v-model="editForm.order" autocomplete="on"></el-input>
          </el-form-item>
          <el-form-item label="商品分类描述" prop="desc">
            <el-input type="textarea" :rows="3" v-model="editForm.desc" autocomplete="on"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="edit= false">取 消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  productTypePage,
  productTypeEdit,
  productTypeDel,
  // productTypeSearch
} from "@/api/productType.js";
export default {
  data() {
    const checkdescibe = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请填写商品描述"));
      } else {
        callback();
      }
    };
    return {
      ProductTypeList: [],
      //修改编辑表单
      edit: false,
      editForm: {
        id: "",
        desc: "",
        order: "",
        name: ""
      },
      rules: {
        desc: [{ validator: checkdescibe, trigger: "blur" }]
      },
      //分页对象数据;后台未返回总页条数
      page: {
        name: "",
        currentPage: 1,
        pageSize: 2
      },
      total:0
      //查询表单
      // searchForm: {
      //   name: ""
      // }
    };
  },
  methods: {
    handleEdit(row) {
      this.edit = true;
      this.editForm = Object.assign({}, row);
    },
    handleDelete(index) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          productTypeDel(this.ProductTypeList[index].id).then(data => {
            if (data.success) {
              this.$message({
                type: "success",
                message: data.message,
                duration: 1000,
                onClose: () => {
                  productTypePage(this.page).then(data => {
                    this.ProductTypeList = data;
                    this.total = data.total
                  });
                }
              });
            } else {
              this.$message.error(data.message);
            }
          });
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //分页相关函数
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.page.currentPage = 1;
      productTypePage(this.page).then(data => {
        this.ProductTypeList = data.data;
        this.total = data.total
      });
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      productTypePage(this.page).then(data => {
        this.ProductTypeList = data.data;
        this.total = data.total
      });
    },
    //修改相关函数
    save() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          productTypeEdit(this.editForm).then(data => {
            if (data.success) {
              this.$message.success(data.message);
              productTypePage(this.page).then(data => {
                this.ProductTypeList =data.data;
                this.total = data.total
              });
              this.edit = false;
            } else {
              this.$message.error(data.message);
            }
          });
        } else {
          this.$message.error("修改失败,请重新填写");
          return false;
        }
      });
    },
    //查询相关
    dosearch() {
      this.page.currentPage =1;
      productTypePage(this.page).then(data => {
        if (this.page.name) {
          this.ProductTypeList = data.data;
          this.total = data.total
        }
      });
    },
    doreset() {
      this.$refs.searchForm.resetFields();
      this.page.currentPage = 1;
      productTypePage(this.page).then(data => {
        this.ProductTypeList = data.data;
        this.total = data.total
      });
    }
  },
  created() {
    this.$nextTick(() => {
      productTypePage(this.page).then(data => {
        this.ProductTypeList = data.data;
        this.total = data.total
      });
    });
  }
};
</script>

<style lang="less" scoped>
.producttype-list {
  /deep/.el-card__header {
    padding-top: 0px;
    padding-bottom: 0px;
  }
}
</style>