<script setup>
import ZingChartVue from 'zingchart-vue'
</script>
<template>
    <ZingChartVue :data="chartConfig" /> 
</template>
<script>
export default {
  props: ['entries'],
  computed: {
    values() {
      // return this.entries[0].values
      //console.log(this.entries)

      // Create an object to store the aggregated data grouped by isHate value
      const aggregatedData = {
        true: 0, // Initialize counts for isHate = true
        false: 0, // Initialize counts for isHate = false
      }
      
      // Iterate through transactions and increment counts based on isHate value
      this.entries.forEach((transaction) => {
        const isHateValue = transaction.isHate ? true : false
        aggregatedData[isHateValue]++
      })

      const result = Object.entries(aggregatedData).map(([isHateValue, count]) => ({
        values: [count],
        text: `isHate = ${isHateValue}`,
      }))

      // Manually reorder the result array
      result.sort((a) => {
        if (a.text === 'isHate = true') return 1
        return -1
      })

      return result
    },
    chartConfig() {
      const config = {
        type: 'pie',
        tooltip: {
          text: '%t'
        },
        plotarea: {
          margin: '5'
        },
        plot: {
          valueBox: {
            fontSize: 10,
            text: '%npv%'
          },
          hoverState: {
         	  borderWidth: 2,
          },
          animation: {
            effect: "ANIMATION_SLIDE_BOTTOM",
          },
        },
        series: this.values,
      }
      return config
    },
  }
}
</script>
