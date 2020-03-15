<template>
    <v-row>
        <v-col cols="12">
            Blood Extraction Management
        </v-col>
        <v-col cols="12">
            <v-card>
                <v-card-title>
                <!-- <v-btn @click="create" rounded outlined small color="primary">
                    <v-icon left>mdi-plus</v-icon>
                    Create New Account
                </v-btn> -->
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                ></v-text-field>
                </v-card-title>
                <v-data-table
                :headers="headers"
                :items="extractions"
                :search="search"
                :loading="loading"
                :footer-props="{ 'items-per-page-options': [15, 25, 50, 100]}"
                :server-items-length="totalRows"
                :options.sync="pagination"
                >
                <template v-slot:item.created_at="{ item }">
                    {{moment(item.created_at).format('LLL')}}
                </template>
                <template v-slot:item.action="{ item }">
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn @click="update(item)" color="green" rounded outlined x-small v-on="on">
                                <v-icon small>mdi-pencil</v-icon>
                            </v-btn>
                        </template>
                        <span>Edit Account</span>
                    </v-tooltip>
                    <!-- <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn class="ml-1" @click="remove(item)" color="primary" rounded outlined x-small v-on="on">
                                <v-icon small>mdi-delete</v-icon>
                            </v-btn>
                        </template>
                        <span>Delete Account</span>
                    </v-tooltip> -->
                </template>
                </v-data-table>
            </v-card>
        </v-col>
        <Update/>
    </v-row>
</template>
<script>
import bus from '../../../event_bus'
import { mapGetters } from 'vuex'
import Update from './options/Update'
var moment = require('moment')
import _ from "lodash";
  export default {
    components: {
        Update
    },
    data () {
      return {
        moment:moment,
        snackbar: false,
        dialog: false,
        form: {},
        loading: false,
        search: '',
        pagination: {},
        rowsPerPageItems: [5, 10, 20, 50, 100],
        headers: [
          { text: 'Donor Name', value: 'donor_name' },
          { text: 'Philebotomist', value: 'philebotomist' },
          { text: 'Blood Type', value: 'blood_type' },
          { text: 'Serial Number', value: 'serial_number' },
          { text: 'Blood Bag', value: 'blood_bag' },
          { text: 'Number of Units', value: 'number_of_units' },
          { text: 'Created At', value: 'created_at' },
          { text: 'Action', value: 'action' },
        ],
      }
    },
    watch: {
      pagination: {
        handler () {
          this.getDataFromApi()
        },
        deep: true
      },
      search: _.debounce(
        function() {
            this.getDataFromApi();
        },
        800,
        {
            leading: true,
            trailing: true
        }
      ),
      currentUser: {
          handler() {
              this.getDataFromApi()
          },
          deep: true
      }
    },
    mounted () {
        this.getDataFromApi()
    },
    methods: {

        update(item) {
            bus.$emit('updateExtraction', item)
        },
        getDataFromApi() {
            this.loading = true
            const { sortBy, descending, page, itemsPerPage } = this.pagination
        
            this.loading = true
            let params = {
                search: this.search,
                page: this.pagination.page,
                per_page: this.pagination.itemsPerPage,
                sort_by: this.pagination.sortBy[0],
                sort_order: this.pagination.sortDesc[0]? 'desc' : 'asc',
            }

            this.$store.dispatch('retrieveExtractions', params)
                .then(res => {
                    this.loading = false
                })
        },
        calculateAge(birthday) { // birthday is a date
            var today = new Date();
            var birthDate = new Date(birthday);
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
            {
                age--;
            }
            return age;
        }
    },
    computed:{
    ...mapGetters({
        extractions:'retrieveExtractions',
        totalRows: 'retrieveTotalExtractions'
      }),
        currentUser(){
          return JSON.parse(this.$store.state.auth.currentUser)
        }
    },
  }
</script>