import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const OUT_DIR = path.resolve('public/videos');
fs.mkdirSync(OUT_DIR, { recursive: true });

const TMP_DIR = path.resolve('/tmp/video_frames');
fs.mkdirSync(TMP_DIR, { recursive: true });

const WIDTH = 960;
const HEIGHT = 540;
const FPS = 20;
const DURATION = 3; // 3 second seamless loop
const TOTAL_FRAMES = FPS * DURATION; // 60 frames

console.log(`Generating optimized ${TOTAL_FRAMES} frames per video...`);

function getPhase(f) {
  return (f / TOTAL_FRAMES) * 2 * Math.PI;
}

// 1. HERO: Dreamy Celestial Sky & Drifting Clouds
function generateHeroFrame(f) {
  const p = getPhase(f);
  let stars = '';
  for (let i = 0; i < 35; i++) {
    const sx = (i * 137.5) % WIDTH;
    const sy = (i * 93.7) % (HEIGHT * 0.7);
    const r = 1.2 + Math.sin(p * 2 + i) * 0.8;
    const op = 0.3 + 0.6 * Math.abs(Math.sin(p + i * 0.5));
    stars += `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${Math.max(0.5, r).toFixed(1)}" fill="#c084fc" opacity="${op.toFixed(2)}"/>`;
  }

  let clouds = '';
  const cloudData = [
    { y: 340, rx: 220, ry: 90, color: '#9333ea', op: 0.35 },
    { y: 390, rx: 260, ry: 110, color: '#c026d3', op: 0.28 },
    { y: 300, rx: 180, ry: 75, color: '#06b6d4', op: 0.25 },
    { y: 440, rx: 320, ry: 130, color: '#7c3aed', op: 0.40 },
  ];

  cloudData.forEach((cd, idx) => {
    const shift = (Math.sin(p) * 40 * (idx + 1) + (idx * 200)) % WIDTH;
    for (let c = -1; c <= 2; c++) {
      const cx = (shift + c * 320 + WIDTH) % (WIDTH + 320) - 80;
      clouds += `
        <ellipse cx="${cx.toFixed(1)}" cy="${cd.y}" rx="${cd.rx}" ry="${cd.ry}" fill="${cd.color}" opacity="${cd.op}"/>
        <circle cx="${(cx - cd.rx * 0.4).toFixed(1)}" cy="${cd.y - 20}" r="${(cd.ry * 0.8).toFixed(1)}" fill="${cd.color}" opacity="${cd.op}"/>
        <circle cx="${(cx + cd.rx * 0.4).toFixed(1)}" cy="${cd.y - 25}" r="${(cd.ry * 0.75).toFixed(1)}" fill="${cd.color}" opacity="${cd.op}"/>
      `;
    }
  });

  // Glowing sparkle cross stars
  let sparkles = '';
  for (let j = 0; j < 6; j++) {
    const jx = (WIDTH * 0.5) + Math.cos(p + j * 1.0) * (180 + j * 30);
    const jy = (HEIGHT * 0.4) + Math.sin(p * 2 + j) * (60 + j * 15);
    const op = (0.4 + 0.5 * Math.sin(p * 2 + j)).toFixed(2);
    sparkles += `
      <circle cx="${jx.toFixed(1)}" cy="${jy.toFixed(1)}" r="10" fill="#38bdf8" opacity="0.3"/>
      <path d="M ${jx.toFixed(1)} ${(jy - 12).toFixed(1)} L ${jx.toFixed(1)} ${(jy + 12).toFixed(1)} M ${(jx - 12).toFixed(1)} ${jy.toFixed(1)} L ${(jx + 12).toFixed(1)} ${jy.toFixed(1)}" stroke="#ffffff" stroke-width="2" opacity="${op}"/>
    `;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
      <defs>
        <radialGradient id="skyGrad" cx="50%" cy="30%" r="80%">
          <stop offset="0%" stop-color="#3b0764"/>
          <stop offset="45%" stop-color="#1e1035"/>
          <stop offset="85%" stop-color="#0b021a"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#skyGrad)"/>
      ${stars}
      ${clouds}
      ${sparkles}
    </svg>
  `;
}

// 2. SERVICES: Playful Childcare, Toy Blocks, Hearts & Circles
function generateServicesFrame(f) {
  const p = getPhase(f);
  let toys = '';
  const items = [
    { type: 'block', color: '#ec4899', size: 44, x: 160, y: 220, rot: 15 },
    { type: 'block', color: '#06b6d4', size: 52, x: 380, y: 360, rot: -20 },
    { type: 'circle', color: '#a855f7', size: 36, x: 640, y: 190 },
    { type: 'star', color: '#eab308', size: 32, x: 820, y: 290 },
    { type: 'heart', color: '#f43f5e', size: 30, x: 260, y: 130 },
    { type: 'block', color: '#10b981', size: 40, x: 740, y: 420, rot: 35 },
    { type: 'circle', color: '#f97316', size: 30, x: 500, y: 120 },
  ];

  items.forEach((item, i) => {
    const floatY = (item.y + Math.sin(p + i * 1.2) * 22).toFixed(1);
    const floatX = (item.x + Math.cos(p * 0.8 + i) * 15).toFixed(1);
    const curRot = ((item.rot || 0) + Math.sin(p + i) * 10).toFixed(1);

    if (item.type === 'block') {
      toys += `
        <g transform="translate(${floatX}, ${floatY}) rotate(${curRot})">
          <rect x="${-item.size/2}" y="${-item.size/2}" width="${item.size}" height="${item.size}" rx="10" fill="${item.color}" opacity="0.35" stroke="#ffffff" stroke-width="2" stroke-opacity="0.4"/>
          <circle cx="0" cy="0" r="${item.size/4}" fill="#ffffff" opacity="0.35"/>
        </g>
      `;
    } else if (item.type === 'circle') {
      toys += `
        <circle cx="${floatX}" cy="${floatY}" r="${item.size}" fill="${item.color}" opacity="0.35" stroke="#ffffff" stroke-width="2" stroke-opacity="0.35"/>
      `;
    } else if (item.type === 'star') {
      toys += `
        <g transform="translate(${floatX}, ${floatY}) rotate(${curRot})">
          <polygon points="0,-${item.size} ${item.size*0.3},-${item.size*0.3} ${item.size},0 ${item.size*0.3},${item.size*0.3} 0,${item.size} -${item.size*0.3},${item.size*0.3} -${item.size},0 -${item.size*0.3},-${item.size*0.3}" fill="${item.color}" opacity="0.38"/>
        </g>
      `;
    } else if (item.type === 'heart') {
      toys += `
        <g transform="translate(${floatX}, ${floatY}) scale(1.2)">
          <path d="M 0,-8 C -8,-20 -24,-4 0,14 C 24,-4 8,-20 0,-8 Z" fill="${item.color}" opacity="0.38"/>
        </g>
      `;
    }
  });

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
      <defs>
        <radialGradient id="bgChild" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#1e1035"/>
          <stop offset="60%" stop-color="#110524"/>
          <stop offset="100%" stop-color="#0a0216"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bgChild)"/>
      ${toys}
    </svg>
  `;
}

// 3. PASSPORT: Airplane, Global Latitude Rings & Flight Path
function generatePassportFrame(f) {
  const p = getPhase(f);
  let globeLines = '';
  for (let lat = 120; lat <= 440; lat += 60) {
    const rx = 400 + Math.sin(p) * 15;
    globeLines += `
      <ellipse cx="${WIDTH/2}" cy="${lat}" rx="${rx.toFixed(1)}" ry="26" fill="none" stroke="#06b6d4" stroke-width="1.2" stroke-opacity="0.22" stroke-dasharray="6 8"/>
    `;
  }

  const planeX = (WIDTH * 0.5) + Math.sin(p) * 280;
  const planeY = 220 + Math.cos(p * 2) * 40;
  const planeTilt = Math.cos(p) * 14;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
      <defs>
        <linearGradient id="flightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#081e3a"/>
          <stop offset="50%" stop-color="#140e36"/>
          <stop offset="100%" stop-color="#09031d"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#flightGrad)"/>
      ${globeLines}

      <!-- Contrail path -->
      <path d="M 0 ${(planeY + 30).toFixed(1)} Q ${(planeX * 0.5).toFixed(1)} ${(planeY + 50).toFixed(1)} ${planeX.toFixed(1)} ${planeY.toFixed(1)}" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-opacity="0.3" stroke-dasharray="8 6"/>

      <!-- Airplane Symbol -->
      <g transform="translate(${planeX.toFixed(1)}, ${planeY.toFixed(1)}) rotate(${(planeTilt + 90).toFixed(1)}) scale(0.8)">
        <circle cx="0" cy="0" r="35" fill="#0284c7" opacity="0.3"/>
        <path d="M 0,-30 L 6,-6 L 35,6 L 35,12 L 6,8 L 6,24 L 16,30 L 16,35 L 0,32 L -16,35 L -16,30 L -6,24 L -6,8 L -35,12 L -35,6 L -6,-6 Z" fill="#38bdf8" opacity="0.75"/>
      </g>
    </svg>
  `;
}

// 4. HAIR & LOCS: Flowing braided curves, organic strands & golden beads
function generateHairFrame(f) {
  const p = getPhase(f);
  let strands = '';
  for (let s = 0; s < 8; s++) {
    const baseX = 100 + s * 110;
    const hue = s % 2 === 0 ? '#d97706' : '#a855f7';
    let pathD = `M ${baseX} 0`;
    for (let y = 80; y <= HEIGHT; y += 80) {
      const offsetX = Math.sin(p + y * 0.009 + s * 0.7) * 35;
      pathD += ` Q ${baseX + offsetX} ${y - 40} ${baseX + offsetX * 0.8} ${y}`;
    }
    strands += `
      <path d="${pathD}" fill="none" stroke="${hue}" stroke-width="${3 + (s % 3)}" stroke-opacity="0.32" stroke-linecap="round"/>
    `;

    const beadY = (150 + s * 45 + Math.sin(p + s) * 60) % (HEIGHT - 80) + 40;
    const beadX = baseX + Math.sin(p + beadY * 0.009 + s * 0.7) * 35;
    strands += `
      <circle cx="${beadX.toFixed(1)}" cy="${beadY.toFixed(1)}" r="6" fill="#fbbf24" opacity="0.6"/>
      <circle cx="${beadX.toFixed(1)}" cy="${beadY.toFixed(1)}" r="2.5" fill="#ffffff" opacity="0.85"/>
    `;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
      <defs>
        <radialGradient id="hairBg" cx="50%" cy="30%" r="80%">
          <stop offset="0%" stop-color="#2d0a22"/>
          <stop offset="60%" stop-color="#17031e"/>
          <stop offset="100%" stop-color="#0b0114"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#hairBg)"/>
      ${strands}
    </svg>
  `;
}

// 5. CALCULATOR: Rotating time rings, clock gears & scheduling nodes
function generateCalcFrame(f) {
  const p = getPhase(f);
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;

  let rings = '';
  for (let r = 100; r <= 240; r += 45) {
    rings += `
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#06b6d4" stroke-width="1.4" stroke-opacity="0.25" stroke-dasharray="8 12"/>
    `;
  }

  let nodes = '';
  for (let n = 0; n < 10; n++) {
    const ang = (n / 10) * 2 * Math.PI + p;
    const nx = cx + Math.cos(ang) * 170;
    const ny = cy + Math.sin(ang) * 170;
    nodes += `
      <circle cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="5" fill="#c084fc" opacity="0.5"/>
    `;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
      <defs>
        <radialGradient id="calcBg" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#0c233c"/>
          <stop offset="60%" stop-color="#09142b"/>
          <stop offset="100%" stop-color="#060919"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#calcBg)"/>
      ${rings}
      ${nodes}
      <circle cx="${cx}" cy="${cy}" r="${(50 + Math.sin(p) * 15).toFixed(1)}" fill="none" stroke="#38bdf8" stroke-width="2" stroke-opacity="0.35"/>
    </svg>
  `;
}

// 6. ADVENTURE: Sunshine rays, floating leaves & park breeze
function generateAdventureFrame(f) {
  const p = getPhase(f);
  let sunbeams = '';
  const sunX = WIDTH * 0.85;
  const sunY = 60;
  for (let b = 0; b < 10; b++) {
    const angle = (b / 10) * Math.PI * 2 + p * 0.3;
    const x2 = sunX + Math.cos(angle) * 700;
    const y2 = sunY + Math.sin(angle) * 700;
    sunbeams += `
      <line x1="${sunX}" y1="${sunY}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#facc15" stroke-width="28" stroke-opacity="0.06"/>
    `;
  }

  let leaves = '';
  for (let l = 0; l < 12; l++) {
    const lx = (l * 80 + Math.sin(p + l) * 40 + p * 25) % WIDTH;
    const ly = (l * 45 + Math.cos(p + l * 0.7) * 30 + HEIGHT * 0.35) % HEIGHT;
    const rot = (Math.sin(p + l) * 40).toFixed(1);
    leaves += `
      <g transform="translate(${lx.toFixed(1)}, ${ly.toFixed(1)}) rotate(${rot})">
        <path d="M 0,-12 C 10,-12 12,8 0,18 C -12,8 -10,-12 0,-12 Z" fill="#10b981" opacity="0.4"/>
      </g>
    `;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
      <defs>
        <radialGradient id="advBg" cx="80%" cy="20%" r="85%">
          <stop offset="0%" stop-color="#064e3b"/>
          <stop offset="50%" stop-color="#022c22"/>
          <stop offset="100%" stop-color="#05141b"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#advBg)"/>
      ${sunbeams}
      ${leaves}
    </svg>
  `;
}

// 7. ABOUT FOUNDER: Warm pulsing hearts & loving care ripples
function generateAboutFrame(f) {
  const p = getPhase(f);
  const cx = WIDTH * 0.5;
  const cy = HEIGHT * 0.5;

  let heartRings = '';
  for (let h = 0; h < 4; h++) {
    const scale = (1 + ((p + h * (Math.PI / 2)) % (Math.PI * 2)) * 0.45).toFixed(2);
    const op = Math.max(0, 0.42 - scale * 0.1).toFixed(2);
    heartRings += `
      <g transform="translate(${cx}, ${cy}) scale(${scale})">
        <path d="M 0,-24 C -24,-56 -72,-16 0,48 C 72,-16 24,-56 0,-24 Z" fill="none" stroke="#ec4899" stroke-width="2" stroke-opacity="${op}"/>
      </g>
    `;
  }

  let bokeh = '';
  for (let b = 0; b < 8; b++) {
    const bx = cx + Math.sin(p + b * 0.8) * (200 + b * 25);
    const by = cy + Math.cos(p * 1.2 + b) * (110 + b * 15);
    const br = 18 + Math.sin(p + b) * 6;
    bokeh += `
      <circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="${br.toFixed(1)}" fill="#f43f5e" opacity="0.25"/>
    `;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
      <defs>
        <radialGradient id="aboutBg" cx="50%" cy="50%" r="75%">
          <stop offset="0%" stop-color="#3b0728"/>
          <stop offset="60%" stop-color="#1f041b"/>
          <stop offset="100%" stop-color="#0b0114"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#aboutBg)"/>
      ${bokeh}
      ${heartRings}
    </svg>
  `;
}

// 8. TESTIMONIALS: Five-star rating stars drifting upward
function generateTestimonialsFrame(f) {
  const p = getPhase(f);
  let stars = '';
  for (let s = 0; s < 14; s++) {
    const sx = (s * 70 + 35) % WIDTH;
    const sy = (HEIGHT - ((f * 5 + s * 55) % (HEIGHT + 80)));
    const rot = ((p * 50 + s * 30) % 360).toFixed(1);
    const sz = 14 + (s % 3) * 5;
    stars += `
      <g transform="translate(${sx}, ${sy}) rotate(${rot})">
        <polygon points="0,-${sz} ${sz*0.3},-${sz*0.3} ${sz},0 ${sz*0.3},${sz*0.3} 0,${sz} -${sz*0.3},${sz*0.3} -${sz},0 -${sz*0.3},-${sz*0.3}" fill="#fbbf24" opacity="0.4"/>
      </g>
    `;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
      <defs>
        <radialGradient id="testBg" cx="50%" cy="40%" r="80%">
          <stop offset="0%" stop-color="#2a0d45"/>
          <stop offset="60%" stop-color="#140529"/>
          <stop offset="100%" stop-color="#09011a"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#testBg)"/>
      ${stars}
    </svg>
  `;
}

// 9. FOOTER: Gentle starlight & ambient night sky
function generateFooterFrame(f) {
  const p = getPhase(f);
  let stars = '';
  for (let s = 0; s < 30; s++) {
    const sx = (s * 83) % WIDTH;
    const sy = (s * 47) % HEIGHT;
    const op = (0.2 + 0.6 * Math.abs(Math.sin(p + s))).toFixed(2);
    stars += `
      <circle cx="${sx}" cy="${sy}" r="${(1.5 + (s % 3) * 0.7).toFixed(1)}" fill="#c084fc" opacity="${op}"/>
    `;
  }
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
      <defs>
        <radialGradient id="footBg" cx="50%" cy="50%" r="80%">
          <stop offset="0%" stop-color="#150529"/>
          <stop offset="100%" stop-color="#080114"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#footBg)"/>
      ${stars}
    </svg>
  `;
}

function buildVideo(sectionName, generatorFn) {
  const secDir = path.join(TMP_DIR, sectionName);
  fs.mkdirSync(secDir, { recursive: true });

  console.log(`Writing frames for ${sectionName}...`);
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const svg = generatorFn(i);
    const frameNum = String(i).padStart(4, '0');
    fs.writeFileSync(path.join(secDir, `frame_${frameNum}.svg`), svg);
  }

  const outMp4 = path.join(OUT_DIR, `${sectionName}.mp4`);
  console.log(`Encoding ${outMp4}...`);
  const cmd = `ffmpeg -y -framerate ${FPS} -i "${path.join(secDir, 'frame_%04d.svg')}" -c:v libx264 -pix_fmt yuv420p -crf 20 -preset ultrafast -movflags +faststart "${outMp4}"`;
  execSync(cmd, { stdio: 'inherit' });
  fs.rmSync(secDir, { recursive: true, force: true });
}

buildVideo('hero-clouds', generateHeroFrame);
buildVideo('services-childcare', generateServicesFrame);
buildVideo('passport-travel', generatePassportFrame);
buildVideo('hair-locs', generateHairFrame);
buildVideo('pricing-calculator', generateCalcFrame);
buildVideo('adventure-map', generateAdventureFrame);
buildVideo('about-founder', generateAboutFrame);
buildVideo('testimonials', generateTestimonialsFrame);
buildVideo('footer-stars', generateFooterFrame);

console.log('ALL SECTION BACKGROUND VIDEOS CREATED SUCCESSFULLY!');
