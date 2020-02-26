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
          Update Account
          
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
                    <p class="mb-n1 subtitle-1 font-weight-bold">Full Name</p>
                    <v-text-field
                        solo
                        v-model="form.name"
                        v-validate="'required'"
                        :error-messages="errors.collect('name')"
                        label="Full Name"
                        data-vv-name="name"
                        required
                    ></v-text-field>
                </v-col>
                <v-col cols="12" class="mt-n5">
                    <p class="mb-n1 subtitle-1 font-weight-bold">E-Mail Address</p>
                    <v-text-field
                        solo
                        v-model="form.email"
                        v-validate="'required|email'"
                        :error-messages="errors.collect('email')"
                        label="E-Mail Address"
                        data-vv-name="email"
                        required
                    ></v-text-field>
                </v-col>
                <v-col cols="12" class="mt-n5">
                    <p class="mb-n1 subtitle-1 font-weight-bold">Mobile Number</p>
                    <v-text-field
                        solo
                        type="number"
                        v-model="form.mobile_number"
                        v-validate="'required'"
                        :error-messages="errors.collect('mobile number')"
                        label="Mobile Number"
                        data-vv-name="mobile number"
                        required
                    ></v-text-field>
                </v-col>
                <v-col cols="6" class="mt-n5">
                    <p class="mb-n1 font-weight-bold">Account Type</p>
                    <v-select
                        v-validate="'required'"
                        :error-messages="errors.collect('account type')"
                        data-vv-name="account type"
                        v-model="form.user_type" 
                        :items="[{text: 'Company Admin', value: 'company_admin'}, {text: 'Hospital Admin', value: 'hospital_admin'}, {text: 'Staff', value: 'staff1'}]" 
                        item-text="text"
                        item-value="value"
                        solo 
                        label="Select Account Type" 
                        required>
                    </v-select>
                </v-col>
                <v-col cols="6" class="mt-n5">
                    <p class="mb-n1 subtitle-1 font-weight-bold">Gender</p>
                    <v-select
                        v-validate="'required'"
                        :error-messages="errors.collect('gender')"
                        data-vv-name="gender"
                        v-model="form.gender" 
                        :items="[{text: 'Male', value: 'male'}, {text: 'Female', value: 'female'}]" 
                        item-text="text"
                        item-value="value"
                        solo 
                        label="Select Gender" 
                        required>
                    </v-select>
                </v-col>
                <v-col cols="6" class="mt-n5">
                    <p class="mb-n1 subtitle-1 font-weight-bold">Blood Type</p>
                    <v-select
                        v-validate="'required'"
                        :error-messages="errors.collect('blood type')"
                        data-vv-name="blood type"
                        v-model="form.blood_type" 
                        :items="['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']" 
                        item-text="text"
                        item-value="value"
                        solo 
                        label="Select Blood Type" 
                        required>
                    </v-select>
                </v-col>
                <v-col cols="6" class="mt-n5">
                <v-menu
                    v-model="birthday"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                    <p class="mb-n6 subtitle-1 font-weight-bold">Birthday</p>
                    <v-text-field
                        v-validate="'required'"
                        :error-messages="errors.collect('birthday')"
                        data-vv-name='birthday'
                        v-model="form.birthday"
                        label="Select Birthday"
                        append-icon="mdi-calendar"
                        readonly
                        solo
                        v-on="on"
                    ></v-text-field>
                    </template>
                    <v-date-picker min="1900-01-01" :max="`${year}-01-01`" v-model="form.birthday" @input="birthday = false"></v-date-picker>
                </v-menu>
            </v-col>
            <v-col cols="12" class="mt-n12">
              <v-switch v-model="chagePassword" class="mx-2" label="Change Password"></v-switch>
            </v-col>
            <v-col cols="6" class="mt-n5" v-if="chagePassword">
                  <p class="mb-n1 subtitle-1 font-weight-bold">Password</p>
                  <v-text-field
                      ref="password"
                      solo
                      label="Password"
                      v-model="form.password"
                      v-validate="'required|min:8|verify_password'"
                      :error-messages="errors.collect('password')"
                      data-vv-name="password"
                      required
                      :type="pass1 ? 'text' : 'password'"
                      :append-icon="pass1 ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="pass1 = !pass1"
                  ></v-text-field>
              </v-col>
              <v-col cols="6" class="mt-n5" v-if="chagePassword">
                  <p class="mb-n1 subtitle-1 font-weight-bold">Confirm Password</p>
                  <v-text-field
                      solo
                      label="Retype Password"
                      v-model="form.password_confirmation"
                      v-validate="'required|min:8|confirmed:password'"
                      :error-messages="errors.collect('password_confirmation')"
                      data-vv-name="password_confirmation"
                      required
                      :type="pass2 ? 'text' : 'password'"
                      :append-icon="pass2 ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="pass2 = !pass2"
                  ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" :loading="loading" block outlined rounded small @click="submit">Save Account</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
  import Vue from 'vue';
  import VeeValidate from 'vee-validate'
  import bus from '../../../event_bus'
  Vue.use(VeeValidate)

  export default {
    $_veeValidate: {
      validator: 'new',
    },
    data() {
        return {
            chagePassword: false,
            snackbar: false,
            msg: '',
            color: 'success',
            loading: false,
            pass1: false,
            pass2: false,
            birthday: false,
            year: new Date().getFullYear(),
            dialog: false,
            date: new Date().toISOString().substr(0, 10),
            time: null,
            form: {},
        }
    },
    mounted () {
      this.$validator.localize('en', this.dictionary)
      bus.$on('updateAccount', (value) => {
        this.dialog = true
        this.getAccount(value)
      })
      this.$validator.extend('verify_password', {
        getMessage: field => `The password must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number, and one special character (E.g. , . _ & ? etc)`,
        validate: value => {
            var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
            return strongRegex.test(value);
        }
       });
    },
    methods: {
      getAccount(item) {
        this.loading = true
        this.$store.dispatch('retrieveAccount', item.id)
          .then(response => {
            this.form = response
            this.loading = false
          })
      },
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
                this.submitAccount()
              }
            })
        },
        submitAccount(){
          this.loading = true
            this.$store.dispatch('updateAccount', this.form)
                .then((response) => {
                    this.snackbar = true
                    this.msg = 'Account Successfully Updated'
                    this.color = 'success'
                    this.closeDialog()
                }).catch(error => {
                    console.log(error)
                     if (error.response.data.errors.email&&error.response.data.errors.mobile_number) {
                        this.snackbar = true
                        this.color = 'red'
                        this.msg = 'Mobile Number and E-mail has already been taken.'
                    } else if (error.response.data.errors.email) {
                        this.snackbar = true
                        this.color = 'red'
                        this.msg = error.response.data.errors.email[0]  
                    }  else if(error.response.data.errors.mobile_number) {
                        this.snackbar = true
                        this.color = 'red'
                        this.msg = error.response.data.errors.mobile_number[0]
                    }
                    this.loading = false
                })
        },
    }
  }
</script>