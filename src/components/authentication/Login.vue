<template>
      <v-container
        fluid
        fill-height
      >
        <v-snackbar v-model="admin_error" :timeout="4000" top right multi-line="multi-line" color="error">
            <span>{{error_content}}</span>
            <v-btn text color="white" @click="admin_error = false">Close</v-btn>
        </v-snackbar>
        <v-layout
          align-center
          justify-center
        >
          <v-flex
            xs12
            sm8
            md4
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>BloodDrive</v-toolbar-title>
                <v-spacer></v-spacer>

              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Username"
                    name="login"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="form.username"
                  ></v-text-field>

                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="form.password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="form.username&&form.password ? false : true"
                  block 
                  color="primary white--text" 
                  @click="authenticate" 
                  :loading="loading">
                  Login
                  </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

</template>

<script>
/* eslint-disable */
  export default {
    data() {
      return {
        loading: false,
        error_content: '',
        admin_error: false,
        isLoading: false,
        form: {
          username: '',
          password: ''
        },
      }
    },

    methods: {
        authenticate() {
            this.loading = true
            this.$store.dispatch('retrieveToken', this.$data.form)
            .then(response => {
                this.loader = false
                this.loading = false
                this.$router.push({path: '/dashboard'});
                //console.log(response)
            }).catch(error => {
                this.error_content = error
                this.admin_error = true
                this.loading = false
                })
            },
        },
  }
</script>
