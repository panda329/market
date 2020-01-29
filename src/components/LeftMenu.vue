<template>
  <div class="left-menu">
      <!-- router:  自动开启二级路由跳转，index为跳转地址
           default-active:  默认激活状态，需要是个变量,跳转到那个页面刷新后还是这个标题被激活;使用this.$route.path。标签内this可以省略
       -->
    <el-menu
      background-color="#2D3A4B"
      text-color="#ccc"
      active-text-color="#358CD6"
      :collapse="menuOpen.isCollapse"
      :collapse-transition="false"
      router
      :default-active="$route.path">
      <h3>{{menuOpen.title}}</h3>
      <!-- 动态渲染菜单页 -->
      <!-- 因为权限问题需展示不同板块，但v-for和v-if不能一起使用， 则采用计算属性直接过滤需要循环的菜单-->
      <template v-for="menu in filterList">
        <el-menu-item v-if="!menu.children" :index="menu.index" :key="menu.id">
          <i :class="menu.cls"></i>
          <!-- 加了这个title才可以实现收缩 -->
          <span slot="title">{{menu.title}}</span>
        </el-menu-item>
        <el-submenu v-else :index="menu.index" :key="menu.id">
          <template slot="title">
                <i :class="menu.cls"></i>
                <span slot="title">{{menu.title}}</span>
          </template>
          <el-menu-item v-for="item in menu.children" :key="item.index" :index="item.index">
                {{item.name}}
          </el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import {getRole} from '@/api/index.js'
export default {
  data() {
    return {
      menuOpen: {
        //子菜单收缩功能
        isCollapse: false,
        iconType: "el-icon-s-fold",
        title:"超市系统平台中心"
      },
      // 动态菜单创建
      menulist: [
        {
          id: 1,
          index: "/home/dashboard",
          cls: "el-icon-s-cooperation",
          title: "首页",
          role:[1,2]//表示1和2类型的管理员都可以看到
        },
        {
          id: 2,
          index: "2",
          cls: "el-icon-menu",
          title: "商品分类管理",
          role:[1],
          children: [
            { index: "/home/producttype-list", name: "商品分类列表" },
            { index: "/home/producttype-add", name: "添加商品分类" }
          ]
        },
        {
          id: 3,
          index: "3",
          cls: "el-icon-s-goods",
          title: "商品管理",
          role:[1,2],
          children: [
            { index: "/home/product-list", name: "商品列表" },
            { index: "/home/product-add", name: "添加商品" }
          ]
        },
        {
          id: 4,
          index: "4",
          cls: "el-icon-s-custom",
          title: "账号管理",
          role:[1],
          children: [
            { index: "/home/account-list", name: "账号列表" },
            { index: "/home/account-add", name: "增加账号" },
            { index: "/home/passwordchange", name: "修改密码" }
          ]
        },
        {
          id: 5,
          index: "5",
          cls: "el-icon-s-data",
          title: "统计管理",
          role:[1],
          children: [
            { index: "/home/sta", name: "销售统计" },
            { index: "/home/stocksta", name: "进货统计" }
          ]
        },
        {
          id: 6,
          index: "6",
          cls: "el-icon-s-tools",
          title: "菜单管理",
          role:[1],
          children: [
            { index: "/home/menulist", name: "菜单列表" },
            { index: "/home/menuadd", name: "添加菜单" }
          ]
        }
      ],
      //登录后获取用户的类型
      role:2,//默认普通员工
    };
  },
  mounted() {
    this.bus.$emit("menuinfo", this.menuOpen); //传给RightHead组件
  },
  created(){
    getRole().then(data => {
        this.role = data.role;  
    });
  },
  computed:{
    filterList(){
      let arr =[];
      arr = this.menulist.filter( v =>{
          return v.role.includes(this.role)
      })
      return arr;
    }
  }
};
</script>

<style lang="less" scoped>
.left-menu {
  .el-menu {
    border: none;
  }
}
</style>