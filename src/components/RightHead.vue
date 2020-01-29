<template>
  <div class="right-head">
    <el-row type="flex" class="row-bg" justify="space-between" align="middle">
      <el-col :span="1">
        <div class="grid-content bg-purple">
          <span class="menu-btn" @click="menuopen">
            <i :class="menuinfo.iconType"></i>
          </span>
        </div>
      </el-col>
      <el-col :span="11">
        <div class="breadcrumb">
          <!-- :to="{ path: '' }"跳转地址 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path:'/home/dashboard'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="v in breadcrumbList" :key="v.title">{{v.title}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content head-left">
          <p class="head-left-info">
            欢迎登陆
            <span>{{username}}</span>
          </p>
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="left-dropmenu">
              <el-avatar
                :src="imageUrl"
                fit="fill"
              ></el-avatar>
              <i class="el-icon-arrow-down"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="person">个人中心</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { dologout,getAccountInfo,avatarDir} from "@/api/index.js";
export default {
  data() {
    return {
      menuinfo: "",
      asideWidth: "200px",
      username: "",
      //面包屑列表
      breadcrumbList: [],
      //接收头像地址
      imageUrl:""
    };
  },
  methods: {
    menuopen() {
      //子菜单收缩功能
      if (!this.menuinfo.isCollapse) {
        this.menuinfo.isCollapse = true;
        this.asideWidth = "65px";
        this.menuinfo.iconType = "el-icon-s-unfold";
      } else {
        this.menuinfo.isCollapse = false;
        this.asideWidth = "200px";
        this.menuinfo.iconType = "el-icon-s-fold";
      }
      this.$emit("menuinfo", this.asideWidth);
    },
    //头部下拉菜单点击事件
    handleCommand(command) {
      switch (command) {
        case "logout":
          dologout(localStorage.getItem("token")).then(data => {
            if (data.success) {
              localStorage.removeItem("token");
              localStorage.setItem("username", "");
              this.$router.replace("/login");
            } else {
              this.message.error(data.message);
            }
          });
          break;
        case "person":
          this.$router.replace("/home/personal");
          break;
      }
      // if (command === "logout") {
      //   dologout(localStorage.getItem("token")).then(data => {
      //     if (data.success) {
      //       localStorage.removeItem("token");
      //       localStorage.setItem("username", "");
      //       this.$router.replace("/login");
      //     } else {
      //       this.message.error(data.message);
      //     }
      //   });
      // }
    }
  },
  created() {
    this.bus.$on("menuinfo", value => {
      this.menuinfo = value;
    });
    //个人中心点击修改头像就回显
    this.bus.$on('avatarShow',v =>{
      this.imageUrl = v;
    });
    //针对一刷新就获取头像
    getAccountInfo().then(data =>{
      if(data.accountInfo.avatar === null){
        this.imageUrl = avatarDir + 'admin-1577453304175.jpg';
      }else{
        this.imageUrl =avatarDir + data.accountInfo.avatar;
      }  
    })
    this.username = localStorage.getItem("username");
    //针对面包屑：页面一刷新获取当前标题或地址
    const currentTitle = { title: this.$route.meta.title };
    this.breadcrumbList.push(currentTitle);
    if (this.$route.path == "/home/dashboard") {
      this.breadcrumbList = [];
    }
  },
  watch: {
    $route(v) {
      let arr = [];
      if (v.path == "/home/dashboard") {
        this.breadcrumbList = arr;
      } else {
        arr.push({
          title: v.meta.title
        });
        this.breadcrumbList = arr;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.right-head {
  height: 100%;
  .el-row {
    height: 100%;
    .el-col {
      .menu-btn {
        display: inline-block;
        width: 100%;
        // height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        &:hover {
          cursor: pointer;
          background: #2d3a4b;
        }
      }
      .breadcrumb {
        /deep/.el-breadcrumb__inner {
          color: #ccc;
        }
        // /deep/.is-link{
        //   color:#c1c5c9;
        //   cursor: pointer;
        // }
      }
      .head-left {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .head-left-info {
          font-size: 14px;
          padding-right: 20px;
          span {
            color: #358cd6;
          }
        }
        .el-dropdown {
          .left-dropmenu {
            margin-right: 10px;
            &:hover {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>