<template>
    <v-card>
        <v-card-text>
            Gender Analytics
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text>
            <v-container>
                <PieChart v-if="loaded" :chartdata="chartdata" :options="chartOptions"/>
            </v-container>
        </v-card-text>
    </v-card>
</template>
<script>
var moment = require('moment')
import PieChart  from './Charts/PieChart'
export default {
    components: {
        PieChart
    },
    //extends: BarChart,
    data: () => ({
        loaded: false,
        //chartdata: null,
        moment:moment,
        year: null,
        chartdata: {
            labels: ['Male', 'Female'],
            datasets: [
                    {
                        label: 'Count',
                        backgroundColor: ['#f87979', '#f76161'],
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
        }
    },
    created() {
        this.getAPIData()
    },
    methods: {
        getAPIData() {
            this.loaded = false
            this.loading = true
            this.$store.dispatch('retrieveGenderCount')
                .then(res => {
                    this.loading = false
                    this.chartdata.datasets[0].data = this.retrieveGenderCount;
                    console.log(this.retrieveGenderCount)
                    this.loaded = true
                })
                .catch(error => {
                    this.loading = false
                })
        }
    },
    computed: {
      retrieveGenderCount() {
        return this.$store.getters['retrieveGenderCount']
      },
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
