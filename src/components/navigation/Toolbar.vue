<template>
    <div>
        <v-overlay :value="loading">
            <v-progress-circular indeterminate size="64"></v-progress-circular>
        </v-overlay>
        <v-app-bar class="primary" clipped-left app>
        <v-app-bar-nav-icon text color="white"
            v-if="primaryDrawer.type !== 'permanent'&&currentUser.user_type != 'staff1'"
            @click.stop="drawerOpen"
        >
        <v-icon>mdi-menu</v-icon>
        </v-app-bar-nav-icon>
        <v-toolbar-title class="white--text">
            BloodDrive
        </v-toolbar-title>
            <!-- <v-toolbar-title v-else>
            <v-img class="drawer-logo mt-2" width="150" src="../img/Expee-Logo-Reversed.png"/>
        </v-toolbar-title> -->
            <v-spacer></v-spacer>
            <div style="width: 400px;">
                <v-autocomplete
                    :readonly="currentUser.user_type!='company_admin'"
                    autocomplete="off"
                    v-model="select"
                    :loading="loading"
                    :items="hospitals"
                    cache-items
                    class="mx-4"
                    solo
                    dense
                    hide-no-data
                    hide-details
                    label="Select Hospital"
                    rounded
                    item-text="name"
                    item-value="id"
                ></v-autocomplete>
            </div>
            <Notification/>
            <v-btn color="white" text small fab @click="$vuetify.theme.dark = !$vuetify.theme.dark"><v-icon>mdi-brightness-6</v-icon> </v-btn>
            <v-btn color="white" text small fab @click="logout"> <v-icon>mdi-power</v-icon> </v-btn>
        </v-app-bar>
    </div>
</template>
<script>
/* eslint-disable */
import bus from '../../event_bus.js'
import { mapGetters } from "vuex";
import Notification from './Notification'
export default {
    components: {
        Notification
    },
    data() {
        return {
            select: null,
            loading: false,
            darkMode: false,
            primaryDrawer: {
                model: null,
                type: 'default (no property)',
                clipped: false,
                floating: false,
                mini: false
            },
        }
    },
    mounted() {
        setTimeout(() => {
            this.getDataFromApi()
        }, 500);
    },
    methods: {
        changeHospital() {
            var form = {
                id: this.currentUser.id,
                hospital_id: this.select
            };
            this.loading = true;
            this.$store.dispatch("adminUpdateHospital", form).then(res => {
                this.loading = false;
            });
        },
        getDataFromApi() {
            this.loading = true
            this.$store.dispatch('retrieveHospitals')
                .then(res => {
                    this.loading = false
                    console.log(res)
                    this.select = this.currentUser.hospital_id
                })
        },
        drawerOpen(){
            bus.$emit('drawerOpen', true)
        },
         logout(){
            this.$store.dispatch('destroyToken')
              .then(response => {
                  this.$router.push({path: '/'});
              });
      }
    },
    watch: {
        darkMode: function (darkMode) {
            bus.$emit('darkMode', darkMode)
        },
        select: {
            handler() {
                this.$store.dispatch("setSelectedHospital", this.select);
                if (this.currentUser.user_type == 'company_admin') {
                    this.changeHospital();
                }
            },
            deep: true
        }
    },
    computed: {
        ...mapGetters({
            hospitals: "retrieveHospitals"
        }),
      currentUser(){
          return JSON.parse(this.$store.state.auth.currentUser)
        }
    }
}
</script>
<style scoped>
.v-application .accent--text {
    color: #2196f3 !important;
    caret-color: #2196f3 !important;
}
</style>
