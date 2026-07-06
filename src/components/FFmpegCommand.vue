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
        <div class="monospace">{{ commandText }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import FFmpegCommand from '~/lib/FFmpegCommand.js';

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

    const commandText = computed(() => new FFmpegCommand(props.url, props.headers, props.filename).toString());

    const copy = async () => {
      await navigator.clipboard.writeText(commandText.value);
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
      copy,
      commandText
    };
  }
};
</script>
