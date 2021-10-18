<template>
  <div class="spine-animation-select">

    <div class="row select-file-container">
      <h2>Select your JSON</h2>  
      <input class="input-file" type="file" accept="application/JSON" @change="onFileChange">
    </div>
  
    <div class="row select-animation-properties-container">
      <div class="column select-animation-properties">
        <div class="row">
          <h2>Animations &amp; Properties</h2>
        </div>
        <div class="row animation-select-area">
          <select size="15" v-model="selected_animation">
            <option v-for="animation in animations" :key="animation" >
              {{ animation }}
            </option>
          </select>
        </div>
        <div class="row buttons-container">
          <button class="button-pause" :disabled='resume_button_disabled' v-if="pause_button_clicked" @click="pauseCurrentAnimation">Pause</button>
          <button v-else class="button-pause" @click="pauseCurrentAnimation">Resume</button>
        </div>
        <div class="row flex-tools">
          <div class="row loop-animation-tool">
            <label for="loop">Loop</label>
            <input type="checkbox" id="loop" name="loop" v-model="checked" :disabled="resume_button_disabled">
          </div>
          <div class="row animation-speed-tool">
            <label for="animation_speed">Animation Speed:</label>&nbsp;&nbsp;
            <input
              @v-model="animation_speed"
              @blur="formatInput($event)"
              @keypress="isNumber($event)"
              @change="formatInput($event), playCurrentAnimation()"
              :disabled="resume_button_disabled"
              type="number" id="animation_speed" name="animation_speed" min="0" max="10" value="1">
          </div>
        </div>
      </div>
      <div class="column range-animation-container">
        <div class="row">
          <input type="range" v-model="scale_x_value" min="0" max="3" step="0.1" class="scale-x-slider" id="myRange" :disabled="resume_button_disabled"> 
          <span class="scale-x-slider">Scale X : {{ scale_x_value }}</span>
        </div>
        <div class="row">
          <input type="range" v-model="scale_y_value" min="0" max="3" step="0.1" class="scale-y-slider" id="myRange" :disabled="resume_button_disabled">
          <span class="scale-y-slider">Scale Y : {{ scale_y_value }}</span>
        </div>
        <div class="row">
          <input type="range" v-model="alpha_value" min="0" max="1" step="0.01" class="alpha-slider" id="myRange" :disabled="resume_button_disabled">
          <span class="alpha-slider">Alpha : {{ alpha_value }}</span>
        </div>
        <div class="row" style="text-align:center;margin-top:30px;margin-right:12px;">
           <button class="button-reset" @click="resetValues" :disabled="resume_button_disabled">Reset</button>
        </div>
      </div>
    </div>
    
    <div class="row text-area-container">
      <h2>JSON Viewer</h2>   
      <textarea disabled v-model="json_file" name="json-viewer" id="text_area" cols="60" rows="22"></textarea>
    </div>

  </div>
</template>

<script>
import { scaleXCurrentPlayingAnimation, scaleYCurrentPlayingAnimation, changeAlphaCurrentPlayingAnimation, destroyAnimation, playAnimation, pauseCurrentPlayingAnimation } from '../../src/AppPixiLoader';

