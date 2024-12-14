<template>
  <div>
    <div class="card my-4">
      <div class="card-body">
        <form acton="#" @submit.prevent="submit">
          <div class="mb-3">
            <label for="command" class="form-label">cURL command</label>
            <textarea v-model="command" id="command" class="form-control monospace" rows="10" />
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
      <FFMpegCommand :url="url" :headers="headers" :filename="filename" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import CurlCommand from '~/lib/CurlCommand.js';
import FFMpegCommand from '~/components/FFmpegCommand.vue';

export default {
  components: {
    FFMpegCommand
  },
  setup() {
    const command = ref('');
    const url = ref('');
    const headers = ref([]);
    const filename = ref('movie.mp4');

    const submit = () => {
      url.value = '';
      headers.value = '';
      if (!command.value) {
        return;
      }
      const curlCommand = new CurlCommand(command.value.trim());
      url.value = curlCommand.url;
      headers.value = curlCommand.headers;
    };

    return {
      command,
      url,
      headers,
      filename,
      submit
    };
  }
};
</script>

<style>
.monospace {
  font-family: monospace;
}
</style>
