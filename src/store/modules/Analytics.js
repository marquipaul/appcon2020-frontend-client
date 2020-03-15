/* eslint-disable */
import axios from 'axios'
const state  = {
    per_month: [],
    gender_count: [],
    blood_type: {},
    blood_request: []
};
const getters = {
    retrievePerMonth(state) {
        return state.per_month
    },
    retrieveGenderCount(state) {
        return state.gender_count
    },
    retrieveBloodType(state) {
        return state.blood_type
    },
    retrieveBloodRequestAnalytics(state) {
        return state.blood_request
    },
};
const mutations = {
    setPerMonth(state, payload){
        state.per_month = payload.values
    },
    setGenderCount(state, payload) {
        state.gender_count = payload.values
    },
    setBloodTypeCount(state, payload) {
        state.blood_type = payload
    },
    setBloodRequestCount(state, payload) {
        state.blood_request = payload
    }
};
const actions = {
    retrievePerMonth(context, params){
        return new Promise((resolve, reject) => {
            axios.get(`/api/analytics/per-month`, {params: params})
            .then(response => {
                context.commit('setPerMonth', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    retrieveGenderCount(context) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/analytics/gender`)
            .then(response => {
                context.commit('setGenderCount', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    retrieveBloodType(context) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/analytics/blood-type`)
            .then(response => {
                context.commit('setBloodTypeCount', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    retrieveBloodRequestAnalytics(context) {
        return new Promise((resolve, reject) => {
            axios.get(`/api/analytics/blood-request`)
            .then(response => {
                context.commit('setBloodRequestCount', response.data)
                resolve(response)
                console.log(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    }
};


export default {
    state,
    getters,
    actions,
    mutations,
}