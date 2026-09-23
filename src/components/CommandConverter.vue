<template>
  <div>
    <div class="card my-4">
      <div class="card-body">
        <form acton="#" @submit.prevent="submit">
          <div class="mb-3">
            <label for="command" class="form-label">cURL command</label>
            <textarea v-model="command" id="command" class="form-control monospace" rows="10" />
          </div>
          <div class="mb-3">
            <label for="filename" class="form-label">Output file name</label>
            <div class="input-group">
              <input v-model="filename" id="filename" type="text" class="form-control" />
              <button type="button" class="btn btn-outline-secondary d-flex align-items-center" title="Random" aria-label="Random" @click="randomize">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <rect x="1.5" y="1.5" width="13" height="13" rx="2.5" fill="none" stroke="currentColor" />
                  <circle v-for="([cx, cy], i) in DICE_PIPS[dice - 1]" :key="i" :cx="cx" :cy="cy" r="1.25" />
                </svg>
              </button>
            </div>
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
import randomFilename from '~/lib/RandomFilename.js';

// Pip positions for each dice face (1 to 6).
const [L, C, R] = [4.75, 8, 11.25];
const DICE_PIPS = [
  [[C, C]],
  [[L, L], [R, R]],
  [[L, L], [C, C], [R, R]],
  [[L, L], [R, L], [L, R], [R, R]],
  [[L, L], [R, L], [C, C], [L, R], [R, R]],
  [[L, L], [R, L], [L, C], [R, C], [L, R], [R, R]]
];

export default {
  components: {
    FFMpegCommand
  },
  setup() {
    const command = ref('');
    const url = ref('');
    const headers = ref([]);
    const filename = ref('movie.mp4');
    const dice = ref(5);

    const randomize = () => {
      // Roll a face different from the current one so the icon always changes.
      dice.value = ((dice.value + Math.floor(Math.random() * 5)) % 6) + 1;
      const extension = filename.value.match(/\.([^.]+)$/)?.[1] || 'mp4';
      filename.value = randomFilename({ extension });
    };

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
      dice,
      DICE_PIPS,
      randomize,
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
