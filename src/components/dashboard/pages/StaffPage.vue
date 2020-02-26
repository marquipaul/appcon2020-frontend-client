<template>
  <v-row>
      <v-snackbar
        bottom
        right
        v-model="snackbar"
        :color="color"
            >
            {{msg}}
            <v-btn
                color="white"
                text
                @click="snackbar = false"
            >
                Close
            </v-btn>
        </v-snackbar>
      <v-col cols="12" xl="4" lg="4" md="12" sm="12">
           <v-card class="mx-auto" tile>
          <v-list two-line>
              <v-subheader>
                  TRANSACTIONS
              </v-subheader>
                <v-divider></v-divider>
                <v-subheader class="mt-2 mb-2">
                    <v-text-field 
                        dense
                        hide-details
                        solo
                        append-icon="mdi-magnify"
                        v-model="search"
                        label="Search">
                    </v-text-field>
                </v-subheader>
                <v-progress-linear
                    height="1"
                    indeterminate
                    v-if="loading"
                ></v-progress-linear>
                <v-divider v-else></v-divider>
                  <v-list-item-group v-model="selected" v-if="transactions.length != 0" class="mt-2" color="primary">
                          <v-list-item
                              v-for="(item, i) in transactions"
                              :key="i"
                              active-class="highlighted"
                              >
                              <v-list-item-content>
                                  <v-list-item-title v-text="item.donor.name"></v-list-item-title>
                                  <v-list-item-subtitle>
                                    {{moment(item.blood_request.schedule).format('LLL')}}
                                    <v-chip x-small class="overline">{{item.status}}</v-chip>
                                  </v-list-item-subtitle>
                              </v-list-item-content>
                              
                              </v-list-item>
                              <v-divider></v-divider>
                          <div class="text-center">
                              <v-pagination
                              v-model="page"
                              :length="last_page"
                              circle
                              ></v-pagination>
                          </div>
                  </v-list-item-group>
                  <v-list-item-group v-else class="mt-2" color="primary">
                          <v-list-item>
                              <v-list-item-content>
                                  <v-list-item-title class="grey--text text-center">No Result</v-list-item-title>
                              </v-list-item-content>
                              
                              </v-list-item>
                              <v-divider></v-divider>
                          <div class="text-center">
                              <v-pagination
                              v-model="page"
                              :length="last_page"
                              circle
                              ></v-pagination>
                          </div>
                  </v-list-item-group>
                </v-list>
            </v-card>
      </v-col>
      <v-col cols="12" xl="8" lg="8" md="12" sm="12">
        <v-card>
            <v-card-title>
                {{selected!=null? selected_transaction.donor.name : 'Select a Transaction'}}
                <v-spacer></v-spacer>
                <span v-if="transaction.answer" class="subtitle-1 mr-2">Evaluation Result: </span>
                <v-chip v-if="transaction.answer" class="body text-uppercase" :color="transaction.answer.status=='passed'? 'success' : 'error'">
                    {{transaction.answer.status}}
                </v-chip>
            </v-card-title>
            
            <v-divider></v-divider>
            <v-progress-linear
                height="2"
                indeterminate
                v-if="loadingData"
            ></v-progress-linear>
            <v-card-text>
                <v-row>
                    <v-col cols="12">
                       <h3>{{process_flow.title}}</h3> 
                    </v-col>
                    <v-col cols="12">
                        {{process_flow.description}}
                    </v-col>
                </v-row>
                <v-row v-if="selected!=null">
                    <v-col cols="12">
                        <v-timeline
                            align-top
                            dense
                            >
                            <v-timeline-item
                                v-for="(item, index) in process_flow.questions"
                                :key="index"
                                icon
                            >
                            <template v-slot:icon>
                                <v-avatar class="white--text font-weight-black">
                                    {{index+1}}
                                </v-avatar>
                            </template>
                                <v-card class="elevation-1">
                                    <v-card-text>
                                        <v-row no-gutters>
                                            <v-col cols="10">
                                                <h3>{{item.content}}</h3> 
                                            </v-col>
                                            <v-col v-if="transaction.answer" cols="2" class="d-flex justify-end">
                                                <v-chip small class="overline" :color="item.status=='passed'? 'success' : 'error'">
                                                    {{item.status}}
                                                </v-chip>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                    <v-divider class="mb-5"></v-divider>
                                    <v-card-text>
                                        <v-textarea
                                            v-if="item.question_type == 'text_response'"
                                            label="Text Response"
                                            solo
                                            v-model="item.answer"
                                            :disabled="status"
                                            v-validate="'required'"
                                            :error-messages="errors.collect(`Answer of question no. ${index + 1}`)"
                                            :data-vv-name="`Answer of question no. ${index + 1}`"
                                            ></v-textarea>
                                        <v-radio-group 
                                            v-model="item.answer" 
                                            class="mt-n7" 
                                            v-if="item.question_type == 'radio'"
                                            v-validate="'required'"
                                            :error-messages="errors.collect(`Answer of question no. ${index + 1}`)"
                                            :data-vv-name="`Answer of question no. ${index + 1}`">
                                            <v-radio
                                                v-for="(choice, index) in JSON.parse(item.options).choices"
                                                :key="index"
                                                :label="choice"
                                                :value="choice"
                                            ></v-radio>
                                        </v-radio-group>
                                        <div class="mt-1" v-if="item.question_type == 'checkbox'">
                                            <v-checkbox
                                                v-model="item.answer"
                                                v-for="(choice, index) in JSON.parse(item.options).choices"
                                                :key="index"
                                                :label="choice"
                                                :value="choice"
                                                class="mt-n6"
                                            ></v-checkbox>
                                            <p class="caption red--text" v-show="errors.has(`check${index}`)">{{ errors.first(`check${index}`) }}</p>
                                        </div>
                                    </v-card-text>
                                </v-card>
                            </v-timeline-item>
                        </v-timeline>
                        <v-btn @click="submitAnswer" :loading="loadingData" block outlined rounded color="primary">
                            {{transaction.answer? 'Update Answer' : 'Submit Answer'}}
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
      </v-col>
  </v-row>
