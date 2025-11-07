<script setup>
</script>

<template>
<div class="min-h-screen" :style="{ backgroundColor: 'var(--color-ivory)' }">
  <router-view />
</div>
</template>

<style>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
html, body, #app {
  height: 100%;
}
body {
  background-color: var(--color-ivory);
}
</style>