import React from 'react';

/**
 * B'Groceries Ambient Background Blobs
 * Theme:
 * - Base: #0B0F14 (Obsidian Dark)
 * - Brand Green Glow: #77BC1F
 * - Radiant Orange Glow: #FF9900
 * - Deep Slate Atmosphere: #232F3F
 */
export default function ClayBackgroundBlobs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10 bg-[#0B0F14]">
      {/* Blob 1: B'Groceries Signature Green - Top Left Orbit */}
      <div
        className="absolute -top-[15%] -left-[10%] w-[70vh] h-[70vh] rounded-full blur-[140px] animate-clay-float opacity-40"
        style={{
          background: 'radial-gradient(circle, rgba(119, 188, 31, 0.45) 0%, rgba(144, 224, 38, 0.15) 50%, transparent 75%)',
        }}
      />

      {/* Blob 2: Radiant Amazon Orange - Top Right Drift */}
      <div
        className="absolute top-[15%] -right-[12%] w-[65vh] h-[65vh] rounded-full blur-[140px] animate-clay-float-delayed opacity-35"
        style={{
          background: 'radial-gradient(circle, rgba(255, 153, 0, 0.45) 0%, rgba(255, 183, 77, 0.15) 50%, transparent 75%)',
        }}
      />

      {/* Blob 3: Deep Midnight Slate - Center/Bottom Flow */}
      <div
        className="absolute bottom-[4%] left-[22%] w-[60vh] h-[60vh] rounded-full blur-[160px] animate-clay-float-slow opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(35, 47, 63, 0.8) 0%, rgba(11, 15, 20, 0.4) 60%, transparent 80%)',
        }}
      />

      {/* Blob 4: Brand Green Spark - Bottom Left */}
      <div
        className="absolute bottom-[18%] -left-[8%] w-[50vh] h-[50vh] rounded-full blur-[130px] animate-clay-float animation-delay-4000 opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(119, 188, 31, 0.4) 0%, rgba(82, 134, 18, 0.1) 60%, transparent 80%)',
        }}
      />

      {/* Subtle Ambient Star Sheen Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: `radial-gradient(#FFFFFF 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
}