</template>
<script>
var moment = require('moment')
import { mapGetters } from 'vuex'
import _ from "lodash";
export default {
    data() {
        return {
            selected: null,
            selected_transaction: {},
            transaction: {},
            process_flow: {},
            moment:moment,
            loading: false,
            loadingData: false,
            search: '',
            page: 1,
            snackbar: false,
            msg: '',
            color: 'success'
        };
    },
    mounted() {
        this.getPendingTransactions()
    },
    watch: {
        selected: {
            handler() {
                console.log(this.selected)
                this.selected_transaction = this.transactions[this.selected]
                console.log(this.selected_transaction)
                if (this.selected!=null) {
                    this.getTransaction()
                } else {
                    this.process_flow = {}
                }
            },
            deep: true
        },
        page: {
            handler () {
            this.getPendingTransactions()
            },
            deep: true
        },
        search: _.debounce(
            function() {
                this.getPendingTransactions();
            },
            800,
            {
                leading: true,
                trailing: true
            }
        ),
    },
    methods: {
        submitAnswer() {
            this.process_flow.questions.forEach((group,index) => {
                if (group.question_type == 'checkbox') {
                    if (group.answer.length == 0) {
                        this.errors.add({
                            field: `check${index}`,
                            msg: 'Please check at least one answer'
                        });
                    } else {
                        this.errors.remove(`check${index}`)
                    }
                }
            });
        
            
            this.$validator.validateAll().then(res => {
                if (res) {
                    if (this.errors.items.length == 0) {
                        this.loadingData = true
                        var resultStatus = true
                        for (let index = 0; index < this.process_flow.questions.length; index++) {
                            const element = this.process_flow.questions[index];
                            //Determine if the ANSWERED QUESTION's result id passed or failed based on the answer
                            if (element.question_type == 'checkbox') {
                                if (this.arraysEqual(element.answer, element.correct)) {
                                    this.$set(this.process_flow.questions[index], 'status', 'passed')
                                } else {
                                    this.$set(this.process_flow.questions[index], 'status', 'failed')
                                }
                            } else {
                                if (element.answer == element.correct) {
                                    this.$set(this.process_flow.questions[index], 'status', 'passed')
                                } else {
                                    this.$set(this.process_flow.questions[index], 'status', 'failed')
                                }
                            }

                            if (this.process_flow.questions[index].status == 'failed') {
                                resultStatus = false
                            }
                        }
                        //Determine if the ANSWER passed or failed based on the answed questions
                       
                        var form = {
                            id: this.transaction.answer? this.transaction.answer.id : null, 
                            transaction_id: this.transaction.id,
                            blood_request_id: this.transaction.blood_request_id,
                            staff_group_id: this.transaction.staff_group_id,
                            process_flow_id: this.transaction.process_flow_id,
                            donor_id: this.transaction.donor_id,
                            staff_id: this.transaction.staff_id,
                            status: resultStatus? 'passed' : 'failed',
                            questions:  this.process_flow.questions
                        }
                        console.log(form)
                        this.$store.dispatch(`${this.transaction.answer? 'updateAnswer' : 'submitAnswer'}`, form)
                            .then(response => {
                                console.log(response)
                                this.loadingData = false
                                this.snackbar = true
                                this.color = resultStatus? 'success' : 'error',
                                this.msg = `${resultStatus? 'Donor Passed the Evaluation :)' : 'Donor Failed the Evaluation :('}`
                                this.getPendingTransactions()
                                this.getTransaction()
                            })
                                
                    } else {
                        this.snackbar = true
                        this.color = 'red',
                        this.msg = 'Please answer all the questions :('
                    }
                } else {
                    this.snackbar = true
                    this.color = 'red',
                    this.msg = 'Please answer all the questions :('
                }
                
            })
            console.log(this.errors.items.length)
        },
        arraysEqual(_arr1, _arr2) {
            if (!Array.isArray(_arr1) || ! Array.isArray(_arr2) || _arr1.length !== _arr2.length)
            return false;
            var arr1 = _arr1.concat().sort();
            var arr2 = _arr2.concat().sort();
            for (var i = 0; i < arr1.length; i++) {
                if (arr1[i] !== arr2[i])
                    return false;
            }
            return true;
        },
        getPendingTransactions() {
            this.loading = true
            let params = {
                my_transactions: true,
                search: this.search,
                page: this.page,
                per_page: 15,
                sort_by: 'created_at',
                sort_order: 'asc',
            }
            this.$store.dispatch('retrieveTransactions', params)
                .then(res => {
                    this.loading = false
                })
        },
        getTransaction() {
            this.loadingData = true
            this.$store.dispatch('retrieveTransaction', this.selected_transaction.id)
                .then(response => {
                    this.process_flow = response.process_flow
                    this.transaction = response
                    //this.process_flow = response
                    this.loadingData = false
                    this.getPendingTransactions()
                    this.formatQuestions()
                })
        },
        formatQuestions() {
            if (this.transaction.answer) {
                this.transaction.answer.answered_questions.forEach((result) => {
                    let newData= {
                        id: result.id,
                        content: result.question.content,
                        options: result.question.options,
                        question_type: result.question.question_type,
                        answer: JSON.parse(result.answer),
                        correct: JSON.parse(result.question.options).correct,
                        status: result.status,
                        donor_id: this.transaction.donor_id,
                        staff_id: this.transaction.staff_id,
                        answer_id: null,
                        process_flow_id: this.transaction.process_flow_id
                    }
                    let updateIndex = this.process_flow.questions.findIndex(item => item.id === result.question.id);
                    this.$set(this.process_flow.questions, updateIndex, newData)
                })
            }
            else {
                this.process_flow.questions.forEach((question) => {
                    if (question.question_type == 'checkbox') {
                        let newData= {
                            id: question.id,
                            content: question.content,
                            options: question.options,
                            question_type: question.question_type,
                            answer: [],
                            correct: JSON.parse(question.options).correct,
                            status: null,
                            donor_id: this.transaction.donor_id,
                            staff_id: this.transaction.staff_id,
                            answer_id: null,
                            process_flow_id: this.transaction.process_flow_id
                        }
                        let updateIndex = this.process_flow.questions.findIndex(item => item.id === question.id);
                        this.$set(this.process_flow.questions, updateIndex, newData)
                    } else {
                        let newData= {
                            id: question.id,
                            content: question.content,
                            options: question.options,
                            question_type: question.question_type,
                            answer: '',
                            correct: JSON.parse(question.options).correct,
                            status: null,
                            donor_id: this.transaction.donor_id,
                            staff_id: this.transaction.staff_id,
                            answer_id: null,
                            process_flow_id: this.transaction.process_flow_id
                        }
                        let updateIndex = this.process_flow.questions.findIndex(item => item.id === question.id);
                        this.$set(this.process_flow.questions, updateIndex, newData)
                    }
                })
            }
            
        }
    },

    computed: {
        ...mapGetters({
            transactions:'retrieveTransactions',
            last_page: 'retrieveLastPageTransaction',
        }),
    }

}
</script>