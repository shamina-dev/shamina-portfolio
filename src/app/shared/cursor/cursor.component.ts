import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  NgZone,
  Renderer2
} from '@angular/core';

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  maxLife: number;
  life: number;
}

@Component({
  selector: 'app-cursor',
  templateUrl: './cursor.component.html',
  styleUrls: ['./cursor.component.scss']
})
export class CursorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('cursorDot') dotRef!: ElementRef<HTMLDivElement>;
  @ViewChild('cursorRing') ringRef!: ElementRef<HTMLDivElement>;
  @ViewChild('trailCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  // Positions
  private mouseX = -100;
  private mouseY = -100;
  private ringX = -100;
  private ringY = -100;
  private prevMouseX = -100;
  private prevMouseY = -100;

  // Frame timing & Physics
  private lastRenderTime = 0;
  private velocity = 0;
  private angle = 0;
  private animFrameId: number | null = null;
  private isVisible = false;
  private isHovered = false;
  private isText = false;
  private isClicking = false;
  private isTouchDevice = false;

  // Cached targets & particle thresholds
  private lastTarget: Element | null = null;
  private lastSpawnX = -1000;
  private lastSpawnY = -1000;
  private hadParticles = false;

  // Ripples
  ripples: { id: number; x: number; y: number }[] = [];
  private rippleCounter = 0;

  // Particle System
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: TrailParticle[] = [];
  private readonly maxParticles = 30;
  private paletteColors = ['#00f2fe', '#b600ff', '#00ffc4', '#ffffff'];

  // Event Listeners references for cleanup
  private unlistenMouseMove: (() => void) | null = null;
  private unlistenMouseDown: (() => void) | null = null;
  private unlistenMouseUp: (() => void) | null = null;
  private unlistenMouseLeave: (() => void) | null = null;
  private unlistenMouseEnter: (() => void) | null = null;
  private unlistenResize: (() => void) | null = null;

  constructor(
    private ngZone: NgZone,
    private renderer: Renderer2,
    private hostEl: ElementRef
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.isTouchDevice =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches;
    }
  }

  ngAfterViewInit(): void {
    if (this.isTouchDevice) {
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    this.resizeCanvas();

    // Run cursor animation and tracking outside Angular zone for silky 60/120fps
    this.ngZone.runOutsideAngular(() => {
      this.bindEvents();
      this.startRenderLoop();
    });
  }

  ngOnDestroy(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    this.unbindEvents();
  }

  private resizeCanvas(): void {
    if (!this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private bindEvents(): void {
    const doc = document;
    const win = window;

    this.unlistenMouseMove = this.renderer.listen(win, 'mousemove', (e: MouseEvent) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      if (!this.isVisible) {
        this.isVisible = true;
        this.ringX = this.mouseX;
        this.ringY = this.mouseY;
        this.updateCursorVisibility(true);
      }

      // 1. Move precision dot immediately with 0 latency hardware tracking
      const dot = this.dotRef?.nativeElement;
      if (dot) {
        dot.style.transform = `translate3d(${this.mouseX}px, ${this.mouseY}px, 0)`;
      }

      // 2. Cached hover target check - only re-check when mouse moves over a different node
      if (e.target !== this.lastTarget) {
        this.lastTarget = e.target as Element | null;
        this.detectInteractiveTarget(this.lastTarget);
      }

      // 3. Emit trail particle only when moving sufficient distance (> 7px)
      const dist = Math.hypot(this.mouseX - this.lastSpawnX, this.mouseY - this.lastSpawnY);
      if (dist > 7) {
        this.spawnTrailParticle(this.mouseX, this.mouseY);
        this.lastSpawnX = this.mouseX;
        this.lastSpawnY = this.mouseY;
      }
    });

    this.unlistenMouseDown = this.renderer.listen(win, 'mousedown', (e: MouseEvent) => {
      this.isClicking = true;
      this.updateCursorState();
      this.triggerRipple(e.clientX, e.clientY);
    });

    this.unlistenMouseUp = this.renderer.listen(win, 'mouseup', () => {
      this.isClicking = false;
      this.updateCursorState();
    });

    this.unlistenMouseLeave = this.renderer.listen(doc, 'mouseleave', () => {
      this.isVisible = false;
      this.updateCursorVisibility(false);
    });

    this.unlistenMouseEnter = this.renderer.listen(doc, 'mouseenter', () => {
      this.isVisible = true;
      this.updateCursorVisibility(true);
    });

    this.unlistenResize = this.renderer.listen(win, 'resize', () => {
      this.resizeCanvas();
    });
  }

  private unbindEvents(): void {
    if (this.unlistenMouseMove) this.unlistenMouseMove();
    if (this.unlistenMouseDown) this.unlistenMouseDown();
    if (this.unlistenMouseUp) this.unlistenMouseUp();
    if (this.unlistenMouseLeave) this.unlistenMouseLeave();
    if (this.unlistenMouseEnter) this.unlistenMouseEnter();
    if (this.unlistenResize) this.unlistenResize();
  }

  private detectInteractiveTarget(target: Element | null): void {
    if (!target) {
      this.setHoverState(false, false);
      return;
    }

    const interactiveSelector =
      'a, button, [role="button"], input, textarea, select, .btn, .btn-neon, .glass-card, .cursor-pointer, .interactive, .branding-social-btn, .mode-pill, .palette-swatch-btn, .action-btn-pill';

    const isInteractive = !!target.closest(interactiveSelector);
    const isTextInput = !!target.closest('input[type="text"], input[type="email"], textarea, [contenteditable="true"]');

    this.setHoverState(isInteractive, isTextInput);
  }

  private setHoverState(hovered: boolean, text: boolean): void {
    if (this.isHovered !== hovered || this.isText !== text) {
      this.isHovered = hovered;
      this.isText = text;
      this.updateCursorState();
    }
  }

  private updateCursorVisibility(visible: boolean): void {
    const dot = this.dotRef?.nativeElement;
    const ring = this.ringRef?.nativeElement;
    if (dot && ring) {
      const opacity = visible ? '1' : '0';
      dot.style.opacity = opacity;
      ring.style.opacity = opacity;
    }
  }

  private updateCursorState(): void {
    const ring = this.ringRef?.nativeElement;
    const dot = this.dotRef?.nativeElement;
    if (!ring || !dot) return;

    if (this.isHovered) {
      ring.classList.add('cursor-hover');
      dot.classList.add('dot-hover');
    } else {
      ring.classList.remove('cursor-hover');
      dot.classList.remove('dot-hover');
    }

    if (this.isText) {
      ring.classList.add('cursor-text');
      dot.classList.add('dot-text');
    } else {
      ring.classList.remove('cursor-text');
      dot.classList.remove('dot-text');
    }

    if (this.isClicking) {
      ring.classList.add('cursor-active');
      dot.classList.add('dot-active');
    } else {
      ring.classList.remove('cursor-active');
      dot.classList.remove('dot-active');
    }
  }

  private triggerRipple(x: number, y: number): void {
    const rippleId = ++this.rippleCounter;
    // Push ripple in Angular zone so template renders the ripple burst element
    this.ngZone.run(() => {
      this.ripples.push({ id: rippleId, x, y });
    });

    // Remove ripple after burst completes
    setTimeout(() => {
      this.ngZone.run(() => {
        this.ripples = this.ripples.filter(r => r.id !== rippleId);
      });
    }, 600);
  }

  private spawnTrailParticle(x: number, y: number): void {
    if (this.particles.length >= this.maxParticles) return;

    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 1.5 + 0.5;
    const color = this.paletteColors[Math.floor(Math.random() * this.paletteColors.length)];

    this.particles.push({
      x: x + (Math.random() - 0.5) * 4,
      y: y + (Math.random() - 0.5) * 4,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 2.5 + 1.2,
      alpha: 0.8,
      color: color,
      maxLife: Math.random() * 20 + 16,
      life: 0
    });
    this.hadParticles = true;
  }

  private startRenderLoop(): void {
    const ring = this.ringRef.nativeElement;
    this.lastRenderTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - this.lastRenderTime) / 1000, 0.05);
      this.lastRenderTime = now;

      // Frame-rate independent exponential smoothing
      // Guarantees consistent physical speed whether at 30, 60, or 120 FPS
      const decay = this.isHovered ? 26 : 20;
      const factor = 1 - Math.exp(-decay * dt);
      this.ringX += (this.mouseX - this.ringX) * factor;
      this.ringY += (this.mouseY - this.ringY) * factor;

      // Velocity calculation and directional stretch
      const dx = this.mouseX - this.prevMouseX;
      const dy = this.mouseY - this.prevMouseY;
      this.velocity = Math.min(Math.sqrt(dx * dx + dy * dy), 40);
      if (this.velocity > 1) {
        this.angle = Math.atan2(dy, dx) * (180 / Math.PI);
      }

      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;

      // Apply dynamic velocity stretch when moving briskly
      const stretch = Math.min(this.velocity * 0.012, 0.35);
      const scaleX = 1 + stretch;
      const scaleY = 1 - stretch * 0.6;

      ring.style.transform = `translate3d(${this.ringX}px, ${this.ringY}px, 0) rotate(${this.angle}deg) scale(${scaleX}, ${scaleY})`;

      // Render particles on canvas ONLY if there are particles alive (saves GPU bandwidth)
      if (this.particles.length > 0 || this.hadParticles) {
        this.renderParticles();
      }

      this.animFrameId = requestAnimationFrame(render);
    };

    this.animFrameId = requestAnimationFrame(render);
  }

  private renderParticles(): void {
    if (!this.ctx || !this.canvasRef) return;
    const ctx = this.ctx;
    const canvas = this.canvasRef.nativeElement;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.particles.length === 0) {
      this.hadParticles = false;
      return;
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.94;
      p.vy *= 0.94;

      const progress = p.life / p.maxLife;
      const currentAlpha = p.alpha * (1 - progress);
      const currentSize = p.size * (1 - progress * 0.5);

      if (progress >= 1 || currentAlpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = currentAlpha;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, currentSize), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}
