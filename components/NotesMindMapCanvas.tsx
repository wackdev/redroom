"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { sound } from "@/lib/audio/sound-engine";

interface MindNode {
  id: string;
  text: string;
  x: number;
  y: number;
  level: 0 | 1 | 2;
  color: string;
  children: string[];
}

interface Props {
  title?: string;
  content?: string;
  keywords?: string[];
}

export default function NotesMindMapCanvas({
  title = "Preamble & Basic Structure",
  content = "• Article 13 judicial review\n• Kesavananda Bharati 1973\n• Sovereign Socialist Secular Democratic Republic\n• Minerva Mills 1980 balance",
  keywords = ["Basic Structure", "Article 368", "Judicial Review", "Constitutional Morality"],
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState<number>(1.0);

  // Parse lines and keywords into node graph
  const nodes = useMemo(() => {
    const parsedNodes: MindNode[] = [];

    // Root Center Node
    const centerX = 350;
    const centerY = 220;

    parsedNodes.push({
      id: "root",
      text: title || "Core Subject Concept",
      x: centerX,
      y: centerY,
      level: 0,
      color: "#D8A63A",
      children: [],
    });

    // Subtopic nodes parsed from keywords or bullet points
    const branchItems = keywords.length > 0 ? keywords : ["Key Pillar 1", "Key Pillar 2", "Key Pillar 3"];
    const radius = 160;
    const totalBranches = branchItems.length;

    branchItems.forEach((item, idx) => {
      const angle = (idx / totalBranches) * (2 * Math.PI) - Math.PI / 2;
      const bx = centerX + radius * Math.cos(angle);
      const by = centerY + radius * Math.sin(angle);
      const bId = `branch-${idx}`;

      parsedNodes[0].children.push(bId);
      parsedNodes.push({
        id: bId,
        text: item,
        x: bx,
        y: by,
        level: 1,
        color: "#F4C95D",
        children: [],
      });
    });

    return parsedNodes;
  }, [title, keywords]);

  // Render Canvas Graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(zoom, zoom);

    const rootNode = nodes[0];
    if (!rootNode) return;

    // Draw Connecting Lines
    nodes.slice(1).forEach((child) => {
      ctx.beginPath();
      ctx.moveTo(rootNode.x, rootNode.y);
      ctx.lineTo(child.x, child.y);
      ctx.strokeStyle = "rgba(216, 166, 58, 0.4)";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw Nodes
    nodes.forEach((node) => {
      ctx.beginPath();
      const isRoot = node.level === 0;
      const radius = isRoot ? 45 : 30;

      // Outer glow
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = isRoot ? "#1c1507" : "#111";
      ctx.fill();
      ctx.lineWidth = isRoot ? 3 : 1.5;
      ctx.strokeStyle = node.color;
      ctx.stroke();

      // Text label
      ctx.fillStyle = "#fff";
      ctx.font = isRoot ? "bold 11px monospace" : "10px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const words = node.text.split(" ");
      if (words.length > 2) {
        ctx.fillText(words.slice(0, 2).join(" "), node.x, node.y - 6);
        ctx.fillText(words.slice(2).join(" "), node.x, node.y + 7);
      } else {
        ctx.fillText(node.text, node.x, node.y);
      }
    });

    ctx.restore();
  }, [nodes, zoom]);

  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    sound.playWarp();
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `mindmap-${title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.png`;
    a.click();
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-4 gap-3">
        <div>
          <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#D8A63A]">
            VISUAL COGNITION ENGINE
          </span>
          <h3 className="mt-1 font-mono text-base font-bold text-white">
            Dynamic Notes Mind-Map Generator
          </h3>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}
            className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-white hover:bg-white/10"
          >
            -
          </button>
          <span className="text-[#8C8C8C]">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
            className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-white hover:bg-white/10"
          >
            +
          </button>
          <button
            onClick={handleDownloadImage}
            className="rounded-xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-3 py-1 font-bold text-[#F4C95D] hover:bg-[#D8A63A]/20 transition shadow"
          >
            📷 Export PNG
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="mt-4 flex justify-center overflow-hidden rounded-2xl border border-white/5 bg-black/60 p-2">
        <canvas
          ref={canvasRef}
          width={700}
          height={440}
          className="max-w-full rounded-xl bg-gradient-to-b from-[#080808] to-[#040404]"
        />
      </div>
    </div>
  );
}
