// Options that curl converts into request headers. A -H/--header with the
// same header name takes precedence over these, matching curl's behavior.
const HEADER_OPTIONS = new Map([
  ['-A', 'User-Agent'],
  ['--user-agent', 'User-Agent'],
  ['-b', 'Cookie'],
  ['--cookie', 'Cookie'],
  ['-e', 'Referer'],
  ['--referer', 'Referer'],
])

// Options that consume the next token as their value. Their values must be
// skipped so that something like `-x 'http://proxy/'` is not mistaken for
// the request URL.
const OPTIONS_WITH_VALUE = new Set([
  '-d', '--data', '--data-raw', '--data-binary', '--data-urlencode',
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
    const optionHeaders = new Map()
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
      if (HEADER_OPTIONS.has(token)) {
        i++
        if (i < tokens.length) {
          this.stackHeaderOption(optionHeaders, HEADER_OPTIONS.get(token), tokens[i])
        }
        continue
      }
      const longOption = token.match(/^(--[a-z-]+)=([\s\S]*)$/)
      if (longOption && HEADER_OPTIONS.has(longOption[1])) {
        this.stackHeaderOption(optionHeaders, HEADER_OPTIONS.get(longOption[1]), longOption[2])
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
    for (const [name, value] of optionHeaders) {
      if (this.headers.some((header) => header.toLowerCase().startsWith(`${name.toLowerCase()}:`))) {
        continue
      }
      this.headers.push(`${name}: ${value}`)
    }
  }

  // Accumulate a header derived from an option such as -b or -e.
  // Cookie values without '=' are cookie jar filenames in curl, which are
  // useless here. Multiple cookies are joined the way the cookie engine
  // sends them; for other headers the last option wins, as in curl.
  stackHeaderOption(optionHeaders, name, value) {
    if (name === 'Cookie') {
      if (!value.includes('=')) {
        return
      }
      const existing = optionHeaders.get(name)
      optionHeaders.set(name, existing ? `${existing}; ${value}` : value)
      return
    }
    if (name === 'Referer') {
      value = value.replace(/;auto$/, '')
    }
    if (value !== '') {
      optionHeaders.set(name, value)
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
