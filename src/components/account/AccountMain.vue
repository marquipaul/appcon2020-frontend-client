<template>
    <v-row>
        <v-col cols="12">
            Account Management
        </v-col>
        <v-col cols="12">
            <v-card>
                <v-card-title>
                <v-btn @click="create" rounded outlined small color="primary">
                    <v-icon left>mdi-plus</v-icon>
                    Create New Account
                </v-btn>
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
                :items="accounts"
                :search="search"
                :loading="loading"
                :footer-props="{ 'items-per-page-options': [15, 25, 50, 100]}"
                :server-items-length="totalRows"
                :options.sync="pagination"
                >
                <template v-slot:item.active="{ item }">
                    <v-chip v-if="item.active" class="overline white--text green" small>Online</v-chip>
                    <v-chip v-else class="overline" small>Offline</v-chip>
                </template>
                <template v-slot:item.donor_gender="{ item }">
                    <v-chip class="overline" small :color="getColor(item)" dark>{{item.gender}}</v-chip>
                </template>
                <template v-slot:item.user_type="{ item }">
                    <v-chip v-if="item.user_type == 'company_admin'" class="overline" small>Company Admin</v-chip>
                    <v-chip v-else-if="item.user_type == 'hospital_admin'" class="overline" small>Hospital Admin</v-chip>
                    <v-chip v-else-if="item.user_type == 'staff1'" class="overline" small>Hospital Staff</v-chip>
                </template>
                <template v-slot:item.age="{ item }">
                    <v-chip class="overline" small>{{calculateAge(item.birthday)}}</v-chip>
                </template>
                <template v-slot:item.approved="{ item }">
                    <v-chip class="overline" :color="item.pivot.approved=='1'? 'green' : 'red'" small dark>{{item.pivot.approved=='1'? 'Yes' : 'No'}}</v-chip>
                </template>
                <template v-slot:item.points="{ item }">
                    {{item.points}}
                </template>
        
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
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn class="ml-1" @click="remove(item)" color="primary" rounded outlined x-small v-on="on">
                                <v-icon small>mdi-delete</v-icon>
                            </v-btn>
                        </template>
                        <span>Delete Account</span>
                    </v-tooltip>
                </template>
                </v-data-table>
            </v-card>
        </v-col>
        <Create/>
        <Update/>
        <Delete/>
    </v-row>
</template>
<script>
import bus from '../../event_bus'
import Create from './options/Create'
import Update from './options/Update'
import Delete from './options/Delete'
import { mapGetters } from 'vuex'
var moment = require('moment')
import _ from "lodash";
  export default {
    components: {
        Create,
        Update,
        Delete
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
          { text: 'Name', value: 'name' },
          { text: 'Status', value: 'active' },
          { text: 'Blood Type', value: 'blood_type' },
          { text: 'Gender', value: 'donor_gender' },
          { text: 'Age', value: 'age' },
          { text: 'Email', value: 'email' },
          { text: 'Number', value: 'mobile_number' },
          { text: 'Account Type', value: 'user_type' },
          //{ text: 'Requests', value: 'my_requests_count' },
          //{ text: 'Joined Events', value: 'joinedevents_count' },
          //{ text: 'Points', value: 'points' },
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
        create() {
            bus.$emit('createAccount')
        },
        update(item) {
            bus.$emit('updateAccount', item)
        },
        remove(item) {
            bus.$emit('deleteAccount', item)
        },
        getColor(item) {
            if (item.gender == 'male') {
                return 'blue'
            } else {
                return 'pink'
            }
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

            this.$store.dispatch('retrieveAccounts', params)
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
        accounts:'retrieveAccounts',
        totalRows: 'retrieveTotalAccounts'
      }),
        currentUser(){
          return JSON.parse(this.$store.state.auth.currentUser)
        }
    },
  }
</script>