/* eslint-disable */
import axios from 'axios'
import Vue from 'vue'
const state  = {
    extraction: {},
    extractions: [],
    total: 0
};
const getters = {
    retrieveExtractions(state) {
        return state.extractions
    },
    retrieveTotalExtractions(state) {
        return state.total
    },
    retrieveExtraction(state) {
        return state.extraction
    },
};
const mutations = {
    setExtractions(state, payload){
        state.total = payload.total
        state.extractions = payload.data
    },
    setExtraction(state, payload) {
        state.extraction = payload
    },
    pushExtraction(state, payload) {
        state.extractions.push(payload)
    },
    updateExtraction(state, payload) {
        let updateIndex = state.extractions.findIndex(item => item.id === payload.id);
        Vue.set(state.extractions, updateIndex, payload)
    },
    deleteExtraction(state, id) {
        let deleteIndex = state.extractions.findIndex(item => item.id === id);
        state.extractions.splice(deleteIndex, 1)
    }
};
const actions = {
    retrieveExtractions(context, params){
        return new Promise((resolve, reject) => {
            axios.get(`/api/extractions`, {params: params})
            .then(response => {
                context.commit('setExtractions', response.data)
                resolve(response.data)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    retrieveExtraction(context, id){
        return new Promise((resolve, reject) => {
            axios.get(`/api/extractions/${id}`)
            .then(response => {
                context.commit('setExtraction', response.data)
                resolve(response.data)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    storeExtraction(context, payload) {
        return new Promise((resolve, reject) => {
            axios.post(`/api/extractions`, payload)
            .then(response => {
                context.commit('pushExtraction', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    updateExtraction(context, payload) {
        return new Promise((resolve, reject) => {
            axios.put(`/api/extractions/${payload.id}`, payload)
            .then(response => {
                context.commit('updateExtraction', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    deleteExtraction(context, id) {
        return new Promise((resolve, reject) => {
            axios.delete(`/api/extractions/${id}`)
            .then(response => {
                context.commit('deleteExtraction', id)
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