<template>
  <div class="account-list">
    <!--
        el-table=>
        data:  表格数据
        label：表格的标题名
        prop：对应列内容的字段名，也可以使用 property 属性
        el-table-column=>
        formatter	用来格式化内容	Function(row, column, cellValue, index)
    -->
    <el-card>
      <div slot="header" class="card-head">
        <h3>账号列表</h3>
      </div>
      <!--用户查询组件
        el-form属性
          inline : 表单变为行内块横着排
        -->
      <el-form :inline="true" :model="page" class="search-form" ref="searchForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="page.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="role">
          <el-select v-model="page.role" placeholder="用户角色">
            <el-option label="超级管理员" :value="1"></el-option>
            <el-option label="普通管理员" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dosearch">查询</el-button>
          <el-button type="success" @click="doreset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="AccountList" style="width: 100%" max-height="400" stripe>
        <el-table-column type="selection" width="45"></el-table-column>
        <el-table-column prop="username" label="账号名"></el-table-column>
        <el-table-column prop="role" label="用户组" :formatter="formatrole"></el-table-column>
        <el-table-column prop="inputtime" label="创建日期" :formatter="formatdate"></el-table-column>
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
        :current-page="page.currentPage"
        :page-sizes="[2, 5]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange" 
        :page-size="page.pageSize"
        layout="total,prev, pager, next,sizes,jumper"
        :total="page.total"
      ></el-pagination>
      <el-dialog title="账号修改" :visible.sync="edit" :show-close="false">
        <el-form :model="editForm" status-icon :rules="rules" ref="editForm" label-width="100px">
          <el-form-item label="账号" prop="username">
            <el-input v-model="editForm.username" autocomplete="on"></el-input>
          </el-form-item>
          <el-form-item label="用户角色" prop="role">
            <el-select v-model="editForm.role" placeholder="请选择用户角色类型">
              <el-option label="普通管理员" :value="2"></el-option>
              <el-option label="超级管理员" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="edit = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="账号删除" :visible.sync="accdelete">
        <p>确认是否需要删除</p>
        <div slot="footer" class="dialog-footer">
          <el-button @click="accdelete = false">取 消</el-button>
          <el-button type="primary" @click="del">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
//引入已经配置好的接口请求
//如果有分页功能，那么accountList这个请求可以省略，利用分页刷新页面
// import { accountList, accountEdit, accountDel,accountSearch} from "@/api/account.js";
import { accountPage, accountEdit, accountDel} from "@/api/account.js";
import moment from "moment";
export default {
  data() {
    return {
      //用户列表
      AccountList: [],
      //用户编辑
      edit: false,
      accdelete: false,
      editForm: {
        id: "",
        username: "",
        role: ""
      },
      rules: {
        username: [
          {required: true,  message: "账户名", trigger: "blur" },
          { min: 2, max: 6, message: "长度在 2 到 6 个字符", trigger: "blur" }
        ],
        role: [{required: true,  message: "请选择角色类型", trigger: "change" }]
      },
      id: "",
      //查询表单
      // searchForm:{
      //   username:"",
      //   role:""
      // },
      //分页数据
      page:{
        total:0,
        pageSize:2,
        currentPage:1,
        username:"",
        role:""
      }
    };
  },
  methods: {
    handleEdit(row) {
      this.edit = true;
      // this.editAcountForm = row; // 引用传递，会有问题！！
      this.editForm = Object.assign({}, row); // 拷贝传递即可
    },
    handleDelete(index) {
      this.accdelete = true;
      const id = this.AccountList[index].id;
      this.id = id;
    },
    //分页函数
     handleSizeChange(val) {//点击每条/页的时候返回当前50
      this.page.pageSize = val;
      this.page.currentPage=1;//以免切换页面显示条数多时，不返回第一页，用户当前页面显示空
       accountPage(this.page).then(data => {
        this.AccountList =  data.data
        this.page.total = data.total;
    });
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;//点击时页码发生改变的时候会触发返回	当前页码
       accountPage(this.page).then(data => {
        this.AccountList =  data.data
        this.page.total = data.total;
    });
    },
    save() {
      //保存修改内容
      this.$refs.editForm.validate(valid => {
        if (valid) {
          //不必要的email不提交给后台，但是在eidtForm里面，以下为处理方式，处理完后传给后台则为接口所需参数
          //方式一
          // const {id,username,role} = this.editForm;//解构方法es6
          // const params = {
          //   id,
          //   username,
          //   role
          // }
          //方式二
          const params = Object.assign({},this.editForm);
          delete params.email;
          delete params.inputtime;
          accountEdit(params).then(data => {
            if (data.success) {
              this.$message({
                message: data.message,
                type: "success",
                duration: 500,
                showClose: true,
                onClose: () => {
                  this.edit = false;
                  accountPage(this.page).then(data => {
                    this.AccountList = data.data;
                  });
                }
              });
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
    del() {
      //删除数据
      accountDel(this.id).then(data => {
        if (data.success) {
          this.$message({
            message: data.message,
            type: "success",
            duration: 500,
            showClose: true,
            onClose: () => {
              this.accdelete = false;
              accountPage(this.page).then(data => {
                this.AccountList = data.data;
              });
            }
          });
        } else {
          this.$message.error(data.message);
        }
      });
    },
    formatrole(row, column, cellValue) {
      //格式化函数：cellValue是当前单元格的数据,row当前行的内容，当前列的内容，后面不确定可以console或者debugger
      if (cellValue === 1) {
        return (cellValue = "超级管理员");
      } else {
        return (cellValue = "普通管理员");
      }
    },
    formatdate(row, column, cellValue) {
      //格式化时间
      return moment(cellValue).format("YYYY-MM-DD hh:mm:ss");
    },
    //查询功能相关函数：查询和重置
    dosearch(){
      //   if(this.searchForm.username || this.searchForm.role){
      //       accountSearch(this.searchForm).then(data =>{
      //       this.AccountList = data;
      //     })
      //   }else{
      //     accountPage(this.page).then(data => {
      //       this.AccountList =  data.data
      //           this.page.total = data.total;
      //       });
      // }
      // this.page.username= this.searchForm.username;
      // this.page.role = this.searchForm.role;
      if(this.page.username || this.page.role){
          this.page.currentPage =1;
        accountPage(this.page).then(data => {
          this.AccountList  = data.data;
          this.page.total = data.total;
        })
      }
     
    },
    doreset(){
      this.page.currentPage =1;
      this.$refs.searchForm.resetFields()
      accountPage(this.page).then(data => {
          this.AccountList  = data.data;
          this.page.total = data.total;
      })
    }
  }, //以下为发送账号列表axios请求
  created() {
    accountPage(this.page).then(data => {
        this.AccountList =  data.data
        this.page.total = data.total;
    });
  }
};
</script>

<style lang="less" scoped>
.account-list {
  .el-card{
      /deep/.el-card__header {
      padding-top: 0px;
      padding-bottom: 0px;
    }
    .search-form{
      .el-button{
        height:30px;
        padding:0px 5px;
      }
      /deep/.el-input__inner{
          height:30px;
      }
    }
  }
 
}
</style>