'use client';

import React, { useState } from 'react';
import { PORTFOLIO_DATA, SkillPocket } from '@/data/portfolioData';
import { soundManager } from '@/game/audio/SoundManager';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Send,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Code,
  Layout,
  Server,
  Cloud,
  Cpu,
  Database,
  Wrench,
  CheckCircle2,
  Copy,
  Mail
} from 'lucide-react';

interface BagModalProps {
  onClose: () => void;
}

interface CartItem {
  name: string;
  category: string;
  level: string;
  tag: string;
}

export const BagModal: React.FC<BagModalProps> = ({ onClose }) => {
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const [selectedItemIdx, setSelectedItemIdx] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([
    { name: 'Python', category: 'Languages', level: 'Expert', tag: 'Core' },
    { name: 'Next.js', category: 'Frontend', level: 'Expert', tag: 'FullStack' },
    { name: 'FastAPI', category: 'Backend', level: 'Expert', tag: 'AsyncAPI' }
  ]);
  const [viewMode, setViewMode] = useState<'shop' | 'checkout' | 'success'>('shop');

  // Checkout Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientRole, setClientRole] = useState('Recruiter / Engineering Manager');
  const [clientMessage, setClientMessage] = useState(
    'Hi Aritro! We were impressed by your open-world portfolio and systems work. We would like to discuss engineering opportunities.'
  );
  const [isCopied, setIsCopied] = useState(false);

  const categories = PORTFOLIO_DATA.skillPockets;
  const currentCategory: SkillPocket = categories[selectedCategoryIdx] || categories[0];
  const currentItem = currentCategory.items[selectedItemIdx] || currentCategory.items[0];

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case 'Languages': return Code;
      case 'Frontend': return Layout;
      case 'Backend': return Server;
      case 'Cloud & DevOps': return Cloud;
      case 'AI/ML': return Cpu;
      case 'Databases': return Database;
      case 'Tools': return Wrench;
      default: return Sparkles;
    }
  };

  const handleCategoryTab = (idx: number) => {
    soundManager.playMenuCursor();
    setSelectedCategoryIdx(idx);
    setSelectedItemIdx(0);
  };

  const handleItemClick = (idx: number) => {
    soundManager.playSelect();
    setSelectedItemIdx(idx);
  };

  const isItemInCart = (name: string) => cart.some((c) => c.name === name);

  const toggleCartItem = (item: { name: string; level: string; tag: string }, category: string) => {
    if (isItemInCart(item.name)) {
      soundManager.playCancel();
      setCart((prev) => prev.filter((c) => c.name !== item.name));
    } else {
      soundManager.playFanfare();
      setCart((prev) => [...prev, { name: item.name, category, level: item.level, tag: item.tag }]);
    }
  };

  const removeCartItem = (name: string) => {
    soundManager.playCancel();
    setCart((prev) => prev.filter((c) => c.name !== name));
  };

  const clearCart = () => {
    soundManager.playCancel();
    setCart([]);
  };

  // Group cart items by category
  const groupedCart = cart.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  // Generate Pokemon Retro Mail Plaintext and Mailto URI
  const generateMailBody = () => {
    let body = `=====================================================\n`;
    body += `     POKÉMON TECH MART • TALENT ORDER DISPATCH\n`;
    body += `=====================================================\n\n`;
    body += `DEAR ARITRO SAHA,\n\n`;
    body += `A client has submitted an inquiry order from the Pallet Cloud Tech Mart!\n\n`;
    body += `-----------------------------------------------------\n`;
    body += `CUSTOMER MESSAGE:\n`;
    body += `-----------------------------------------------------\n`;
    body += `${clientMessage.trim() || 'No additional note provided.'}\n\n`;
    body += `-----------------------------------------------------\n`;
    body += `CLIENT DOSSIER:\n`;
    body += `-----------------------------------------------------\n`;
    body += `Name:         ${clientName.trim() || 'Prospective Collaborator / Recruiter'}\n`;
    body += `Email:        ${clientEmail.trim() || 'Not specified'}\n`;
    body += `Organization: ${clientRole.trim() || 'Tech Organization'}\n\n`;
    body += `=====================================================\n`;
    body += `             SKILLS ORDERED FROM MART\n`;
    body += `=====================================================\n\n`;

    if (Object.keys(groupedCart).length === 0) {
      body += `(No specific skills selected - Full-Stack General Inquiry)\n\n`;
    } else {
      for (const [cat, items] of Object.entries(groupedCart)) {
        body += `[${cat.toUpperCase()}]\n`;
        body += items.map((i) => `  * ${i.name} (${i.level} • ${i.tag})`).join('\n') + `\n\n`;
      }
    }

    body += `=====================================================\n`;
    body += `Sent via Aritro's 2.5D Open-World RPG Portfolio\n`;
    body += `Pallet Cloud Tech Mart Terminal\n`;
    body += `=====================================================\n`;

    return body;
  };

  const handleSendMail = () => {
    soundManager.playFanfare();
    const mailtoSubject = encodeURIComponent(
      `[Tech Mart Order] Skills Inquiry from ${clientName.trim() || 'Engineering Client'}`
    );
    const mailtoBody = encodeURIComponent(generateMailBody());
    window.location.href = `mailto:aritrosaha2025@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
    setViewMode('success');
  };

  const copyToClipboard = () => {
    soundManager.playSelect();
    navigator.clipboard.writeText(generateMailBody());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-xs font-pixel">
      {/* Retro Blue & Gold Poké Mart Shop Shell */}
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#1e3a8a] via-[#172554] to-[#0f172a] border-4 sm:border-8 border-slate-950 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="bg-[#09153a] px-4 py-2.5 border-b-4 border-slate-950 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-yellow-300 flex items-center justify-center text-[10px] text-yellow-300 font-bold">
              $
            </div>
            <span className="text-xs md:text-sm font-bold text-white tracking-wider flex items-center gap-2">
              <span>PALLET CLOUD POKÉ MART</span>
              <span className="text-[10px] text-yellow-400 font-silk bg-yellow-950/80 px-2 py-0.5 rounded border border-yellow-500/50">
                TECH STACK SHOP
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* View Cart Toggle Button */}
            {viewMode === 'shop' && (
              <button
                onClick={() => {
                  soundManager.playSelect();
                  setViewMode('checkout');
                }}
                className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  cart.length > 0
                    ? 'bg-yellow-400 hover:bg-yellow-300 text-slate-950 border-yellow-500 shadow-md animate-pulse'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>CART ({cart.length})</span>
                {cart.length > 0 && <span className="text-[10px]">ORDER ►</span>}
              </button>
            )}

            <button
              onClick={() => {
                soundManager.playCancel();
                onClose();
              }}
              className="p-1 rounded bg-slate-900/80 hover:bg-slate-900 text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MODE 1: SHOP & BROWSE SKILLS CATALOG */}
        {/* ======================================================== */}
        {viewMode === 'shop' && (
          <>
            {/* Category Navigation Tabs */}
            <div className="bg-[#0f1f4b] p-2 flex flex-wrap gap-1.5 border-b-2 border-slate-950 shrink-0">
              {categories.map((cat, idx) => {
                const isSelected = idx === selectedCategoryIdx;
                const Icon = getCategoryIcon(cat.category);
                const countInCart = cart.filter((c) => c.category === cat.category).length;

                return (
                  <button
                    key={cat.category}
                    onClick={() => handleCategoryTab(idx)}
                    className={`py-1.5 px-3 rounded text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-md -translate-y-0.5'
                        : 'bg-slate-900/80 text-blue-200 border-blue-900/60 hover:bg-blue-900/60 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.category}</span>
                    {countInCart > 0 && (
                      <span className="bg-blue-900 text-yellow-300 px-1 rounded-full text-[8px] font-silk">
                        {countInCart}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Shop Dual Panels */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3 md:p-4 overflow-y-auto flex-1">
              
              {/* Left Column: Items in Category */}
              <div className="md:col-span-6 bg-[#111927] border-4 border-[#1e293b] rounded-lg p-2 flex flex-col gap-1.5 shrink-0 overflow-y-auto max-h-[260px] md:max-h-none">
                <div className="text-[9px] text-yellow-400 font-silk px-2 py-1 uppercase tracking-wider flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    {currentCategory.category} SHELF
                  </span>
                  <span>{currentCategory.items.length} SKILLS AVAILABLE</span>
                </div>

                {currentCategory.items.map((item, idx) => {
                  const isSelected = idx === selectedItemIdx;
                  const inCart = isItemInCart(item.name);

                  return (
                    <div
                      key={item.name}
                      onClick={() => handleItemClick(idx)}
                      className={`w-full px-2.5 py-2 rounded flex items-center justify-between transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-blue-600/90 text-white border-blue-400 shadow-md'
                          : 'bg-slate-900/70 hover:bg-slate-800/80 text-slate-200 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[10px] text-yellow-400">{isSelected ? '►' : '•'}</span>
                        <span className="text-xs font-bold truncate">{item.name}</span>
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-slate-950/80 text-slate-300 font-silk">
                          {item.tag}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[8px] text-emerald-400 font-silk font-bold">
                          {item.level}
                        </span>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCartItem(item, currentCategory.category);
                          }}
                          className={`px-2 py-1 rounded text-[9px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            inCart
                              ? 'bg-emerald-500 hover:bg-rose-500 text-slate-950 hover:text-white'
                              : 'bg-yellow-400 hover:bg-yellow-300 text-slate-950'
                          }`}
                          title={inCart ? 'Remove from Cart' : 'Add to Cart'}
                        >
                          {inCart ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>IN CART</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>ADD</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Item Inspection Box & Live Cart Summary */}
              <div className="md:col-span-6 flex flex-col gap-3">
                {/* Item Details Box */}
                <div className="bg-[#fcf8f2] text-slate-900 border-4 border-[#1e293b] rounded-lg p-3.5 flex flex-col gap-2.5 shadow-md">
                  <div className="border-b-2 border-slate-300 pb-2 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        {currentItem.name}
                      </h3>
                      <div className="text-[10px] text-emerald-700 font-bold font-silk">
                        PROFICIENCY RATING: {currentItem.level.toUpperCase()}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleCartItem(currentItem, currentCategory.category)}
                      className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                        isItemInCart(currentItem.name)
                          ? 'bg-rose-600 hover:bg-rose-500 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {isItemInCart(currentItem.name) ? (
                        <>
                          <Minus className="w-3.5 h-3.5" />
                          <span>REMOVE FROM CART</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>ADD TO CART</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                      Technical Overview & Enterprise Use
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-silk bg-slate-100 p-2.5 rounded border border-slate-200">
                      {currentItem.description}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-2 rounded border border-blue-200 text-[9px] text-blue-900 font-silk">
                    🏷️ <span className="font-bold">Category:</span> {currentCategory.category} • Tag: {currentItem.tag}
                  </div>
                </div>

                {/* Quick Cart Drawer / Checkout Teaser */}
                <div className="bg-[#111927] border-4 border-[#1e293b] rounded-lg p-3 flex flex-col gap-2 flex-1 justify-between">
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-yellow-300 pb-1.5 border-b border-slate-800">
                      <span className="flex items-center gap-1.5">
                        <ShoppingCart className="w-3.5 h-3.5 text-yellow-400" />
                        MART CART SUMMARY
                      </span>
                      <span className="text-[10px] text-slate-400 font-silk">
                        {cart.length} SKILLS SELECTED
                      </span>
                    </div>

                    {cart.length === 0 ? (
                      <div className="text-center py-5 text-[10px] text-slate-400 font-silk">
                        Your cart is empty! Click &quot;ADD&quot; on any skill above to build your order inquiry.
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 pt-2 max-h-[110px] overflow-y-auto">
                        {cart.map((item) => (
                          <span
                            key={item.name}
                            className="bg-blue-950 border border-blue-600/60 text-blue-200 text-[9px] pl-2 pr-1 py-0.5 rounded flex items-center gap-1"
                          >
                            <span>{item.name}</span>
                            <button
                              onClick={() => removeCartItem(item.name)}
                              className="hover:text-rose-400 cursor-pointer p-0.5"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={clearCart}
                        className="text-[9px] text-rose-400 hover:text-rose-300 font-silk flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>CLEAR CART</span>
                      </button>

                      <button
                        onClick={() => {
                          soundManager.playFanfare();
                          setViewMode('checkout');
                        }}
                        className="px-4 py-2 rounded bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg cursor-pointer transform hover:scale-102 transition-all"
                      >
                        <span>CHECKOUT & WRITE MESSAGE</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Footer Strip */}
            <div className="bg-[#09153a] px-4 py-1.5 text-[8px] text-blue-200 font-silk flex justify-between items-center border-t-2 border-slate-950 shrink-0">
              <span>CATEGORIES: Languages • Frontend • Backend • Cloud & DevOps • AI/ML • Databases • Tools</span>
              <span>B / ESC: Close Mart</span>
            </div>
          </>
        )}

        {/* ======================================================== */}
        {/* MODE 2: WRITE MESSAGE & CONFIRM POKÉMON RETRO EMAIL ORDER */}
        {/* ======================================================== */}
        {viewMode === 'checkout' && (
          <div className="p-3 md:p-5 overflow-y-auto flex-1 flex flex-col gap-4">
            {/* Top Bar with Back button */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <button
                onClick={() => {
                  soundManager.playSelect();
                  setViewMode('shop');
                }}
                className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>◄ BACK TO SKILLS MART</span>
              </button>

              <span className="text-xs font-bold text-yellow-300 tracking-wider">
                CONFIRM INQUIRY & DISPATCH DISK
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left Column: Client Note Input Form */}
              <div className="lg:col-span-5 bg-[#111927] border-4 border-[#1e293b] rounded-lg p-4 space-y-3">
                <div className="text-xs font-bold text-yellow-400 border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>STEP 1: WRITE YOUR MESSAGE</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-silk block">Your Name</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Satoshi Tajiri / Engineering Recruiter"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white placeholder:text-slate-600 font-silk focus:border-yellow-400 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-silk block">Your Email (for replies)</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="e.g. recruiter@company.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white placeholder:text-slate-600 font-silk focus:border-yellow-400 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-silk block">Organization / Role</label>
                  <input
                    type="text"
                    value={clientRole}
                    onChange={(e) => setClientRole(e.target.value)}
                    placeholder="e.g. Tech Lead at Startup / Enterprise Recruiter"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white placeholder:text-slate-600 font-silk focus:border-yellow-400 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-silk block">Message / Opportunity Note</label>
                  <textarea
                    rows={4}
                    value={clientMessage}
                    onChange={(e) => setClientMessage(e.target.value)}
                    placeholder="Write details about the project, role, or collaboration..."
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white placeholder:text-slate-600 font-silk focus:border-yellow-400 focus:outline-hidden resize-none"
                  />
                </div>

                <div className="bg-yellow-950/60 border border-yellow-500/40 rounded p-2.5 text-[9px] text-yellow-200 font-silk">
                  📬 Clicking <b>&quot;SEND MAIL&quot;</b> will generate and open your default email client with this complete Pokémon pixel-art formatted letter ready to dispatch directly to <b>aritrosaha2025@gmail.com</b>.
                </div>
              </div>

              {/* Right Column: Live Pokémon Pixel-Game Styled Mail Preview */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                <div className="text-xs font-bold text-yellow-400 flex items-center justify-between">
                  <span>STEP 2: RETRO POKÉMON LETTER PREVIEW</span>
                  <span className="text-[9px] font-silk text-slate-400">{cart.length} SKILLS ORDERED</span>
                </div>

                {/* The Classic Pokémon Game Letter Sheet */}
                <div className="bg-[#fcf8f0] text-slate-900 border-4 border-[#2b3340] rounded-lg p-4 font-mono shadow-2xl flex-1 flex flex-col justify-between overflow-y-auto max-h-[380px]">
                  
                  {/* Decorative Header Stamp */}
                  <div>
                    <div className="flex items-center justify-between border-b-2 border-dashed border-slate-400 pb-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-600 border-2 border-slate-900 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white border border-slate-900" />
                        </div>
                        <div>
                          <div className="text-[11px] font-bold tracking-wider text-slate-900">
                            POKÉMON TECH MART • TALENT ORDER
                          </div>
                          <div className="text-[8px] text-slate-500 font-silk">
                            ORIGIN: PALLET CLOUD TOWN SQUARE
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-[8px] text-slate-600 font-silk">
                        STATUS: READY TO DISPATCH<br />
                        DEST: ARITRO SAHA
                      </div>
                    </div>

                    {/* Client Message Section */}
                    <div className="mb-4">
                      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        MESSAGE TO DEVELOPER:
                      </div>
                      <div className="p-2.5 bg-amber-50/80 rounded border border-amber-200/80 text-xs leading-relaxed text-slate-800 whitespace-pre-wrap font-sans">
                        &quot;{clientMessage || 'Looking forward to connecting with you!'}&quot;
                      </div>
                      <div className="mt-1 text-[9px] text-slate-600 font-silk">
                        — From: <span className="font-bold text-slate-900">{clientName || 'Engineering Partner'}</span> ({clientEmail || 'email not provided'})
                      </div>
                    </div>

                    {/* Skills Ordered Section - Displayed side-by-side in categorized grid */}
                    <div className="mt-3">
                      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        ORDERED TECHNICAL SKILLS (BY CATEGORY):
                      </div>

                      {Object.keys(groupedCart).length === 0 ? (
                        <div className="text-xs text-slate-500 italic p-2 bg-slate-100 rounded">
                          (No specific skills selected - general full-stack inquiry)
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {Object.entries(groupedCart).map(([category, items]) => (
                            <div
                              key={category}
                              className="bg-white p-2.5 rounded border border-slate-300 shadow-xs"
                            >
                              <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wide border-b border-slate-200 pb-1 mb-1.5 flex items-center justify-between">
                                <span>{category}</span>
                                <span className="text-[8px] text-slate-400 font-silk">
                                  {items.length} item{items.length > 1 ? 's' : ''}
                                </span>
                              </div>
                              <ul className="space-y-1">
                                {items.map((i) => (
                                  <li
                                    key={i.name}
                                    className="text-[10px] text-slate-800 flex items-center justify-between"
                                  >
                                    <span className="flex items-center gap-1 font-sans font-medium">
                                      <span className="text-yellow-600">★</span> {i.name}
                                    </span>
                                    <span className="text-[8px] text-slate-500 font-silk">
                                      {i.level}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mail Footer Note */}
                  <div className="border-t border-dashed border-slate-300 pt-2 mt-4 text-center text-[8px] text-slate-500 font-silk">
                    CERTIFIED POKÉMON TECH MART INQUIRY • BRISTOL MYERS SQUIBB ALUMNI
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isCopied ? 'COPIED TO CLIPBOARD!' : 'COPY EMAIL TEXT'}</span>
                  </button>

                  <button
                    onClick={handleSendMail}
                    className="px-5 py-2.5 rounded bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-xl cursor-pointer transform hover:scale-102 transition-all animate-pulse"
                  >
                    <Send className="w-4 h-4" />
                    <span>DISPATCH EMAIL NOW ►</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODE 3: ORDER SENT CONFIRMATION */}
        {/* ======================================================== */}
        {viewMode === 'success' && (
          <div className="p-6 md:p-10 flex flex-col items-center justify-center text-center space-y-4 flex-1">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-4 border-emerald-400 flex items-center justify-center text-emerald-300">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-base md:text-lg font-bold text-yellow-300">
              POKÉ MART TALENT ORDER DISPATCHED!
            </h2>

            <p className="text-xs text-blue-200 max-w-md font-silk leading-relaxed">
              Your default email client has been opened with your Pokémon styled message and categorized technical skills order to <b>aritrosaha2025@gmail.com</b>.
            </p>

            <div className="bg-[#111927] border-2 border-slate-700 p-3 rounded-lg max-w-md w-full text-left text-[9px] text-slate-300 font-mono space-y-1">
              <div>• Destination: Aritro Saha (Associate Software Developer)</div>
              <div>• Total Skills Ordered: {cart.length} Skills</div>
              <div>• Status: Email client invoked successfully</div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  soundManager.playSelect();
                  setViewMode('shop');
                }}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
              >
                RETURN TO SHOP
              </button>

              <button
                onClick={() => {
                  soundManager.playCancel();
                  onClose();
                }}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
              >
                CLOSE MART
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

