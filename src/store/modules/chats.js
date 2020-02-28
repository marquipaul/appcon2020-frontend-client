/* eslint-disable */
import axios from 'axios'
import Vue from 'vue'
const state  = {
    chats: [],
    friends: [],
    unread_count: 0
};
const getters = {
    retrieveChats(state) {
        return state.chats
    },
    retrieveUnreadCount(state) {
        return state.unread_count
    }
};
const mutations = {
    retrieveChats(state, payload){
        state.chats = payload.data
        state.unread_count = payload.unread
    },
    retrieveFriends(state, payload) {
        state.friends = payload
    },
    pushChat(state, payload) {
        state.chats.push(payload)
    },
    clearConversations(state) {
        state.chats = []
    },
    addUnreadCount(state) {
        state.unread_count++
    }
    // updateBrand(state, payload) {
    //     let updateIndex = state.events.findIndex(item => item.id === payload.id);
    //     Vue.set(state.events, updateIndex, payload)
    // },
    // deleteBrand(state, id) {
    //     let deleteIndex = state.events.findIndex(item => item.id === id);
    //     state.events.splice(deleteIndex, 1)
    // }
};
const actions = {
    retrieveGroupConversations(context, params){
        //context.commit('clearConversations')
        return new Promise((resolve, reject) => {
            axios.get(`/api/group/conversation`, {params: params})
            .then(response => {
                context.commit('retrieveChats', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    clearConversations(context) {
        context.commit('clearConversations')
    },
    retrieveFriends(context){
        return new Promise((resolve, reject) => {
            axios.get(`/api/friends`)
            .then(response => {
                context.commit('retrieveFriends', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    sendChat(context, form){
        return new Promise((resolve, reject) => {
            axios.post('/api/send-chat', form)
            .then(response => {
                //context.state.products.push(response.data.responseData);
                context.commit('pushChat' , response.data)
                resolve(response)
            })
            .catch(error => {
                console.log(error)
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