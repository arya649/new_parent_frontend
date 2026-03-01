/**
 * Generate PWA icons — simple branded green squares with "SA" text
 * Uses only built-in Node.js modules (no canvas/sharp needed)
 */
const fs = require('fs')
const zlib = require('zlib')
const path = require('path')

// CRC32 lookup table
const crcTable = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()

function crc32(buf) {
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeB = Buffer.from(type)
  const crcVal = crc32(Buffer.concat([typeB, data]))
  const crcB = Buffer.alloc(4)
  crcB.writeUInt32BE(crcVal, 0)
  return Buffer.concat([len, typeB, data, crcB])
}

function createPNG(size) {
  // Colors
  const bg = { r: 0x16, g: 0xa3, b: 0x4a }       // Brand green
  const fg = { r: 0xff, g: 0xff, b: 0xff }         // White

  // Create RGBA pixel data
  const rawData = Buffer.alloc(size * (1 + size * 4))

  // Draw a rounded-corner-ish green square with a white graduation cap shape
  const center = size / 2
  const cornerR = size * 0.15

  for (let y = 0; y < size; y++) {
    const rowOffset = y * (1 + size * 4)
    rawData[rowOffset] = 0 // filter byte (None)

    for (let x = 0; x < size; x++) {
      const px = rowOffset + 1 + x * 4

      // Check if inside rounded rect
      let inside = true
      // Top-left corner
      if (x < cornerR && y < cornerR) {
        inside = Math.hypot(x - cornerR, y - cornerR) <= cornerR
      }
      // Top-right corner
      if (x > size - cornerR && y < cornerR) {
        inside = Math.hypot(x - (size - cornerR), y - cornerR) <= cornerR
      }
      // Bottom-left corner
      if (x < cornerR && y > size - cornerR) {
        inside = Math.hypot(x - cornerR, y - (size - cornerR)) <= cornerR
      }
      // Bottom-right corner
      if (x > size - cornerR && y > size - cornerR) {
        inside = Math.hypot(x - (size - cornerR), y - (size - cornerR)) <= cornerR
      }

      if (!inside) {
        rawData[px] = 0; rawData[px + 1] = 0; rawData[px + 2] = 0; rawData[px + 3] = 0
        continue
      }

      // Draw graduation cap shape (simplified geometric)
      const nx = (x - center) / size  // normalized -0.5 to 0.5
      const ny = (y - center) / size

      let isIcon = false

      // Main diamond/cap top (wide triangle)
      if (ny >= -0.12 && ny <= 0.05) {
        const capWidth = 0.35 - (ny + 0.12) * 0.6
        if (Math.abs(nx) <= capWidth) isIcon = true
      }

      // Cap brim (horizontal band)
      if (ny >= 0.05 && ny <= 0.10 && Math.abs(nx) <= 0.28) isIcon = true

      // Tassel line (vertical line from top)
      if (nx >= 0.16 && nx <= 0.19 && ny >= -0.08 && ny <= 0.22) isIcon = true

      // Tassel bob (small square at bottom of tassel)
      if (nx >= 0.14 && nx <= 0.21 && ny >= 0.18 && ny <= 0.25) isIcon = true

      const c = isIcon ? fg : bg
      rawData[px] = c.r
      rawData[px + 1] = c.g
      rawData[px + 2] = c.b
      rawData[px + 3] = 255 // alpha
    }
  }

  const compressed = zlib.deflateSync(rawData)

  // IHDR
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 6   // RGBA
  ihdr[10] = 0  // compression
  ihdr[11] = 0  // filter
  ihdr[12] = 0  // interlace

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0)),
  ])
}

// Generate
const publicDir = path.join(__dirname, '..', 'public')
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })

fs.writeFileSync(path.join(publicDir, 'pwa-192.png'), createPNG(192))
fs.writeFileSync(path.join(publicDir, 'pwa-512.png'), createPNG(512))

console.log('✅ Created public/pwa-192.png (192×192)')
console.log('✅ Created public/pwa-512.png (512×512)')
