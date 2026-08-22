"use client";

import { useEffect, useRef, useState } from "react";
import { sound } from "@/lib/audio/sound-engine";

interface GeoFeature {
  id: string;
  name: string;
  category: "monsoon" | "rivers" | "tectonics" | "currents" | "ecology";
  lat: number;
  lng: number;
  description: string;
  pyqNote: string;
}

export default function GeographyGlobe3D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("monsoon");
  const [selectedFeature, setSelectedFeature] = useState<GeoFeature | null>(null);
  
  const rotationRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);

  const geoFeatures: GeoFeature[] = [
    {
      id: "sw-monsoon",
      name: "South-West Monsoon Jet Streams",
      category: "monsoon",
      lat: 12.5,
      lng: 75.0,
      description: "Triggered by the intense thermal heating of the Tibetan Plateau and the development of the Tropical Easterly Jet (TEJ). Somalian Jet strengthens the moisture transport from the Arabian Sea.",
      pyqNote: "UPSC 2021: With reference to Indian Ocean Dipole (IOD) and El Niño, consider how they influence the Indian Summer Monsoon.",
    },
    {
      id: "ganga-basin",
      name: "Ganga-Brahmaputra Drainage Basin",
      category: "rivers",
      lat: 25.3,
      lng: 85.0,
      description: "Perennial antecedent rivers originating in the Himalayas. Antecedent gorge cutting and massive alluvial deposition forming the Northern Plains.",
      pyqNote: "UPSC 2019: Trace the left-bank tributaries of Ganga from West to East: Ramganga, Gomti, Ghaghara, Gandak, Kosi.",
    },
    {
      id: "himalayan-tectonics",
      name: "Main Boundary Thrust (MBT) & Main Central Thrust (MCT)",
      category: "tectonics",
      lat: 30.5,
      lng: 79.0,
      description: "Zone of active continental collision between the Indian Plate and Eurasian Plate moving at ~5 cm/year, leading to intense seismicity and orogeny.",
      pyqNote: "UPSC 2020: Why are the Himalayas highly prone to landslides and seismic hazards compared to the Western Ghats?",
    },
    {
      id: "somali-current",
      name: "Somali Current & Arabian Sea Upwelling",
      category: "currents",
      lat: 10.0,
      lng: 55.0,
      description: "Unique western boundary current in the Northern Indian Ocean that reverses its direction with the seasonal change of monsoonal winds.",
      pyqNote: "UPSC 2015: What explains the reversal of currents in the North Indian Ocean?",
    },
    {
      id: "western-ghats",
      name: "Western Ghats UNESCO Biodiversity Hotspot",
      category: "ecology",
      lat: 11.5,
      lng: 76.5,
      description: "High levels of biological endemism (e.g., Nilgiri Tahr, Lion-tailed Macaque, Shola-grassland ecosystems). Subject to Gadgil & Kasturirangan ecological committee recommendations.",
      pyqNote: "UPSC 2018: In which of the following regions of India are you most likely to come across the Great Hornbill in its natural habitat?",
    },
  ];

  const filteredFeatures = geoFeatures.filter(
    (f) => activeCategory === "all" || f.category === activeCategory
  );

  const selectedFeatureRef = useRef<GeoFeature | null>(null);
  selectedFeatureRef.current = selectedFeature;

  const filteredFeaturesRef = useRef<GeoFeature[]>(filteredFeatures);
  filteredFeaturesRef.current = filteredFeatures;

  // 3D Canvas Globe Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    const render = () => {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width * 0.38, 170);

      if (!isDraggingRef.current) {
        rotationRef.current += 0.003;
      }
      const rot = rotationRef.current;

      // Volumetric Atmosphere Glow
      const atmGlow = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius * 1.35);
      atmGlow.addColorStop(0, "rgba(255, 27, 27, 0.2)");
      atmGlow.addColorStop(0.5, "rgba(255, 27, 27, 0.06)");
      atmGlow.addColorStop(1, "rgba(5, 5, 5, 0)");
      ctx.fillStyle = atmGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // Globe Base Sphere
      const globeGrad = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        radius * 0.1,
        centerX,
        centerY,
        radius
      );
      globeGrad.addColorStop(0, "#1c0909");
      globeGrad.addColorStop(0.7, "#0d0404");
      globeGrad.addColorStop(1, "#050505");
      ctx.fillStyle = globeGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 27, 27, 0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Latitude Rings (Parallels)
      const parallels = [-60, -30, 0, 30, 60];
      parallels.forEach((lat) => {
        const y = centerY - (lat / 90) * (radius * 0.85);
        const rLat = Math.max(0.1, Math.sqrt(Math.max(0, radius * radius - Math.pow(centerY - y, 2))));

        ctx.beginPath();
        ctx.ellipse(centerX, y, rLat, Math.max(0.1, rLat * 0.25), 0, 0, Math.PI * 2);
        ctx.strokeStyle = lat === 0 ? "rgba(216, 166, 58, 0.4)" : "rgba(216, 166, 58, 0.1)";
        ctx.lineWidth = lat === 0 ? 1.5 : 0.8;
        ctx.stroke();
      });

      // Longitude Meridians (Rotating)
      const meridianCount = 12;
      for (let m = 0; m < meridianCount; m++) {
        const meridianAngle = (m * Math.PI) / (meridianCount / 2) + rot;
        const cosM = Math.cos(meridianAngle);

        if (cosM > -0.1) {
          ctx.beginPath();
          ctx.ellipse(centerX, centerY, Math.max(0.1, radius * Math.abs(cosM)), Math.max(0.1, radius), 0, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(216, 166, 58, 0.12)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Feature Pinpoints Projection
      filteredFeaturesRef.current.forEach((feat) => {
        const radLng = ((feat.lng + (rot * 180) / Math.PI) * Math.PI) / 180;
        const radLat = (feat.lat * Math.PI) / 180;

        const x3d = radius * Math.cos(radLat) * Math.sin(radLng);
        const y3d = -radius * Math.sin(radLat);
        const z3d = radius * Math.cos(radLat) * Math.cos(radLng);

        // Render only if on the visible hemisphere
        if (z3d > 0) {
          const pinX = centerX + x3d;
          const pinY = centerY + y3d;

          const isSelected = selectedFeatureRef.current?.id === feat.id;

          // Pulse Aura
          ctx.beginPath();
          ctx.arc(pinX, pinY, isSelected ? 9 : 5, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? "#FFFFFF" : "#FF1B1B";
          ctx.shadowColor = "#FF1B1B";
          ctx.shadowBlur = 15;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Label
          ctx.fillStyle = isSelected ? "#FFFFFF" : "#FF6666";
          ctx.font = isSelected ? "bold 11px monospace" : "9px monospace";
          ctx.textAlign = "left";
          ctx.fillText(feat.name, pinX + 10, pinY + 3);
        }
      });

      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const delta = (e.clientX - startXRef.current) * 0.008;
    rotationRef.current += delta;
    startXRef.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <div className="flex flex-col rounded-3xl border border-[#FF1B1B]/30 bg-[#0d0d0d] p-4 sm:p-6 backdrop-blur-xl shadow-2xl">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="font-mono text-xs font-black uppercase text-[#FF1B1B]">
            EARTH SYSTEM SCIENCE // GEOGRAPHY & ENVIRONMENT
          </span>
          <h2 className="mt-1 font-mono text-xl sm:text-2xl font-black text-white">
            Interactive 3D Planetary Sphere
          </h2>
          <p className="text-xs text-[#8C8C8C]">
            Explore atmospheric circulation, monsoon dynamics, and Indian tectonic systems.
          </p>
        </div>

        {/* LAYER TOGGLES */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "monsoon", label: "🌧️ Monsoon & TEJ" },
            { id: "rivers", label: "🌊 River Basins" },
            { id: "tectonics", label: "🏔️ Faultlines" },
            { id: "currents", label: "🌀 Ocean Currents" },
            { id: "ecology", label: "🌿 Hotspots" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playHover();
                setActiveCategory(cat.id);
              }}
              className={`rounded-xl border px-3 py-1.5 font-mono text-xs transition touch-manipulation cursor-pointer ${
                activeCategory === cat.id
                  ? "border-[#FF1B1B] bg-[#FF1B1B] text-black font-black shadow-[0_0_15px_rgba(255,27,27,0.4)]"
                  : "border-white/10 bg-black/40 text-[#8C8C8C] hover:border-white/30 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D GLOBE CONTAINER */}
      <div className="my-6 grid gap-6 lg:grid-cols-12">
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ touchAction: "none" }}
          className="relative h-[340px] sm:h-[420px] lg:col-span-7 overflow-hidden rounded-2xl border border-white/10 bg-[#050505] cursor-grab active:cursor-grabbing flex items-center justify-center select-none"
        >
          <canvas ref={canvasRef} className="h-full w-full pointer-events-none" />
          <div className="pointer-events-none absolute bottom-4 left-4 text-[10px] font-mono text-white/40">
            DRAG / TOUCH TO ROTATE PLANETARY SPHERE
          </div>
        </div>

        {/* FEATURE SELECTOR & INTELLIGENCE DRAWER */}
        <div className="space-y-3 lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {filteredFeatures.map((feat) => {
              const isSelected = selectedFeature?.id === feat.id;
              return (
                <div
                  key={feat.id}
                  onClick={() => {
                    sound.playLock();
                    setSelectedFeature(feat);
                  }}
                  className={`cursor-pointer rounded-xl border p-3 font-mono transition touch-manipulation ${
                    isSelected
                      ? "border-[#FF1B1B] bg-[#FF1B1B]/15 text-white shadow-[0_0_15px_rgba(255,27,27,0.3)]"
                      : "border-white/10 bg-black/40 text-[#8C8C8C] hover:border-white/30 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-xs text-white">{feat.name}</h4>
                    <span className="text-[10px] text-[#FF1B1B]">
                      {feat.lat}°N, {feat.lng}°E
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ACTIVE FEATURE RADAR CARD */}
          {selectedFeature ? (
            <div className="rounded-2xl border border-[#FF1B1B]/30 bg-black/60 p-4 font-mono">
              <span className="text-[10px] font-black uppercase text-[#FF1B1B]">
                GEOGRAPHIC TELEMETRY
              </span>
              <h3 className="mt-1 text-sm font-black text-white">{selectedFeature.name}</h3>
              <p className="mt-2 text-xs text-white/80 leading-relaxed">
                {selectedFeature.description}
              </p>
              <div className="mt-3 rounded-lg border border-[#FF1B1B]/20 bg-[#FF1B1B]/10 p-2.5">
                <span className="text-[10px] font-bold text-[#FF1B1B]">UPSC PRELIMS / MAINS LINK</span>
                <p className="mt-0.5 text-xs text-white/90 italic">&quot;{selectedFeature.pyqNote}&quot;</p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-xs font-mono text-white/40">
              Select a geographical feature above to inspect UPSC telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

