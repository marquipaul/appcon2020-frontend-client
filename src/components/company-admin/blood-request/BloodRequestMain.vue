<template>
  <v-row>
    <v-col cols="12">
        Blood Request Management
      </v-col>
    <v-snackbar
        v-model="snackbar"
        :color="color"
        multi-line
        right
        :timeout="4000"
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
    <v-col cols="3">
       <v-card class="mx-auto" tile>
          <v-list rounded two-line v-if="requests.length != 0">
              <v-subheader>
                  BLOOD DONORS
                <v-spacer></v-spacer>
                  <v-tooltip top>
                      <template v-slot:activator="{ on }">
                          <v-icon color="grey lighten-1" v-on="on">mdi-information</v-icon>
                      </template>
                      <span>Drag and drop schedules</span>
                  </v-tooltip>
              </v-subheader>
                <v-divider></v-divider>
                <v-progress-linear
                    height="1"
                    indeterminate
                    v-if="loading"
                ></v-progress-linear>
                <v-divider v-else></v-divider>
                  <v-list-item-group class="mt-2" color="primary">
                      <draggable
                          :list="requests"
                          group="people"
                          @start="dragStart"
                          @end="dragEnd"
                      > 
                          <v-list-item
                              v-for="(item, i) in requests"
                              :key="i"
                              >
                              <v-list-item-content>
                                  <v-list-item-title v-text="item.donor.name"></v-list-item-title>
                                  <v-list-item-subtitle>
                                    {{moment(item.schedule).format('LLL')}}
                                    <v-chip x-small class="overline">{{item.status}}</v-chip>
                                  </v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                          <v-divider></v-divider>
                      </draggable>
                          <div class="text-center">
                              <v-pagination
                              v-model="page"
                              :length="last_page"
                              circle
                              ></v-pagination>
                          </div>
                  </v-list-item-group>
                </v-list>
                <v-subheader v-else>
                  No Blood Requests for the meantime
                </v-subheader>
            </v-card>
    </v-col>
    <v-col cols="9">
      <v-card>
        <!-- <v-progress-linear
            height="1"
            indeterminate
            v-if="loading"
        ></v-progress-linear> -->
        <v-card-text style="height: 630px; overflow-y: auto; overflow-x: hidden;">
          <v-row>
            <v-col v-for="(group, group_index) in groups" :key="group_index" cols="12">
              <v-card outlined>
                <v-card-title>
                  <span class="subtitle-1">{{group.group_name}}</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-row>
                    <v-col v-for="(flow, flow_index) in group.process_flows" :key="flow_index"  cols="12" :xl="column(group.process_flows.length)" :lg="column(group.process_flows.length)">
                      <v-card outlined>
                        <v-card-text>
                          <v-subheader class="mt-n2 grey--text text--darken-3">
                                {{flow.title}}
                              <v-spacer></v-spacer>
                                <v-tooltip top v-if="flow_index == 0">
                                    <template v-slot:activator="{ on }">
                                        <v-icon color="grey lighten-1" v-on="on">mdi-information</v-icon>
                                    </template>
                                    <span>Drop Here</span>
                                </v-tooltip>
                            </v-subheader>
                          <v-list rounded dense>
                            <v-divider></v-divider>
                              <v-list-item-group class="mt-2" color="primary">
                                    <draggable
                                        :options="{disabled: flow_index != 0? true : false}"
                                        :list="flow.staff"
                                        @change="log($event, group.id)"
                                        group="people"
                                        style="min-height: 47px;"
                                       
                                    > 
                                        <v-list-item
                                            v-for="(item, i) in flow.transactions"
                                            :key="i"
                                            two-line
                                            >
                                            <v-list-item-content>
                                                <v-list-item-title v-text="item.blood_request.donor.name"></v-list-item-title>
                                                <v-list-item-subtitle>
                                                  {{moment(item.blood_request.schedule).format('LLL')}}
                                                  <v-chip x-small class="overline">{{item.status}}</v-chip>
                                                </v-list-item-subtitle>
                                            </v-list-item-content>
                                            <v-list-item-action v-if="item.status == 'pending'">
                                          <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                  <v-btn @click="removeTransaction(item)" v-on="on" icon x-small>
                                                    <v-icon color="error">mdi-delete</v-icon>
                                                  </v-btn>
                                                </template>
                                                <span>Remove Staff</span>
                                            </v-tooltip>
                                        </v-list-item-action>
                                        </v-list-item>
                                    </draggable>
                                        
                                </v-list-item-group>
                                <v-divider></v-divider>
                              </v-list>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import draggable from 'vuedraggable'
