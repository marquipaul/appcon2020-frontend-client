<template>
  <v-app>
    <sidebar v-if="loggedIn&&currentUser.user_type != 'staff1'"></sidebar>
    <toolbar v-if="loggedIn"></toolbar>
    <v-content class="mx-4 my-4">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Toolbar from './components/navigation/Toolbar'
import Sidebar from './components/navigation/Sidebar'
export default {
  name: 'App',
  components: {
    Toolbar,
    Sidebar
  },
  data: () => ({
    //
  }),
  computed: {
      loggedIn(){
          return this.$store.getters.loggedIn
        },
      currentUser(){
        return JSON.parse(this.$store.state.auth.currentUser)
      },
    }
};
</script>
<style>
  @font-face {
    font-family: 'CeraPro';
    src: url('assets/fonts/CeraPro/TypeMates - CeraPRO-Regular.otf') format('opentype'),
         url('assets/fonts/CeraPro/TypeMates - Cera PRO Bold.otf') format('opentype'),
         url('assets/fonts/CeraPro/TypeMates - CeraPRO-Medium.otf') format('opentype'),
         url('assets/fonts/CeraPro/TypeMates - CeraPRO-Black.otf') format('opentype'),
         url('assets/fonts/CeraPro/TypeMates - CeraPRO-Light.otf') format('opentype'),
         url('assets/fonts/CeraPro/TypeMates - CeraPRO-Thin.otf') format('opentype');
  }
  #app {
    font-family: 'CeraPro';
  }
  .display-4 {
      font-family: 'CeraPro' !important;
  }
  .v-card {
    border-radius: 12px !important;
  }
      /* width */
    ::-webkit-scrollbar {
        width:10px;
        padding-left:10px;
    }
    /* Track */
    ::-webkit-scrollbar-track {
        display: none;
        
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
        background: #757575;
        border-radius: 50px;
        display: block;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
        background: #616161;
        display: block;
    }
</style>