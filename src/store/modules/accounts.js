/* eslint-disable */
import axios from 'axios'
import Vue from 'vue'
const state  = {
    account: {},
    accounts: [],
    total: 0,
    last_page: 0
};
const getters = {
    retrieveAccounts(state) {
        return state.accounts
    },
    retrieveAccount(state) {
        return state.account
    },
    retrieveTotalAccounts(state) {
        return state.total
    },
    retrieveLastPageAccounts(state) {
        return state.last_page
    },
};
const mutations = {
    setAccounts(state, payload){
        state.last_page = payload.last_page
        state.total = payload.total
        state.accounts = payload.data
    },
    setAccount(state, payload) {
        state.account = payload
    },
    pushAccount(state, payload) {
        state.total++
        state.accounts.push(payload)
    },
    updateAccount(state, payload) {
        let updateIndex = state.accounts.findIndex(item => item.id === payload.id);
        Vue.set(state.accounts, updateIndex, payload)
    },
    deleteAccount(state, id) {
        let deleteIndex = state.accounts.findIndex(item => item.id === id);
        state.accounts.splice(deleteIndex, 1)
    }
};
const actions = {
    accountOnline(context, id){
        return new Promise((resolve, reject) => {
            axios.put(`/api/account/online/${id}`, {})
            .then(response => {
                context.commit('updateAccount', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    accountOffline(context, id){
        return new Promise((resolve, reject) => {
            axios.put(`/api/account/offline/${id}`, {})
            .then(response => {
                context.commit('updateAccount', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        })
    },
    retrieveAccounts(context, params){
        return new Promise((resolve, reject) => {
            axios.get(`/api/accounts`, {params: params})
            .then(response => {
                context.commit('setAccounts', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    retrieveAccount(context, id){
        return new Promise((resolve, reject) => {
            axios.get(`/api/accounts/${id}`)
            .then(response => {
                context.commit('setAccount', response.data)
                resolve(response.data)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    storeAccount(context, payload) {
        return new Promise((resolve, reject) => {
            axios.post(`/api/accounts`, payload)
            .then(response => {
                context.commit('pushAccount', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    updateAccount(context, payload) {
        return new Promise((resolve, reject) => {
            axios.put(`/api/accounts/${payload.id}`, payload)
            .then(response => {
                context.commit('updateAccount', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    deleteAccount(context, id) {
        return new Promise((resolve, reject) => {
            axios.delete(`/api/accounts/${id}`)
            .then(response => {
                context.commit('deleteAccount', id)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    addStaff(context, payload) {
        return new Promise((resolve, reject) => {
            axios.put(`/api/accounts/${payload.id}?add_staff`, payload)
            .then(response => {
                //context.commit('updateAccount', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    removeStaff(context, payload) {
        return new Promise((resolve, reject) => {
            axios.put(`/api/accounts/${payload.id}?remove_staff`)
            .then(response => {
                //context.commit('updateAccount', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
};


export default {
    state,
    getters,
    actions,
    mutations,
}