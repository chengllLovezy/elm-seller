import axios from 'axios';

const base = '/seller';

// 登录
export const login = (username,password) => {
  return new Promise((resolve, reject)=>{
    axios.post(base+'/login',{
      username:username,
      password:password
    }).then((res)=>{
      if(res.status){
        resolve(res)
      }else{
        reject(error)
      }
  })
})
};

// 验证是否已经登录
export const is_login = () => {
  return new Promise((resolve, reject)=>{
    axios.get(base+'/login').then((res)=>{
      if(res.status){
        resolve(res)
      }else{
        reject(error)
      }
    })
  })
};
// 退出
export const quit = () => {
  return new Promise((resolve, reject)=>{
    axios.get(base+'/quit').then((res)=>{
      if(res.status){
        resolve(res)
      }else{
        reject(error)
      }
    })
  })
};
// 添加个人信息
export const add_personal = (form) => {
  console.log(form)
  return new Promise((resolve, reject)=>{
    axios.post(base+'/addPersonal',{
      form:form
    }).then((res)=>{
      if(res.status){
        resolve(res)
      }else{
        reject(error)
      }
    })
  })
};
// 个人信息展示
export const personal_info = () =>{
  return new Promise((resolve, reject)=>{
    axios.get(base+'/personalInfo').then((response)=>{
      if(response.status){
        resolve(response)
      }else{
        reject(err)
      }
    })
  })
};

// 修改密码
export const edit_psd = (psd) =>{
  return new Promise((resolve, reject)=>{
    axios.post(base+'/editPsd',{
      password:psd
    }).then((response)=>{
      if(response.status){
        resolve(response)
      }else{
        reject(err)
      }
    })
  })
};
// 修改手机号
export const edit_phone = (phone,phoneCode) =>{
  return new Promise((resolve, reject)=>{
    axios.post(base+'/editPhone',{
      phone:phone,
      phoneCode:phoneCode
    }).then((response)=>{
      if(response.status){
        resolve(response)
      }else{
        reject(err)
      }
    })
  })
};
// 发送验证码
export const send_code = (phone) =>{
  return new Promise((resolve, reject)=>{
    axios.post(base+'/phoneCode',{
      phone:phone
    }).then((response)=>{
      if(response.status){
        resolve(response)
      }else{
        reject(err)
      }
    })
  })
};
