import { useState, useEffect, useRef, useCallback } from "react";
import Layout from '../components/Layout';
import '../styles/wavecalc.css';

type TabId = "calc" | "interf" | "intensity" | "mas" | "phase";
type WaveFunc = "sin" | "cos";
type Direction = "+" | "-";
type WaveType = "spherical" | "cylindrical" | "plane";

interface ParsedWave {
  A: number; func: WaveFunc; k: number; omega: number;
  signK: number; signW: number; phi: number; varName: string;
}
interface WaveProps extends ParsedWave {
  lam: number; T: number; f: number; v: number; n: number;
  inVac: boolean; dirSign: number; dir: string;
  dDt_coeff: number; dDt_func: string; dDx_coeff: number; dDx_func: string;
  I_em: number | null;
}
interface ParamsState {
  A: string; Aunit: string;
  v: string; vunit: string;
  f: string; funit: string;
  T: string; Tunit: string;
  omega: string; omegaunit: string;
  lam: string; lamunit: string;
  k: string; n: string; phi: string;
  func: WaveFunc; dir: Direction; varName: string;
}
interface IntensityState {
  P: string; r1: string; r2: string; r1unit: string; r2unit: string;
  E0: string; I1: string; waveType: WaveType;
}
interface MasState {
  A: string; Aunit: string; k: string; m: string; munit: string;
  f: string; phi: string; t: string;
}
interface PhaseState {
  k: string; lam: string; lamunit: string; dx: string; dxunit: string;
  omega: string; omegaunit: string; dt: string; dtunit: string;
  dr: string; drunit: string; delta: string;
}

const PI = Math.PI;
const C_LIGHT = 3e8;

const unitConverters: Record<string, Record<string, number>> = {
  vunit:    { "m/s": 1, "km/s": 1e3, "km/h": 1/3.6, "cm/s": 0.01, "mph": 0.44704 },
  funit:    { "Hz": 1, "kHz": 1e3, "MHz": 1e6, "GHz": 1e9, "THz": 1e12, "rad/s": 1/(2*PI) },
  Tunit:    { "s": 1, "ms": 1e-3, "μs": 1e-6, "ns": 1e-9, "min": 60, "h": 3600 },
  omegaunit:{ "rad/s": 1, "rad/min": 1/60, "rad/h": 1/3600, "rpm": 2*PI/60 },
  lamunit:  { "m": 1, "cm": 0.01, "mm": 1e-3, "μm": 1e-6, "nm": 1e-9, "pm": 1e-12, "km": 1e3 },
  Aunit:    { "m": 1, "cm": 0.01, "mm": 1e-3, "V/m": 1, "Pa": 1, "mPa": 1e-3, "kPa": 1e3 },
  distunit: { "m": 1, "cm": 0.01, "mm": 1e-3, "km": 1e3, "μm": 1e-6, "nm": 1e-9 },
  munit:    { "kg": 1, "g": 1e-3, "mg": 1e-6 },
  deltaunit:{ "rad": 1, "°": PI/180, "grados": PI/180 },
};

function toSI(val: number, unitKey: string, unit: string): number {
  const map = unitConverters[unitKey];
  if (!map) return val;
  return val * (map[unit] ?? 1);
}

function evalExpr(s: string): number {
  if (!s || !s.trim()) return NaN;
  try {
    const clean = s
      .replace(/π/g, String(PI)).replace(/\bpi\b/gi, String(PI))
      .replace(/×/g, "*").replace(/·/g, "*")
      .replace(/[^0-9+\-*/.eE()\s]/g, "");
    // eslint-disable-next-line no-new-func
    return Function('"use strict";return (' + clean + ")")() as number;
  } catch { return NaN; }
}

function sup(n: number | string): string {
  const m: Record<string, string> = {
    "0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","-":"⁻","+":"⁺",
  };
  return String(n).split("").map(c => m[c] || c).join("");
}

function fmtV(v: number, d = 3): string {
  if (v === undefined || v === null || isNaN(v)) return "—";
  if (v === 0) return "0";
  const av = Math.abs(v);
  if (av >= 0.01 && av < 1e4) return String(parseFloat(v.toPrecision(d)));
  const e = Math.floor(Math.log10(av));
  const mant = v / Math.pow(10, e);
  return `${parseFloat(mant.toPrecision(d))}×10${sup(e)}`;
}

function fmtVH(v: number, d = 3): string {
  if (isNaN(v) || v === undefined) return "—";
  if (v === 0) return "0";
  const av = Math.abs(v);
  if (av >= 0.01 && av < 1e4) return String(parseFloat(v.toPrecision(d)));
  const e = Math.floor(Math.log10(av));
  const mant = v / Math.pow(10, e);
  return `${parseFloat(mant.toPrecision(d))}×10<sup>${e}</sup>`;
}

function fmtPi(v: number, d = 3): string {
  const r = v / PI;
  const rr = Math.round(r * 100) / 100;
  if (Math.abs(rr - Math.round(rr)) < 0.01 && Math.abs(rr) > 0.01)
    return `${Math.round(rr) === 1 ? "" : Math.round(rr)}π`;
  if (Math.abs(r - 0.5) < 0.01) return "π/2";
  if (Math.abs(r - 0.25) < 0.01) return "π/4";
  if (Math.abs(r + 0.5) < 0.01) return "-π/2";
  return fmtV(v, d);
}

function parseEq(raw: string): ParsedWave | null {
  if (!raw || !raw.trim()) return null;
  const varM = raw.match(/^(\w+)\s*=/);
  const varName = varM ? varM[1] : "E";
  let s = raw
    .replace(/^[^=]+=\s*/, "")
    .replace(/π/g, "*PI_").replace(/\bpi\b/gi, "*PI_")
    .toLowerCase()
    .replace(/\*pi_/g, "*3.14159265").replace(/pi_/g, "3.14159265")
    .replace(/×/g, "*").replace(/·/g, "*")
    .replace(/–/g, "-").replace(/−/g, "-")
    .trim();
  const re = /([\d.e+\-*/]+)\s*\*?\s*(sin|cos)\s*\(\s*(.+?)\s*\)/i;
  const m = s.match(re);
  if (!m) return null;
  function safeEval(expr: string): number {
    try {
      const c = expr.replace(/[^0-9+\-*/.e]/gi, "");
      // eslint-disable-next-line no-new-func
      return Function('"use strict";return (' + c + ")")() as number;
    } catch { return NaN; }
  }
  const A = safeEval(m[1]);
  const func = m[2].toLowerCase() as WaveFunc;
  const inner = m[3].replace(/\s/g, "");
  if (isNaN(A) || A === 0) return null;
  const tokens: { sign: number; body: string }[] = [];
  let cur = "", curSign = 1;
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i];
    if ((ch === "+" || ch === "-") && i > 0) {
      if (cur) tokens.push({ sign: curSign, body: cur });
      curSign = ch === "-" ? -1 : 1; cur = "";
    } else cur += ch;
  }
  if (cur) tokens.push({ sign: curSign, body: cur });
  let kVal: number | null = null, wVal: number | null = null;
  let signK = 1, signW = 1, phi = 0;
  tokens.forEach(({ sign, body }) => {
    if (body.includes("x")) {
      const kExpr = body.replace(/\*?x\*?/g, "").replace(/x/g, "") || "1";
      kVal = safeEval(kExpr); signK = sign;
    } else if (body.includes("t")) {
      const wExpr = body.replace(/\*?t\*?/g, "").replace(/t/g, "") || "1";
      wVal = safeEval(wExpr); signW = sign;
    } else {
      phi += sign * safeEval(body);
    }
  });
  if (!kVal || !wVal || isNaN(kVal) || isNaN(wVal)) return null;
  return { A, func, k: Math.abs(kVal), omega: Math.abs(wVal), signK, signW, phi, varName };
}

function computeWave(p: ParsedWave): WaveProps {
  const { A, func, k, omega, signK, signW, phi, varName } = p;
  const lam = (2 * PI) / k;
  const T = (2 * PI) / omega;
  const f = 1 / T;
  const v = omega / k;
  const n = C_LIGHT / v;
  const inVac = Math.abs(n - 1) < 0.005;
  let dirSign = 1;
  if (signK > 0 && signW < 0) dirSign = 1;
  else if (signK > 0 && signW > 0) dirSign = -1;
  else if (signK < 0 && signW > 0) dirSign = 1;
  else dirSign = -1;
  const dir = dirSign > 0 ? "+x (→)" : "−x (←)";
  const dDt_coeff = A * omega;
  const dDt_func = func === "sin" ? "cos" : "-sin";
  const dDx_coeff = A * k * signK;
  const dDx_func = func === "sin" ? "cos" : "-sin";
  const eps0 = 8.854e-12;
  const I_em = inVac ? 0.5 * eps0 * C_LIGHT * A * A : null;
  return { A, func, k, omega, lam, T, f, v, n, inVac, dirSign, dir, phi, varName, signK, signW, dDt_coeff, dDt_func, dDx_coeff, dDx_func, I_em };
}

interface Resolved {
  A: number; v: number; f: number; T: number;
  omega: number; lam: number; k: number; n: number;
}
function resolveParams(raw: Partial<Record<keyof Resolved, number>>): Resolved | string {
  let { A, v, f, T, omega, lam, k, n } = raw as Record<string, number>;
  const pass = () => {
    if (!isNaN(n) && n > 0 && isNaN(v)) v = C_LIGHT / n;
    if (!isNaN(v) && v > 0 && isNaN(n)) n = C_LIGHT / v;
    if (!isNaN(f) && isNaN(T)) T = 1 / f;
    if (!isNaN(T) && isNaN(f)) f = 1 / T;
    if (!isNaN(f) && isNaN(omega)) omega = 2 * PI * f;
    if (!isNaN(omega) && isNaN(f)) f = omega / (2 * PI);
    if (!isNaN(f) && isNaN(T)) T = 1 / f;
    if (!isNaN(lam) && isNaN(k)) k = (2 * PI) / lam;
    if (!isNaN(k) && isNaN(lam)) lam = (2 * PI) / k;
    if (!isNaN(omega) && !isNaN(k) && isNaN(v)) v = omega / k;
    if (!isNaN(f) && !isNaN(lam) && isNaN(v)) v = f * lam;
    if (!isNaN(lam) && !isNaN(T) && isNaN(v)) v = lam / T;
    if (!isNaN(v) && !isNaN(omega) && isNaN(k)) { k = omega / v; lam = (2 * PI) / k; }
    if (!isNaN(v) && !isNaN(f) && isNaN(lam)) { lam = v / f; k = (2 * PI) / lam; }
    if (!isNaN(v) && !isNaN(k) && isNaN(omega)) { omega = v * k; f = omega / (2 * PI); }
    if (!isNaN(v) && isNaN(n)) n = C_LIGHT / v;
    if (!isNaN(n) && n > 0 && isNaN(v)) v = C_LIGHT / n;
    if (!isNaN(f) && isNaN(T)) T = 1 / f;
    if (!isNaN(T) && isNaN(f)) f = 1 / T;
    if (!isNaN(f) && isNaN(omega)) omega = 2 * PI * f;
    if (!isNaN(k) && isNaN(lam)) lam = (2 * PI) / k;
    if (!isNaN(lam) && isNaN(k)) k = (2 * PI) / lam;
  };
  pass(); pass(); pass();
  const missing: string[] = [];
  if (isNaN(A) || A === 0) missing.push("A (amplitud)");
  if (isNaN(v) || v <= 0) missing.push("v (velocidad), o n + parámetro temporal, o λ + T/f, o k + ω");
  if (isNaN(omega)) missing.push("ω / f / T (parámetro temporal)");
  if (isNaN(k)) missing.push("k / λ (parámetro espacial)");
  if (missing.length > 0) return `Faltan datos:\n• ${missing.join("\n• ")}`;
  return { A, v, f: f!, T: T!, omega: omega!, lam: lam!, k: k!, n: n! };
}