export default {
    name: 'SpineAnimationSelect',
    data() {
      return {
        json_file_name: '',
        animations: [],
        selected_animation: '',
        file: null,
        current_animation_play_loop: false,
        animation_speed: 1,
        pause_button_clicked: true,
        json_file: null,
        scale_x_value: 1,
        scale_y_value: 1,
        alpha_value: 1,
        checked: true,
        resume_button_disabled: true,
        initial: true
      }
    },
    methods: {
      isNumber: function(evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) 
          evt.preventDefault();
        else return true;
      },
      onFileChange(e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        this.json_file_name = files[0].name;
        this.file = files[0];
        this.readFile(files[0]);
      },
      readFile(file) {
        let reader = new FileReader();
        this.animations = [];
        reader.onload = e => {
          let json = JSON.parse(e.target.result);
          let been_in_loop = false;
          for(const property in json.animations){
            this.animations.push(property);
            if(property.includes('idle') && !been_in_loop) {
              this.selected_animation = property;
              this.playCurrentAnimation();
              been_in_loop = true;
            }
          }
          this.json_file = JSON.stringify(json, null, "\t"); // stringify with tabs inserted at each level
          this.json_file = JSON.stringify(json, null, 2);    // stringify with 4 spaces at each level
        };
        reader.readAsText(file);
      },
      setResumeButtonEnabled() {
        if(this.file !== null) this.resume_button_disabled = false;
      },
      playCurrentAnimation() {
        destroyAnimation();        
        let aux_object = {
          file: this.file, 
          json_file_name: this.json_file_name, 
          selected_animation: this.selected_animation,
          current_animation_play_loop: this.checked,
          animation_speed: this.animation_speed
        };
        playAnimation(aux_object);
        this.pause_button_clicked = true;
      },
      pauseCurrentAnimation() {
        this.pause_button_clicked = !this.pause_button_clicked;
        pauseCurrentPlayingAnimation(this.animation_speed);
      },
      formatInput($event) {
        this.animation_speed = $event.currentTarget.value;
      },
      changeScaleX() {
        scaleXCurrentPlayingAnimation(this.scale_x_value);
      },
      changeScaleY() {
        scaleYCurrentPlayingAnimation(this.scale_y_value);
      },
      changeAlpha() {
        changeAlphaCurrentPlayingAnimation(this.alpha_value);
      },
      resetValues() {
        this.scale_x_value = 1;
        this.scale_y_value = 1;
        this.alpha_value = 1;
        scaleXCurrentPlayingAnimation(this.scale_x_value);
        scaleYCurrentPlayingAnimation(this.scale_y_value);
        changeAlphaCurrentPlayingAnimation(this.alpha_value);
      }
    },
    watch: {
      scale_x_value: function(){
        this.changeScaleX();
      },
      scale_y_value: function(){
        this.changeScaleY();
      },
      alpha_value: function(){
        this.changeAlpha();
      },
      selected_animation: function() {
        if(!this.initial)
          this.playCurrentAnimation();
        else this.initial = false;
        
        this.setResumeButtonEnabled();
      },
      checked: function() {
        this.playCurrentAnimation();
      }
    },
}
</script>

<style scoped>

button {
  border-radius: 20px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  background-color: aliceblue;
}

button:hover { 
  background-color: rgb(53, 147, 224);
}

button:active { 
  background-color: rgb(35, 70, 99);
}

button:focus { 
  outline: none;
}

input {
  cursor: pointer;
  border-radius: 20px;
  border: none ;
  background-color: rgb(56, 55, 55);
  color: aliceblue;
  outline: none;
}

select {
  width: 100%;
  cursor: pointer;
  background-color: rgb(21, 20, 20);
  color: aliceblue;
  border: none;
  outline: none;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  overflow-y: auto;
}

option:hover {
  background-color: rgb(53, 147, 224);
  color: aliceblue;
}

textarea {
  resize: none;
  width: 100%;
  background-color: rgb(21, 20, 20);
  color: aliceblue;
  border: none;
  outline: none;
  overflow-y: auto;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.select-animation-properties-container {
  display: flex;
  flex-wrap: nowrap;
}

.select-animation-properties {
  width: 55%;
}

.range-animation-container {
  margin-top: 45px;
  width: 45%;
}

.range-span {
  margin-left: 35%;
}

.scale-x-slider, .scale-y-slider, .alpha-slider {
  margin-top: 10%;
  margin-left: 35%;
}

.file-input{
  cursor: pointer;
}

.input-file {
  margin: 15px 0px 15px 0px;
  cursor: pointer;
}

.button-play {
  font-weight: bold;
  width: 40%;
  margin-right: 20px;
  height: 30px;
}

.button-pause {
  width: 40%;
  margin-right: 20px;
  height: 30px;
}

.button-reset {
  width: 40%;
  margin-left: 30px;
  height: 30px;
}

.select-file-container {
  width: 100%;
  margin-bottom: 20px;
}

#loop {
  margin-left: 10px;
}

.animation-speed-tool {
  margin-left: 20px;
}

.flex-tools {
  display: flex;
  margin-top: 25px;
}

.text-area-container {
  margin-top: 70px;
}

input[type='range'] {
  overflow: hidden;
  -webkit-appearance: none;
  border-radius: 20px;
}
    
input[type='range']::-webkit-slider-runnable-track {
  height: 10px;
  -webkit-appearance: none;
  color: rgb(53, 147, 224);
}

input[type='range']::-webkit-slider-thumb {
  width: 10px;
  border-radius: 10px;
  -webkit-appearance: none;
  height: 10px;
  background: aliceblue;
  box-shadow: -80px 0 0 75px rgb(53, 147, 224);
}

input[type=file]::-webkit-file-upload-button { /* chromes and blink button */
    cursor: pointer; 
}

#animation_speed {
  padding-left: 10px;
}
</style>