<template>
  <div id="wrapper">
    <div id="overlay-wrapper">
      <canvas ref="overlay"></canvas>
    </div>
  </div>
</template>

<script>
  import * as PIXI from 'pixi.js'

  export default {
    name: 'landing-page',
    data () {
      return {
        PIXIApp: null
      }
    },
    methods: {
      preload () {
        console.log('@preload')
        let datas = [
          {name: 'brush', url: '/static/brush_b.png'},
          {name: 'test-movie', url: '/static/mg.mp4'}
        ]
        PIXI.loader.add(datas)
        PIXI.loader.load(this.initialize)
      },
      initialize (loader, resources) {
        console.log('@initialize')
        var app = new PIXI.Application(800, 600, { transparent: true })
        document.body.appendChild(app.view)

        // Create play button that can be used to trigger the video
        var button = new PIXI.Graphics()
          .beginFill(0x0, 0.5)
          .drawRoundedRect(0, 0, 100, 100, 10)
          .endFill()
          .beginFill(0xffffff)
          .moveTo(36, 30)
          .lineTo(36, 70)
          .lineTo(70, 50)

        // Position the button
        button.x = (app.screen.width - button.width) / 2
        button.y = (app.screen.height - button.height) / 2

        // Enable interactivity on the button
        button.interactive = true
        button.buttonMode = true

        // Add to the stage
        app.stage.addChild(button)

        // Create video playback layer

        // create a video texture from a path
        var texture = PIXI.Texture.fromVideo('/static/mg.mp4')

        // create a new Sprite using the video texture (yes it's that easy)
        var videoSprite = new PIXI.Sprite(texture)

        // Stetch the fullscreen
        videoSprite.width = app.screen.width
        videoSprite.height = app.screen.height

        app.stage.addChild(videoSprite)
      }
    },
    mounted () {
      this.commands = {
        'p': this.preview,
        'a': this.videoTogglePlay,
        'z': this.videoPrevFrame,
        'e': this.videoNextFrame,
        'q': this.capture,
        's': this.toggleOverlay,
        'd': this.toggleMask,
        'w': this.brushScaleUp,
        'x': this.brushScaleDown,
        'c': this.brushToggleErase
      }

      document.onkeypress = this.keyPressed

      window.vm = this
      this.preload()
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { 
    font-family: 'Source Sans Pro', sans-serif; 
    background-color: 'rebeccapurple';
  }

  #wrapper {
    height: 100vh;
    width: 100vw;
  }

  #video, #overlay-wrapper {
    position:absolute;
    top: 0;
    left: 0;
  }
  
</style>
