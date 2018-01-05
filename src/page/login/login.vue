<template>
    <div class="login">
      <div class="container">
        <h1 class="title">elm商家后台管理系统</h1>
        <div class="form_box">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
            <el-form-item prop="username">
              <el-input class="username" v-model="loginForm.username" placeholder="请输入用户名" @keyup.enter.native="login"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input class="password" v-model="loginForm.password" placeholder="请输入密码" @keyup.enter.native="login"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="btn_size" type="primary" @click="login">登录</el-button>
            </el-form-item>
          </el-form>
          <div class="login_info">
            <a href="" class="forget_psd">忘记密码?</a>
            <a href="" class="sign_in">注册</a>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import { login } from '../../axios/initData'
  import { mapState, mapMutations } from 'vuex'

  export default {
      name: "login",
      data(){
        return {
          loginForm:{
            username:'',
            password:''
          },
          loginRules:{
            username:[
              {required:true,message:'请输入用户名',trigger:'blur'}
            ],
            password:[
              {required:true,message:'请输入密码',trigger:'blur'}
            ]
          }
        }
      },
      methods:{
        ...mapMutations(['changeUserHeadImg']),
        login(){
          this.$refs.loginForm.validate((valid)=>{
            if(valid){
              let username = this.loginForm.username;
              let password = this.loginForm.password;
              login(username,password).then((response)=>{
                let res = response.data;
                let imgSrc = res.data.head_img;
                this.changeUserHeadImg(imgSrc);
                if(!res.status){
                  this.$message({
                    message:'登录成功',
                    type:'success'
                  });
                  setTimeout(()=>{
                    this.$router.push('manage')
                  },1000)
                }else{
                  this.$message({
                    message:'用户名或密码错误',
                    type:'warning'
                  });
                }
                console.log(res)
              })
            }else{
              this.$message({
                message:'登录失败',
                type:'info'
              });
              return false;
            }
          })
        }
      },
      mounted(){

      }
    }
</script>

<style lang="scss" scoped>
.login{
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: #324057;
  .container{
    width: 400px;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    margin: auto;
    margin-top: -170px;
    text-align: center;
    .title{
      color: #fff;
      font-size: 30px;
      margin-bottom: 20px;
    }
    .form_box{
      background: #fff;
      border-radius: 5px;
      padding: 30px;
    }
    .btn_size{
      width: 100%;
    }
    .login_info{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      font-size: 14px;
      a{
        color: #000;
      }
      .forget_psd{
        flex: 1;
        text-align: right;
        margin-right: 10px;
      }
    }

  }
}
</style>
