/**
 * Copyright (C) 2010-2015 Graham Breach
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * TagCanvas 2.9
 * For more information, please contact <graham@goat1000.com>
 */
(function () {
  let i; let j; const { abs } = Math; const { sin } = Math; const { cos } = Math; const { max } = Math;
  const { min } = Math; const { ceil } = Math; const { sqrt } = Math; const { pow } = Math;
  const hexlookup3 = {}; const hexlookup2 = {}; const hexlookup1 = {
    0: '0,',
    1: '17,',
    2: '34,',
    3: '51,',
    4: '68,',
    5: '85,',
    6: '102,',
    7: '119,',
    8: '136,',
    9: '153,',
    a: '170,',
    A: '170,',
    b: '187,',
    B: '187,',
    c: '204,',
    C: '204,',
    d: '221,',
    D: '221,',
    e: '238,',
    E: '238,',
    f: '255,',
    F: '255,',
  }; let Oproto; let Tproto; let TCproto; let Mproto; let Vproto; let TSproto; let TCVproto;
  const doc = document; let ocanvas; const
    handlers = {};
  for (i = 0; i < 256; ++i) {
    j = i.toString(16);
    if (i < 16) j = `0${j}`;
    hexlookup2[j] = hexlookup2[j.toUpperCase()] = `${i.toString()},`;
  }
  function Defined(d) {
    return typeof d !== 'undefined';
  }
  function IsObject(o) {
    return typeof o === 'object' && o != null;
  }
  function Clamp(v, mn, mx) {
    return isNaN(v) ? mx : min(mx, max(mn, v));
  }
  function Nop() {
    return false;
  }
  function TimeNow() {
    return new Date().valueOf();
  }
  function SortList(l, f) {
    const nl = []; const tl = l.length; let
      i;
    for (i = 0; i < tl; ++i) nl.push(l[i]);
    nl.sort(f);
    return nl;
  }
  function Shuffle(a) {
    let i = a.length - 1; let t; let
      p;
    while (i) {
      p = ~~(Math.random() * i);
      t = a[i];
      a[i] = a[p];
      a[p] = t;
      --i;
    }
  }
  function Vector(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  Vproto = Vector.prototype;
  Vproto.length = function () {
    return sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  };
  Vproto.dot = function (v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  };
  Vproto.cross = function (v) {
    const x = this.y * v.z - this.z * v.y;
    const y = this.z * v.x - this.x * v.z;
    const z = this.x * v.y - this.y * v.x;
    return new Vector(x, y, z);
  };
  Vproto.angle = function (v) {
    const dot = this.dot(v); let
      ac;
    if (dot == 0) return Math.PI / 2.0;
    ac = dot / (this.length() * v.length());
    if (ac >= 1) return 0;
    if (ac <= -1) return Math.PI;
    return Math.acos(ac);
  };
  Vproto.unit = function () {
    const l = this.length();
    return new Vector(this.x / l, this.y / l, this.z / l);
  };
  function MakeVector(lg, lt) {
    lt = lt * Math.PI / 180;
    lg = lg * Math.PI / 180;
    const x = sin(lg) * cos(lt); const y = -sin(lt); const
      z = -cos(lg) * cos(lt);
    return new Vector(x, y, z);
  }
  function Matrix(a) {
    this[1] = { 1: a[0], 2: a[1], 3: a[2] };
    this[2] = { 1: a[3], 2: a[4], 3: a[5] };
    this[3] = { 1: a[6], 2: a[7], 3: a[8] };
  }
  Mproto = Matrix.prototype;
  Matrix.Identity = function () {
    return new Matrix([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  };
  Matrix.Rotation = function (angle, u) {
    const sina = sin(angle); const cosa = cos(angle); const
      mcos = 1 - cosa;
    return new Matrix([
      cosa + pow(u.x, 2) * mcos, u.x * u.y * mcos - u.z * sina, u.x * u.z * mcos + u.y * sina,
      u.y * u.x * mcos + u.z * sina, cosa + pow(u.y, 2) * mcos, u.y * u.z * mcos - u.x * sina,
      u.z * u.x * mcos - u.y * sina, u.z * u.y * mcos + u.x * sina, cosa + pow(u.z, 2) * mcos,
    ]);
  };
  Mproto.mul = function (m) {
    const a = []; let i; let j; const
      mmatrix = (m.xform ? 1 : 0);
    for (i = 1; i <= 3; ++i) {
      for (j = 1; j <= 3; ++j) {
        if (mmatrix) {
          a.push(this[i][1] * m[1][j]
              + this[i][2] * m[2][j]
              + this[i][3] * m[3][j]);
        } else a.push(this[i][j] * m);
      }
    }
    return new Matrix(a);
  };
  Mproto.xform = function (p) {
    const a = {}; const { x } = p; const { y } = p; const
      { z } = p;
    a.x = x * this[1][1] + y * this[2][1] + z * this[3][1];
    a.y = x * this[1][2] + y * this[2][2] + z * this[3][2];
    a.z = x * this[1][3] + y * this[2][3] + z * this[3][3];
    return a;
  };
  function PointsOnSphere(n, xr, yr, zr, magic) {
    let i; let y; let r; let phi; const pts = []; const off = 2 / n; let
      inc;
    inc = Math.PI * (3 - sqrt(5) + (parseFloat(magic) ? parseFloat(magic) : 0));
    for (i = 0; i < n; ++i) {
      y = i * off - 1 + (off / 2);
      r = sqrt(1 - y * y);
      phi = i * inc;
      pts.push([cos(phi) * r * xr, y * yr, sin(phi) * r * zr]);
    }
    return pts;
  }
  function Cylinder(n, o, xr, yr, zr, magic) {
    let phi; const pts = []; const off = 2 / n; let inc; let i; let j; let k; let
      l;
    inc = Math.PI * (3 - sqrt(5) + (parseFloat(magic) ? parseFloat(magic) : 0));
    for (i = 0; i < n; ++i) {
      j = i * off - 1 + (off / 2);
      phi = i * inc;
      k = cos(phi);
      l = sin(phi);
      pts.push(o ? [j * xr, k * yr, l * zr] : [k * xr, j * yr, l * zr]);
    }
    return pts;
  }
  function Ring(o, n, xr, yr, zr, j) {
    let phi; const pts = []; const inc = Math.PI * 2 / n; let i; let k; let
      l;
    for (i = 0; i < n; ++i) {
      phi = i * inc;
      k = cos(phi);
      l = sin(phi);
      pts.push(o ? [j * xr, k * yr, l * zr] : [k * xr, j * yr, l * zr]);
    }
    return pts;
  }
  function PointsOnCylinderV(n, xr, yr, zr, m) { return Cylinder(n, 0, xr, yr, zr, m); }
  function PointsOnCylinderH(n, xr, yr, zr, m) { return Cylinder(n, 1, xr, yr, zr, m); }
  function PointsOnRingV(n, xr, yr, zr, offset) {
    offset = isNaN(offset) ? 0 : offset * 1;
    return Ring(0, n, xr, yr, zr, offset);
  }
  function PointsOnRingH(n, xr, yr, zr, offset) {
    offset = isNaN(offset) ? 0 : offset * 1;
    return Ring(1, n, xr, yr, zr, offset);
  }
  function CentreImage(t) {
    const i = new Image();
    i.onload = function () {
      const dx = i.width / 2; const
        dy = i.height / 2;
      t.centreFunc = function (c, w, h, cx, cy) {
        c.setTransform(1, 0, 0, 1, 0, 0);
        c.globalAlpha = 1;
        c.drawImage(i, cx - dx, cy - dy);
      };
    };
    i.src = t.centreImage;
  }
  function SetAlpha(c, a) {
    let d = c; let p1; let p2; const
      ae = `${(a * 1).toPrecision(3)})`;
    if (c[0] === '#') {
      if (!hexlookup3[c]) {
        if (c.length === 4) hexlookup3[c] = `rgba(${hexlookup1[c[1]]}${hexlookup1[c[2]]}${hexlookup1[c[3]]}`;
        else hexlookup3[c] = `rgba(${hexlookup2[c.substr(1, 2)]}${hexlookup2[c.substr(3, 2)]}${hexlookup2[c.substr(5, 2)]}`;
      }
      d = hexlookup3[c] + ae;
    } else if (c.substr(0, 4) === 'rgb(' || c.substr(0, 4) === 'hsl(') {
      d = (c.replace('(', 'a(').replace(')', `,${ae}`));
    } else if (c.substr(0, 5) === 'rgba(' || c.substr(0, 5) === 'hsla(') {
      p1 = c.lastIndexOf(',') + 1, p2 = c.indexOf(')');
      a *= parseFloat(c.substring(p1, p2));
      d = `${c.substr(0, p1) + a.toPrecision(3)})`;
    }
    return d;
  }
  function NewCanvas(w, h) {
    // if using excanvas, give up now
    if (window.G_vmlCanvasManager) return null;
    const c = doc.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  }
  // I think all browsers pass this test now...
  function ShadowAlphaBroken() {
    let cv = NewCanvas(3, 3); let c; let
      i;
    if (!cv) return false;
    c = cv.getContext('2d');
    c.strokeStyle = '#000';
    c.shadowColor = '#fff';
    c.shadowBlur = 3;
    c.globalAlpha = 0;
    c.strokeRect(2, 2, 2, 2);
    c.globalAlpha = 1;
    i = c.getImageData(2, 2, 1, 1);
    cv = null;
    return (i.data[0] > 0);
  }
  function SetGradient(c, l, o, g) {
    const gd = c.createLinearGradient(0, 0, l, 0); let
      i;
    for (i in g) gd.addColorStop(1 - i, g[i]);
    c.fillStyle = gd;
    c.fillRect(0, o, l, 1);
  }
  function FindGradientColour(tc, p, r) {
    const l = 1024; let h = 1; let gl = tc.weightGradient; let cv; let c; let i; let
      d;
    if (tc.gCanvas) {
      c = tc.gCanvas.getContext('2d');
      h = tc.gCanvas.height;
    } else {
      if (IsObject(gl[0])) h = gl.length;
      else gl = [gl];
      tc.gCanvas = cv = NewCanvas(l, h);
      if (!cv) return null;
      c = cv.getContext('2d');
      for (i = 0; i < h; ++i) SetGradient(c, l, i, gl[i]);
    }
    r = max(min(r || 0, h - 1), 0);
    d = c.getImageData(~~((l - 1) * p), r, 1, 1).data;
    return `rgba(${d[0]},${d[1]},${d[2]},${d[3] / 255})`;
  }
  function TextSet(ctxt, font, colour, strings, padx, pady, shadowColour,
    shadowBlur, shadowOffsets, maxWidth, widths, align) {
    const xo = padx + (shadowBlur || 0)
        + (shadowOffsets.length && shadowOffsets[0] < 0 ? abs(shadowOffsets[0]) : 0);
    let yo = pady + (shadowBlur || 0)
        + (shadowOffsets.length && shadowOffsets[1] < 0 ? abs(shadowOffsets[1]) : 0); let i; let
      xc;
    ctxt.font = font;
    ctxt.textBaseline = 'top';
    ctxt.fillStyle = colour;
    shadowColour && (ctxt.shadowColor = shadowColour);
    shadowBlur && (ctxt.shadowBlur = shadowBlur);
    shadowOffsets.length && (ctxt.shadowOffsetX = shadowOffsets[0],
    ctxt.shadowOffsetY = shadowOffsets[1]);
    for (i = 0; i < strings.length; ++i) {
      xc = 0;
      if (widths) {
        if (align == 'right') {
          xc = maxWidth - widths[i];
        } else if (align == 'centre') {
          xc = (maxWidth - widths[i]) / 2;
        }
      }
      ctxt.fillText(strings[i], xo + xc, yo);
      yo += parseInt(font);
    }
  }
  function RRect(c, x, y, w, h, r, s) {
    if (r) {
      c.beginPath();
      c.moveTo(x, y + h - r);
      c.arcTo(x, y, x + r, y, r);
      c.arcTo(x + w, y, x + w, y + r, r);
      c.arcTo(x + w, y + h, x + w - r, y + h, r);
      c.arcTo(x, y + h, x, y + h - r, r);
      c.closePath();
      c[s ? 'stroke' : 'fill']();
    } else {
      c[s ? 'strokeRect' : 'fillRect'](x, y, w, h);
    }
  }
  function TextCanvas(strings, font, w, h, maxWidth, stringWidths, align, valign,
    scale) {
    this.strings = strings;
    this.font = font;
    this.width = w;
    this.height = h;
    this.maxWidth = maxWidth;
    this.stringWidths = stringWidths;
    this.align = align;
    this.valign = valign;
    this.scale = scale;
  }
  TCVproto = TextCanvas.prototype;
  TCVproto.SetImage = function (image, w, h, position, padding, align, valign,
    scale) {
    this.image = image;
    this.iwidth = w * this.scale;
    this.iheight = h * this.scale;
    this.ipos = position;
    this.ipad = padding * this.scale;
    this.iscale = scale;
    this.ialign = align;
    this.ivalign = valign;
  };
  TCVproto.Align = function (size, space, a) {
    let pos = 0;
    if (a == 'right' || a == 'bottom') pos = space - size;
    else if (a != 'left' && a != 'top') pos = (space - size) / 2;
    return pos;
  };
  TCVproto.Create = function (colour, bgColour, bgOutline, bgOutlineThickness,
    shadowColour, shadowBlur, shadowOffsets, padding, radius) {
    let cv; let cw; let ch; let c; let x1; let x2; let y1; let y2; let offx; let offy; let ix; let iy; let iw; let ih; let rr;
    const sox = abs(shadowOffsets[0]); const soy = abs(shadowOffsets[1]); let shadowcv; let
      shadowc;
    padding = max(padding, sox + shadowBlur, soy + shadowBlur);
    x1 = 2 * (padding + bgOutlineThickness);
    y1 = 2 * (padding + bgOutlineThickness);
    cw = this.width + x1;
    ch = this.height + y1;
    offx = offy = padding + bgOutlineThickness;

    if (this.image) {
      ix = iy = padding + bgOutlineThickness;
      iw = this.iwidth;
      ih = this.iheight;
      if (this.ipos == 'top' || this.ipos == 'bottom') {
        if (iw < this.width) ix += this.Align(iw, this.width, this.ialign);
        else offx += this.Align(this.width, iw, this.align);
        if (this.ipos == 'top') offy += ih + this.ipad;
        else iy += this.height + this.ipad;
        cw = max(cw, iw + x1);
        ch += ih + this.ipad;
      } else {
        if (ih < this.height) iy += this.Align(ih, this.height, this.ivalign);
        else offy += this.Align(this.height, ih, this.valign);
        if (this.ipos == 'right') ix += this.width + this.ipad;
        else offx += iw + this.ipad;
        cw += iw + this.ipad;
        ch = max(ch, ih + y1);
      }
    }

    cv = NewCanvas(cw, ch);
    if (!cv) return null;
    x1 = y1 = bgOutlineThickness / 2;
    x2 = cw - bgOutlineThickness;
    y2 = ch - bgOutlineThickness;
    rr = min(radius, x2 / 2, y2 / 2);
    c = cv.getContext('2d');
    if (bgColour) {
      c.fillStyle = bgColour;
      RRect(c, x1, y1, x2, y2, rr);
    }
    if (bgOutlineThickness) {
      c.strokeStyle = bgOutline;
      c.lineWidth = bgOutlineThickness;
      RRect(c, x1, y1, x2, y2, rr, true);
    }
    if (shadowBlur || sox || soy) {
      // use a transparent canvas to draw on
      shadowcv = NewCanvas(cw, ch);
      if (shadowcv) {
        shadowc = c;
        c = shadowcv.getContext('2d');
      }
    }

    // don't use TextSet shadow support because it adds space for shadow
    TextSet(c, this.font, colour, this.strings, offx, offy, 0, 0, [],
      this.maxWidth, this.stringWidths, this.align);

    if (this.image) c.drawImage(this.image, ix, iy, iw, ih);

    if (shadowc) {
      // draw the text and image with the added shadow
      c = shadowc;
      shadowColour && (c.shadowColor = shadowColour);
      shadowBlur && (c.shadowBlur = shadowBlur);
      c.shadowOffsetX = shadowOffsets[0];
      c.shadowOffsetY = shadowOffsets[1];
      c.drawImage(shadowcv, 0, 0);
    }
    return cv;
  };
  function ExpandImage(i, w, h) {
    const cv = NewCanvas(w, h); let
      c;
    if (!cv) return null;
    c = cv.getContext('2d');
    c.drawImage(i, (w - i.width) / 2, (h - i.height) / 2);
    return cv;
  }
  function ScaleImage(i, w, h) {
    const cv = NewCanvas(w, h); let
      c;
    if (!cv) return null;
    c = cv.getContext('2d');
    c.drawImage(i, 0, 0, w, h);
    return cv;
  }
  function AddBackgroundToImage(i, w, h, scale, colour, othickness, ocolour,
    padding, radius, ofill) {
    const cw = w + ((2 * padding) + othickness) * scale;
    const ch = h + ((2 * padding) + othickness) * scale;
    const cv = NewCanvas(cw, ch); let c; let x1; let y1; let x2; let y2; let ocanvas; let cc; let
      rr;
    if (!cv) return null;
    othickness *= scale;
    radius *= scale;
    x1 = y1 = othickness / 2;
    x2 = cw - othickness;
    y2 = ch - othickness;
    padding = (padding * scale) + x1; // add space for outline
    c = cv.getContext('2d');
    rr = min(radius, x2 / 2, y2 / 2);
    if (colour) {
      c.fillStyle = colour;
      RRect(c, x1, y1, x2, y2, rr);
    }
    if (othickness) {
      c.strokeStyle = ocolour;
      c.lineWidth = othickness;
      RRect(c, x1, y1, x2, y2, rr, true);
    }

    if (ofill) {
      // use compositing to colour in the image and border
      ocanvas = NewCanvas(cw, ch);
      cc = ocanvas.getContext('2d');
      cc.drawImage(i, padding, padding, w, h);
      cc.globalCompositeOperation = 'source-in';
      cc.fillStyle = ocolour;
      cc.fillRect(0, 0, cw, ch);
      cc.globalCompositeOperation = 'destination-over';
      cc.drawImage(cv, 0, 0);
      cc.globalCompositeOperation = 'source-over';
      c.drawImage(ocanvas, 0, 0);
    } else {
      c.drawImage(i, padding, padding, i.width, i.height);
    }
    return { image: cv, width: cw / scale, height: ch / scale };
  }
  /**
     * Rounds off the corners of an image
     */
  function RoundImage(i, r, iw, ih, s) {
    let cv; let c; let r1 = parseFloat(r); const
      l = max(iw, ih);
    cv = NewCanvas(iw, ih);
    if (!cv) return null;
    if (r.indexOf('%') > 0) r1 = l * r1 / 100;
    else r1 *= s;
    c = cv.getContext('2d');
    c.globalCompositeOperation = 'source-over';
    c.fillStyle = '#fff';
    if (r1 >= l / 2) {
      r1 = min(iw, ih) / 2;
      c.beginPath();
      c.moveTo(iw / 2, ih / 2);
      c.arc(iw / 2, ih / 2, r1, 0, 2 * Math.PI, false);
      c.fill();
      c.closePath();
    } else {
      r1 = min(iw / 2, ih / 2, r1);
      RRect(c, 0, 0, iw, ih, r1, true);
      c.fill();
    }
    c.globalCompositeOperation = 'source-in';
    c.drawImage(i, 0, 0, iw, ih);
    return cv;
  }
  /**
     * Creates a new canvas containing the image and its shadow
     * Returns an object containing the image and its dimensions at z=0
     */
  function AddShadowToImage(i, w, h, scale, sc, sb, so) {
    const sw = abs(so[0]); const sh = abs(so[1]);
    const cw = w + (sw > sb ? sw + sb : sb * 2) * scale;
    const ch = h + (sh > sb ? sh + sb : sb * 2) * scale;
    const xo = scale * ((sb || 0) + (so[0] < 0 ? sw : 0));
    const yo = scale * ((sb || 0) + (so[1] < 0 ? sh : 0)); let cv; let
      c;
    cv = NewCanvas(cw, ch);
    if (!cv) return null;
    c = cv.getContext('2d');
    sc && (c.shadowColor = sc);
    sb && (c.shadowBlur = sb * scale);
    so && (c.shadowOffsetX = so[0] * scale, c.shadowOffsetY = so[1] * scale);
    c.drawImage(i, xo, yo, w, h);
    return { image: cv, width: cw / scale, height: ch / scale };
  }
  function FindTextBoundingBox(s, f, ht) {
    const w = parseInt(s.toString().length * ht); const h = parseInt(ht * 2 * s.length);
    let cv = NewCanvas(w, h); let c; let idata; let w1; let h1; let x; let y; let i; let
      ex;
    if (!cv) return null;
    c = cv.getContext('2d');
    c.fillStyle = '#000';
    c.fillRect(0, 0, w, h);
    TextSet(c, `${ht}px ${f}`, '#fff', s, 0, 0, 0, 0, [], 'centre');

    idata = c.getImageData(0, 0, w, h);
    w1 = idata.width; h1 = idata.height;
    ex = {
      min: { x: w1, y: h1 },
      max: { x: -1, y: -1 },
    };
    for (y = 0; y < h1; ++y) {
      for (x = 0; x < w1; ++x) {
        i = (y * w1 + x) * 4;
        if (idata.data[i + 1] > 0) {
          if (x < ex.min.x) ex.min.x = x;
          if (x > ex.max.x) ex.max.x = x;
          if (y < ex.min.y) ex.min.y = y;
          if (y > ex.max.y) ex.max.y = y;
        }
      }
    }
    // device pixels might not be css pixels
    if (w1 != w) {
      ex.min.x *= (w / w1);
      ex.max.x *= (w / w1);
    }
    if (h1 != h) {
      ex.min.y *= (w / h1);
      ex.max.y *= (w / h1);
    }

    cv = null;
    return ex;
  }
  function FixFont(f) {
    return `'${f.replace(/(\'|\")/g, '').replace(/\s*,\s*/g, "', '")}'`;
  }
  function AddHandler(h, f, e) {
    e = e || doc;
    if (e.addEventListener) e.addEventListener(h, f, false);
    else e.attachEvent(`on${h}`, f);
  }
  function RemoveHandler(h, f, e) {
    e = e || doc;
    if (e.removeEventListener) e.removeEventListener(h, f);
    else e.detachEvent(`on${h}`, f);
  }
  function AddImage(i, o, t, tc) {
    const s = tc.imageScale; let mscale; let ic; let bc; let oc; let iw; let
      ih;
    // image not loaded, wait for image onload
    if (!o.complete) return AddHandler('load', () => { AddImage(i, o, t, tc); }, o);
    if (!i.complete) return AddHandler('load', () => { AddImage(i, o, t, tc); }, i);

    // Yes, this does look like nonsense, but it makes sure that both the
    // width and height are actually set and not just calculated. This is
    // required to keep proportional sizes when the images are hidden, so
    // the images can be used again for another cloud.
    o.width = o.width;
    o.height = o.height;

    if (s) {
      i.width = o.width * s;
      i.height = o.height * s;
    }
    // the standard width of the image, with imageScale applied
    t.iw = i.width;
    t.ih = i.height;
    if (tc.txtOpt) {
      ic = i;
      mscale = tc.zoomMax * tc.txtScale;
      iw = t.iw * mscale;
      ih = t.ih * mscale;
      if (iw < o.naturalWidth || ih < o.naturalHeight) {
        ic = ScaleImage(i, iw, ih);
        if (ic) t.fimage = ic;
      } else {
        iw = t.iw;
        ih = t.ih;
        mscale = 1;
      }
      if (parseFloat(tc.imageRadius)) t.image = t.fimage = i = RoundImage(t.image, tc.imageRadius, iw, ih, mscale);
      if (!t.HasText()) {
        if (tc.shadow) {
          ic = AddShadowToImage(t.image, iw, ih, mscale, tc.shadow, tc.shadowBlur,
            tc.shadowOffset);
          if (ic) {
            t.fimage = ic.image;
            t.w = ic.width;
            t.h = ic.height;
          }
        }
        if (tc.bgColour || tc.bgOutlineThickness) {
          bc = tc.bgColour == 'tag' ? GetProperty(t.a, 'background-color')
            : tc.bgColour;
          oc = tc.bgOutline == 'tag' ? GetProperty(t.a, 'color')
            : (tc.bgOutline || tc.textColour);
          iw = t.fimage.width;
          ih = t.fimage.height;
          if (tc.outlineMethod == 'colour') {
            // create the outline version first, using the current image state
            ic = AddBackgroundToImage(t.fimage, iw, ih, mscale, bc,
              tc.bgOutlineThickness, t.outline.colour, tc.padding, tc.bgRadius, 1);
            if (ic) t.oimage = ic.image;
          }
          ic = AddBackgroundToImage(t.fimage, iw, ih, mscale, bc,
            tc.bgOutlineThickness, oc, tc.padding, tc.bgRadius);
          if (ic) {
            t.fimage = ic.image;
            t.w = ic.width;
            t.h = ic.height;
          }
        }
        if (tc.outlineMethod == 'size') {
          if (tc.outlineIncrease > 0) {
            t.iw += 2 * tc.outlineIncrease;
            t.ih += 2 * tc.outlineIncrease;
            iw = mscale * t.iw;
            ih = mscale * t.ih;
            ic = ScaleImage(t.fimage, iw, ih);
            t.oimage = ic;
            t.fimage = ExpandImage(t.fimage, t.oimage.width, t.oimage.height);
          } else {
            iw = mscale * (t.iw + (2 * tc.outlineIncrease));
            ih = mscale * (t.ih + (2 * tc.outlineIncrease));
            ic = ScaleImage(t.fimage, iw, ih);
            t.oimage = ExpandImage(ic, t.fimage.width, t.fimage.height);
          }
        }
      }
    }
    t.Init();
  }
  function GetProperty(e, p) {
    const dv = doc.defaultView; const
      pc = p.replace(/\-([a-z])/g, (a) => a.charAt(1).toUpperCase());
    return (dv && dv.getComputedStyle && dv.getComputedStyle(e, null).getPropertyValue(p))
        || (e.currentStyle && e.currentStyle[pc]);
  }
  function FindWeight(a, wFrom, tHeight) {
    let w = 1; let
      p;
    if (wFrom) {
      w = 1 * (a.getAttribute(wFrom) || tHeight);
    } else if (p = GetProperty(a, 'font-size')) {
      w = (p.indexOf('px') > -1 && p.replace('px', '') * 1)
          || (p.indexOf('pt') > -1 && p.replace('pt', '') * 1.25)
          || p * 3.3;
    }
    return w;
  }
  function EventToCanvasId(e) {
    return e.target && Defined(e.target.id) ? e.target.id
      : e.srcElement.parentNode.id;
  }
  function EventXY(e, c) {
    let xy; let p; const xmul = parseInt(GetProperty(c, 'width')) / c.width;
    const ymul = parseInt(GetProperty(c, 'height')) / c.height;
    if (Defined(e.offsetX)) {
      xy = { x: e.offsetX, y: e.offsetY };
    } else {
      p = AbsPos(c.id);
      if (Defined(e.changedTouches)) e = e.changedTouches[0];
      if (e.pageX) xy = { x: e.pageX - p.x, y: e.pageY - p.y };
    }
    if (xy && xmul && ymul) {
      xy.x /= xmul;
      xy.y /= ymul;
    }
    return xy;
  }
  function MouseOut(e) {
    const cv = e.target || e.fromElement.parentNode; const
      tc = TagCanvas.tc[cv.id];
    if (tc) {
      tc.mx = tc.my = -1;
      tc.UnFreeze();
      tc.EndDrag();
    }
  }
  function MouseMove(e) {
    let i; const t = TagCanvas; let tc; let p; const
      tg = EventToCanvasId(e);
    for (i in t.tc) {
      tc = t.tc[i];
      if (tc.tttimer) {
        clearTimeout(tc.tttimer);
        tc.tttimer = null;
      }
    }
    if (tg && t.tc[tg]) {
      tc = t.tc[tg];
      if (p = EventXY(e, tc.canvas)) {
        tc.mx = p.x;
        tc.my = p.y;
        tc.Drag(e, p);
      }
      tc.drawn = 0;
    }
  }
  function MouseDown(e) {
    const t = TagCanvas; const cb = doc.addEventListener ? 0 : 1;
    const tg = EventToCanvasId(e);
    if (tg && e.button == cb && t.tc[tg]) {
      t.tc[tg].BeginDrag(e);
    }
  }
  function MouseUp(e) {
    const t = TagCanvas; const cb = doc.addEventListener ? 0 : 1;
    const tg = EventToCanvasId(e); let
      tc;
    if (tg && e.button == cb && t.tc[tg]) {
      tc = t.tc[tg];
      MouseMove(e);
      if (!tc.EndDrag() && !tc.touchState) tc.Clicked(e);
    }
  }
  function TouchDown(e) {
    const tg = EventToCanvasId(e); const tc = (tg && TagCanvas.tc[tg]); let
      p;
    if (tc && e.changedTouches) {
      if (e.touches.length == 1 && tc.touchState == 0) {
        tc.touchState = 1;
        tc.BeginDrag(e);
        if (p = EventXY(e, tc.canvas)) {
          tc.mx = p.x;
          tc.my = p.y;
          tc.drawn = 0;
        }
      } else if (e.targetTouches.length == 2 && tc.pinchZoom) {
        tc.touchState = 3;
        tc.EndDrag();
        tc.BeginPinch(e);
      } else {
        tc.EndDrag();
        tc.EndPinch();
        tc.touchState = 0;
      }
    }
  }
  function TouchUp(e) {
    const tg = EventToCanvasId(e); const
      tc = (tg && TagCanvas.tc[tg]);
    if (tc && e.changedTouches) {
      switch (tc.touchState) {
        case 1:
          tc.Draw();
          tc.Clicked();
          break;
        case 2:
          tc.EndDrag();
          break;
        case 3:
          tc.EndPinch();
      }
      tc.touchState = 0;
    }
  }
  function TouchMove(e) {
    let i; const t = TagCanvas; let tc; let p; const
      tg = EventToCanvasId(e);
    for (i in t.tc) {
      tc = t.tc[i];
      if (tc.tttimer) {
        clearTimeout(tc.tttimer);
        tc.tttimer = null;
      }
    }
    tc = (tg && t.tc[tg]);
    if (tc && e.changedTouches && tc.touchState) {
      switch (tc.touchState) {
        case 1:
        case 2:
          if (p = EventXY(e, tc.canvas)) {
            tc.mx = p.x;
            tc.my = p.y;
            if (tc.Drag(e, p)) tc.touchState = 2;
          }
          break;
        case 3:
          tc.Pinch(e);
      }
      tc.drawn = 0;
    }
  }
  function MouseWheel(e) {
    const t = TagCanvas; const
      tg = EventToCanvasId(e);
    if (tg && t.tc[tg]) {
      e.cancelBubble = true;
      e.returnValue = false;
      e.preventDefault && e.preventDefault();
      t.tc[tg].Wheel((e.wheelDelta || e.detail) > 0);
    }
  }
  function Scroll(e) {
    let i; const
      t = TagCanvas;
    clearTimeout(t.scrollTimer);
    for (i in t.tc) {
      t.tc[i].Pause();
    }
    t.scrollTimer = setTimeout(() => {
      let i; const
        t = TagCanvas;
      for (i in t.tc) {
        t.tc[i].Resume();
      }
    }, t.scrollPause);
  }
  function DrawCanvas() {
    DrawCanvasRAF(TimeNow());
  }
  function DrawCanvasRAF(t) {
    const { tc } = TagCanvas;
    let i;
    TagCanvas.NextFrame(TagCanvas.interval);
    t = t || TimeNow();
    for (i in tc) tc[i].Draw(t);
  }
  function AbsPos(id) {
    const e = doc.getElementById(id); const r = e.getBoundingClientRect();
    const dd = doc.documentElement; const b = doc.body; const w = window;
    const xs = w.pageXOffset || dd.scrollLeft;
    const ys = w.pageYOffset || dd.scrollTop;
    const xo = dd.clientLeft || b.clientLeft;
    const yo = dd.clientTop || b.clientTop;
    return { x: r.left + xs - xo, y: r.top + ys - yo };
  }
  function Project(tc, p1, sx, sy) {
    const m = tc.radius * tc.z1 / (tc.z1 + tc.z2 + p1.z);
    return {
      x: p1.x * m * sx,
      y: p1.y * m * sy,
      z: p1.z,
      w: (tc.z1 - p1.z) / tc.z2,
    };
  }
  /**
     * @constructor
     * for recursively splitting tag contents on <br> tags
     */
  function TextSplitter(e) {
    this.e = e;
    this.br = 0;
    this.line = [];
    this.text = [];
    this.original = e.innerText || e.textContent;
  }
  TSproto = TextSplitter.prototype;
  TSproto.Empty = function () {
    for (let i = 0; i < this.text.length; ++i) if (this.text[i].length) return false;
    return true;
  };
  TSproto.Lines = function (e) {
    const r = e ? 1 : 0; let cn; let cl; let
      i;
    e = e || this.e;
    cn = e.childNodes;
    cl = cn.length;

    for (i = 0; i < cl; ++i) {
      if (cn[i].nodeName == 'BR') {
        this.text.push(this.line.join(' '));
        this.br = 1;
      } else if (cn[i].nodeType == 3) {
        if (this.br) {
          this.line = [cn[i].nodeValue];
          this.br = 0;
        } else {
          this.line.push(cn[i].nodeValue);
        }
      } else {
        this.Lines(cn[i]);
      }
    }
    r || this.br || this.text.push(this.line.join(' '));
    return this.text;
  };
  TSproto.SplitWidth = function (w, c, f, h) {
    let i; let j; let words; const
      text = [];
    c.font = `${h}px ${f}`;
    for (i = 0; i < this.text.length; ++i) {
      words = this.text[i].split(/\s+/);
      this.line = [words[0]];
      for (j = 1; j < words.length; ++j) {
        if (c.measureText(`${this.line.join(' ')} ${words[j]}`).width > w) {
          text.push(this.line.join(' '));
          this.line = [words[j]];
        } else {
          this.line.push(words[j]);
        }
      }
      text.push(this.line.join(' '));
    }
    return this.text = text;
  };
  /**
     * @constructor
     */
  function Outline(tc, t) {
    this.ts = null;
    this.tc = tc;
    this.tag = t;
    this.x = this.y = this.w = this.h = this.sc = 1;
    this.z = 0;
    this.pulse = 1;
    this.pulsate = tc.pulsateTo < 1;
    this.colour = tc.outlineColour;
    this.adash = ~~tc.outlineDash;
    this.agap = ~~tc.outlineDashSpace || this.adash;
    this.aspeed = tc.outlineDashSpeed * 1;
    if (this.colour == 'tag') this.colour = GetProperty(t.a, 'color');
    else if (this.colour == 'tagbg') this.colour = GetProperty(t.a, 'background-color');
    this.Draw = this.pulsate ? this.DrawPulsate : this.DrawSimple;
    this.radius = tc.outlineRadius | 0;
    this.SetMethod(tc.outlineMethod);
  }
  Oproto = Outline.prototype;
  Oproto.SetMethod = function (om) {
    const methods = {
      block: ['PreDraw', 'DrawBlock'],
      colour: ['PreDraw', 'DrawColour'],
      outline: ['PostDraw', 'DrawOutline'],
      classic: ['LastDraw', 'DrawOutline'],
      size: ['PreDraw', 'DrawSize'],
      none: ['LastDraw'],
    }; const
      funcs = methods[om] || methods.outline;
    if (om == 'none') {
      this.Draw = function () { return 1; };
    } else {
      this.drawFunc = this[funcs[1]];
    }
    this[funcs[0]] = this.Draw;
  };
  Oproto.Update = function (x, y, w, h, sc, z, xo, yo) {
    const o = this.tc.outlineOffset; const
      o2 = 2 * o;
    this.x = sc * x + xo - o;
    this.y = sc * y + yo - o;
    this.w = sc * w + o2;
    this.h = sc * h + o2;
    this.sc = sc; // used to determine frontmost
    this.z = z;
  };
  Oproto.Ants = function (c) {
    if (!this.adash) return;
    const l = this.adash; const g = this.agap; let s = this.aspeed; const length = l + g;
    let l1 = 0; let l2 = l; let g1 = g; let g2 = 0; let seq = 0; let
      ants;
    if (s) {
      seq = abs(s) * (TimeNow() - this.ts) / 50;
      if (s < 0) seq = 8.64e6 - seq;
      s = ~~seq % length;
    }
    if (s) {
      if (l >= s) {
        l1 = l - s;
        l2 = s;
      } else {
        g1 = length - s;
        g2 = g - g1;
      }
      ants = [l1, g1, l2, g2];
    } else {
      ants = [l, g];
    }
    c.setLineDash(ants);
  };
  Oproto.DrawOutline = function (c, x, y, w, h, colour) {
    const r = min(this.radius, h / 2, w / 2);
    c.strokeStyle = colour;
    this.Ants(c);
    RRect(c, x, y, w, h, r, true);
  };
  Oproto.DrawSize = function (c, x, y, w, h, colour, tag, x1, y1) {
    const tw = tag.w; const th = tag.h; let m; let i; let
      sc;
    if (this.pulsate) {
      if (tag.image) sc = (tag.image.height + this.tc.outlineIncrease) / tag.image.height;
      else sc = tag.oscale;
      i = tag.fimage || tag.image;
      m = 1 + ((sc - 1) * (1 - this.pulse));
      tag.h *= m;
      tag.w *= m;
    } else {
      i = tag.oimage;
    }
    tag.alpha = 1;
    tag.Draw(c, x1, y1, i);
    tag.h = th;
    tag.w = tw;
    return 1;
  };
  Oproto.DrawColour = function (c, x, y, w, h, colour, tag, x1, y1) {
    if (tag.oimage) {
      if (this.pulse < 1) {
        tag.alpha = 1 - pow(this.pulse, 2);
        tag.Draw(c, x1, y1, tag.fimage);
        tag.alpha = this.pulse;
      } else {
        tag.alpha = 1;
      }
      tag.Draw(c, x1, y1, tag.oimage);
      return 1;
    }
    return this[tag.image ? 'DrawColourImage' : 'DrawColourText'](c, x, y, w, h, colour, tag, x1, y1);
  };
  Oproto.DrawColourText = function (c, x, y, w, h, colour, tag, x1, y1) {
    const normal = tag.colour;
    tag.colour = colour;
    tag.alpha = 1;
    tag.Draw(c, x1, y1);
    tag.colour = normal;
    return 1;
  };
  Oproto.DrawColourImage = function (c, x, y, w, h, colour, tag, x1, y1) {
    const ccanvas = c.canvas; const fx = ~~max(x, 0); const fy = ~~max(y, 0);
    const fw = min(ccanvas.width - fx, w) + 0.5 | 0; const fh = min(ccanvas.height - fy, h) + 0.5 | 0; let
      cc;
    if (ocanvas) ocanvas.width = fw, ocanvas.height = fh;
    else ocanvas = NewCanvas(fw, fh);
    if (!ocanvas) return this.SetMethod('outline'); // if using IE and images, give up!
    cc = ocanvas.getContext('2d');

    cc.drawImage(ccanvas, fx, fy, fw, fh, 0, 0, fw, fh);
    c.clearRect(fx, fy, fw, fh);
    if (this.pulsate) {
      tag.alpha = 1 - pow(this.pulse, 2);
    } else {
      tag.alpha = 1;
    }
    tag.Draw(c, x1, y1);
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.save();
    c.beginPath();
    c.rect(fx, fy, fw, fh);
    c.clip();
    c.globalCompositeOperation = 'source-in';
    c.fillStyle = colour;
    c.fillRect(fx, fy, fw, fh);
    c.restore();
    c.globalAlpha = 1;
    c.globalCompositeOperation = 'destination-over';
    c.drawImage(ocanvas, 0, 0, fw, fh, fx, fy, fw, fh);
    c.globalCompositeOperation = 'source-over';
    return 1;
  };
  Oproto.DrawBlock = function (c, x, y, w, h, colour) {
    const r = min(this.radius, h / 2, w / 2);
    c.fillStyle = colour;
    RRect(c, x, y, w, h, r);
  };
  Oproto.DrawSimple = function (c, tag, x1, y1, ga, useGa) {
    const t = this.tc;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.strokeStyle = this.colour;
    c.lineWidth = t.outlineThickness;
    c.shadowBlur = c.shadowOffsetX = c.shadowOffsetY = 0;
    c.globalAlpha = useGa ? ga : 1;
    return this.drawFunc(c, this.x, this.y, this.w, this.h, this.colour, tag, x1, y1);
  };
  Oproto.DrawPulsate = function (c, tag, x1, y1) {
    const diff = TimeNow() - this.ts; const t = this.tc;
    let ga = t.pulsateTo + ((1 - t.pulsateTo)
        * (0.5 + (cos(2 * Math.PI * diff / (1000 * t.pulsateTime)) / 2)));
    this.pulse = ga = TagCanvas.Smooth(1, ga);
    return this.DrawSimple(c, tag, x1, y1, ga, 1);
  };
  Oproto.Active = function (c, x, y) {
    const a = (x >= this.x && y >= this.y
        && x <= this.x + this.w && y <= this.y + this.h);
    if (a) {
      this.ts = this.ts || TimeNow();
    } else {
      this.ts = null;
    }
    return a;
  };
  Oproto.PreDraw = Oproto.PostDraw = Oproto.LastDraw = Nop;
  /**
     * @constructor
     */
  function Tag(tc, text, a, v, w, h, col, bcol, bradius, boutline, bothickness,
    font, padding, original) {
    this.tc = tc;
    this.image = null;
    this.text = text;
    this.text_original = original;
    this.line_widths = [];
    this.title = a.title || null;
    this.a = a;
    this.position = new Vector(v[0], v[1], v[2]);
    this.x = this.y = this.z = 0;
    this.w = w;
    this.h = h;
    this.colour = col || tc.textColour;
    this.bgColour = bcol || tc.bgColour;
    this.bgRadius = bradius | 0;
    this.bgOutline = boutline || this.colour;
    this.bgOutlineThickness = bothickness | 0;
    this.textFont = font || tc.textFont;
    this.padding = padding | 0;
    this.sc = this.alpha = 1;
    this.weighted = !tc.weight;
    this.outline = new Outline(tc, this);
  }
  Tproto = Tag.prototype;
  Tproto.Init = function (e) {
    const { tc } = this;
    this.textHeight = tc.textHeight;
    if (this.HasText()) {
      this.Measure(tc.ctxt, tc);
    } else {
      this.w = this.iw;
      this.h = this.ih;
    }

    this.SetShadowColour = tc.shadowAlpha ? this.SetShadowColourAlpha : this.SetShadowColourFixed;
    this.SetDraw(tc);
  };
  Tproto.Draw = Nop;
  Tproto.HasText = function () {
    return this.text && this.text[0].length > 0;
  };
  Tproto.EqualTo = function (e) {
    const i = e.getElementsByTagName('img');
    if (this.a.href != e.href) return 0;
    if (i.length) return this.image.src == i[0].src;
    return (e.innerText || e.textContent) == this.text_original;
  };
  Tproto.SetImage = function (i) {
    this.image = this.fimage = i;
  };
  Tproto.SetDraw = function (t) {
    this.Draw = this.fimage ? (t.ie > 7 ? this.DrawImageIE : this.DrawImage) : this.DrawText;
    t.noSelect && (this.CheckActive = Nop);
  };
  Tproto.MeasureText = function (c) {
    let i; const l = this.text.length; let w = 0; let
      wl;
    for (i = 0; i < l; ++i) {
      this.line_widths[i] = wl = c.measureText(this.text[i]).width;
      w = max(w, wl);
    }
    return w;
  };
  Tproto.Measure = function (c, t) {
    let extents = FindTextBoundingBox(this.text, this.textFont, this.textHeight);
    let s; let th; let f; let soff; let cw; let twidth; let theight; let img; let
      tcv;
      // add the gap at the top to the height to make equal gap at bottom
    theight = extents ? extents.max.y + extents.min.y : this.textHeight;
    c.font = this.font = `${this.textHeight}px ${this.textFont}`;
    twidth = this.MeasureText(c);
    if (t.txtOpt) {
      s = t.txtScale;
      th = s * this.textHeight;
      f = `${th}px ${this.textFont}`;
      soff = [s * t.shadowOffset[0], s * t.shadowOffset[1]];
      c.font = f;
      cw = this.MeasureText(c);
      tcv = new TextCanvas(this.text, f, cw + s, (s * theight) + s, cw,
        this.line_widths, t.textAlign, t.textVAlign, s);

      if (this.image) {
        tcv.SetImage(this.image, this.iw, this.ih, t.imagePosition, t.imagePadding,
          t.imageAlign, t.imageVAlign, t.imageScale);
      }

      img = tcv.Create(this.colour, this.bgColour, this.bgOutline,
        s * this.bgOutlineThickness, t.shadow, s * t.shadowBlur, soff,
        s * this.padding, s * this.bgRadius);

      // add outline image using highlight colour
      if (t.outlineMethod == 'colour') {
        this.oimage = tcv.Create(this.outline.colour, this.bgColour, this.outline.colour,
          s * this.bgOutlineThickness, t.shadow, s * t.shadowBlur, soff,
          s * this.padding, s * this.bgRadius);
      } else if (t.outlineMethod == 'size') {
        extents = FindTextBoundingBox(this.text, this.textFont,
          this.textHeight + t.outlineIncrease);
        th = extents.max.y + extents.min.y;
        f = `${s * (this.textHeight + t.outlineIncrease)}px ${this.textFont}`;
        c.font = f;
        cw = this.MeasureText(c);

        tcv = new TextCanvas(this.text, f, cw + s, (s * th) + s, cw,
          this.line_widths, t.textAlign, t.textVAlign, s);
        if (this.image) {
          tcv.SetImage(this.image, this.iw + t.outlineIncrease,
            this.ih + t.outlineIncrease, t.imagePosition, t.imagePadding,
            t.imageAlign, t.imageVAlign, t.imageScale);
        }

        this.oimage = tcv.Create(this.colour, this.bgColour, this.bgOutline,
          s * this.bgOutlineThickness, t.shadow, s * t.shadowBlur, soff,
          s * this.padding, s * this.bgRadius);

        this.oscale = this.oimage.width / img.width;
        if (t.outlineIncrease > 0) img = ExpandImage(img, this.oimage.width, this.oimage.height);
        else this.oimage = ExpandImage(this.oimage, img.width, img.height);
      }
      if (img) {
        this.fimage = img;
        twidth = this.fimage.width / s;
        theight = this.fimage.height / s;
      }
      this.SetDraw(t);
      t.txtOpt = !!this.fimage;
    }
    this.h = theight;
    this.w = twidth;
  };
  Tproto.SetFont = function (f, c, bc, boc) {
    this.textFont = f;
    this.colour = c;
    this.bgColour = bc;
    this.bgOutline = boc;
    this.Measure(this.tc.ctxt, this.tc);
  };
  Tproto.SetWeight = function (w) {
    const { tc } = this;
    const modes = tc.weightMode.split(/[, ]/);
    let m;
    let s;
    const wl = w.length;
    if (!this.HasText()) return;
    this.weighted = true;
    for (s = 0; s < wl; ++s) {
      m = modes[s] || 'size';
      if (m == 'both') {
        this.Weight(w[s], tc.ctxt, tc, 'size', tc.min_weight[s],
          tc.max_weight[s], s);
        this.Weight(w[s], tc.ctxt, tc, 'colour', tc.min_weight[s],
          tc.max_weight[s], s);
      } else {
        this.Weight(w[s], tc.ctxt, tc, m, tc.min_weight[s], tc.max_weight[s], s);
      }
    }
    this.Measure(tc.ctxt, tc);
  };
  Tproto.Weight = function (w, c, t, m, wmin, wmax, wnum) {
    w = isNaN(w) ? 1 : w;
    const nweight = (w - wmin) / (wmax - wmin);
    if (m == 'colour') this.colour = FindGradientColour(t, nweight, wnum);
    else if (m == 'bgcolour') this.bgColour = FindGradientColour(t, nweight, wnum);
    else if (m == 'bgoutline') this.bgOutline = FindGradientColour(t, nweight, wnum);
    else if (m == 'outline') this.outline.colour = FindGradientColour(t, nweight, wnum);
    else if (m == 'size') {
      if (t.weightSizeMin > 0 && t.weightSizeMax > t.weightSizeMin) {
        this.textHeight = t.weightSize
            * (t.weightSizeMin + (t.weightSizeMax - t.weightSizeMin) * nweight);
      } else {
        // min textHeight of 1
        this.textHeight = max(1, w * t.weightSize);
      }
    }
  };
  Tproto.SetShadowColourFixed = function (c, s, a) {
    c.shadowColor = s;
  };
  Tproto.SetShadowColourAlpha = function (c, s, a) {
    c.shadowColor = SetAlpha(s, a);
  };
  Tproto.DrawText = function (c, xoff, yoff) {
    const t = this.tc; let { x } = this; let { y } = this; const s = this.sc; let i; let
      xl;
    c.globalAlpha = this.alpha;
    c.fillStyle = this.colour;
    t.shadow && this.SetShadowColour(c, t.shadow, this.alpha);
    c.font = this.font;
    x += xoff / s;
    y += (yoff / s) - (this.h / 2);
    for (i = 0; i < this.text.length; ++i) {
      xl = x;
      if (t.textAlign == 'right') {
        xl += this.w / 2 - this.line_widths[i];
      } else if (t.textAlign == 'centre') {
        xl -= this.line_widths[i] / 2;
      } else {
        xl -= this.w / 2;
      }
      c.setTransform(s, 0, 0, s, s * xl, s * y);
      c.fillText(this.text[i], 0, 0);
      y += this.textHeight;
    }
  };
  Tproto.DrawImage = function (c, xoff, yoff, im) {
    let { x } = this;
    let { y } = this;
    const s = this.sc;
    const i = im || this.fimage;
    const { w } = this;
    const { h } = this;
    const a = this.alpha;
    const { shadow } = this;
    c.globalAlpha = a;
    shadow && this.SetShadowColour(c, shadow, a);
    x += (xoff / s) - (w / 2);
    y += (yoff / s) - (h / 2);
    c.setTransform(s, 0, 0, s, s * x, s * y);
    c.drawImage(i, 0, 0, w, h);
  };
  Tproto.DrawImageIE = function (c, xoff, yoff) {
    const i = this.fimage; const s = this.sc;
    const w = i.width = this.w * s; const h = i.height = this.h * s;
    const x = (this.x * s) + xoff - (w / 2); const
      y = (this.y * s) + yoff - (h / 2);
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalAlpha = this.alpha;
    c.drawImage(i, x, y);
  };
  Tproto.Calc = function (m, a) {
    let pp; const t = this.tc; const mnb = t.minBrightness;
    const mxb = t.maxBrightness; const
      r = t.max_radius;
    pp = m.xform(this.position);
    this.xformed = pp;
    pp = Project(t, pp, t.stretchX, t.stretchY);
    this.x = pp.x;
    this.y = pp.y;
    this.z = pp.z;
    this.sc = pp.w;
    this.alpha = a * Clamp(mnb + (mxb - mnb) * (r - this.z) / (2 * r), 0, 1);
    return this.xformed;
  };
  Tproto.UpdateActive = function (c, xoff, yoff) {
    const o = this.outline; const { w } = this; const { h } = this;
    const x = this.x - w / 2; const
      y = this.y - h / 2;
    o.Update(x, y, w, h, this.sc, this.z, xoff, yoff);
    return o;
  };
  Tproto.CheckActive = function (c, xoff, yoff) {
    const t = this.tc; const
      o = this.UpdateActive(c, xoff, yoff);
    return o.Active(c, t.mx, t.my) ? o : null;
  };
  Tproto.Clicked = function (e) {
    const { a } = this;
    const t = a.target;
    const h = a.href;
    let evt;
    if (t != '' && t != '_self') {
      if (self.frames[t]) {
        self.frames[t].document.location = h;
      } else {
        try {
          if (top.frames[t]) {
            top.frames[t].document.location = h;
            return;
          }
        } catch (err) {
          // different domain/port/protocol?
        }
        window.open(h, t);
      }
      return;
    }
    if (doc.createEvent) {
      evt = doc.createEvent('MouseEvents');
      evt.initMouseEvent('click', 1, 1, window, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, null);
      if (!a.dispatchEvent(evt)) return;
    } else if (a.fireEvent) {
      if (!a.fireEvent('onclick')) return;
    }
    doc.location = h;
  };
  /**
     * @constructor
     */
  function TagCanvas(cid, lctr, opt) {
    let i; let p; let c = doc.getElementById(cid); const cp = ['id', 'class', 'innerHTML']; let
      raf;

    if (!c) throw 0;
    if (Defined(window.G_vmlCanvasManager)) {
      c = window.G_vmlCanvasManager.initElement(c);
      this.ie = parseFloat(navigator.appVersion.split('MSIE')[1]);
    }
    if (c && (!c.getContext || !c.getContext('2d').fillText)) {
      p = doc.createElement('DIV');
      for (i = 0; i < cp.length; ++i) p[cp[i]] = c[cp[i]];
      c.parentNode.insertBefore(p, c);
      c.parentNode.removeChild(c);
      throw 0;
    }
    for (i in TagCanvas.options) {
      this[i] = opt && Defined(opt[i]) ? opt[i]
        : (Defined(TagCanvas[i]) ? TagCanvas[i] : TagCanvas.options[i]);
    }

    this.canvas = c;
    this.ctxt = c.getContext('2d');
    this.z1 = 250 / max(this.depth, 0.001);
    this.z2 = this.z1 / this.zoom;
    this.radius = min(c.height, c.width) * 0.0075; // fits radius of 100 in canvas
    this.max_radius = 100;
    this.max_weight = [];
    this.min_weight = [];
    this.textFont = this.textFont && FixFont(this.textFont);
    this.textHeight *= 1;
    this.imageRadius = this.imageRadius.toString();
    this.pulsateTo = Clamp(this.pulsateTo, 0, 1);
    this.minBrightness = Clamp(this.minBrightness, 0, 1);
    this.maxBrightness = Clamp(this.maxBrightness, this.minBrightness, 1);
    this.ctxt.textBaseline = 'top';
    this.lx = (`${this.lock}`).indexOf('x') + 1;
    this.ly = (`${this.lock}`).indexOf('y') + 1;
    this.frozen = this.dx = this.dy = this.fixedAnim = this.touchState = 0;
    this.fixedAlpha = 1;
    this.source = lctr || cid;
    this.repeatTags = min(64, ~~this.repeatTags);
    this.minTags = min(200, ~~this.minTags);
    if (~~this.scrollPause > 0) TagCanvas.scrollPause = ~~this.scrollPause;
    else this.scrollPause = 0;
    if (this.minTags > 0 && this.repeatTags < 1 && (i = this.GetTags().length)) this.repeatTags = ceil(this.minTags / i) - 1;
    this.transform = Matrix.Identity();
    this.startTime = this.time = TimeNow();
    this.mx = this.my = -1;
    this.centreImage && CentreImage(this);
    this.Animate = this.dragControl ? this.AnimateDrag : this.AnimatePosition;
    this.animTiming = (typeof TagCanvas[this.animTiming] === 'function'
      ? TagCanvas[this.animTiming] : TagCanvas.Smooth);
    if (this.shadowBlur || this.shadowOffset[0] || this.shadowOffset[1]) {
      // let the browser translate "red" into "#ff0000"
      this.ctxt.shadowColor = this.shadow;
      this.shadow = this.ctxt.shadowColor;
      this.shadowAlpha = ShadowAlphaBroken();
    } else {
      delete this.shadow;
    }
    this.Load();
    if (lctr && this.hideTags) {
      (function (t) {
        if (TagCanvas.loaded) t.HideTags();
        else AddHandler('load', () => { t.HideTags(); }, window);
      }(this));
    }

    this.yaw = this.initial ? this.initial[0] * this.maxSpeed : 0;
    this.pitch = this.initial ? this.initial[1] * this.maxSpeed : 0;
    if (this.tooltip) {
      this.ctitle = c.title;
      c.title = '';
      if (this.tooltip == 'native') {
        this.Tooltip = this.TooltipNative;
      } else {
        this.Tooltip = this.TooltipDiv;
        if (!this.ttdiv) {
          this.ttdiv = doc.createElement('div');
          this.ttdiv.className = this.tooltipClass;
          this.ttdiv.style.position = 'absolute';
          this.ttdiv.style.zIndex = c.style.zIndex + 1;
          AddHandler('mouseover', (e) => { e.target.style.display = 'none'; }, this.ttdiv);
          doc.body.appendChild(this.ttdiv);
        }
      }
    } else {
      this.Tooltip = this.TooltipNone;
    }
    if (!this.noMouse && !handlers[cid]) {
      handlers[cid] = [
        ['mousemove', MouseMove],
        ['mouseout', MouseOut],
        ['mouseup', MouseUp],
        ['touchstart', TouchDown],
        ['touchend', TouchUp],
        ['touchcancel', TouchUp],
        ['touchmove', TouchMove],
      ];
      if (this.dragControl) {
        handlers[cid].push(['mousedown', MouseDown]);
        handlers[cid].push(['selectstart', Nop]);
      }
      if (this.wheelZoom) {
        handlers[cid].push(['mousewheel', MouseWheel]);
        handlers[cid].push(['DOMMouseScroll', MouseWheel]);
      }
      if (this.scrollPause) {
        handlers[cid].push(['scroll', Scroll, window]);
      }
      for (i = 0; i < handlers[cid].length; ++i) {
        p = handlers[cid][i];
        AddHandler(p[0], p[1], p[2] ? p[2] : c);
      }
    }
    if (!TagCanvas.started) {
      raf = window.requestAnimationFrame = window.requestAnimationFrame
          || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame
          || window.msRequestAnimationFrame;
      TagCanvas.NextFrame = raf ? TagCanvas.NextFrameRAF
        : TagCanvas.NextFrameTimeout;
      TagCanvas.interval = this.interval;
      TagCanvas.NextFrame(this.interval);
      TagCanvas.started = 1;
    }
  }
  TCproto = TagCanvas.prototype;
  TCproto.SourceElements = function () {
    if (doc.querySelectorAll) return doc.querySelectorAll(`#${this.source}`);
    return [doc.getElementById(this.source)];
  };
  TCproto.HideTags = function () {
    const el = this.SourceElements(); let
      i;
    for (i = 0; i < el.length; ++i) el[i].style.display = 'none';
  };
  TCproto.GetTags = function () {
    const el = this.SourceElements(); let etl; const tl = []; let i; let j; let
      k;
    for (k = 0; k <= this.repeatTags; ++k) {
      for (i = 0; i < el.length; ++i) {
        etl = el[i].getElementsByTagName('a');
        for (j = 0; j < etl.length; ++j) {
          tl.push(etl[j]);
        }
      }
    }
    return tl;
  };
  TCproto.Message = function (text) {
    const tl = []; let i; let p; const tc = text.split(''); let a; let t; let x; let
      z;
    for (i = 0; i < tc.length; ++i) {
      if (tc[i] != ' ') {
        p = i - tc.length / 2;
        a = doc.createElement('A');
        a.href = '#';
        a.innerText = tc[i];
        x = 100 * sin(p / 9);
        z = -100 * cos(p / 9);
        t = new Tag(this, tc[i], a, [x, 0, z], 2, 18, '#000', '#fff', 0, 0, 0,
          'monospace', 2, tc[i]);
        t.Init();
        tl.push(t);
      }
    }
    return tl;
  };
  TCproto.CreateTag = function (e) {
    let im; let i; let t; let txt; let ts; let font; let bc; let boc; const
      p = [0, 0, 0];
    if (this.imageMode != 'text') {
      im = e.getElementsByTagName('img');
      if (im.length) {
        i = new Image();
        i.src = im[0].src;

        if (!this.imageMode) {
          t = new Tag(this, '', e, p, 0, 0);
          t.SetImage(i);
          // t.Init();
          AddImage(i, im[0], t, this);
          return t;
        }
      }
    }
    if (this.imageMode != 'image') {
      ts = new TextSplitter(e);
      txt = ts.Lines();
      if (!ts.Empty()) {
        font = this.textFont || FixFont(GetProperty(e, 'font-family'));
        if (this.splitWidth) txt = ts.SplitWidth(this.splitWidth, this.ctxt, font, this.textHeight);

        bc = this.bgColour == 'tag' ? GetProperty(e, 'background-color')
          : this.bgColour;
        boc = this.bgOutline == 'tag' ? GetProperty(e, 'color') : this.bgOutline;
      } else {
        ts = null;
      }
    }
    if (ts || i) {
      t = new Tag(this, txt, e, p, 2, this.textHeight + 2,
        this.textColour || GetProperty(e, 'color'), bc, this.bgRadius,
        boc, this.bgOutlineThickness, font, this.padding, ts && ts.original);
      if (i) {
        t.SetImage(i);
        AddImage(i, im[0], t, this);
      } else {
        t.Init();
      }
      return t;
    }
  };
  TCproto.UpdateTag = function (t, a) {
    const colour = this.textColour || GetProperty(a, 'color');
    const font = this.textFont || FixFont(GetProperty(a, 'font-family'));
    const bc = this.bgColour == 'tag' ? GetProperty(a, 'background-color')
      : this.bgColour; const
      boc = this.bgOutline == 'tag' ? GetProperty(a, 'color')
        : this.bgOutline;
    t.a = a;
    t.title = a.title;
    if (t.colour != colour || t.textFont != font || t.bgColour != bc
        || t.bgOutline != boc) t.SetFont(font, colour, bc, boc);
  };
  TCproto.Weight = function (tl) {
    const ll = tl.length; let w; let i; let s; const weights = []; let valid;
    const wfrom = this.weightFrom ? this.weightFrom.split(/[, ]/) : [null];
    const wl = wfrom.length;
    for (i = 0; i < ll; ++i) {
      weights[i] = [];
      for (s = 0; s < wl; ++s) {
        w = FindWeight(tl[i].a, wfrom[s], this.textHeight);
        if (!this.max_weight[s] || w > this.max_weight[s]) this.max_weight[s] = w;
        if (!this.min_weight[s] || w < this.min_weight[s]) this.min_weight[s] = w;
        weights[i][s] = w;
      }
    }
    for (s = 0; s < wl; ++s) {
      if (this.max_weight[s] > this.min_weight[s]) valid = 1;
    }
    if (valid) {
      for (i = 0; i < ll; ++i) {
        tl[i].SetWeight(weights[i]);
      }
    }
  };
  TCproto.Load = function () {
    const tl = this.GetTags(); let taglist = []; let shape; let t;
    let shapeArgs; let rx; let ry; let rz; let vl; let i; const tagmap = []; const
      pfuncs = {
        sphere: PointsOnSphere,
        vcylinder: PointsOnCylinderV,
        hcylinder: PointsOnCylinderH,
        vring: PointsOnRingV,
        hring: PointsOnRingH,
      };

    if (tl.length) {
      tagmap.length = tl.length;
      for (i = 0; i < tl.length; ++i) tagmap[i] = i;
      this.shuffleTags && Shuffle(tagmap);
      rx = 100 * this.radiusX;
      ry = 100 * this.radiusY;
      rz = 100 * this.radiusZ;
      this.max_radius = max(rx, max(ry, rz));

      for (i = 0; i < tl.length; ++i) {
        t = this.CreateTag(tl[tagmap[i]]);
        if (t) taglist.push(t);
      }
      this.weight && this.Weight(taglist, true);

      if (this.shapeArgs) {
        this.shapeArgs[0] = taglist.length;
      } else {
        shapeArgs = this.shape.toString().split(/[(),]/);
        shape = shapeArgs.shift();
        if (typeof window[shape] === 'function') this.shape = window[shape];
        else this.shape = pfuncs[shape] || pfuncs.sphere;
        this.shapeArgs = [taglist.length, rx, ry, rz].concat(shapeArgs);
      }
      vl = this.shape.apply(this, this.shapeArgs);
      this.listLength = taglist.length;
      for (i = 0; i < taglist.length; ++i) taglist[i].position = new Vector(vl[i][0], vl[i][1], vl[i][2]);
    }
    if (this.noTagsMessage && !taglist.length) {
      i = (this.imageMode && this.imageMode != 'both' ? `${this.imageMode} ` : '');
      taglist = this.Message(`No ${i}tags`);
    }
    this.taglist = taglist;
  };
  TCproto.Update = function () {
    const tl = this.GetTags(); const newlist = [];
    const { taglist } = this; let found;
    const added = []; const removed = []; let vl; let ol; let nl; let i; let
      j;

    if (!this.shapeArgs) return this.Load();

    if (tl.length) {
      nl = this.listLength = tl.length;
      ol = taglist.length;

      // copy existing list, populate "removed"
      for (i = 0; i < ol; ++i) {
        newlist.push(taglist[i]);
        removed.push(i);
      }

      // find added and removed tags
      for (i = 0; i < nl; ++i) {
        for (j = 0, found = 0; j < ol; ++j) {
          if (taglist[j].EqualTo(tl[i])) {
            this.UpdateTag(newlist[j], tl[i]);
            found = removed[j] = -1;
          }
        }
        if (!found) added.push(i);
      }

      // clean out found tags from removed list
      for (i = 0, j = 0; i < ol; ++i) {
        if (removed[j] == -1) removed.splice(j, 1);
        else ++j;
      }

      // insert new tags in gaps where old tags removed
      if (removed.length) {
        Shuffle(removed);
        while (removed.length && added.length) {
          i = removed.shift();
          j = added.shift();
          newlist[i] = this.CreateTag(tl[j]);
        }

        // remove any more (in reverse order)
        removed.sort((a, b) => a - b);
        while (removed.length) {
          newlist.splice(removed.pop(), 1);
        }
      }

      // add any extra tags
      j = newlist.length / (added.length + 1);
      i = 0;
      while (added.length) {
        newlist.splice(ceil(++i * j), 0, this.CreateTag(tl[added.shift()]));
      }

      // assign correct positions to tags
      this.shapeArgs[0] = nl = newlist.length;
      vl = this.shape.apply(this, this.shapeArgs);
      for (i = 0; i < nl; ++i) newlist[i].position = new Vector(vl[i][0], vl[i][1], vl[i][2]);

      // reweight tags
      this.weight && this.Weight(newlist);
    }
    this.taglist = newlist;
  };
  TCproto.SetShadow = function (c) {
    c.shadowBlur = this.shadowBlur;
    c.shadowOffsetX = this.shadowOffset[0];
    c.shadowOffsetY = this.shadowOffset[1];
  };
  TCproto.Draw = function (t) {
    if (this.paused) return;
    const cv = this.canvas; const cw = cv.width; const ch = cv.height; let max_sc = 0;
    const tdelta = (t - this.time) * TagCanvas.interval / 1000;
    const x = cw / 2 + this.offsetX; const y = ch / 2 + this.offsetY; const c = this.ctxt;
    let active; let a; let i; let aindex = -1; let tl = this.taglist; const l = tl.length;
    const frontsel = this.frontSelect; let centreDrawn = (this.centreFunc == Nop); let
      fixed;
    this.time = t;
    if (this.frozen && this.drawn) return this.Animate(cw, ch, tdelta);
    fixed = this.AnimateFixed();
    c.setTransform(1, 0, 0, 1, 0, 0);
    for (i = 0; i < l; ++i) tl[i].Calc(this.transform, this.fixedAlpha);
    tl = SortList(tl, (a, b) => b.z - a.z);

    if (fixed && this.fixedAnim.active) {
      active = this.fixedAnim.tag.UpdateActive(c, x, y);
    } else {
      this.active = null;
      for (i = 0; i < l; ++i) {
        a = this.mx >= 0 && this.my >= 0 && this.taglist[i].CheckActive(c, x, y);
        if (a && a.sc > max_sc && (!frontsel || a.z <= 0)) {
          active = a;
          aindex = i;
          active.tag = this.taglist[i];
          max_sc = a.sc;
        }
      }
      this.active = active;
    }

    this.txtOpt || (this.shadow && this.SetShadow(c));
    c.clearRect(0, 0, cw, ch);
    for (i = 0; i < l; ++i) {
      if (!centreDrawn && tl[i].z <= 0) {
        // run the centreFunc if the next tag is at the front
        try { this.centreFunc(c, cw, ch, x, y); } catch (e) {
          alert(e);
          // don't run it again
          this.centreFunc = Nop;
        }
        centreDrawn = true;
      }

      if (!(active && active.tag == tl[i] && active.PreDraw(c, tl[i], x, y))) tl[i].Draw(c, x, y);
      active && active.tag == tl[i] && active.PostDraw(c);
    }
    if (this.freezeActive && active) {
      this.Freeze();
    } else {
      this.UnFreeze();
      this.drawn = (l == this.listLength);
    }
    if (this.fixedCallback) {
      this.fixedCallback(this, this.fixedCallbackTag);
      this.fixedCallback = null;
    }
    fixed || this.Animate(cw, ch, tdelta);
    active && active.LastDraw(c);
    cv.style.cursor = active ? this.activeCursor : '';
    this.Tooltip(active, this.taglist[aindex]);
  };
  TCproto.TooltipNone = function () { };
  TCproto.TooltipNative = function (active, tag) {
    if (active) this.canvas.title = tag && tag.title ? tag.title : '';
    else this.canvas.title = this.ctitle;
  };
  TCproto.SetTTDiv = function (title, tag) {
    const tc = this; const
      s = tc.ttdiv.style;
    if (title != tc.ttdiv.innerHTML) s.display = 'none';
    tc.ttdiv.innerHTML = title;
    tag && (tag.title = tc.ttdiv.innerHTML);
    if (s.display == 'none' && !tc.tttimer) {
      tc.tttimer = setTimeout(() => {
        const p = AbsPos(tc.canvas.id);
        s.display = 'block';
        s.left = `${p.x + tc.mx}px`;
        s.top = `${p.y + tc.my + 24}px`;
        tc.tttimer = null;
      }, tc.tooltipDelay);
    }
  };
  TCproto.TooltipDiv = function (active, tag) {
    if (active && tag && tag.title) {
      this.SetTTDiv(tag.title, tag);
    } else if (!active && this.mx != -1 && this.my != -1 && this.ctitle.length) {
      this.SetTTDiv(this.ctitle);
    } else {
      this.ttdiv.style.display = 'none';
    }
  };
  TCproto.Transform = function (tc, p, y) {
    if (p || y) {
      const sp = sin(p); const cp = cos(p); const sy = sin(y); const cy = cos(y);
      const ym = new Matrix([cy, 0, sy, 0, 1, 0, -sy, 0, cy]);
      const pm = new Matrix([1, 0, 0, 0, cp, -sp, 0, sp, cp]);
      tc.transform = tc.transform.mul(ym.mul(pm));
    }
  };
  TCproto.AnimateFixed = function () {
    let fa; let t1; let angle; let m; let
      d;
    if (this.fadeIn) {
      t1 = TimeNow() - this.startTime;
      if (t1 >= this.fadeIn) {
        this.fadeIn = 0;
        this.fixedAlpha = 1;
      } else {
        this.fixedAlpha = t1 / this.fadeIn;
      }
    }
    if (this.fixedAnim) {
      if (!this.fixedAnim.transform) this.fixedAnim.transform = this.transform;
      fa = this.fixedAnim, t1 = TimeNow() - fa.t0, angle = fa.angle,
      m, d = this.animTiming(fa.t, t1);
      this.transform = fa.transform;
      if (t1 >= fa.t) {
        this.fixedCallbackTag = fa.tag;
        this.fixedCallback = fa.cb;
        this.fixedAnim = this.yaw = this.pitch = 0;
      } else {
        angle *= d;
      }
      m = Matrix.Rotation(angle, fa.axis);
      this.transform = this.transform.mul(m);
      return (this.fixedAnim != 0);
    }
    return false;
  };
  TCproto.AnimatePosition = function (w, h, t) {
    const tc = this; const x = tc.mx; const y = tc.my; let s; let
      r;
    if (!tc.frozen && x >= 0 && y >= 0 && x < w && y < h) {
      s = tc.maxSpeed, r = tc.reverse ? -1 : 1;
      tc.lx || (tc.yaw = ((x * 2 * s / w) - s) * r * t);
      tc.ly || (tc.pitch = ((y * 2 * s / h) - s) * -r * t);
      tc.initial = null;
    } else if (!tc.initial) {
      if (tc.frozen && !tc.freezeDecel) tc.yaw = tc.pitch = 0;
      else tc.Decel(tc);
    }
    this.Transform(tc, tc.pitch, tc.yaw);
  };
  TCproto.AnimateDrag = function (w, h, t) {
    const tc = this; const
      rs = 100 * t * tc.maxSpeed / tc.max_radius / tc.zoom;
    if (tc.dx || tc.dy) {
      tc.lx || (tc.yaw = tc.dx * rs / tc.stretchX);
      tc.ly || (tc.pitch = tc.dy * -rs / tc.stretchY);
      tc.dx = tc.dy = 0;
      tc.initial = null;
    } else if (!tc.initial) {
      tc.Decel(tc);
    }
    this.Transform(tc, tc.pitch, tc.yaw);
  };
  TCproto.Freeze = function () {
    if (!this.frozen) {
      this.preFreeze = [this.yaw, this.pitch];
      this.frozen = 1;
      this.drawn = 0;
    }
  };
  TCproto.UnFreeze = function () {
    if (this.frozen) {
      this.yaw = this.preFreeze[0];
      this.pitch = this.preFreeze[1];
      this.frozen = 0;
    }
  };
  TCproto.Decel = function (tc) {
    const s = tc.minSpeed; const ay = abs(tc.yaw); const
      ap = abs(tc.pitch);
    if (!tc.lx && ay > s) tc.yaw = ay > tc.z0 ? tc.yaw * tc.decel : 0;
    if (!tc.ly && ap > s) tc.pitch = ap > tc.z0 ? tc.pitch * tc.decel : 0;
  };
  TCproto.Zoom = function (r) {
    this.z2 = this.z1 * (1 / r);
    this.drawn = 0;
  };
  TCproto.Clicked = function (e) {
    const a = this.active;
    try {
      if (a && a.tag) {
        if (this.clickToFront === false || this.clickToFront === null) a.tag.Clicked(e);
        else {
          this.TagToFront(a.tag, this.clickToFront, () => {
            a.tag.Clicked(e);
          }, true);
        }
      }
    } catch (ex) {
    }
  };
  TCproto.Wheel = function (i) {
    const z = this.zoom + this.zoomStep * (i ? 1 : -1);
    this.zoom = min(this.zoomMax, max(this.zoomMin, z));
    this.Zoom(this.zoom);
  };
  TCproto.BeginDrag = function (e) {
    this.down = EventXY(e, this.canvas);
    e.cancelBubble = true;
    e.returnValue = false;
    e.preventDefault && e.preventDefault();
  };
  TCproto.Drag = function (e, p) {
    if (this.dragControl && this.down) {
      const t2 = this.dragThreshold * this.dragThreshold;
      const dx = p.x - this.down.x; const
        dy = p.y - this.down.y;
      if (this.dragging || dx * dx + dy * dy > t2) {
        this.dx = dx;
        this.dy = dy;
        this.dragging = 1;
        this.down = p;
      }
    }
    return this.dragging;
  };
  TCproto.EndDrag = function () {
    const res = this.dragging;
    this.dragging = this.down = null;
    return res;
  };
  function PinchDistance(e) {
    const t1 = e.targetTouches[0]; const
      t2 = e.targetTouches[1];
    return sqrt(pow(t2.pageX - t1.pageX, 2) + pow(t2.pageY - t1.pageY, 2));
  }
  TCproto.BeginPinch = function (e) {
    this.pinched = [PinchDistance(e), this.zoom];
    e.preventDefault && e.preventDefault();
  };
  TCproto.Pinch = function (e) {
    let z; let d; const
      p = this.pinched;
    if (!p) return;
    d = PinchDistance(e);
    z = p[1] * d / p[0];
    this.zoom = min(this.zoomMax, max(this.zoomMin, z));
    this.Zoom(this.zoom);
  };
  TCproto.EndPinch = function (e) {
    this.pinched = null;
  };
  TCproto.Pause = function () { this.paused = true; };
  TCproto.Resume = function () { this.paused = false; };
  TCproto.SetSpeed = function (i) {
    this.initial = i;
    this.yaw = i[0] * this.maxSpeed;
    this.pitch = i[1] * this.maxSpeed;
  };
  TCproto.FindTag = function (t) {
    if (!Defined(t)) return null;
    Defined(t.index) && (t = t.index);
    if (!IsObject(t)) return this.taglist[t];
    let srch; let tgt; let
      i;
    if (Defined(t.id)) srch = 'id', tgt = t.id;
    else if (Defined(t.text)) srch = 'innerText', tgt = t.text;

    for (i = 0; i < this.taglist.length; ++i) if (this.taglist[i].a[srch] == tgt) return this.taglist[i];
  };
  TCproto.RotateTag = function (tag, lt, lg, time, callback, active) {
    const t = tag.Calc(this.transform, 1); const v1 = new Vector(t.x, t.y, t.z);
    const v2 = MakeVector(lg, lt); const angle = v1.angle(v2); const
      u = v1.cross(v2).unit();
    if (angle == 0) {
      this.fixedCallbackTag = tag;
      this.fixedCallback = callback;
    } else {
      this.fixedAnim = {
        angle: -angle,
        axis: u,
        t: time,
        t0: TimeNow(),
        cb: callback,
        tag,
        active,
      };
    }
  };
  TCproto.TagToFront = function (tag, time, callback, active) {
    this.RotateTag(tag, 0, 0, time, callback, active);
  };
  TagCanvas.Start = function (id, l, o) {
    TagCanvas.Delete(id);
    TagCanvas.tc[id] = new TagCanvas(id, l, o);
  };
  function tccall(f, id) {
    TagCanvas.tc[id] && TagCanvas.tc[id][f]();
  }
  TagCanvas.Linear = function (t, t0) { return t0 / t; };
  TagCanvas.Smooth = function (t, t0) { return 0.5 - cos(t0 * Math.PI / t) / 2; };
  TagCanvas.Pause = function (id) { tccall('Pause', id); };
  TagCanvas.Resume = function (id) { tccall('Resume', id); };
  TagCanvas.Reload = function (id) { tccall('Load', id); };
  TagCanvas.Update = function (id) { tccall('Update', id); };
  TagCanvas.SetSpeed = function (id, speed) {
    if (IsObject(speed) && TagCanvas.tc[id]
        && !isNaN(speed[0]) && !isNaN(speed[1])) {
      TagCanvas.tc[id].SetSpeed(speed);
      return true;
    }
    return false;
  };
  TagCanvas.TagToFront = function (id, options) {
    if (!IsObject(options)) return false;
    options.lat = options.lng = 0;
    return TagCanvas.RotateTag(id, options);
  };
  TagCanvas.RotateTag = function (id, options) {
    if (IsObject(options) && TagCanvas.tc[id]) {
      if (isNaN(options.time)) options.time = 500;
      const tt = TagCanvas.tc[id].FindTag(options);
      if (tt) {
        TagCanvas.tc[id].RotateTag(tt, options.lat, options.lng,
          options.time, options.callback, options.active);
        return true;
      }
    }
    return false;
  };
  TagCanvas.Delete = function (id) {
    let i; let
      c;
    if (handlers[id]) {
      c = doc.getElementById(id);
      if (c) {
        for (i = 0; i < handlers[id].length; ++i) RemoveHandler(handlers[id][i][0], handlers[id][i][1], c);
      }
    }
    delete handlers[id];
    delete TagCanvas.tc[id];
  };
  TagCanvas.NextFrameRAF = function () {
    requestAnimationFrame(DrawCanvasRAF);
  };
  TagCanvas.NextFrameTimeout = function (iv) {
    setTimeout(DrawCanvas, iv);
  };
  TagCanvas.tc = {};
  TagCanvas.options = {
    z1: 20000,
    z2: 20000,
    z0: 0.0002,
    freezeActive: false,
    freezeDecel: false,
    activeCursor: 'pointer',
    pulsateTo: 1,
    pulsateTime: 3,
    reverse: false,
    depth: 0.5,
    maxSpeed: 0.05,
    minSpeed: 0,
    decel: 0.95,
    interval: 20,
    minBrightness: 0.1,
    maxBrightness: 1,
    outlineColour: '#ffff99',
    outlineThickness: 2,
    outlineOffset: 5,
    outlineMethod: 'outline',
    outlineRadius: 0,
    textColour: '#ff99ff',
    textHeight: 15,
    textFont: 'Helvetica, Arial, sans-serif',
    shadow: '#000',
    shadowBlur: 0,
    shadowOffset: [0, 0],
    initial: null,
    hideTags: true,
    zoom: 1,
    weight: false,
    weightMode: 'size',
    weightFrom: null,
    weightSize: 1,
    weightSizeMin: null,
    weightSizeMax: null,
    weightGradient: {
      0: '#f00', 0.33: '#ff0', 0.66: '#0f0', 1: '#00f',
    },
    txtOpt: true,
    txtScale: 2,
    frontSelect: false,
    wheelZoom: true,
    zoomMin: 0.3,
    zoomMax: 3,
    zoomStep: 0.05,
    shape: 'sphere',
    lock: null,
    tooltip: null,
    tooltipDelay: 300,
    tooltipClass: 'tctooltip',
    radiusX: 1,
    radiusY: 1,
    radiusZ: 1,
    stretchX: 1,
    stretchY: 1,
    offsetX: 0,
    offsetY: 0,
    shuffleTags: false,
    noSelect: false,
    noMouse: false,
    imageScale: 1,
    paused: false,
    dragControl: false,
    dragThreshold: 4,
    centreFunc: Nop,
    splitWidth: 0,
    animTiming: 'Smooth',
    clickToFront: false,
    fadeIn: 0,
    padding: 0,
    bgColour: null,
    bgRadius: 0,
    bgOutline: null,
    bgOutlineThickness: 0,
    outlineIncrease: 4,
    textAlign: 'centre',
    textVAlign: 'middle',
    imageMode: null,
    imagePosition: null,
    imagePadding: 2,
    imageAlign: 'centre',
    imageVAlign: 'middle',
    noTagsMessage: true,
    centreImage: null,
    pinchZoom: false,
    repeatTags: 0,
    minTags: 0,
    imageRadius: 0,
    scrollPause: false,
    outlineDash: 0,
    outlineDashSpace: 0,
    outlineDashSpeed: 1,
  };
  for (i in TagCanvas.options) TagCanvas[i] = TagCanvas.options[i];
  window.TagCanvas = TagCanvas;
  // set a flag for when the window has loaded
  AddHandler('load', () => { TagCanvas.loaded = 1; }, window);
}());
