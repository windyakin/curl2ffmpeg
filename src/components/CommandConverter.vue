<template>
  <div>
    <div class="card my-4">
      <div class="card-body">
        <form acton="#" @submit.prevent="parseCommand">
          <div class="mb-3">
            <label for="command" class="form-label">cURL command</label>
            <textarea v-model="command" id="command" class="form-control monospace" rows="12" />
          </div>
            <label for="command" class="form-label">Output file name</label>
          <div class="mb-3">
            <input v-model="filename" id="filename" type="text" class="form-control" />
          </div>
          <button type="submit" class="btn btn-primary">Convert</button>
        </form>
      </div>
    </div>

    <div v-if="url">
      <div class="card bg-secondary text-white">
        <div class="card-header">Result</div>
        <div class="card-body">
          <FFMpegCommand :url="url" :headers="headers" :filename="filename" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CurlCommand from '~/lib/CurlCommand.js'
import FFMpegCommand from '~/components/FFmpegCommand.vue'

export default {
  components: {
    FFMpegCommand
  },
  data() {
    return {
      command: '',
      url: '',
      headers: [],
      filename: 'movie.mp4'
    };
  },
  methods: {
    parseCommand() {
      this.url = ''
      this.headers = ''
      if (!this.command) {
        return
      }
      const curlCommand = new CurlCommand(this.command.trim());
      this.url = curlCommand.url;
      this.headers = curlCommand.headers;
    }
  }
}
</script>

<style>
.monospace {
  font-family: monospace;
}
</style>
