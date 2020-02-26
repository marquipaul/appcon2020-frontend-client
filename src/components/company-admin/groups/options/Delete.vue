<template>
  <v-row justify="center">
    <v-snackbar
        v-model="snackbar"
        :color="color"
        multi-line
        right
        :timeout="6000"
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
    <v-dialog
      v-model="dialog"
      max-width="500"
    >
      <v-card>
        <v-card-title class="headline">Are you sure?</v-card-title>

        <v-card-text class="subtitle-1">
          Are you sure you want to delete this group?
        </v-card-text>

        <v-card-actions>
          <div class="flex-grow-1"></div>

          <v-btn
            color="green darken-1"
            text
            @click="deleteGroup"
            :loading="loading"
          >
            Yes
          </v-btn>

          <v-btn
            color="red darken-1"
            text
            @click="dialog = false"
          >
            No
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
/* eslint-disable */
import bus from '../../../../event_bus'
export default {
    data () {
      return {
        snackbar: false,
        dialog: false,
        id: 0,
        loading: false,
        msg: '',
        color: 'success',
        staffs: []
      }
    },
    created() {
        var vm = this
        bus.$on('deleteGroup', function (value) {
            vm.dialog = true
            console.log(value)
            vm.getGroup(value)
        })
    },
    methods: {
        getGroup(item) {
            this.loading = true
            this.$store.dispatch('retrieveGroup', item.id)
                .then((response) => {
                    this.id = response.id
                    this.staffs = response.staffs
                    this.loading = false
                }).catch(error => {
                    console.log(error)
                    this.snackbar = true
                    this.msg = 'Something went wrong :('
                    this.color = 'error'
                    this.loading = false
                })
        },
        deleteGroup() {
            for (let index = 0; index < this.staffs.length; index++) {
                const staff = this.staffs[index];
                this.removeStaff(staff)
                if (this.staffs.length == index+1) {
                    this.removeGroup()
                }
            }
        },
        removeGroup() {
            this.loading = true
            this.$store.dispatch('deleteGroup', this.id).then((res) => {
                bus.$emit('reloadStaffs')
                this.dialog = false
                this.msg = 'Group Successfully Deleted'
                this.color = 'success'
                this.snackbar = true
                this.loading = false
                
            })
            .catch(error => {
                this.loading = false
                this.msg = 'Something went wrong :('
                this.color = 'error'
                this.snackbar = true
            })
        },
        removeStaff(item) {
            this.loading = true
            this.$store.dispatch('removeStaff', item)
                .then(res => {
                   this.loading = false
                })
        },
    }
}
</script>