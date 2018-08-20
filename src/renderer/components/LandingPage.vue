<template>
  <div id="wrapper">
    <div id="overlay-wrapper">
      <canvas ref="overlay"></canvas>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<script>
  /* Programme, dans l'ordre :
  - mettre à jour les fonctionnalités vidéo sur la version PIXI (attacher la video ?)
  - gestion de l'export
  - gestion de la preview
  - intégration dans Socialite :
    * brush/erase
    * brush ++/--
    * preview
    * terminé
    La première image de la vidéo est choisie de façon automatique comme still frame.
  - fonctionnalités hardness, opacity
  */

  import * as PIXI from 'pixi.js'

  const VIDEO_WIDTH = 1280
  const VIDEO_HEIGHT = 720

  // const FRAME_DURATION = 25.0 / 60.0

  const BRUSH_SCALE_MIN = 0.1
  const BRUSH_SCALE_MAX = 2.0
  const BRUSH_SCALE_INC = 0.1

  const MASK_ALPHA = 0.5

  export default {
    name: 'landing-page',
    data () {
      return {
        helperCanvas: null,
        PIXIApp: null,
        maskTexture: null,
        brush: null,
        brushAsset: null,
        resources: null,
        overlay: null,
        dragging: false,
        scale: 1.0,
        state: {
          erasing: false
        }
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
        console.log('@initialize', loader, resources)
        window.resources = resources
        window.loader = loader

        this.resources = resources
        this.helperCanvas = document.createElement('canvas')
        this.initializePIXI()
      },
      //
      // - PIXI
      //
      initializePIXI () {
        console.log('@initializePIXI')
        let videoW = VIDEO_WIDTH
        let videoH = VIDEO_HEIGHT
        const canvas = this.$refs.overlay
        // canvas.width = w
        // canvas.height = h

        this.PIXIApp = new PIXI.Application(videoW, videoH, {
          view: canvas,
          transparent: true
        })

        let app = this.PIXIApp

        // Create the brush

        let brush = new PIXI.Container()
        let brushAsset = new PIXI.Sprite(this.resources['brush'].texture)
        brush.addChild(brushAsset)
        brushAsset.anchor.x = 0.5
        brushAsset.anchor.y = 0.5
        this.brush = brush
        this.brushAsset = brushAsset
        this.brushSetErase(true)

        // Create video playback layer

        let videoTexture = PIXI.Texture.fromVideo('/static/mg.mp4')
        let videoSprite = new PIXI.Sprite(videoTexture)
        videoSprite.width = videoW
        videoSprite.height = videoH
        app.stage.addChild(videoSprite)

        // Create (w x h) black and white texture.
        // Initially, the masked area is totally blank
        this.maskTexture = PIXI.RenderTexture.create(videoW, videoH)
        let graphic = new PIXI.Graphics()
        graphic.beginFill(0xFFFFFF)
        graphic.drawRect(0, 0, videoW, videoH)
        graphic.endFill()
        this.PIXIApp.renderer.render(graphic, this.maskTexture)

        // Create a sprites from the maskTexture
        // - maskTextureSprite will be applied as effective mask.
        //   It has a plain opacity and presents maskTexture as it is.
        // - maskTextureVisual will be displayed.
        //   It has a reduced opacity and will provide a feedback to the user,
        //   helping him to draw the shape of the mask.

        this.maskTextureSprite = new PIXI.Sprite(this.maskTexture)
        this.maskTextureVisual = new PIXI.Sprite(this.maskTexture)
        this.maskTextureVisual.alpha = MASK_ALPHA
        app.stage.addChild(this.maskTextureVisual)

        app.stage.interactive = true
        app.stage.on('pointerdown', this.pointerDown)
        app.stage.on('pointerup', this.pointerUp)
        app.stage.on('pointermove', this.pointerMove)
      },
      //
      // - Handle brush events
      //
      pointerMove (event) {
        if (this.dragging) {
          console.log('pointerMove')
          this.brush.position.copy(event.data.global)
          this.PIXIApp.renderer.render(this.brush, this.maskTexture, false, null, false)
        }
      },
      pointerDown (event) {
        console.log('pointerDown')
        this.dragging = true
        this.pointerMove(event)
      },
      pointerUp (event) {
        console.log('pointerUp')
        this.dragging = false
      },
      //
      // - CONTROLS
      //
      videoTogglePlay () {
        console.log('videoTogglePlay')
        // if (this.video.paused) {
        //   this.video.play()
        // } else {
        //   this.video.pause()
        // }
      },
      videoPrevFrame () {
        console.log('videoPrevFrame')
        // if (this.video.paused) {
        //   let v = this.video
        //   let t = v.currentTime - FRAME_DURATION
        //   if (t < 0) {
        //     console.warn('videoNextFrame: start of media reached')
        //     t = 0
        //   }
        //   // v.fastSeek(t)
        //   v.currentTime = t
        // } else {
        //   console.warn('videoNextFrame: can\'t jump prev frame while playing')
        // }
      },
      videoNextFrame () {
        console.log('videoPrevFrame')
        // if (this.video.pause) {
        //   let v = this.video
        //   let t = v.currentTime + FRAME_DURATION
        //   if (t > v.duration) {
        //     console.warn('videoNextFrame: end of media reached')
        //     t = v.duration
        //   }
        //   // v.fastSeek(t)
        //   v.currentTime = t
        // } else {
        //   console.warn('videoNextFrame: can\'t jump next frame while playing')
        // }
      },
      preview () {
        console.log('@preview')
        // this.video.currentTime = 0
        // this.video.play()
        // this.draw()
      },
      capture () {
        // capture : set the current video frame as the new still frame picture.
        // If a still frame is yet setted, destroy it's sprite to create a new one
        // Then add it on top of all elements
        console.log('@capture')
        // let c = this.helperCanvas
        // c.width = this.video.videoWidth
        // c.height = this.video.videoHeight
        // c.getContext('2d').drawImage(this.video, 0, 0, c.width, c.height)
        // if (this.overlay) {
        //   this.overlay.destroy()
        // }
        // this.overlay = PIXI.Sprite.fromImage(c.toDataURL())
        // this.overlay.mask = this.maskTextureSprite
        // this.PIXIApp.stage.addChildAt(this.overlay, 0)
      },
      toggleOverlay () {
        if (this.overlay) {
          this.overlay.visible = !this.overlay.visible
          console.log('toggleOverlay:', this.overlay.visible)
        }
      },
      toggleMask () {
        this.maskTextureVisual.visible = !this.maskTextureVisual.visible
        console.log('toggleMask:', this.maskTextureVisual.visible)
      },

      brushScale (scale) {
        console.log('brushScale:', scale)
        this.brushAsset.setTransform(0, 0, scale, scale, 0, 0, 0, 0, 0)
      },
      brushScaleUp () {
        if (this.scale <= BRUSH_SCALE_MAX - BRUSH_SCALE_INC) {
          this.scale += BRUSH_SCALE_INC
          this.brushScale(this.scale)
        }
      },
      brushScaleDown () {
        if (this.scale >= BRUSH_SCALE_MIN + BRUSH_SCALE_INC) {
          this.scale -= BRUSH_SCALE_INC
          this.brushScale(this.scale)
        }
      },
      brushSetErase (value) {
        if (value) {
          this.state.erasing = true
          this.brushAsset.tint = 0x000000
        } else {
          console.log('white')
          this.state.erasing = false
          this.brushAsset.tint = 0xFFFFFF
        }
      },
      brushToggleErase () {
        this.brushSetErase(!this.state.erasing)
      },
      //
      // - HANDLER
      //
      keyPressed (evt) {
        evt = evt || window.event
        var charCode = evt.keyCode || evt.which
        var charStr = String.fromCharCode(charCode)
        // console.log('key pressed:', charStr)
        if (this.commands[charStr]) {
          this.commands[charStr]()
        }
      },
      help () {
        console.log('Little flix help')
        console.log('-- VIDEO -------')
        console.log('a : Toggle play/pause')
        console.log('z : Jump prev frame')
        console.log('e : Jump next frame')
        console.log('-- APP ---------')
        console.log('q : Capture still frame')
        console.log('s : Show/hide still frame')
        console.log('d : Show/hide mask')
        console.log('w : Scale brush up')
        console.log('x : Scale brush down')
        console.log('c : Toggle between FILL/ERASE mode')
        console.log('----------------')
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
      this.help()
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
  }

  #wrapper {
    height: 100vh;
    width: 100vw;
    background-color: rebeccapurple;
  }

  #video, #overlay-wrapper {
    position:absolute;
    top: 0;
    left: 0;
  }
  
</style>
