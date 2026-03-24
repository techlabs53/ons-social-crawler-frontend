<script setup>
import ZingChartVue from 'zingchart-vue'
</script>
<template>
    <ZingChartVue :data="wordCloudConfig" />
    <ZingChartVue :data="barGraphConfig" />
</template>
<script>
export default {
  props: ['entries'],
  computed: {
    colors() {
      return [
      '#00008B', // Dark Blue
      '#0000CD',
      '#0000FF', // Blue
      '#191970',
      '#4169E1', // Royal Blue
      '#6495ED',
      '#87CEEB', // Sky Blue
      '#87CEFA',
      '#ADD8E6', // Light Blue
      '#B0E0E6',
      '#B0C4DE',
      '#1E90FF',
      '#F0F8FF', // Alice Blue
      '#F0FFFF',
      '#E6E6FA', // Lavender
      ]
    },
    values() {
      // Create an object to count the occurrences of each word
      const wordCount = {}

      this.entries.forEach((item) => {
        const tokens = item.tokens.split(' ') // Split tokens into individual words
        tokens.forEach((token) => {
          // Exclude empty words
          if (token.trim() !== '') {
            if (wordCount[token]) {
              wordCount[token] += 1
            } else {
              wordCount[token] = 1
            }
          }
        })
      })

      // Convert the word count object into an array of objects
      const words = Object.entries(wordCount).map(([text, count]) => ({
        text,
        count,
      }))

      // Sort the array by decreasing count
      words.sort((a, b) => b.count - a.count)

      //console.log(words)
      return words
    },
    wordCloudConfig() {
      const colors = this.colors

      const wordCloudData = this.values.map((item, index) => ({
        text: item.text,
        count: item.count,
        color: colors[index % colors.length],
      }))

      const config = {
        type: 'wordcloud',
        options: {
          words: wordCloudData,
          normalize: true,
        },
      }
      return config
    },
    barGraphConfig() {
      const bars_to_show = 10
      const colors = this.colors
      const labels = this.values.slice(0, bars_to_show).map((item) => item.text)
      const values = this.values.slice(0, bars_to_show).map((item) => item.count)

      //console.log(labels)
      //console.log(values)

      const seriesData = [{
        values: values,
      }]

      //console.log(seriesData)

      const config = {
        type: 'bar',
        title: {
          text: "Top " + bars_to_show + " Words",
        },
        plot: {
          aspect: 'horizontal',
          styles: colors,
        },
        scaleX: {
          labels: labels, // X-axis labels
        },
        series: seriesData,
      }
      return config
    },
  }
}
</script>
