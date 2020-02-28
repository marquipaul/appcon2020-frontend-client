<template>
  <v-layout row wrap class="pa-3">
    <v-flex lg12>
      Dashboard
    </v-flex>
    <v-flex class="col-12" v-if="currentUser.user_type == 'staff1'">
      <StaffPage/>
    </v-flex>
  </v-layout>
</template>
<script>
import StaffPage from './pages/StaffPage'
export default {
  components: {
    StaffPage
  },
  created() {
      // var userId = this.currentUser.id;
      // window.Echo.private('App.User.' + userId)
      //           .notification((notification) => {
      //               console.log(notification);
      //           });
  },
  computed: {
    currentUser(){
        return JSON.parse(this.$store.state.auth.currentUser)
      },
  }
}
</script>