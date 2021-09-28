<script setup>
import FFMpegCommand from '~/components/FFmpegCommand.vue'
</script>

<template>
  <div>
    <form acton="#" @submit.prevent="parseCommand">
      <textarea v-model="command" />
      <input v-model="filename" type="text" />
      <button type="submit">Submit</button>
    </form>

    <FFMpegCommand v-if="url" :url="url" :headers="headers" :filename="filename" />
  </div>
</template>

<script>
import CurlCommand from '~/lib/CurlCommand.js'

export default {
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
}
</style>
