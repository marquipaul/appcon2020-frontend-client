/* eslint-disable */
import axios from 'axios'
import Vue from 'vue'
const state  = {
    group: {},
    groups: [],
    //total: 0
};
const getters = {
    retrieveGroups(state) {
        return state.groups
    },
    retrieveGroup(state) {
        return state.group
    }
};
const mutations = {
    setGroups(state, payload){
        state.groups = payload
    },
    setGroup(state, payload) {
        state.group = payload
    },
    pushGroup(state, payload) {
        state.groups.push(payload)
    },
    updateGroup(state, payload) {
        let updateIndex = state.groups.findIndex(item => item.id === payload.id);
        Vue.set(state.groups, updateIndex, payload)
    },
    deleteGroup(state, id) {
        let deleteIndex = state.groups.findIndex(item => item.id === id);
        state.groups.splice(deleteIndex, 1)
    }
};
const actions = {
    retrieveGroups(context, params){
        return new Promise((resolve, reject) => {
            axios.get(`/api/staff-groups`, {params: params})
            .then(response => {
                context.commit('setGroups', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    retrieveGroup(context, id){
        return new Promise((resolve, reject) => {
            axios.get(`/api/staff-groups/${id}`)
            .then(response => {
                context.commit('setGroup', response.data)
                resolve(response.data)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    storeGroup(context, payload) {
        return new Promise((resolve, reject) => {
            axios.post(`/api/staff-groups`, payload)
            .then(response => {
                //context.commit('pushGroup', response.data)
                context.dispatch('retrieveGroups')
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    updateGroup(context, payload) {
        return new Promise((resolve, reject) => {
            axios.put(`/api/staff-groups/${payload.id}`, payload)
            .then(response => {
                //context.commit('updateGroup', response.data)
                context.dispatch('retrieveGroups')
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    deleteGroup(context, id) {
        return new Promise((resolve, reject) => {
            axios.delete(`/api/staff-groups/${id}`)
            .then(response => {
                context.dispatch('retrieveGroups')
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