<template>
  <div class="personal">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>个人中心</span>
      </div>
      <div>
        <p>
          id :
          <span>{{accountInfo.id}}</span>
        </p>
        <el-divider></el-divider>
        <p>
          姓名：
          <span>{{accountInfo.username}}</span>
        </p>
        <el-divider></el-divider>
        <p>
          邮箱：
          <span>{{accountInfo.email}}</span>
        </p>
        <el-divider></el-divider>
        <p>
          用户类型：
          <span>{{accountInfo.role === 1?'超级管理员':'普通管理员'}}</span>
        </p>
        <el-divider></el-divider>
        <p>
          创建时间：
          <span>{{accountInfo.inputtime | formatDate}}</span>
        </p>
        <el-divider></el-divider>
        <div class="accountAvatar">
          <span>用户头像：</span>
          <el-upload
            class="avatar-uploader"
            :action="uploadAvatarUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-button style="margin-left:20px;" type="primary" @click="editAvatar" size="mini">修改头像</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAccountInfo, uploadAvatarUrl, avatarDir,avatarEdit} from "@/api/index.js";
import moment from "moment";
export default {
  data() {
    return {
      //头像请求地址
      uploadAvatarUrl,
      //头像储存地址
      avatarDir,
      accountInfo: {
        id: "",
        username: "",
        email: "",
        role: "",
        inputtime: "",
        avatar: ""
      }
    };
  },
  methods: {
    handleAvatarSuccess(v) {
      if (v.success) {
        this.accountInfo.avatar = v.fileName;
      }
    },
    editAvatar(){
        const params = {
            token:localStorage.getItem('token'),
            avatar:this.accountInfo.avatar
        }
        avatarEdit(params).then(data => {
        if (data.success) {
            this.$message({
            type: "success",
            message: data.message,
            duration:1000,
            onClose:()=>{
             // 提示成功界面关闭时
             // 全局头像更新
             this.bus.$emit('avatarShow', this.imageUrl)  // 把计算属性的结果： 完整地址传过去
            }
            });
          } else {
            this.$message.console.error(data.message);
          }
        })
    }
  },
  created() {
    getAccountInfo().then(data => {
        // Object.assign(this.accountInfo,data.accountInfo)
      this.accountInfo = data.accountInfo;
    });
  },
  filters: {
    formatDate(v) {
      return moment(v).format("YYYY-MM-DD hh:mm:ss");
    }
  },
  computed: {
    imageUrl() {
      if (this.accountInfo.avatar) {
        return avatarDir + this.accountInfo.avatar;
      } else {
        return "";
      }
    }
  }
};
</script>

<style lang="less" scoped>
.personal {
  p {
    margin: 0px;
  }
  .accountAvatar {
    display: flex;
    align-items: center;
    /deep/.avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    /deep/.avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    .avatar {
      width: 100px;
      height: 100px;
      display: block;
    }
  }
}
</style>