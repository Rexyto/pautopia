import { useState, useEffect, useRef } from "react";
import Layout from '../components/Layout';
import '../styles/wavecalc.css';
import "../styles/rlccalc.css";

const PI = Math.PI;

// ── helpers ──────────────────────────────────────────────────────────────────
function evalExpr(s: string): number {
  if (!s || !s.trim()) return NaN;
  try {
    const clean = s
      .replace(/π/g, String(PI))
      .replace(/\bpi\b/gi, String(PI))
      .replace(/[^0-9+\-*/.eE()\s]/g, "");
    // eslint-disable-next-line no-new-func
    return Function('"use strict";return (' + clean + ")")() as number;
  } catch { return NaN; }
}

function sup(n: number | string): string {
  const m: Record<string, string> = {
    "0":"⁰","1":"¹","2":"²","3":"³","4":"⁴",
    "5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹","-":"⁻",
  };
  return String(n).split("").map(c => m[c] ?? c).join("");
}

function fmt(v: number, d = 4): string {
  if (isNaN(v) || !isFinite(v)) return "—";
  if (v === 0) return "0";
  const av = Math.abs(v);
  if (av >= 0.001 && av < 1e5) return parseFloat(v.toPrecision(d)).toString();
  const e = Math.floor(Math.log10(av));
  return `${parseFloat((v / Math.pow(10, e)).toPrecision(d))}×10${sup(e)}`;
}

// ── unit maps ─────────────────────────────────────────────────────────────────
type UnitType = "R" | "L" | "C" | "V" | "f";
const unitMap: Record<UnitType, Record<string, number>> = {
  R: { "Ω": 1, "kΩ": 1e3 },
  L: { "H": 1, "mH": 1e-3, "μH": 1e-6 },
  C: { "F": 1, "mF": 1e-3, "μF": 1e-6, "nF": 1e-9, "pF": 1e-12 },
  V: { "V": 1, "mV": 1e-3, "kV": 1e3 },
  f: { "Hz": 1, "kHz": 1e3, "MHz": 1e6 },
};
const toSI = (val: number, type: UnitType, unit: string): number =>
  val * (unitMap[type]?.[unit] ?? 1);

// ── canvas subscript helper ───────────────────────────────────────────────────
function drawSub(
  ctx: CanvasRenderingContext2D,
  main: string, sub: string,
  x: number, y: number, sz: number, col: string
): number {
  ctx.fillStyle = col;
  ctx.font = `bold ${sz}px JetBrains Mono`;
  ctx.fillText(main, x, y);
  const mw = ctx.measureText(main).width;
  const ssz = Math.round(sz * 0.7);
  ctx.font = `bold ${ssz}px JetBrains Mono`;
  ctx.fillText(sub, x + mw, y + Math.round(sz * 0.35));
  return mw + ctx.measureText(sub).width + 2;
}

