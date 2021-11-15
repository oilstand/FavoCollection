<template>
  <div class="main-body">
    <slot />
  </div>
</template>

<style scoped>

</style>

<script>
export default {
    htmlAttrs: {
        lang: 'ja',
        prefix: 'og: http://ogp.me/ns#'
    },
    head: {
        title: 'Nuxt3 default',
        script: []
    }
}
</script>
