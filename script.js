const canvasEl = document.querySelector("canvas")
const canvasCtx = canvasEl.getContext("2d")
gapX = 10
const mouse = { x: 0, y: 0 }


//função que desenha o campo.
const field = {
  w: window.innerWidth,
  h: window.innerHeight,
  draw: function () {
    canvasCtx.fillStyle = "green"
    canvasCtx.fillRect(0, 0, this.w, this.h)
  }
}

//função que desenha a linha central do campo.
const line = {
  w: 15,
  h: field.h,
  draw: function () {
    canvasCtx.fillStyle = "white"
    const x = field.w / 2 - this.w / 2
    const y = 0
    const w = this.w
    const h = this.h
    canvasCtx.fillRect(x, y, w, h)
  }
}

// função que desenha a raquete esquerda.
const leftPaddle = {
  x: gapX,
  y: 0,
  w: line.w,
  h: 200,
  _move: function () {
    this.y = mouse.y - this.h / 2
  },
  draw: function () {
    canvasCtx.fillStyle = "white"
    canvasCtx.fillRect(this.x, this.y, this.w, this.h)
    this._move()
  }
}

//função que desenha a raquete direita.
const rightPaddle = {
  x: field.w - line.w - gapX,
  y: 0,
  w: line.w,
  h: 200,
  speed: 1,
  _move: function () {
    if(this.y + this.h / 2 < ball.y + ball.r){
      this.y += this.speed
    }else {
      this.y -= this.speed
    }
  },
  speedUp: function () {
    this.speed += 2
  },
  draw: function () {
    canvasCtx.fillStyle = "white"
    canvasCtx.fillRect(this.x, this.y, this.w, this.h)
    this._move()
  }
}

// função que desenha a bolinha do campo.
const ball = {
  x: 0,
  y: 0,
  r: 20,
  speed: 3,
  directionX: 1,
  directionY: 1,

  _calcPosition: function () {
    //verificar se o jogador 1 fez ponto.
    if (this.x > field.w - this.r - rightPaddle.w - gapX) {

      if (this.y + this.r > rightPaddle.y && this.y - this.r < rightPaddle.y + rightPaddle.h) {

        this._reverseX()

      } else {
        score.increaseHuman()
        this._pointUp()
      }
    }

    //verifica se o jogador 2 fez ponto.
    if (this.x < this.r + leftPaddle.w + gapX) {
      if (this.y + this.r > leftPaddle.y && this.y - this.r < leftPaddle.y + leftPaddle.h){
        this._reverseX()
      }else {
        score.increaseComputer()
        this._pointUp()
      }
    }

    //criando os limites da tela.
    if (
      (this.y - this.r < 0 && this.directionY < 0) ||
      (this.y > field.h - this.r && this.directionY > 0)
    ) {
      this._reverseY()
    }
  },

  _reverseX: function () {
    this.directionX *= -1
  },

  _reverseY: function () {
    this.directionY *= -1
  },

  _speedUP: function () {
    this.speed += 1
    rightPaddle.speedUp()
  },
  _pointUp: function () {
    this._speedUP()
    this.x = field.w / 2
    this.y = field.h / 2
  },
  _move: function () {
    this.x += this.directionX * this.speed
    this.y += this.directionY * this.speed
  },

  draw: function () {
    canvasCtx.fillStyle = "white"
    canvasCtx.beginPath()
    canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
    canvasCtx.fill()
    this._calcPosition()
    this._move()
  }
}

//função que desenha o placar.
const score = {
  human: 0,
  computer: 0,

  increaseHuman: function () {
    this.human++
  },

  increaseComputer: function () {
    this.computer++
  },

  draw: function () {
    canvasCtx.font = "bold 72px Arial"
    canvasCtx.textAlign = "center"
    canvasCtx.textBaseline = "top"
    canvasCtx.fillStyle = "#01341D"
    canvasCtx.fillText(this.human, field.w / 4, 50)
    canvasCtx.fillText(this.computer, field.w / 4 + window.innerWidth / 2, 50)

  }
}

function setup() {
  canvasEl.width = canvasCtx.width = field.w
  canvasEl.height = canvasCtx.height = field.h
}

function draw() {
  field.draw()

  leftPaddle.draw()

  rightPaddle.draw()

  score.draw()

  ball.draw()

  line.draw()
}

setup()
draw()

window.animateFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      return window.setTimeout(callback, 1000 / 60)
    }
  )
})()

function main() {
  animateFrame(main)
  draw()
}

setup()
main()

canvasEl.addEventListener("mousemove", function (e) {
  mouse.x = e.pageX
  mouse.y = e.pageY

})