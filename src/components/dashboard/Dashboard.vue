<template>
  <v-layout row wrap class="pa-3">
    <v-flex lg12>
      Dashboard
    </v-flex>
    <v-flex class="col-12" v-if="currentUser.user_type == 'staff1'">
      <StaffPage/>
    </v-flex>
    <v-flex class="col-12" v-else>
      <v-row>
        <v-col cols="8">
          <PerMonth/>
        </v-col>
        <v-col cols="4">
          <PerGender/>
        </v-col>
        <v-col cols="7">
          <PerBloodType/>
        </v-col>
        <v-col cols="5">
          <RequestCounts/>
        </v-col>
      </v-row>
      
    </v-flex>
  </v-layout>
</template>
<script>
import StaffPage from './pages/StaffPage'
import PerMonth from './analytics/Month'
import PerGender from './analytics/Gender'
import PerBloodType from './analytics/Transactions'
import RequestCounts from './analytics/BloodRequest'
export default {
  components: {
    StaffPage,
    PerMonth,
    PerGender,
    PerBloodType,
    RequestCounts
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