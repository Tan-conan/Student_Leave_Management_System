<script setup>
</script>

<template>
<div class="min-h-screen bg-(--color-cream)">
  <router-view />
</div>
</template>

<style scoped>
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
</style>


<!--
npm run dev
ctrl + C stop server

之后开发时

写完代码后：

git add .
git commit -m "描述一下改动"
git push


就能把最新代码同步到 GitHub。
-->