<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import { is_login } from './axios/initData'
  import { mapState, mapMutations } from 'vuex'

  export default {
  name: 'app',
  data(){
    return {

    }
  },
  computed:{
    ...mapState(['user_head_img'])
  },
  watch:{
    '$route':'isLogin'
  },
  methods:{
    ...mapMutations(['changeUserHeadImg']),
    isLogin(){
      is_login().then((response)=>{
        let res = response.data;
        let imgSrc = res.data.head_img;
        this.changeUserHeadImg(imgSrc);
        if(!res.status){
          let path = this.$route.path;
          if(path === '/'){
            this.$message({
              message:'您已经登录，正在跳转',
              type:'success'
            });
            setTimeout(()=>{
              this.$router.push('manage')
            },1000)
          }else{
            this.$router.push({path:path})
          }
        }else{
          this.$router.push({path:'/'})
        }
      })
    },
    init(){
      this.$router.push('login')
    }
  },
  created(){
    // this.isLogin();
  },
  mounted(){
    this.isLogin();
  }
}
</script>

<style lang="scss">
  @import "./style/comment";
  #app {
    width: 100%;
    height: 100%;
  }
</style>
