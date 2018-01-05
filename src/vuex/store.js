import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

let state = {
  user_head_img:'/static/images/default.jpg'
};

let mutations = {
  changeUserHeadImg(state,imgSrc){
    state.user_head_img = imgSrc;
  }
};

export default new Vuex.Store({
  state,
  mutations
})
