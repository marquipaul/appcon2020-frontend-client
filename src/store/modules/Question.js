/* eslint-disable */
import axios from 'axios'
import Vue from 'vue'
const state  = {
    question: {},
    questions: [],
    //total: 0
};
const getters = {
    retrieveQuestions(state) {
        return state.questions
    },
    retrieveQuestion(state) {
        return state.question
    }
};
const mutations = {
    setQuestions(state, payload){
        state.questions = payload
    },
    setQuestion(state, payload) {
        state.question = payload
    },
    pushQuestion(state, payload) {
        state.questions.push(payload)
    },
    updateQuestion(state, payload) {
        let updateIndex = state.questions.findIndex(item => item.id === payload.id);
        Vue.set(state.questions, updateIndex, payload)
    },
    deleteQuestion(state, id) {
        let deleteIndex = state.questions.findIndex(item => item.id === id);
        state.questions.splice(deleteIndex, 1)
    }
};
const actions = {
    retrieveQuestions(context, params){
        return new Promise((resolve, reject) => {
            axios.get(`/api/questions`, {params: params})
            .then(response => {
                context.commit('setQuestions', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    retrieveQuestion(context, id){
        return new Promise((resolve, reject) => {
            axios.get(`/api/questions/${id}`)
            .then(response => {
                context.commit('setQuestion', response.data)
                resolve(response.data)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    storeQuestion(context, payload) {
        return new Promise((resolve, reject) => {
            axios.post(`/api/questions`, payload)
            .then(response => {
                context.commit('pushQuestion', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    updateQuestion(context, payload) {
        return new Promise((resolve, reject) => {
            axios.put(`/api/questions/${payload.id}`, payload)
            .then(response => {
                context.commit('updateQuestion', response.data)
                resolve(response)
            })
            .catch(error => {
                reject(error)
            })
        }) 
    },
    deleteQuestion(context, id) {
        return new Promise((resolve, reject) => {
            axios.delete(`/api/questions/${id}`)
            .then(response => {
                context.commit('deleteQuestion', id)
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