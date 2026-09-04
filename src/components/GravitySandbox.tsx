"use client";

import React, { useEffect, useRef } from "react";
import { type Item, CATEGORY_COLORS } from "@/data/items";
import { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Body } from "matter-js";
import { X, RotateCcw } from "lucide-react";

interface GravitySandboxProps {
  isOpen: boolean;
  onClose: () => void;
  items: Item[];
  onSelectItem: (item: Item) => void;
}

export default function GravitySandbox({ isOpen, onClose, items, onSelectItem }: GravitySandboxProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const engine = Engine.create({
      gravity: { x: 0, y: 0.9, scale: 0.001 },
    });
    const world = engine.world;
    const runner = Runner.create();

    // Boundary walls (static)
    const wallThickness = 100;
    const ground = Bodies.rectangle(width / 2, height + wallThickness / 2 - 10, width * 2, wallThickness, {
      isStatic: true,
      restitution: 0.5,
    });
    const leftWall = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 2, {
      isStatic: true,
      restitution: 0.5,
    });
    const rightWall = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 2, {
      isStatic: true,
      restitution: 0.5,
    });
    const ceiling = Bodies.rectangle(width / 2, -wallThickness * 2, width * 2, wallThickness, {
      isStatic: true,
    });

    Composite.add(world, [ground, leftWall, rightWall, ceiling]);

    // Item boxes
    const sandboxItems = items.slice(0, 24);
    const boxWidth = Math.min(160, Math.max(120, width / 6));
    const boxHeight = 56;

    const bodyItemMap = new Map<number, Item>();

    const itemBodies = sandboxItems.map((item, index) => {
      const col = index % 4;
      const startX = (width / 5) * (col + 1) + (Math.random() * 40 - 20);
      const startY = -60 - (index * 70);

      const body = Bodies.rectangle(startX, startY, boxWidth, boxHeight, {
        restitution: 0.45,
        friction: 0.15,
        density: 0.002,
        chamfer: { radius: 2 },
      });

      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);
      bodyItemMap.set(body.id, item);
      return body;
    });

    Composite.add(world, itemBodies);

    // Mouse / Touch drag constraint
    const mouse = Mouse.create(canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    Composite.add(world, mouseConstraint);

    // Track click vs drag
    let startMousePos = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      startMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = (e: MouseEvent) => {
      const dist = Math.hypot(e.clientX - startMousePos.x, e.clientY - startMousePos.y);
      if (dist < 6) {
        // Simple click: check which body was clicked
        for (const body of itemBodies) {
          const dx = e.clientX - body.position.x;
          const dy = e.clientY - body.position.y;
          if (Math.abs(dx) <= boxWidth / 2 && Math.abs(dy) <= boxHeight / 2) {
            const clickedItem = bodyItemMap.get(body.id);
            if (clickedItem) {
              onSelectItem(clickedItem);
              break;
            }
          }
        }
      }
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // Start physics loop
    Runner.run(runner, engine);

    // Render loop
    let animId: number;
    const ctx = canvas.getContext("2d");

    const render = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid background
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw bodies
      itemBodies.forEach((body) => {
        const item = bodyItemMap.get(body.id);
        if (!item) return;

        const colors = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Websites;

        ctx.save();
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(body.angle);

        // Body fill
        ctx.fillStyle = "rgba(17, 17, 17, 0.95)";
        ctx.fillRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight);

        // Category left accent
        ctx.fillStyle = colors.accent;
        ctx.fillRect(-boxWidth / 2, -boxHeight / 2, 4, boxHeight);

        // Border
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1;
        ctx.strokeRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight);

        // Hairline corners
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 1.5;
        const cLen = 6;
        // Top-left
        ctx.beginPath();
        ctx.moveTo(-boxWidth / 2, -boxHeight / 2 + cLen);
        ctx.lineTo(-boxWidth / 2, -boxHeight / 2);
        ctx.lineTo(-boxWidth / 2 + cLen, -boxHeight / 2);
        ctx.stroke();
        // Top-right
        ctx.beginPath();
        ctx.moveTo(boxWidth / 2 - cLen, -boxHeight / 2);
        ctx.lineTo(boxWidth / 2, -boxHeight / 2);
        ctx.lineTo(boxWidth / 2, -boxHeight / 2 + cLen);
        ctx.stroke();

        // Title text
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        const maxTextW = boxWidth - 20;
        let title = item.title;
        if (ctx.measureText(title).width > maxTextW) {
          while (title.length > 3 && ctx.measureText(title + "…").width > maxTextW) {
            title = title.slice(0, -1);
          }
          title += "…";
        }
        ctx.fillText(title, -boxWidth / 2 + 10, -6);

        // Category label
        ctx.fillStyle = colors.accent;
        ctx.font = "bold 9px monospace";
        ctx.fillText(item.category.toUpperCase(), -boxWidth / 2 + 10, 12);

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(animId);
      Runner.stop(runner);
      Composite.clear(world, false);
      Engine.clear(engine);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, items, onClose, onSelectItem]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] bg-black/90 backdrop-blur-md flex flex-col items-center justify-between pointer-events-auto">
      {/* Top HUD Bar */}
      <div className="w-full flex items-center justify-between p-4 md:px-8 border-b border-white/10 z-20 bg-black/40">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#a3e635] animate-ping" />
          <span className="font-mono text-xs md:text-sm text-[#a3e635] font-bold tracking-widest uppercase">
            PHYSICS_SANDBOX // GRAVITY [9.8 m/s²]
          </span>
          <span className="hidden md:inline-block text-white/30 text-xs font-mono">
            — DRAG, FLING & TOSS TOOLS AROUND
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Exit sandbox"
            className="flex items-center gap-2 px-3 py-1.5 bg-[#a3e635] text-black font-mono font-bold text-xs uppercase hover:bg-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Grid [Esc]</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Physics Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing" />

      {/* Bottom Status Tip */}
      <div className="z-20 pb-4 text-center pointer-events-none">
        <p className="text-[11px] font-mono text-white/40 tracking-wider">
          CLICK ANY TOOL TO VIEW DETAILS • DRAG & TOSS WITH MOUSE
        </p>
      </div>
    </div>
  );
}
