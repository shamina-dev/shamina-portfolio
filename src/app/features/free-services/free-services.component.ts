import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, signal } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';
import { Subscription } from 'rxjs';

interface AnimStyle {
  id: string;
  name: string;
  description: string;
  category: string;
  badge: string;
  gradient: string;
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
  z?: number;
  char?: string;
  col?: number;
  len?: number;
  opacity?: number;
  blur?: number;
  orbitRadius?: number;
  orbitAngle?: number;
  orbitSpeed?: number;
}

const ANIMATIONS: AnimStyle[] = [
  {
    id: 'network',
    name: 'Network Constellation',
    description: 'A classic tech aesthetic. Nodes drift and form geometric connections when they get close. Ideal for AI, data, and cybersecurity contexts.',
    category: 'AI & Data Science',
    badge: 'Node Physics',
    gradient: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)'
  },
  {
    id: 'gradient',
    name: 'Ambient Gradient Mesh',
    description: 'Large, soft orbs of color slowly blending into each other. Extremely popular in modern Web3, fintech, and SaaS designs.',
    category: 'Web3 & SaaS',
    badge: 'Fluid Blur',
    gradient: 'linear-gradient(135deg, #b600ff 0%, #00f2fe 100%)'
  },
  {
    id: 'ribbons',
    name: 'Flowing Ribbons',
    description: 'Smooth, overlapping sine waves that create a sense of elegance and continuous motion. Great for corporate and enterprise sites.',
    category: 'Enterprise UI',
    badge: 'Harmonic Waves',
    gradient: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)'
  },
  {
    id: 'isometric',
    name: 'Isometric Geometry',
    description: 'Crisp, minimalist polygons drifting slowly upwards. Gives a clean, architectural, or structural feel to any layout.',
    category: 'Architecture',
    badge: '3D Polygons',
    gradient: 'linear-gradient(135deg, #f39c12 0%, #e74c3c 100%)'
  },
  {
    id: 'flowfield',
    name: 'Flow Field Topography',
    description: 'Particles moving along a mathematical noise field, leaving subtle trails. Looks like abstract wind or topographic contour maps.',
    category: 'Generative Art',
    badge: 'Noise Field',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    id: 'starfield',
    name: 'Starfield Warp Drive',
    description: 'Fly through a 3D star field with depth simulation. Stars streak and accelerate toward edges for an immersive warp-speed hyperspace effect.',
    category: 'Space & Gaming',
    badge: '3D Warp Depth',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    description: 'Layered translucent curtains of light that blend and shift like the Northern Lights. Uses additive blending for an ethereal glow.',
    category: 'Creative & Luxury',
    badge: 'Ethereal Glow',
    gradient: 'linear-gradient(135deg, #a8ff78 0%, #78ffd6 100%)'
  },
  {
    id: 'matrix',
    name: 'Matrix Digital Rain',
    description: 'Classic cyberpunk falling character columns. Random katakana and ASCII characters cascade in staggered green columns with depth fade.',
    category: 'Cyberpunk',
    badge: 'Cascade Drops',
    gradient: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)'
  },
  {
    id: 'bokeh',
    name: 'Bokeh Lights',
    description: 'Soft, dreamy out-of-focus light orbs floating upward with gentle drift. Uses shadow blur for realistic cinematic lens bokeh.',
    category: 'Cinematic & Events',
    badge: 'Soft Lens Blur',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  },
  {
    id: 'galaxy',
    name: 'Galaxy Spiral',
    description: 'Thousands of particles orbiting in a logarithmic spiral pattern. Creates mesmerizing galactic arms with depth and color variation.',
    category: 'Astrophysics',
    badge: 'Spiral Core',
    gradient: 'linear-gradient(135deg, #f9d423 0%, #ff4e50 100%)'
  }
];

export interface ColorPalette {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  primaryRgb: [number, number, number];
  secondaryRgb: [number, number, number];
  accentRgb: [number, number, number];
}

export const COLOR_PALETTES: ColorPalette[] = [
  { id: 'default', name: 'Default Ambient', primary: '#00f2fe', secondary: '#b600ff', accent: '#00ffc4', primaryRgb: [0, 242, 254], secondaryRgb: [182, 0, 255], accentRgb: [0, 255, 196] },
  { id: 'cyberpunk', name: 'Cyber Neon', primary: '#00ffcc', secondary: '#ff007f', accent: '#7000ff', primaryRgb: [0, 255, 204], secondaryRgb: [255, 0, 127], accentRgb: [112, 0, 255] },
  { id: 'cosmic', name: 'Cosmic Nebula', primary: '#a855f7', secondary: '#ec4899', accent: '#3b82f6', primaryRgb: [168, 85, 247], secondaryRgb: [236, 72, 153], accentRgb: [59, 130, 246] },
  { id: 'emerald', name: 'Emerald Matrix', primary: '#10b981', secondary: '#06b6d4', accent: '#84cc16', primaryRgb: [16, 185, 129], secondaryRgb: [6, 182, 212], accentRgb: [132, 204, 22] },
  { id: 'sunset', name: 'Golden Sunset', primary: '#f59e0b', secondary: '#f43f5e', accent: '#8b5cf6', primaryRgb: [245, 158, 11], secondaryRgb: [244, 63, 94], accentRgb: [139, 92, 246] },
  { id: 'monochrome', name: 'Sleek Monochrome', primary: '#e2e8f0', secondary: '#94a3b8', accent: '#38bdf8', primaryRgb: [226, 232, 240], secondaryRgb: [148, 163, 184], accentRgb: [56, 189, 248] },
];

@Component({
  selector: 'app-free-services',
  templateUrl: './free-services.component.html',
  styleUrls: ['./free-services.component.scss']
})
export class FreeServicesComponent implements OnInit, AfterViewInit, OnDestroy {
  animations = ANIMATIONS;
  colorPalettes = COLOR_PALETTES;

  activeAnim = signal<AnimStyle | null>(null);
  
  // Feature Settings Signals
  speedMultiplier = signal(1.0);
  densityMultiplier = signal(1.0);
  selectedPalette = signal<string>('default');
  mouseMode = signal<'interact' | 'attract' | 'repel' | 'off'>('interact');
  glowIntensity = signal(50);

  showSettingsDrawer = signal(false);
  activeSettingsTab = signal<'core' | 'style'>('core');

  // Animation Specific Settings Signals
  netLineDist = signal(130);
  netNodeSize = signal(2.0);
  gradBlur = signal(250);
  gradOrbScale = signal(1.0);
  ribbonAmp = signal(100);
  ribbonWidth = signal(55);
  isoShapeMode = signal<'wireframe' | 'solid' | 'glowing'>('wireframe');
  isoRotSpeed = signal(1.0);
  flowTrail = signal(50);
  flowTurbulence = signal(0.006);
  starWarp = signal(1.0);
  starFov = signal(5.0);
  auroraCurtains = signal(6);
  auroraGlow = signal(12);
  matrixFontSize = signal(14);
  matrixSpeed = signal(1.0);
  bokehBlur = signal(25);
  bokehDir = signal<'up' | 'down' | 'drift'>('up');
  galaxyArms = signal(3);
  galaxyCore = signal(60);

  get activePalette(): ColorPalette {
    return COLOR_PALETTES.find(p => p.id === this.selectedPalette()) || COLOR_PALETTES[0];
  }

  toggleSettingsDrawer() {
    this.showSettingsDrawer.update(v => !v);
  }

  setSettingsTab(tab: 'core' | 'style') {
    this.activeSettingsTab.set(tab);
  }

  updateDensity(val: number) {
    this.densityMultiplier.set(val);
    if (this.activeAnim()) {
      this.populateEntities();
    }
  }

  updatePalette(paletteId: string) {
    this.selectedPalette.set(paletteId);
    if (this.activeAnim()) {
      this.populateEntities();
    }
  }

  updateMouseMode(mode: 'interact' | 'attract' | 'repel' | 'off') {
    this.mouseMode.set(mode);
  }

  updateGlow(event: Event) {
    const val = parseFloat((event.target as HTMLInputElement).value);
    this.glowIntensity.set(val);
  }

