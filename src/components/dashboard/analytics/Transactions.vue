<template>
    <v-card>
        <v-card-text>
            Blood Type Analytics   
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text>
            <v-container>
                <BarChart v-if="loaded" :chartdata="chartdata" :options="chartOptions"/>
            </v-container>
        </v-card-text>
    </v-card>
</template>
<script>
var moment = require('moment')
import BarChart  from './Charts/BarChart'
export default {
    components: {
        BarChart
    },
    //extends: BarChart,
    data: () => ({
        loaded: false,
        //chartdata: null,
        changeYear: false,
        moment:moment,
        year: null,
        chartdata: {
            labels: ['A+' ,'A-','B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
            datasets: [
                    {
                        label: 'Blood Donations',
                        backgroundColor: '#f87979',
                        data: []
                    },
                    {
                        label: "Donor's Blood Type",
                        backgroundColor: '#f76161',
                        data: []
                    }
                ]
        },
        chartOptions: {
            responsive: true,
            maintainAspectRatio: false
        }
    }),
    watch: {
        currentUser: {
            handler() {
                this.getAPIData()
            },
            deep: true
        }
    },
    created() {
        this.getAPIData()
    },
    methods: {
        getAPIData() {
            this.loaded = false
            this.loading = true
            this.$store.dispatch('retrieveBloodType')
                .then(res => {
                    this.loading = false
                    this.chartdata.datasets[0].data = this.retrieveBloodType.extractions;
                    this.chartdata.datasets[1].data = this.retrieveBloodType.users;
                    console.log('Type', this.retrieveBloodType)
                    this.loaded = true
                })
                .catch(error => {
                    this.loading = false
                })
        }
    },
    computed: {
      retrieveBloodType() {
        return this.$store.getters['retrieveBloodType']
      },
        currentUser(){
          return JSON.parse(this.$store.state.auth.currentUser)
        }
    }
}
</script>
<style scoped>
.echarts {
    position: relative;
    margin-left: -100px;
    margin-top: -60px;
    width: 900px; 
    height: 300px;
}
</style>
