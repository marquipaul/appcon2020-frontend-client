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
          Are you sure you want to delete this Question?
        </v-card-text>

        <v-card-actions>
          <div class="flex-grow-1"></div>

          <v-btn
            color="green darken-1"
            text
            @click="deleteQuestion"
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
import bus from '../../../../../event_bus'
export default {
    data () {
      return {
        snackbar: false,
        dialog: false,
        id: 0,
        loading: false,
        msg: '',
        color: 'success'
      }
    },
    created() {
        var vm = this
        bus.$on('deleteQuestion', function (value) {
            vm.dialog = true
            vm.id = value.id
            console.log(value)
        })
    },
    methods: {
        deleteQuestion() {
          this.loading = true
            this.$store.dispatch('deleteQuestion', this.id).then((res) => {
                this.dialog = false
                this.msg = 'Question Successfully Deleted'
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
        }
    }
}
</script>