function renderParamsResolved(r: Resolved, s: ParamsState): string {
  const rows = [
    { l: "A (amplitud)", v: fmtVH(r.A), src: s.A ? `dado (${s.Aunit})` : "calculado" },
    { l: "v (velocidad)", v: fmtVH(r.v) + " m/s", src: s.v ? `dado (${s.vunit})` : s.n ? "v = c/n" : "calculado" },
    { l: "f (frecuencia)", v: fmtVH(r.f) + " Hz", src: s.f ? `dado (${s.funit})` : s.T ? "f = 1/T" : s.omega ? "f = ω/2π" : "calculado" },
    { l: "T (período)", v: fmtVH(r.T) + " s", src: s.T ? `dado (${s.Tunit})` : "T = 1/f" },
    { l: "ω (pulsación)", v: fmtVH(r.omega) + " rad/s", src: s.omega ? `dado (${s.omegaunit})` : "ω = 2πf" },
    { l: "λ (longitud de onda)", v: fmtVH(r.lam) + " m", src: s.lam ? `dado (${s.lamunit})` : s.k ? "λ = 2π/k" : "λ = v/f" },
    { l: "k (número de onda)", v: fmtVH(r.k) + " rad/m", src: s.k ? "dado" : "k = 2π/λ" },
    { l: "n (índice refracción)", v: r.n.toFixed(5), src: s.n ? "dado" : "n = c/v" },
  ];
  return `
    <div class="res-sep">▸ CADENA DE RESOLUCIÓN</div>
    <div class="derived-grid">${rows.map(row => `
      <div class="dc" style="display:flex;justify-content:space-between;align-items:center;padding:.6rem 1.1rem;">
        <div><div class="dct" style="margin-bottom:.2rem">${row.l}</div><div class="dce" style="font-size:.82rem;color:var(--cyan)">${row.v}</div></div>
        <div style="font-size:.58rem;padding:.15rem .5rem;border:1px solid ${row.src.startsWith("dado") ? "var(--green)" : "rgba(0,229,255,0.3)"};color:${row.src.startsWith("dado") ? "var(--green)" : "var(--dim)"}">
          ${row.src}
        </div>
      </div>`).join("")}
    </div>`;
}

function renderWaveResults(w: WaveProps): string {
  const sgKs = w.signK > 0 ? "" : "-";
  const phiStr = w.phi !== 0 ? ` ${w.phi > 0 ? "+" : "-"} ${fmtPi(Math.abs(w.phi))} rad` : "";
  const kS = fmtV(w.k), wS = fmtV(w.omega);
  const eqLine = `${w.varName} = <span class="hi">${w.A}</span> · ${w.func}(<span class="hic">${sgKs}${kS}</span>·x <span style="color:var(--dim)">${w.signW > 0 ? "+" : "−"}</span> <span class="hip">${wS}</span>·t${phiStr})`;
  const props = [
    { l: "Amplitud A", v: fmtVH(w.A), a: "máximo desplazamiento", s: "A", c: "" },
    { l: "Long. onda λ", v: fmtVH(w.lam) + " <small>m</small>", a: `${fmtV(w.lam * 1e9, 3)} nm · ${fmtV(w.lam * 100, 3)} cm`, s: "λ", c: "g" },
    { l: "Período T", v: fmtVH(w.T) + " <small>s</small>", a: `f = ${fmtVH(w.f)} Hz`, s: "T", c: "gold" },
    { l: "Frecuencia f", v: fmtVH(w.f) + " <small>Hz</small>", a: `${fmtV(w.f / 1e12, 3)} THz · ${fmtV(w.f / 1e9, 3)} GHz`, s: "f", c: "gold" },
    { l: "Vel. fase v", v: fmtVH(w.v) + " <small>m/s</small>", a: `${(w.v / C_LIGHT).toFixed(6)}c · ${fmtV(w.v / 1e3, 3)} km/s`, s: "v", c: "o" },
    { l: "Núm. onda k", v: fmtVH(w.k) + " <small>rad/m</small>", a: "k = 2π/λ", s: "k", c: "" },
    { l: "Pulsación ω", v: fmtVH(w.omega) + " <small>rad/s</small>", a: `= 2πf · ${fmtV(w.omega * 60, 3)} rad/min`, s: "ω", c: "p" },
    { l: "Índ. refrac n", v: w.inVac ? "1.000" : w.n.toFixed(5), a: w.inVac ? "propagación en el vacío" : `medio material · v=${fmtVH(w.v)} m/s`, s: "n", c: w.inVac ? "g" : "r" },
  ];
  const dKsgn = w.signK > 0 ? "" : "-";
  const dwStr = fmtV(w.dDt_coeff);
  const dkStr = `${dKsgn}${fmtV(w.dDx_coeff)}`;
  const deriveds = [
    { t: `D${w.varName}/Dt — Derivada temporal`, e: `D${w.varName}/Dt = <span class="hi">${dwStr}</span> · <span class="hig">${w.dDt_func}</span>(<span class="hic">${dKsgn}${fmtV(w.k)}</span>x ${w.signW > 0 ? "+" : "−"} <span class="hip">${fmtV(w.omega)}</span>t${phiStr})` },
    { t: `D${w.varName}/Dx — Derivada espacial`, e: `D${w.varName}/Dx = <span class="hi">${dkStr}</span> · <span class="hig">${w.dDx_func}</span>(<span class="hic">${dKsgn}${fmtV(w.k)}</span>x ${w.signW > 0 ? "+" : "−"} <span class="hip">${fmtV(w.omega)}</span>t${phiStr})` },
    { t: `D²${w.varName}/Dt² — Derivada segunda temporal`, e: `D²${w.varName}/Dt² = <span class="hir">−${fmtV(w.A * w.omega * w.omega, 3)}</span> · ${w.func}(<span class="hic">${dKsgn}${fmtV(w.k)}</span>x ${w.signW > 0 ? "+" : "−"} <span class="hip">${fmtV(w.omega)}</span>t${phiStr})<br><small style="color:var(--dim)">= −ω²·${w.varName} (ecuación de onda)</small>` },
    { t: "Relación de dispersión v = ω/k", e: `v = ω/k = <span class="hic">${fmtVH(w.omega)}</span> / <span class="hio">${fmtVH(w.k)}</span> = <span class="hi">${fmtVH(w.v)} m/s</span><br>λ·f = v ✓ &nbsp; λ = ${fmtVH(w.lam)} m · f = ${fmtVH(w.f)} Hz` },
    { t: "Desfase espacial Δφ = k·Δx", e: `Δφ = <span class="hic">${fmtVH(w.k)}</span> · Δx<br>Δx=λ → Δφ=2π (360°) &nbsp; Δx=λ/2 → Δφ=π (180°) &nbsp; Δx=λ/4 → Δφ=π/2 (90°)` },
    { t: "Desfase temporal Δφ = ω·Δt", e: `Δφ = <span class="hip">${fmtVH(w.omega)}</span> · Δt<br>Δt=T → Δφ=2π &nbsp; Δt=T/2 → Δφ=π &nbsp; Δt=T/4 → Δφ=π/2` },
    { t: `Intensidad${w.I_em !== null ? " (EM vacío)" : " (EM medio)"}`, e: w.I_em !== null ? `I = ½ε₀c·E₀² = <span class="hig">${fmtVH(w.I_em)} W/m²</span><br>I ∝ A² → si A×2 → I×4` : `I = ½ε₀v·E₀²/n &nbsp;(n=${w.n.toFixed(4)})<br>I ∝ A² → si A×2 → I×4` },
    { t: "Ecuación de ondas (D'Alembert)", e: `∂²${w.varName}/∂x² = (1/v²)·∂²${w.varName}/∂t²<br>v = <span class="hic">${fmtVH(w.v)} m/s</span> &nbsp; 1/v² = ${fmtVH(1/(w.v*w.v), 3)} s²/m²` },
  ];
  const dotCol = w.inVac ? "var(--green)" : "var(--orange)";
  const freqZone = w.f > 7e14 ? "Ultravioleta" : w.f > 4e14 ? `Luz visible (${fmtV(w.lam * 1e9, 3)} nm)` : w.f > 1e11 ? "Infrarrojo/microondas" : w.f > 1e6 ? "Radiofrecuencia" : "Baja frecuencia / mecánica";
  return `
    <div class="res-sep">▸ ECUACIÓN DE LA ONDA</div>
    <div class="eq-box"><div class="eq-text">${eqLine}</div></div>
    <div class="res-sep">▸ PROPIEDADES</div>
    <div class="props-grid">${props.map(p => `<div class="pc ${p.c}"><div class="pcl">${p.l}</div><div class="pcv">${p.v}</div><div class="pca">${p.a}</div><div class="pcs">${p.s}</div></div>`).join("")}</div>
    <div class="res-sep">▸ DERIVADAS Y RELACIONES</div>
    <div class="derived-grid">${deriveds.map(d => `<div class="dc"><div class="dct">${d.t}</div><div class="dce">${d.e}</div></div>`).join("")}</div>
    <div class="res-sep">▸ ANÁLISIS</div>
    <div class="status-bar">
      <div class="sdot" style="background:${dotCol};box-shadow:0 0 8px ${dotCol}"></div>
      <span style="color:${dotCol};font-weight:700">${w.inVac ? "✓ Vacío" : "✗ Medio material"}</span>
      <span style="color:var(--dim)">·</span>
      <span>Propagación: <b style="color:${w.dirSign > 0 ? "var(--green)" : "var(--red)"}">${w.dir}</b></span>
      <span style="color:var(--dim)">·</span>
      <span>n = ${w.n.toFixed(5)}</span>
      <span style="color:var(--dim)">·</span>
      <span style="color:var(--purple)">${freqZone}</span>
    </div>`;
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,700&family=Syne:wght@700;800;900&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#04050d;--panel:#080c18;--panel2:#0d1220;
  --b:rgba(255,255,255,0.07);--b2:rgba(255,255,255,0.04);
  --cyan:#00e5ff;--green:#00ff88;--orange:#ff7c38;
  --red:#ff3366;--gold:#ffd060;--purple:#b87fff;
  --white:#dde8f5;--dim:rgba(221,232,245,0.38);
  --grid:rgba(0,229,255,0.03);
}
body{background:var(--bg);color:var(--white);font-family:'JetBrains Mono',monospace;
  min-height:100vh;
  background-image:linear-gradient(var(--grid) 1px,transparent 1px),
    linear-gradient(90deg,var(--grid) 1px,transparent 1px);
  background-size:28px 28px;}