// ── UInput component ──────────────────────────────────────────────────────────
interface UInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  unit: string;
  onUnit: (u: string) => void;
  units: string[];
  placeholder?: string;
}
function UInput({ label, value, onChange, unit, onUnit, units, placeholder }: UInputProps) {
  return (
    <div className="rlc-ig">
      <label>{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <div className="rlc-units">
        {units.map(u => (
          <button
            key={u}
            className={`rlc-ubtn${unit === u ? " on" : ""}`}
            onClick={() => onUnit(u)}
          >
            {u}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Triangle canvas ───────────────────────────────────────────────────────────
interface TriangleProps {
  R: number; XL: number; XC: number; X: number; Z: number; phi: number;
}
function Triangle({ R, XL, XC, X, Z, phi }: TriangleProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || isNaN(Z) || isNaN(R)) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0d1220"; ctx.fillRect(0, 0, W, H);

    const ML = 110, MR = 175, MT = 44, MB = 50;
    const availW = W - ML - MR, availH = H - MT - MB;

    const triW = Math.abs(R) || 1;
    const triH = Math.max(Math.abs(XL) || 0, Math.abs(XC) || 0, Math.abs(X) || 0.001);
    const sX = (availW / triW) * 0.80;
    const sY = (availH / triH) * 0.80;

    const ox = ML;
    const oy = MT + availH / 2 + (X * sY) / 2;
    const Rx = ox + R * sX, Ry = oy;
    const Zy = oy - X * sY, Zx = Rx;
    const XLy = oy - XL * sY;
    const XCy = XLy + XC * sY;

    // axes
    ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 1; ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(ox - 20, oy); ctx.lineTo(W - MR + 18, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W - MR + 18, oy);
    ctx.lineTo(W - MR + 10, oy - 5); ctx.lineTo(W - MR + 10, oy + 5); ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.55)"; ctx.font = "12px JetBrains Mono"; ctx.textAlign = "left";
    ctx.fillText("R (Ω)", W - MR + 22, oy + 4);

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath(); ctx.moveTo(ox, H - MB + 8); ctx.lineTo(ox, MT - 12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox, MT - 12);
    ctx.lineTo(ox - 5, MT - 4); ctx.lineTo(ox + 5, MT - 4); ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.55)"; ctx.font = "12px JetBrains Mono"; ctx.textAlign = "center";
    ctx.fillText("X (Ω)", ox, MT - 16);
    ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.font = "11px JetBrains Mono"; ctx.textAlign = "right";
    ctx.fillText("0", ox - 7, oy + 12);

    // dashed projections
    ctx.setLineDash([4, 7]); ctx.strokeStyle = "rgba(255,208,96,0.12)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(Zx, Zy); ctx.lineTo(Zx, oy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox, Zy); ctx.lineTo(Zx, Zy); ctx.stroke();
    ctx.setLineDash([]);

    // XL column
    const colX = ox - 22;
    if (XL > 0.001) {
      ctx.strokeStyle = "#9ad4e8"; ctx.lineWidth = 3;
      ctx.shadowColor = "#9ad4e8"; ctx.shadowBlur = 5;
      ctx.beginPath(); ctx.moveTo(colX, oy); ctx.lineTo(colX, XLy); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.moveTo(colX, XLy);
      ctx.lineTo(colX - 5, XLy + 9); ctx.lineTo(colX + 5, XLy + 9); ctx.closePath();
      ctx.fillStyle = "#9ad4e8"; ctx.fill();
      ctx.strokeStyle = "rgba(154,212,232,0.3)"; ctx.lineWidth = 1; ctx.setLineDash([2, 4]);
      ctx.beginPath(); ctx.moveTo(ox - 2, XLy); ctx.lineTo(ox + 4, XLy); ctx.stroke();
      ctx.setLineDash([]);
      ctx.textAlign = "left";
      const ly = (oy + XLy) / 2 + 4; let cx = 6;
      cx += drawSub(ctx, "X", "L", cx, ly, 11, "#9ad4e8");
      ctx.font = "11px JetBrains Mono"; ctx.fillStyle = "#9ad4e8";
      ctx.fillText("=" + fmt(XL, 3) + "Ω", cx, ly);
    }

    // XC column
    if (XC > 0.001 && XL > 0.001) {
      ctx.strokeStyle = "#00e5ff"; ctx.lineWidth = 3;
      ctx.shadowColor = "#00e5ff"; ctx.shadowBlur = 5;
      ctx.beginPath(); ctx.moveTo(colX, XLy); ctx.lineTo(colX, XCy); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.moveTo(colX, XCy);
      ctx.lineTo(colX - 5, XCy - 9); ctx.lineTo(colX + 5, XCy - 9); ctx.closePath();
      ctx.fillStyle = "#00e5ff"; ctx.fill();
      ctx.strokeStyle = "rgba(0,229,255,0.3)"; ctx.lineWidth = 1; ctx.setLineDash([2, 4]);
      ctx.beginPath(); ctx.moveTo(ox - 2, XCy); ctx.lineTo(ox + 4, XCy); ctx.stroke();
      ctx.setLineDash([]);
      ctx.textAlign = "left";
      const ly = (XLy + XCy) / 2 + 4; let cx = 6;
      cx += drawSub(ctx, "X", "C", cx, ly, 11, "#00e5ff");
      ctx.font = "11px JetBrains Mono"; ctx.fillStyle = "#00e5ff";
      ctx.fillText("=" + fmt(XC, 3) + "Ω", cx, ly);
    }

    // right-angle marker
    const sq = 9;
    ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Rx - sq, Ry); ctx.lineTo(Rx - sq, Ry - sq); ctx.lineTo(Rx, Ry - sq);
    ctx.stroke();

    const arrow = (x1: number, y1: number, x2: number, y2: number, col: string, lw = 2.5) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.strokeStyle = col; ctx.lineWidth = lw;
      ctx.shadowColor = col; ctx.shadowBlur = 8; ctx.stroke(); ctx.shadowBlur = 0;
      const a = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath(); ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 11 * Math.cos(a - 0.38), y2 - 11 * Math.sin(a - 0.38));
      ctx.lineTo(x2 - 11 * Math.cos(a + 0.38), y2 - 11 * Math.sin(a + 0.38));
      ctx.closePath(); ctx.fillStyle = col; ctx.fill();
    };

    // R arrow
    arrow(ox, oy, Rx, Ry, "#00e5ff");
    ctx.fillStyle = "#00e5ff"; ctx.textAlign = "center"; ctx.font = "bold 12px JetBrains Mono";
    ctx.fillText("R = " + fmt(R, 3) + " Ω", (ox + Rx) / 2, oy + 26);

    // X arrow with XL-XC label
    const xCol = X >= 0 ? "#b87fff" : "#00ff88";
    arrow(Rx, Ry, Zx, Zy, xCol);
    {
      const lx = Zx + 14, ly = (Ry + Zy) / 2 + 4;
      ctx.textAlign = "left"; let cx = lx;
      if (X >= 0) {
        cx += drawSub(ctx, "X", "L", cx, ly, 11, xCol);
        ctx.font = "11px JetBrains Mono"; ctx.fillStyle = xCol;
        ctx.fillText(" − ", cx, ly); cx += ctx.measureText(" − ").width;
        cx += drawSub(ctx, "X", "C", cx, ly, 11, xCol);
        ctx.font = "11px JetBrains Mono"; ctx.fillStyle = xCol;
        ctx.fillText(" = " + fmt(X, 3) + " Ω", cx, ly);
      } else {
        cx += drawSub(ctx, "X", "C", cx, ly, 11, xCol);
        ctx.font = "11px JetBrains Mono"; ctx.fillStyle = xCol;
        ctx.fillText(" − ", cx, ly); cx += ctx.measureText(" − ").width;
        cx += drawSub(ctx, "X", "L", cx, ly, 11, xCol);
        ctx.font = "11px JetBrains Mono"; ctx.fillStyle = xCol;
        ctx.fillText(" = " + fmt(X, 3) + " Ω", cx, ly);
      }
    }

    // Z arrow
    arrow(ox, oy, Zx, Zy, "#ffd060", 3);
    ctx.fillStyle = "#ffd060"; ctx.font = "bold 13px JetBrains Mono"; ctx.textAlign = "right";
    ctx.fillText("Z = " + fmt(Z, 3) + " Ω", (ox + Zx) / 2 - 12, (oy + Zy) / 2 - 13);

    // phi arc — visual angle from pixel coords
    if (Math.abs(phi) > 0.01) {
      const dxPx = Zx - ox;
      const dyPx = -(Zy - oy);
      const visAngle = Math.atan2(dyPx, dxPx);
      const arcR = 32;
      ctx.beginPath();
      if (visAngle >= 0) {
        ctx.arc(ox, oy, arcR, 0, -visAngle, true);
      } else {
        ctx.arc(ox, oy, arcR, 0, -visAngle, false);
      }
      ctx.strokeStyle = "#ff7c38"; ctx.lineWidth = 2; ctx.stroke();
      const midA = -visAngle / 2;
      const lx2 = ox + (arcR + 18) * Math.cos(midA);
      const ly2 = oy + (arcR + 18) * Math.sin(midA);
      const phiTxt = "α=" + ((phi * 180 / PI).toFixed(1)) + "°";
      ctx.font = "bold 12px JetBrains Mono"; ctx.textAlign = "center";
      const tw = ctx.measureText(phiTxt).width;
      ctx.fillStyle = "rgba(13,18,32,0.75)";
      ctx.fillRect(lx2 - tw / 2 - 3, ly2 - 13, tw + 6, 16);
      ctx.fillStyle = "#ff7c38";
      ctx.fillText(phiTxt, lx2, ly2);
    }

    // ticks
    ctx.strokeStyle = "rgba(0,229,255,0.4)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(Rx, oy - 5); ctx.lineTo(Rx, oy + 5); ctx.stroke();
    ctx.fillStyle = "rgba(0,229,255,0.6)"; ctx.font = "10px JetBrains Mono"; ctx.textAlign = "center";
    ctx.fillText(fmt(R, 3) + " Ω", Rx, oy + MB - 4);
    if (Math.abs(X) > 0.001) {
      ctx.strokeStyle = X >= 0 ? "rgba(184,127,255,0.45)" : "rgba(0,255,136,0.45)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ox - 4, Zy); ctx.lineTo(ox + 4, Zy); ctx.stroke();
      ctx.fillStyle = X >= 0 ? "rgba(184,127,255,0.7)" : "rgba(0,255,136,0.7)";
      ctx.font = "10px JetBrains Mono"; ctx.textAlign = "right";
      ctx.fillText(fmt(X, 3), ox - 6, Zy + 4);
    }
    ctx.beginPath(); ctx.arc(ox, oy, 4, 0, 2 * PI);
    ctx.fillStyle = "#fff"; ctx.fill();
  }, [R, XL, XC, X, Z, phi]);

  return <canvas ref={ref} width={780} height={320} />;
}

