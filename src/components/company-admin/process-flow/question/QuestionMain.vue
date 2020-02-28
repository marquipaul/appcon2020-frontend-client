<template>
  <v-row>
      <v-snackbar
        v-model="snackbar"
        :color="color"
        multi-line
        right
        :timeout="6000"
        top
      >
      <v-icon large left>mdi-check-circle</v-icon>
        <span> {{msg}} </span>
        <v-btn
          dark
          text
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </v-snackbar>
    <v-dialog v-model="dialog" scrollable persistent max-width="900px">
      <v-card>
        <v-card-title>
          Manage {{form.title}}'s Questionnaire 
            <v-btn x-small :class="add? 'error ml-2' : 'success ml-2'" @click="add = !add">
              <v-icon left>{{add? 'mdi-minus' : 'mdi-plus'}}</v-icon> 
              {{add? 'Cancel' : 'Add New Question'}} 
            </v-btn>
          <v-spacer></v-spacer>
          <v-btn small fab icon @click="closeDialog"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-progress-linear
            height="2"
            :active="loading"
            :indeterminate="loading"
        ></v-progress-linear>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row v-if="add">
                <v-col cols="12">
                    <p class="mb-n1 font-weight-bold">Question Content</p>
                    <v-textarea
                        solo
                        v-model="question_form.content"
                        v-validate="'required'"
                        :error-messages="errors.collect('question')"
                        data-vv-name="question"
                        label="Question content"
                        required
                    ></v-textarea>
                </v-col>
                <v-col cols="12" class="mt-n7">
                    <p class="mb-n1 font-weight-bold">Question Type</p>
                    <v-select
                        v-validate="'required'"
                        :error-messages="errors.collect('question type')"
                        data-vv-name="question type"
                        v-model="question_form.question_type"
                        item-text="text"
                        item-value="value"
                        :items="items"
                        label="Question type"
                        solo
                    ></v-select>
                </v-col>
                <v-col v-if="question_form.question_type != 'text_response'&&question_form.question_type" cols="12" class="mt-n7">
                    <p class="mb-n1 font-weight-bold">Add Choice</p>
                    <v-text-field
                        v-model="choice"
                        label="Add Choices"
                        solo
                        append-icon="mdi-plus-circle"
                        @click:append="addChoice"
                    ></v-text-field>
                </v-col>
                <v-col cols="12" class="mt-n7" v-if="question_form.question_type != 'text_response'&&question_form.question_type">
                    <p class="mb-n1 font-weight-bold">Choices <span class="caption">Please select the correct answer (if any)</span></p>
                        <div class="mt-6" v-if="question_form.question_type == 'radio'">
                            <v-radio-group 
                                v-for="(choice, index) in question_form.options.choices"
                                :key="index" prepend-icon="mdi-cancel"
                                @click:prepend="removeChoice(index)"
                                v-model="question_form.options.correct" 
                                class="mt-n5">
                                <v-radio
                                    :label="choice"
                                    :value="choice"
                                ></v-radio>
                            </v-radio-group>
                        </div>
                        
                        <div class="mt-6" v-if="question_form.question_type == 'checkbox'">
                            <v-checkbox
                                v-model="question_form.options.correct"
                                v-for="(choice, index) in question_form.options.choices"
                                :key="index"
                                :label="choice" 
                                :value="choice"
                                class="mt-n6"
                                prepend-icon="mdi-cancel"
                                @click:prepend="removeChoice(index)"
                            ></v-checkbox>
                        </div>
                </v-col>
                <v-col cols="12">
                    <v-btn color="primary" :loading="loading" block outlined rounded small @click="submit">Submit</v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12">
                    <v-timeline
                        align-top
                        dense
                        >
                        <v-timeline-item
                            v-for="(item, index) in questions"
                            :key="index"
                            icon
                        >
                        <template v-slot:icon>
                            <v-avatar class="white--text font-weight-black">
                                {{index+1}}
                            </v-avatar>
                        </template>
                            <v-card v-if="editIndex == index" class="elevation-2">
                                <v-card-text>
                                    <v-row no-gutters>
                                        <v-col cols="11">
                                            <p class="mb-n1 font-weight-bold">Question Content</p>
                                                <v-textarea
                                                    solo
                                                    v-model="question_form.content"
                                                    v-validate="'required'"
                                                    :error-messages="errors.collect('question')"
                                                    data-vv-name="question"
                                                    label="Question content"
                                                    required
                                                ></v-textarea>
                                        </v-col>
                                        <v-col cols="1" class="d-flex justify-end">
                                            <v-btn @click="cancelEditQuestion()" color="error" small fab icon>
                                                <v-icon>mdi-close-circle</v-icon>
                                            </v-btn>
                                        </v-col>
                                        <v-col cols="12" class="mt-n5">
                                            <p class="mb-n1 font-weight-bold">Question Type</p>
                                            <v-select
                                                v-validate="'required'"
                                                :error-messages="errors.collect('question type')"
                                                data-vv-name="question type"
                                                v-model="question_form.question_type"
                                                item-text="text"
                                                item-value="value"
                                                :items="items"
                                                label="Question type"
                                                solo
                                            ></v-select>
                                        </v-col>
                                        <v-col v-if="question_form.question_type != 'text_response'&&question_form.question_type" cols="12" class="mt-n5">
                                            <p class="mb-n1 font-weight-bold">Add Choice</p>
                                            <v-text-field
                                                v-model="choice"
                                                label="Add Choices"
                                                solo
                                                append-icon="mdi-plus-circle"
                                                @click:append="addChoice"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" class="mt-n5" v-if="question_form.question_type != 'text_response'&&question_form.question_type">
                                            <p class="mb-n1 font-weight-bold">Choices <span class="caption">Please select the correct answer (if any)</span></p>
                                                <div class="mt-6" v-if="question_form.question_type == 'radio'">
                                                    <v-radio-group 
                                                        v-for="(choice, index) in question_form.options.choices"
                                                        :key="index" prepend-icon="mdi-cancel"
                                                        @click:prepend="removeChoice(index)"
                                                        v-model="question_form.options.correct" 
                                                        class="mt-n5">
                                                        <v-radio
                                                            :label="choice"
                                                            :value="choice"
                                                        ></v-radio>
                                                    </v-radio-group>
                                                </div>
                                                <div class="mt-6" v-if="question_form.question_type == 'checkbox'">
                                                    <v-checkbox
                                                        v-model="question_form.options.correct"
                                                        v-for="(choice, index) in question_form.options.choices"
                                                        :key="index"
                                                        :label="choice" 
                                                        :value="choice"
                                                        class="mt-n6"
                                                        prepend-icon="mdi-cancel"
                                                        @click:prepend="removeChoice(index)"
                                                    ></v-checkbox>
                                                </div>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-btn color="primary" :loading="loading" block outlined rounded small @click="submitUpdated">Submit</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
            <!-- DISPLAY ONLY     DISPLAY ONLY     DISPLAY ONLY      DISPLAY ONLY -->
                            <v-card v-else class="elevation-2">
                                <v-card-text>
                                    <v-row no-gutters>
                                        <v-col cols="10">
                                            <h3>{{item.content}}</h3> 
                                        </v-col>
                                        <v-col cols="2" class="d-flex justify-end">
                                            <v-btn @click="editQuestion(index, item)" color="success" x-small fab icon>
                                                <v-icon>mdi-pencil</v-icon>
                                            </v-btn>
                                            <v-btn @click="deleteQuestion(item)" color="error" x-small fab icon>
                                                <v-icon>mdi-delete</v-icon>
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <v-divider class="mb-5"></v-divider>
                                <v-card-text>
                                    <p class="mt-n5" v-if="item.question_type == 'text_response'">Text Response</p>
                                    <v-radio-group v-model="JSON.parse(item.options).correct" class="mt-n7" v-if="item.question_type == 'radio'">
                                        <v-radio
                                            v-for="(choice, index) in JSON.parse(item.options).choices"
                                            :key="index"
                                            :label="choice"
                                            :value="choice"
                                            disabled
                                        ></v-radio>
                                    </v-radio-group>
                                    <div class="mt-1" v-if="item.question_type == 'checkbox'">
                                        <v-checkbox
                                            v-model="JSON.parse(item.options).correct"
                                            disabled
                                            v-for="(choice, index) in JSON.parse(item.options).choices"
                                            :key="index"
                                            :label="choice"
                                            :value="choice"
                                            class="mt-n6"
                                        ></v-checkbox>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-timeline-item>
                        </v-timeline>
                </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <!-- <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" :loading="loading" block outlined rounded small @click="submit">Save Process Flow</v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>
    <Delete/>
  </v-row>
