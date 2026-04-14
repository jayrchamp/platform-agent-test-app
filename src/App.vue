<template>
  <div class="container">
    <h1>Test App</h1>
    <p class="status">Status: <span class="ok">Running</span></p>
    <p class="info">Deployed via Platform DB Manager</p>
    <div class="meta">
      <p>Port: 3000</p>
      <p>Build: {{ buildTime }}</p>
      <p>Uptime: {{ uptime }}s</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const buildTime = __BUILD_TIME__;
const uptime = ref(0);
let interval: ReturnType<typeof setInterval>;

onMounted(() => {
  interval = setInterval(() => { uptime.value++; }, 1000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #0f172a;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
.container {
  text-align: center;
  padding: 3rem;
  background: #1e293b;
  border-radius: 1rem;
  border: 1px solid #334155;
  max-width: 400px;
  width: 100%;
}
h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #f8fafc;
}
.status { margin-bottom: 0.5rem; }
.ok { color: #4ade80; font-weight: 600; }
.info { color: #94a3b8; font-size: 0.875rem; margin-bottom: 1.5rem; }
.meta {
  background: #0f172a;
  border-radius: 0.5rem;
  padding: 1rem;
  font-size: 0.75rem;
  color: #64748b;
}
.meta p { margin: 0.25rem 0; }
</style>
