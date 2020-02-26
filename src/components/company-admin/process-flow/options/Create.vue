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
    <v-dialog v-model="dialog" scrollable persistent max-width="700px">
      <v-card>
        <v-card-title>
          Create New Process Flow
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
            <v-row>
                <v-col cols="12">
                    <p class="mb-n1 font-weight-bold">Queue Number</p>
                    <v-text-field
                        type="number"
                        solo
                        v-model="form.queue_number"
                        v-validate="'required'"
                        :error-messages="errors.collect('queue_number')"
                        label="Process Flow Queue Number Ex. 1, 2, or 3"
                        data-vv-name="queue_number"
                        required
                    ></v-text-field>
                </v-col>
                <v-col cols="12" class="mt-n7">
                    <p class="mb-n1 font-weight-bold">Title</p>
                    <v-text-field
                        solo
                        v-model="form.title"
                        v-validate="'required'"
                        :error-messages="errors.collect('title')"
                        label="Process Flow Title"
                        data-vv-name="title"
                        required
                    ></v-text-field>
                </v-col>
                <v-col cols="12" class="mt-n7">
                    <p class="mb-n1 font-weight-bold">Description</p>
                    <v-textarea
                        solo
                        v-model="form.description"
                        v-validate="'required'"
                        :error-messages="errors.collect('description')"
                        label="Process Flow Description"
                        data-vv-name="description"
                        required
                    ></v-textarea>
                </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" :loading="loading" block outlined rounded small @click="submit">Save Process Flow</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
  import Vue from 'vue';
  import VeeValidate from 'vee-validate'
  import bus from '../../../../event_bus'
  Vue.use(VeeValidate)

  export default {
    $_veeValidate: {
      validator: 'new',
    },
    data() {
        return {
            snackbar: false,
            msg: '',
            color: 'success',
            loading: false,
            form: {},
            dialog: false
        }
    },
    mounted () {
      this.$validator.localize('en', this.dictionary)
        bus.$on('createFlow', (value) => {
        this.dialog = true
      })
    },
    methods: {
      closeDialog() {
        this.dialog = false
        this.loading = false
        this.loading = false
        this.form = {}
        this.$validator.reset()
      },
        submit() {
          this.$validator.validateAll()
            .then(res => {
              if (res) {
                this.submitFlow()
              }
            })
        },
        submitFlow(){
          this.loading = true
            this.$store.dispatch('storeFlow', this.form)
                .then((response) => {
                    this.$store.dispatch('retrieveFlows')
                    this.snackbar = true
                    this.msg = 'Process Flow Successfully Created'
                    this.color = 'success'
                    this.closeDialog()
                }).catch(error => {
                    console.log(error)
                    this.snackbar = true
                    this.msg = 'Something went wrong'
                    this.color = 'error'
                    this.loading = false
                })
        },
    }
  }
</script>