/* eslint-disable */
import axios from 'axios'
import Vue from 'vue'
const state  = {
    flow: {},
    flows: [],
};
const getters = {
    retrieveFlows(state) {
        return state.flows
    },
    retrieveFlow(state) {
        return state.flow
    },
};
const mutations = {
    setFlows(state, payload){
        state.flows = payload
    },
    setFlow(state, payload) {
        state.flow = payload
    },
    pushFlow(state, payload) {
        state.flows.push(payload)
    },
    updateFlow(state, payload) {
        let updateIndex = state.flows.findIndex(item => item.id === payload.id);
        Vue.set(state.flows, updateIndex, payload)
    },
    deleteFlow(state, id) {
        let deleteIndex = state.flows.findIndex(item => item.id === id);
        state.flows.splice(deleteIndex, 1)
    }
};
const actions = {
    retrieveFlows(context, params){
        return new Promise((resolve, reject) => {
            axios.get(`/api/process-flow`)
            .then(response => {
                context.commit('setFlows', response.data)
                resolve(response.data)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    retrieveFlow(context, id){
        return new Promise((resolve, reject) => {
            axios.get(`/api/process-flow/${id}`)
            .then(response => {
                context.commit('setFlow', response.data)
                resolve(response.data)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    storeFlow(context, payload) {
        return new Promise((resolve, reject) => {
            axios.post(`/api/process-flow`, payload)
            .then(response => {
                context.commit('pushFlow', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    updateFlow(context, payload) {
        return new Promise((resolve, reject) => {
            axios.put(`/api/process-flow/${payload.id}`, payload)
            .then(response => {
                context.commit('updateFlow', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    deleteFlow(context, id) {
        return new Promise((resolve, reject) => {
            axios.delete(`/api/process-flow/${id}`)
            .then(response => {
                context.commit('deleteFlow', id)
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