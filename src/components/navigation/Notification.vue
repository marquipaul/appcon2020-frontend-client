<template>
    <div>
        <v-snackbar
            v-model="snackbar"
            color="success"
            multi-line
            right
            :timeout="4000"
            top
        >
        <v-icon large left>mdi-bell-ring</v-icon>
            <span> You have a new notification </span>
            <v-btn
                dark
                text
                @click="snackbar = false"
                >
                Close
            </v-btn>
        </v-snackbar>
        <v-menu
        transition="slide-y-transition"
        bottom
        left
        offset-y
        max-width="300"
        min-width="300"
        
        >
        
        <template v-slot:activator="{ on }">
            
                <v-btn :loading="loading" @click="getNotifications" color="white" v-on="on" text small fab> 

                    <v-badge v-if="!loading" color="blue-grey darken-3 white--text" overlap right>
                        <template v-slot:badge>{{notifications.length}}</template>
                        <v-icon color="grey darken-2">mdi-bell</v-icon>
                    </v-badge>
                </v-btn>
 
        </template>
        <v-card >
                <v-card-title>
                <v-subheader>Notifications</v-subheader> 
                <v-chip small>{{notifications.length}}</v-chip>
                
                </v-card-title>
                <v-progress-linear
                    height="2"
                    indeterminate
                    v-if="loadingNotif"
                ></v-progress-linear>
                <v-divider></v-divider>
            <v-card-text style="height: 350px; overflow-y: auto; overflow-x: hidden;">
                <v-list two-line class="mt-n6">
                    <v-divider></v-divider>
                    <template v-for="(item, i) in notifications">
                            <v-list-item :key="i" @click="readNotificaiton(item)">
                                <v-list-item-avatar class="grey lighten-1">
                                <!-- <v-icon class="grey lighten-1 white--text">mdi-account</v-icon> currentUser.name.charAt(0) -->
                                <span class="white--text headline">P</span>
                                </v-list-item-avatar>
                                <v-list-item-content>
                                    <v-list-item-title>{{item.data.user.name}}</v-list-item-title>
                                    <v-list-item-subtitle>{{item.data.transaction.process_flow.title}}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                            <v-divider :key="item.id"></v-divider>
                        </template>
                </v-list>
            </v-card-text>
        </v-card>
        </v-menu>
</div>
</template>
<script>
import { mapGetters } from 'vuex'
  export default {
    data: () => ({
      loading: false,
      loadingNotif: false,
      snackbar: false
    }),
    created() {
        if (this.isLoggedIn) {
            setTimeout(() => {
                this.getNotifications()
                this.listenToNotifications()
            }, 1000);
        }
    },
    methods: {
        listenToNotifications() {
            var userId = this.currentUser.id;
            window.Echo.private('App.User.' + userId)
                .notification((notification) => {
                    this.snackbar = true
                    this.$store.dispatch('pushNotification', notification)
                });
        },
        getNotifications() {
            this.loading = true
            this.$store.dispatch('retrieveNotifications')
                .then(response => {
                    this.loading = false
                })
        },
        readNotificaiton(item) {
            this.loadingNotif = true
            this.$store.dispatch('readNotification', item.id)
                .then(response => {
                    this.loadingNotif = false
                    this.reloadDonors()
                })
        },
        reloadDonors() {
            this.loading = true
            let params = {
                my_transactions: true,
                page: 1,
                per_page: 15,
                sort_by: 'created_at',
                sort_order: 'asc',
            }
            this.$store.dispatch('retrieveTransactions', params)
                .then(res => {
                    this.loading = false
                })
        }
    },
    computed: {
        ...mapGetters({
            notifications:'retrieveNotifications',
            isLoggedIn:'loggedIn',
        }),
        currentUser(){
            return JSON.parse(this.$store.state.auth.currentUser)
        },
    }
  }
</script>