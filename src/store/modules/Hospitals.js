/* eslint-disable */
import axios from 'axios'
const state  = {
    hospitals: [],
    selected_hospital: 0
};
const getters = {
    retrieveHospitals(state) {
        return state.hospitals
    },
    retrieveSelectedHospital(state) {
        return state.selected_hospital
    }
};
const mutations = {
    setHospitals(state, payload){
        state.hospitals = payload
    },
    setSelectedHospital(state, payload){
        state.selected_hospital = payload
    }
};
const actions = {
    setSelectedHospital(context, payload) {
        context.commit('setSelectedHospital', payload)
    },
    retrieveHospitals(context, params){
        return new Promise((resolve, reject) => {
            axios.get(`/api/hospitals`, {params: params})
            .then(response => {
                context.commit('setHospitals', response.data)
                resolve(response)
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