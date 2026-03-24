<script setup>
import ZingChartVue from 'zingchart-vue'
</script>
<template>
    <ZingChartVue :data="chartConfig"/>
</template>
<script>
export default {
  props: ['entries'],
  computed: {
    formatValueBox() {
      const formatArray = []
      this.values.socialCategories.forEach((social, idx) => {
        this.values.seriesData.forEach((series, isHateValue) => {
          formatArray.push({
            rule: `%p == ${isHateValue} && "%kl" == "${social}"`,
            text: `${series.percentages[idx]}%`,
          })
        })
      })
      return formatArray
    },
    values() {
        // return this.entries[0].values
        //console.log(this.entries)

        // Create an object to store the aggregated data grouped by isHate value
        const socialCategories = [] // Store unique "social" categories
        const data = {}
        let seriesData = []

        // Iterate through transactions and group data by "social" and "isHate" values
        this.entries.forEach((transaction) => {
          const social = transaction.social
          const isHateValue = transaction.isHate ? 'true' : 'false'

          if (!socialCategories.includes(social)) {
            socialCategories.push(social)
            data[social] = {'true': 0, 'false': 0}
          }

          data[social][isHateValue]++
        })

        //console.log('%O', socialCategories)
        //console.log('%O', data)

        //Example of returning data
        // seriesData = [
        //   {
        //     values: [data['twitter']['false'],data['twitch']['false'],data['youtube']['false']],
        //     text: 'false',
        //     percentages: [70, 80, 50]
        //   },
        //   {
        //     values: [data['twitter']['true'],data['twitch']['true'],data['youtube']['true']],
        //     text: 'true',
        //     percentages: [30, 20, 50]
        //   },
        // ]

        // Function to create series data
        function createSeriesData(data, socialCategories, isHateValue) {
          const total = socialCategories.reduce((acc, social) => acc + data[social][isHateValue], 0)

          return {
            values: socialCategories.map((social) => data[social][isHateValue]),
            text: 'isHate = ' + isHateValue.toString(),
            percentages: socialCategories.map((social) => {
              const total = data[social]['true'] + data[social]['false']
              return ((data[social][isHateValue] / total) * 100).toFixed(1)
            })
          }
        }

        // // Create series data for the chart
        seriesData = [
          createSeriesData(data, socialCategories, 'false'),
          createSeriesData(data, socialCategories, 'true'),
        ]

        //console.log(seriesData)

        return {
          socialCategories,
          seriesData
        }
    },
    chartConfig() {
      return {
        type: 'bar',
        title: {
          text: 'isHate = true per social',
          position: 'top',
        },
        plot: {
          stacked: false,
          valueBox: {
            rules: this.formatValueBox
          },
          tooltip: {
            text: '%v',
            //decimals: 2, // Set the number of decimal places for values
          },
          animation: {
            effect: "ANIMATION_SLIDE_BOTTOM",
          },
        },
        scaleX: {
          labels: this.values.socialCategories, // X-axis labels based on social categories
        },
        series: this.values.seriesData,
        scaleY: {
          label: {
            text: 'Numero',
          },
          //short:true,
          //shortUnit: 'K',
          item: {
            fontSize: 10
          }
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
