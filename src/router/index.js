import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/page/login/login'
import Manage from '@/page/manage/manage'
import StoreList from '@/page/store/storeList'
import AddStore from '@/page/store/addStore'
import GoodsList from '@/page/goods/goodsList'
import AddGoods from '@/page/goods/addGoods'
import DataView from '@/page/dataView/dataView'
import CreditRecord from '@/page/creditRecord/creditRecord'
import Setting from '@/page/setting/setting'
import Personal from '@/page/personal/personal'
import AddPersonal from '@/page/personal/addPersonal'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/manage',
      name: 'manage',
      component: Manage,
      children:[
        {
          path: '/storeList',
          name: 'storeList',
          component: StoreList,
        },
        {
          path: '/addStore',
          name: 'addStore',
          component: AddStore
        },
        {
          path: '/goodsList',
          name: 'goodsList',
          component: GoodsList,
        },
        {
          path: '/addGoods',
          name: 'addGoods',
          component: AddGoods,
        },
        {
          path: '/dataView',
          name: 'dataView',
          component: DataView,
        },
        {
          path: '/creditRecord',
          name: 'creditRecord',
          component: CreditRecord,
        },
        {
          path: '/setting',
          name: 'setting',
          component: Setting,
        },
        {
          path: '/personal',
          name: 'personal',
          component: Personal,
        },
        {
          path: '/addPersonal',
          name: 'addPersonal',
          component: AddPersonal,
        }
      ]
    }
  ]
})
