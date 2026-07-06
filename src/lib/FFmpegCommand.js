export default class FFmpegCommand {
  constructor(url, headers, filename) {
    this.url = url
    this.headers = headers
    this.filename = filename
  }

  toString() {
    const parts = ['ffmpeg']
    if (this.headers.length > 0) {
      parts.push('-headers', this.headers.map((header) => this.quote(header)).join(`$'\\r\\n'`))
    }
    parts.push('-i', this.quote(this.url), '-c', 'copy', this.quote(this.filename))
    return parts.join(' ')
  }

  // Wrap a value in single quotes for the shell, escaping any single quotes
  // inside the value.
  quote(value) {
    return `'${value.replace(/'/g, `'\\''`)}'`
  }
}
