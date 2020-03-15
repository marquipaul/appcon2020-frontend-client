<template>
    <v-card>
        <v-card-text>
            <v-row class="mb-n9">
                <v-col cols="9" class="mt-n2">
                    Blood Extraction Per Month Analytics year of {{year}}
                </v-col>
                <v-col cols="3" class="mt-n8">
                    <v-switch
                        color="primary"
                        inset
                        v-model="changeYear"
                        label="Change Year"
                ></v-switch>
                </v-col>
            </v-row>
            
            <v-select
                class="mt-1 mb-n6"
                v-if="changeYear"
                v-model="year"
                :items="years"
                label="Select Year"
                dense
                solo
            ></v-select>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text>
            <v-container>
                <LineChart v-if="loaded" :chartdata="chartdata" :options="chartOptions"/>
            </v-container>
        </v-card-text>
    </v-card>
</template>
<script>
var moment = require('moment')
import LineChart  from './Charts/LineChart'
export default {
    components: {
        LineChart
    },
    //extends: BarChart,
    data: () => ({
        loaded: false,
        //chartdata: null,
        changeYear: false,
        moment:moment,
        year: null,
        chartdata: {
            labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
            datasets: [
                    {
                        label: 'Count',
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
        year: {
            handler() {
                this.getAPIData()
            },
            deep: true
        },
        currentUser: {
            handler() {
                this.getAPIData()
            },
            deep: true
        }
    },
    created() {
        this.year = moment().format('YYYY')
        this.getAPIData()
    },
    methods: {
        getAPIData() {
            this.loaded = false
            this.loading = true
            var params = {
                year: this.year
            }
            this.$store.dispatch('retrievePerMonth', params)
                .then(res => {
                    this.loading = false
                    this.chartdata.datasets[0].data = this.retrievePerMonth;
                    console.log(this.retrievePerMonth)
                    this.loaded = true
                })
                .catch(error => {
                    this.loading = false
                })
        }
    },
    computed: {
      retrievePerMonth() {
        return this.$store.getters['retrievePerMonth']
      },
      years() {
            var x = 1900;
            var y = moment().add(1, 'year').format('YYYY');
            var years = [];
            for (var i = x; i < y; i++) {
                years.push(i);
            }
            return years.sort(function(a, b){return b-a});
            console.log(years)
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
