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
    <v-dialog v-model="dialog" scrollable persistent max-width="500px">
      <v-card outlined>
        <v-card-title>
          Update Group
          <v-spacer></v-spacer>
          <v-btn small fab icon @click="closeDialog"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-progress-linear
            height="2"
            :active="loading"
            :indeterminate="loading"
        ></v-progress-linear>
        <v-divider></v-divider>
        <v-card-text class="mb-n10">
          <v-container>
            <v-row>
                <v-col cols="12">
                    <p class="mb-n1 font-weight-bold">Group Name</p>
                    <v-text-field
                        solo
                        v-model="form.group_name"
                        v-validate="'required'"
                        :error-messages="errors.collect('group name')"
                        label="Enter Group Name"
                        data-vv-name="group name"
                        required
                    ></v-text-field>
                </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="primary" :loading="loading" block outlined rounded small @click="submit">Save Group</v-btn>
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
            dialog: false,
            form: {},
        }
    },
    mounted () {
      this.$validator.localize('en', this.dictionary)
        bus.$on('updateGroup', (value) => {
        this.dialog = true
        this.getGroup(value)
      })
    },
    methods: {
      getGroup(item) {
        this.loading = true
        this.$store.dispatch('retrieveGroup', item.id)
            .then((response) => {
                this.form = {
                    id: response.id,
                    group_name: response.group_name
                }
                this.loading = false
            }).catch(error => {
                console.log(error)
                this.snackbar = true
                this.msg = 'Something went wrong :('
                this.color = 'error'
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
                this.submitGroup()
              }
            })
        },
        submitGroup() {
          this.loading = true
            this.$store.dispatch('updateGroup', this.form)
                .then((response) => {
                    this.snackbar = true
                    this.msg = 'Group Successfully Updated'
                    this.color = 'success'
                    this.closeDialog()
                }).catch(error => {
                    console.log(error)
                    this.snackbar = true
                    this.msg = 'Something went wrong :('
                    this.color = 'error'
                    this.loading = false
                })
        },
    }
  }
</script>