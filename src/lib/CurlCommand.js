export default class CurlCommand {
  constructor(curlCommand) {
    this.command = curlCommand
    this.url = ''
    this.headers = []
    this.parseCommand()
  }

  parseCommand() {
    const command = this.command;
    command.split(' ').reduce((accumulator, current) => {
      if (accumulator.flag) {
        if (/^['"]/.test(current)) {
          accumulator.temp = current.replace(/^['"](.*)$/, '$1')
          accumulator.quote = this.judgeQuote(current[0])
          return accumulator
        }
        if (/[^\\]['"]$/.test(current) && this.judgeQuote(current.slice(-1)[0]) === accumulator.quote) {
          const tmpCurrent = current.replace(/^(.*[^\\])['"]$/, '$1')
          this.headers.push(`${accumulator.temp} ${tmpCurrent}`)
          accumulator.temp = ''
          accumulator.flag = false
        } else {
          accumulator.temp = `${accumulator.temp} ${current}`
        }
        return accumulator
      } else {
        if (/^curl$/.test(current)) {
          return accumulator
        }
        if (/^['"]https?:\/\/.*$/.test(current)) {
          this.url = current.replace(/^['"](.+)['"]$/, '$1')
          return accumulator
        }
        if (/^-H$/.test(current)) {
          accumulator.flag = true
        }
      }
      return accumulator
    }, {
      temp: '',
      flag: false,
      quote: ''
    })
  }

  judgeQuote(quote) {
    switch (quote) {
      case `"`:
        return 'double'
      case `'`:
        return 'single'
    }
  }
}
