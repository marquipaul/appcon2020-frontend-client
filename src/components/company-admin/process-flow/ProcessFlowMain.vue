<template>
<div>
    <v-row>
      <v-col cols="12">
          <v-row class="my-n5">
            <v-col class="d-flex justify-start mt-2">
              Process Flow Management
            </v-col>
          <v-col class="d-flex justify-end">
            <v-tooltip left>
                <template v-slot:activator="{ on }">
                    <v-btn @click="createFlow" v-on="on" small fab color="success">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </template>
                <span>Create new Process Flow</span>
            </v-tooltip>
          </v-col>
          </v-row>
      </v-col>
      <v-col cols="12">
          <v-row justify="center">
              <v-col v-for="(item, index) in flows" :key="index" cols="12" :xl="column" :lg="column">
                <v-card>
                    <v-card-title>
                       {{item.queue_number}}. {{item.title}}
                       <v-spacer>
                       </v-spacer>
                           <v-checkbox @change="changeFinalProcess(item.id)" v-model="item.final_process" label="Final Process"></v-checkbox>
                    </v-card-title>
                    <v-card-text>
                        <v-row class="px-3">
                            <p>{{item.description}}</p> 
                        </v-row>
                        <v-row class="px-3" >
                            <v-chip class="ma-1" color="orange" text-color="white">
                                <v-avatar left class="orange darken-3">
                                    {{item.questions_count}}
                                </v-avatar>
                                Questions
                            </v-chip>
                            <v-chip class="ma-1" color="blue" text-color="white">
                                <v-avatar left class="blue darken-3">
                                    {{item.answers_count}}
                                </v-avatar>
                                Answers
                            </v-chip>
                            <v-chip class="ma-1" color="green" text-color="white">
                                <v-avatar left class="green darken-4">
                                    {{item.passed_count}}
                                </v-avatar>
                                Passed
                            </v-chip>
                            <v-chip class="ma-1" color="red" text-color="white">
                                <v-avatar left class="red darken-4">
                                    {{item.failed_count}}
                                </v-avatar>
                                Failed
                            </v-chip>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn @click="manageQuestions(item)" icon v-on="on" color="success">
                                    <v-icon >mdi-format-list-bulleted</v-icon>
                                </v-btn>
                            </template>
                            <span>Manage {{item.title}}'s Questionnaire</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn @click="updateFlow(item.id)" icon v-on="on" color="warning">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </template>
                            <span>Edit {{item.title}}</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn @click="deleteFlow(item)" v-on="on" icon color="error">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </template>
                            <span>Delete {{item.title}}</span>
                        </v-tooltip>
                    </v-card-actions>
                </v-card>
              </v-col>
          </v-row>
      </v-col>
  </v-row>
  <Create/>
  <Update/>
  <Delete/>
  <Question/>
</div>
</template>
<script>
import { mapGetters } from 'vuex'
import Create from './options/Create'
import Update from './options/Update'
import Delete from './options/Delete'
import Question from './question/QuestionMain'
import bus from '../../../event_bus'
export default {
    components: {
        Create,
        Update,
        Delete,
        Question
    },
    data() {
        return {
            loading: false
        }
    },
    mounted() {
        this.getDataFromApi()
    },
    watch: {
        currentUser: {
            handler() {
                this.getDataFromApi()
            },
            deep: true
        },
        // "item.final_process" : {
        //     handler() {
        //         this.changeFinalProcess();
        //     },
        //     deep: true
        // }
    },
    methods: {
        changeFinalProcess(id) {
            this.loading = true
        
            this.$store.dispatch('updateFinalFlow', {id: id})
                .then(res => {
                    this.loading = false
                    this.getDataFromApi()
                })
        },
        createFlow() {
            bus.$emit('createFlow')
        },
        updateFlow(id) {
            bus.$emit('updateFlow', id)
        },
        deleteFlow(item) {
            bus.$emit('deleteFlow', item)
        },
        manageQuestions(item) {
            bus.$emit('manageQuestions', item)
        },
        getDataFromApi() {
            this.loading = true

            this.$store.dispatch('retrieveFlows')
                .then(res => {
                    this.loading = false
                })
        },
    },
    computed:{
        column() {
            if (this.flows.length == 1) {
                return 12;
            } else if (this.flows.length == 2) {
                return 6;
            } else if (this.flows.length == 3) {
                return 4;
            } else if (this.flows.length == 4) {
                return 3;
            } else {
                return 4;
            }
        },
        ...mapGetters({
            flows:'retrieveFlows'
        }),
        currentUser(){
          return JSON.parse(this.$store.state.auth.currentUser)
        }
    },
}
</script>