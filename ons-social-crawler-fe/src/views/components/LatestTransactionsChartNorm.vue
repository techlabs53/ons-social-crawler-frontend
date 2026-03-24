<script setup>
import ZingChartVue from 'zingchart-vue'
</script>
<template>
  <ZingChartVue :data="chartConfigNorm"/>
</template>
<script>
export default {
  props: ['entries','range'],
  computed: {
    values() {
      // console.log(this.entries)
      // console.log('in graph range %O', this.range)
      
      // get local timezone as offset in minutes in order to represent UTC timestamps to local TZ
      const offsetInMinutes = new Date(this.range.start).getTimezoneOffset(); 
      // console.log('offsetInMinutes %O', offsetInMinutes)
      
      // Generate all dates in the range
      let currentDate = this.range.start.getTime() - new Date(this.range.start).getTimezoneOffset() * 60 * 1000 //convert to user's TZ
      const endDate = this.range.end.getTime() - new Date(this.range.end).getTimezoneOffset() * 60 * 1000 //convert to user's TZ
      // console.log('currentDate %O', currentDate)
      // console.log('endDate %O', endDate)
      let dateArray = []
      while (currentDate <= endDate) {
          dateArray.push(currentDate)
          currentDate +=  1000 * 60 * 60 * 24 // Increment the date by one day
      }
      // console.log('final date array : %O', dateArray)
      // console.log('minValue: %O', this.range.start.getTime() - new Date(this.range.start).getTimezoneOffset() * 60 * 1000) // reconvert to user's TZ
      // console.log('maxValue: %O', this.range.end.getTime() - new Date(this.range.end).getTimezoneOffset() * 60 * 1000) // workaround for extra day

      // Create an object to store the aggregated data grouped by isHate value
      const aggregatedData = {}

      // Create an object to store the series names
      const seriesNames = {}

      // Iterate through transactions and group data by isHate value
      this.entries.forEach((transaction) => {
        const isHateValue = transaction.isHate ? true : false
        // console.log('transaction.timestamp %O', transaction.timestamp)
        const date = new Date(transaction.timestamp)
        // console.log('new Date(transaction.timestamp) %O', date)
        const offsetInMinutes = date.getTimezoneOffset(); 
        const day = new Date(new Date(date.getTime() - offsetInMinutes * 60 * 1000).toISOString().split('T')[0]).getTime(); // Extract YYYY-MM-DD in milliseconds
        
        if (!aggregatedData[isHateValue]) {
          aggregatedData[isHateValue] = {}
        }

        if (!aggregatedData[isHateValue][day]) {
          aggregatedData[isHateValue][day] = 0
        }

        aggregatedData[isHateValue][day]++

        // Track series names
        seriesNames[isHateValue] = `isHate = ${isHateValue}`
      })
      // console.log(aggregatedData)

      // Convert the aggregated data object to the desired ordered array format
      const result = []

      if (aggregatedData[false]) {
        result.push({
          text: seriesNames[false],
          values: dateArray.map(day => 
            [
              day,
              aggregatedData[false][day] || 0.
            ])
        })
      }

      if (aggregatedData[true]) {
        result.push({
          text: seriesNames[true],
          values: dateArray.map(day => 
            [
              day,
              aggregatedData[true][day] || 0.
            ])
        })
      }
      
      // console.log(result)
      return result
    },
    chartConfigNorm() {
      return {
        type: 'bar',
        title: {
          text: '% isHate = true  ',
          position: 'top',
        },
        plot: {
          stacked: true,
          stackType: '100%',
          animation: {
            effect: "ANIMATION_SLIDE_BOTTOM",
          },
          valueBox: {
            text:"%npv%",
            decimals: 0,
            //backgroundColor: 'black',
            placement: 'middle',
            color: 'white',
          }
        },
        series: this.values,
        scaleX: {
          transform: {
            type: 'date',
            all: '%D\n%d/%m/%y'
          },
          item: {
            fontSize: 10
          },
          step: 'day',
          // minValue: this.range.start.getTime() - new Date(this.range.start).getTimezoneOffset() * 60 * 1000, // reconvert to user's TZ
          // maxValue: this.range.end.getTime() - 1000 * 60 * 60 * 24, // workaround for extra day
          //zooming: true,
        },
        scaleY: {
          label: {
            text: 'Numero',
          },
          item: {
            fontSize: 10
          },
          values: "0:100",
        },
        legend: {
          toggleAction: 'hide', // Optional: Hide or show the series on click
          layout: 'float',
          align: 'center',
          borderWidth: 0,
          backgroundColor: 'none',
          item: {
            fontSize: 12
          },
          verticalAlign: 'bottom',
        },
        crosshairX: {
          lineColor: '#f00', // Customize the crosshair line color
          scaleLabel: {
            backgroundColor: '#f00', // Customize the background color of the scale label
          },
        },
      }
    },
  }
}
</script>