  resetSettings() {
    this.speedMultiplier.set(1.0);
    this.densityMultiplier.set(1.0);
    this.selectedPalette.set('default');
    this.mouseMode.set('interact');
    this.glowIntensity.set(50);

    this.netLineDist.set(130);
    this.netNodeSize.set(2.0);
    this.gradBlur.set(250);
    this.gradOrbScale.set(1.0);
    this.ribbonAmp.set(100);
    this.ribbonWidth.set(55);
    this.isoShapeMode.set('wireframe');
    this.isoRotSpeed.set(1.0);
    this.flowTrail.set(50);
    this.flowTurbulence.set(0.006);
    this.starWarp.set(1.0);
    this.starFov.set(5.0);
    this.auroraCurtains.set(6);
    this.auroraGlow.set(12);
    this.matrixFontSize.set(14);
    this.matrixSpeed.set(1.0);
    this.bokehBlur.set(25);
    this.bokehDir.set('up');
    this.galaxyArms.set(3);
    this.galaxyCore.set(60);

    if (this.activeAnim()) {
      this.populateEntities();
    }
  }
  
  showCodeModal = false;
  copied = false;
  activeCodeSnippet = '';

  mouseX = 0;
  mouseY = 0;
  isMouseOver = false;

  @ViewChild('bgCanvas') canvasRef?: ElementRef<HTMLCanvasElement>;
  @ViewChildren('previewCanvas') previewCanvases!: QueryList<ElementRef<HTMLCanvasElement>>;

  private previewData: Map<string, {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    entities: Entity[];
    mouseX: number;
    mouseY: number;
    isHovered: boolean;
  }> = new Map();

  private previewAnimationFrameId?: number;
  private lastPreviewTime = 0;
  private previewTime = 0;

  onCardMouseMove(event: MouseEvent, styleId: string) {
    const card = event.currentTarget as HTMLElement;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    const pData = this.previewData.get(styleId);
    if (pData) {
      const canvasRect = pData.canvas.getBoundingClientRect();
      pData.mouseX = event.clientX - canvasRect.left;
      pData.mouseY = event.clientY - canvasRect.top;
      pData.isHovered = true;
    }
  }

  onCardMouseLeave(styleId: string) {
    const pData = this.previewData.get(styleId);
    if (pData) {
      pData.isHovered = false;
      pData.mouseX = pData.width / 2;
      pData.mouseY = pData.height / 2;
    }
  }

  private ctx: CanvasRenderingContext2D | null = null;
  private width = 0;
  private height = 0;
  private entities: Entity[] = [];
  private time = 0;
  private lastTime = 0;
  private animationFrameId?: number;
  private themeSub?: Subscription;

  private resizeListener = () => this.resizeCanvas();

  constructor(public themeService: ThemeService) {}

  ngOnInit() {
    this.themeSub = this.themeService.theme$.subscribe(() => {
      if (this.activeAnim()) {
        this.populateEntities();
      } else {
        this.setupPreviews();
      }
    });
  }

  ngAfterViewInit() {
    this.previewCanvases.changes.subscribe(() => {
      this.setupPreviews();
    });
    setTimeout(() => this.setupPreviews(), 100);
  }

  ngOnDestroy() {
    this.stopAnimation();
    this.stopPreviewLoop();
    if (this.themeSub) {
      this.themeSub.unsubscribe();
    }
  }

  private stopPreviewLoop() {
    if (this.previewAnimationFrameId) {
      cancelAnimationFrame(this.previewAnimationFrameId);
      this.previewAnimationFrameId = undefined;
    }
  }

  private setupPreviews() {
    this.stopPreviewLoop();
    this.previewData.clear();

    if (!this.previewCanvases || this.previewCanvases.length === 0) return;

    const isDark = this.themeService.isDarkMode();

    this.previewCanvases.forEach(ref => {
      const canvas = ref.nativeElement;
      const styleId = canvas.getAttribute('data-id');
      if (!styleId) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const w = rect.width || 320;
      const h = rect.height || 150;
      canvas.width = w;
      canvas.height = h;

      const entities = this.createPreviewEntities(styleId, w, h, isDark);
      this.previewData.set(styleId, {
        canvas,
        ctx,
        width: w,
        height: h,
        entities,
        mouseX: w / 2,
        mouseY: h / 2,
        isHovered: false
      });
    });

    if (this.previewData.size > 0) {
      this.lastPreviewTime = performance.now();
      this.previewAnimationFrameId = requestAnimationFrame(this.animatePreviews);
    }
  }

