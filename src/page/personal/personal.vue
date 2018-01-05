<template>
  <div class="personal">
    <el-table v-loading="loading" :data="personalData" style="width:100%">
      <el-table-column prop="name" label="姓名">
      </el-table-column>
      <el-table-column prop="username" label="用户名">
      </el-table-column>
      <el-table-column prop="password" label="密码">
      </el-table-column>
      <el-table-column prop="telPhone" label="手机">
      </el-table-column>
      <el-table-column prop="cardID" label="身份证">
      </el-table-column>
      <el-table-column prop="address.minx" label="家庭住址">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="editPsdDialog">修改密码</el-button>
          <el-button type="text" @click="editPhoneDialog">修改手机号</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="修改密码" :visible.sync="dialogVisible" :before-close="hanlderClose">
      <div class="">
        <el-form :model="form" :rules="rules" ref="form" label-width="100px">
          <el-form-item label="新密码" prop="password">
            <el-input v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="repassword">
            <el-input v-model="form.repassword"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="hanlderClose">取 消</el-button>
        <el-button type="primary" @click="editPsd">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改手机号" :visible.sync="dialogVisiblePhone" :before-close="hanlderClose">
      <div class="">
        <el-row>
          <el-col>
            <el-form :model="phoneForm" :rules="phoneRules" ref="phoneForm" label-width="115px">
              <el-form-item label="新手机号" prop="phone">
                <el-input v-model="phoneForm.phone"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :push="3">
            <el-row>
              <el-col :span="3">
                <el-button type="default" v-if="!timeCode" @click="sendPhoneCode">发送验证码</el-button>
                <el-button type="default" disabled v-if="timeCode">{{timeCode}}s后过期</el-button>
              </el-col>
              <el-col :span="3">
                <el-input v-model="phoneCode" v-if="timeCode"></el-input>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <span slot="footer">
        <el-button @click="hanlderClose">取 消</el-button>
        <el-button type="primary" @click="editPhone">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { personal_info, edit_psd, edit_phone, send_code } from '../../axios/initData'
    export default {
      name: "personal",
      data(){
        let checkPsd = (rule, val, cb)=>{
          let psd = this.form.password;
          console.log(psd)
          if(psd === val){
            cb()
          }else{
            cb('两次输入密码不一致')
          }
        };
        let checkPhone = (rule, value, callback)=>{
          let reg = /^1[3|4|5|8][0-9]\d{4,8}$/;
          if(!reg.test(value)){
            return callback('手机号不正确')
          }else{
            callback();
          }
        };
        return {
          personalData:[],
          loading:true,
          dialogVisible:false,
          dialogVisiblePhone:false,
          phoneCode:'',
          timeCode:0,
          phoneForm:{
            phone:''
          },
          phoneRules:{
            phone:[
              {required:true,message:'请输入新手机号',trigger:'blur'},
              {validator:checkPhone,trigger:'blur'}
            ]
          },
          form:{
            password:'',
            repassword:''
          },
          rules:{
            password:[
              {required:true,message:'请输入新密码',trigger:'blur'}
            ],
            repassword:[
              {required:true,message:'请输入确认密码',trigger:'blur'},
              {validator:checkPsd,trigger:'blur'}
            ]
          }
        }
      },
      methods:{
        init(){
          personal_info().then((response)=>{
            let res = response.data;
            if(!res.status){
              console.log(res.data)
              this.loading = false;
              if(!this.loading){
                this.personalData.push(res.data);
              }
            }
          })
        },
        sendPhoneCode(){
          this.$refs.phoneForm.validate((valid)=>{
            if(valid){
              let phone = this.phoneForm.phone;
              send_code(phone).then((response)=>{
                let res = response.data;
                if(!res.status){
                  let timeCode = this.timeCode = 120;
                  let timer = setInterval(()=>{
                    timeCode--;
                    this.timeCode = timeCode;
                    if(timeCode<=0){
                      clearInterval(timer)
                      this.timeCode = timeCode = 0;
                    }
                  },1000)
                }
              })
            }else{
              this.$message({
                message:'请输入正确的字段信息',
                type:'warning'
              });
            }
          });

        },
        editPhoneDialog(){
          this.dialogVisiblePhone = true;
        },
        editPhone(){
          this.$refs.phoneForm.validate((valid)=>{
            if(valid){
              let phone = this.phoneForm.phone;
              let phoneCode = this.phoneCode;
              edit_phone(phone,phoneCode).then((response)=>{
                let res = response.data;
                if(!res.status){
                  this.$message({
                    message:'手机号修改成功',
                    type:'success'
                  });
                  this.dialogVisiblePhone = false;
                }else if(res.status === 1){
                  this.$message({
                    message:'手机号修改失败',
                    type:'error'
                  })
                }else if(res.status === 2){
                  this.$message({
                    message:'手机验证码不正确',
                    type:'error'
                  })
                }else if(res.status === 3){
                  this.$message({
                    message:'请输入新的手机号，此手机号已被设置',
                    type:'error'
                  })
                }else if(res.status === 4){
                  this.$message({
                    message:'用户查询失败，无法修改',
                    type:'error'
                  })
                }else if(res.status === 5){
                  this.$message({
                    message:'输入的手机号和验证的手机号不一致',
                    type:'error'
                  })
                }
              })
            }else{
              this.$message({
                message:'请输入正确的字段信息',
                type:'warning'
              });
            }
          })
        },
        editPsdDialog(){
          this.dialogVisible = true;
        },
        editPsd(){
          let psd = this.form.password;
          this.$refs.form.validate((valid)=>{
            if(valid){
              edit_psd(psd).then((response)=>{
                let res = response.data;
                if(!res.status){
                  this.$message({
                    message:'密码修改成功，请重新登录',
                    type:'success'
                  });
                  this.dialogVisible = false;
                  this.$router.push('/')
                }else{
                  this.$message({
                    message:'密码修改失败',
                    type:'error'
                  })
                }
              })
            }else{
              this.$message({
                message:'请输入正确的字段信息',
                type:'warning'
              });
              return false;
            }
          });
        },
        hanlderClose(){
          if(this.dialogVisible){
            this.$refs.form.resetFields();
            this.dialogVisible = false;
          }else if(this.dialogVisiblePhone){
            this.$refs.phoneForm.resetFields();
            this.timeCode = 0;
            this.dialogVisiblePhone = false;
          }
        }
      },
      created(){
        this.init()
      },
      mounted(){

      }
    }
</script>

<style scoped>

</style>
