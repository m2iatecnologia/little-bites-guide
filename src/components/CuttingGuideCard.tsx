import { getCuttingGuide } from "@/data/cuttingGuides";

// Lightweight inline SVG shapes for cutting illustrations
function CutShape({ shape, emoji, size = 80 }: { shape: string; emoji: string; size?: number }) {
  const s = size;
  const mid = s / 2;

  const shapeElements: Record<string, React.ReactNode> = {
    stick: (
      <>
        <rect x={mid - 6} y={8} width={12} height={s - 16} rx={4} fill="hsl(var(--app-yellow-dark))" opacity={0.6} />
        <rect x={mid + 10} y={12} width={10} height={s - 20} rx={3} fill="hsl(var(--app-yellow-dark))" opacity={0.4} />
        <rect x={mid - 22} y={10} width={11} height={s - 18} rx={4} fill="hsl(var(--app-yellow-dark))" opacity={0.5} />
      </>
    ),
    cube: (
      <>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => {
          const row = Math.floor(i / 3);
          const col = i % 3;
          return (
            <rect key={i}
              x={mid - 24 + col * 18} y={mid - 24 + row * 18}
              width={14} height={14} rx={3}
              fill="hsl(var(--app-yellow-dark))"
              opacity={0.4 + (i % 3) * 0.15}
            />
          );
        })}
      </>
    ),
    mashed: (
      <ellipse cx={mid} cy={mid} rx={s * 0.35} ry={s * 0.25} fill="hsl(var(--app-yellow-dark))" opacity={0.5} />
    ),
    shredded: (
      <>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <rect key={i}
            x={mid - 20 + (i % 3) * 14} y={mid - 16 + Math.floor(i / 3) * 18}
            width={10} height={3} rx={1.5}
            fill="hsl(var(--app-yellow-dark))"
            opacity={0.45 + i * 0.08}
            transform={`rotate(${-15 + i * 12}, ${mid}, ${mid})`}
          />
        ))}
      </>
    ),
    strip: (
      <>
        <rect x={mid - 20} y={10} width={8} height={s - 20} rx={3} fill="hsl(var(--app-yellow-dark))" opacity={0.5} />
        <rect x={mid - 6} y={14} width={8} height={s - 24} rx={3} fill="hsl(var(--app-yellow-dark))" opacity={0.6} />
        <rect x={mid + 8} y={12} width={8} height={s - 22} rx={3} fill="hsl(var(--app-yellow-dark))" opacity={0.45} />
      </>
    ),
    half: (
      <>
        <circle cx={mid - 10} cy={mid} r={s * 0.22} fill="hsl(var(--app-yellow-dark))" opacity={0.5} />
        <circle cx={mid + 14} cy={mid} r={s * 0.22} fill="hsl(var(--app-yellow-dark))" opacity={0.4} />
      </>
    ),
    wedge: (
      <polygon
        points={`${mid},${mid - 25} ${mid + 22},${mid + 20} ${mid - 22},${mid + 20}`}
        fill="hsl(var(--app-yellow-dark))" opacity={0.5}
      />
    ),
    slice: (
      <>
        <ellipse cx={mid} cy={mid} rx={s * 0.3} ry={s * 0.15} fill="hsl(var(--app-yellow-dark))" opacity={0.5} />
        <ellipse cx={mid} cy={mid + 16} rx={s * 0.25} ry={s * 0.12} fill="hsl(var(--app-yellow-dark))" opacity={0.35} />
      </>
    ),
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: s, height: s }}>
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} className="absolute inset-0">
        <circle cx={mid} cy={mid} r={mid - 2} fill="hsl(var(--muted))" opacity={0.5} />
        {shapeElements[shape] || shapeElements.stick}
      </svg>
      <span className="relative text-2xl select-none z-10">{emoji}</span>
    </div>
  );
}

interface Props {
  foodName: string;
  emoji: string;
}

export function CuttingGuideCard({ foodName, emoji }: Props) {
  const guide = getCuttingGuide(foodName);

  return (
    <div>
      <h3 className="text-base mb-3" style={{ fontWeight: 800 }}>✂️ Guia de cortes — {foodName}</h3>
      <div className="rounded-2xl overflow-hidden" style={{ background: "hsl(var(--card))" }}>
        {/* Two-stage visual */}
        <div className="flex items-stretch">
          {/* Início */}
          <div className="flex-1 flex flex-col items-center p-4 gap-2"
            style={{ borderRight: "1px solid hsl(var(--border))" }}>
            <CutShape shape={guide.inicio.shape} emoji={emoji} size={76} />
            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ fontWeight: 800, background: "hsl(var(--app-yellow) / 0.3)", color: "hsl(var(--app-brown))" }}>
              🟢 Início
            </span>
            <p className="text-[11px] font-semibold text-center" style={{ fontWeight: 700 }}>
              {guide.inicio.label}
            </p>
          </div>
          {/* Pinça */}
          <div className="flex-1 flex flex-col items-center p-4 gap-2">
            <CutShape shape={guide.pinca.shape} emoji={emoji} size={76} />
            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ fontWeight: 800, background: "hsl(var(--app-gold-light))", color: "hsl(var(--app-petrol))" }}>
              🎯 Pinça
            </span>
            <p className="text-[11px] font-semibold text-center" style={{ fontWeight: 700 }}>
              {guide.pinca.label}
            </p>
          </div>
        </div>

        {/* Descriptions */}
        <div className="px-4 pb-2 space-y-2" style={{ borderTop: "1px solid hsl(var(--border))" }}>
          <div className="pt-3">
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              <span className="font-bold" style={{ fontWeight: 700 }}>Início:</span> {guide.inicio.description}
            </p>
          </div>
          <div>
            <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              <span className="font-bold" style={{ fontWeight: 700 }}>Pinça:</span> {guide.pinca.description}
            </p>
          </div>
        </div>

        {/* Tip */}
        <div className="mx-4 mb-4 p-3 rounded-xl" style={{ background: "hsl(var(--app-yellow) / 0.15)" }}>
          <p className="text-xs" style={{ color: "hsl(var(--app-brown))" }}>
            💡 {guide.tip}
          </p>
        </div>
      </div>
    </div>
  );
}
