<template>
    <div class="column pixi-spine-viewer-app">
      <div class="animation-viewer-text">|Animation Viewer|</div>
      <PixiSpineViewerApp/>
    </div>
    <div class="column pixi-spine-tools">
      <div class="animation-tools-text">|Animation Tools|</div>
      <PixiSpineTools/>
    </div>
</template>

<script>
import PixiSpineViewerApp from './components/PixiSpineViewerApp.vue';
import PixiSpineTools from './components/PixiSpineTools.vue';

export default {
  name: 'App',
  components: {
    PixiSpineViewerApp,
    PixiSpineTools
  }
}
</script>

<style>
#app {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
}

.animation-viewer-text {
  font-size: 24px;
  margin-bottom: 5px;
  text-align: center;
  font-family: Georgia, 'Times New Roman', Times, serif;
}

.animation-tools-text {
  font-size: 24px;
  margin-bottom: 5px;
  text-align: center;
  font-family: Georgia, 'Times New Roman', Times, serif;
}

.pixi-spine-viewer-app {
  flex-basis: 65%;
  border-radius: 20px;
  background-color: black;
}

.pixi-spine-tools {
  margin: 0px 20px 0px 20px;
  flex-basis: 35%;
}
</style>
