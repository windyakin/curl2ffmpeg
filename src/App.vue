<template>
  <div class="container">
    <div class="row justify-content-center my-4">
      <div class="col col-12 col-lg-8">
        <h1>curl2ffmpeg</h1>
        <a href="https://github.com/windyakin/curl2ffmpeg">GitHub Repository</a>
        <CommandCoverter />
      </div>
    </div>
    <div class="row justify-content-center my-4">
      <div class="col col-12 col-lg-8 text-end">
        &copy; 2021 windyakin
      </div>
    </div>
  </div>
</template>

<script>
import CommandCoverter from '~/components/CommandConverter.vue'

export default {
  components: {
    CommandCoverter
  }
}
</script>
