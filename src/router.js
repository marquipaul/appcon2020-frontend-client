import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/authentication/Login'
import Dashboard from './components/dashboard/Dashboard'
import Account from './components/account/AccountMain'
import ProcessFlow from './components/company-admin/process-flow/ProcessFlowMain'
import Group from './components/company-admin/groups/GroupMain'
import BloodRequest from './components/company-admin/blood-request/BloodRequestMain'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: Account,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/process-flows',
      name: 'process-flows',
      component: ProcessFlow,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/groups',
      name: 'groups',
      component: Group,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/blood-requests',
      name: 'blood-request',
      component: BloodRequest,
      meta: {
        requiresAuth: true,
      }
    },
  ]
})
