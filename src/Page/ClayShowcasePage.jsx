import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Touchpad,
  Box,
  Copy,
  Check,
  ArrowRight,
  Heart,
  ShieldCheck,
  Zap,
  Activity,
  Search,
  Send,
  ArrowLeft
} from 'lucide-react';
import {
  ClayCard,
  ClayButton,
  ClayInput,
  ClayBackgroundBlobs,
  ClayStatOrb,
  ClayBadge,
  ClaySwitch
} from '../components/clay';
import { useApp } from '../context/AppContext';

export default function ClayShowcasePage() {
  const { setCurrentPage } = useApp();

  // Interactive Demo States
  const [squishCount, setSquishCount] = useState(0);
  const [isConvexMode, setIsConvexMode] = useState(true);
  const [copiedHex, setCopiedHex] = useState(null);
  const [inputText, setInputText] = useState('B\'Groceries Hyperstore SLA');
  const [activeCodeTab, setActiveCodeTab] = useState('button');
  const [switchA, setSwitchA] = useState(true);
  const [switchB, setSwitchB] = useState(false);
  const [selectedSize, setSelectedSize] = useState('default');

  const copyToClipboard = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const handleSquish = () => {
    setSquishCount((prev) => prev + 1);
  };

  // Color Palette Definition - B'Groceries Signature Theme
  const candyColors = [
    { name: 'Canvas Base', hex: '#0B0F14', desc: 'Deep Obsidian Void', textDark: false },
    { name: 'Container Slate', hex: '#232F3F', desc: 'Midnight Slate Surface', textDark: false },
    { name: 'Brand Green', hex: '#77BC1F', desc: 'Signature Lime Accent', textDark: true },
    { name: 'Radiant Orange', hex: '#FF9900', desc: 'Amazon Amber Action', textDark: true },
    { name: 'Crisp White', hex: '#FFFFFF', desc: 'Primary Text Contrast', textDark: true },
    { name: 'Slate Gray', hex: '#94A3B8', desc: 'Muted Secondary Labels', textDark: true },
    { name: 'Sky Fluid', hex: '#38BDF8', desc: 'Subtask / Informational', textDark: true },
    { name: 'Ruby Alert', hex: '#EF4444', desc: 'P1 / Critical Bug Alert', textDark: false },
  ];

  return (
    <div className="relative min-h-screen text-white font-dmsans selection:bg-[#77BC1F]/30 selection:text-[#77BC1F] overflow-x-hidden pb-24 bg-[#0B0F14]">
      {/* 1. Fluid Background Blobs */}
      <ClayBackgroundBlobs />

      {/* 2. Top Navigation Bar */}
      <header className="sticky top-4 z-40 px-4 sm:px-8 max-w-7xl mx-auto mb-8">
        <nav className="h-16 sm:h-20 rounded-[32px] sm:rounded-[40px] px-6 sm:px-8 bg-[#232F3F]/85 backdrop-blur-xl shadow-clayCard flex items-center justify-between border border-[#34465B] transition-all">
          <div className="flex items-center gap-3">
            {/* Logo Orb */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-[#77BC1F] to-[#5EA014] flex items-center justify-center text-[#0B0F14] font-black shadow-[0_0_15px_rgba(119,188,31,0.5)]">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                  className="font-black text-lg sm:text-xl tracking-tight text-white"
                >
                  B'Groceries Clay
                </span>
                <ClayBadge variant="green" size="sm">
                  #77BC1F • #FF9900
                </ClayBadge>
              </div>
              <span className="hidden sm:block text-xs font-semibold text-[#94A3B8]">
                #0B0F14 Obsidian Canvas • #232F3F Midnight Slate
              </span>
            </div>
          </div>

          {/* Quick Nav & Back to SLA Action */}
          <div className="flex items-center gap-3">
            <ClayButton
              variant="secondary"
              size="sm"
              icon={ArrowLeft}
              onClick={() => setCurrentPage('dashboard')}
              className="text-xs sm:text-sm font-bold"
            >
              Back to Board
            </ClayButton>

            <ClayButton
              variant="accent"
              size="sm"
              icon={Zap}
              onClick={handleSquish}
              className="hidden sm:inline-flex text-xs sm:text-sm"
            >
              Squish ({squishCount})
            </ClayButton>
          </div>
        </nav>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col gap-14 sm:gap-20">

        {/* 3. Hero Section */}
        <section className="relative pt-6 sm:pt-10 flex flex-col items-center text-center">
          {/* Top Pill Badge */}
          <ClayBadge variant="orange" size="md" icon={Heart} className="mb-6 animate-clay-breathe">
            ⚡ High-Fidelity B'Groceries Design System
          </ClayBadge>

          {/* Display Headline */}
          <h1
            style={{ fontFamily: 'Nunito, sans-serif' }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.08] max-w-5xl mb-6"
          >
            Tactile, Sleek & <br />
            <span className="clay-text-gradient">Powerfully Dynamic</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-[#94A3B8] max-w-3xl leading-relaxed font-medium mb-10">
            Engineered with deep obsidian darkness, midnight slate elevations, signature lime green radiance, and Amazon amber energy.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto">
            <ClayButton
              variant="accent"
              size="lg"
              icon={Touchpad}
              onClick={handleSquish}
              className="w-full sm:w-auto text-lg"
            >
              Test Squish Button
            </ClayButton>

            <ClayButton
              variant="primary"
              size="lg"
              icon={Box}
              onClick={() => {
                document.getElementById('bento-grid')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto text-lg"
            >
              Explore Components
            </ClayButton>
          </div>

          {/* Theme Highlights Strip */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-3 sm:gap-4 text-xs sm:text-sm font-extrabold text-[#94A3B8]">
            <ClayBadge variant="green" size="sm">✓ #77BC1F Signature Brand Green</ClayBadge>
            <ClayBadge variant="orange" size="sm">✓ #FF9900 Radiant Amazon Orange</ClayBadge>
            <ClayBadge variant="slate" size="sm">✓ #0B0F14 Obsidian Canvas</ClayBadge>
            <ClayBadge variant="slate" size="sm">✓ #232F3F Midnight Slate Cards</ClayBadge>
          </div>
        </section>

        {/* 4. Interactive Physics Playground */}
        <section className="flex flex-col gap-6">
          <div className="text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <ClayBadge variant="green" size="sm" className="mb-2">
                Real-Time Physics
              </ClayBadge>
              <h2
                style={{ fontFamily: 'Nunito, sans-serif' }}
                className="text-3xl sm:text-4xl font-black tracking-tight text-white"
              >
                The Tactile Physics Engine
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#94A3B8] max-w-md">
              Buttons actively squish (`scale-[0.92]` + recessed inset shadows), while cards float effortlessly with ambient colored rims.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Interactive Squish Lab */}
            <ClayCard className="md:col-span-2 flex flex-col justify-between" padding="p-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#77BC1F] to-[#5EA014] flex items-center justify-center text-[#0B0F14] font-black shadow-[0_0_15px_rgba(119,188,31,0.5)]">
                      <Touchpad className="w-6 h-6" />
                    </div>
                    <div>
                      <h3
                        style={{ fontFamily: 'Nunito, sans-serif' }}
                        className="text-xl sm:text-2xl font-black text-white"
                      >
                        Tactile Squish Reactor
                      </h3>
                      <p className="text-xs sm:text-sm text-[#94A3B8]">
                        Click or press and hold the buttons to feel physical compression
                      </p>
                    </div>
                  </div>
                  <ClayBadge variant="green" size="sm">
                    Live Feedback
                  </ClayBadge>
                </div>

                <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed mb-6">
                  Every interaction triggers an immediate, multi-layered visual response: 4px lift on hover, followed by dramatic 8% scale compression and inset ambient shadow when pressed.
                </p>

                {/* Interactive Squish Buttons */}
                <div className="flex flex-wrap items-center gap-4 py-4">
                  <ClayButton
                    variant="primary"
                    size="lg"
                    icon={Zap}
                    onClick={handleSquish}
                  >
                    Brand Green ({squishCount})
                  </ClayButton>

                  <ClayButton
                    variant="accent"
                    size="lg"
                    icon={Heart}
                    onClick={handleSquish}
                  >
                    Radiant Orange
                  </ClayButton>

                  <ClayButton
                    variant="secondary"
                    size="lg"
                    onClick={() => setSquishCount(0)}
                  >
                    Reset Count
                  </ClayButton>
                </div>
              </div>

              {/* Status Meter */}
              <div className="mt-8 pt-6 border-t border-[#2E3D50] flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-[#94A3B8]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#77BC1F] animate-pulse shadow-[0_0_8px_rgba(119,188,31,0.8)]" />
                  <span className="text-white">Physics Engine: Online</span>
                </div>
                <div>Squish Factor: 0.92x on active</div>
                <div>Color Matrix: #77BC1F & #FF9900</div>
              </div>
            </ClayCard>

            {/* Convex vs Concave Demonstration */}
            <ClayCard className="flex flex-col justify-between" padding="p-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF9900] to-[#E68A00] flex items-center justify-center text-[#0B0F14] font-black shadow-[0_0_15px_rgba(255,153,0,0.5)]">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h3
                      style={{ fontFamily: 'Nunito, sans-serif' }}
                      className="text-xl font-black text-white"
                    >
                      Convex vs Concave
                    </h3>
                    <p className="text-xs text-[#94A3B8]">Dual tactile states</p>
                  </div>
                </div>

                <p className="text-sm text-[#CBD5E1] mb-6">
                  Interactive items either bulge outward (Convexity) or are carved into the surface (Concavity).
                </p>

                {/* Convex Card Element */}
                <div className="mb-4 p-4 rounded-2xl bg-[#232F3F] border border-[#34465B] shadow-clayButton flex items-center justify-between">
                  <span style={{ fontFamily: 'Nunito, sans-serif' }} className="font-black text-sm text-[#77BC1F]">
                    Convex (Bulge Out)
                  </span>
                  <ClayBadge variant="green" size="sm">shadow-clayButton</ClayBadge>
                </div>

                {/* Concave Card Element */}
                <div className="p-4 rounded-2xl bg-[#141C26] border border-[#2E3D50] shadow-clayPressed flex items-center justify-between">
                  <span style={{ fontFamily: 'Nunito, sans-serif' }} className="font-black text-sm text-white">
                    Concave (Carved In)
                  </span>
                  <ClayBadge variant="slate" size="sm">shadow-clayPressed</ClayBadge>
                </div>
              </div>

              <div className="mt-6">
                <ClaySwitch
                  checked={isConvexMode}
                  onChange={setIsConvexMode}
                  label="Convex Lighting Mode"
                  description="Diffuse top-left ambient lighting"
                />
              </div>
            </ClayCard>
          </div>
        </section>

        {/* 5. Bento Grid Layout */}
        <section id="bento-grid" className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <ClayBadge variant="orange" size="sm" className="mb-2">
                Asymmetric Architecture
              </ClayBadge>
              <h2
                style={{ fontFamily: 'Nunito, sans-serif' }}
                className="text-3xl sm:text-4xl font-black tracking-tight text-white"
              >
                High-Fidelity Bento Grid
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#94A3B8] max-w-md">
              Mixing multi-column hero spans with nested clay shapes, stat orbs, and peeking decorative elements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento 1: Hero Card (col-span-2) */}
            <ClayCard className="md:col-span-2 relative min-h-[380px]" padding="p-8 sm:p-10">
              <div className="max-w-md">
                <ClayBadge variant="green" size="sm" className="mb-3">
                  Dark Claymorphism Architecture
                </ClayBadge>
                <h3
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                  className="text-2xl sm:text-3xl font-black text-white mb-3"
                >
                  Layered Optical Depth
                </h3>
                <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed mb-6">
                  Unlike flat vector art or harsh neumorphism, High-Fidelity Clay balances four simultaneous shadow layers:
                </p>

                <div className="space-y-3 text-xs sm:text-sm font-bold text-white">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#77BC1F]/20 text-[#77BC1F] border border-[#77BC1F]/40 flex items-center justify-center text-xs font-black shrink-0">1</span>
                    <span><strong>Deep Obsidian Drop Shadow:</strong> sets true elevation depth</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#FF9900]/20 text-[#FF9900] border border-[#FF9900]/40 flex items-center justify-center text-xs font-black shrink-0">2</span>
                    <span><strong>Top-Left Specular Highlight:</strong> catches ambient rim light</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center text-xs font-black shrink-0">3</span>
                    <span><strong>Subtle Colored Edge Glow:</strong> #77BC1F & #FF9900 bounce</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-[#77BC1F] border border-[#77BC1F]/40 flex items-center justify-center text-xs font-black shrink-0">4</span>
                    <span><strong>Active Inset Compression:</strong> satisfying tactile depression</span>
                  </div>
                </div>
              </div>

              {/* Peeking Decorative 3D Clay Composition */}
              <div className="hidden lg:flex absolute -right-6 -bottom-6 w-72 h-72 rounded-[40px] bg-gradient-to-br from-[#232F3F] to-[#141C26] border border-[#34465B] shadow-2xl p-6 flex-col justify-between transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="flex justify-between items-center">
                  <div className="w-8 h-8 rounded-full bg-[#77BC1F] shadow-[0_0_10px_rgba(119,188,31,0.8)]" />
                  <ClayBadge variant="orange" size="sm">Peeking Card</ClayBadge>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-3/4 rounded-full bg-[#34465B]" />
                  <div className="h-3 w-1/2 rounded-full bg-[#2E3D50]" />
                </div>
                <div className="flex justify-end">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF9900] to-[#E68A00] shadow-[0_0_15px_rgba(255,153,0,0.5)] flex items-center justify-center text-[#0B0F14] font-black">
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </ClayCard>

            {/* Bento 2: Stat Orb Card (Breathing Animation) */}
            <ClayCard className="flex flex-col justify-between items-center text-center" padding="p-8">
              <div className="w-full">
                <ClayBadge variant="green" size="sm" className="mb-4">
                  Zero-Gravity Buoyancy
                </ClayBadge>
                <h3
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                  className="text-xl font-black text-white mb-2"
                >
                  Clay Stat Orb
                </h3>
                <p className="text-xs text-[#94A3B8] mb-6">
                  6-second subtle breathing inflation cycle
                </p>
              </div>

              <ClayStatOrb
                number="99.8%"
                label="SLA Compliance"
                sublabel="Target Met"
                variant="green"
                size="default"
              />

              <div className="mt-6 text-xs text-[#94A3B8] font-medium">
                Hover orb to experience 110% expansion
              </div>
            </ClayCard>

            {/* Bento 3: 4 Stat Orbs Strip */}
            <ClayCard className="md:col-span-3" padding="p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <div>
                  <h3
                    style={{ fontFamily: 'Nunito, sans-serif' }}
                    className="text-2xl font-black text-white"
                  >
                    Tangible Metrics in Motion
                  </h3>
                  <p className="text-sm text-[#94A3B8]">
                    Spherical digital clay with specular sheen and glowing colored shadows
                  </p>
                </div>
                <ClayBadge variant="orange" size="sm">
                  Spherical Geometry
                </ClayBadge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
                <ClayStatOrb
                  number="95.8%"
                  label="Compliance Rate"
                  sublabel="Hyperstore SLA"
                  variant="green"
                />
                <ClayStatOrb
                  number="2.4h"
                  label="Average TAT"
                  sublabel="Rush Requests"
                  variant="orange"
                />
                <ClayStatOrb
                  number="0.92x"
                  label="Squish Factor"
                  sublabel="Active Scale"
                  variant="green"
                />
                <ClayStatOrb
                  number="100%"
                  label="Digital Clay"
                  sublabel="Theme Aligned"
                  variant="orange"
                />
              </div>
            </ClayCard>
          </div>
        </section>

        {/* 6. The Brand Color Palette Swatches */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <ClayBadge variant="green" size="sm" className="mb-2">
                Brand Palette
              </ClayBadge>
              <h2
                style={{ fontFamily: 'Nunito, sans-serif' }}
                className="text-3xl sm:text-4xl font-black tracking-tight text-white"
              >
                The Theme Color Tokens
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#94A3B8] max-w-md">
              Click any swatch to copy HEX to clipboard. High contrast meets vibrant, joyful saturation.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {candyColors.map((color) => {
              const isCopied = copiedHex === color.hex;
              return (
                <div
                  key={color.hex}
                  onClick={() => copyToClipboard(color.hex)}
                  className="group cursor-pointer select-none"
                >
                  <ClayCard
                    padding="p-5"
                    className="flex flex-col justify-between h-44 hover:border-[#77BC1F]/60"
                  >
                    {/* Swatch Pill */}
                    <div
                      className="w-full h-14 rounded-2xl border border-white/20 shadow-md flex items-center justify-between px-3.5 transition-transform group-hover:scale-105"
                      style={{ backgroundColor: color.hex }}
                    >
                      <span className={`text-xs font-black ${color.textDark ? 'text-[#0B0F14]' : 'text-white'}`}>
                        {color.hex}
                      </span>
                      {isCopied ? (
                        <Check className={`w-4 h-4 ${color.textDark ? 'text-[#0B0F14]' : 'text-white'}`} />
                      ) : (
                        <Copy className={`w-4 h-4 opacity-70 group-hover:opacity-100 ${color.textDark ? 'text-[#0B0F14]' : 'text-white'}`} />
                      )}
                    </div>

                    {/* Metadata */}
                    <div>
                      <div
                        style={{ fontFamily: 'Nunito, sans-serif' }}
                        className="font-black text-sm text-white group-hover:text-[#77BC1F] transition-colors"
                      >
                        {color.name}
                      </div>
                      <div className="text-xs text-[#94A3B8] mt-0.5">
                        {isCopied ? '✓ Copied!' : color.desc}
                      </div>
                    </div>
                  </ClayCard>
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. Comprehensive Component Sandbox */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <ClayBadge variant="green" size="sm" className="mb-2">
                UI Kit Showcase
              </ClayBadge>
              <h2
                style={{ fontFamily: 'Nunito, sans-serif' }}
                className="text-3xl sm:text-4xl font-black tracking-tight text-white"
              >
                Interactive Clay Components
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#94A3B8] max-w-md">
              Complete set of production-ready components built for high-fidelity claymorphic interfaces.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Buttons & Actions */}
            <ClayCard padding="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3
                    style={{ fontFamily: 'Nunito, sans-serif' }}
                    className="text-xl font-black text-white"
                  >
                    Clay Buttons (Convexity)
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    All sizes and color variants with active squish physics
                  </p>
                </div>
                <div className="flex gap-1.5 p-1 bg-[#141C26] rounded-xl border border-[#2E3D50]">
                  {['sm', 'default', 'lg'].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-[#77BC1F] text-[#0B0F14] font-black shadow-sm'
                          : 'text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Variants Matrix */}
              <div className="flex flex-wrap gap-4 items-center">
                <ClayButton variant="primary" size={selectedSize} icon={Sparkles}>
                  Brand Green #77BC1F
                </ClayButton>
                <ClayButton variant="accent" size={selectedSize} icon={Zap}>
                  Radiant Orange #FF9900
                </ClayButton>
                <ClayButton variant="secondary" size={selectedSize} icon={ShieldCheck}>
                  Midnight Slate
                </ClayButton>
                <ClayButton variant="sky" size={selectedSize} icon={Activity}>
                  Sky Blue
                </ClayButton>
                <ClayButton variant="outline" size={selectedSize}>
                  Outline Glass
                </ClayButton>
                <ClayButton variant="ghost" size={selectedSize}>
                  Ghost Link
                </ClayButton>
              </div>

              <div className="mt-8 pt-6 border-t border-[#2E3D50] flex items-center justify-between text-xs text-[#94A3B8]">
                <span>Border radius: rounded-[20px]</span>
                <span>Default height: h-14 (56px)</span>
              </div>
            </ClayCard>

            {/* Inputs & Form Controls */}
            <ClayCard padding="p-8">
              <div className="mb-6">
                <h3
                  style={{ fontFamily: 'Nunito, sans-serif' }}
                  className="text-xl font-black text-white"
                >
                  Recessed Inputs & Toggles
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Concave recessed well transforms into raised focus state with glowing green ring
                </p>
              </div>

              <div className="space-y-5">
                <ClayInput
                  label="Search or Command"
                  icon={Search}
                  placeholder="Type to test focus transition..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  helper="Concave well shifts to focus state"
                />

                <ClayInput
                  label="Recipient Email"
                  type="email"
                  placeholder="admin@bgroceries.com"
                  icon={Send}
                />

                <div className="pt-2 flex flex-col sm:flex-row gap-6">
                  <ClaySwitch
                    checked={switchA}
                    onChange={setSwitchA}
                    label="Squish Feedback"
                    description="Trigger tactile compression"
                  />
                  <ClaySwitch
                    checked={switchB}
                    onChange={setSwitchB}
                    label="Ambient Glow"
                    description="Enable neon border glow"
                  />
                </div>
              </div>
            </ClayCard>
          </div>
        </section>

        {/* 8. Code & Developer Usage Guide */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <ClayBadge variant="green" size="sm" className="mb-2">
                Developer Integration
              </ClayBadge>
              <h2
                style={{ fontFamily: 'Nunito, sans-serif' }}
                className="text-3xl sm:text-4xl font-black tracking-tight text-white"
              >
                Reusable Code Architecture
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#94A3B8] max-w-md">
              Drop-in components ready to integrate across the SLA application.
            </p>
          </div>

          <ClayCard padding="p-6 sm:p-8">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-[#2E3D50] pb-4">
              {[
                { id: 'button', label: '<ClayButton />' },
                { id: 'card', label: '<ClayCard />' },
                { id: 'input', label: '<ClayInput />' },
                { id: 'orb', label: '<ClayStatOrb />' },
                { id: 'blobs', label: '<ClayBackgroundBlobs />' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCodeTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-black transition-all cursor-pointer ${
                    activeCodeTab === tab.id
                      ? 'bg-gradient-to-r from-[#FF9900] to-[#E68A00] text-[#0B0F14] shadow-[0_0_12px_rgba(255,153,0,0.4)]'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#1A232F]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Code Content */}
            <div className="p-6 rounded-2xl bg-[#0B0F14] text-emerald-400 font-mono text-xs sm:text-sm overflow-x-auto border border-[#2E3D50]">
              {activeCodeTab === 'button' && (
                <pre>{`import { ClayButton } from '../components/clay';
import { Sparkles } from 'lucide-react';

export default function MyComponent() {
  return (
    <ClayButton
      variant="primary"        // 'primary' (#77BC1F) | 'accent' (#FF9900) | 'secondary'
      size="default"           // 'sm' (h-11) | 'default' (h-14) | 'lg' (h-16)
      icon={Sparkles}
      onClick={() => alert('Squished!')}
    >
      Confirm Action
    </ClayButton>
  );
}`}</pre>
              )}

              {activeCodeTab === 'card' && (
                <pre>{`import { ClayCard } from '../components/clay';

export default function CardDemo() {
  return (
    <ClayCard
      variant="glass"          // 'glass' | 'solid' | 'obsidian' | 'recessed'
      radius="rounded-[32px]"  // Super-rounded
      interactive={true}       // Hover lift + enhanced shadow
      padding="p-8"
    >
      <h3 className="font-nunito font-black text-2xl text-white">Digital Clay Card</h3>
      <p className="text-[#94A3B8]">Floating with #232F3F midnight slate depth.</p>
    </ClayCard>
  );
}`}</pre>
              )}

              {activeCodeTab === 'input' && (
                <pre>{`import { ClayInput } from '../components/clay';
import { Search } from 'lucide-react';

export default function InputDemo() {
  return (
    <ClayInput
      label="Ticket Title"
      icon={Search}
      placeholder="e.g. POSM Banners for Hyperstore..."
      helper="Concave well transforms into raised surface on focus"
      onChange={(e) => console.log(e.target.value)}
    />
  );
}`}</pre>
              )}

              {activeCodeTab === 'orb' && (
                <pre>{`import { ClayStatOrb } from '../components/clay';

export default function StatsDemo() {
  return (
    <ClayStatOrb
      number="99.8%"
      label="SLA Compliance"
      sublabel="Target Met"
      variant="green"           // 'green' (#77BC1F) | 'orange' (#FF9900) | 'slate'
      size="default"            // 'sm' | 'default' | 'lg'
    />
  );
}`}</pre>
              )}

              {activeCodeTab === 'blobs' && (
                <pre>{`import { ClayBackgroundBlobs } from '../components/clay';

export default function AppLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-[#0B0F14]">
      {/* Ambient background blobs with glowing #77BC1F & #FF9900 */}
      <ClayBackgroundBlobs />
      <main className="relative z-10">{children}</main>
    </div>
  );
}`}</pre>
              )}
            </div>
          </ClayCard>
        </section>

        {/* 9. Return to SLA Application Banner */}
        <section className="mt-4">
          <ClayCard
            className="text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6"
            padding="p-8 sm:p-10"
            variant="glass"
          >
            <div>
              <ClayBadge variant="orange" size="sm" className="mb-2">
                Live Integration
              </ClayBadge>
              <h3
                style={{ fontFamily: 'Nunito, sans-serif' }}
                className="text-2xl sm:text-3xl font-black text-white mb-2"
              >
                Experience the Overhauled SLA Portal
              </h3>
              <p className="text-sm sm:text-base text-[#94A3B8] max-w-xl">
                The entire Kanban board, Top navigation, Sidebar, Columns, and Ticket cards are live with the #FF9900, #77BC1F, #0B0F14, and #232F3F theme.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <ClayButton
                variant="accent"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => setCurrentPage('dashboard')}
                className="w-full sm:w-auto"
              >
                Go to Kanban Board
              </ClayButton>
            </div>
          </ClayCard>
        </section>

      </main>

      {/* 10. Footer */}
      <footer className="mt-20 max-w-7xl mx-auto px-4 sm:px-8 text-center text-xs font-semibold text-[#94A3B8]">
        <div className="py-6 border-t border-[#2E3D50] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>B'Groceries Hyperstore SLA • #FF9900 • #77BC1F • #0B0F14 • #232F3F</div>
          <div className="flex items-center gap-4">
            <span className="cursor-pointer hover:text-[#77BC1F] transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Back to Top ↑
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
