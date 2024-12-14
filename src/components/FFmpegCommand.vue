<template>
  <div>
    <div class="card bg-secondary text-white">
      <div class="card-header">
        <div class="d-flex align-items-center">
          <div class="">Result</div>
          <div class="ms-auto m-n1">
            <button class="btn btn-sm btn-outline-light" v-on:click="copy" :disabled="coppyButtonDisabled">
              {{ copyButtonText }}
            </button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div ref="command" class="monospace">
          ffmpeg
          <span v-if="headers.length > 0">-headers </span>
          <span v-for="(header, index) in headers" :key="index">'{{ header }}'<span v-if="headers.length - 1 !== index">$'\r\n'</span></span>
          -i '{{ url }}'
          -c copy
          '{{ filename }}'
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  props: {
    url: {
      type: String,
      required: true
    },
    headers: {
      type: Array,
      default: () => []
    },
    filename: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const copyButtonText = ref('Copy');
    const coppyButtonDisabled = ref(false);
    const command = ref(null);

    const copy = async () => {
      await navigator.clipboard.writeText(command.value.textContent.trim());
      copyButtonText.value = '✓ Copied';
      coppyButtonDisabled.value = true;
      setTimeout(() => {
        copyButtonText.value = 'Copy';
        coppyButtonDisabled.value = false;
      }, 500);
    };

    return {
      copyButtonText,
      coppyButtonDisabled,
      command,
      copy,
      headers: computed(() => props.headers),
      url: computed(() => props.url),
      filename: computed(() => props.filename)
    };
  }
};
</script>
