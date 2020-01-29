<template>
  <div class="home">
    <el-container>
      <el-aside :width="asideWidth" class="out-div">
        <LeftMenu></LeftMenu>
      </el-aside>
      <el-container>
        <el-header height="50px">
          <RightHead @menuinfo="menuinfo"></RightHead>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer height="30px">
          <p>版权所有 © 你也说不懂你也不知道的公司</p>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import LeftMenu from "../components/LeftMenu"
import RightHead from "../components/RightHead"

export default {
  name: "home",
  data() {
    return {
      asideWidth:"200px"
    };
  },
  methods: {
    menuinfo(value){ //接收头部点击搜索框传来的参数
      this.asideWidth= value;
    }
  },
  components:{
     LeftMenu,
     RightHead
  }
};
</script>

<style lang="less" scoped>
.home {
  height: 100%;
  background: #ccc;
  & > .el-container {
    height: 100%;
    color: #ccc;
    .el-aside {
      background: #2D3A4B;
    }
    & > .el-container {
      .el-header {
        background:#272727;
        padding-left:0px;
      }
      .el-main{
        background:#f0eeee;
        color:#000;
      }
      .el-footer{
        background:#272727;
        text-align:center;
        font-size:14px;
        p{
          line-height:30px;
          margin:0px;
        }
      }
    }
  }
}
 .out-div {
    width: auto;
    height: 100%;
    background: #CCCCCC;
    -ms-overflow-style: none;
    overflow-y: auto;
    }
    .out-div::-webkit-scrollbar {
    width: 0px !important
    }
</style>