import { mapGetters } from 'vuex'
import _ from "lodash";
import bus from '../../../event_bus'
var moment = require('moment')
export default {
  components: {
    draggable
  },
  data() {
    return {
      moment:moment,
      isDragging: false,
      loading: false,
      search: '',
      page: 1,
      snackbar: false,
      msg: '',
      color: 'success'
    };
  },
  watch: {
    currentUser: {
        handler() {
            this.getDataFromApi()
        },
        deep: true
    },
    page: {
        handler () {
          this.getDonors()
        },
        deep: true
      },
    search: _.debounce(
        function() {
            this.getDonors();
        },
        800,
        {
            leading: true,
            trailing: true
        }
      ),
  },

  created() {
    this.getDataFromApi();
     bus.$on('reloadStaffs', (value) => {
          this.getDonors();
      })
  },
  methods: {
    removeTransaction(item) {
      this.loading = true
      this.$store.dispatch('removeTransaction', item)
            .then(res => {
                this.loading = false
                this.getDataFromApi()
                this.msg = 'Transaction Successfully Removed'
                this.snackbar = true
                this.color = 'success'
            })
            .catch(error => {
              this.msg = 'Transaction cannot be Removed'
              this.snackbar = true
              this.color = 'error'
              this.getDataFromApi()
              this.loading = false
            })
    },
    log(evt,  groupID) {
      if (evt.added) {
        console.log(evt,  groupID)
        this.loading = true
        var form = {
          blood_request_id: evt.added.element.id,
          staff_group_id: groupID
        }
        this.$store.dispatch('storeTransaction', form)
            .then(res => {
                this.loading = false
                this.getDataFromApi()
                this.msg = 'New Transaction Successfully Created'
                this.snackbar = true
                this.color = 'success'
            })
      }
    },
    getDataFromApi() {
        this.getStaffGroups()
        this.getDonors()
    },
    getStaffGroups() {
      this.loading = true
      this.$store.dispatch('retrieveGroups')
            .then(res => {
                this.loading = false
            })
    },
    getDonors() {
      this.loading = true
        let params = {
            for_pick: true,
            page: this.page,
            per_page: 15,
            sort_by: 'created_at',
            sort_order: 'asc',
        }
      this.$store.dispatch('retrieveBloodRequests', params)
            .then(res => {
                this.loading = false
            })
    },
    dragStart() {
      console.log('dragging')
      this.isDragging = true
    },
    dragEnd() {
      console.log('done dragging')
      this.isDragging = false
    },
    column(length) {
            if (length == 1) {
                return 12;
            } else if (length == 2) {
                return 6;
            } else if (length == 3) {
                return 4;
            } else if (length == 4) {
                return 3;
            } else {
                return 4;
            }
        },
  },
  computed:{
    ...mapGetters({
        requests:'retrieveBloodRequests',
        last_page: 'retrieveLastPageBloodRequest',
        groups: 'retrieveGroups'
      }),
      currentUser(){
        return JSON.parse(this.$store.state.auth.currentUser)
      },
      
    },
};
</script>
<style>
 .draggable::after{content: 'Drag Here'; color: grey; font-size: 0.9em; position: absolute; top: 9px;}
</style>