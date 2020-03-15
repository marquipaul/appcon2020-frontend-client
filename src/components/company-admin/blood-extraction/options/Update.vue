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
    <v-dialog v-model="dialog" scrollable persistent max-width="600px">
      <v-card>
        <v-card-title>
          Update Extraction
          
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
                    ></v-text-field>
                </v-col>
                <v-col cols="6" class="mt-n7">
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
                    ></v-text-field>
                </v-col>
                <v-col cols="6" class="mt-n7">
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
                    ></v-text-field>
                </v-col>
                <v-col cols="12" class="mt-n7">
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
                    ></v-text-field>
                </v-col>
                <v-col cols="12" class="mt-n7">
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
                    ></v-text-field>
                </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" :loading="loading" block outlined rounded small @click="submit">Save Extraction</v-btn>
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
            extract_form: {},
            dialog: false
        }
    },
    mounted () {
      this.$validator.localize('en', this.dictionary)
      bus.$on('updateExtraction', (value) => {
        this.dialog = true
        this.getExtraction(value)
      })
    },
    methods: {
      getExtraction(item) {
        this.loading = true
        this.$store.dispatch('retrieveExtraction', item.id)
          .then(response => {
            this.extract_form = response
            this.loading = false
          })
      },
      closeDialog() {
        this.dialog = false
        this.loading = false
        this.loading = false
        this.extract_form = {}
        this.$validator.reset()
      },
        submit() {
          this.$validator.validateAll()
            .then(res => {
              if (res) {
                this.submitExtraction()
              }
            })
        },
        submitExtraction(){
          this.loading = true
            this.$store.dispatch('updateExtraction', this.extract_form)
                .then((response) => {
                    this.snackbar = true
                    this.msg = 'Blood Extraction Successfully Updated'
                    this.color = 'success'
                    this.closeDialog()
                }).catch(error => {
                    console.log(error)
                    this.loading = false
                })
        },
    }
  }
</script>