/* eslint-disable */
import axios from 'axios'
import Vue from 'vue'
const state  = {
    transaction: {},
    transactions: [],
    total: 0,
    last_page: 0
};
const getters = {
    retrieveTransactions(state) {
        return state.transactions
    },
    retrieveTransaction(state) {
        return state.transaction
    },
    retrieveTotalTransaction(state) {
        return state.total
    },
    retrieveLastPageTransaction(state) {
        return state.last_page
    },
};
const mutations = {
    setTransactions(state, payload){
        state.last_page = payload.last_page
        state.total = payload.total
        state.transactions = payload.data
    },
    setTransaction(state, payload) {
        state.transaction = payload
    },
    pushTransaction(state, payload) {
        state.total++
        state.transactions.push(payload)
    },
    updateTransaction(state, payload) {
        let updateIndex = state.transactions.findIndex(item => item.id === payload.id);
        Vue.set(state.transactions, updateIndex, payload)
    },
    deleteTransaction(state, id) {
        let deleteIndex = state.transactions.findIndex(item => item.id === id);
        state.transactions.splice(deleteIndex, 1)
    }
};
const actions = {
    retrieveTransactions(context, params){
        return new Promise((resolve, reject) => {
            axios.get(`/api/transactions`, {params: params})
            .then(response => {
                context.commit('setTransactions', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    retrieveTransaction(context, id){
        return new Promise((resolve, reject) => {
            axios.get(`/api/transactions/${id}`)
            .then(response => {
                //context.commit('setBloodRequest', response.data)
                resolve(response.data)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    submitAnswer(context, payload) {
        return new Promise((resolve, reject) => {
            axios.post(`/api/answers`, payload)
            .then(response => {
                //context.commit('pushBloodRequest', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    updateAnswer(context, payload) {
        return new Promise((resolve, reject) => {
            axios.put(`/api/answers/${payload.id}`, payload)
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    // updateBloodRequest(context, payload) {
    //     return new Promise((resolve, reject) => {
    //         axios.put(`/api/transactions/${payload.id}`, payload)
    //         .then(response => {
    //             context.commit('updateBloodRequest', response.data)
    //             resolve(response)
    //         })
    //         .catch(error => {
    //             reject(error)
    //         })
    //     }) 
    // },
    deleteBloodRequest(context, id) {
        return new Promise((resolve, reject) => {
            axios.delete(`/api/transactions/${id}`)
            .then(response => {
                context.commit('deleteBloodRequest', id)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },

    storeTransaction(context, payload) {
        return new Promise((resolve, reject) => {
            axios.post(`/api/transactions`, payload)
            .then(response => {
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },

    removeTransaction(context, payload) {
        return new Promise((resolve, reject) => {
            axios.delete(`/api/transactions/${payload.id}`)
            .then(response => {
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