<template>
    <div class="column pixi-spine-viewer-app">
    </div>
</template>

<script> 
import { loadPixiSpine } from '../../src/AppPixiLoader';

export default {
    data() {
        return {
            app: loadPixiSpine()
        }
    },
    mounted(){
        this.$el.appendChild(this.app.view)
    }
}
</script>

<style scoped>
    
</style>