</template>
<script>
import { mapGetters } from 'vuex'
import Vue from 'vue';
import VeeValidate from 'vee-validate'
import bus from '../../../../event_bus'
import Delete from './options/Delete'
Vue.use(VeeValidate)

  export default {
      components: {
          Delete
      },
    $_veeValidate: {
      validator: 'new',
    },
    data() {
        return {
            editIndex: null,
            add: false,
            choice: '',
            snackbar: false,
            msg: '',
            color: 'success',
            loading: false,
            form: {},
            dialog: false,
            items: [
                {text: 'Radio Button', value: 'radio'}, 
                {text: 'Checkbox', value: 'checkbox'},
                {text: 'Text Response', value: 'text_response'}
            ],
            question_form: {
                process_flow_id: 0,
                content: '',
                question_type: '',
                options: {choices: [], correct: null}
            }
        }
    },
    watch: {
        'question_form.question_type': {
            handler() {
                if (this.question_form.question_type == 'checkbox') {
                    this.question_form.options.correct = []
                } else {
                    this.question_form.options.correct = null
                }
            },
            deep: true
        }
    },
    mounted () {
      this.$validator.localize('en', this.dictionary)
        bus.$on('manageQuestions', (value) => {
        this.dialog = true
        this.form = value
        console.log('request')
        // setTimeout(() => {
             this.getDataFromApi()
        // }, 500);
        
      })
    },
    methods: {
        deleteQuestion(item) {
            bus.$emit('deleteQuestion', item)
        },
        editQuestion(index, item) {
            this.add = false
            this.loading = true
            this.$store.dispatch('retrieveQuestion', item.id)
                .then(response => {
                    this.loading = false
                    console.log(response)
                    this.editIndex = index
                    this.question_form = {
                        id: response.id,
                        content: response.content,
                        question_type: response.question_type,
                        options: response.options?  JSON.parse(response.options) : {choices: [], correct: null}
                    }
                    console.log(this.question_form)
                    setTimeout(() => {
                        this.question_form.options.correct = response.options? JSON.parse(response.options).correct : null
                    }, 500);
                })
        },
        cancelEditQuestion() {
            this.editIndex = null
            this.clearFileds()
        },
        addChoice() {
            if (this.choice) {
                this.question_form.options.choices.push(this.choice)
                this.choice = ''
            }
        },
        removeChoice(index) {
            this.question_form.options.choices.splice(index, 1)
        },
      closeDialog() {
        this.dialog = false
        this.loading = false
        this.loading = false
        this.form = {}
        this.$validator.reset()
        this.clearFileds()
      },
      clearFileds() {
          this.question_form ={
                process_flow_id: 0,
                content: '',
                question_type: '',
                options: {choices: [], correct: null}
            }
            this.$validator.reset()
      },
        getDataFromApi() {
            this.loading = true

            this.$store.dispatch('retrieveQuestions', {process_flow_id: this.form.id})
                .then(res => {
                    this.loading = false
                    console.log(res)
                })
        },
        submit() {
          this.$validator.validateAll()
            .then(res => {
              if (res) {
                this.submitQuestion()
              }
            })
        },
        submitQuestion(){
          this.loading = true
          this.question_form.process_flow_id = this.form.id
          this.question_form.options = JSON.stringify(this.question_form.options)
          console.log(this.question_form)
            this.$store.dispatch('storeQuestion', this.question_form)
                .then((response) => {
                    this.$store.dispatch('retrieveFlows')
                    this.snackbar = true
                    this.msg = 'Question Successfully Created'
                    this.color = 'success'
                    this.loading = false
                    this.clearFileds()
                }).catch(error => {
                    console.log(error)
                    this.snackbar = true
                    this.msg = 'Something went wrong'
                    this.color = 'error'
                    this.loading = false
                })
        },
        submitUpdated() {
            this.$validator.validateAll()
            .then(res => {
              if (res) {
                this.submitUpdatedQuestion()
              }
            })
        },
        submitUpdatedQuestion() {
            this.loading = true
          this.question_form.process_flow_id = this.form.id
          this.question_form.options = JSON.stringify(this.question_form.options)
          console.log(this.question_form)
            this.$store.dispatch('updateQuestion', this.question_form)
                .then((response) => {
                    this.$store.dispatch('retrieveFlows')
                    this.snackbar = true
                    this.msg = 'Question Successfully Updated'
                    this.color = 'success'
                    this.loading = false
                    this.cancelEditQuestion()
                }).catch(error => {
                    console.log(error)
                    this.snackbar = true
                    this.msg = 'Something went wrong'
                    this.color = 'error'
                    this.loading = false
                })
        }
    },
    computed:{
        ...mapGetters({
            questions:'retrieveQuestions'
        }),
    },
  }
</script>