<template>
  <div>
    <div class="monospace">
      ffmpeg
      -headers
      <span v-for="(header, index) in headers" :key="index">'{{ header }}'<span v-if="headers.length - 1 !== index">$'\r\n'</span></span>
      -i '{{ url }}'
      -c copy
      {{ filename }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true
    },
    headers: {
      type: Array,
      default: []
    },
    filename: {
      type: String,
      required: true
    }
  }
}
</script>
