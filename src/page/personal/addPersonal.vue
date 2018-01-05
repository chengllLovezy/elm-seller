<template>
  <div class="add_personal">
    <div class="person_box">
      <el-form ref="personalForm" :model="personalForm" :rules="personalRules" label-width="120px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="personalForm.name" placeholder="请输入真实姓名" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="personalForm.phone" placeholder="请输入手机号" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="sendCode" v-if="!codeTime" :disabled="disabled">发送手机验证码</el-button>
          <el-row>
            <el-col :span="3">
              <el-button type="default" v-if="codeTime" disabled>{{codeTime}}s后过期</el-button>
            </el-col>
            <el-col :span="3">
              <el-input v-model="code" v-if="codeTime" placeholder="请输入验证码"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model="personalForm.sex" label="男" :disabled="disabled">男</el-radio>
          <el-radio v-model="personalForm.sex" label="女" :disabled="disabled">女</el-radio>
        </el-form-item>
        <el-form-item label="家庭住址" required>
          <el-row>
            <el-col>
              <el-select v-model="personalForm.province" placeholder="请选择省" @change="getCity" :disabled="disabled">
                <el-option v-for="pro in province" :key="pro.name" :label="pro.name" :value="pro.name"></el-option>
              </el-select>
              <el-select v-model="personalForm.city" placeholder="请选择市" @change="getDistrict" :disabled="disabled">
                <el-option v-for="ci in city" :key="ci.name" :label="ci.name" :value="ci.name"></el-option>
              </el-select>
              <el-select v-model="personalForm.district" placeholder="请选择区" :disabled="disabled">
                <el-option v-for="dis in district" :key="dis.name" :label="dis.name" :value="dis.name"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-input v-model="personalForm.street" placeholder="请输入具体地址" :disabled="disabled"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="身份证号" prop="cardID">
          <el-input v-model="personalForm.cardID" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :span="3">
              <el-button type="default" @click="handlerReset" :disabled="disabled">重置</el-button>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" @click="handlerSubmit" :disabled="disabled">提交</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  var self = null;
  import { add_personal, send_code, personal_info } from '../../axios/initData'

  export default {
      name: "add-personal",
      data(){
        let checkPhone = (rule, value, callback)=>{
          let reg = /^1[3|4|5|8][0-9]\d{4,8}$/;
          if(!reg.test(value)){
            return callback('手机号不正确')
          }else{
            callback();
          }
        };
        let checkCardID = (rule, value, callback)=>{
          let reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/;
          if(!reg.test(value)){
            return callback('请输入正确的身份证号')
          }else{
            callback();
          }
        };

        return {
          disabled:true,
          code:'',
          codeTime:0,
          province:[],//省数据
          city:[],//市数据
          district:[],//县区数据
          personalForm:{
            name:'',
            phone:'',
            sex:'男',
            province:'',
            city:'',
            district:'',
            street:'',
            cardID:''
          },
          personalRules:{
            name:[
              {required:true,message:'请输入姓名',trigger:'blur'}
            ],
            phone:[
              {required:true,message:'请输入手机号',trigger:'blur'},
              {validator:checkPhone,trigger:'blur'}
            ],
            sex:[
              {required:true,message:'请输入姓名',trigger:'change'}
            ],
            cardID:[
              {required:true,message:'请输入身份证号',trigger:'blur'},
              {validator:checkCardID,trigger:'blur'}
            ]
          }
        }
      },
      methods:{
        getAmapData(){
          AMap.service('AMap.DistrictSearch',function(){//回调函数
            //实例化DistrictSearch
            var districtSearch = new AMap.DistrictSearch({
              level:'country',
              subdistrict:1
            });
            districtSearch.search('中国',function (status, result) {
              if(status === 'complete' && result.info === 'OK'){
                self.province = result.districtList[0].districtList;
              }
            })
          })
        },
        getCity(){
          let province = this.personalForm.province;
          AMap.service('AMap.DistrictSearch',function(){//回调函数
            //实例化DistrictSearch
            var districtSearch = new AMap.DistrictSearch({
              level:'province',
              subdistrict:1
            });
            districtSearch.search(province,function (status, result) {
              if(status === 'complete' && result.info === 'OK'){
                self.city = result.districtList[0].districtList;
              }
            })
          })
        },
        getDistrict(){
          let city = this.personalForm.city;
          AMap.service('AMap.DistrictSearch',function(){//回调函数
            //实例化DistrictSearch
            var districtSearch = new AMap.DistrictSearch({
              level:'city',
              subdistrict:1
            });
            districtSearch.search(city,function (status, result) {
              if(status === 'complete' && result.info === 'OK'){
                self.district = result.districtList[0].districtList;
              }
            })
          })
        },
        init(){
          personal_info().then((response)=>{
            let res = response.data;
            if(!res.status){
              this.personalForm.name = res.data.name;
              this.personalForm.phone = res.data.telPhone;
              this.personalForm.sex = res.data.sex;
              this.personalForm.province = res.data.address.all.province;
              this.personalForm.city = res.data.address.all.city;
              this.personalForm.district = res.data.address.all.district;
              this.personalForm.street = res.data.address.all.street;
              this.personalForm.cardID = res.data.cardID;
              if(res.data.name&&res.data.telPhone){
                this.disabled = true;
              }else{
                this.disabled = false;
              }
            }
          })
        },
        handlerReset(){
          this.$refs.personalForm.resetFields();
        },
        handlerSubmit() {
          if(this.disabled){
            return;
          }
          this.$refs.personalForm.validate((valid) => {
            if (valid) {
              let form = this.personalForm;
              add_personal(form).then((response)=>{
                let res = response.data;
                if(!res.status){
                  this.$message({
                    message:'提交成功',
                    type:'success'
                  });
                }else if(res.status === 1){
                  this.$message({
                    message:'提交失败',
                    type:'error'
                  })
                }else if(res.status === 2){
                  this.$message({
                    message:'手机验证码不正确',
                    type:'error'
                  })
                }
              });
            } else {
              this.$message({
                message:'请输入正确的字段信息',
                type:'warning'
              });
              return false;
            }
          });
        },
        sendCode(){
          let phone = this.personalForm.phone;
          send_code(phone).then((response)=>{
            let res = response.data;
            if(!res.status){
              let codeTime = this.codeTime = 120;
              console.log(codeTime)
              let timer = setInterval(()=>{
                codeTime--;
                this.codeTime = codeTime;
                if(codeTime <= 0){
                  clearInterval(timer);
                  this.codeTime = 0;
                }
              },1000);
            }
            console.log(response)
          })
        },
      },
      mounted(){
        self = this;
        this.getAmapData();
        this.init();
      }
    }
</script>

<style lang="scss">
.add_personal{

  .person_box{
    min-width: 800px;
    max-width: 1200px;
    margin: auto;
  }
  .el-row{
    margin-bottom: 20px;
    &:last-child{
      margin-bottom: 0;
    }
  }


}
</style>
