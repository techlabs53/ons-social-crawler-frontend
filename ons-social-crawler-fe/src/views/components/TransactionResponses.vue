<script setup>
import ZingChartVue from 'zingchart-vue'
</script>
<template>
  <ZingChartVue :data="horizBarGraphConfig" />
</template>
<script>
export default {
  props: ['entries'],
  computed: {
    values() {
      // Create an object to count the occurrences of each word
      const responseCount = {}

      this.entries.forEach((item) => {
        const response = item.response
        if (response != null) {
          if (responseCount[response]) {
            responseCount[response] += 1
          } else {
            responseCount[response] = 1
          }
        }
      })

      // Convert the word count object into an array of objects
      const responses = Object.entries(responseCount).map(([text, count]) => ({
        text,
        count
      }))

      // Sort the array by decreasing count
      responses.sort((a, b) => b.count - a.count)

      //console.log(responses)
      return responses
    },
    horizBarGraphConfig() {
      const bars_to_show = 10

      //console.log(this.values)
      const labels = this.values
        .slice(0, bars_to_show)
        .map((item) =>
          item.text !== 'miss' ? item.text : 'Dati insufficienti per elaborare una risposta'
        )
      const values = this.values.slice(0, bars_to_show).map((item) => item.count)
      // const values = this.values.map((item) => item.count)
      // const labels = this.values.map((item) => item.text)

      //console.log(labels)
      //console.log(values)

      const seriesData = [
        {
          values: values,
          text: labels
        }
      ]

      //console.log(seriesData)

      const config = {
        type: 'hbar',
        title: {
          text: 'Top ' + bars_to_show + ' Responses'
        },
        plot: {
          tooltip: {
            text: ''
          },
          valueBox: {
            text: '%data-response',
            placement: 'bottom-in',
            align: 'left',
            color: 'black'
          },
          dataResponse: labels.reverse(),
          animation: {
            effect: 'ANIMATION_SLIDE_BOTTOM'
          }
        },
        scaleX: {
          values: values.reverse(),
          label: {
            text: 'Numero' // X-axis labels
          }
        },
        scaleY: {
          item: {
            text: ''
          }
        },
        series: seriesData
      }
      return config
    }
  }
}
</script>
