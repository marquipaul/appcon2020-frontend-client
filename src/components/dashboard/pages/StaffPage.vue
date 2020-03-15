<template>
  <v-row id="create">
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
        <v-card min-height="700">
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
                                            <v-col cols="9">
                                                <h3>{{item.content}}</h3> 
                                            </v-col>
                                            <!-- <v-col v-if="transaction.answer" cols="2" class="d-flex justify-end">
                                                <v-chip small class="overline" :color="item.status=='passed'? 'success' : 'error'">
                                                    {{item.status}}
                                                </v-chip>
                                            </v-col> -->
                                            <v-col cols="3" class="d-flex justify-end mt-n5">
                                                <v-radio-group v-if="!item.correct" v-model="item.status" row>
                                                    <v-radio color="success" label="Passed" value="passed"></v-radio>
                                                    <v-radio color="error" label="Failed" value="failed"></v-radio>
                                                </v-radio-group>
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
                        <v-btn v-if="transaction.process_flow? transaction.process_flow.final_process? failed? true : false : true : true" @click="submitAnswer" :loading="loadingData" block outlined rounded color="primary">
                            {{transaction.answer? 'Update Answer' : 'Submit Answer'}}
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <v-card class="mt-5" v-if="transaction.process_flow? transaction.process_flow.final_process? failed? false : true : false : false">
            <v-card-title>Blood Extraction Details
                <v-tooltip bottom v-if="agreedDisable">
                    <template v-slot:activator="{ on }">
                        <v-icon :size="25" v-on="on">mdi-information</v-icon>
                    </template>
                    <span>If you wish to update this information you have to ask the Company Admin First</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-chip class="text-uppercase"> Blood Type: {{extract_form.blood_type}}</v-chip>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="6">
                            <p class="mb-n1 font-weight-bold">Serial Number</p>
                            <v-text-field
                                class="mt-1"
                                solo
                                v-model="extract_form.serial_number"
                                v-validate="'required'"
                                :error-messages="errors.collect('serial number')"
                                label="Enter Serial Number"
                                data-vv-name="serial number"
                                required
                                :readonly="agreedDisable"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <p class="mb-n1 font-weight-bold">Blood Bag</p>
                            <v-text-field
                                class="mt-1"
                                solo
                                v-model="extract_form.blood_bag"
                                v-validate="'required'"
                                :error-messages="errors.collect('blood bag')"
                                label="Enter Blood Bag"
                                data-vv-name="blood bag"
                                required
                                :readonly="agreedDisable"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="3">
                            <p class="mb-n1 font-weight-bold">Number of Units</p>
                            <v-text-field
                                class="mt-1"
                                solo
                                v-model="extract_form.number_of_units"
                                v-validate="'required'"
                                :error-messages="errors.collect('number of units')"
                                label="Enter Number of Units"
                                data-vv-name="number of units"
                                required
                                :readonly="agreedDisable"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <p class="mb-n1 font-weight-bold">Donor Name
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-icon :size="17" v-on="on">mdi-information</v-icon>
                                </template>
                                <span>By entering the name of the patient, The patient must agree to the terms and privacy policy of BloodDrivePH.</span>
                            </v-tooltip>
                            </p>
                            <v-text-field
                                class="mt-1"
                                solo
                                v-model="extract_form.donor_name"
                                v-validate="'required'"
                                :error-messages="errors.collect('donor name')"
                                label="Enter Donor Name"
                                data-vv-name="donor name"
                                required
                                :readonly="agreedDisable"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <p class="mb-n1 font-weight-bold">Philebotomist
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-icon :size="17" v-on="on">mdi-information</v-icon>
                                </template>
                                <span>By entering your name, All of the information provided must be correct and the patient must agree to the terms and privacy policy of BloodDrivePH.</span>
                            </v-tooltip>
                            </p>
                            <v-text-field
                                class="mt-1"
                                solo
                                v-model="extract_form.philebotomist"
                                v-validate="'required'"
                                :error-messages="errors.collect('philebotomist')"
                                label="Enter Philebotomiste"
                                data-vv-name="philebotomist"
                                required
                                :readonly="agreedDisable"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-card outlined>
                                <v-card-text>
                                    <v-checkbox
                                        :disabled="agreedDisable"
                                        v-model="agreed"
                                        label="Check here to indicate that you and the patient have read and agree to the terms and privacy policy of BloodDrivePH"
                                    ></v-checkbox>
                                    <v-btn class="text-capitalize" text small color="blue darken-3">Terms of Use and Privacy Policy</v-btn>
                                </v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="12">
                            <v-btn :disabled="!agreed||agreedDisable" @click="submitAnswer" :loading="loadingData" block outlined rounded color="primary">
                                Submit Extraction
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
        </v-card>
      </v-col>
    <GroupChat/>
  </v-row>
