import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';
import { Subscription } from 'rxjs';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
}

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D | null;
  private particles: Particle[] = [];
  private animationFrameId: number | null = null;
  private themeSub!: Subscription;
  
  mouseX: number = 0;
  mouseY: number = 0;
  isMouseOver: boolean = false;
  
  private maxParticles: number = 75;
  private connectionDistance: number = 110;
  private mouseConnectionDistance: number = 160;

  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    this.resizeCanvas();
    this.initParticles();
    this.animate();

    this.themeSub = this.themeService.theme$.subscribe(() => {
      // Trigger re-render adjustments on theme toggle if needed
    });
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.themeSub) {
      this.themeSub.unsubscribe();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.resizeCanvas();
    this.initParticles();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    this.isMouseOver = true;
  }

  @HostListener('window:mouseleave')
  onMouseLeave(): void {
    this.isMouseOver = false;
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const area = canvas.width * canvas.height;
    this.maxParticles = Math.floor(area / 18000);
    if (this.maxParticles > 120) this.maxParticles = 120;
    if (this.maxParticles < 30) this.maxParticles = 30;
  }

  private initParticles(): void {
    const canvas = this.canvasRef.nativeElement;
    this.particles = [];
    
    for (let i = 0; i < this.maxParticles; i++) {
      const size = Math.random() * 2 + 1;
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: size,
        baseSize: size
      });
    }
  }

  private animate = (): void => {
    if (!this.ctx) return;
    
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    this.drawConnections();
    this.drawParticles();
    
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private drawParticles(): void {
    if (!this.ctx) return;
    
    const canvas = this.canvasRef.nativeElement;
    const isDark = this.themeService.isDarkMode();
    
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      if (this.isMouseOver) {
        const dx = p.x - this.mouseX;
        const dy = p.y - this.mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 120) {
          const force = (120 - dist) / 120;
          const angle = Math.atan2(dy, dx);
          p.x += Math.cos(angle) * force * 1.5;
          p.y += Math.sin(angle) * force * 1.5;
          p.size = p.baseSize * (1 + force * 0.8);
        } else {
          if (p.size > p.baseSize) {
            p.size -= 0.05;
          }
        }
      } else {
        if (p.size > p.baseSize) {
          p.size -= 0.05;
        }
      }
      
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      
      if (p.x < 0) p.x = 0;
      if (p.x > canvas.width) p.x = canvas.width;
      if (p.y < 0) p.y = 0;
      if (p.y > canvas.height) p.y = canvas.height;
      
      this.ctx!.beginPath();
      this.ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx!.fillStyle = isDark ? 'rgba(0, 180, 255, 0.4)' : 'rgba(2, 132, 199, 0.55)';
      this.ctx!.shadowBlur = p.size > p.baseSize ? 6 : 0;
      this.ctx!.shadowColor = isDark ? '#00f2fe' : '#0284c7';
      this.ctx!.fill();
    });
    
    this.ctx.shadowBlur = 0;
  }

  private drawConnections(): void {
    if (!this.ctx) return;
    
    const count = this.particles.length;
    const isDark = this.themeService.isDarkMode();

    for (let i = 0; i < count; i++) {
      const p1 = this.particles[i];
      
      for (let j = i + 1; j < count; j++) {
        const p2 = this.particles[j];
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.connectionDistance) {
          const alphaMultiplier = isDark ? 0.15 : 0.25;
          const alpha = (1 - dist / this.connectionDistance) * alphaMultiplier;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          
          const grad = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          if (isDark) {
            grad.addColorStop(0, `rgba(0, 242, 254, ${alpha})`);
            grad.addColorStop(1, `rgba(182, 0, 255, ${alpha})`);
          } else {
            grad.addColorStop(0, `rgba(2, 132, 199, ${alpha})`);
            grad.addColorStop(1, `rgba(139, 92, 246, ${alpha})`);
          }
          
          this.ctx.strokeStyle = grad;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
      
      if (this.isMouseOver) {
        const dx = p1.x - this.mouseX;
        const dy = p1.y - this.mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.mouseConnectionDistance) {
          const alphaMultiplier = isDark ? 0.28 : 0.38;
          const alpha = (1 - dist / this.mouseConnectionDistance) * alphaMultiplier;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(this.mouseX, this.mouseY);
          
          const grad = this.ctx.createLinearGradient(p1.x, p1.y, this.mouseX, this.mouseY);
          if (isDark) {
            grad.addColorStop(0, `rgba(0, 242, 254, ${alpha})`);
            grad.addColorStop(1, `rgba(182, 0, 255, ${alpha * 0.3})`);
          } else {
            grad.addColorStop(0, `rgba(2, 132, 199, ${alpha})`);
            grad.addColorStop(1, `rgba(139, 92, 246, ${alpha * 0.3})`);
          }
          
          this.ctx.strokeStyle = grad;
          this.ctx.lineWidth = 1.1;
          this.ctx.stroke();
        }
      }
    }
  }
}