// ── state types ───────────────────────────────────────────────────────────────
interface FormState {
  R: string; Runit: string;
  L: string; Lunit: string;
  C: string; Cunit: string;
  V: string; Vunit: string;
  f: string; funit: string;
}
interface Results {
  R: number; XL: number; XC: number; X: number; Z: number;
  alpha: number; alphaDeg: number;
  Irms: number; Iang: number;
  VR: number; VRang: number;
  VXL: number; VXLang: number;
  VXC: number; VXCang: number;
  P: number; Q: number; S: number; fp: number;
  nat: string; natCol: string;
  omega: number; Vrms: number;
}

// ── Frac / Sqrt helpers ───────────────────────────────────────────────────────
const Frac = ({ num, den }: { num: React.ReactNode; den: React.ReactNode }) => (
  <span className="rlc-frac">
    <span className="num">{num}</span>
    <span className="den">{den}</span>
  </span>
);
const Sqrt = ({ children }: { children: React.ReactNode }) => (
  <span className="rlc-sqrt">
    <span className="rad">√</span>
    <span className="radicand">{children}</span>
  </span>
);

// ── main component ────────────────────────────────────────────────────────────
function RLCCalcComponent() {
  const [s, setS] = useState<FormState>({
    R: "", Runit: "Ω",
    L: "", Lunit: "mH",
    C: "", Cunit: "μF",
    V: "220", Vunit: "V",
    f: "50", funit: "Hz",
  });
  const [res, setRes] = useState<Results | null>(null);
  const [err, setErr] = useState("");
  const up = (k: keyof FormState, v: string) => setS(p => ({ ...p, [k]: v }));

  const calc = () => {
    setErr("");
    const R  = s.R ? toSI(evalExpr(s.R), "R", s.Runit) : 0;
    const L  = s.L ? toSI(evalExpr(s.L), "L", s.Lunit) : 0;
    const C  = s.C ? toSI(evalExpr(s.C), "C", s.Cunit) : 0;
    const Vrms = toSI(evalExpr(s.V), "V", s.Vunit);
    const f  = toSI(evalExpr(s.f), "f", s.funit);
    if (isNaN(Vrms) || isNaN(f) || f <= 0) { setErr("Revisa la tensión y la frecuencia."); return; }
    if (!s.R && !s.L && !s.C) { setErr("Introduce al menos un componente."); return; }

    const omega = 2 * PI * f;
    const XL = omega * L;
    const XC = C > 0 ? 1 / (omega * C) : 0;
    const X  = XL - XC;
    const Z  = Math.sqrt(R * R + X * X);
    const alpha    = Math.acos(Math.min(1, R / Z)) * (X < 0 ? -1 : 1);
    const alphaDeg = alpha * 180 / PI;
    const Irms  = Vrms / Z;
    const Iang  = -alphaDeg;
    const VR    = Irms * R;    const VRang   = Iang;
    const VXL   = Irms * XL;  const VXLang  = Iang + 90;
    const VXC   = Irms * XC;  const VXCang  = Iang - 90;
    const P  = Irms * Irms * R;
    const Q  = Irms * Irms * Math.abs(X);
    const S  = Vrms * Irms;
    const fp = R / Z;
    const nat    = X > 0.001 ? "Inductivo (XL > XC)" : X < -0.001 ? "Capacitivo (XC > XL)" : "Resistivo puro";
    const natCol = X > 0.001 ? "var(--wc-purple)" : X < -0.001 ? "var(--wc-cyan)" : "var(--wc-green)";
    setRes({ R, XL, XC, X, Z, alpha, alphaDeg, Irms, Iang, VR, VRang, VXL, VXLang, VXC, VXCang, P, Q, S, fp, nat, natCol, omega, Vrms });
  };

  const Lsi = s.L ? toSI(evalExpr(s.L), "L", s.Lunit) : 0;
  const Csi = s.C ? toSI(evalExpr(s.C), "C", s.Cunit) : 0;
  const fsi = toSI(evalExpr(s.f), "f", s.funit);
  const nExtra = [s.L, s.C].filter(Boolean).length;

  return (
    <>
      <header className="wc-header">
        <h1>⚡ <em>RLC</em> Calc</h1>
        <div className="hbadge">CIRCUITOS AC</div>
      </header>

      <div className="section">
        <div className="sec-title">Circuito RLC Serie</div>
        <div className="sec-sub">
          Introduce los componentes disponibles. Se calculan Z, reactancias, ángulo α, corriente fasorial, tensiones parciales (VR, VXL, VXC) y potencias — con todos los pasos desarrollados.
        </div>
        <div className="hint">
          Red convencional española: <code>220 V · 50 Hz</code>. Deja en blanco los componentes que no uses.
        </div>

        <div className="inp-row">
          <UInput label="Tensión V eficaz" value={s.V} onChange={v => up("V", v)}
            unit={s.Vunit} onUnit={v => up("Vunit", v)} units={["V","mV","kV"]} placeholder="220" />
          <UInput label="Frecuencia f" value={s.f} onChange={v => up("f", v)}
            unit={s.funit} onUnit={v => up("funit", v)} units={["Hz","kHz","MHz"]} placeholder="50" />
        </div>
        <div className="inp-row">
          <UInput label="Resistencia R" value={s.R} onChange={v => up("R", v)}
            unit={s.Runit} onUnit={v => up("Runit", v)} units={["Ω","kΩ"]} placeholder="ej: 60" />
          <UInput label="Bobina L" value={s.L} onChange={v => up("L", v)}
            unit={s.Lunit} onUnit={v => up("Lunit", v)} units={["H","mH","μH"]} placeholder="ej: 300" />
          <UInput label="Condensador C" value={s.C} onChange={v => up("C", v)}
            unit={s.Cunit} onUnit={v => up("Cunit", v)} units={["F","mF","μF","nF","pF"]} placeholder="ej: 20" />
        </div>
        {err && <div className="err">⚠ {err}</div>}
        <button className="btn-calc" onClick={calc}>CALCULAR →</button>
      </div>

      {res && <>
        <div className="results-wrap">

          {/* ── REACTANCIAS ── */}
          <div className="res-sep">▸ REACTANCIAS</div>
          <div className="props-grid">
            <div className="pc p">
              <div className="pcl">X<sub>L</sub> bobina</div>
              <div className="pcv">{fmt(res.XL)} Ω</div>
              <div className="pca">ω · L</div>
            </div>
            <div className="pc">
              <div className="pcl">X<sub>C</sub> condensador</div>
              <div className="pcv" style={{ color: "var(--wc-cyan)" }}>{fmt(res.XC)} Ω</div>
              <div className="pca">1 / (ω · C)</div>
            </div>
            <div className="pc">
              <div className="pcl">X = X<sub>L</sub> − X<sub>C</sub></div>
              <div className="pcv" style={{ color: res.natCol }}>{fmt(res.X)} Ω</div>
              <div className="pca">{res.X > 0.001 ? "inductivo" : res.X < -0.001 ? "capacitivo" : "resonancia"}</div>
            </div>
          </div>

          {/* ── IMPEDANCIA ── */}
          <div className="res-sep">▸ IMPEDANCIA Y CORRIENTE</div>
          <div className="props-grid">
            <div className="pc gold">
              <div className="pcl">Z impedancia</div>
              <div className="pcv">{fmt(res.Z)} Ω</div>
              <div className="pca">√(R² + X²)</div>
            </div>
            <div className="pc o">
              <div className="pcl">α ángulo de Z</div>
              <div className="pcv">{res.alphaDeg.toFixed(2)}°</div>
              <div className="pca">arccos(R / Z)</div>
            </div>
            <div className="pc g">
              <div className="pcl">I<sub>rms</sub></div>
              <div className="pcv">{fmt(res.Irms, 4)} A</div>
              <div className="pca">∠ {res.Iang.toFixed(2)}°</div>
            </div>
            <div className="pc g">
              <div className="pcl">I<sub>pico</sub></div>
              <div className="pcv">{fmt(res.Irms * Math.sqrt(2), 4)} A</div>
              <div className="pca">I<sub>rms</sub> × √2</div>
            </div>
          </div>

          {/* ── TENSIONES PARCIALES ── */}
          <div className="res-sep">▸ TENSIONES PARCIALES (forma polar)</div>
          <div className="props-grid">
            <div className="pc g">
              <div className="pcl">V<sub>R</sub></div>
              <div className="pcv">{fmt(res.VR, 4)} V</div>
              <div className="pca">∠ {res.VRang.toFixed(1)}°</div>
            </div>
            <div className="pc p">
              <div className="pcl">V<sub>XL</sub></div>
              <div className="pcv">{fmt(res.VXL, 4)} V</div>
              <div className="pca">∠ {res.VXLang.toFixed(1)}°</div>
            </div>
            <div className="pc">
              <div className="pcl">V<sub>XC</sub></div>
              <div className="pcv" style={{ color: "var(--wc-cyan)" }}>{fmt(res.VXC, 4)} V</div>
              <div className="pca">∠ {res.VXCang.toFixed(1)}°</div>
            </div>
          </div>

          {/* ── FORMA RECTANGULAR Y POLAR ── */}
          <div className="res-sep">▸ FORMA RECTANGULAR Y POLAR</div>
          <div className="props-grid">
            <div className="pc">
              <div className="pcl">Forma rectangular Z</div>
              <div className="pcv" style={{ fontSize: "1rem" }}>
                <span className="hic">{fmt(res.R, 4)}</span>
                <span style={{ color: "var(--wc-dim)" }}> + j·</span>
                <span style={{ color: res.natCol }}>({fmt(res.X, 4)})</span>
                <span style={{ color: "var(--wc-dim)" }}> Ω</span>
              </div>
              <div className="pca">R + jX</div>
            </div>
            <div className="pc gold">
              <div className="pcl">Forma polar Z</div>
              <div className="pcv" style={{ fontSize: "1rem" }}>
                <span>{fmt(res.Z, 4)} Ω</span>
                <span style={{ color: "var(--wc-dim)" }}> ∠ </span>
                <span className="hio">{res.alphaDeg.toFixed(2)}°</span>
              </div>
              <div className="pca">|Z| ∠ α</div>
            </div>
          </div>

          {/* ── POTENCIAS ── */}
          <div className="res-sep">▸ POTENCIAS</div>
          <div className="props-grid">
            <div className="pc g">
              <div className="pcl">P activa</div>
              <div className="pcv">{fmt(res.P)} W</div>
              <div className="pca">I² · R</div>
            </div>
            <div className="pc o">
              <div className="pcl">Q reactiva</div>
              <div className="pcv">{fmt(res.Q)} VAR</div>
              <div className="pca">I² · |X|</div>
            </div>
            <div className="pc gold">
              <div className="pcl">S aparente</div>
              <div className="pcv">{fmt(res.S)} VA</div>
              <div className="pca">V · I</div>
            </div>
            <div className="pc o">
              <div className="pcl">cos α</div>
              <div className="pcv">{res.fp.toFixed(4)}</div>
              <div className="pca">R / Z</div>
            </div>
          </div>

          {/* ── STATUS BAR ── */}
          <div className="status-bar">
            <div className="sdot" style={{ background: res.natCol, boxShadow: `0 0 8px ${res.natCol}` }} />
            <span style={{ color: res.natCol, fontWeight: 700 }}>{res.nat}</span>
            <span style={{ color: "var(--wc-dim)" }}>·</span>
            <span>Z = <b>{fmt(res.Z)} Ω</b></span>
            <span style={{ color: "var(--wc-dim)" }}>·</span>
            <span>α = <b style={{ color: "var(--wc-orange)" }}>{res.alphaDeg.toFixed(2)}°</b></span>
            <span style={{ color: "var(--wc-dim)" }}>·</span>
            <span>cos α = <b>{res.fp.toFixed(4)}</b></span>
          </div>
        </div>

        {/* ── TRIÁNGULO ── */}
        <div className="rlc-tri-wrap">
          <div className="rlc-tri-lbl">▸ Triángulo de impedancia</div>
          <Triangle R={res.R} XL={res.XL} XC={res.XC} X={res.X} Z={res.Z} phi={res.alpha} />
        </div>

        {/* ── PASOS ── */}
        <div className="results-wrap" style={{ paddingTop: 0 }}>
          <div className="res-sep">▸ FÓRMULAS Y PASOS</div>
          <div className="rlc-steps">

            <div className="rlc-step">
              <div className="rlc-step-n">1</div>
              <div className="rlc-step-body">
                <div className="rlc-step-title">Pulsación angular ω</div>
                <div className="rlc-step-formula">ω = 2π · f</div>
                <div className="rlc-step-calc">
                  ω = 2π · <span className="hic">{fmt(fsi, 4)}</span> = <b className="hi">{fmt(res.omega, 4)} rad/s</b>
                </div>
              </div>
            </div>

            {s.L && <div className="rlc-step">
              <div className="rlc-step-n">2</div>
              <div className="rlc-step-body">
                <div className="rlc-step-title">Reactancia inductiva X<sub>L</sub></div>
                <div className="rlc-step-formula">X<sub>L</sub> = ω · L</div>
                <div className="rlc-step-calc">
                  X<sub>L</sub> = <span className="hic">{fmt(res.omega, 4)}</span> · <span className="hic">{fmt(Lsi, 4)}</span> = <b className="hip">{fmt(res.XL, 4)} Ω</b>
                </div>
                <div className="rlc-step-note">La bobina se opone más a frecuencias altas</div>
              </div>
            </div>}

            {s.C && <div className="rlc-step">
              <div className="rlc-step-n">{s.L ? 3 : 2}</div>
              <div className="rlc-step-body">
                <div className="rlc-step-title">Reactancia capacitiva X<sub>C</sub></div>
                <div className="rlc-step-formula">
                  X<sub>C</sub> = <Frac num="1" den="ω · C" />
                </div>
                <div className="rlc-step-calc">
                  X<sub>C</sub> = <Frac
                    num="1"
                    den={<><span className="hic">{fmt(res.omega, 4)}</span> · <span className="hic">{fmt(Csi, 4)}</span></>}
                  /> = <b className="hic">{fmt(res.XC, 4)} Ω</b>
                </div>
                <div className="rlc-step-note">El condensador se opone más a frecuencias bajas</div>
              </div>
            </div>}

            <div className="rlc-step">
              <div className="rlc-step-n">{nExtra + 2}</div>
              <div className="rlc-step-body">
                <div className="rlc-step-title">Reactancia total X</div>
                <div className="rlc-step-formula">X = X<sub>L</sub> − X<sub>C</sub></div>
                <div className="rlc-step-calc">
                  X = <span className="hip">{fmt(res.XL, 4)}</span> − <span className="hic">{fmt(res.XC, 4)}</span> = <b style={{ color: res.natCol }}>{fmt(res.X, 4)} Ω</b>
                </div>
                <div className="rlc-step-note">
                  {res.X > 0.001 ? "X > 0 → inductivo (XL domina)" : res.X < -0.001 ? "X < 0 → capacitivo (XC domina)" : "X = 0 → resonancia, Z mínima"}
                </div>
              </div>
            </div>

            <div className="rlc-step">
              <div className="rlc-step-n">{nExtra + 3}</div>
              <div className="rlc-step-body">
                <div className="rlc-step-title">Impedancia Z — módulo</div>
                <div className="rlc-step-formula">
                  Z = <Sqrt>R<sup>2</sup> + X<sup>2</sup></Sqrt>
                </div>
                <div className="rlc-step-calc">
                  Z = <Sqrt><span className="hic">{fmt(res.R, 4)}</span><sup>2</sup> + (<span className="hic">{fmt(res.X, 4)}</span>)<sup>2</sup></Sqrt>
                  {" = "}<Sqrt><span className="hic">{fmt(res.R * res.R, 4)}</span> + <span className="hic">{fmt(res.X * res.X, 4)}</span></Sqrt>
                  {" = "}<b className="hi">{fmt(res.Z, 4)} Ω</b>
                </div>
              </div>
            </div>

            <div className="rlc-step">
              <div className="rlc-step-n">{nExtra + 4}</div>
              <div className="rlc-step-body">
                <div className="rlc-step-title">Ángulo α — arccos(R/Z)</div>
                <div className="rlc-step-formula">
                  α = arccos<Frac num="R" den="Z" />
                </div>
                <div className="rlc-step-calc">
                  α = arccos<Frac num={<span className="hic">{fmt(res.R, 4)}</span>} den={<span className="hic">{fmt(res.Z, 4)}</span>} />
                  {" = arccos("}<span className="hic">{(res.R / res.Z).toFixed(4)}</span>{") = "}
                  <b className="hio">{Math.abs(res.alphaDeg).toFixed(2)}°</b>
                  {" → Z = "}<b className="hi">{fmt(res.Z, 4)} Ω</b>{" ∠ "}<b className="hio">{res.alphaDeg.toFixed(2)}°</b>
                </div>
                <div className="rlc-step-note">
                  {res.X < 0
                    ? "Negativo: XC > XL (capacitivo, la corriente adelanta a la tensión)"
                    : res.X > 0
                    ? "Positivo: XL > XC (inductivo, la corriente retrasa a la tensión)"
                    : "α = 0° — circuito resistivo puro"}
                </div>
              </div>
            </div>

            <div className="rlc-step">
              <div className="rlc-step-n">{nExtra + 5}</div>
              <div className="rlc-step-body">
                <div className="rlc-step-title">Corriente total I (V fuente a 0°)</div>
                <div className="rlc-step-formula">
                  I = <Frac num="V ∠ 0°" den="Z ∠ α" />
                </div>
                <div className="rlc-step-calc">
                  I = <Frac
                    num={<span className="hic">{fmt(res.Vrms, 4)} ∠ 0°</span>}
                    den={<span className="hic">{fmt(res.Z, 4)} ∠ {res.alphaDeg.toFixed(1)}°</span>}
                  />
                  {" = "}<b className="hig">{fmt(res.Irms, 4)} A</b>{" ∠ "}<b className="hig">{res.Iang.toFixed(2)}°</b>
                </div>
                <div className="rlc-step-note">
                  División de fasores: módulos se dividen, ángulos se restan → 0° − ({res.alphaDeg.toFixed(1)}°) = {res.Iang.toFixed(1)}°
                </div>
              </div>
            </div>

            <div className="rlc-step">
              <div className="rlc-step-n">{nExtra + 6}</div>
              <div className="rlc-step-body">
                <div className="rlc-step-title">Tensiones parciales V<sub>R</sub>, V<sub>XL</sub>, V<sub>XC</sub></div>
                <div className="rlc-step-formula">
                  V<sub>x</sub> = I · Z<sub>x</sub> &nbsp;→&nbsp; módulos ×, ángulos +
                </div>
                <div className="rlc-step-calc">
                  V<sub>R</sub>&nbsp; = <span className="hig">{fmt(res.Irms, 4)} ∠ {res.Iang.toFixed(1)}°</span> × <span className="hic">{fmt(res.R, 4)} ∠ 0°</span>
                  {" = "}<b className="hig">{fmt(res.VR, 4)} V ∠ {res.VRang.toFixed(1)}°</b><br />
                  V<sub>XL</sub> = <span className="hig">{fmt(res.Irms, 4)} ∠ {res.Iang.toFixed(1)}°</span> × <span className="hip">{fmt(res.XL, 4)} ∠ +90°</span>
                  {" = "}<b className="hip">{fmt(res.VXL, 4)} V ∠ {res.VXLang.toFixed(1)}°</b><br />
                  V<sub>XC</sub> = <span className="hig">{fmt(res.Irms, 4)} ∠ {res.Iang.toFixed(1)}°</span> × <span className="hic">{fmt(res.XC, 4)} ∠ −90°</span>
                  {" = "}<b className="hic">{fmt(res.VXC, 4)} V ∠ {res.VXCang.toFixed(1)}°</b>
                </div>
                <div className="rlc-step-note">R → 0°, bobina → +90°, condensador → −90°</div>
              </div>
            </div>

            <div className="rlc-step">
              <div className="rlc-step-n">{nExtra + 7}</div>
              <div className="rlc-step-body">
                <div className="rlc-step-title">Forma rectangular y polar de Z</div>
                <div className="rlc-step-formula">Z = R + jX &nbsp;·&nbsp; Z = |Z| ∠ α</div>
                <div className="rlc-step-calc">
                  Z = <span className="hic">{fmt(res.R, 4)}</span> + j·<span style={{ color: res.natCol }}>({fmt(res.X, 4)})</span> Ω<br />
                  Z = <b className="hi">{fmt(res.Z, 4)} Ω</b> ∠ <b className="hio">{res.alphaDeg.toFixed(2)}°</b>
                </div>
                <div className="rlc-step-note">Parte real = R, parte imaginaria = X (+ inductivo, − capacitivo)</div>
              </div>
            </div>

            <div className="rlc-step">
              <div className="rlc-step-n">{nExtra + 8}</div>
              <div className="rlc-step-body">
                <div className="rlc-step-title">Potencias</div>
                <div className="rlc-step-formula">
                  P = I<sup>2</sup>·R &nbsp;·&nbsp; Q = I<sup>2</sup>·|X| &nbsp;·&nbsp; S = V·I &nbsp;·&nbsp; cosα = <Frac num="R" den="Z" />
                </div>
                <div className="rlc-step-calc">
                  P = <span className="hic">{fmt(res.Irms, 4)}</span><sup>2</sup> · <span className="hic">{fmt(res.R, 4)}</span> = <b className="hig">{fmt(res.P, 4)} W</b><br />
                  Q = <span className="hic">{fmt(res.Irms, 4)}</span><sup>2</sup> · <span className="hic">{fmt(Math.abs(res.X), 4)}</span> = <b className="hio">{fmt(res.Q, 4)} VAR</b><br />
                  S = <span className="hic">{fmt(res.Vrms, 4)}</span> · <span className="hic">{fmt(res.Irms, 4)}</span> = <b>{fmt(res.S, 4)} VA</b><br />
                  cosα = <Frac num={<span className="hic">{fmt(res.R, 4)}</span>} den={<span className="hic">{fmt(res.Z, 4)}</span>} /> = <b className="hio">{res.fp.toFixed(4)}</b>
                </div>
              </div>
            </div>

          </div>
        </div>
      </>}
    </>
  );
}

export default function RLCCalc() {
  return (
    <Layout>
      <RLCCalcComponent />
    </Layout>
  );
}