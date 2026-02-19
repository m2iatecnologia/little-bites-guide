import melanciaImg from "@/assets/food-melancia.jpg";
import bananaImg from "@/assets/food-banana.jpg";
import abobrinhaImg from "@/assets/food-abobrinha.jpg";
import cenouraImg from "@/assets/food-cenoura.jpg";
import morangoImg from "@/assets/food-morango.jpg";
import abacateImg from "@/assets/food-abacate.jpg";
import muffinImg from "@/assets/receita-muffin.jpg";
import picoleImg from "@/assets/receita-picole.jpg";

const imageMap: Record<string, string> = {
  melancia: melanciaImg,
  banana: bananaImg,
  abobrinha: abobrinhaImg,
  cenoura: cenouraImg,
  morango: morangoImg,
  abacate: abacateImg,
  muffin: muffinImg,
  picole: picoleImg,
};

interface FoodImageProps {
  name: string;
  className?: string;
  alt?: string;
}

export function FoodImage({ name, className, alt }: FoodImageProps) {
  const src = imageMap[name];
  if (!src) return (
    <div className={`${className} flex items-center justify-center text-4xl`}
      style={{ background: "hsl(var(--muted))" }}>
      🥦
    </div>
  );
  return <img src={src} alt={alt || name} className={className} />;
}
