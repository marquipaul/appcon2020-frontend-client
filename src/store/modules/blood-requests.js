/* eslint-disable */
import axios from 'axios'
import Vue from 'vue'
const state  = {
    blood_request: {},
    blood_requests: [],
    total: 0,
    last_page: 0
};
const getters = {
    retrieveBloodRequests(state) {
        return state.blood_requests
    },
    retrieveBloodRequest(state) {
        return state.blood_request
    },
    retrieveTotalBloodRequest(state) {
        return state.total
    },
    retrieveLastPageBloodRequest(state) {
        return state.last_page
    },
};
const mutations = {
    setBloodRequests(state, payload){
        state.last_page = payload.last_page
        state.total = payload.total
        state.blood_requests = payload.data
    },
    setBloodRequest(state, payload) {
        state.blood_request = payload
    },
    pushBloodRequest(state, payload) {
        state.total++
        state.blood_requests.push(payload)
    },
    updateBloodRequest(state, payload) {
        let updateIndex = state.blood_requests.findIndex(item => item.id === payload.id);
        Vue.set(state.blood_requests, updateIndex, payload)
    },
    deleteBloodRequest(state, id) {
        let deleteIndex = state.blood_requests.findIndex(item => item.id === id);
        state.blood_requests.splice(deleteIndex, 1)
    }
};
const actions = {
    retrieveBloodRequests(context, params){
        return new Promise((resolve, reject) => {
            axios.get(`/api/blood-request`, {params: params})
            .then(response => {
                context.commit('setBloodRequests', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    retrieveBloodRequest(context, id){
        return new Promise((resolve, reject) => {
            axios.get(`/api/blood-request/${id}`)
            .then(response => {
                context.commit('setBloodRequest', response.data)
                resolve(response.data)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    storeBloodRequest(context, payload) {
        return new Promise((resolve, reject) => {
            axios.post(`/api/blood-request`, payload)
            .then(response => {
                context.commit('pushBloodRequest', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    updateBloodRequest(context, payload) {
        return new Promise((resolve, reject) => {
            axios.put(`/api/blood-request/${payload.id}`, payload)
            .then(response => {
                context.commit('updateBloodRequest', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    deleteBloodRequest(context, id) {
        return new Promise((resolve, reject) => {
            axios.delete(`/api/blood-request/${id}`)
            .then(response => {
                context.commit('deleteBloodRequest', id)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },

    // storeTransaction(context, payload) {
    //     return new Promise((resolve, reject) => {
    //         axios.post(`/api/transactions`, payload)
    //         .then(response => {
    //             resolve(response)
    //         })
    //         .catch(error => {
    //             reject(error)
    //         })
    //     }) 
    // },

    // removeTransaction(context, payload) {
    //     return new Promise((resolve, reject) => {
    //         axios.delete(`/api/transactions/${payload.id}`)
    //         .then(response => {
    //             resolve(response)
    //         })
    //         .catch(error => {
    //             reject(error)
    //         })
    //     }) 
    // },
};


export default {
    state,
    getters,
    actions,
    mutations,
}