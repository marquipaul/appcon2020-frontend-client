import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import authentication from './modules/authentication'
import AccountModule from './modules/accounts'
import ProcessFlowModule from './modules/ProcessFlow'
import QuestionModule from './modules/Question'
import HospitalModule from './modules/Hospitals'
import GroupModule from './modules/Group'
import BloodRequestModule from './modules/blood-requests'
import TransactionModule from './modules/transactions'
import NotificationModule from './modules/notification'

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth: authentication,
    account: AccountModule,
    flow: ProcessFlowModule,
    question: QuestionModule,
    hospital: HospitalModule,
    group: GroupModule,
    bloodRequests: BloodRequestModule,
    transaction: TransactionModule,
    notification: NotificationModule
  }
})
