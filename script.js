let canvas;
let c;
let flowField;
let flowFieldAnimation;

window.onload = function(){
    canvas = document.getElementById('canvas1');
    c = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    flowField = new FlowFieldEffect(c, canvas.width, canvas.height);
    flowField.animate(0);
}

window.addEventListener('resize', function(){
    cancelAnimationFrame(flowFieldAnimation);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    flowField = new FlowFieldEffect(c, canvas.width, canvas.height);
    flowField.animate();
})

const mouse = {
    x:0,
    y:0
}
window.addEventListener('mousemove', function(e){
    mouse.x = e.x;
    mouse.y = e.y
})

class FlowFieldEffect {
    #c;
    #width;
    #height;
    constructor(c, width, height){
        this.#c = c;
        this.#c.strokeStyle = 'white';
        this.#c.lineWidth = 1;
        this.#width = width;
        this.#height = height;
        this.lastTime = 0;
        this.interval = 1000/60;
        this.timer = 0;
        this.cellSize = 15;
        this.gradient;
        this.#createGradient();
        this.#c.strokeStyle = this.gradient;
        this.radius = 0;
        this.vr = 0.03;
    }
    #createGradient(){
        this.gradient = this.#c.createLinearGradient(0,0,this.#width,this.#height);
        this.gradient.addColorStop("0.1", "#ff5c33")
        this.gradient.addColorStop("0.2", "#ff663b")
        this.gradient.addColorStop("0.4", "#ccccff")
        this.gradient.addColorStop("0.6", "#b3ffff")
        this.gradient.addColorStop("0.8", "#80ff80")
        this.gradient.addColorStop("0.9", "#ffff33")
    }
    #drawLine(angle, x, y){
        let positionX = x;
        let positionY = y;
        let dx = mouse.x - positionX;
        let dy = mouse.y - positionY;
        let distance = (dx * dx) * 5 + (dy * dy) * 10
        if(distance > 500000) distance = 500000;
        if(distance < 50000) distance = 50000;
        const length = distance / 10000;
        this.#c.beginPath();
        this.#c.moveTo(x, y);
        this.#c.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
        this.#c.stroke();
    }
    animate(timeStamp){
        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;
        if(this.timer > this.interval){
            this.#c.clearRect(0,0,this.#width,this.#height)
            this.radius += this.vr;
            if(this.radius > 1 || this.radius < -1) this.vr *= -1;
        
            for(let y = 0; y < this.#height; y+=this.cellSize){
                for(let x = 0; x < this.#width; x += this.cellSize){
                    const angle = (Math.cos(x * 0.01) + Math.cos(y * 0.01)) * this.radius;
                    this.#drawLine(angle, x, y);
                }
            }

            this.timer = 0;
            
        } else {
            this.timer += deltaTime;
        }
        
        flowFieldAnimation = requestAnimationFrame(this.animate.bind(this))
    }
}