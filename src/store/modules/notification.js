/* eslint-disable */
import axios from 'axios'
import Vue from 'vue'
const state  = {
    notifications: [],
};
const getters = {
    retrieveNotifications(state) {
        return state.notifications
    }
};
const mutations = {
    pushNotification(state, payload){
        state.notifications.unshift(payload)
    },
    setNotifications(state, payload){
        state.notifications = payload
    },
    readNotification(state, id) {
        let removeIndex = state.notifications.findIndex(item => item.id === id);
        state.notifications.splice(removeIndex, 1)
    }
};
const actions = {
    pushNotification(context, data){
        context.commit('pushNotification', data)
    },
    retrieveNotifications(context, params){
        return new Promise((resolve, reject) => {
            axios.get(`/api/notifications`, {params: params})
            .then(response => {
                context.commit('setNotifications', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    readNotification(context, id) {
        return new Promise((resolve, reject) => {
            axios.put(`/api/notifications/${id}`, {})
            .then(response => {
                context.commit('readNotification', id)
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