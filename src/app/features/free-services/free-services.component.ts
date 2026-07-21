import { Component, ElementRef, OnDestroy, ViewChild, signal } from '@angular/core';

interface AnimStyle {
  id: string;
  name: string;
  description: string;
}

interface Entity {
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  radius?: number;
  r?: number;
  color?: number[] | string;
  yOffset?: number;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  phase?: number;
  sides?: number;
  size?: number;
  angle?: number;
  vAngle?: number;
}

const ANIMATIONS: AnimStyle[] = [
  {
    id: 'network',
    name: 'Network Constellation',
    description: 'A classic tech aesthetic. Nodes drift and form geometric connections when they get close. Ideal for AI, data, and cybersecurity contexts.'
  },
  {
    id: 'gradient',
    name: 'Ambient Gradient Mesh',
    description: 'Large, soft orbs of color slowly blending into each other. Extremely popular in modern Web3, fintech, and SaaS designs.'
  },
  {
    id: 'ribbons',
    name: 'Flowing Ribbons',
    description: 'Smooth, overlapping sine waves that create a sense of elegance and continuous motion. Great for corporate and enterprise sites.'
  },
  {
    id: 'isometric',
    name: 'Isometric Geometry',
    description: 'Crisp, minimalist polygons drifting slowly upwards. Gives a clean, architectural, or structural feel to any layout.'
  },
  {
    id: 'flowfield',
    name: 'Flow Field Topography',
    description: 'Particles moving along a mathematical noise field, leaving subtle trails. Looks like abstract wind or topographic contour maps.'
  }
];

@Component({
  selector: 'app-free-services',
  templateUrl: './free-services.component.html',
  styleUrls: ['./free-services.component.scss']
})
export class FreeServicesComponent implements OnDestroy {
  animations = ANIMATIONS;
  activeAnim = signal<AnimStyle | null>(null);
  speedMultiplier = signal(1.0);
  
  showCodeModal = false;
  copied = false;
  activeCodeSnippet = '';

  @ViewChild('bgCanvas') canvasRef?: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D | null = null;
  private width = 0;
  private height = 0;
  private entities: Entity[] = [];
  private time = 0;
  private lastTime = 0;
  private animationFrameId?: number;

  private resizeListener = () => this.resizeCanvas();

  ngOnDestroy() {
    this.stopAnimation();
  }

  selectAnimation(anim: AnimStyle) {
    this.activeAnim.set(anim);
    this.speedMultiplier.set(1.0);
    
    // Wait a tick for the canvas to be rendered in DOM
    setTimeout(() => {
      this.initCanvas();
    }, 50);
  }

  goBack() {
    this.stopAnimation();
    this.activeAnim.set(null);
  }

  updateSpeed(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.speedMultiplier.set(parseFloat(val));
  }

  private initCanvas() {
    if (!this.canvasRef) return;
    
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    
    window.addEventListener('resize', this.resizeListener);
    this.resizeCanvas();
    
    this.lastTime = performance.now();
    this.animate(this.lastTime);
  }

