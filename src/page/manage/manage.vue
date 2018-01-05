<template>
    <div class="manage">
      <el-container direction="horizontal">
        <el-aside>
          <el-menu :default-active="menuActive" :unique-opened="true" background-color="#324057" text-color="#ffffff" active-text-color="#409EFF" router>
            <el-menu-item index="manage">
              <i class="fa fa-th-large"></i>
              <span class="title">首页</span>
            </el-menu-item>
            <el-submenu index="1">
              <template slot="title">
                <i class="fa fa-address-book"></i>
                <span class="title">个人信息</span>
              </template>
              <el-menu-item index="personal">
                个人中心
              </el-menu-item>
              <el-menu-item index="addPersonal">
                编辑个人信息
              </el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="fa fa-address-book"></i>
                <span class="title">商铺管理</span>
              </template>
              <el-menu-item index="storeList">
                商铺列表
              </el-menu-item>
              <el-menu-item index="addStore">
                添加商铺
              </el-menu-item>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="fa fa-address-book"></i>
                <span class="title">商品管理</span>
              </template>
              <el-menu-item index="goodsList">
                商品列表
              </el-menu-item>
              <el-menu-item index="addGoods">
                添加商品
              </el-menu-item>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="fa fa-address-book"></i>
                <span class="title">数据视图</span>
              </template>
              <el-menu-item index="dataView">
                数据视图
              </el-menu-item>
            </el-submenu>
            <el-submenu index="5">
              <template slot="title">
                <i class="fa fa-address-book"></i>
                <span class="title">信用记录</span>
              </template>
              <el-menu-item index="creditRecord">
                信用记录
              </el-menu-item>
            </el-submenu>
            <el-submenu index="6">
              <template slot="title">
                <i class="fa fa-address-book"></i>
                <span class="title">设置</span>
              </template>
              <el-menu-item index="setting">
                设置
              </el-menu-item>
            </el-submenu>
            </el-menu>
        </el-aside>
        <el-main>
          <el-container>
            <el-header height="56px">
              <el-row>
                <el-col :span="23">
                  <el-breadcrumb>
                    <el-breadcrumb-item>首页</el-breadcrumb-item>
                    <el-breadcrumb-item>活动管理</el-breadcrumb-item>
                    <el-breadcrumb-item>活动列表</el-breadcrumb-item>
                  </el-breadcrumb>
                </el-col>
                <el-col :span="1">
                  <el-dropdown>
      <span class="el-dropdown-link">
        <img class="header_img" :src="user_head_img" alt="">
      </span>
                    <el-dropdown-menu class="drop_down_img" slot="dropdown">
                      <el-dropdown-item>
                        <span @click="changeHeadImg">更换头像</span>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <span @click="quit">退出</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </el-header>
            <el-main>
              <div class="main">
                <router-view></router-view>
              </div>
            </el-main>
          </el-container>
        </el-main>
      </el-container>
      <el-dialog title="更换头像" :visible.sync="dialogVisible" :before-close="handlerClose">
        <div>
          <el-upload class="avatar-uploader" name="avatar" :action="BASEIMGURL+'/seller/upload/avatar'" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="avatar" :src="avatar" class="avatar">
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
          </el-upload>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handlerClose">关 闭</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
  import { quit } from '../../axios/initData'
  import { mapState } from 'vuex'
  import { BASEIMGURL } from "../../config/env";
    export default {
      name: "manage",
      data(){
        return {
          avatar:'',
          dialogVisible:false,
          BASEIMGURL
        }
      },
      computed:{
        ...mapState(['user_head_img']),
        menuActive(){
          return this.$route.path.replace('/', '');
        }
      },
      methods:{
        handlerClose(){
          this.dialogVisible = false;
        },
        handleAvatarSuccess(res,file){
          if(!res.status){
            this.avatar = URL.createObjectURL(file.raw);
            this.$message({
              message:'上传成功',
              type:'success'
            })
          }else{
            this.$message({
              message:'上传失败',
              type:'error'
            })
          }
        },
        beforeAvatarUpload(file){
          const isJPG = file.type === 'image/jpeg';
          const isPNG = file.type === 'image/png';
          const isLt2M = file.size / 1024 / 1024 < 2;

          if (!isJPG && !isPNG) {
            this.$message.error('上传头像图片只能是 JPG 和 PNG 格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
          }
          return isJPG || isPNG && isLt2M;
        },
        changeHeadImg(){
          this.dialogVisible = true;
        },
        quit(){
          quit().then((response)=>{
            let res = response.data;
            if(!res.status){
              this.$router.push('/');
              this.$message({
                message:'退出成功',
                type:'success'
              })
            }else{
              this.$message({
                message:'退出失败',
                type:'warning'
              })
            }
          })
        }
      }
    }
</script>

<style lang="scss">
.manage{
  width: 100%;
  height: 100%;
  .el-container{
    height: 100%;
  }
  .el-aside{
    background-color: #324057;
    color: #fff;
  }
  .el-main{
    padding: 0;
  }
  .el-menu{
    border: none;
  }
  .is-active{
    background-color: rgb(40, 51, 70)!important;
  }
  .el-header{
    box-shadow: 0 2px 2px #C0C4CC;
    .el-breadcrumb{
      line-height: 56px;
      height: 56px;
    }
    .header_img{
      width: 50px;
      height: 50px;
      margin-top: 3px;
      border-radius: 50%;
    }
  }
  .main{
    padding: 20px;
  }
}
.drop_down_img{
  box-shadow: 0 0 5px #000000!important;
}

.avatar-uploader{
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409EFF;
    }
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