</template>
<script>
var moment = require('moment')
import { mapGetters } from 'vuex'
import GroupChat from './GroupChat'
import _ from "lodash";
export default {
    components: {
        GroupChat
    },
    data() {
        return {
            failed: false,
            agreed: false,
            agreedDisable: false,
            direction: 'top',
            fab: false,
            fling: false,
            hover: false,
            tabs: null,
            top: false,
            right: true,
            bottom: true,
            left: false,
            transition: 'slide-y-reverse-transition',
      ////
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
            color: 'success',
            extract_form: {}
        };
    },
    mounted() {
        this.getPendingTransactions()
    },
    watch: {
        process_flow: {
            handler() {
                var count = 0;
                for (let index = 0; index < this.process_flow.questions.length; index++) {
                    const element = this.process_flow.questions[index];
                    if(element.status == 'failed')
                        count++;
                }

                if (count > 0) {
                    this.failed = true
                } else {
                    this.failed = false
                }
                console.log(this.failed? 'failed' : 'success')
            },
            deep: true
        },
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
                            if (element.correct) {
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
                                this.loadingData = false
                                this.snackbar = true
                                this.color = resultStatus? 'success' : 'error',
                                this.msg = `${resultStatus? 'Donor Passed the Evaluation :)' : 'Donor Failed the Evaluation :('}`
                                
                                //determine if the process flow is the final process and if passed
                                if (this.transaction.process_flow? this.transaction.process_flow.final_process? this.failed? false : true : false : false) {
                                    this.submitExtraction(response.data)
                                }

                                this.getPendingTransactions()
                                this.getTransaction()
                            })
                            .catch(error => {
                                this.loadingData = false
                                this.snackbar = true
                                this.color = 'error',
                                this.msg = error.response.data.msg
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
        submitExtraction(transactionData) {
            //submit extraction
            console.log('ExtractionData', this.extract_form)
            console.log('TransactionData', transactionData)
            var form = {
                blood_request_id: this.transaction.blood_request_id,
                staff_group_id: this.transaction.staff_group_id,
                donor_id: this.transaction.donor_id,
                staff_id: this.transaction.staff_id,
                donor_name: this.extract_form.donor_name,
                philebotomist: this.extract_form.philebotomist,
                serial_number: this.extract_form.serial_number,
                blood_bag: this.extract_form.blood_bag,
                number_of_units: this.extract_form.number_of_units
            }

            console.log('formExtract', form)
            
            this.$store.dispatch('storeExtraction', form)
                .then(response => {
                    console.log('extractResponse', response)
                })
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
                        process_flow_id: this.transaction.process_flow_id,
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
                            donor_id: this.transaction.donor_id,
                            staff_id: this.transaction.staff_id,
                            answer_id: null,
                            process_flow_id: this.transaction.process_flow_id,
                            status: 'passed' 
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
                            donor_id: this.transaction.donor_id,
                            staff_id: this.transaction.staff_id,
                            answer_id: null,
                            process_flow_id: this.transaction.process_flow_id,
                            status: 'passed' 
                        }
                        let updateIndex = this.process_flow.questions.findIndex(item => item.id === question.id);
                        this.$set(this.process_flow.questions, updateIndex, newData)
                    }
                })
            }

            if (this.transaction.blood_request.blood_extraction) {
                this.extract_form = this.transaction.blood_request.blood_extraction
                this.agreed = true
                this.agreedDisable = true
            } else {
                this.extract_form = {}
                this.agreed = false
                this.agreedDisable = false
            }
            
            
        }
    },

    computed: {
        ...mapGetters({
            transactions:'retrieveTransactions',
            last_page: 'retrieveLastPageTransaction',
        }),
        chats(){
            return this.$store.getters['retrieveChats']
        },
    }

}
</script>
<style>
  /* This is for documentation purposes and will not be needed in your application */
  #create .v-speed-dial {
    position: absolute;
  }

  #create .v-btn--floating {
    position: relative;
  }
</style>