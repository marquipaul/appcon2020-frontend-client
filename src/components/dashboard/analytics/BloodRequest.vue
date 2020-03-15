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
            labels: [],
            datasets: [
                    {
                        label: 'Blood Request Group by Status',
                        backgroundColor: '#f87979',
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
            this.$store.dispatch('retrieveBloodRequestAnalytics')
                .then(res => {
                    this.loading = false
                    var labels = []
                    var data = []
                    
                    for (let index = 0; index < this.retrieveBloodRequestAnalytics.length; index++) {
                        const element = this.retrieveBloodRequestAnalytics[index];
                        labels.push(element.status)
                        data.push(element.total)
                    }
                    this.chartdata.labels = labels;
                    this.chartdata.datasets[0].data = data;
                    this.loaded = true
                    console.log('requests', this.retrieveBloodRequestAnalytics)
                })
                .catch(error => {
                    this.loading = false
                })
        }
    },
    computed: {
      retrieveBloodRequestAnalytics() {
        return this.$store.getters['retrieveBloodRequestAnalytics']
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
