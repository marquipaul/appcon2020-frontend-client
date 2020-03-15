<template>
    <v-navigation-drawer
      v-model="model"
      overflow
      fixed
      clipped
      app
      :expand-on-hover="mini"
      stateless
    >

      <v-list class="mt-n1">
        <v-list-item two-line>
            <!-- <v-list-item-avatar>
              <img src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460">
            </v-list-item-avatar> -->
            <v-list-item-avatar color="primary">
                <span class="white--text headline">{{currentUser? currentUser.name.charAt(0) : 'N/A'}}</span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{currentUser.name}}</v-list-item-title>
              <v-list-item-subtitle>Super Admin</v-list-item-subtitle>
            </v-list-item-content>
            <!-- <v-list-item-action >
                <v-btn icon @click.stop="minimize">
                <v-icon>chevron_left</v-icon>
                </v-btn>
          </v-list-item-action> -->
          </v-list-item>
      </v-list>

    <v-list class="mt-n5" dense
        nav>
    <!-- dashboard menu -->
    <template v-for="(item, i) in navigations" >
      <!-- <v-divider :key="item.name"></v-divider> -->
      <v-list-item :to="item.route" router :key="i">
        <v-list-item-action>
          <v-icon>{{item.icon}}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{item.name}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <!-- <v-divider></v-divider> -->
    </v-list>

    </v-navigation-drawer>
</template>
<script>
import bus from '../../event_bus.js'
export default {
    data() {
        return {
            active: false,
            model: true,
            mini: false,
            navigations: [
                {name: 'Dashboard', icon: 'mdi-view-dashboard', route: 'dashboard'},
                {name: 'Blood Requests', icon: 'mdi-water', route: 'blood-requests'},
                {name: 'Blood Extractions', icon: 'mdi-blood-bag', route: 'blood-extractions'},
                {name: 'Accounts', icon: 'mdi-account-multiple', route: 'accounts'},
                {name: 'Process Flows', icon: 'mdi-clipboard-file', route: 'process-flows'},
                {name: 'Groups', icon: 'mdi-account-group', route: 'groups'},
            ],
        }
    },
    created () {
      var vm = this
      bus.$on('drawerOpen', function (value) {
          if (!vm.mini) {
              vm.mini = value
          } else {
              vm.mini = false
          } 
      })
    },
    methods: {
      minimize(){
        this.mini = true
        this.active = false
      }
    },
    computed: {
        currentUser(){
          return JSON.parse(this.$store.state.auth.currentUser)
        }
    }
}
</script>

