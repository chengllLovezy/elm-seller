<template>
  <div class="add_store">
    <div class="form_box">
      <el-form ref="storeForm" :model="storeForm" :rules="storeRules" label-width="120px">
        <el-form-item label="商铺名称" prop="name">
          <el-input v-model="storeForm.name"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="storeForm.address"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="storeForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="店铺简介">
          <el-input v-model="storeForm.introduce"></el-input>
        </el-form-item>
        <el-form-item label="店铺标语">
          <el-input v-model="storeForm.slogan"></el-input>
        </el-form-item>
        <el-form-item label="店铺分类">
          <el-select v-model="storeForm.category">
            <el-option label="分类一" value="one"></el-option>
            <el-option label="分类二" value="two"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="店铺特点">
          <el-row>
            <el-col :span="6">
              <el-switch v-model="storeForm.tag01" inactive-text="蜂鸟配送"></el-switch>
            </el-col>
            <el-col :span="6">
              <el-switch v-model="storeForm.tag02" inactive-text="蜂鸟配送"></el-switch>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="配送费">
          <el-input-number v-model="storeForm.dispatch" controls-position="right" :min="0" :max="10"></el-input-number>
        </el-form-item>
        <el-form-item label="起送价">
          <el-input-number v-model="storeForm.sendPrice" controls-position="right" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="营业时间">
          <el-time-picker v-model="storeForm.startSaleTime" placeholder="起始时间"></el-time-picker>
          至
          <el-time-picker v-model="storeForm.endSaleTime" placeholder="结束时间"></el-time-picker>
        </el-form-item>
        <el-form-item label="上传店铺头像">
          <el-upload
            class="avatar-uploader"
            name="storeAvatar"
            ref="avatar"
            :action="BASEIMGURL+'/seller/upload/storeAvatar'"
            :show-file-list="false"
            :on-change="handleAvatarChange"
            :before-upload="beforeStoreHeaderImgUpload"
            :auto-upload="false">
            <img v-if="storeForm.avatar" :src="storeForm.avatar" class="avatar">
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="上传营业执照">
          <!--<el-upload
            class="avatar-uploader"
            :action="BASEIMGURL+'/seller/upload/storeBusiness'"
            ref="business"
            list-type="picture-card"
            name="storeBusiness"
            :show-file-list="false"
            :on-change="handleBusinessChange"
            :before-upload="beforeStoreHeaderImgUpload"
            :auto-upload="false">
            <i class="el-icon-plus"></i>
          </el-upload>-->
          <el-upload
            ref="business"
            :action="BASEIMGURL+'/seller/upload/storeBusiness'"
            name="storeBusiness"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :before-upload="beforeStoreHeaderImgUpload"
            :auto-upload="false">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="businessDialogVisible" size="tiny">
            <img width="100%" :src="storeForm.business" alt="">
          </el-dialog>
        </el-form-item>
        <!--<el-form-item label="上传餐饮服务许可证">
          <el-upload
            class="avatar-uploader"
            action=""
            ref="permit"
            name="storePermit"
            :show-file-list="false"
            :before-upload="beforeStoreHeaderImgUpload">
            <img v-if="storeForm.permit" :src="storeForm.permit" class="avatar">
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
          </el-upload>
        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="addStore">立即创建</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { BASEIMGURL } from "../../config/env";
    export default {
      name: "add-store",
      data(){
        let checkPhone = (rule, value, callback)=>{
          let reg = /^(0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8})|(400|800)([0-9\\-]{7,10})|(([0-9]{4}|[0-9]{3})(-| )?)?([0-9]{7,8})((-| |转)*([0-9]{1,4}))?$/;
          if(!reg.test(value)){
            return callback('手机号不正确')
          }
          callback();
        };
        return {
          BASEIMGURL,
          businessDialogVisible:false,
          storeForm:{
            name:'',
            address:'',
            phone:'',
            introduce:'',
            slogan:'',
            category:'',
            tag01:true,
            tag02:true,
            dispatch:5,
            sendPrice:20,
            startSaleTime:'',
            endSaleTime:'',
            avatar:'',
            business:'',
            permit:''
          },
          storeRules:{
            name:[
              {required:true,message:'请输入商铺名称',trigger:'blur'},
              {min:3,max:20,message:'长度在3到20个字符',trigger:'blur'}
            ],
            address:[
              {required:true,message:'请输入商铺详细地址',trigger:'blur'}
            ],
            phone:[
              {required:true,message:'请输入手机号',trigger:'blur'},
              {validator:checkPhone,trigger:'blur'}
            ]
          }
        }
      },
      methods:{
        handlePictureCardPreview(file){
          this.storeForm.business = file.url;
          this.businessDialogVisible = true;
        },
        handleAvatarChange(file,fileList){
          this.storeForm.avatar = URL.createObjectURL(file.raw);
        },
        handleBusinessChange(file,fileList){
          this.storeForm.business = file.url;
          this.businessDialogVisible = true;
        },
        handlePermitChange(file,fileList){
          this.storeForm.permit = URL.createObjectURL(file.raw);
        },
        beforeStoreHeaderImgUpload(file){
          console.log(file)
          const isJPG = file.type === 'image/jpeg';
          const isLt2M = file.size / 1024 / 1024 < 2;

          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!');
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
          }
          return isJPG && isLt2M;
        },
        addStore(){
          this.$refs.business.submit();
        }
      },
      mounted(){

      }
    }
</script>

<style lang="scss">
.add_store{
  .form_box{
    min-width: 800px;
    max-width: 1200px;
    margin: auto;

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

    .el-icon-plus{
      font-size: 30px;
      font-weight: bold;
    }
  }
}

</style>
