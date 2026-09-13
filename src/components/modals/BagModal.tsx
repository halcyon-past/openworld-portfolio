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
  Mail,
  Loader2
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
  const [mobileTab, setMobileTab] = useState<'catalog' | 'details' | 'cart'>('catalog');
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
  const [isSending, setIsSending] = useState(false);
  const [sendSuccessMode, setSendSuccessMode] = useState<'api' | 'mailto'>('api');
  const [sendErrorMsg, setSendErrorMsg] = useState<string | null>(null);

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

  // Generate Pokemon Retro Mail Plaintext for mailto: fallback
  const generateMailPlainText = () => {
    let body = `POKÉMON TECH MART • TALENT ORDER\n`;
    body += `DESTINATION: ARITRO SAHA (aritrosaha2025@gmail.com)\n`;
    body += `ORIGIN: PALLET CLOUD TOWN SQUARE\n\n`;
    body += `FROM: ${clientName.trim() || 'Prospective Partner'} (${clientEmail.trim() || 'Email not specified'})\n`;
    body += `ROLE/ORG: ${clientRole.trim() || 'Engineering Team'}\n\n`;
    body += `--------------------------------------------------\n`;
    body += `MESSAGE:\n"${clientMessage.trim() || 'Looking forward to connecting with you!'}"\n`;
    body += `--------------------------------------------------\n\n`;
    body += `ORDERED TECHNICAL SKILLS:\n`;

    if (Object.keys(groupedCart).length === 0) {
      body += `(General Full-Stack Software Engineering Inquiry)\n`;
    } else {
      for (const [cat, items] of Object.entries(groupedCart)) {
        body += `\n[${cat.toUpperCase()}]\n`;
        body += items.map((i) => `  ★ ${i.name} [${i.level}] (${i.tag})`).join('\n');
      }
    }

    body += `\n\n--------------------------------------------------\n`;
    body += `Certified Poké Mart Talent Requisition • Bristol Myers Squibb Alumni\n`;
    return body;
  };

  // Generate Real Graphical Editable HTML Email (Tables, Borders, Colors, Badges, Pokéball graphics)
  const generatePokemonHtmlMail = () => {
    const safeName = clientName.trim() || 'Prospective Engineering Partner';
    const safeEmail = clientEmail.trim() || 'Not specified';
    const safeRole = clientRole.trim() || 'Engineering Organization';
    const safeMessage = clientMessage.trim() || 'Hi Aritro, looking forward to discussing software engineering opportunities and collaborations!';

    const categoryColors: Record<string, { bg: string; text: string; border: string; badge: string }> = {
      'Languages': { bg: '#eff6ff', text: '#1e40af', border: '#93c5fd', badge: '🔷 CODE' },
      'Frontend': { bg: '#fdf2f8', text: '#9d174d', border: '#fbcfe8', badge: '🎨 UI/UX' },
      'Backend': { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0', badge: '⚡ SERVER' },
      'Cloud & DevOps': { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0', badge: '☁️ CLOUD' },
      'AI/ML': { bg: '#faf5ff', text: '#6b21a8', border: '#e9d5ff', badge: '🧠 AI/ML' },
      'Databases': { bg: '#fffbeb', text: '#92400e', border: '#fde68a', badge: '💾 DATA' },
      'Tools': { bg: '#f8fafc', text: '#334155', border: '#cbd5e1', badge: '🛠️ TOOL' }
    };

    let categoriesHtml = '';
    if (Object.keys(groupedCart).length === 0) {
      categoriesHtml = `
        <tr>
          <td colspan="2" style="padding: 12px; background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; text-align: center; font-size: 13px; color: #64748b; font-style: italic;">
            General Full-Stack Software Engineering Inquiry (No specific items selected)
          </td>
        </tr>
      `;
    } else {
      const entries = Object.entries(groupedCart);
      for (let i = 0; i < entries.length; i += 2) {
        const [cat1, items1] = entries[i];
        const secondCol = entries[i + 1];

        const renderCol = (cat: string, items: CartItem[]) => {
          const scheme = categoryColors[cat] || { bg: '#f8fafc', text: '#1e293b', border: '#cbd5e1', badge: '⭐ ITEM' };
          const itemsList = items
            .map(
              (item) => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 8px; margin-bottom: 4px; background-color: #ffffff; border: 1px solid ${scheme.border}; border-radius: 4px; font-size: 12px;">
                <span style="font-weight: bold; color: #1e293b; word-break: break-word;">★ ${item.name}</span>
                <span style="font-size: 10px; font-weight: bold; color: ${scheme.text}; background-color: ${scheme.bg}; padding: 2px 6px; border-radius: 10px; border: 1px solid ${scheme.border}; white-space: nowrap; margin-left: 6px;">${item.level}</span>
              </div>
            `
            )
            .join('');

          return `
            <td class="mobile-cat-col" width="50%" valign="top" style="padding: 5px; box-sizing: border-box;">
              <div style="background-color: ${scheme.bg}; border: 2px solid ${scheme.border}; border-radius: 8px; padding: 10px; height: 100%; box-sizing: border-box;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid ${scheme.border}; padding-bottom: 6px; margin-bottom: 8px;">
                  <span style="font-size: 12px; font-weight: bold; color: ${scheme.text}; letter-spacing: 0.5px; text-transform: uppercase;">${cat}</span>
                  <span style="font-size: 9px; font-weight: bold; color: ${scheme.text}; background-color: #ffffff; padding: 1px 6px; border-radius: 4px; border: 1px solid ${scheme.border}; white-space: nowrap;">${scheme.badge}</span>
                </div>
                ${itemsList}
              </div>
            </td>
          `;
        };

        categoriesHtml += `
          <tr>
            ${renderCol(cat1, items1)}
            ${
              secondCol
                ? renderCol(secondCol[0], secondCol[1])
                : `<td class="mobile-cat-empty" width="50%" valign="top" style="padding: 5px;"></td>`
            }
          </tr>
        `;
      }
    }

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>Pokémon Tech Mart Requisition</title>
  <style>
    /* Email client resets */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    table {
      border-collapse: collapse !important;
    }
    /* Mobile Responsive Breakpoints */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
        border-width: 2px !important;
        border-radius: 8px !important;
      }
      .mobile-body-pad {
        padding: 14px 10px !important;
      }
      .mobile-header-pad {
        padding: 12px 14px !important;
      }
      .mobile-header-title {
        font-size: 14px !important;
        letter-spacing: 0.5px !important;
      }
      .mobile-header-subtitle {
        font-size: 9px !important;
        line-height: 1.3 !important;
      }
      .mobile-badge {
        display: none !important;
      }
      .mobile-stack-col {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .mobile-route-sender {
        border-bottom: 1px solid #e2e8f0 !important;
      }
      .mobile-cat-col {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
        padding: 4px 0 !important;
      }
      .mobile-cat-empty {
        display: none !important;
      }
      .mobile-footer-seal {
        text-align: left !important;
        margin-top: 10px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 12px 6px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div class="email-container" style="max-width: 620px; margin: 0 auto; background-color: #fdfbf7; border: 3px solid #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.15);">
    
    <!-- Retro Pokémon Mail Top Strip (Airmail style chevron) -->
    <div style="height: 6px; background: repeating-linear-gradient(45deg, #ef4444, #ef4444 15px, #ffffff 15px, #ffffff 30px, #3b82f6 30px, #3b82f6 45px, #ffffff 45px, #ffffff 60px);"></div>
    
    <!-- Mail Header Bar with Graphic Pokéball Badge -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" class="mobile-header-pad" style="background-color: #1e3a8a; color: #ffffff; padding: 16px 20px;">
      <tr>
        <td width="46" valign="middle" style="padding-right: 12px;">
          <!-- Authentic Pokéball Badge -->
          <img
            src="https://raw.githubusercontent.com/halcyon-past/openworld-portfolio/main/public/assets/pokeball.png"
            width="42"
            height="42"
            alt="Pokéball"
            style="display: block; width: 42px; height: 42px; border: 0; outline: none; text-decoration: none;"
          />
        </td>
        <td valign="middle">
          <div class="mobile-header-title" style="font-size: 16px; font-weight: 800; letter-spacing: 1px; color: #fbbf24; text-transform: uppercase; line-height: 1.2;">
            PALLET CLOUD POKÉ MART
          </div>
          <div class="mobile-header-subtitle" style="font-size: 10px; color: #93c5fd; letter-spacing: 0.5px; margin-top: 2px;">
            SPECIAL TALENT REQUISITION PARCEL • SILPH CO. POSTAL SERVICE
          </div>
        </td>
        <td align="right" valign="middle" class="mobile-badge">
          <div style="display: inline-block; background-color: #0f172a; border: 1px solid #fbbf24; border-radius: 6px; padding: 4px 8px; text-align: center;">
            <div style="font-size: 9px; color: #fbbf24; font-weight: bold;">ORIGIN: PALLET TOWN</div>
            <div style="font-size: 8px; color: #cbd5e1;">SERIES 2026</div>
          </div>
        </td>
      </tr>
    </table>

    <div class="mobile-body-pad" style="padding: 18px;">
      
      <!-- Routing Header Table -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 2px solid #e2e8f0; border-radius: 8px; margin-bottom: 16px; font-size: 12px;">
        <tr>
          <td class="mobile-stack-col mobile-route-sender" style="padding: 10px 12px; width: 50%; box-sizing: border-box; word-break: break-word;">
            <span style="color: #64748b; font-size: 10px; font-weight: bold; text-transform: uppercase; display: block;">FROM (SENDER):</span>
            <span style="font-weight: bold; color: #0f172a; font-size: 13px;">${safeName}</span>
            <div style="color: #475569; font-size: 11px; margin-top: 2px;">${safeRole} &bull; <a href="mailto:${safeEmail}" style="color: #2563eb; text-decoration: none; word-break: break-all;">${safeEmail}</a></div>
          </td>
          <td class="mobile-stack-col" style="padding: 10px 12px; width: 50%; background-color: #f8fafc; box-sizing: border-box; word-break: break-word;">
            <span style="color: #64748b; font-size: 10px; font-weight: bold; text-transform: uppercase; display: block;">TO (RECIPIENT):</span>
            <span style="font-weight: bold; color: #0f172a; font-size: 13px;">Aritro Saha</span>
            <div style="color: #475569; font-size: 11px; margin-top: 2px;">Associate Software Developer &bull; <a href="mailto:aritrosaha2025@gmail.com" style="color: #2563eb; text-decoration: none; word-break: break-all;">aritrosaha2025@gmail.com</a></div>
          </td>
        </tr>
      </table>

      <!-- Project Message Section -->
      <div style="margin-bottom: 18px;">
        <div style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
          ✉️ REQUISITION INQUIRY & MESSAGE:
        </div>
        <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; border-top: 1px solid #fde68a; border-right: 1px solid #fde68a; border-bottom: 1px solid #fde68a; border-radius: 0 8px 8px 0; padding: 12px 14px; font-size: 13px; line-height: 1.6; color: #1e293b; word-break: break-word; overflow-wrap: break-word; white-space: pre-wrap;">&ldquo;${safeMessage}&rdquo;</div>
      </div>

      <!-- Skills Ordered Heading -->
      <div style="margin-bottom: 8px;">
        <span style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">
          🎒 TECHNICAL SKILLS ORDERED FROM MART (${cart.length} ITEMS):
        </span>
      </div>

      <!-- Skills Grid (Side-by-side on desktop, stacked on mobile) -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 18px;">
        ${categoriesHtml}
      </table>

      <!-- Footer Stamp & Certifications -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 2px dashed #cbd5e1; padding-top: 14px; font-size: 11px; color: #64748b;">
        <tr>
          <td valign="middle" class="mobile-stack-col" style="padding-bottom: 6px;">
            <span style="font-weight: bold; color: #0f172a;">AUTHENTIC PALLET CLOUD RPG DISPATCH</span><br />
            Bristol Myers Squibb Alumni &bull; Hack4Bengal 3.0 Champion
          </td>
          <td align="right" valign="middle" class="mobile-stack-col mobile-footer-seal">
            <div style="display: inline-block; border: 2px solid #059669; border-radius: 4px; padding: 3px 8px; color: #059669; font-weight: bold; font-size: 10px; transform: rotate(-2deg); background-color: #ecfdf5;">
              ✓ VERIFIED POKÉ MART SEAL
            </div>
          </td>
        </tr>
      </table>

    </div>

    <!-- Bottom Airmail Chevron -->
    <div style="height: 6px; background: repeating-linear-gradient(45deg, #3b82f6, #3b82f6 15px, #ffffff 15px, #ffffff 30px, #ef4444 30px, #ef4444 45px, #ffffff 45px, #ffffff 60px);"></div>
  </div>
</body>
</html>
    `.trim();
  };

  const handleSendMail = async () => {
    soundManager.playFanfare();
    setIsSending(true);
    setSendErrorMsg(null);

    const html = generatePokemonHtmlMail();
    const plain = generateMailPlainText();

    // 1. Copy rich graphical HTML + plaintext to clipboard in background as immediate convenience
    try {
      if (typeof window !== 'undefined' && navigator.clipboard && window.ClipboardItem) {
        const blobHtml = new Blob([html], { type: 'text/html' });
        const blobPlain = new Blob([plain], { type: 'text/plain' });
        const item = new ClipboardItem({
          'text/html': blobHtml,
          'text/plain': blobPlain
        });
        await navigator.clipboard.write([item]);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(html);
      }
    } catch {
      // Ignored
    }

    // 2. Call direct backend API to deliver graphical HTML mail
    try {
      const res = await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: clientName.trim(),
          email: clientEmail.trim(),
          role: clientRole.trim(),
          message: clientMessage.trim(),
          htmlContent: html,
          plainContent: plain,
          cartCount: cart.length
        })
      });

      const data = await res.json();

      if (data.success && data.mode === 'api') {
        setIsSending(false);
        setSendSuccessMode('api');
        setViewMode('success');
        return;
      } else if (!data.success) {
        setIsSending(false);
        setSendErrorMsg(data.error || 'Failed to dispatch email directly.');
        return;
      }
    } catch (e) {
      console.error('Direct API email dispatch network error:', e);
      setIsSending(false);
      setSendErrorMsg('Network error connecting to email dispatcher.');
      return;
    }

    setIsSending(false);
    setSendSuccessMode('api');
    setViewMode('success');
  };

  const handleManualEmailClient = () => {
    soundManager.playSelect();
    const mailtoSubject = encodeURIComponent(
      `[Tech Mart Order] Skills Inquiry from ${clientName.trim() || 'Engineering Client'}`
    );
    const mailtoBody = encodeURIComponent(generateMailPlainText());
    window.location.href = `mailto:aritrosaha2025@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
  };

  const copyRichHtmlToClipboard = async () => {
    soundManager.playSelect();
    const html = generatePokemonHtmlMail();
    const plain = generateMailPlainText();

    try {
      if (typeof window !== 'undefined' && navigator.clipboard && window.ClipboardItem) {
        const blobHtml = new Blob([html], { type: 'text/html' });
        const blobPlain = new Blob([plain], { type: 'text/plain' });
        const item = new ClipboardItem({
          'text/html': blobHtml,
          'text/plain': blobPlain
        });
        await navigator.clipboard.write([item]);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
        return;
      }
    } catch {
      // Fallback
    }

    navigator.clipboard.writeText(html);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-4 md:p-6 bg-black/80 backdrop-blur-xs font-pixel">
      {/* Retro Blue & Gold Poké Mart Shop Shell */}
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#1e3a8a] via-[#172554] to-[#0f172a] border-2 sm:border-8 border-slate-950 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col h-[94vh] sm:max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="bg-[#09153a] px-3 sm:px-4 py-2 sm:py-2.5 border-b-2 sm:border-b-4 border-slate-950 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-yellow-300 flex items-center justify-center text-[10px] text-yellow-300 font-bold shrink-0">
              $
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 leading-tight">
              <span className="text-xs sm:text-sm font-bold text-white tracking-wider">
                POKÉ MART
              </span>
              <span className="text-[8px] sm:text-[10px] text-yellow-400 font-silk bg-yellow-950/80 px-1.5 py-0.5 rounded border border-yellow-500/50 w-fit">
                TECH STACK SHOP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Cart / Checkout Toggle Button */}
            {viewMode === 'shop' && (
              <button
                onClick={() => {
                  soundManager.playSelect();
                  setViewMode('checkout');
                }}
                className={`px-2.5 sm:px-3 py-1 rounded text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer border ${
                  cart.length > 0
                    ? 'bg-yellow-400 hover:bg-yellow-300 text-slate-950 border-yellow-500 shadow-md'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xs:inline">CART</span>
                <span className="bg-slate-950/80 text-yellow-300 px-1.5 py-0.2 rounded-full text-[9px] font-silk">
                  {cart.length}
                </span>
                {cart.length > 0 && <span className="text-[10px] text-slate-950 hidden sm:inline">ORDER ►</span>}
              </button>
            )}

            <button
              onClick={() => {
                soundManager.playCancel();
                onClose();
              }}
              className="p-1 sm:p-1.5 rounded bg-slate-900/80 hover:bg-slate-900 text-white cursor-pointer"
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
            {/* Category Navigation Tabs - Smooth Horizontal Scrollable on Mobile */}
            <div className="bg-[#0f1f4b] p-1.5 sm:p-2 flex gap-1 sm:gap-1.5 border-b-2 border-slate-950 shrink-0 overflow-x-auto no-scrollbar scroll-smooth">
              {categories.map((cat, idx) => {
                const isSelected = idx === selectedCategoryIdx;
                const Icon = getCategoryIcon(cat.category);
                const countInCart = cart.filter((c) => c.category === cat.category).length;

                return (
                  <button
                    key={cat.category}
                    onClick={() => {
                      handleCategoryTab(idx);
                      setMobileTab('catalog');
                    }}
                    className={`py-1.5 px-2.5 sm:px-3 rounded text-[9px] sm:text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer border whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-md -translate-y-0.5'
                        : 'bg-slate-900/80 text-blue-200 border-blue-900/60 hover:bg-blue-900/60 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
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

            {/* Mobile View Switcher (Catalog vs Item Details vs Cart) */}
            <div className="flex md:hidden bg-[#0a1329] border-b border-slate-800 text-[10px] font-silk">
              <button
                onClick={() => {
                  soundManager.playSelect();
                  setMobileTab('catalog');
                }}
                className={`flex-1 py-1.5 text-center font-bold border-b-2 transition-colors ${
                  mobileTab === 'catalog'
                    ? 'border-yellow-400 text-yellow-300 bg-blue-950/60'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                1. ITEMS ({currentCategory.items.length})
              </button>
              <button
                onClick={() => {
                  soundManager.playSelect();
                  setMobileTab('details');
                }}
                className={`flex-1 py-1.5 text-center font-bold border-b-2 transition-colors ${
                  mobileTab === 'details'
                    ? 'border-yellow-400 text-yellow-300 bg-blue-950/60'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                2. DETAILS
              </button>
              <button
                onClick={() => {
                  soundManager.playSelect();
                  setMobileTab('cart');
                }}
                className={`flex-1 py-1.5 text-center font-bold border-b-2 transition-colors ${
                  mobileTab === 'cart'
                    ? 'border-yellow-400 text-yellow-300 bg-blue-950/60'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                3. CART ({cart.length})
              </button>
            </div>

            {/* Shop Dual Panels (Grid on desktop, Tabbed/Stacked on Mobile) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3 p-2 sm:p-4 overflow-y-auto flex-1">
              
              {/* Left Column: Items in Category */}
              <div
                className={`md:col-span-6 bg-[#111927] border-2 sm:border-4 border-[#1e293b] rounded-lg p-2 flex flex-col gap-1.5 overflow-y-auto ${
                  mobileTab !== 'catalog' ? 'hidden md:flex' : 'flex'
                }`}
              >
                <div className="text-[9px] text-yellow-400 font-silk px-2 py-1 uppercase tracking-wider flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    {currentCategory.category} SHELF
                  </span>
                  <span>{currentCategory.items.length} SKILLS</span>
                </div>

                <div className="space-y-1.5 overflow-y-auto pr-0.5">
                  {currentCategory.items.map((item, idx) => {
                    const isSelected = idx === selectedItemIdx;
                    const inCart = isItemInCart(item.name);

                    return (
                      <div
                        key={item.name}
                        onClick={() => {
                          handleItemClick(idx);
                          // Auto open details on mobile if tapped
                          if (window.innerWidth < 768) {
                            setMobileTab('details');
                          }
                        }}
                        className={`w-full px-2.5 py-2 rounded flex items-center justify-between transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-blue-600/90 text-white border-blue-400 shadow-md'
                            : 'bg-slate-900/70 hover:bg-slate-800/80 text-slate-200 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate pr-1">
                          <span className="text-[10px] text-yellow-400 shrink-0">{isSelected ? '►' : '•'}</span>
                          <span className="text-xs font-bold truncate">{item.name}</span>
                          <span className="text-[8px] px-1.5 py-0.5 rounded bg-slate-950/80 text-slate-300 font-silk shrink-0 hidden xs:inline">
                            {item.tag}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
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
                                <span className="text-[8px] sm:text-[9px]">IN CART</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3 h-3" />
                                <span className="text-[8px] sm:text-[9px]">ADD</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Item Inspection Box & Live Cart Summary */}
              <div
                className={`md:col-span-6 flex flex-col gap-2.5 sm:gap-3 ${
                  mobileTab === 'catalog' ? 'hidden md:flex' : 'flex'
                }`}
              >
                {/* Item Details Box */}
                <div
                  className={`bg-[#fcf8f2] text-slate-900 border-2 sm:border-4 border-[#1e293b] rounded-lg p-3 sm:p-3.5 flex flex-col gap-2 sm:gap-2.5 shadow-md ${
                    mobileTab === 'cart' ? 'hidden md:flex' : 'flex'
                  }`}
                >
                  <div className="border-b-2 border-slate-300 pb-2 flex items-center justify-between gap-2">
                    <div className="truncate">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 truncate">
                        <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="truncate">{currentItem.name}</span>
                      </h3>
                      <div className="text-[9px] sm:text-[10px] text-emerald-700 font-bold font-silk">
                        RATING: {currentItem.level.toUpperCase()}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleCartItem(currentItem, currentCategory.category)}
                      className={`px-2.5 sm:px-3 py-1.5 rounded text-[10px] sm:text-xs font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer shrink-0 ${
                        isItemInCart(currentItem.name)
                          ? 'bg-rose-600 hover:bg-rose-500 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {isItemInCart(currentItem.name) ? (
                        <>
                          <Minus className="w-3.5 h-3.5" />
                          <span>REMOVE</span>
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
                    <div className="text-[8px] sm:text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                      Technical Overview & Enterprise Use
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-silk bg-slate-100 p-2 sm:p-2.5 rounded border border-slate-200 max-h-[90px] md:max-h-none overflow-y-auto">
                      {currentItem.description}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-1.5 sm:p-2 rounded border border-blue-200 text-[8px] sm:text-[9px] text-blue-900 font-silk flex justify-between items-center">
                    <span>🏷️ {currentCategory.category}</span>
                    <span className="font-mono bg-blue-100 px-1 rounded">{currentItem.tag}</span>
                  </div>
                </div>

                {/* Quick Cart Drawer / Checkout Teaser */}
                <div
                  className={`bg-[#111927] border-2 sm:border-4 border-[#1e293b] rounded-lg p-2.5 sm:p-3 flex flex-col gap-2 flex-1 justify-between ${
                    mobileTab === 'details' ? 'hidden md:flex' : 'flex'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-yellow-300 pb-1.5 border-b border-slate-800">
                      <span className="flex items-center gap-1.5">
                        <ShoppingCart className="w-3.5 h-3.5 text-yellow-400" />
                        <span>CART SUMMARY</span>
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-slate-400 font-silk">
                        {cart.length} SELECTED
                      </span>
                    </div>

                    {cart.length === 0 ? (
                      <div className="text-center py-4 sm:py-5 text-[10px] text-slate-400 font-silk">
                        Cart empty. Add skills to compose order!
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1 pt-2 max-h-[120px] overflow-y-auto">
                        {cart.map((item) => (
                          <span
                            key={item.name}
                            className="bg-blue-950 border border-blue-600/60 text-blue-200 text-[8px] sm:text-[9px] pl-2 pr-1 py-0.5 rounded flex items-center gap-1"
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
                        <span>CLEAR</span>
                      </button>

                      <button
                        onClick={() => {
                          soundManager.playFanfare();
                          setViewMode('checkout');
                        }}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 text-[11px] sm:text-xs font-bold flex items-center gap-1.5 shadow-lg cursor-pointer transform hover:scale-102 transition-all"
                      >
                        <span>ORDER ({cart.length})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Footer Strip */}
            <div className="bg-[#09153a] px-3 sm:px-4 py-1 sm:py-1.5 text-[7px] sm:text-[8px] text-blue-200 font-silk flex justify-between items-center border-t-2 border-slate-950 shrink-0">
              <span className="truncate">7 CATEGORIES • {categories.reduce((acc, c) => acc + c.items.length, 0)} SKILLS</span>
              <span className="shrink-0 ml-2">ESC / X: Close</span>
            </div>
          </>
        )}

        {/* ======================================================== */}
        {/* MODE 2: WRITE MESSAGE & CONFIRM POKÉMON RETRO EMAIL ORDER */}
        {/* ======================================================== */}
        {viewMode === 'checkout' && (
          <div className="p-2.5 sm:p-4 md:p-5 overflow-y-auto flex-1 flex flex-col gap-3 sm:gap-4">
            {/* Top Bar with Back button */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 shrink-0">
              <button
                onClick={() => {
                  soundManager.playSelect();
                  setViewMode('shop');
                }}
                className="px-2.5 sm:px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>◄ BACK TO MART</span>
              </button>

              <span className="text-[10px] sm:text-xs font-bold text-yellow-300 tracking-wider">
                CONFIRM INQUIRY & DISPATCH
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
              {/* Left Column: Client Note Input Form */}
              <div className="lg:col-span-5 bg-[#111927] border-2 sm:border-4 border-[#1e293b] rounded-lg p-3 sm:p-4 space-y-2.5 sm:space-y-3">
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
                    placeholder="e.g. Sundar Pichai / Recruiter"
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
                    placeholder="e.g. Engineering Lead / Enterprise Recruiter"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white placeholder:text-slate-600 font-silk focus:border-yellow-400 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-slate-400 font-silk block">Message / Opportunity Note</label>
                  <textarea
                    rows={3}
                    value={clientMessage}
                    onChange={(e) => setClientMessage(e.target.value)}
                    placeholder="Write details about the project, role, or collaboration..."
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white placeholder:text-slate-600 font-silk focus:border-yellow-400 focus:outline-hidden resize-none"
                  />
                </div>

                <div className="bg-yellow-950/60 border border-yellow-500/40 rounded p-2 text-[8px] sm:text-[9px] text-yellow-200 font-silk space-y-1">
                  <div>📬 <b>Graphic HTML Mail Format:</b> Generates a stylized Pokémon mail layout with graphic Pokéball seal, routing stamps, and side-by-side categorized tables.</div>
                  <div className="text-yellow-300 font-bold">✨ Use &quot;COPY GRAPHICAL MAIL (HTML)&quot; to paste directly into Gmail, Outlook, or Apple Mail as full editable graphic cards!</div>
                </div>
              </div>

              {/* Right Column: Live Pokémon Pixel-Game Styled Mail Preview */}
              <div className="lg:col-span-7 flex flex-col gap-2.5 sm:gap-3">
                <div className="text-xs font-bold text-yellow-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    <span>STEP 2: GRAPHICAL MAIL PREVIEW</span>
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-silk text-slate-400">{cart.length} SKILLS ORDERED</span>
                </div>

                {/* The Classic Pokémon Game Graphic Letter Sheet */}
                <div className="bg-[#fcfbf7] text-slate-900 border-2 sm:border-4 border-[#1e293b] rounded-xl shadow-2xl flex-1 flex flex-col justify-between overflow-y-auto max-h-[300px] sm:max-h-[360px] md:max-h-[400px]">
                  
                  {/* Retro Airmail Border Ribbon */}
                  <div className="h-2 w-full bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_12px,#ffffff_12px,#ffffff_24px,#3b82f6_24px,#3b82f6_36px,#ffffff_36px,#ffffff_48px)] shrink-0" />

                  <div className="p-2.5 sm:p-4 space-y-2.5 sm:space-y-3.5">
                    {/* Graphical Top Header with Pokéball Seal & Postage Stamp */}
                    <div className="bg-[#1e3a8a] text-white p-2 sm:p-3 rounded-lg border-2 border-slate-900 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2 sm:gap-3">
                        {/* Graphical Pixel Pokéball Seal */}
                        <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-b from-red-600 from-50% via-slate-950 via-50% to-white to-55% border-2 border-slate-950 relative flex items-center justify-center shrink-0 shadow-xs">
                          <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-white border-2 border-slate-950 flex items-center justify-center">
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-slate-900" />
                          </div>
                        </div>

                        <div>
                          <div className="text-[11px] sm:text-xs font-black tracking-wider text-yellow-300">
                            PALLET CLOUD POKÉ MART
                          </div>
                          <div className="text-[7px] sm:text-[8px] text-blue-200 font-silk">
                            SPECIAL REQUISITION PARCEL • SILPH CO. POSTAL
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-950/80 border border-yellow-400/80 rounded px-1.5 sm:px-2 py-0.5 sm:py-1 text-right shrink-0">
                        <div className="text-[7px] sm:text-[8px] text-yellow-300 font-bold font-silk">PALLET TOWN</div>
                        <div className="text-[6px] sm:text-[7px] text-slate-300 font-mono">SERIES 2026</div>
                      </div>
                    </div>

                    {/* Routing Dossier Box */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white p-2 sm:p-2.5 rounded-lg border border-slate-300 text-[10px]">
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block">FROM (SENDER):</span>
                        <div className="font-bold text-slate-900 text-[11px]">{clientName || 'Prospective Partner'}</div>
                        <div className="text-slate-600 truncate text-[10px]">{clientRole}</div>
                        <div className="text-blue-600 font-mono text-[8px] sm:text-[9px] truncate">{clientEmail || 'email not provided'}</div>
                      </div>

                      <div className="space-y-0.5 border-t sm:border-t-0 sm:border-l border-slate-200 pt-1.5 sm:pt-0 sm:pl-2.5">
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block">TO (RECIPIENT):</span>
                        <div className="font-bold text-slate-900 text-[11px]">Aritro Saha (Tech Lead)</div>
                        <div className="text-slate-600 text-[10px]">Associate Software Developer</div>
                        <div className="text-blue-600 font-mono text-[8px] sm:text-[9px]">aritrosaha2025@gmail.com</div>
                      </div>
                    </div>

                    {/* Client Message Callout */}
                    <div>
                      <div className="text-[8px] sm:text-[9px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span>REQUISITION INQUIRY & MESSAGE:</span>
                      </div>
                      <div className="p-2 sm:p-3 bg-amber-50 rounded-lg border-l-4 border-amber-500 border-t border-r border-b border-amber-200 text-xs leading-relaxed text-slate-800 font-sans shadow-xs">
                        &ldquo;{clientMessage || 'Looking forward to connecting with you!'}&rdquo;
                      </div>
                    </div>

                    {/* Skills Ordered Section - Displayed side-by-side in categorized graphical cards */}
                    <div>
                      <div className="text-[8px] sm:text-[9px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 sm:mb-2 flex items-center justify-between">
                        <span>🎒 ORDERED TECHNICAL SKILLS ({cart.length} ITEMS):</span>
                        <span className="text-[7px] sm:text-[8px] text-slate-500 font-silk">CATEGORIZED GRID</span>
                      </div>

                      {Object.keys(groupedCart).length === 0 ? (
                        <div className="text-xs text-slate-500 italic p-3 bg-slate-100 rounded-lg border border-slate-200 text-center">
                          (No specific skills selected - general full-stack engineering inquiry)
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {Object.entries(groupedCart).map(([category, items]) => {
                            const Icon = getCategoryIcon(category);
                            return (
                              <div
                                key={category}
                                className="bg-white p-2 rounded-lg border-2 border-slate-200 shadow-xs space-y-1"
                              >
                                <div className="text-[9px] sm:text-[10px] font-bold text-blue-900 uppercase tracking-wide border-b border-slate-200 pb-1 flex items-center justify-between">
                                  <span className="flex items-center gap-1">
                                    <Icon className="w-3 h-3 text-blue-600" />
                                    <span>{category}</span>
                                  </span>
                                  <span className="text-[8px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-full font-bold">
                                    {items.length}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {items.map((i) => (
                                    <div
                                      key={i.name}
                                      className="text-[9px] sm:text-[10px] text-slate-800 flex items-center justify-between bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/80"
                                    >
                                      <span className="flex items-center gap-1 font-sans font-semibold truncate pr-1">
                                        <span className="text-amber-500 text-xs">★</span> {i.name}
                                      </span>
                                      <span className="text-[7px] sm:text-[8px] text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200 font-silk shrink-0">
                                        {i.level}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Certified Seal Footer */}
                    <div className="border-t border-dashed border-slate-300 pt-2 flex items-center justify-between text-[7px] sm:text-[8px] text-slate-500 font-silk">
                      <div>
                        AUTHENTIC PALLET CLOUD RPG DISPATCH<br />
                        Bristol Myers Squibb Alumni • Hack4Bengal 3.0 Champion
                      </div>
                      <div className="px-1.5 py-0.5 border border-emerald-600 bg-emerald-50 text-emerald-700 rounded font-bold rotate-[-1deg]">
                        ✓ VERIFIED MART SEAL
                      </div>
                    </div>
                  </div>

                  {/* Bottom Airmail Border Ribbon */}
                  <div className="h-2 w-full bg-[repeating-linear-gradient(45deg,#3b82f6,#3b82f6_12px,#ffffff_12px,#ffffff_24px,#ef4444_24px,#ef4444_36px,#ffffff_36px,#ffffff_48px)] shrink-0" />
                </div>

                {/* Error Banner if direct transmission fails */}
                {sendErrorMsg && (
                  <div className="bg-rose-950/80 border-2 border-rose-500 rounded p-2.5 text-xs text-rose-200 font-silk flex flex-col gap-1.5 shadow-md animate-shake">
                    <div className="flex items-center gap-1.5 font-bold text-rose-300">
                      <X className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>DIRECT DISPATCH NOTICE: {sendErrorMsg}</span>
                    </div>
                    <div className="text-[10px] text-rose-300/80">
                      Resend requires emails to be sent to your account email (<code className="text-white bg-slate-900 px-1 py-0.5 rounded">titanssuperior@gmail.com</code>). You can also launch your local email client below:
                    </div>
                    <button
                      onClick={handleManualEmailClient}
                      className="self-start px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-yellow-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer border border-slate-600"
                    >
                      <Mail className="w-3 h-3" />
                      <span>LAUNCH EMAIL CLIENT AS FALLBACK</span>
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
                  <button
                    onClick={copyRichHtmlToClipboard}
                    disabled={isSending}
                    className="w-full sm:w-auto px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-98 disabled:opacity-50"
                    title="Copies editable graphical HTML card for pasting into Gmail, Outlook, or Apple Mail"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isCopied ? 'COPIED GRAPHICAL HTML!' : 'COPY GRAPHICAL MAIL (HTML)'}</span>
                  </button>

                  <button
                    onClick={handleSendMail}
                    disabled={isSending}
                    className="w-full sm:w-auto px-5 py-2 rounded bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-[11px] sm:text-xs font-bold flex items-center justify-center gap-2 shadow-xl cursor-pointer transform hover:scale-102 active:scale-98 transition-all disabled:opacity-75 disabled:cursor-wait"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>DISPATCHING ORDER...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>DISPATCH ORDER DIRECTLY ►</span>
                      </>
                    )}
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
              {sendSuccessMode === 'api'
                ? 'Your Pokémon styled talent order has been transmitted directly to Aritro with complete graphical layout, selected skills, and inquiry details.'
                : 'Your default email client has been launched with your inquiry and the rich graphical Pokémon mail has been copied to your clipboard ready to paste.'}
            </p>

            <div className="bg-[#111927] border-2 border-slate-700 p-3.5 rounded-lg max-w-md w-full text-left text-[9px] sm:text-[10px] text-slate-300 font-mono space-y-1.5 shadow-inner">
              <div className="text-yellow-400 font-bold border-b border-slate-800 pb-1">
                PARCEL MANIFEST & ROUTING:
              </div>
              <div>• Destination: Aritro Saha (Associate Software Developer)</div>
              <div>• Target Inbox: <span className="text-blue-400">aritrosaha2025@gmail.com</span></div>
              <div>• Skills Requisitioned: <span className="text-emerald-400 font-bold">{cart.length} Skills</span></div>
              <div>
                • Dispatch Mode:{' '}
                <span className="text-yellow-300 font-bold">
                  {sendSuccessMode === 'api' ? 'Direct API Transmission (Instant)' : 'Email Client Pre-Fill'}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  soundManager.playSelect();
                  setViewMode('shop');
                }}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                RETURN TO SHOP
              </button>

              <button
                onClick={() => {
                  soundManager.playCancel();
                  onClose();
                }}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer transition-colors"
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

