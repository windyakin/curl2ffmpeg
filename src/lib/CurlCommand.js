// Options that consume the next token as their value. Their values must be
// skipped so that something like `-e 'https://example.com/'` is not mistaken
// for the request URL.
const OPTIONS_WITH_VALUE = new Set([
  '-A', '--user-agent',
  '-b', '--cookie',
  '-d', '--data', '--data-raw', '--data-binary', '--data-urlencode',
  '-e', '--referer',
  '-m', '--max-time',
  '-o', '--output',
  '-r', '--range',
  '-u', '--user',
  '-x', '--proxy',
  '-X', '--request',
])

export default class CurlCommand {
  constructor(curlCommand) {
    this.command = curlCommand
    this.url = ''
    this.headers = []
    this.parseCommand()
  }

  parseCommand() {
    const tokens = this.tokenize(this.command)
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      if (i === 0 && token === 'curl') {
        continue
      }
      if (token === '-H' || token === '--header') {
        i++
        if (i < tokens.length) {
          this.headers.push(tokens[i])
        }
        continue
      }
      if (token.startsWith('--header=')) {
        this.headers.push(token.slice('--header='.length))
        continue
      }
      if (token.startsWith('-H') && token.length > 2) {
        this.headers.push(token.slice(2))
        continue
      }
      if (token === '--url') {
        i++
        if (i < tokens.length) {
          this.url = tokens[i]
        }
        continue
      }
      if (OPTIONS_WITH_VALUE.has(token)) {
        i++
        continue
      }
      if (token.startsWith('-')) {
        continue
      }
      if (!this.url && /^https?:\/\//.test(token)) {
        this.url = token
      }
    }
  }

  // Split a shell command line into tokens, honoring single/double quotes,
  // backslash escapes, and backslash-newline line continuations.
  tokenize(command) {
    const tokens = []
    let current = ''
    let inToken = false
    let quote = null
    for (let i = 0; i < command.length; i++) {
      const char = command[i]
      if (quote === `'`) {
        if (char === `'`) {
          quote = null
        } else {
          current += char
        }
        continue
      }
      if (quote === `"`) {
        if (char === `"`) {
          quote = null
        } else if (char === `\\` && /["\\$`\n]/.test(command[i + 1])) {
          i++
          if (command[i] !== '\n') {
            current += command[i]
          }
        } else {
          current += char
        }
        continue
      }
      if (char === `'` || char === `"`) {
        quote = char
        inToken = true
        continue
      }
      if (char === `\\`) {
        i++
        if (i < command.length && command[i] !== '\n') {
          current += command[i]
          inToken = true
        }
        continue
      }
      if (/\s/.test(char)) {
        if (inToken) {
          tokens.push(current)
          current = ''
          inToken = false
        }
        continue
      }
      current += char
      inToken = true
    }
    if (inToken) {
      tokens.push(current)
    }
    return tokens
  }
}
