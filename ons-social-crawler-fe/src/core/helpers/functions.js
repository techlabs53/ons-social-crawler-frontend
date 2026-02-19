import he from 'he'
import { useI18n } from 'vue-i18n'

const global = () => {
  const { t, te } = useI18n()

  const dateFormatter = (date) => {
    if (date) {
      const objDate = new Date(date)
      return objDate.toLocaleDateString('it-IT')
    }
    return
  }

  const dateTimeFormatter = (date) => {
    if (date) {
      const objDate = new Date(date)
      const format = Intl.DateTimeFormat('it-IT', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      }).format(objDate)
      return format
    }
    return
  }

  const decodeHtml = (value) => {
    try {
      return he.decode(value.replaceAll('###REPLACED_USER_ONS###', '@utente'))
    } catch {
      return value
    }
  }

  const translate = (key, value) => {
    const word = `${key}.${value}`
    return te(word) ? t(word) : value
  }

  return {
    dateFormatter,
    dateTimeFormatter,
    decodeHtml,
    translate
  }
}

export default global
