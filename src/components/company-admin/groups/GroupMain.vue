<template>
  <v-row>
    <v-col cols="12">
        Group Management
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
          <v-list rounded>
              <v-subheader>
                  STAFFS
                <v-spacer></v-spacer>
                  <v-tooltip top>
                      <template v-slot:activator="{ on }">
                          <v-icon color="grey lighten-1" v-on="on">mdi-information</v-icon>
                      </template>
                      <span>Drag products onto the menu</span>
                  </v-tooltip>
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
                  <v-list-item-group class="mt-2" color="primary">
                      <draggable
                          :list="accounts"
                          group="people"
                          @start="dragStart"
                          @end="dragEnd"
                      > 
                          <v-list-item
                              v-for="(item, i) in accounts"
                              :key="i"
                              active-class="highlighted"
                              >
                              <v-list-item-content>
                                  <v-list-item-title v-text="item.name"></v-list-item-title>
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
            </v-card>
    </v-col>
    <v-col cols="9">
      <v-card>
        <v-card-title row wrap>
          <v-flex md2>
              <v-layout row class="pl-3">
                  <v-tooltip top>
                  <template v-slot:activator="{ on }">
                      <h4 v-on="on" class="grey--text text--darken-3">Groups</h4>
                  </template>
                  <span>Double Click the Weeks to view details. Press Ctrl+Click to Clone Menu Group</span>
                  </v-tooltip>
              </v-layout>
          </v-flex>
          <v-flex md8>
          </v-flex>
          <v-flex md2>
              <v-btn @click="createGroup" small block text class="white--text green"><v-icon left>mdi-plus</v-icon> Create Group</v-btn>
          </v-flex>
        </v-card-title>
        <v-divider></v-divider>
        <v-progress-linear
            height="1"
            indeterminate
            v-if="loading"
        ></v-progress-linear>
        <v-card-text style="height: 630px; overflow-y: auto; overflow-x: hidden;">
          <v-row>
            <v-col v-for="(group, group_index) in groups" :key="group_index" cols="12">
              <v-card outlined>
                <v-card-title>
                  <span class="subtitle-1">{{group.group_name}}</span>
                  <v-spacer></v-spacer>
                  <v-btn @click="updateGroup(group)" x-small rounded class="white--text green"><v-icon small>mdi-pencil</v-icon></v-btn>
                  <v-btn @click="deleteGroup(group)" x-small rounded class="white--text error"><v-icon small>mdi-delete</v-icon></v-btn>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-row>
                    <v-col v-for="(flow, flow_index) in group.process_flows" :key="flow_index" :cols="column(group.process_flows.length)">
                      <v-card outlined>
                        <v-card-text>
                          <v-subheader class="mt-n2 grey--text text--darken-3">
                                {{flow.title}}
                              <v-spacer></v-spacer>
                                <v-tooltip top>
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
                                        :options="{disabled: flow.staff.length == 1? true : false}"
                                        :list="flow.staff"
                                        @change="log($event, flow.id, group.id)"
                                        group="people"
                                        style="min-height: 47px;"
                                        :class="isDragging? '' : flow.staff.length == 1? '' : 'draggable'"
                                    > 
                                        <v-list-item
                                            v-for="(item, i) in flow.staff"
                                            :key="i"
                                            >
                                            <v-list-item-content>
                                                <v-list-item-title v-text="item.name"></v-list-item-title>
                                            </v-list-item-content>
                                            <v-list-item-action>
                                          <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                  <v-btn @click="removeStaff(item)" v-on="on" icon x-small>
                                                    <v-icon color="error">mdi-delete</v-icon>
                                                  </v-btn>
                                                </template>
                                                <span>Remove Staff</span>
                                            </v-tooltip>
                                        </v-list-item-action>
                                        </v-list-item>
                                    </draggable>
                                        <v-divider v-if="!flow.staff.length < 1"></v-divider>
                                </v-list-item-group>
                                <v-divider v-if="flow.staff.length < 1"></v-divider>
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
    <Create/>
    <Update/>
    <Delete/>
  </v-row>
</template>
<script>
import draggable from 'vuedraggable'
import { mapGetters } from 'vuex'
import _ from "lodash";
import Create from './options/Create'
import Update from './options/Update'
import Delete from './options/Delete'
import bus from '../../../event_bus'
export default {
  components: {
    draggable,
    Create,
    Update,
    Delete
  },
  data() {
    return {
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
          this.getStaffs()
        },
        deep: true
      },
    search: _.debounce(
        function() {
            this.getStaffs();
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
          this.getStaffs();
      })
  },
  methods: {
    createGroup() {
      bus.$emit('createGroup')
    },
    updateGroup(item) {
      bus.$emit('updateGroup', item)
    },
    deleteGroup(item) {
      bus.$emit('deleteGroup', item)
    },
    removeStaff(item) {
      this.loading = true
      this.$store.dispatch('removeStaff', item)
            .then(res => {
                this.loading = false
                this.getDataFromApi()
                this.msg = 'Staff Successfully Removed'
                this.snackbar = true
                this.color = 'success'
            })
    },
    log(evt, flowID,  groupID) {
      if (evt.added) {
        console.log(evt, flowID,  groupID)
        this.loading = true
        var form = {
          id: evt.added.element.id,
          process_flow_id: flowID,
          staff_group_id: groupID
        }
        this.$store.dispatch('addStaff', form)
            .then(res => {
                this.loading = false
                this.getDataFromApi()
                this.msg = 'Staff Successfully Added'
                this.snackbar = true
                this.color = 'success'
            })
      }
    },
    getDataFromApi() {
        this.getStaffGroups()
        this.getStaffs()
    },
    getStaffGroups() {
      this.loading = true
      this.$store.dispatch('retrieveGroups')
            .then(res => {
                this.loading = false
            })
    },
    getStaffs() {
      this.loading = true
        let params = {
            staff_pick: true,
            type: 'staff1',
            search: this.search,
            page: this.page,
            per_page: 15,
            sort_by: 'name',
            sort_order: 'asc',
        }
      this.$store.dispatch('retrieveAccounts', params)
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
        accounts:'retrieveAccounts',
        last_page: 'retrieveLastPageAccounts',
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