  private resizeCanvas() {
    if (!this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    
    this.width = canvas.width = window.innerWidth;
    this.height = canvas.height = window.innerHeight;
    
    this.populateEntities();
  }

  private random(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private populateEntities() {
    this.entities = [];
    const styleId = this.activeAnim()?.id;
    const isMobile = window.innerWidth < 768;

    if (styleId === 'network') {
      const count = isMobile ? 40 : 100;
      for(let i = 0; i < count; i++) {
        this.entities.push({
          x: this.random(0, this.width),
          y: this.random(0, this.height),
          vx: this.random(-0.5, 0.5),
          vy: this.random(-0.5, 0.5),
          radius: this.random(1, 3)
        });
      }
    } 
    else if (styleId === 'gradient') {
      const maxDim = Math.max(this.width, this.height);
      this.entities = [
        { x: this.width * 0.2, y: this.height * 0.3, vx: 0.3, vy: 0.4, r: maxDim * 0.6, color: [0, 242, 254] },
        { x: this.width * 0.8, y: this.height * 0.7, vx: -0.4, vy: -0.3, r: maxDim * 0.7, color: [182, 0, 255] },
        { x: this.width * 0.5, y: this.height * 0.5, vx: 0.5, vy: -0.5, r: maxDim * 0.5, color: [0, 255, 196] }
      ];
    } 
    else if (styleId === 'ribbons') {
      for(let i = 0; i < 5; i++) {
        this.entities.push({
          yOffset: this.height * (0.2 + (i * 0.15)),
          amplitude: this.random(55, 180),
          frequency: this.random(0.001, 0.0035),
          speed: this.random(0.4, 1.2),
          phase: this.random(0, Math.PI * 2),
          color: `hsla(${180 + i * 25}, 85%, 55%, 0.12)`
        });
      }
    } 
    else if (styleId === 'isometric') {
      const count = isMobile ? 12 : 30;
      for(let i = 0; i < count; i++) {
        this.entities.push({
          x: this.random(0, this.width),
          y: this.random(0, this.height),
          sides: Math.floor(this.random(3, 7)),
          size: this.random(15, 45),
          angle: this.random(0, Math.PI * 2),
          vAngle: this.random(-0.4, 0.4),
          vy: this.random(20, 60)
        });
      }
    } 
    else if (styleId === 'flowfield') {
      const count = isMobile ? 250 : 600;
      for(let i = 0; i < count; i++) {
        this.entities.push({
          x: this.random(0, this.width),
          y: this.random(0, this.height),
          vx: 0,
          vy: 0,
          size: this.random(1, 2.2)
        });
      }
    }
  }

  private stopAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
    window.removeEventListener('resize', this.resizeListener);
  }

  private animate = (now: number) => {
    if (!this.ctx || !this.activeAnim()) return;

    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    this.time += dt;

    const styleId = this.activeAnim()?.id;
    const speed = this.speedMultiplier();

    if (styleId === 'flowfield') {
      this.ctx.fillStyle = `rgba(3, 3, 8, 0.12)`;
      this.ctx.fillRect(0, 0, this.width, this.height);
    } else {
      this.ctx.fillStyle = '#030308';
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    if (styleId === 'network') {
      this.ctx.fillStyle = 'rgba(0, 242, 254, 0.5)';
      
      this.entities.forEach(p => {
        p.x! += p.vx! * speed * (dt * 60);
        p.y! += p.vy! * speed * (dt * 60);
        
        if (p.x! < 0 || p.x! > this.width) p.vx! *= -1;
        if (p.y! < 0 || p.y! > this.height) p.vy! *= -1;

        this.ctx!.beginPath();
        this.ctx!.arc(p.x!, p.y!, p.radius!, 0, Math.PI * 2);
        this.ctx!.fill();
      });

      for (let i = 0; i < this.entities.length; i++) {
        for (let j = i + 1; j < this.entities.length; j++) {
          const dx = this.entities[i].x! - this.entities[j].x!;
          const dy = this.entities[i].y! - this.entities[j].y!;
          const dist = Math.sqrt(dx*dx + dy*dy);

          if (dist < 130) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.entities[i].x!, this.entities[i].y!);
            this.ctx.lineTo(this.entities[j].x!, this.entities[j].y!);
            this.ctx.strokeStyle = `rgba(0, 242, 254, ${(1 - dist/130) * 0.25})`;
            this.ctx.lineWidth = 0.8;
            this.ctx.stroke();
          }
        }
      }
    } 
    else if (styleId === 'gradient') {
      this.entities.forEach(orb => {
        orb.x! += orb.vx! * speed * (dt * 60);
        orb.y! += orb.vy! * speed * (dt * 60);
        
        if (orb.x! < -this.width*0.2 || orb.x! > this.width*1.2) orb.vx! *= -1;
        if (orb.y! < -this.height*0.2 || orb.y! > this.height*1.2) orb.vy! *= -1;

        const color = orb.color as number[];
        const gradient = this.ctx!.createRadialGradient(orb.x!, orb.y!, 0, orb.x!, orb.y!, orb.r!);
        gradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.25)`);
        gradient.addColorStop(1, `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0)`);
        
        this.ctx!.fillStyle = gradient;
        this.ctx!.beginPath();
        this.ctx!.arc(orb.x!, orb.y!, orb.r!, 0, Math.PI * 2);
        this.ctx!.fill();
      });
    } 
    else if (styleId === 'ribbons') {
      this.entities.forEach(rib => {
        rib.phase! += rib.speed! * speed * dt;
        
        this.ctx!.beginPath();
        for (let x = 0; x <= this.width; x += 15) {
          const y = rib.yOffset! + Math.sin(x * rib.frequency! + rib.phase!) * rib.amplitude!;
          if (x === 0) this.ctx!.moveTo(x, y);
          else this.ctx!.lineTo(x, y);
        }
        this.ctx!.strokeStyle = rib.color as string;
        this.ctx!.lineWidth = 55;
        this.ctx!.lineCap = 'round';
        this.ctx!.lineJoin = 'round';
        this.ctx!.stroke();
      });
    } 
    else if (styleId === 'isometric') {
      this.ctx.strokeStyle = 'rgba(182, 0, 255, 0.35)';
      this.ctx.lineWidth = 1.2;

      this.entities.forEach(shape => {
        shape.y! -= shape.vy! * speed * dt;
        shape.angle! += shape.vAngle! * speed * dt;
        
        if (shape.y! < -100) {
          shape.y! = this.height + 100;
          shape.x! = this.random(0, this.width);
        }

        this.ctx!.beginPath();
        for (let i = 0; i < shape.sides!; i++) {
          const currentAngle = shape.angle! + (i * Math.PI * 2) / shape.sides!;
          const px = shape.x! + Math.cos(currentAngle) * shape.size!;
          const py = shape.y! + Math.sin(currentAngle) * shape.size!;
          if (i === 0) this.ctx!.moveTo(px, py);
          else this.ctx!.lineTo(px, py);
        }
        this.ctx!.closePath();
        this.ctx!.stroke();
      });
    } 
    else if (styleId === 'flowfield') {
      this.ctx.fillStyle = 'rgba(0, 242, 254, 0.7)';
      const t = this.time * 0.4 * speed;

      this.entities.forEach(p => {
        const angle = Math.sin(p.x! * 0.006 + t) * Math.cos(p.y! * 0.006 + t) * Math.PI * 3.5;
        
        p.vx! = Math.cos(angle);
        p.vy! = Math.sin(angle);
        
        p.x! += p.vx! * 1.8 * speed * (dt * 60);
        p.y! += p.vy! * 1.8 * speed * (dt * 60);

        if (p.x! < 0) p.x! = this.width;
        if (p.x! > this.width) p.x! = 0;
        if (p.y! < 0) p.y! = this.height;
        if (p.y! > this.height) p.y! = 0;

        this.ctx!.beginPath();
        this.ctx!.arc(p.x!, p.y!, p.size!, 0, Math.PI * 2);
        this.ctx!.fill();
      });
    }

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  viewCode() {
    const id = this.activeAnim()?.id;
    if (!id) return;
    this.activeCodeSnippet = this.getAnimationCode(id);
    this.showCodeModal = true;
    this.copied = false;
  }

  closeCodeModal() {
    this.showCodeModal = false;
  }

  copyCode() {
    navigator.clipboard.writeText(this.activeCodeSnippet).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    });
  }

  downloadCodeFile() {
    const anim = this.activeAnim();
    if (!anim) return;
    
    const element = document.createElement('a');
    const file = new Blob([this.activeCodeSnippet], {type: 'text/html'});
    element.href = URL.createObjectURL(file);
    element.download = `${anim.id}-bg-demo.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  private getAnimationCode(id: string): string {
    const drawingScripts: Record<string, string> = {
      network: `
    // --- Simulation Setup ---
    const particles = [];
    const maxParticles = 100;
    
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.0,
        vy: (Math.random() - 0.5) * 1.0,
        radius: Math.random() * 2 + 1
      });
    }
    
    // --- Render Loop ---
    function draw(dt) {
      ctx.fillStyle = '#030308';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw Particles
      ctx.fillStyle = 'rgba(0, 242, 254, 0.5)';
      particles.forEach(p => {
        p.x += p.vx * speedMultiplier;
        p.y += p.vy * speedMultiplier;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw Connecting Lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = \`rgba(0, 242, 254, \${(1 - dist/130) * 0.25})\`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }`,
      gradient: `
    // --- Simulation Setup ---
    const orbs = [];
    const colors = [[0, 242, 254], [182, 0, 255], [0, 255, 196]];
    const maxDim = Math.max(canvas.width, canvas.height);
    
    orbs.push({ x: canvas.width * 0.2, y: canvas.height * 0.3, vx: 0.3, vy: 0.4, r: maxDim * 0.6, color: colors[0] });
    orbs.push({ x: canvas.width * 0.8, y: canvas.height * 0.7, vx: -0.4, vy: -0.3, r: maxDim * 0.7, color: colors[1] });
    orbs.push({ x: canvas.width * 0.5, y: canvas.height * 0.5, vx: 0.5, vy: -0.5, r: maxDim * 0.5, color: colors[2] });
    
    // --- Render Loop ---
    function draw(dt) {
      ctx.fillStyle = '#030308';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      orbs.forEach(orb => {
        orb.x += orb.vx * speedMultiplier;
        orb.y += orb.vy * speedMultiplier;
        
        if (orb.x < -canvas.width * 0.2 || orb.x > canvas.width * 1.2) orb.vx *= -1;
        if (orb.y < -canvas.height * 0.2 || orb.y > canvas.height * 1.2) orb.vy *= -1;
        
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        gradient.addColorStop(0, \`rgba(\${orb.color[0]}, \${orb.color[1]}, \${orb.color[2]}, 0.25)\`);
        gradient.addColorStop(1, \`rgba(\${orb.color[0]}, \${orb.color[1]}, \${orb.color[2]}, 0)\`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }`,
      ribbons: `
    // --- Simulation Setup ---
    const ribbons = [];
    for(let i = 0; i < 5; i++) {
      ribbons.push({
        yOffset: canvas.height * (0.2 + (i * 0.15)),
        amplitude: Math.random() * 125 + 55,
        frequency: Math.random() * 0.0025 + 0.001,
        speed: Math.random() * 0.8 + 0.4,
        phase: Math.random() * Math.PI * 2,
        color: \`hsla(\${180 + i * 25}, 85%, 55%, 0.12)\`
      });
    }
    
    // --- Render Loop ---
    let time = 0;
    function draw(dt) {
      ctx.fillStyle = '#030308';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      time += dt;
      
      ribbons.forEach(rib => {
        rib.phase += rib.speed * speedMultiplier * dt;
        
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 15) {
          const y = rib.yOffset + Math.sin(x * rib.frequency + rib.phase) * rib.amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = rib.color;
        ctx.lineWidth = 55;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      });
    }`,
      isometric: `
    // --- Simulation Setup ---
    const shapes = [];
    const count = 30;
    for(let i = 0; i < count; i++) {
      shapes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        sides: Math.floor(Math.random() * 4) + 3,
        size: Math.random() * 30 + 15,
        angle: Math.random() * Math.PI * 2,
        vAngle: (Math.random() - 0.5) * 0.8,
        vy: Math.random() * 40 + 20
      });
    }
    
    // --- Render Loop ---
    function draw(dt) {
      ctx.fillStyle = '#030308';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(182, 0, 255, 0.35)';
      ctx.lineWidth = 1.2;
      
      shapes.forEach(shape => {
        shape.y -= shape.vy * speedMultiplier * dt;
        shape.angle += shape.vAngle * speedMultiplier * dt;
        
        if (shape.y < -100) {
          shape.y = canvas.height + 100;
          shape.x = Math.random() * canvas.width;
        }
        
        ctx.beginPath();
        for (let i = 0; i < shape.sides; i++) {
          const currentAngle = shape.angle + (i * Math.PI * 2) / shape.sides;
          const px = shape.x + Math.cos(currentAngle) * shape.size;
          const py = shape.y + Math.sin(currentAngle) * shape.size;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      });
    }`,
      flowfield: `
    // --- Simulation Setup ---
    const particles = [];
    const count = 600;
    for(let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0,
        vy: 0,
        size: Math.random() * 1.2 + 1
      });
    }
    
    // --- Render Loop ---
    let time = 0;
    function draw(dt) {
      // Leave slight trail
      ctx.fillStyle = 'rgba(3, 3, 8, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      time += dt;
      
      ctx.fillStyle = 'rgba(0, 242, 254, 0.7)';
      const t = time * 0.4 * speedMultiplier;
      
      particles.forEach(p => {
        const angle = Math.sin(p.x * 0.006 + t) * Math.cos(p.y * 0.006 + t) * Math.PI * 3.5;
        p.vx = Math.cos(angle);
        p.vy = Math.sin(angle);
        
        p.x += p.vx * 1.8 * speedMultiplier;
        p.y += p.vy * 1.8 * speedMultiplier;
        
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
    }`
    };

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.activeAnim()?.name} - Ambient Canvas Background</title>
  <style>
    * { box-sizing: border-box; }
    body, html {
      margin: 0; padding: 0;
      width: 100%; height: 100%;
      overflow: hidden;
      background-color: #030308;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }
    canvas {
      position: absolute; top: 0; left: 0;
      width: 100%; height: 100%;
      z-index: 1;
    }
    .overlay-controls {
      position: absolute;
      bottom: 24px; left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 15, 25, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(16px);
      border-radius: 20px;
      padding: 16px 24px;
      z-index: 10;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    }
    .slider-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    label { font-size: 14px; font-weight: 500; color: #a1a1aa; }
    input[type=range] {
      accent-color: #00f2fe;
      width: 150px;
      cursor: pointer;
    }
  </style>
</head>
<body>

  <canvas id="bgCanvas"></canvas>

  <div class="overlay-controls">
    <div style="text-align: left;">
      <h4 style="margin: 0; font-size: 16px; font-weight: 700;">${this.activeAnim()?.name}</h4>
      <p style="margin: 0; font-size: 11px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em;">Interactive Ambient Background</p>
    </div>
    <div style="width: 1px; height: 30px; background: rgba(255,255,255,0.15)"></div>
    <div class="slider-container">
      <label for="speed">Speed: <span id="speedVal">1.0x</span></label>
      <input type="range" id="speed" min="0.1" max="3" step="0.1" value="1">
    </div>
  </div>

  <script>
    const canvas = document.getElementById('bgCanvas');
    const ctx = canvas.getContext('2d');
    
    let speedMultiplier = 1.0;
    const speedInput = document.getElementById('speed');
    const speedVal = document.getElementById('speedVal');
    
    speedInput.addEventListener('input', (e) => {
      speedMultiplier = parseFloat(e.target.value);
      speedVal.textContent = speedMultiplier.toFixed(1) + 'x';
    });

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    ${drawingScripts[id]}

    let lastTime = performance.now();
    function tick(now) {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      
      draw(dt);
      
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  </script>
</body>
</html>`;
  }
}
