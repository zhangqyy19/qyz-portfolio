const fs = require('fs');
const zlib = require('zlib');
const buf = fs.readFileSync('public/favicon.ico');
let offset = 8;
let width, height, bitDepth, colorType;
let idatBuffers = [];
while (offset < buf.length) {
  const len = buf.readUInt32BE(offset);
  const type = buf.slice(offset + 4, offset + 8).toString('ascii');
  if (type === 'IHDR') {
    width = buf.readUInt32BE(offset + 8);
    height = buf.readUInt32BE(offset + 12);
    bitDepth = buf[offset + 16];
    colorType = buf[offset + 17];
  }
  if (type === 'IDAT') {
    idatBuffers.push(buf.slice(offset + 8, offset + 8 + len));
  }
  if (type === 'IEND') break;
  offset += 12 + len;
}
console.log('Dimensions:', width, 'x', height, 'colorType:', colorType);
const compressed = Buffer.concat(idatBuffers);
const raw = zlib.inflateSync(compressed);
const bpp = colorType === 6 ? 4 : 3;
const stride = width * bpp;
const rowSize = 1 + stride;

// Unfilter PNG rows
const pixels = Buffer.alloc(height * stride);
function paethPredictor(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

for (let y = 0; y < height; y++) {
  const filterType = raw[y * rowSize];
  const srcRow = y * rowSize + 1;
  const dstRow = y * stride;
  for (let x = 0; x < stride; x++) {
    const rawByte = raw[srcRow + x];
    const a = x >= bpp ? pixels[dstRow + x - bpp] : 0;
    const b = y > 0 ? pixels[(y - 1) * stride + x] : 0;
    const c = (x >= bpp && y > 0) ? pixels[(y - 1) * stride + x - bpp] : 0;
    let val;
    switch (filterType) {
      case 0: val = rawByte; break;
      case 1: val = (rawByte + a) & 0xff; break;
      case 2: val = (rawByte + b) & 0xff; break;
      case 3: val = (rawByte + Math.floor((a + b) / 2)) & 0xff; break;
      case 4: val = (rawByte + paethPredictor(a, b, c)) & 0xff; break;
      default: val = rawByte;
    }
    pixels[dstRow + x] = val;
  }
}

const colors = {};
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const px = y * stride + x * bpp;
    const r = pixels[px], g = pixels[px+1], b2 = pixels[px+2];
    const a = bpp === 4 ? pixels[px+3] : 255;
    if (a < 128) continue;
    const hex = '#' + r.toString(16).padStart(2,'0') + g.toString(16).padStart(2,'0') + b2.toString(16).padStart(2,'0');
    colors[hex] = (colors[hex]||0) + 1;
  }
}
const sorted = Object.entries(colors).sort((a2,b2) => b2[1] - a2[1]);
sorted.slice(0, 25).forEach(([c, n]) => console.log(c, n));