  private createPreviewEntities(styleId: string, w: number, h: number, isDark: boolean): Entity[] {
    const entities: Entity[] = [];
    if (styleId === 'network') {
      for (let i = 0; i < 22; i++) {
        entities.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: Math.random() * 2 + 1.2
        });
      }
    } else if (styleId === 'gradient') {
      const maxDim = Math.max(w, h);
      const color1 = isDark ? [0, 242, 254] : [2, 132, 199];
      const color2 = isDark ? [182, 0, 255] : [139, 92, 246];
      const color3 = isDark ? [0, 255, 196] : [13, 148, 136];
      return [
        { x: w * 0.2, y: h * 0.3, vx: 0.2, vy: 0.3, r: maxDim * 0.7, color: color1 },
        { x: w * 0.8, y: h * 0.7, vx: -0.3, vy: -0.2, r: maxDim * 0.75, color: color2 },
        { x: w * 0.5, y: h * 0.5, vx: 0.3, vy: -0.3, r: maxDim * 0.6, color: color3 }
      ];
    } else if (styleId === 'ribbons') {
      for (let i = 0; i < 4; i++) {
        const hue = isDark ? (180 + i * 25) : (200 + i * 25);
        entities.push({
          yOffset: h * (0.25 + i * 0.18),
          amplitude: Math.random() * 25 + 20,
          frequency: Math.random() * 0.008 + 0.004,
          speed: Math.random() * 0.8 + 0.4,
          phase: Math.random() * Math.PI * 2,
          color: `hsla(${hue}, 85%, ${isDark ? 55 : 45}%, ${isDark ? 0.25 : 0.3})`
        });
      }
    } else if (styleId === 'isometric') {
      for (let i = 0; i < 12; i++) {
        entities.push({
          x: Math.random() * w,
          y: Math.random() * h,
          sides: Math.floor(Math.random() * 4) + 3,
          size: Math.random() * 14 + 10,
          angle: Math.random() * Math.PI * 2,
          vAngle: (Math.random() - 0.5) * 0.6,
          vy: Math.random() * 20 + 10
        });
      }
    } else if (styleId === 'flowfield') {
      for (let i = 0; i < 100; i++) {
        entities.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: 0,
          vy: 0,
          size: Math.random() * 1.5 + 0.8
        });
      }
    } else if (styleId === 'starfield') {
      for (let i = 0; i < 150; i++) {
        entities.push({
          x: (Math.random() - 0.5) * w * 2,
          y: (Math.random() - 0.5) * h * 2,
          z: Math.random() * w,
          size: Math.random() * 1.2 + 0.5,
          speed: Math.random() * 4 + 2
        });
      }
    } else if (styleId === 'aurora') {
      for (let i = 0; i < 4; i++) {
        const hue = isDark ? (120 + i * 30) : (160 + i * 25);
        entities.push({
          yOffset: h * (0.2 + i * 0.15),
          amplitude: Math.random() * 25 + 15,
          frequency: Math.random() * 0.006 + 0.003,
          speed: Math.random() * 0.6 + 0.3,
          phase: Math.random() * Math.PI * 2,
          color: `hsla(${hue}, 80%, ${isDark ? 55 : 40}%, ${isDark ? 0.2 : 0.25})`
        });
      }
    } else if (styleId === 'matrix') {
      const fontSize = 11;
      const cols = Math.floor(w / fontSize);
      const chars = 'アイウエオカキクケコ0123456789ABCDEF';
      for (let i = 0; i < cols; i++) {
        entities.push({
          col: i,
          y: Math.random() * -h,
          speed: Math.random() * 40 + 30,
          len: Math.floor(Math.random() * 10) + 5,
          char: chars[Math.floor(Math.random() * chars.length)],
          opacity: Math.random() * 0.6 + 0.4
        });
      }
    } else if (styleId === 'bokeh') {
      for (let i = 0; i < 16; i++) {
        const hue = isDark ? (Math.random() * 110 + 170) : (Math.random() * 70 + 190);
        entities.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -(Math.random() * 0.4 + 0.1),
          size: Math.random() * 18 + 6,
          blur: Math.random() * 12 + 4,
          opacity: Math.random() * 0.3 + 0.1,
          color: `hsla(${hue}, 70%, ${isDark ? 65 : 50}%, 1)`
        });
      }
    } else if (styleId === 'galaxy') {
      const maxR = Math.min(w, h) * 0.45;
      for (let i = 0; i < 220; i++) {
        const arm = Math.floor(Math.random() * 3);
        const armOffset = (arm * Math.PI * 2) / 3;
        entities.push({
          orbitRadius: Math.random() * maxR + 5,
          orbitAngle: armOffset + (Math.random() - 0.5),
          orbitSpeed: Math.random() * 0.4 + 0.15,
          size: Math.random() * 1.5 + 0.5,
          color: isDark
            ? `hsla(${Math.random() * 90 + 190}, 80%, ${Math.random() * 30 + 50}%, ${Math.random() * 0.5 + 0.4})`
            : `hsla(${Math.random() * 70 + 200}, 70%, ${Math.random() * 20 + 35}%, ${Math.random() * 0.5 + 0.5})`
        });
      }
    }
    return entities;
  }

  private animatePreviews = (now: number) => {
    if (this.activeAnim() || this.previewData.size === 0) return;

    const dt = Math.min((now - this.lastPreviewTime) / 1000, 0.1);
    this.lastPreviewTime = now;
    this.previewTime += dt;

    const isDark = this.themeService.isDarkMode();

    this.previewData.forEach((data, styleId) => {
      const ctx = data.ctx;
      const w = data.width;
      const h = data.height;

      if (styleId === 'flowfield') {
        ctx.fillStyle = isDark ? 'rgba(3, 3, 8, 0.15)' : 'rgba(248, 250, 252, 0.2)';
        ctx.fillRect(0, 0, w, h);
      } else if (styleId === 'matrix') {
        ctx.fillStyle = isDark ? 'rgba(3, 3, 8, 0.18)' : 'rgba(248, 250, 252, 0.22)';
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.fillStyle = isDark ? '#030308' : '#f8fafc';
        ctx.fillRect(0, 0, w, h);
      }

      if (styleId === 'network') {
        ctx.fillStyle = isDark ? 'rgba(0, 242, 254, 0.7)' : 'rgba(2, 132, 199, 0.8)';
        data.entities.forEach(p => {
          p.x! += p.vx! * (dt * 60);
          p.y! += p.vy! * (dt * 60);
          if (p.x! < 0 || p.x! > w) p.vx! *= -1;
          if (p.y! < 0 || p.y! > h) p.vy! *= -1;
          ctx.beginPath();
          ctx.arc(p.x!, p.y!, p.radius!, 0, Math.PI * 2);
          ctx.fill();
        });

        const strokeColor = isDark ? '0, 242, 254' : '2, 132, 199';
        for (let i = 0; i < data.entities.length; i++) {
          for (let j = i + 1; j < data.entities.length; j++) {
            const dx = data.entities[i].x! - data.entities[j].x!;
            const dy = data.entities[i].y! - data.entities[j].y!;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 75) {
              ctx.beginPath();
              ctx.moveTo(data.entities[i].x!, data.entities[i].y!);
              ctx.lineTo(data.entities[j].x!, data.entities[j].y!);
              const alpha = (1 - dist / 75) * (isDark ? 0.35 : 0.45);
              ctx.strokeStyle = `rgba(${strokeColor}, ${alpha.toFixed(2)})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
      } else if (styleId === 'gradient') {
        data.entities.forEach(orb => {
          orb.x! += orb.vx! * (dt * 60);
          orb.y! += orb.vy! * (dt * 60);
          if (orb.x! < -w * 0.2 || orb.x! > w * 1.2) orb.vx! *= -1;
          if (orb.y! < -h * 0.2 || orb.y! > h * 1.2) orb.vy! *= -1;

          const col = orb.color as number[];
          const grad = ctx.createRadialGradient(orb.x!, orb.y!, 0, orb.x!, orb.y!, orb.r!);
          grad.addColorStop(0, `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${isDark ? 0.25 : 0.35})`);
          grad.addColorStop(1, `rgba(${col[0]}, ${col[1]}, ${col[2]}, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(orb.x!, orb.y!, orb.r!, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (styleId === 'ribbons') {
        data.entities.forEach(rib => {
          rib.phase! += rib.speed! * dt;
          ctx.beginPath();
          for (let x = 0; x <= w; x += 6) {
            let y = rib.yOffset! + Math.sin(x * rib.frequency! + rib.phase!) * rib.amplitude!;
            if (data.isHovered) {
              const dx = x - data.mouseX;
              if (Math.abs(dx) < 80) {
                const push = Math.exp(-(dx * dx) / 2500);
                y += (data.mouseY - rib.yOffset!) * 0.4 * push;
              }
            }
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.strokeStyle = rib.color as string;
          ctx.lineWidth = 28;
          ctx.lineCap = 'round';
          ctx.stroke();
        });
      } else if (styleId === 'isometric') {
        ctx.strokeStyle = isDark ? 'rgba(182, 0, 255, 0.5)' : 'rgba(139, 92, 246, 0.6)';
        ctx.lineWidth = 1.2;
        data.entities.forEach(shape => {
          shape.y! -= shape.vy! * dt;
          shape.angle! += shape.vAngle! * dt;
          if (shape.y! < -30) {
            shape.y = h + 30;
            shape.x = Math.random() * w;
          }
          ctx.beginPath();
          for (let i = 0; i < shape.sides!; i++) {
            const angle = shape.angle! + (i * Math.PI * 2) / shape.sides!;
            const px = shape.x! + Math.cos(angle) * shape.size!;
            const py = shape.y! + Math.sin(angle) * shape.size!;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        });
      } else if (styleId === 'flowfield') {
        ctx.fillStyle = isDark ? 'rgba(0, 242, 254, 0.75)' : 'rgba(2, 132, 199, 0.8)';
        const t = this.previewTime * 0.5;
        data.entities.forEach(p => {
          let angle = Math.sin(p.x! * 0.01 + t) * Math.cos(p.y! * 0.01 + t) * Math.PI * 3;
          if (data.isHovered) {
            const dx = p.x! - data.mouseX;
            const dy = p.y! - data.mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 60) {
              const force = (60 - dist) / 60;
              angle = angle * (1 - force) + (Math.atan2(dy, dx) + Math.PI * 0.5) * force;
            }
          }
          p.vx! = Math.cos(angle);
          p.vy! = Math.sin(angle);
          p.x! += p.vx! * 1.5 * (dt * 60);
          p.y! += p.vy! * 1.5 * (dt * 60);
          if (p.x! < 0) p.x! = w;
          if (p.x! > w) p.x! = 0;
          if (p.y! < 0) p.y! = h;
          if (p.y! > h) p.y! = h;
          ctx.beginPath();
          ctx.arc(p.x!, p.y!, p.size!, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (styleId === 'starfield') {
        const cx = data.isHovered ? data.mouseX : w / 2;
        const cy = data.isHovered ? data.mouseY : h / 2;
        data.entities.forEach(star => {
          star.z! -= star.speed! * (dt * 60);
          if (star.z! <= 0) {
            star.x = (Math.random() - 0.5) * w * 2;
            star.y = (Math.random() - 0.5) * h * 2;
            star.z = w;
          }
          const sx = (star.x! / star.z!) * w * 0.5 + cx;
          const sy = (star.y! / star.z!) * h * 0.5 + cy;
          const sz = (1 - star.z! / w) * star.size! * 2.5;
          if (sx < 0 || sx > w || sy < 0 || sy > h) return;
          const alpha = (1 - star.z! / w);
          ctx.beginPath();
          ctx.arc(sx, sy, Math.max(sz, 0.3), 0, Math.PI * 2);
          ctx.fillStyle = isDark
            ? `rgba(220, 240, 255, ${alpha.toFixed(2)})`
            : `rgba(30, 60, 120, ${(alpha * 0.8).toFixed(2)})`;
          ctx.fill();
        });
      } else if (styleId === 'aurora') {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        data.entities.forEach(wave => {
          wave.phase! += wave.speed! * dt;
          ctx.beginPath();
          for (let x = 0; x <= w; x += 5) {
            let y = wave.yOffset! + Math.sin(x * wave.frequency! + wave.phase!) * wave.amplitude!;
            if (data.isHovered) {
              const dx = x - data.mouseX;
              if (Math.abs(dx) < 90) {
                const push = Math.exp(-(dx * dx) / 3000);
                y += (data.mouseY - wave.yOffset!) * 0.3 * push;
              }
            }
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.lineTo(w, h);
          ctx.lineTo(0, h);
          ctx.closePath();
          ctx.fillStyle = wave.color as string;
          ctx.fill();
        });
        ctx.restore();
      } else if (styleId === 'matrix') {
        const fontSize = 11;
        const chars = 'アイウエオカキクケコ0123456789ABCDEF';
        ctx.font = `${fontSize}px 'Courier New', monospace`;
        data.entities.forEach(drop => {
          const x = drop.col! * fontSize;
          drop.y! += drop.speed! * dt;
          if (drop.y! > h + 30) {
            drop.y = Math.random() * -50;
          }
          for (let j = 0; j < drop.len!; j++) {
            const cy = drop.y! - j * fontSize;
            if (cy < 0 || cy > h) continue;
            const alpha = (1 - j / drop.len!) * drop.opacity! * (isDark ? 1 : 0.85);
            ctx.fillStyle = j === 0
              ? (isDark ? `rgba(180, 255, 180, ${Math.min(alpha + 0.3, 1).toFixed(2)})` : `rgba(0, 100, 60, ${Math.min(alpha + 0.3, 1).toFixed(2)})`)
              : (isDark ? `rgba(0, 200, 70, ${alpha.toFixed(2)})` : `rgba(0, 120, 50, ${alpha.toFixed(2)})`);
            ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, cy);
          }
        });
      } else if (styleId === 'bokeh') {
        ctx.save();
        data.entities.forEach(orb => {
          orb.x! += orb.vx! * (dt * 60);
          orb.y! += orb.vy! * (dt * 60);
          if (data.isHovered) {
            const dx = data.mouseX - orb.x!;
            const dy = data.mouseY - orb.y!;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
              orb.x! += dx * 0.02;
              orb.y! += dy * 0.02;
            }
          }
          if (orb.y! < -orb.size! * 2) { orb.y = h + orb.size! * 2; orb.x = Math.random() * w; }
          if (orb.x! < -orb.size! * 2) orb.x = w + orb.size! * 2;
          if (orb.x! > w + orb.size! * 2) orb.x = -orb.size! * 2;
          ctx.beginPath();
          ctx.arc(orb.x!, orb.y!, orb.size!, 0, Math.PI * 2);
          ctx.fillStyle = (orb.color as string).replace(/1\)$/, `${orb.opacity!.toFixed(2)})`);
          ctx.shadowColor = orb.color as string;
          ctx.shadowBlur = orb.blur!;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
        ctx.restore();
      } else if (styleId === 'galaxy') {
        const gcx = data.isHovered ? w / 2 + (data.mouseX - w / 2) * 0.3 : w / 2;
        const gcy = data.isHovered ? h / 2 + (data.mouseY - h / 2) * 0.3 : h / 2;
        data.entities.forEach(star => {
          star.orbitAngle! += (star.orbitSpeed! / (star.orbitRadius! * 0.15 + 5)) * dt;
          const angle = star.orbitAngle! + star.orbitRadius! * 0.01;
          const px = gcx + Math.cos(angle) * star.orbitRadius!;
          const py = gcy + Math.sin(angle) * star.orbitRadius!;
          if (px < -5 || px > w + 5 || py < -5 || py > h + 5) return;
          ctx.beginPath();
          ctx.arc(px, py, star.size!, 0, Math.PI * 2);
          ctx.fillStyle = star.color as string;
          ctx.fill();
        });
        const grad = ctx.createRadialGradient(gcx, gcy, 0, gcx, gcy, 35);
        grad.addColorStop(0, isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(100, 80, 200, 0.15)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(gcx, gcy, 35, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    this.previewAnimationFrameId = requestAnimationFrame(this.animatePreviews);
  };

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

  @HostListener('window:touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (event.touches.length > 0) {
      this.mouseX = event.touches[0].clientX;
      this.mouseY = event.touches[0].clientY;
      this.isMouseOver = true;
    }
  }

  selectAnimation(anim: AnimStyle) {
    this.stopPreviewLoop();
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
    setTimeout(() => this.setupPreviews(), 50);
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

  populateEntities() {
    this.entities = [];
    const styleId = this.activeAnim()?.id;
    const isMobile = window.innerWidth < 768;
    const isDark = this.themeService.isDarkMode();
    const dMult = this.densityMultiplier();
    const pal = this.activePalette;
    const isDefaultPal = this.selectedPalette() === 'default';

    if (styleId === 'network') {
      const baseCount = isMobile ? 40 : 100;
      const count = Math.floor(baseCount * dMult);
      for(let i = 0; i < count; i++) {
        this.entities.push({
          x: this.random(0, this.width),
          y: this.random(0, this.height),
          vx: this.random(-0.5, 0.5),
          vy: this.random(-0.5, 0.5),
          radius: this.random(this.netNodeSize() * 0.5, this.netNodeSize() * 1.5)
        });
      }
    } 
    else if (styleId === 'gradient') {
      const maxDim = Math.max(this.width, this.height);
      const color1 = isDefaultPal ? (isDark ? [0, 242, 254] : [2, 132, 199]) : pal.primaryRgb;
      const color2 = isDefaultPal ? (isDark ? [182, 0, 255] : [139, 92, 246]) : pal.secondaryRgb;
      const color3 = isDefaultPal ? (isDark ? [0, 255, 196] : [13, 148, 136]) : pal.accentRgb;
      const scale = this.gradOrbScale();

      this.entities = [
        { x: this.width * 0.2, y: this.height * 0.3, vx: 0.3, vy: 0.4, r: maxDim * 0.6 * scale, color: color1 },
        { x: this.width * 0.8, y: this.height * 0.7, vx: -0.4, vy: -0.3, r: maxDim * 0.7 * scale, color: color2 },
        { x: this.width * 0.5, y: this.height * 0.5, vx: 0.5, vy: -0.5, r: maxDim * 0.5 * scale, color: color3 }
      ];
    } 
    else if (styleId === 'ribbons') {
      for(let i = 0; i < 5; i++) {
        let colorStr = '';
        if (isDefaultPal) {
          const hue = isDark ? (180 + i * 25) : (200 + i * 25);
          colorStr = `hsla(${hue}, 85%, ${isDark ? 55 : 45}%, ${isDark ? 0.12 : 0.18})`;
        } else {
          const rgb = i % 2 === 0 ? pal.primaryRgb : pal.secondaryRgb;
          colorStr = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${isDark ? 0.15 : 0.22})`;
        }
        this.entities.push({
          yOffset: this.height * (0.2 + (i * 0.15)),
          amplitude: this.random(this.ribbonAmp() * 0.6, this.ribbonAmp() * 1.4),
          frequency: this.random(0.001, 0.0035),
          speed: this.random(0.4, 1.2),
          phase: this.random(0, Math.PI * 2),
          color: colorStr
        });
      }
    } 
    else if (styleId === 'isometric') {
      const baseCount = isMobile ? 12 : 30;
      const count = Math.floor(baseCount * dMult);
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
      const baseCount = isMobile ? 250 : 600;
      const count = Math.floor(baseCount * dMult);
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
    else if (styleId === 'starfield') {
      const baseCount = isMobile ? 300 : 800;
      const count = Math.floor(baseCount * dMult);
      for (let i = 0; i < count; i++) {
        this.entities.push({
          x: this.random(-this.width, this.width),
          y: this.random(-this.height, this.height),
          z: this.random(1, this.width),
          size: this.random(0.5, 2),
          speed: this.random(2, 8)
        });
      }
    }
    else if (styleId === 'aurora') {
      const curtains = this.auroraCurtains();
      for (let i = 0; i < curtains; i++) {
        let colorStr = '';
        if (isDefaultPal) {
          const hue = isDark ? (120 + i * 30) : (160 + i * 25);
          colorStr = `hsla(${hue}, 80%, ${isDark ? 55 : 40}%, ${(this.auroraGlow() / 100).toFixed(2)})`;
        } else {
          const rgb = i % 3 === 0 ? pal.primaryRgb : (i % 3 === 1 ? pal.secondaryRgb : pal.accentRgb);
          colorStr = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${(this.auroraGlow() / 100).toFixed(2)})`;
        }
        this.entities.push({
          yOffset: this.height * (0.12 + i * (0.6 / curtains)),
          amplitude: this.random(40, 120),
          frequency: this.random(0.0008, 0.002),
          speed: this.random(0.2, 0.6),
          phase: this.random(0, Math.PI * 2),
          color: colorStr,
          size: this.random(80, 160)
        });
      }
    }
    else if (styleId === 'matrix') {
      const fontSize = this.matrixFontSize();
      const cols = Math.floor(this.width / fontSize);
      const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
      for (let i = 0; i < cols; i++) {
        this.entities.push({
          col: i,
          y: this.random(-this.height, 0),
          speed: this.random(60, 180) * this.matrixSpeed(),
          len: Math.floor(this.random(8, 28)),
          char: chars[Math.floor(Math.random() * chars.length)],
          opacity: this.random(0.5, 1)
        });
      }
    }
    else if (styleId === 'bokeh') {
      const baseCount = isMobile ? 20 : 50;
      const count = Math.floor(baseCount * dMult);
      for (let i = 0; i < count; i++) {
        let colorStr = '';
        if (isDefaultPal) {
          const hue = isDark ? this.random(170, 280) : this.random(190, 260);
          colorStr = `hsla(${hue}, 70%, ${isDark ? 65 : 50}%, 1)`;
        } else {
          const rgb = i % 2 === 0 ? pal.primaryRgb : pal.secondaryRgb;
          colorStr = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`;
        }
        this.entities.push({
          x: this.random(0, this.width),
          y: this.random(0, this.height),
          vx: this.random(-0.3, 0.3),
          vy: this.bokehDir() === 'up' ? this.random(-0.6, -0.1) : (this.bokehDir() === 'down' ? this.random(0.1, 0.6) : this.random(-0.3, 0.3)),
          size: this.random(8, 50),
          blur: this.bokehBlur(),
          opacity: this.random(0.08, 0.3),
          color: colorStr
        });
      }
    }
    else if (styleId === 'galaxy') {
      const baseCount = isMobile ? 400 : 1200;
      const count = Math.floor(baseCount * dMult);
      const arms = this.galaxyArms();
      const maxR = Math.min(this.width, this.height) * 0.42;

      for (let i = 0; i < count; i++) {
        const arm = Math.floor(this.random(0, arms));
        const armOffset = (arm * Math.PI * 2) / arms;
        let colorStr = '';
        if (isDefaultPal) {
          colorStr = isDark
            ? `hsla(${this.random(190, 280)}, 80%, ${this.random(55, 80)}%, ${this.random(0.4, 0.9)})`
            : `hsla(${this.random(200, 270)}, 70%, ${this.random(35, 55)}%, ${this.random(0.5, 0.9)})`;
        } else {
          const rgb = arm % 2 === 0 ? pal.primaryRgb : pal.secondaryRgb;
          colorStr = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${this.random(0.4, 0.9)})`;
        }
        this.entities.push({
          orbitRadius: this.random(10, maxR),
          orbitAngle: armOffset + this.random(-0.5, 0.5),
          orbitSpeed: this.random(0.1, 0.4),
          size: this.random(0.5, 2.2),
          color: colorStr
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
    const isDark = this.themeService.isDarkMode();
    const pal = this.activePalette;
    const isDefaultPal = this.selectedPalette() === 'default';
    const mm = this.mouseMode();
    const glow = this.glowIntensity();

    // Background fill based on theme
    if (styleId === 'flowfield') {
      const trailAlpha = (100 - this.flowTrail()) * 0.003 + 0.05;
      this.ctx.fillStyle = isDark ? `rgba(3, 3, 8, ${trailAlpha})` : `rgba(248, 250, 252, ${trailAlpha})`;
      this.ctx.fillRect(0, 0, this.width, this.height);
    } else if (styleId === 'matrix') {
      this.ctx.fillStyle = isDark ? `rgba(3, 3, 8, 0.15)` : `rgba(248, 250, 252, 0.2)`;
      this.ctx.fillRect(0, 0, this.width, this.height);
    } else {
      this.ctx.fillStyle = isDark ? '#030308' : '#f8fafc';
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    if (styleId === 'network') {
      const nodeRgb = isDefaultPal ? (isDark ? '0, 242, 254' : '2, 132, 199') : pal.primaryRgb.join(',');
      const nodeColor = `rgba(${nodeRgb}, 0.75)`;
      
      this.ctx.fillStyle = nodeColor;

      if (glow > 0) {
        this.ctx.shadowBlur = (glow / 100) * 12;
        this.ctx.shadowColor = `rgba(${nodeRgb}, 0.8)`;
      } else {
        this.ctx.shadowBlur = 0;
      }

      this.entities.forEach(p => {
        p.x! += p.vx! * speed * (dt * 60);
        p.y! += p.vy! * speed * (dt * 60);
        
        // Mouse interaction
        if (this.isMouseOver && mm !== 'off') {
          const dx = p.x! - this.mouseX;
          const dy = p.y! - this.mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const force = (180 - dist) / 180;
            if (mm === 'attract') {
              p.x! -= (dx / dist) * force * 4 * speed;
              p.y! -= (dy / dist) * force * 4 * speed;
            } else if (mm === 'repel') {
              p.x! += (dx / dist) * force * 4 * speed;
              p.y! += (dy / dist) * force * 4 * speed;
            } else {
              p.x! += (dx / dist) * force * 3 * speed;
              p.y! += (dy / dist) * force * 3 * speed;

              // Connection beam
              this.ctx!.beginPath();
              this.ctx!.moveTo(p.x!, p.y!);
              this.ctx!.lineTo(this.mouseX, this.mouseY);
              const alpha = (1 - dist / 180) * 0.45;
              this.ctx!.strokeStyle = `rgba(${nodeRgb}, ${alpha.toFixed(3)})`;
              this.ctx!.lineWidth = 1.1;
              this.ctx!.stroke();
            }
          }
        }

        if (p.x! < 0 || p.x! > this.width) p.vx! *= -1;
        if (p.y! < 0 || p.y! > this.height) p.vy! *= -1;

        this.ctx!.beginPath();
        this.ctx!.arc(p.x!, p.y!, p.radius!, 0, Math.PI * 2);
        this.ctx!.fill();
      });

      this.ctx.shadowBlur = 0;

      const linkDist = this.netLineDist();
      for (let i = 0; i < this.entities.length; i++) {
        for (let j = i + 1; j < this.entities.length; j++) {
          const dx = this.entities[i].x! - this.entities[j].x!;
          const dy = this.entities[i].y! - this.entities[j].y!;
          const dist = Math.sqrt(dx*dx + dy*dy);

          if (dist < linkDist) {
            const alphaMult = isDark ? 0.3 : 0.4;
            this.ctx.beginPath();
            this.ctx.moveTo(this.entities[i].x!, this.entities[i].y!);
            this.ctx.lineTo(this.entities[j].x!, this.entities[j].y!);
            this.ctx.strokeStyle = `rgba(${nodeRgb}, ${((1 - dist/linkDist) * alphaMult).toFixed(3)})`;
            this.ctx.lineWidth = 0.8;
            this.ctx.stroke();
          }
        }
      }
    } 
    else if (styleId === 'gradient') {
      const alphaCenter = isDark ? (0.2 + (glow / 100) * 0.25) : (0.3 + (glow / 100) * 0.25);
      this.entities.forEach((orb, index) => {
        if (index === 0 && this.isMouseOver && mm !== 'off') {
          const factor = mm === 'repel' ? -0.04 : 0.04;
          orb.x! += (this.mouseX - orb.x!) * factor * speed;
          orb.y! += (this.mouseY - orb.y!) * factor * speed;
        } else if (index === 1 && this.isMouseOver && mm !== 'off') {
          orb.x! += ((this.width - this.mouseX) - orb.x!) * 0.02 * speed;
          orb.y! += ((this.height - this.mouseY) - orb.y!) * 0.02 * speed;
        } else {
          orb.x! += orb.vx! * speed * (dt * 60);
          orb.y! += orb.vy! * speed * (dt * 60);
        }
        
        if (orb.x! < -this.width*0.3 || orb.x! > this.width*1.3) orb.vx! *= -1;
        if (orb.y! < -this.height*0.3 || orb.y! > this.height*1.3) orb.vy! *= -1;

        const color = orb.color as number[];
        const gradient = this.ctx!.createRadialGradient(orb.x!, orb.y!, 0, orb.x!, orb.y!, orb.r!);
        gradient.addColorStop(0, `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alphaCenter.toFixed(2)})`);
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
        for (let x = 0; x <= this.width; x += 12) {
          let y = rib.yOffset! + Math.sin(x * rib.frequency! + rib.phase!) * rib.amplitude!;

          if (this.isMouseOver && mm !== 'off') {
            const dx = x - this.mouseX;
            const dist = Math.abs(dx);
            if (dist < 220) {
              const pushFactor = Math.exp(-(dx * dx) / 10000);
              const dir = mm === 'repel' ? -1 : 1;
              const mouseOffsetY = (this.mouseY - rib.yOffset!) * 0.45 * dir;
              y += mouseOffsetY * pushFactor;
            }
          }

          if (x === 0) this.ctx!.moveTo(x, y);
          else this.ctx!.lineTo(x, y);
        }
        this.ctx!.strokeStyle = rib.color as string;
        this.ctx!.lineWidth = this.ribbonWidth();
        this.ctx!.lineCap = 'round';
        this.ctx!.lineJoin = 'round';
        this.ctx!.stroke();
      });
    } 
    else if (styleId === 'isometric') {
      const mainRgb = isDefaultPal ? (isDark ? '182, 0, 255' : '139, 92, 246') : pal.primaryRgb.join(',');
      const strokeColor = `rgba(${mainRgb}, 0.55)`;
      this.ctx.strokeStyle = strokeColor;
      this.ctx.lineWidth = 1.2;

      const mode = this.isoShapeMode();
      const rotSpeed = this.isoRotSpeed();

      this.entities.forEach(shape => {
        shape.y! -= shape.vy! * speed * dt;
        
        let extraRotation = 0;
        let scale = 1.0;

        if (this.isMouseOver && mm !== 'off') {
          const dx = shape.x! - this.mouseX;
          const dy = shape.y! - this.mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            const force = (180 - dist) / 180;
            extraRotation = force * Math.PI * 0.5 * (mm === 'repel' ? -1 : 1);
            scale = 1.0 + force * 0.4;
            if (mm === 'attract') shape.x! -= (dx / dist) * force * 3;
            else if (mm === 'repel') shape.x! += (dx / dist) * force * 3;
          }
        }

        shape.angle! += (shape.vAngle! * rotSpeed + extraRotation) * speed * dt;
        
        if (shape.y! < -100) {
          shape.y! = this.height + 100;
          shape.x! = this.random(0, this.width);
        }

        this.ctx!.beginPath();
        for (let i = 0; i < shape.sides!; i++) {
          const currentAngle = shape.angle! + (i * Math.PI * 2) / shape.sides!;
          const radius = shape.size! * scale;
          const px = shape.x! + Math.cos(currentAngle) * radius;
          const py = shape.y! + Math.sin(currentAngle) * radius;
          if (i === 0) this.ctx!.moveTo(px, py);
          else this.ctx!.lineTo(px, py);
        }
        this.ctx!.closePath();

        if (mode === 'solid') {
          this.ctx!.fillStyle = `rgba(${mainRgb}, 0.15)`;
          this.ctx!.fill();
        } else if (mode === 'glowing' || glow > 40) {
          this.ctx!.shadowBlur = (glow / 100) * 15;
          this.ctx!.shadowColor = `rgba(${mainRgb}, 0.8)`;
        }

        this.ctx!.stroke();
        this.ctx!.shadowBlur = 0;
      });
    } 
    else if (styleId === 'flowfield') {
      const pRgb = isDefaultPal ? (isDark ? '0, 242, 254' : '2, 132, 199') : pal.primaryRgb.join(',');
      this.ctx.fillStyle = `rgba(${pRgb}, 0.8)`;
      const t = this.time * 0.4 * speed;
      const turb = this.flowTurbulence();

      this.entities.forEach(p => {
        let angle = Math.sin(p.x! * turb + t) * Math.cos(p.y! * turb + t) * Math.PI * 3.5;
        
        if (this.isMouseOver && mm !== 'off') {
          const dx = p.x! - this.mouseX;
          const dy = p.y! - this.mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const force = (180 - dist) / 180;
            const vortexAngle = Math.atan2(dy, dx) + (mm === 'repel' ? -Math.PI * 0.5 : Math.PI * 0.5);
            angle = angle * (1 - force) + vortexAngle * force;
          }
        }

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
    else if (styleId === 'starfield') {
      const cx = (this.isMouseOver && mm !== 'off') ? this.mouseX : this.width / 2;
      const cy = (this.isMouseOver && mm !== 'off') ? this.mouseY : this.height / 2;
      const warp = this.starWarp();
      const fov = this.starFov();
      const sRgb = isDefaultPal ? (isDark ? '220, 240, 255' : '30, 60, 120') : pal.primaryRgb.join(',');

      this.entities.forEach(star => {
        star.z! -= star.speed! * speed * warp * (dt * 60);
        if (star.z! <= 0) {
          star.x = this.random(-this.width, this.width);
          star.y = this.random(-this.height, this.height);
          star.z = this.width;
        }

        const sx = (star.x! / star.z!) * this.width * (fov / 10) + cx;
        const sy = (star.y! / star.z!) * this.height * (fov / 10) + cy;
        const sz = (1 - star.z! / this.width) * star.size! * 3;

        if (sx < 0 || sx > this.width || sy < 0 || sy > this.height) return;

        const alpha = (1 - star.z! / this.width);
        this.ctx!.beginPath();
        this.ctx!.arc(sx, sy, Math.max(sz, 0.3), 0, Math.PI * 2);
        this.ctx!.fillStyle = `rgba(${sRgb}, ${alpha.toFixed(2)})`;
        this.ctx!.fill();

        if (sz > 0.8) {
          const prevSx = (star.x! / (star.z! + star.speed! * 3 * warp)) * this.width * (fov / 10) + cx;
          const prevSy = (star.y! / (star.z! + star.speed! * 3 * warp)) * this.height * (fov / 10) + cy;
          this.ctx!.beginPath();
          this.ctx!.moveTo(prevSx, prevSy);
          this.ctx!.lineTo(sx, sy);
          this.ctx!.strokeStyle = `rgba(${sRgb}, ${(alpha * 0.5).toFixed(2)})`;
          this.ctx!.lineWidth = sz * 0.6;
          this.ctx!.stroke();
        }
      });
    }
    else if (styleId === 'aurora') {
      this.ctx.save();
      this.ctx.globalCompositeOperation = 'lighter';

      this.entities.forEach(wave => {
        wave.phase! += wave.speed! * speed * dt;

        this.ctx!.beginPath();
        for (let x = 0; x <= this.width; x += 8) {
          let y = wave.yOffset! +
            Math.sin(x * wave.frequency! + wave.phase!) * wave.amplitude! +
            Math.sin(x * wave.frequency! * 1.8 + wave.phase! * 1.3) * wave.amplitude! * 0.4;

          if (this.isMouseOver && mm !== 'off') {
            const dx = x - this.mouseX;
            const dist = Math.abs(dx);
            if (dist < 250) {
              const pushFactor = Math.exp(-(dx * dx) / 18000);
              const dir = mm === 'repel' ? -1 : 1;
              y += (this.mouseY - wave.yOffset!) * 0.35 * pushFactor * dir;
            }
          }

          if (x === 0) this.ctx!.moveTo(x, y);
          else this.ctx!.lineTo(x, y);
        }
        this.ctx!.lineTo(this.width, this.height);
        this.ctx!.lineTo(0, this.height);
        this.ctx!.closePath();
        this.ctx!.fillStyle = wave.color as string;
        this.ctx!.fill();
      });

      this.ctx.restore();
    }
    else if (styleId === 'matrix') {
      const fontSize = this.matrixFontSize();
      const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
      this.ctx.font = `${fontSize}px 'Courier New', monospace`;

      const mRgb = isDefaultPal ? (isDark ? '0, 200, 70' : '0, 120, 50') : pal.primaryRgb.join(',');

      this.entities.forEach(drop => {
        const x = drop.col! * fontSize;
        drop.y! += drop.speed! * speed * dt;

        if (drop.y! > this.height + 50) {
          drop.y = this.random(-200, -50);
          drop.speed = this.random(60, 180) * this.matrixSpeed();
        }

        let glowBoost = 0;
        if (this.isMouseOver && mm !== 'off') {
          const dx = x - this.mouseX;
          const dy = drop.y! - this.mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            glowBoost = (150 - dist) / 150;
            drop.speed! += glowBoost * 2;
          }
        }

        for (let j = 0; j < drop.len!; j++) {
          const cy = drop.y! - j * fontSize;
          if (cy < 0 || cy > this.height) continue;
          const fadeRatio = 1 - j / drop.len!;
          const alpha = fadeRatio * drop.opacity! * (isDark ? 1 : 0.85) + glowBoost * 0.4;

          if (j === 0) {
            this.ctx!.fillStyle = `rgba(220, 255, 220, ${Math.min(alpha + 0.3, 1).toFixed(2)})`;
          } else {
            this.ctx!.fillStyle = `rgba(${mRgb}, ${alpha.toFixed(2)})`;
          }

          const ch = chars[Math.floor(Math.random() * chars.length)];
          this.ctx!.fillText(ch, x, cy);
        }
      });
    }
    else if (styleId === 'bokeh') {
      this.ctx.save();

      this.entities.forEach(orb => {
        orb.x! += orb.vx! * speed * (dt * 60);
        orb.y! += orb.vy! * speed * (dt * 60);

        if (this.isMouseOver && mm !== 'off') {
          const dx = this.mouseX - orb.x!;
          const dy = this.mouseY - orb.y!;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 250) {
            const dir = mm === 'repel' ? -1 : 1;
            const force = (250 - dist) / 250 * 0.02 * dir;
            orb.x! += dx * force;
            orb.y! += dy * force;
          }
        }

        if (orb.y! < -orb.size! * 2) {
          orb.y = this.height + orb.size! * 2;
          orb.x = this.random(0, this.width);
        }
        if (orb.x! < -orb.size! * 2) orb.x = this.width + orb.size! * 2;
        if (orb.x! > this.width + orb.size! * 2) orb.x = -orb.size! * 2;

        this.ctx!.beginPath();
        this.ctx!.arc(orb.x!, orb.y!, orb.size!, 0, Math.PI * 2);
        this.ctx!.fillStyle = (orb.color as string).replace(/1\)$/, `${orb.opacity!.toFixed(2)})`);
        if (glow > 0) {
          this.ctx!.shadowColor = orb.color as string;
          this.ctx!.shadowBlur = orb.blur! * (glow / 50);
        }
        this.ctx!.fill();
        this.ctx!.shadowBlur = 0;
      });

      this.ctx.restore();
    }
    else if (styleId === 'galaxy') {
      const gcx = (this.isMouseOver && mm !== 'off')
        ? this.width / 2 + (this.mouseX - this.width / 2) * 0.3 * (mm === 'repel' ? -1 : 1)
        : this.width / 2;
      const gcy = (this.isMouseOver && mm !== 'off')
        ? this.height / 2 + (this.mouseY - this.height / 2) * 0.3 * (mm === 'repel' ? -1 : 1)
        : this.height / 2;

      this.entities.forEach(star => {
        star.orbitAngle! += (star.orbitSpeed! / (star.orbitRadius! * 0.1 + 10)) * speed * dt;

        const spiralFactor = star.orbitRadius! * 0.008;
        const angle = star.orbitAngle! + spiralFactor;

        const px = gcx + Math.cos(angle) * star.orbitRadius!;
        const py = gcy + Math.sin(angle) * star.orbitRadius!;

        if (px < -10 || px > this.width + 10 || py < -10 || py > this.height + 10) return;

        this.ctx!.beginPath();
        this.ctx!.arc(px, py, star.size!, 0, Math.PI * 2);
        this.ctx!.fillStyle = star.color as string;
        this.ctx!.fill();
      });

      const coreR = this.galaxyCore();
      const cRgb = isDefaultPal ? (isDark ? '255, 255, 255' : '100, 80, 200') : pal.primaryRgb.join(',');
      const gradient = this.ctx.createRadialGradient(gcx, gcy, 0, gcx, gcy, coreR);
      gradient.addColorStop(0, `rgba(${cRgb}, 0.25)`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(gcx, gcy, coreR, 0, Math.PI * 2);
      this.ctx.fill();
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
    const isDark = this.themeService.isDarkMode();
    const bgColor = isDark ? '#030308' : '#f8fafc';
    const textColor = isDark ? '#ffffff' : '#0f172a';
    const subtextColor = isDark ? '#a1a1aa' : '#64748b';
    const cardBg = isDark ? 'rgba(15, 15, 25, 0.75)' : 'rgba(255, 255, 255, 0.85)';
    const cardBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(203, 213, 225, 0.8)';
    const primaryGlow = isDark ? '#00f2fe' : '#0284c7';

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
      ctx.fillStyle = '${bgColor}';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw Particles
      ctx.fillStyle = '${isDark ? "rgba(0, 242, 254, 0.6)" : "rgba(2, 132, 199, 0.7)"}';
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
      const baseRgb = '${isDark ? "0, 242, 254" : "2, 132, 199"}';
      const alphaMult = ${isDark ? 0.25 : 0.35};
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(' + baseRgb + ', ' + ((1 - dist/130) * alphaMult).toFixed(3) + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }`,
      gradient: `
    // --- Simulation Setup ---
    const orbs = [];
    const colors = ${isDark ? "[[0, 242, 254], [182, 0, 255], [0, 255, 196]]" : "[[2, 132, 199], [139, 92, 246], [13, 148, 136]]"};
    const maxDim = Math.max(canvas.width, canvas.height);
    
    orbs.push({ x: canvas.width * 0.2, y: canvas.height * 0.3, vx: 0.3, vy: 0.4, r: maxDim * 0.6, color: colors[0] });
    orbs.push({ x: canvas.width * 0.8, y: canvas.height * 0.7, vx: -0.4, vy: -0.3, r: maxDim * 0.7, color: colors[1] });
    orbs.push({ x: canvas.width * 0.5, y: canvas.height * 0.5, vx: 0.5, vy: -0.5, r: maxDim * 0.5, color: colors[2] });
    
    // --- Render Loop ---
    function draw(dt) {
      ctx.fillStyle = '${bgColor}';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      orbs.forEach(orb => {
        orb.x += orb.vx * speedMultiplier;
        orb.y += orb.vy * speedMultiplier;
        
        if (orb.x < -canvas.width * 0.2 || orb.x > canvas.width * 1.2) orb.vx *= -1;
        if (orb.y < -canvas.height * 0.2 || orb.y > canvas.height * 1.2) orb.vy *= -1;
        
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
        gradient.addColorStop(0, 'rgba(' + orb.color[0] + ', ' + orb.color[1] + ', ' + orb.color[2] + ', ${isDark ? 0.25 : 0.35})');
        gradient.addColorStop(1, 'rgba(' + orb.color[0] + ', ' + orb.color[1] + ', ' + orb.color[2] + ', 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }`,
      ribbons: `
    // --- Simulation Setup ---
    const ribbons = [];
    const baseHue = ${isDark ? 180 : 200};
    const lightness = ${isDark ? 55 : 45};
    const alpha = ${isDark ? 0.12 : 0.18};
    for (let i = 0; i < 5; i++) {
      ribbons.push({
        yOffset: canvas.height * (0.2 + (i * 0.15)),
        amplitude: Math.random() * 125 + 55,
        frequency: Math.random() * 0.0025 + 0.001,
        speed: Math.random() * 0.8 + 0.4,
        phase: Math.random() * Math.PI * 2,
        color: 'hsla(' + (baseHue + i * 25) + ', 85%, ' + lightness + '%, ' + alpha + ')'
      });
    }
    
    // --- Render Loop ---
    let time = 0;
    function draw(dt) {
      ctx.fillStyle = '${bgColor}';
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
      ctx.fillStyle = '${bgColor}';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '${isDark ? "rgba(182, 0, 255, 0.35)" : "rgba(139, 92, 246, 0.45)"}';
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
      ctx.fillStyle = '${isDark ? "rgba(3, 3, 8, 0.12)" : "rgba(248, 250, 252, 0.18)"}';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      time += dt;
      
      ctx.fillStyle = '${isDark ? "rgba(0, 242, 254, 0.7)" : "rgba(2, 132, 199, 0.75)"}';
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
    }`,
      starfield: `
    // --- Simulation Setup ---
    const stars = [];
    const count = 800;
    for (let i = 0; i < count; i++) {
      stars.push({
        x: (Math.random() - 0.5) * canvas.width * 2,
        y: (Math.random() - 0.5) * canvas.height * 2,
        z: Math.random() * canvas.width,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 6 + 2
      });
    }
    
    // --- Render Loop ---
    function draw(dt) {
      ctx.fillStyle = '${bgColor}';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      
      stars.forEach(star => {
        star.z -= star.speed * speedMultiplier * dt * 60;
        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * canvas.width * 2;
          star.y = (Math.random() - 0.5) * canvas.height * 2;
          star.z = canvas.width;
        }
        const sx = (star.x / star.z) * canvas.width * 0.5 + cx;
        const sy = (star.y / star.z) * canvas.height * 0.5 + cy;
        const sz = (1 - star.z / canvas.width) * star.size * 3;
        if (sx < 0 || sx > canvas.width || sy < 0 || sy > canvas.height) return;
        const alpha = 1 - star.z / canvas.width;
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(sz, 0.3), 0, Math.PI * 2);
        ctx.fillStyle = '${isDark ? "rgba(220, 240, 255," : "rgba(30, 60, 120,"}' + alpha.toFixed(2) + ')';
        ctx.fill();
        if (sz > 0.8) {
          const prevSx = (star.x / (star.z + star.speed * 3)) * canvas.width * 0.5 + cx;
          const prevSy = (star.y / (star.z + star.speed * 3)) * canvas.height * 0.5 + cy;
          ctx.beginPath();
          ctx.moveTo(prevSx, prevSy);
          ctx.lineTo(sx, sy);
          ctx.strokeStyle = '${isDark ? "rgba(180, 220, 255," : "rgba(30, 80, 160,"}' + (alpha * 0.5).toFixed(2) + ')';
          ctx.lineWidth = sz * 0.6;
          ctx.stroke();
        }
      });
    }`,
      aurora: `
    // --- Simulation Setup ---
    const waves = [];
    for (let i = 0; i < 6; i++) {
      const hue = ${isDark ? 120 : 160} + i * ${isDark ? 30 : 25};
      waves.push({
        yOffset: canvas.height * (0.15 + i * 0.08),
        amplitude: Math.random() * 80 + 40,
        frequency: Math.random() * 0.0012 + 0.0008,
        speed: Math.random() * 0.4 + 0.2,
        phase: Math.random() * Math.PI * 2,
        color: 'hsla(' + hue + ', 80%, ${isDark ? 55 : 40}%, ${isDark ? 0.08 : 0.12})'
      });
    }
    
    // --- Render Loop ---
    function draw(dt) {
      ctx.fillStyle = '${bgColor}';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      waves.forEach(wave => {
        wave.phase += wave.speed * speedMultiplier * dt;
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 8) {
          const y = wave.yOffset +
            Math.sin(x * wave.frequency + wave.phase) * wave.amplitude +
            Math.sin(x * wave.frequency * 1.8 + wave.phase * 1.3) * wave.amplitude * 0.4;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = wave.color;
        ctx.fill();
      });
      ctx.restore();
    }`,
      matrix: `
    // --- Simulation Setup ---
    const fontSize = 14;
    const cols = Math.floor(canvas.width / fontSize);
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF';
    const drops = [];
    for (let i = 0; i < cols; i++) {
      drops.push({
        col: i,
        y: Math.random() * -canvas.height,
        speed: Math.random() * 120 + 60,
        len: Math.floor(Math.random() * 20) + 8,
        opacity: Math.random() * 0.5 + 0.5
      });
    }
    
    // --- Render Loop ---
    function draw(dt) {
      ctx.fillStyle = '${isDark ? "rgba(3, 3, 8, 0.15)" : "rgba(248, 250, 252, 0.2)"}';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = fontSize + "px 'Courier New', monospace";
      drops.forEach(drop => {
        const x = drop.col * fontSize;
        drop.y += drop.speed * speedMultiplier * dt;
        if (drop.y > canvas.height + 50) {
          drop.y = Math.random() * -200 - 50;
          drop.speed = Math.random() * 120 + 60;
        }
        for (let j = 0; j < drop.len; j++) {
          const cy = drop.y - j * fontSize;
          if (cy < 0 || cy > canvas.height) continue;
          const fade = 1 - j / drop.len;
          const alpha = fade * drop.opacity * ${isDark ? 1 : 0.85};
          ctx.fillStyle = j === 0
            ? '${isDark ? "rgba(180, 255, 180," : "rgba(0, 100, 60,"}' + Math.min(alpha + 0.3, 1).toFixed(2) + ')'
            : '${isDark ? "rgba(0, 200, 70," : "rgba(0, 120, 50,"}' + alpha.toFixed(2) + ')';
          ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, cy);
        }
      });
    }`,
      bokeh: `
    // --- Simulation Setup ---
    const orbs = [];
    for (let i = 0; i < 50; i++) {
      const hue = Math.random() * 110 + ${isDark ? 170 : 190};
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(Math.random() * 0.5 + 0.1),
        size: Math.random() * 42 + 8,
        blur: Math.random() * 30 + 10,
        opacity: Math.random() * 0.22 + 0.08,
        color: 'hsla(' + hue + ', 70%, ${isDark ? 65 : 50}%, 1)'
      });
    }
    
    // --- Render Loop ---
    function draw(dt) {
      ctx.fillStyle = '${bgColor}';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      orbs.forEach(orb => {
        orb.x += orb.vx * speedMultiplier * dt * 60;
        orb.y += orb.vy * speedMultiplier * dt * 60;
        if (orb.y < -orb.size * 2) { orb.y = canvas.height + orb.size * 2; orb.x = Math.random() * canvas.width; }
        if (orb.x < -orb.size * 2) orb.x = canvas.width + orb.size * 2;
        if (orb.x > canvas.width + orb.size * 2) orb.x = -orb.size * 2;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.size, 0, Math.PI * 2);
        ctx.fillStyle = orb.color.replace('1)', orb.opacity.toFixed(2) + ')');
        ctx.shadowColor = orb.color;
        ctx.shadowBlur = orb.blur;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      ctx.restore();
    }`,
      galaxy: `
    // --- Simulation Setup ---
    const stars = [];
    const count = 1200;
    for (let i = 0; i < count; i++) {
      const arm = Math.floor(Math.random() * 3);
      const armOffset = (arm * Math.PI * 2) / 3;
      const maxR = Math.min(canvas.width, canvas.height) * 0.42;
      const hue = Math.random() * 90 + ${isDark ? 190 : 200};
      const light = Math.random() * 25 + ${isDark ? 55 : 35};
      const alpha = Math.random() * 0.5 + 0.4;
      stars.push({
        orbitRadius: Math.random() * maxR + 10,
        orbitAngle: armOffset + (Math.random() - 0.5),
        orbitSpeed: Math.random() * 0.3 + 0.1,
        size: Math.random() * 1.7 + 0.5,
        color: 'hsla(' + hue + ', ${isDark ? 80 : 70}%, ' + light + '%, ' + alpha.toFixed(2) + ')'
      });
    }
    
    // --- Render Loop ---
    function draw(dt) {
      ctx.fillStyle = '${bgColor}';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const gcx = canvas.width / 2;
      const gcy = canvas.height / 2;
      
      stars.forEach(star => {
        star.orbitAngle += (star.orbitSpeed / (star.orbitRadius * 0.1 + 10)) * speedMultiplier * dt;
        const angle = star.orbitAngle + star.orbitRadius * 0.008;
        const px = gcx + Math.cos(angle) * star.orbitRadius;
        const py = gcy + Math.sin(angle) * star.orbitRadius;
        if (px < -10 || px > canvas.width + 10 || py < -10 || py > canvas.height + 10) return;
        ctx.beginPath();
        ctx.arc(px, py, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
      });
      
      const gradient = ctx.createRadialGradient(gcx, gcy, 0, gcx, gcy, 60);
      gradient.addColorStop(0, '${isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(100, 80, 200, 0.12)"}');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(gcx, gcy, 60, 0, Math.PI * 2);
      ctx.fill();
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
      background-color: ${bgColor};
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
      background: ${cardBg};
      border: 1px solid ${cardBorder};
      backdrop-filter: blur(16px);
      border-radius: 20px;
      padding: 16px 24px;
      z-index: 10;
      color: ${textColor};
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    }
    .slider-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    label { font-size: 14px; font-weight: 500; color: ${subtextColor}; }
    input[type=range] {
      accent-color: ${primaryGlow};
      width: 150px;
      cursor: pointer;
    }
  </style>
</head>
<body>

  <canvas id="bgCanvas"></canvas>

  <div class="overlay-controls">
    <div style="text-align: left;">
      <h4 style="margin: 0; font-size: 16px; font-weight: 700; color: ${textColor}">${this.activeAnim()?.name}</h4>
      <p style="margin: 0; font-size: 11px; color: ${subtextColor}; text-transform: uppercase; letter-spacing: 0.05em;">Interactive Ambient Background</p>
    </div>
    <div style="width: 1px; height: 30px; background: ${cardBorder}"></div>
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
