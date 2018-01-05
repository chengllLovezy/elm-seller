<template>
  <div class="add_goods">
    <div class="goods_box">
      <el-form ref="goodsForm" :model="goodsForm" :rules="goodsRules" label-width="120px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="goodsForm.name"></el-input>
        </el-form-item>
        <el-form-item label="商品售价" prop="price">
          <el-input-number v-model="goodsForm.price"></el-input-number>
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input v-model="goodsForm.description"></el-input>
        </el-form-item>
        <el-form-item label="商品规格">
          <el-row>
            <el-col>
              <el-switch v-model="goodsForm.isFormat" active-text="有规格"></el-switch>
              <el-button class="custom_format_text_btn" type="text" :disabled="!goodsForm.isFormat" @click="customFormat">自定义规格名称</el-button>
              <el-dialog
                title="自定义规格名称"
                :visible.sync="customFormatDialogVisible"
                width="30%"
                :before-close="handleCloseCustomFormat">
                <div class="custom_format_dialog_box">
                  <el-form-item label="规格名称">
                    <el-input v-model="customFormatName"></el-input>
                  </el-form-item>
                </div>
                <span slot="footer" class="dialog-footer">
    <el-button @click="customFormatDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="sureAddCustomName">确 定</el-button>
  </span>
              </el-dialog>
            </el-col>
          </el-row>
          <transition-group>
            <el-row v-if="goodsForm.isFormat" v-for="(itemObj,key) in goodsForm.format" :key="key">
              <el-col :span="1">{{itemObj.title}}:</el-col>
              <el-col :span="23">
                <el-tag v-for="(item,index) in itemObj.content" :key="index" closable :disable-transition="false" @close="handlerClose(itemObj,item)">{{item.name}} <span v-if="item.price>=0"> | {{item.price}}</span></el-tag>
                <el-input class="input-new-tag" v-show="inputVisible == key" v-model="inputValue" size="small" :minlength="1" :maxlength="10" placeholder="名称" @keyup.enter.native="handleInputConfirm(itemObj)" @blur="handleInputConfirm(itemObj)">
                </el-input>
                <el-input class="input-new-tag" v-if="(inputVisible == key)&&(itemObj.content[0].price>=0)" v-model="formatPrice" size="small" :minlength="1" :maxlength="10" placeholder="价格" @keyup.enter.native="handleInputConfirm(itemObj)" @blur="handleInputConfirm(itemObj)">
                </el-input>
                <el-button class="button-new-tag" size="small" @click="showInput($event,key)" v-show="!(inputVisible == key)">+ 添加规格</el-button>
                <el-button type="danger" size="small" v-if="key != 0" @click="deleteFormat(key)">删除此规格</el-button>
              </el-col>
            </el-row>
          </transition-group>
        </el-form-item>
        <el-form-item label="上传商品图片" prop="goodsImg">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="goodsForm.goodsImg" :src="goodsForm.goodsImg" class="avatar">
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="hanlderReset">重置</el-button>
          <el-button type="primary" @click="handlerSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
    export default {
      name: "add-goods",
      data(){
        return {
          inputValue:'',//商品规格对应的名称
          formatPrice:'',//商品规格对应的价格
          customFormatName:'',
          inputVisible:null,
          customFormatDialogVisible:false,
          goodsForm:{
            name:'',
            price:'',
            description:'',
            isFormat:false,
            format:[
              {
                title:'规格',
                content:[
                  {
                    name:'常规',
                    price:0
                  }
                ]
              },
              {
                title:'温度',
                content:[
                  {
                    name:'常温'
                  }
                ]
              }
            ],
            goodsImg:''
          },
          goodsRules:{
            name:[
              {required:true,message:'请输入商品名称',trigger:'blur'}
            ],
            price:[
              {required:true,message:'请输入商品名称',trigger:'blur'}
            ],
            description:[
              {required:false,message:'',trigger:'blur'}
            ],
            goodsImg:[
              {required:true,message:'请上传商品图片',trigger:'blur'}
            ]
          }
        }
      },
      methods:{
        // 删除规格项
        handlerClose(itemObj,item){
          itemObj.content.splice(itemObj.content.indexOf(item),1)
        },
        //添加规格的项的切换按钮
        showInput(ev,key) {
          this.inputVisible = key;
          this.inputValue = '';
          let input = ev.target.parentElement.parentElement.getElementsByClassName('el-input__inner')[0];
          this.$nextTick(() => {
            input.focus()
          });
        },
        //添加规格的项
        handleInputConfirm(itemObj) {
          let index = this.goodsForm.format.indexOf(itemObj);

          let inputValue = this.inputValue.replace(/\s+/g,'');
          let formatPrice = this.formatPrice;
          if(index === 0){
            if(inputValue!='' || formatPrice!=0){
              this.inputVisible = index;
            }else{
              this.inputVisible = null;
              this.inputValue = '';
              this.formatPrice = '';
            }

            if(inputValue && formatPrice){
              let content = {
                name:inputValue,
                price:formatPrice
              };
              itemObj.content.push(content);
              this.inputVisible = null;
              this.inputValue = '';
              this.formatPrice = '';
            }
          }else{
            if(inputValue){
              let content = {
                name:inputValue
              };
              itemObj.content.push(content);
            }
            this.inputVisible = null;
            this.inputValue = '';
          }
        },
        //自定义规格的dialog 打开
        customFormat(){
          this.customFormatDialogVisible = true;
        },
        //自定义规格的dialog 关闭
        handleCloseCustomFormat(){
          this.customFormatDialogVisible = false;
        },
        // 确认添加自定义规格
        sureAddCustomName(){
          let content = this.customFormatName.replace(/\s+/g,'');
          if(!content){
            this.$message({
              message:'内容不能为空',
              type:'info'
            });
            return;
          }
          let newFormat = {
            title:content,
            inputVisible:false,
            content:['默认']
          };
          this.goodsForm.format.push(newFormat);
          this.$message({
            message:'添加成功',
            type:'success'
          });
          this.customFormatDialogVisible = false;
        },
        // 删除规格
        deleteFormat(index){
          this.goodsForm.format.splice(index,1)
        },
        // 商品图片展示
        handleAvatarSuccess(res, file) {
          this.goodsForm.goodsImg = URL.createObjectURL(file.raw);
        },
        // 商品图片限制
        beforeAvatarUpload(file) {
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
        //重置按钮
        hanlderReset(){
          this.$refs.goodsForm.resetFields();
        },
        // 提交按钮
        handlerSubmit() {
          this.$refs.goodsForm.validate((valid) => {
            if (valid) {
              alert('submit!');
            } else {
              alert('error submit!!');
              return false;
            }
          });
        },
      },
      mounted(){

      }
    }
</script>

<style lang="scss">
  .add_goods{
    .custom_format_text_btn{
      margin-left: 20px;
    }
    .el-tag + .el-tag {
      margin-left: 10px;
    }
    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90.4px;
      margin-left: 10px;
      vertical-align: bottom;
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
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
  }

</style>