.wc-header{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem;
  padding:1rem 1.8rem;border-bottom:1px solid var(--b);background:rgba(4,5,13,.95);
  backdrop-filter:blur(12px);position:sticky;top:0;z-index:200;}
.wc-header h1{font-family:'Syne',sans-serif;font-weight:900;font-size:clamp(1rem,2.5vw,1.35rem);letter-spacing:-.02em;}
.wc-header h1 em{font-style:normal;color:var(--cyan);}
.hbadge{font-size:.58rem;padding:.2rem .6rem;border:1px solid var(--cyan);color:var(--cyan);letter-spacing:.2em;}
.mode-bar{display:flex;flex-wrap:wrap;border-bottom:1px solid var(--b);background:var(--panel);}
.mode-btn{flex:1;min-width:130px;padding:.8rem .5rem;text-align:center;font-size:.63rem;
  letter-spacing:.08em;text-transform:uppercase;cursor:pointer;border-bottom:2px solid transparent;
  color:var(--dim);transition:all .2s;border-right:1px solid var(--b);font-family:'JetBrains Mono',monospace;background:none;}
.mode-btn:last-child{border-right:none;}
.mode-btn:hover{color:var(--white);}
.mode-btn.active{color:var(--cyan);border-bottom-color:var(--cyan);background:rgba(0,229,255,.04);}
.mbico{font-size:.9rem;display:block;margin-bottom:.2rem;}
.section{max-width:960px;margin:0 auto;padding:1.5rem 1.4rem;}
.sec-title{font-family:'Syne',sans-serif;font-weight:800;font-size:1rem;color:var(--cyan);margin-bottom:.3rem;}
.sec-sub{font-size:.65rem;color:var(--dim);margin-bottom:1.3rem;line-height:1.6;}
.sec-group-label{font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:.4rem;margin-top:.8rem;padding-bottom:.3rem;border-bottom:1px solid var(--b);}
.inp-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:.85rem;margin-bottom:.85rem;}
.inp-group{display:flex;flex-direction:column;gap:.3rem;}
.inp-group label{font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--dim);}
.inp-with-unit{display:flex;flex-direction:column;gap:.28rem;}
.inp-with-unit input{width:100%;}
.unit-pills{display:flex;flex-wrap:wrap;gap:.25rem;}
.unit-pill{font-size:.58rem;font-family:'JetBrains Mono',monospace;padding:.18rem .55rem;border:1px solid var(--b);color:var(--dim);cursor:pointer;transition:all .15s;background:transparent;border-radius:0;letter-spacing:.05em;}
.unit-pill:hover{color:var(--white);border-color:rgba(255,255,255,0.2);}
.unit-pill.active{color:var(--cyan);border-color:var(--cyan);background:rgba(0,229,255,.08);}
.inp-group input,.inp-group select{background:var(--panel2);border:1px solid var(--b);color:var(--white);font-family:'JetBrains Mono',monospace;font-size:.82rem;padding:.55rem .8rem;outline:none;transition:border-color .2s;width:100%;}
.inp-group input:focus,.inp-group select:focus{border-color:var(--cyan);}
.iunit{font-size:.58rem;color:var(--dim);}
.inp-full{grid-column:1/-1;}
.inp-eq input{font-size:.88rem;}
.radio-row{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.2rem;}
.rbtn{padding:.3rem .7rem;font-size:.63rem;border:1px solid var(--b);cursor:pointer;color:var(--dim);transition:all .15s;font-family:'JetBrains Mono',monospace;background:none;}
.rbtn:hover{color:var(--white);}
.rbtn.sel{border-color:var(--cyan);color:var(--cyan);background:rgba(0,229,255,.07);}
.hint{font-size:.62rem;color:var(--dim);line-height:1.65;margin-bottom:.8rem;padding:.6rem .8rem;background:var(--b2);border-left:2px solid rgba(0,229,255,.2);}
.hint code{color:var(--gold);background:rgba(255,208,96,.09);padding:.05rem .3rem;}
.btn-calc{font-family:'JetBrains Mono',monospace;font-size:.75rem;font-weight:700;padding:.6rem 2rem;border:none;cursor:pointer;letter-spacing:.12em;background:var(--cyan);color:#000;transition:all .2s;}
.btn-calc:hover{background:#fff;box-shadow:0 0 20px var(--cyan);}
.btn-sm2{font-family:'JetBrains Mono',monospace;font-size:.62rem;padding:.3rem .7rem;border:1px solid var(--b);background:transparent;color:var(--dim);cursor:pointer;transition:all .15s;}
.btn-sm2:hover,.btn-sm2.on{border-color:var(--cyan);color:var(--cyan);background:rgba(0,229,255,.06);}
.err{font-size:.7rem;color:var(--red);padding:.5rem .8rem;background:rgba(255,51,102,.07);border-left:3px solid var(--red);margin-top:.5rem;white-space:pre-line;}
.calc-toggle{display:flex;gap:0;margin-bottom:1.4rem;border:1px solid var(--b);width:fit-content;}
.calc-toggle-btn{padding:.5rem 1.4rem;font-family:'JetBrains Mono',monospace;font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;border:none;background:transparent;color:var(--dim);transition:all .18s;}
.calc-toggle-btn.active{background:var(--cyan);color:#000;font-weight:700;}
.calc-toggle-btn:not(.active):hover{color:var(--white);background:rgba(255,255,255,.04);}
.mode-divider{width:1px;background:var(--b);}
.results-wrap{max-width:960px;margin:0 auto;padding:0 1.4rem 2rem;}
.res-sep{font-family:'Syne',sans-serif;font-weight:800;font-size:.6rem;letter-spacing:.35em;text-transform:uppercase;color:var(--cyan);padding:1rem 0 .6rem;border-top:1px solid var(--b);margin-top:.5rem;}
.res-sep:first-child{border-top:none;padding-top:0;}
.eq-box{background:var(--panel2);border:1px solid rgba(0,229,255,.15);padding:1.1rem 1.4rem;margin-bottom:.8rem;position:relative;overflow:hidden;}
.eq-box::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--cyan),var(--purple));}
.eq-text{font-size:clamp(.8rem,2vw,1.05rem);line-height:1.8;}
.props-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1px;background:var(--b);margin-bottom:1px;}
.pc{background:var(--panel);padding:.85rem 1rem;position:relative;}
.pc .pcl{font-size:.55rem;letter-spacing:.18em;text-transform:uppercase;color:var(--dim);margin-bottom:.3rem;}
.pc .pcv{font-family:'Syne',sans-serif;font-weight:800;font-size:.95rem;color:var(--cyan);margin-bottom:.1rem;}
.pc .pca{font-size:.58rem;color:var(--dim);}
.pc .pcs{position:absolute;top:.6rem;right:.7rem;font-size:1.2rem;color:rgba(255,255,255,.04);font-family:'Syne',sans-serif;font-weight:900;}
.pc.g .pcv{color:var(--green);}.pc.o .pcv{color:var(--orange);}
.pc.gold .pcv{color:var(--gold);}.pc.p .pcv{color:var(--purple);}.pc.r .pcv{color:var(--red);}
.derived-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1px;background:var(--b);margin-bottom:.8rem;}
.dc{background:var(--panel2);padding:.85rem 1.1rem;}
.dct{font-size:.55rem;letter-spacing:.2em;color:var(--dim);text-transform:uppercase;margin-bottom:.45rem;}
.dce{font-size:.75rem;line-height:1.75;}
.status-bar{display:flex;align-items:center;gap:.8rem;flex-wrap:wrap;padding:.7rem 1rem;background:var(--panel);border:1px solid var(--b);font-size:.7rem;margin-bottom:.8rem;}
.sdot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}
.canvas-wrap{border-top:1px solid var(--b);}
.cbar{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem;padding:.6rem 1.4rem;background:var(--panel);border-bottom:1px solid var(--b);max-width:960px;margin:0 auto;}
.ctitle{font-family:'Syne',sans-serif;font-weight:800;font-size:.62rem;letter-spacing:.2em;color:var(--cyan);}
.cctrl{display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;}
input[type=range]{accent-color:var(--cyan);width:80px;}
.couter{max-width:960px;margin:0 auto;}
canvas{display:block;width:100%;height:auto;background:var(--panel);}
.live-row{display:flex;gap:1.2rem;flex-wrap:wrap;padding:.45rem 1.4rem;background:rgba(0,229,255,.025);border-top:1px solid var(--b);max-width:960px;margin:0 auto;font-size:.65rem;}
.lv{display:flex;flex-direction:column;gap:.1rem;}
.lvl{font-size:.55rem;letter-spacing:.12em;color:var(--dim);}
.lvv{font-family:'Syne',sans-serif;font-weight:700;font-size:.82rem;}
.hi{color:var(--gold);}.hic{color:var(--cyan);}.hip{color:var(--purple);}
.hig{color:var(--green);}.hio{color:var(--orange);}.hir{color:var(--red);}
.canvas-legend{display:flex;gap:1.2rem;flex-wrap:wrap;padding:.35rem 1.4rem;background:var(--panel);border-top:1px solid var(--b);max-width:960px;margin:0 auto;font-size:.6rem;}
.cl-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:2px;}
`;

function RadioGroup({ options, value, onChange }: { options: {v:string;l:string}[]; value: string; onChange:(v:string)=>void }) {
  return (
    <div className="radio-row">
      {options.map(o => (
        <button key={o.v} className={`rbtn${value===o.v?" sel":""}`} onClick={()=>onChange(o.v)}>{o.l}</button>
      ))}
    </div>
  );
}

function InputUnit({ value, onChange, unit, onUnitChange, units, placeholder }: {
  value: string; onChange:(v:string)=>void;
  unit: string; onUnitChange:(v:string)=>void;
  units: string[]; placeholder?: string;
}) {
  return (
    <div className="inp-with-unit">
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||""} />
      <div className="unit-pills">
        {units.map(u=>(
          <button key={u} className={`unit-pill${unit===u?" active":""}`} onClick={()=>onUnitChange(u)}>{u}</button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// CANVAS — ahora acepta wave2 opcional
// ═══════════════════════════════════════════
function drawCanvas(
  ctx: CanvasRenderingContext2D, w: WaveProps, t: number, WW: number, WH: number,
  setLiveData: (d:{nT:number;e0:number;e1:number;e2:number})=>void,
  wave2?: WaveProps | null
) {
  const WCY = WH / 2;
  ctx.clearRect(0, 0, WW, WH);
  const bg = ctx.createRadialGradient(WW/2,WCY,10,WW/2,WCY,380);
  bg.addColorStop(0,"rgba(0,229,255,0.025)"); bg.addColorStop(1,"transparent");
  ctx.fillStyle=bg; ctx.fillRect(0,0,WW,WH);

  const L = w.lam;
  const xs = WW/(3.5*L);
  // Escala vertical usando la amplitud máxima de ambas ondas
  const maxA = Math.max(w.A, wave2?.A ?? 0);
  const ys = (WH*0.38)/maxA;
  const ox = 50;

  ctx.strokeStyle="rgba(255,255,255,0.08)"; ctx.lineWidth=1;
  ctx.beginPath(); ctx.moveTo(ox,WCY); ctx.lineTo(WW,WCY); ctx.stroke();
  ctx.setLineDash([3,8]); ctx.strokeStyle="rgba(255,255,255,0.05)";
  for(let n=0;n<=4;n++){
    const sx=ox+n*L*xs; if(sx>WW) break;
    ctx.beginPath(); ctx.moveTo(sx,18); ctx.lineTo(sx,WH-16); ctx.stroke();
    if(n>0){ctx.fillStyle="rgba(255,255,255,0.18)";ctx.font="10px JetBrains Mono";ctx.textAlign="center";ctx.fillText(n+"λ",sx,WH-4);}
  }
  ctx.setLineDash([]);

  // Labels de leyenda
  ctx.fillStyle="rgba(0,229,255,0.7)";ctx.font="11px JetBrains Mono";ctx.textAlign="left";
  ctx.fillText(w.varName+(wave2?"₁":"")+" →",ox+4,16);
  if(wave2){
    ctx.fillStyle="rgba(184,127,255,0.7)";
    ctx.fillText(wave2.varName+"₂ →",ox+4,30);
  }

  ctx.fillStyle="rgba(255,255,255,0.2)";ctx.textAlign="right";
  ctx.fillText("+"+fmtV(maxA,2),ox-2,WCY-WH*0.38+4);
  ctx.fillText("0",ox-2,WCY+4);
  ctx.fillText("-"+fmtV(maxA,2),ox-2,WCY+WH*0.38+4);

  const E1=(xM:number)=>{const ph=w.signK*w.k*xM+w.signW*w.omega*t+w.phi;return w.A*(w.func==="sin"?Math.sin(ph):Math.cos(ph));};

  // Relleno onda 1
  ctx.beginPath();
  for(let px=ox;px<=WW;px++){const xM=(px-ox)/xs;const sy=WCY-E1(xM)*ys;px===ox?ctx.moveTo(px,sy):ctx.lineTo(px,sy);}
  ctx.lineTo(WW,WCY);ctx.lineTo(ox,WCY);ctx.closePath();
  const fg=ctx.createLinearGradient(0,WCY-WH*0.38,0,WCY+WH*0.38);
  fg.addColorStop(0,"rgba(0,229,255,0.10)");fg.addColorStop(0.5,"rgba(0,229,255,0.01)");fg.addColorStop(1,"rgba(0,229,255,0.10)");
  ctx.fillStyle=fg; ctx.fill();

  // Línea onda 1 (cyan)
  ctx.beginPath();
  for(let px=ox;px<=WW;px++){const xM=(px-ox)/xs;const sy=WCY-E1(xM)*ys;px===ox?ctx.moveTo(px,sy):ctx.lineTo(px,sy);}
  ctx.strokeStyle="#00e5ff";ctx.lineWidth=2.5;ctx.shadowColor="#00e5ff";ctx.shadowBlur=12;ctx.stroke();ctx.shadowBlur=0;

  // Línea onda 2 (purple) — NUEVO
  if(wave2){
    const E2=(xM:number)=>{const ph=wave2.signK*wave2.k*xM+wave2.signW*wave2.omega*t+wave2.phi;return wave2.A*(wave2.func==="sin"?Math.sin(ph):Math.cos(ph));};
    ctx.beginPath();
    for(let px=ox;px<=WW;px++){const xM=(px-ox)/xs;const sy=WCY-E2(xM)*ys;px===ox?ctx.moveTo(px,sy):ctx.lineTo(px,sy);}
    ctx.strokeStyle="#b87fff";ctx.lineWidth=2;ctx.shadowColor="#b87fff";ctx.shadowBlur=8;ctx.stroke();ctx.shadowBlur=0;
  }

  // Marcadores onda 1
  const markers:[number,string,string][] = [[0,"#00ff88","x=0"],[L/4,"#ffd060","λ/4"],[L/2,"#b87fff","λ/2"]];
  markers.forEach(([xM,col,lbl])=>{
    const sx=ox+xM*xs,Ev=E1(xM),sy=WCY-Ev*ys;
    ctx.beginPath();ctx.moveTo(sx,WCY);ctx.lineTo(sx,sy);
    ctx.strokeStyle=col+"55";ctx.lineWidth=1;ctx.setLineDash([4,5]);ctx.stroke();ctx.setLineDash([]);
    ctx.beginPath();ctx.arc(sx,sy,4.5,0,2*PI);
    ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=10;ctx.fill();ctx.shadowBlur=0;
    ctx.fillStyle=col;ctx.font="10px JetBrains Mono";ctx.textAlign="center";ctx.fillText(lbl,sx,sy-10);
  });

  const ac=w.dirSign>0?"#00ff88":"#ff3366",ad=w.dirSign>0?1:-1;
  const ax=WW*0.7,aLen=70,ay=22;
  ctx.strokeStyle=ac;ctx.lineWidth=2;ctx.shadowColor=ac;ctx.shadowBlur=6;
  ctx.beginPath();ctx.moveTo(ax-(aLen*ad)/2,ay);ctx.lineTo(ax+(aLen*ad)/2,ay);ctx.stroke();
  ctx.beginPath();ctx.moveTo(ax+(aLen*ad)/2,ay);
  ctx.lineTo(ax+(aLen*ad)/2-11*ad*Math.cos(0.4),ay-7);
  ctx.lineTo(ax+(aLen*ad)/2-11*ad*Math.cos(0.4),ay+7);
  ctx.closePath();ctx.fillStyle=ac;ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle=ac;ctx.font="10px JetBrains Mono";ctx.textAlign="center";
  ctx.fillText("v="+fmtV(w.v,3)+" m/s",ax,ay-10);

  setLiveData({nT:t/((2*PI)/w.omega),e0:E1(0),e1:E1(L/4),e2:E1(L/2)});
}

// CanvasViz acepta wave2 opcional
function CanvasViz({wave, wave2}:{wave:WaveProps|null; wave2?:WaveProps|null}) {
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const animRef=useRef<number>(0);
  const stateRef=useRef({tSim:0,lastTs:0,playing:true,speed:1});
  const [playing,setPlaying]=useState(true);
  const [speed,setSpeed]=useState(1);
  const [live,setLive]=useState({nT:0,e0:0,e1:0,e2:0});
  const setLiveData=useCallback((d:{nT:number;e0:number;e1:number;e2:number})=>setLive(d),[]);

  useEffect(()=>{stateRef.current.tSim=0;stateRef.current.lastTs=0;stateRef.current.playing=true;setPlaying(true);},[wave]);
  useEffect(()=>{stateRef.current.playing=playing;},[playing]);
  useEffect(()=>{stateRef.current.speed=speed;},[speed]);

  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;
    const ctx=canvas.getContext("2d");if(!ctx)return;
    const T_VIS=3.0;
    const loop=(ts:number)=>{
      const s=stateRef.current;
      if(!s.lastTs)s.lastTs=ts;
      const dt=Math.min((ts-s.lastTs)/1000,0.05);s.lastTs=ts;
      if(wave&&s.playing){const rP=(2*PI)/wave.omega;s.tSim+=(dt/T_VIS)*rP*s.speed;}
      if(wave)drawCanvas(ctx,wave,s.tSim,canvas.width,canvas.height,setLiveData,wave2);
      animRef.current=requestAnimationFrame(loop);
    };
    animRef.current=requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(animRef.current);
  },[wave,wave2,setLiveData]);

  if(!wave)return null;
  return(
    <div className="canvas-wrap">
      <div className="cbar">
        <div className="ctitle">▸ VISUALIZACIÓN DE LA ONDA{wave2?" (SUPERPOSICIÓN)":""}</div>
        <div className="cctrl">
          <button className={`btn-sm2${playing?" on":""}`} onClick={()=>{stateRef.current.lastTs=0;setPlaying(p=>!p);}}>
            {playing?"⏸":"▶"}
          </button>
          <button className="btn-sm2" onClick={()=>{stateRef.current.tSim=0;stateRef.current.lastTs=0;}}>↺</button>
          <span style={{fontSize:".6rem",color:"var(--dim)"}}>vel</span>
          <input type="range" min="0.1" max="5" step="0.1" value={speed} onChange={e=>setSpeed(parseFloat(e.target.value))}/>
          <span style={{fontSize:".6rem",color:"var(--dim)"}}>{speed.toFixed(1)}×</span>
        </div>
      </div>
      <div className="couter"><canvas ref={canvasRef} width={960} height={280}/></div>
      {wave2&&(
        <div className="canvas-legend">
          <div style={{display:"flex",alignItems:"center",gap:".4rem"}}>
            <div className="cl-dot" style={{background:"#00e5ff",boxShadow:"0 0 6px #00e5ff"}}/>
            <span style={{color:"#00e5ff"}}>{wave.varName}₁ — Onda 1</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:".4rem"}}>
            <div className="cl-dot" style={{background:"#b87fff",boxShadow:"0 0 6px #b87fff"}}/>
            <span style={{color:"#b87fff"}}>{wave2.varName}₂ — Onda 2</span>
          </div>
        </div>
      )}
      <div className="live-row">
        <div className="lv"><span className="lvl">t (períodos)</span><span className="lvv" style={{color:"var(--cyan)"}}>{live.nT.toFixed(3)} T</span></div>
        <div className="lv"><span className="lvl">{wave.varName}{wave2?"₁":""} en x=0</span><span className="lvv" style={{color:"var(--green)"}}>{live.e0.toFixed(3)}</span></div>
        <div className="lv"><span className="lvl">{wave.varName}{wave2?"₁":""} en x=λ/4</span><span className="lvv" style={{color:"var(--gold)"}}>{live.e1.toFixed(3)}</span></div>
        <div className="lv"><span className="lvl">{wave.varName}{wave2?"₁":""} en x=λ/2</span><span className="lvv" style={{color:"var(--purple)"}}>{live.e2.toFixed(3)}</span></div>
        <div className="lv"><span className="lvl">v fase</span><span className="lvv" style={{color:"var(--orange)"}}>{fmtV(wave.v,3)} m/s</span></div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PESTAÑA CALCULADORA
// ═══════════════════════════════════════════
function TabCalculadora({onResult}:{onResult:(html:string,wave:WaveProps,wave2?:WaveProps)=>void}) {
  const [mode,setMode]=useState<"eq"|"params">("eq");
  const [eqVal,setEqVal]=useState("E = 500 sin(5e6*pi*x + 1.2e15*pi*t)");
  const [eqErr,setEqErr]=useState(false);
  const EMPTY:ParamsState={
    A:"",Aunit:"V/m",v:"",vunit:"m/s",f:"",funit:"Hz",
    T:"",Tunit:"s",omega:"",omegaunit:"rad/s",
    lam:"",lamunit:"m",k:"",n:"",phi:"",
    func:"sin",dir:"+",varName:"E",
  };
  const [s,setS]=useState<ParamsState>(EMPTY);
  const [errMsg,setErrMsg]=useState("");
  const up=(key:keyof ParamsState,val:string)=>setS(p=>({...p,[key]:val}));

  const calcEq=()=>{
    const p=parseEq(eqVal);
    if(!p){setEqErr(true);return;}
    setEqErr(false);
    onResult(renderWaveResults(computeWave(p)),computeWave(p));
  };

  const filledCount=[s.A,s.v,s.f,s.T,s.omega,s.lam,s.k,s.n].filter(x=>x.trim()!=="").length;

  const calcParams=()=>{
    setErrMsg("");
    const parse=(x:string)=>x.trim()?evalExpr(x):NaN;
    const A_si  = !isNaN(parse(s.A)) ? toSI(parse(s.A),"Aunit",s.Aunit) : NaN;
    const v_si  = !isNaN(parse(s.v)) ? toSI(parse(s.v),"vunit",s.vunit) : NaN;
    const f_si  = !isNaN(parse(s.f)) ? toSI(parse(s.f),"funit",s.funit) : NaN;
    const T_si  = !isNaN(parse(s.T)) ? toSI(parse(s.T),"Tunit",s.Tunit) : NaN;
    const w_si  = !isNaN(parse(s.omega)) ? toSI(parse(s.omega),"omegaunit",s.omegaunit) : NaN;
    const lam_si= !isNaN(parse(s.lam)) ? toSI(parse(s.lam),"lamunit",s.lamunit) : NaN;
    const k_si  = !isNaN(parse(s.k)) ? parse(s.k) : NaN;
    const n_si  = !isNaN(parse(s.n)) ? parse(s.n) : NaN;
    const resolved=resolveParams({A:A_si,v:v_si,f:f_si,T:T_si,omega:w_si,lam:lam_si,k:k_si,n:n_si});
    if(typeof resolved==="string"){setErrMsg(resolved);return;}
    const phi=s.phi?evalExpr(s.phi):0;
    const signW=s.dir==="+"?-1:1;
    const parsed:ParsedWave={A:resolved.A,func:s.func,k:resolved.k,omega:resolved.omega,signK:1,signW,phi,varName:s.varName||"E"};
    const w=computeWave(parsed);
    onResult(renderWaveResults(w)+renderParamsResolved(resolved,s),w);
  };

  return(
    <div className="section">
      <div className="sec-title">Calculadora</div>
      <div className="sec-sub">Introduce la ecuación completa <em>o</em> los datos que conoces — te doy todo.</div>
      <div className="calc-toggle">
        <button className={`calc-toggle-btn${mode==="eq"?" active":""}`} onClick={()=>{setMode("eq");setEqErr(false);}}>📐 Tengo la ecuación</button>
        <div className="mode-divider"/>
        <button className={`calc-toggle-btn${mode==="params"?" active":""}`} onClick={()=>{setMode("params");setErrMsg("");}}>🔢 Tengo los datos</button>
      </div>
      {mode==="eq"&&<>
        <div className="inp-row">
          <div className="inp-group inp-full inp-eq">
            <label>Ecuación (cualquier formato)</label>
            <input value={eqVal} onChange={e=>setEqVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&calcEq()} placeholder="ej: E = 500 sin(5e6*pi*x + 1.2e15*pi*t)"/>
          </div>
        </div>
        <div className="hint">
          Formatos: <code>E = 500 sin(5e6*pi*x + 1.2e15*pi*t)</code> · <code>y = 0.02 sin(314x - 9420t)</code> · <code>P = 2 sin(4πx – 1360πt - 2π/3)</code><br/>
          Usa <code>pi</code> o <code>π</code> · notación <code>1.2e15</code> · <code>sin</code> o <code>cos</code> · signos + o −
        </div>
        {eqErr&&<div className="err">⚠ No he podido leer la ecuación. Revisa el formato.</div>}
        <button className="btn-calc" onClick={calcEq}>CALCULAR TODO →</button>
      </>}
      {mode==="params"&&<>
        <div style={{display:"flex",alignItems:"center",gap:".6rem",marginBottom:"1rem",flexWrap:"wrap"}}>
          <span style={{fontSize:".6rem",color:"var(--dim)",letterSpacing:".15em"}}>CAMPOS:</span>
          {[...Array(8)].map((_,i)=>(
            <div key={i} style={{width:10,height:10,borderRadius:2,background:i<filledCount?"var(--cyan)":"rgba(255,255,255,0.08)",boxShadow:i<filledCount?"0 0 6px var(--cyan)":"none",transition:"all .2s"}}/>
          ))}
          <span style={{fontSize:".6rem",color:filledCount>=3?"var(--green)":"var(--dim)"}}>
            {filledCount<2?"Añade más datos":filledCount<3?"Casi…":"¡Listo!"}
          </span>
        </div>
        <div className="sec-group-label" style={{color:"var(--cyan)"}}>▸ Onda — amplitud y velocidad</div>
        <div className="inp-row">
          <div className="inp-group">
            <label>Amplitud A</label>
            <InputUnit value={s.A} onChange={v=>up("A",v)} unit={s.Aunit} onUnitChange={v=>up("Aunit",v)} units={["V/m","Pa","m","cm","mm","mPa","kPa"]} placeholder="ej: 500"/>
          </div>
          <div className="inp-group">
            <label>Velocidad v</label>
            <InputUnit value={s.v} onChange={v=>up("v",v)} unit={s.vunit} onUnitChange={v=>up("vunit",v)} units={["m/s","km/s","km/h","cm/s","mph"]} placeholder="ej: 3e8 · 340 · 1500"/>
          </div>
          <div className="inp-group">
            <label>Índice de refracción n</label>
            <input value={s.n} onChange={e=>up("n",e.target.value)} placeholder="ej: 1.5 (alternativo a v)"/>
            <div className="iunit">Calcula v = c/n automáticamente</div>
          </div>
        </div>
        <div className="sec-group-label" style={{color:"var(--gold)"}}>▸ Parámetros temporales — rellena UNO o varios</div>
        <div className="inp-row">
          <div className="inp-group">
            <label>Frecuencia f</label>
            <InputUnit value={s.f} onChange={v=>up("f",v)} unit={s.funit} onUnitChange={v=>up("funit",v)} units={["Hz","kHz","MHz","GHz","THz"]} placeholder="ej: 6e14"/>
          </div>
          <div className="inp-group">
            <label>Período T</label>
            <InputUnit value={s.T} onChange={v=>up("T",v)} unit={s.Tunit} onUnitChange={v=>up("Tunit",v)} units={["s","ms","μs","ns","min","h"]} placeholder="ej: 1e-15"/>
          </div>
          <div className="inp-group">
            <label>Pulsación ω</label>
            <InputUnit value={s.omega} onChange={v=>up("omega",v)} unit={s.omegaunit} onUnitChange={v=>up("omegaunit",v)} units={["rad/s","rad/min","rad/h","rpm"]} placeholder="ej: 1.2e15*pi"/>
          </div>
        </div>
        <div className="sec-group-label" style={{color:"var(--purple)"}}>▸ Parámetros espaciales — rellena UNO o varios</div>
        <div className="inp-row">
          <div className="inp-group">
            <label>Longitud de onda λ</label>
            <InputUnit value={s.lam} onChange={v=>up("lam",v)} unit={s.lamunit} onUnitChange={v=>up("lamunit",v)} units={["m","cm","mm","μm","nm","pm","km"]} placeholder="ej: 500"/>
          </div>
          <div className="inp-group">
            <label>Número de onda k</label>
            <input value={s.k} onChange={e=>up("k",e.target.value)} placeholder="ej: 5e6*pi"/>
            <div className="iunit">rad/m &nbsp;(k = 2π/λ)</div>
          </div>
        </div>
        <div className="sec-group-label" style={{color:"var(--dim)"}}>▸ Forma de la ecuación</div>
        <div className="inp-row">
          <div className="inp-group">
            <label>Función</label>
            <RadioGroup options={[{v:"sin",l:"sin"},{v:"cos",l:"cos"}]} value={s.func} onChange={v=>up("func",v as WaveFunc)}/>
          </div>
          <div className="inp-group">
            <label>Sentido</label>
            <RadioGroup options={[{v:"+",l:"+x (→)"},{v:"-",l:"−x (←)"}]} value={s.dir} onChange={v=>up("dir",v as Direction)}/>
          </div>
          <div className="inp-group">
            <label>Magnitud</label>
            <input value={s.varName} onChange={e=>up("varName",e.target.value)} placeholder="E" style={{maxWidth:90}}/>
            <div className="iunit">E · y · P · B…</div>
          </div>
          <div className="inp-group">
            <label>Fase inicial φ₀</label>
            <input value={s.phi} onChange={e=>up("phi",e.target.value)} placeholder="ej: pi/2"/>
            <div className="iunit">rad (vacío = 0)</div>
          </div>
        </div>
        <div className="hint" style={{marginTop:".6rem"}}>
          <b style={{color:"var(--white)"}}>Combos válidos de ejemplo:</b><br/>
          <code>A=500 V/m, v=3e8 m/s, f=6e14 Hz</code> &nbsp;·&nbsp;
          <code>A=0.05 m, v=340 m/s, λ=1,6 m</code> &nbsp;·&nbsp;
          <code>A=2 Pa, n=1.5, f=5e14 Hz</code> &nbsp;·&nbsp;
          <code>A=100 V/m, k=5e6*pi, ω=1.2e15*pi rad/s</code>
        </div>
        {errMsg&&<div className="err">⚠ {errMsg}</div>}
        <div style={{display:"flex",gap:".6rem",alignItems:"center",marginTop:".6rem"}}>
          <button className="btn-calc" onClick={calcParams}>CALCULAR TODO →</button>
          <button className="btn-sm2" onClick={()=>{setS(EMPTY);setErrMsg("");}}>✕ Limpiar</button>
        </div>
      </>}
    </div>
  );
}

// ═══════════════════════════════════════════
// PESTAÑA INTERFERENCIAS — pasa ambas ondas
// ═══════════════════════════════════════════
function TabInterf({onResult}:{onResult:(html:string,wave:WaveProps,wave2?:WaveProps)=>void}) {
  const [eq1,setEq1]=useState("");const [eq2,setEq2]=useState("");const [err,setErr]=useState(false);
  const calc=()=>{
    const r1=parseEq(eq1),r2=parseEq(eq2);
    if(!r1||!r2){setErr(true);return;}
    setErr(false);
    const w1=computeWave(r1);
    const w2=computeWave(r2);
    const dPhi=r2.phi-r1.phi,adPhi=Math.abs(dPhi);
    let AR:number,phiR:number;
    if(Math.abs(r1.A-r2.A)/r1.A<0.001){AR=2*r1.A*Math.abs(Math.cos(dPhi/2));phiR=(r1.phi+r2.phi)/2;}
    else{const rx=r1.A*Math.cos(r1.phi)+r2.A*Math.cos(r2.phi),ry=r1.A*Math.sin(r1.phi)+r2.A*Math.sin(r2.phi);AR=Math.sqrt(rx*rx+ry*ry);phiR=Math.atan2(ry,rx);}
    const isC=Math.abs(adPhi%(2*PI))<0.1||Math.abs(adPhi%(2*PI)-2*PI)<0.1;
    const isD=Math.abs(adPhi%(2*PI)-PI)<0.1;
    const intCol=isC?"var(--green)":isD?"var(--red)":"var(--gold)";
    const phiRstr=phiR!==0?` + ${fmtPi(phiR)} rad`:"";
    const html=`
      <div class="res-sep">▸ ONDA 1</div>
      <div class="eq-box"><div class="eq-text">${r1.varName}₁ = <span class="hi">${r1.A}</span> · ${r1.func}(<span class="hic">${fmtV(r1.k)}</span>x ${r1.signW>0?"+":"−"} <span class="hip">${fmtV(r1.omega)}</span>t${r1.phi?` + ${fmtPi(r1.phi)}`:""})<br><small style="color:var(--dim)">λ=${fmtV(w1.lam*1e9,3)} nm · f=${fmtV(w1.f)} Hz · v=${fmtV(w1.v)} m/s</small></div></div>
      <div class="res-sep">▸ ONDA 2</div>
      <div class="eq-box"><div class="eq-text">${r2.varName}₂ = <span class="hi">${r2.A}</span> · ${r2.func}(<span class="hic">${fmtV(r2.k)}</span>x ${r2.signW>0?"+":"−"} <span class="hip">${fmtV(r2.omega)}</span>t${r2.phi?` + ${fmtPi(r2.phi)}`:""})<br><small style="color:var(--dim)">Desfase respecto a onda 1: <b style="color:var(--gold)">${fmtPi(dPhi)} rad = ${(dPhi*180/PI).toFixed(1)}°</b></small></div></div>
      <div class="res-sep">▸ ONDA RESULTANTE (superposición)</div>
      <div class="eq-box"><div class="eq-text">${r1.varName}<sub>R</sub> = <span class="hi">${fmtV(AR,3)}</span> · sin(<span class="hic">${fmtV(r1.k)}</span>x ${r1.signW>0?"+":"−"} <span class="hip">${fmtV(r1.omega)}</span>t${phiRstr})<br><small style="color:var(--dim)">Usando: sin α + sin β = 2·cos((α−β)/2)·sin((α+β)/2)</small></div></div>
      <div class="res-sep">▸ ANÁLISIS</div>
      <div class="props-grid">
        <div class="pc"><div class="pcl">Desfase Δφ</div><div class="pcv" style="color:var(--gold)">${fmtPi(dPhi)} rad</div><div class="pca">${(dPhi*180/PI).toFixed(2)}°</div></div>
        <div class="pc"><div class="pcl">Amplitud resultante</div><div class="pcv">${fmtVH(AR,3)}</div><div class="pca">2·A·|cos(Δφ/2)|</div></div>
        <div class="pc"><div class="pcl">Fase φᴿ</div><div class="pcv" style="color:var(--purple)">${fmtPi(phiR)} rad</div><div class="pca">(α+β)/2</div></div>
        <div class="pc"><div class="pcl">Interferencia</div><div class="pcv" style="color:${intCol}">${isC?"CONSTRUCTIVA ✓":isD?"DESTRUCTIVA ✗":"PARCIAL"}</div><div class="pca">${isC?"Δφ = 2nπ":isD?"Δφ = (2n+1)π":"0 < Δφ < π"}</div></div>
        <div class="pc g"><div class="pcl">λ resultante</div><div class="pcv">${fmtVH(w1.lam,3)} m</div><div class="pca">igual que originales</div></div>
        <div class="pc g"><div class="pcl">f resultante</div><div class="pcv">${fmtVH(w1.f,3)} Hz</div><div class="pca">igual que originales</div></div>
      </div>
      <div class="res-sep">▸ CONDICIONES</div>
      <div class="derived-grid">
        <div class="dc"><div class="dct">Constructiva (máximo)</div><div class="dce">Δφ = <span class="hig">2nπ</span> → Δr = <span class="hig">nλ</span><br>A<sub>R</sub> = A₁+A₂ = ${fmtV(r1.A+r2.A,3)}</div></div>
        <div class="dc"><div class="dct">Destructiva (mínimo)</div><div class="dce">Δφ = <span class="hir">(2n+1)π</span> → Δr = <span class="hir">(2n+1)λ/2</span><br>A<sub>R</sub> = |A₁−A₂| = ${fmtV(Math.abs(r1.A-r2.A),3)}</div></div>
        <div class="dc"><div class="dct">Δcamino → desfase</div><div class="dce">Δφ = k·Δr = (2π/λ)·Δr<br>k = <span class="hic">${fmtVH(r1.k)}</span> rad/m · λ = ${fmtVH(w1.lam)} m</div></div>
        <div class="dc"><div class="dct">Resultante (A iguales)</div><div class="dce">E<sub>R</sub> = <span class="hi">2A·cos(Δφ/2)</span>·sin(kx±ωt+φ_med)<br>= <span class="hi">${fmtV(2*r1.A,3)}·cos(${fmtPi(dPhi/2)})·sin(…)</span> = ${fmtV(AR,3)}·sin(…)</div></div>
      </div>`;
    // Pasa w1 como onda principal (cyan) y w2 como segunda (purple)
    onResult(html, w1, w2);
  };
  return(
    <div className="section">
      <div className="sec-title">Superposición e Interferencia</div>
      <div className="sec-sub">Introduce las dos ecuaciones → onda resultante, amplitud, desfase y tipo de interferencia.</div>
      <div className="inp-row">
        <div className="inp-group inp-full"><label>Ecuación Onda 1</label><input value={eq1} onChange={e=>setEq1(e.target.value)} placeholder="ej: E = 500 sin(5e6*pi*x - 1.2e15*pi*t)"/></div>
        <div className="inp-group inp-full"><label>Ecuación Onda 2</label><input value={eq2} onChange={e=>setEq2(e.target.value)} placeholder="ej: E = 500 sin(5e6*pi*x - 1.2e15*pi*t + pi/2)"/></div>
      </div>
      {err&&<div className="err">⚠ No he podido leer alguna de las ecuaciones. Revisa el formato.</div>}
      <button className="btn-calc" onClick={calc}>CALCULAR SUPERPOSICIÓN →</button>
    </div>
  );
}

// ═══════════════════════════════════════════
// PESTAÑA INTENSIDAD
// ═══════════════════════════════════════════
function TabIntensity({onResult}:{onResult:(html:string,wave:null)=>void}) {
  const [s,setS]=useState<IntensityState>({P:"",r1:"",r2:"",r1unit:"m",r2unit:"m",E0:"",I1:"",waveType:"spherical"});
  const [err,setErr]=useState(false);
  const up=(k:keyof IntensityState,v:string)=>setS(p=>({...p,[k]:v}));
  const calc=()=>{
    const P=parseFloat(s.P);
    const r1=toSI(parseFloat(s.r1),"distunit",s.r1unit);
    const r2=toSI(parseFloat(s.r2),"distunit",s.r2unit);
    const E0=parseFloat(s.E0),I1known=parseFloat(s.I1);
    const hasP=!isNaN(P)&&P>0,hasR1=!isNaN(r1)&&r1>0;
    const hasE0=!isNaN(E0)&&E0>0,hasI1=!isNaN(I1known)&&I1known>0;
    if(!hasP&&!hasE0&&!hasI1){setErr(true);return;}
    setErr(false);
    const eps0=8.854e-12;
    let rows="",I1val=NaN;
    if(hasE0){I1val=0.5*eps0*C_LIGHT*E0*E0;rows+=`<div class="pc g"><div class="pcl">I (EM vacío)</div><div class="pcv">${fmtVH(I1val)} W/m²</div><div class="pca">½ε₀c·E₀²</div></div><div class="pc"><div class="pcl">E₀</div><div class="pcv">${fmtVH(E0)} V/m</div><div class="pca">dado</div></div>`;}
    if(hasI1)I1val=I1known;
    if(hasP&&hasR1){
      const area=s.waveType==="spherical"?4*PI*r1*r1:s.waveType==="cylindrical"?2*PI*r1:1;
      I1val=P/area;
      rows+=`<div class="pc g"><div class="pcl">I en r₁=${fmtV(r1,3)} m</div><div class="pcv">${fmtVH(I1val)} W/m²</div><div class="pca">P/${s.waveType==="spherical"?"4πr²":s.waveType==="cylindrical"?"2πr":"A_transv"}</div></div>`;
      rows+=`<div class="pc"><div class="pcl">Potencia P</div><div class="pcv">${fmtVH(P)} W</div><div class="pca">dada</div></div>`;
    }
    if(!isNaN(I1val)&&hasR1&&!isNaN(r2)&&r2>0){
      const I2=s.waveType==="spherical"?I1val*(r1*r1)/(r2*r2):s.waveType==="cylindrical"?I1val*r1/r2:I1val;
      const ratio=I1val/I2;
      rows+=`<div class="pc gold"><div class="pcl">I en r₂=${fmtV(r2,3)} m</div><div class="pcv">${fmtVH(I2)} W/m²</div><div class="pca">I₁·(r₁/r₂)${s.waveType==="spherical"?"²":""}</div></div>`;
      rows+=`<div class="pc o"><div class="pcl">I₁/I₂</div><div class="pcv">${fmtV(ratio,3)}</div><div class="pca">${s.waveType==="spherical"?"(r₂/r₁)²":"r₂/r₁"}</div></div>`;
      if(hasE0){const E02=E0*Math.sqrt(I2/I1val);rows+=`<div class="pc p"><div class="pcl">E₀ en r₂</div><div class="pcv">${fmtVH(E02)} V/m</div><div class="pca">E₀ ∝ √I</div></div>`;}
    }
    const beta=!isNaN(I1val)?`β = ${(10*Math.log10(I1val/1e-12)).toFixed(1)} dB`:"—";
    const html=`
      <div class="res-sep">▸ INTENSIDAD Y ENERGÍA</div>
      <div class="props-grid">${rows}</div>
      <div class="res-sep">▸ RELACIONES</div>
      <div class="derived-grid">
        <div class="dc"><div class="dct">Tipo de onda: ${s.waveType}</div><div class="dce">Esférica: I = P/(4πr²) → I·r² = cte<br>I₁/I₂ = r₂²/r₁² → <span class="hig">I₂ = I₁·(r₁/r₂)²</span></div></div>
        <div class="dc"><div class="dct">I ↔ E₀ (EM vacío)</div><div class="dce">I = ½ε₀c·E₀² &nbsp; E₀ = √(2I/ε₀c)<br>Si E₀ × n → I × n²</div></div>
        <div class="dc"><div class="dct">Nivel sonoro β</div><div class="dce">β = 10·log₁₀(I/I₀) dB &nbsp;(I₀=10⁻¹² W/m²)<br>${beta}</div></div>
        <div class="dc"><div class="dct">Relación entre amplitudes</div><div class="dce">I ∝ A² &nbsp; I ∝ E₀²<br>A₂/A₁ = √(I₂/I₁) = r₁/r₂ (esférica)</div></div>
      </div>`;
    onResult(html,null);
  };
  return(
    <div className="section">
      <div className="sec-title">Intensidad y Energía de la Onda</div>
      <div className="sec-sub">Intensidad en cualquier punto, relaciones entre intensidades, potencia, distancias y nivel sonoro.</div>
      <div className="inp-row">
        <div className="inp-group"><label>Potencia P</label><input value={s.P} onChange={e=>up("P",e.target.value)} placeholder="ej: 154"/><div className="iunit">W</div></div>
        <div className="inp-group"><label>Distancia r₁</label><InputUnit value={s.r1} onChange={v=>up("r1",v)} unit={s.r1unit} onUnitChange={v=>up("r1unit",v)} units={["m","cm","km","mm"]} placeholder="ej: 50"/></div>
        <div className="inp-group"><label>Distancia r₂ (comparación)</label><InputUnit value={s.r2} onChange={v=>up("r2",v)} unit={s.r2unit} onUnitChange={v=>up("r2unit",v)} units={["m","cm","km","mm"]} placeholder="ej: 150"/></div>
        <div className="inp-group"><label>Amplitud E₀ (EM)</label><input value={s.E0} onChange={e=>up("E0",e.target.value)} placeholder="ej: 500"/><div className="iunit">V/m</div></div>
        <div className="inp-group"><label>I₁ conocida (sin P)</label><input value={s.I1} onChange={e=>up("I1",e.target.value)} placeholder="ej: 100"/><div className="iunit">W/m²</div></div>
        <div className="inp-group"><label>Tipo de onda</label><RadioGroup options={[{v:"spherical",l:"Esférica 3D"},{v:"cylindrical",l:"Cilíndrica"},{v:"plane",l:"Plana"}]} value={s.waveType} onChange={v=>up("waveType",v as WaveType)}/></div>
      </div>
      {err&&<div className="err">⚠ Introduce al menos potencia + distancia, o amplitud EM.</div>}
      <button className="btn-calc" onClick={calc}>CALCULAR →</button>
    </div>
  );
}

// ═══════════════════════════════════════════
// PESTAÑA MAS
// ═══════════════════════════════════════════
function TabMas({onResult}:{onResult:(html:string,wave:null)=>void}) {
  const [s,setS]=useState<MasState>({A:"",Aunit:"m",k:"",m:"",munit:"kg",f:"",phi:"",t:""});
  const [err,setErr]=useState(false);
  const up=(k:keyof MasState,v:string)=>setS(p=>({...p,[k]:v}));
  const calc=()=>{
    const A=toSI(parseFloat(s.A),"Aunit",s.Aunit);
    const kVal=parseFloat(s.k);
    const mVal=toSI(parseFloat(s.m),"munit",s.munit);
    const fIn=parseFloat(s.f);
    const phi=s.phi?evalExpr(s.phi):0;
    const tIn=parseFloat(s.t);
    if(isNaN(A)){setErr(true);return;}
    let omega:number,f:number,T:number,kspring=kVal;
    if(!isNaN(kVal)&&!isNaN(mVal)){omega=Math.sqrt(kVal/mVal);f=omega/(2*PI);T=1/f;}
    else if(!isNaN(fIn)){f=fIn;omega=2*PI*f;T=1/f;if(!isNaN(mVal))kspring=mVal*omega*omega;}
    else{setErr(true);return;}
    setErr(false);
    const vmax=A*omega,amax=A*omega*omega;
    const Emec=!isNaN(kspring)?0.5*kspring*A*A:0.5*mVal*omega*omega*A*A;
    let instHtml="";
    if(!isNaN(tIn)){
      const yT=A*Math.sin(omega*tIn+phi),vyT=A*omega*Math.cos(omega*tIn+phi),ayT=-A*omega*omega*Math.sin(omega*tIn+phi);
      instHtml=`<div class="res-sep">▸ VALORES EN t = ${tIn} s</div><div class="props-grid">
        <div class="pc g"><div class="pcl">Posición y(t)</div><div class="pcv">${fmtVH(yT,4)} m</div><div class="pca">A·sin(ωt+φ)</div></div>
        <div class="pc o"><div class="pcl">Velocidad Dy/Dt</div><div class="pcv">${fmtVH(vyT,4)} m/s</div><div class="pca">A·ω·cos(ωt+φ)</div></div>
        <div class="pc r"><div class="pcl">Aceleración D²y/Dt²</div><div class="pcv">${fmtVH(ayT,4)} m/s²</div><div class="pca">−A·ω²·sin(ωt+φ)</div></div>
        <div class="pc p"><div class="pcl">E cinética</div><div class="pcv">${fmtVH(0.5*mVal*vyT*vyT,4)} J</div><div class="pca">½mv²</div></div>
        <div class="pc gold"><div class="pcl">E potencial</div><div class="pcv">${fmtVH(!isNaN(kspring)?0.5*kspring*yT*yT:NaN,4)} J</div><div class="pca">½ky²</div></div>
      </div>`;
    }
    const html=`
      <div class="res-sep">▸ ECUACIÓN DEL MAS</div>
      <div class="eq-box"><div class="eq-text">
        y(t) = <span class="hi">${fmtV(A)}</span> · sin(<span class="hip">${fmtV(omega,3)}</span>·t ${phi!==0?`+ ${fmtPi(phi)}`:""})<br>
        <small style="color:var(--dim)">Dy/Dt = <span class="hio">${fmtV(vmax,3)}</span> · cos(ωt${phi!==0?` + ${fmtPi(phi)}`:""})</small><br>
        <small style="color:var(--dim)">D²y/Dt² = −<span class="hir">${fmtV(amax,3)}</span> · sin(ωt${phi!==0?` + ${fmtPi(phi)}`:""})</small>
      </div></div>
      <div class="res-sep">▸ PROPIEDADES</div>
      <div class="props-grid">
        <div class="pc"><div class="pcl">Amplitud A</div><div class="pcv">${fmtVH(A)} m</div><div class="pca">máx. desplazamiento</div></div>
        <div class="pc gold"><div class="pcl">Período T</div><div class="pcv">${fmtVH(T)} s</div><div class="pca">2π/ω = 2π√(m/k)</div></div>
        <div class="pc gold"><div class="pcl">Frecuencia f</div><div class="pcv">${fmtVH(f)} Hz</div><div class="pca">1/T = ω/2π</div></div>
        <div class="pc p"><div class="pcl">Pulsación ω</div><div class="pcv">${fmtVH(omega)} rad/s</div><div class="pca">√(k/m) = 2πf</div></div>
        <div class="pc o"><div class="pcl">v_max</div><div class="pcv">${fmtVH(vmax)} m/s</div><div class="pca">A·ω (en y=0)</div></div>
        <div class="pc r"><div class="pcl">a_max</div><div class="pcv">${fmtVH(amax)} m/s²</div><div class="pca">A·ω² (en y=±A)</div></div>
        ${!isNaN(kspring)?`<div class="pc g"><div class="pcl">Cte. elástica k</div><div class="pcv">${fmtVH(kspring)} N/m</div><div class="pca">m·ω²</div></div>`:""}
        <div class="pc g"><div class="pcl">Energía mecánica</div><div class="pcv">${fmtVH(Emec)} J</div><div class="pca">½kA² = ½mω²A²</div></div>
      </div>
      ${instHtml}
      <div class="res-sep">▸ RELACIONES</div>
      <div class="derived-grid">
        <div class="dc"><div class="dct">Ecuación diferencial</div><div class="dce">D²y/Dt² = <span class="hir">−ω²·y</span><br>Aceleración proporcional y opuesta al desplazamiento</div></div>
        <div class="dc"><div class="dct">v en función de y</div><div class="dce">v = ±ω·√(A²−y²)<br>v_max en y=0 &nbsp; v=0 en y=±A</div></div>
        <div class="dc"><div class="dct">Energía</div><div class="dce">E = ½mv² + ½ky² = <span class="hig">½kA² = cte</span><br>Se intercambia cinética ↔ potencial</div></div>
        <div class="dc"><div class="dct">Si A se duplica</div><div class="dce">E ×4 (cuadrática) &nbsp;·&nbsp; T y f no cambian<br>v_max ×2 &nbsp;·&nbsp; a_max ×2</div></div>
      </div>`;
    onResult(html,null);
  };
  return(
    <div className="section">
      <div className="sec-title">MAS — Oscilador Armónico / Muelle</div>
      <div className="sec-sub">Posición, velocidad, aceleración, energía cinética y potencial, período y todo lo del MAS.</div>
      <div className="inp-row">
        <div className="inp-group"><label>Amplitud A</label><InputUnit value={s.A} onChange={v=>up("A",v)} unit={s.Aunit} onUnitChange={v=>up("Aunit",v)} units={["m","cm","mm"]} placeholder="ej: 3"/></div>
        <div className="inp-group"><label>Constante k (muelle)</label><input value={s.k} onChange={e=>up("k",e.target.value)} placeholder="ej: 20"/><div className="iunit">N/m</div></div>
        <div className="inp-group"><label>Masa m</label><InputUnit value={s.m} onChange={v=>up("m",v)} unit={s.munit} onUnitChange={v=>up("munit",v)} units={["kg","g","mg"]} placeholder="ej: 32 (g)"/></div>
        <div className="inp-group"><label>Frecuencia f (alternativo)</label><input value={s.f} onChange={e=>up("f",e.target.value)} placeholder="ej: 25"/><div className="iunit">Hz</div></div>
        <div className="inp-group"><label>Fase φ₀</label><input value={s.phi} onChange={e=>up("phi",e.target.value)} placeholder="ej: pi/2 ó 0"/><div className="iunit">rad</div></div>
        <div className="inp-group"><label>Calcular en t =</label><input value={s.t} onChange={e=>up("t",e.target.value)} placeholder="ej: 0.01"/><div className="iunit">s (opcional)</div></div>
      </div>
      {err&&<div className="err">⚠ Necesito al menos la amplitud y (k + m) o frecuencia f.</div>}
      <button className="btn-calc" onClick={calc}>CALCULAR →</button>
    </div>
  );
}

// ═══════════════════════════════════════════
// PESTAÑA DESFASE
// ═══════════════════════════════════════════
function TabPhase({onResult}:{onResult:(html:string,wave:null)=>void}) {
  const [s,setS]=useState<PhaseState>({k:"",lam:"",lamunit:"m",dx:"",dxunit:"m",omega:"",omegaunit:"rad/s",dt:"",dtunit:"s",dr:"",drunit:"m",delta:""});
  const [err,setErr]=useState(false);
  const up=(key:keyof PhaseState,v:string)=>setS(p=>({...p,[key]:v}));
  const calc=()=>{
    let k=evalExpr(s.k);
    let lam=toSI(evalExpr(s.lam),"lamunit",s.lamunit);
    const dx=toSI(evalExpr(s.dx),"distunit",s.dxunit);
    const omega=toSI(evalExpr(s.omega),"omegaunit",s.omegaunit);
    const dt=toSI(evalExpr(s.dt),"Tunit",s.dtunit);
    const dr=toSI(evalExpr(s.dr),"distunit",s.drunit);
    const delta=evalExpr(s.delta);
    if(isNaN(k)&&!isNaN(lam))k=(2*PI)/lam;
    if(isNaN(lam)&&!isNaN(k))lam=(2*PI)/k;
    const hasK=!isNaN(k),hasDx=!isNaN(dx),hasOmega=!isNaN(omega),hasDt=!isNaN(dt);
    if(!hasK&&!hasOmega){setErr(true);return;}
    setErr(false);
    let rows="",derived:{t:string;e:string}[]=[];
    if(hasK&&hasDx){
      const dphi=k*dx;
      const isC=Math.abs(dphi%(2*PI))<0.05||Math.abs(dphi%(2*PI)-2*PI)<0.05;
      const isD=Math.abs(dphi%(2*PI)-PI)<0.05;
      rows+=`<div class="pc gold"><div class="pcl">Δφ espacial (k·Δx)</div><div class="pcv">${fmtPi(dphi)} rad</div><div class="pca">${(dphi*180/PI).toFixed(2)}° — Δx=${(dx/lam).toFixed(4)}λ</div></div>`;
      rows+=`<div class="pc ${isC?"g":isD?"r":""}"><div class="pcl">Interferencia</div><div class="pcv">${isC?"CONSTRUCTIVA ✓":isD?"DESTRUCTIVA ✗":"PARCIAL"}</div><div class="pca">Δφ=${fmtPi(dphi)}</div></div>`;
    }
    if(hasOmega&&hasDt){const dphi=omega*dt,T=(2*PI)/omega;rows+=`<div class="pc p"><div class="pcl">Δφ temporal (ω·Δt)</div><div class="pcv">${fmtPi(dphi)} rad</div><div class="pca">${(dphi*180/PI).toFixed(2)}° — Δt=${(dt/T).toFixed(4)}T</div></div>`;}
    if(hasK&&!isNaN(dr)){rows+=`<div class="pc o"><div class="pcl">Δφ por Δcamino (k·Δr)</div><div class="pcv">${fmtPi(k*dr)} rad</div><div class="pca">Δr=${fmtV(dr)} m = ${(dr/lam).toFixed(4)}λ</div></div>`;}
    if(!isNaN(delta)){rows+=`<div class="pc"><div class="pcl">Desfase δ dado</div><div class="pcv">${fmtPi(delta)} rad</div><div class="pca">${(delta*180/PI).toFixed(2)}°</div></div>`;}
    if(hasK){
      derived.push({t:`Tabla desfases (λ=${fmtV(lam,3)} m)`,e:`Δx = λ → Δφ = 2π = 360°<br>Δx = λ/2 → Δφ = π = 180°<br>Δx = λ/4 → Δφ = π/2 = 90°<br>Δx = λ/3 → Δφ = 2π/3 = 120°${hasDx?`<br><b>Δx=${fmtV(dx,3)} m → Δφ = <span class="hig">${fmtPi(k*dx)} = ${(k*dx*180/PI).toFixed(1)}°</span></b>`:""}`});
      derived.push({t:"Constructiva (máximo)",e:`Δφ = <span class="hig">2nπ</span> &nbsp;(n = 0,±1,±2…)<br>Δr = <span class="hig">nλ</span> = n·${fmtV(lam,3)} m<br>n=1: Δr=${fmtV(lam,3)} m &nbsp; n=2: Δr=${fmtV(2*lam,3)} m`});
      derived.push({t:"Destructiva (mínimo)",e:`Δφ = <span class="hir">(2n+1)π</span> &nbsp;(n = 0,±1,±2…)<br>Δr = <span class="hir">(2n+1)λ/2</span><br>n=0: Δr=${fmtV(lam/2,3)} m &nbsp; n=1: Δr=${fmtV(3*lam/2,3)} m`});
    }
    const html=`
      <div class="res-sep">▸ DESFASES Y DIFERENCIAS DE FASE</div>
      <div class="props-grid">${rows||'<div class="pc"><div class="pcv" style="color:var(--dim)">Introduce más datos</div></div>'}</div>
      ${derived.length?`<div class="res-sep">▸ TABLA Y CONDICIONES DE INTERFERENCIA</div><div class="derived-grid">${derived.map(d=>`<div class="dc"><div class="dct">${d.t}</div><div class="dce">${d.e}</div></div>`).join("")}</div>`:""}`;
    onResult(html,null);
  };
  return(
    <div className="section">
      <div className="sec-title">Desfase y Diferencia de Fase</div>
      <div className="sec-sub">Desfases espaciales/temporales, interferencia constructiva/destructiva, diferencia de camino.</div>
      <div className="inp-row">
        <div className="inp-group"><label>Número de onda k</label><input value={s.k} onChange={e=>up("k",e.target.value)} placeholder="ej: 5e6*pi"/><div className="iunit">rad/m</div></div>
        <div className="inp-group"><label>Longitud de onda λ</label><InputUnit value={s.lam} onChange={v=>up("lam",v)} unit={s.lamunit} onUnitChange={v=>up("lamunit",v)} units={["m","cm","mm","μm","nm","pm"]} placeholder="ej: 600"/></div>
        <div className="inp-group"><label>Separación espacial Δx</label><InputUnit value={s.dx} onChange={v=>up("dx",v)} unit={s.dxunit} onUnitChange={v=>up("dxunit",v)} units={["m","cm","mm","μm","nm"]} placeholder="ej: 0.16"/></div>
        <div className="inp-group"><label>Pulsación ω</label><InputUnit value={s.omega} onChange={v=>up("omega",v)} unit={s.omegaunit} onUnitChange={v=>up("omegaunit",v)} units={["rad/s","rad/min","rad/h","rpm"]} placeholder="ej: 1.2e15*pi"/></div>
        <div className="inp-group"><label>Separación temporal Δt</label><InputUnit value={s.dt} onChange={v=>up("dt",v)} unit={s.dtunit} onUnitChange={v=>up("dtunit",v)} units={["s","ms","μs","ns","min","h"]} placeholder="ej: 0.5"/></div>
        <div className="inp-group"><label>Diferencia de camino Δr</label><InputUnit value={s.dr} onChange={v=>up("dr",v)} unit={s.drunit} onUnitChange={v=>up("drunit",v)} units={["m","cm","mm","μm","nm","km"]} placeholder="ej: 2"/></div>
        <div className="inp-group"><label>Desfase inicial δ (dado)</label><input value={s.delta} onChange={e=>up("delta",e.target.value)} placeholder="ej: pi/2 ó 2π/3"/><div className="iunit">rad</div></div>
      </div>
      {err&&<div className="err">⚠ Introduce al menos k (o λ) y Δx, o ω y Δt.</div>}
      <button className="btn-calc" onClick={calc}>CALCULAR DESFASES →</button>
    </div>
  );
}

// ═══════════════════════════════════════════
// APP PRINCIPAL
// ═══════════════════════════════════════════
const TABS:{id:TabId;ico:string;label:string}[] = [
  {id:"calc",     ico:"⚡",label:"Calculadora"},
  {id:"interf",   ico:"🌊",label:"Interferencias"},
  {id:"intensity",ico:"📡",label:"Intensidad & Energía"},
  {id:"mas",      ico:"🌀",label:"MAS (oscilador)"},
  {id:"phase",    ico:"🔄",label:"Desfase & Fase"},
];

function WaveCalcComponent() {
  const [tab,setTab]=useState<TabId>("calc");
  const [resultHtml,setResultHtml]=useState("");
  const [wave,setWave]=useState<WaveProps|null>(null);
  const [wave2,setWave2]=useState<WaveProps|null>(null);

  const handleResult=(html:string,w:WaveProps|null,w2?:WaveProps|null)=>{
    setResultHtml(html); setWave(w); setWave2(w2??null);
    setTimeout(()=>document.getElementById("wc-results")?.scrollIntoView({behavior:"smooth",block:"start"}),50);
  };

  return(
    <>
      <style>{CSS}</style>
      <header className="wc-header">
        <h1>⚡ <em>Wave</em> Calc</h1>
        <div className="hbadge">CALCULADORA DE ONDAS COMPLETA</div>
      </header>
      <div className="mode-bar">
        {TABS.map(t=>(
          <button key={t.id} className={`mode-btn${tab===t.id?" active":""}`}
            onClick={()=>{setTab(t.id);setResultHtml("");setWave(null);setWave2(null);}}>
            <span className="mbico">{t.ico}</span>{t.label}
          </button>
        ))}
      </div>
      {tab==="calc"      && <TabCalculadora onResult={handleResult}/>}
      {tab==="interf"    && <TabInterf onResult={handleResult}/>}
      {tab==="intensity" && <TabIntensity onResult={handleResult as (h:string,w:null)=>void}/>}
      {tab==="mas"       && <TabMas onResult={handleResult as (h:string,w:null)=>void}/>}
      {tab==="phase"     && <TabPhase onResult={handleResult as (h:string,w:null)=>void}/>}
      {resultHtml&&(
        <div id="wc-results" className="results-wrap" dangerouslySetInnerHTML={{__html:resultHtml}}/>
      )}
      <CanvasViz wave={wave} wave2={wave2}/>
    </>
  );
}

export default function WaveCalc() {
  return (
    <Layout>
      <WaveCalcComponent />
    </Layout>
  );
}