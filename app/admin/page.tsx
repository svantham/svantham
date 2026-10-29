'use client';

import React, { useEffect, useState, useMemo } from 'react';
import type { SvanthamData, ModuleItem, DeploymentCardItem, TailoredProjectItem } from '@/lib/get-data';

export default function AdminPage() {
  const [data, setData] = useState<SvanthamData | null>(null);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [activePage, setActivePage] = useState<string>('home');
  const [activeTab, setActiveTab] = useState<string>('modules');

  // Reset tab when switching pages
  useEffect(() => {
    if (activePage === 'home') setActiveTab('modules');
    else if (activePage === 'tailored') setActiveTab('portfolio');
    else setActiveTab('hero_highlights');
  }, [activePage]);
  const [loaded, setLoaded] = useState(false);
  const [pin, setPin] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const resolveImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('/')) return url;
    const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://r2.svantham.in';
    return `${baseUrl}/images/${url}`;
  };

  // Auto restore session pin if saved
  useEffect(() => {
    const savedPin = sessionStorage.getItem('svantham_admin_pin');
    if (savedPin && savedPin.length === 4) {
      fetch('/api/verify-pin', {
        method: 'POST',
        headers: { Authorization: `Bearer ${savedPin}` },
      })
        .then((res) => {
          if (res.ok) {
            setPin(savedPin);
            setAuthenticated(true);
          }
        })
        .catch(() => { });
    }
  }, []);

  // Fetch data
  useEffect(() => {
    if (!authenticated) return;
    fetch('/api/data')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then((fetchedData) => {
        setData(fetchedData);
        setLoaded(true);
      })
      .catch((err) => {
        console.error(err);
        setStatus('ERROR LOADING DATA');
      });
  }, [authenticated]);

  const save = async () => {
    if (!data) return;
    setStatus('SAVING...');
    try {
      const dataToSave = {
        ...data,
        tailoredPortfolio: (data.tailoredPortfolio || []).map((proj) => ({
          ...proj,
          scope: Array.isArray(proj.scope)
            ? proj.scope
            : (typeof proj.scope === 'string'
              ? proj.scope.split(',').map((s: string) => s.trim()).filter(Boolean)
              : []),
        })),
      };

      const res = await fetch('/api/save-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${pin}`,
        },
        body: JSON.stringify(dataToSave),
      });

      if (res.ok) {
        setStatus('SAVED SUCCESSFULLY ✓');
        setData(dataToSave);
      } else {
        setStatus('ERROR SAVING ✕');
      }
      setTimeout(() => setStatus(''), 3500);
    } catch (e: any) {
      setStatus('ERROR: ' + e.message);
    }
  };

  // Content dictionary helpers
  const updateContent = (key: string, value: string) => {
    setData((prev) => {
      if (!prev) return prev;
      if (activePage === 'home' || activePage === 'tailored') {
        return {
          ...prev,
          content: { ...prev.content, [key]: value },
        };
      } else {
        const products = { ...prev.products };
        products[activePage] = { ...(products[activePage] || {}), [key]: value };
        return { ...prev, products };
      }
    });
  };

  const updateContentArrayItem = (arrayKey: string, index: number, field: string | null, value: any) => {
    setData((prev) => {
      if (!prev) return prev;
      const isProduct = activePage !== 'home' && activePage !== 'tailored';
      const arr = isProduct
        ? [...(prev.products?.[activePage]?.[arrayKey] || [])]
        : [...(prev[arrayKey] || [])];

      if (field) {
        arr[index] = { ...arr[index], [field]: value };
      } else {
        arr[index] = value; // string arrays
      }

      if (isProduct) {
        const products = { ...prev.products };
        products[activePage] = { ...(products[activePage] || {}), [arrayKey]: arr };
        return { ...prev, products };
      } else {
        return { ...prev, [arrayKey]: arr };
      }
    });
  };

  const addContentArrayItem = (arrayKey: string, isObject: boolean) => {
    setData((prev) => {
      if (!prev) return prev;
      const isProduct = activePage !== 'home' && activePage !== 'tailored';
      const arr = isProduct
        ? [...(prev.products?.[activePage]?.[arrayKey] || [])]
        : [...(prev[arrayKey] || [])];

      if (isObject) {
        if (arrayKey === 'benefits') {
          arr.push({ title: 'New Benefit', copy: 'Benefit description' });
        } else if (arrayKey === 'faqs') {
          arr.push({ question: 'New Question', answer: 'Answer details...' });
        } else {
          arr.push({ title: 'New Highlight', desc: 'Highlight description' });
        }
      } else {
        arr.push('New Point');
      }

      if (isProduct) {
        const products = { ...prev.products };
        products[activePage] = { ...(products[activePage] || {}), [arrayKey]: arr };
        return { ...prev, products };
      } else {
        return { ...prev, [arrayKey]: arr };
      }
    });
  };

  const updateTailoredPortfolio = (index: number, field: string, value: any, subfield?: string) => {
    setData((prev) => {
      if (!prev) return prev;
      const arr = [...(prev.tailoredPortfolio || [])];
      if (subfield) {
        arr[index] = { ...arr[index], [field]: { ...arr[index][field], [subfield]: value } };
      } else {
        arr[index] = { ...arr[index], [field]: value };
      }
      return { ...prev, tailoredPortfolio: arr };
    });
  };

  const addTailoredPortfolio = () => {
    setData((prev) => {
      if (!prev) return prev;
      const newProj: TailoredProjectItem = {
        id: `project-${Date.now()}`,
        title: 'New Project',
        name: 'New Project',
        category: 'Software',
        shortDescription: 'Short project summary for card preview.',
        images: ['/placeholder.svg?height=880&width=1250'],
        image: '/placeholder.svg?height=880&width=1250',
        scope: ['Product strategy', 'Interface design', 'Full-stack development'],
      };
      return { ...prev, tailoredPortfolio: [...(prev.tailoredPortfolio || []), newProj] };
    });
  };

  const deleteTailoredPortfolio = (index: number) => {
    setData((prev) => {
      if (!prev) return prev;
      const arr = [...(prev.tailoredPortfolio || [])];
      arr.splice(index, 1);
      return { ...prev, tailoredPortfolio: arr };
    });
  };

  const deleteContentArrayItem = (arrayKey: string, index: number) => {
    setData((prev) => {
      if (!prev) return prev;
      const isProduct = activePage !== 'home' && activePage !== 'tailored';
      const arr = isProduct
        ? [...(prev.products?.[activePage]?.[arrayKey] || [])]
        : [...(prev[arrayKey] || [])];

      arr.splice(index, 1);

      if (isProduct) {
        const products = { ...prev.products };
        products[activePage] = { ...(products[activePage] || {}), [arrayKey]: arr };
        return { ...prev, products };
      } else {
        return { ...prev, [arrayKey]: arr };
      }
    });
  };

  const moveContentArrayItem = (arrayKey: string, index: number, direction: number) => {
    setData((prev) => {
      if (!prev) return prev;
      const isProduct = activePage !== 'home' && activePage !== 'tailored';
      const arr = isProduct
        ? [...(prev.products?.[activePage]?.[arrayKey] || [])]
        : [...(prev[arrayKey] || [])];

      const target = index + direction;
      if (target < 0 || target >= arr.length) return prev;

      [arr[index], arr[target]] = [arr[target], arr[index]];

      if (isProduct) {
        const products = { ...prev.products };
        products[activePage] = { ...(products[activePage] || {}), [arrayKey]: arr };
        return { ...prev, products };
      } else {
        return { ...prev, [arrayKey]: arr };
      }
    });
  };

  const filteredKeys = useMemo(() => {
    if (!data) return [];

    let keys: string[] = [];
    let sourceData: any = {};

    if (activePage === 'home' || activePage === 'tailored') {
      sourceData = data.content || {};
      const allContentKeys = Object.keys(sourceData);

      if (activePage === 'home') {
        const namespaces = ['tailored_', ...data.modules.map((m) => `${m.id}_`)];
        keys = allContentKeys.filter((k) => !namespaces.some((ns) => k.startsWith(ns)));
      } else {
        const prefix = `${activePage}_`;
        keys = allContentKeys.filter((k) => k.startsWith(prefix));
      }
    } else {
      // It's a product page
      sourceData = data.products?.[activePage] || {};
      keys = Object.keys(sourceData);
    }

    // Exclude arrays from flat dictionary
    keys = keys.filter(k => !Array.isArray(sourceData[k]));

    if (search.trim()) {
      const q = search.toLowerCase();
      return keys.filter((k) => {
        const val = String(sourceData[k] || '');
        return (
          k.toLowerCase().includes(q) ||
          val.toLowerCase().includes(q)
        );
      });
    }

    return [];
  }, [data, search, activePage]);

  // Modules helpers
  const updateModule = (index: number, key: keyof ModuleItem, value: any) => {
    setData((prev) => {
      if (!prev) return prev;
      const updated = [...prev.modules];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, modules: updated };
    });
  };

  const addModule = () => {
    setData((prev) => {
      if (!prev) return prev;
      const newModule: ModuleItem = {
        id: `module-${Date.now()}`,
        name: 'New Module',
        description: 'Description of the new module.',
        accent: 'chartreuse',
        image: '',
      };
      return { ...prev, modules: [...prev.modules, newModule] };
    });
  };

  const deleteModule = (index: number) => {
    if (confirm('Delete this module?')) {
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          modules: prev.modules.filter((_, i) => i !== index),
        };
      });
    }
  };

  const moveModule = (index: number, direction: number) => {
    setData((prev) => {
      if (!prev) return prev;
      const updated = [...prev.modules];
      const target = index + direction;
      if (target < 0 || target >= updated.length) return prev;
      [updated[index], updated[target]] = [updated[target], updated[index]];
      return { ...prev, modules: updated };
    });
  };

  // Helper: upload a file via server-side proxy (no CORS issues)
  const uploadToR2 = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload-image', {
      method: 'POST',
      headers: { Authorization: `Bearer ${pin}` },
      body: fd,
    });
    const resData = await res.json();
    if (!res.ok || !resData.success) throw new Error(resData.error || 'Upload failed');
    return resData.publicUrl;
  };

  // Content Image Upload
  const handleContentImageUpload = async (file: File, contentKey: string) => {
    setStatus('UPLOADING IMAGE...');
    try {
      const publicUrl = await uploadToR2(file);
      updateContent(contentKey, publicUrl);
      setStatus('UPLOAD COMPLETE ✓');
      setTimeout(() => setStatus(''), 3000);
    } catch (err: any) {
      setStatus('UPLOAD ERROR: ' + err.message);
      alert('Upload failed: ' + err.message);
    }
  };

  // Cloudflare R2 Upload (modules)
  const handleR2Upload = async (file: File, moduleIndex: number) => {
    setUploadingIndex(moduleIndex);
    setStatus('UPLOADING TO R2...');
    try {
      const publicUrl = await uploadToR2(file);
      updateModule(moduleIndex, 'image', publicUrl);
      setStatus('UPLOAD COMPLETE ✓');
      setTimeout(() => setStatus(''), 3000);
    } catch (err: any) {
      setStatus('UPLOAD ERROR: ' + err.message);
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingIndex(null);
    }
  };

  const [uploadingPortfolioIndex, setUploadingPortfolioIndex] = useState<number | null>(null);

  const handlePortfolioUpload = async (file: File, portfolioIndex: number, field: 'logo' | 'images') => {
    setUploadingPortfolioIndex(portfolioIndex);
    setStatus('UPLOADING TO R2...');
    try {
      const publicUrl = await uploadToR2(file);
      setData((prev) => {
        if (!prev) return prev;
        const arr = [...(prev.tailoredPortfolio || [])];
        const currentImages = Array.isArray(arr[portfolioIndex].images) ? arr[portfolioIndex].images : [];
        const newImages = [...currentImages, publicUrl];
        arr[portfolioIndex] = {
          ...arr[portfolioIndex],
          images: newImages,
          image: arr[portfolioIndex].image || publicUrl,
        };
        return { ...prev, tailoredPortfolio: arr };
      });
      setStatus('UPLOAD COMPLETE ✓');
      setTimeout(() => setStatus(''), 3000);
    } catch (err: any) {
      setStatus('UPLOAD ERROR: ' + err.message);
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingPortfolioIndex(null);
    }
  };

  // Deployment cards helpers
  const updateDeploymentCard = (index: number, key: keyof DeploymentCardItem, value: string) => {
    setData((prev) => {
      if (!prev) return prev;
      const updated = [...prev.deploymentCards];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, deploymentCards: updated };
    });
  };


  // Ticker helpers
  const updateTickerItem = (index: number, value: string) => {
    setData((prev) => {
      if (!prev) return prev;
      const updated = [...prev.ticker];
      updated[index] = value;
      return { ...prev, ticker: updated };
    });
  };

  const addTickerItem = () => {
    setData((prev) => {
      if (!prev) return prev;
      return { ...prev, ticker: [...prev.ticker, 'NEW BENEFIT'] };
    });
  };

  const deleteTickerItem = (index: number) => {
    setData((prev) => {
      if (!prev) return prev;
      return { ...prev, ticker: prev.ticker.filter((_, i) => i !== index) };
    });
  };

  // PIN Lock Screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0c0e16] flex items-center justify-center text-white p-6 font-sans">
        <style>{`input[type="password"]::-ms-reveal, input[type="password"]::-ms-clear { display: none; }`}</style>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col items-center gap-5 text-center max-w-sm w-full">
          <h1 className="text-3xl font-bold tracking-tight text-white">Admin CMS</h1>
          <p className="text-xs text-white/50 mb-2">Enter PIN to authenticate and edit content</p>
          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={async (e) => {
              const val = e.target.value;
              setPin(val);
              setLoginError('');
              if (val.length === 4) {
                try {
                  const res = await fetch('/api/verify-pin', {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${val}` },
                  });
                  if (res.ok) {
                    sessionStorage.setItem('svantham_admin_pin', val);
                    setAuthenticated(true);
                  } else {
                    setPin('');
                    setLoginError('INVALID PIN');
                  }
                } catch {
                  setPin('');
                  setLoginError('ERROR VERIFYING PIN');
                }
              }
            }}
            placeholder="••••"
            className="w-48 bg-transparent border-b-2 border-white/20 text-center py-3 text-3xl font-mono tracking-[0.5em] outline-none focus:border-[#b8ef3e] transition text-white"
            autoFocus
          />
          {loginError && <p className="text-xs font-mono font-bold tracking-widest text-[#ff7059] mt-2">{loginError}</p>}
        </form>
      </div>
    );
  }

  if (!loaded || !data) {
    return (
      <div className="min-h-screen bg-[#0c0e16] flex flex-col items-center justify-center text-white gap-3 font-mono text-xs font-bold tracking-[.18em]">
        <div className="w-6 h-6 border-2 border-[#b8ef3e] border-t-transparent rounded-full animate-spin" />
        LOADING CONTROL ROOM...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e100b] text-white selection:bg-[#b8ef3e]/30 pt-6 pb-32 relative z-10 overflow-x-hidden">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* Top Header */}
        <header className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <h1 className="mt-2 text-3xl sm:text-5xl font-extrabold tracking-[-0.05em] text-white">Svantham CMS</h1>
          </div>
          <div className="flex items-center flex-wrap gap-4">
            <button
              type="button"
              onClick={save}
              disabled={!!status && (status.includes('SAVING') || status.includes('UPLOADING'))}
              className={`rounded-full px-6 py-3 text-xs font-mono font-black tracking-[.14em] transition hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(184,239,62,0.3)] ${status ? 'bg-white pointer-events-none text-black' : 'bg-[#b8ef3e] hover:bg-white text-[#161714]'
                }`}
            >
              {status || 'SAVE CHANGES'}
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-5 py-3 text-xs font-mono font-bold tracking-[0.12em] transition hover:border-[#b8ef3e] hover:text-[#b8ef3e]"
            >
              VIEW SITE ↗
            </a>
          </div>
        </header>

        {/* Universal Page Picker */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <label className="text-xs font-mono font-bold text-white/50 tracking-widest uppercase shrink-0">Target Page:</label>
          <select
            value={activePage}
            onChange={(e) => setActivePage(e.target.value)}
            className="w-full sm:w-auto bg-[#12141c] border border-white/20 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white font-mono outline-none focus:border-[#b8ef3e] cursor-pointer appearance-none"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23b8ef3e%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px top 50%', backgroundSize: '10px auto' }}
          >
            <option value="home">Home</option>
            <option value="tailored">Tailored</option>
            {data.modules.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Two-Column Editor Layout */}
        <main className="grid gap-10 lg:grid-cols-[1.1fr_1.4fr] items-start">
          {/* Left Column: Content Dictionary */}
          <section className="rounded-3xl bg-[#12141c] p-6 sm:p-8 border border-white/10 lg:sticky lg:top-8 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-xs font-mono font-bold tracking-[0.18em] text-[#b8ef3e]">CONTENT DICTIONARY</h2>
              <span className="text-[10px] font-mono text-white/40">{filteredKeys.length} keys</span>
            </div>



            {/* Search Input */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search keys or text..."
              className="w-full border-b border-white/20 bg-transparent py-3 text-sm outline-none transition placeholder:text-white/30 focus:border-[#b8ef3e] mb-8"
            />

            {/* Dictionary List */}
            <div className="flex flex-col gap-6">
              {filteredKeys.length === 0 && (
                <div className="text-xs font-mono text-white/30 py-8 text-center">NO MATCHING KEYS FOUND</div>
              )}
              {filteredKeys.map((key) => {
                const isProduct = activePage !== 'home' && activePage !== 'tailored';
                const val = isProduct
                  ? (data.products?.[activePage]?.[key] || '')
                  : (data.content[key] || '');
                const isLong = val.length > 70 || val.includes('\n');
                return (
                  <div key={key} className="group">
                    <label className="block text-[10px] font-mono font-bold tracking-[.14em] text-white/40 group-focus-within:text-[#b8ef3e] uppercase mb-1.5 transition">
                      {key}
                    </label>
                    {key.toLowerCase().includes('image') || key.toLowerCase().includes('logo') || key.toLowerCase().includes('icon') || key.toLowerCase().includes('path') ? (
                      <div className="flex items-center gap-4 bg-white/5 p-2 rounded-xl border border-white/10">
                        {val ? (
                          <div className="w-16 h-16 rounded-lg bg-black/50 overflow-hidden flex-shrink-0 border border-white/10 flex items-center justify-center">
                            <img src={resolveImageUrl(val)} alt="preview" className="max-w-full max-h-full object-contain" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-black/50 border border-white/10 flex-shrink-0 flex items-center justify-center text-[9px] text-white/30 font-mono text-center">NO IMG</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <label className="cursor-pointer inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#b8ef3e]/20 text-[#b8ef3e] text-[10px] font-mono font-bold transition border border-white/10 hover:border-[#b8ef3e]/50">
                            UPLOAD NEW IMAGE
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleContentImageUpload(e.target.files[0], key);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    ) : isLong ? (
                      <textarea
                        value={val}
                        onChange={(e) => updateContent(key, e.target.value)}
                        rows={3}
                        className="w-full resize-y rounded-xl border border-white/15 bg-[#171a25] p-3 text-sm outline-none transition focus:border-[#b8ef3e]"
                      />
                    ) : (
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => updateContent(key, e.target.value)}
                        className="w-full border-b border-white/20 bg-transparent py-2 text-sm outline-none transition focus:border-[#b8ef3e]"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Right Column: Structured Data Editors */}
          <section className="rounded-3xl bg-[#12141c] p-6 sm:p-8 border border-white/10 lg:sticky lg:top-8 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
            {/* Tab Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-8 border-b border-white/10 pb-4">
              <div className="flex gap-3 overflow-x-auto pb-1 max-w-full scrollbar-none">
                {activePage === 'home' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveTab('modules')}
                      className={`text-[11px] font-mono font-bold tracking-[0.16em] uppercase pb-1 transition shrink-0 whitespace-nowrap ${activeTab === 'modules' ? 'text-[#b8ef3e] border-b-2 border-[#b8ef3e]' : 'text-white/40 hover:text-white'}`}
                    >
                      MODULES ({data.modules.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('deployment')}
                      className={`text-[11px] font-mono font-bold tracking-[0.16em] uppercase pb-1 transition shrink-0 whitespace-nowrap ${activeTab === 'deployment' ? 'text-[#b8ef3e] border-b-2 border-[#b8ef3e]' : 'text-white/40 hover:text-white'}`}
                    >
                      DEPLOYMENT ({data.deploymentCards.length})
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('ticker')}
                      className={`text-[11px] font-mono font-bold tracking-[0.16em] uppercase pb-1 transition shrink-0 whitespace-nowrap ${activeTab === 'ticker' ? 'text-[#b8ef3e] border-b-2 border-[#b8ef3e]' : 'text-white/40 hover:text-white'}`}
                    >
                      TICKER ({data.ticker.length})
                    </button>
                  </>
                )}

                {activePage === 'tailored' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('portfolio')}
                    className={`text-[11px] font-mono font-bold tracking-[0.16em] uppercase pb-1 transition shrink-0 whitespace-nowrap ${activeTab === 'portfolio' || activeTab !== 'portfolio' ? 'text-[#b8ef3e] border-b-2 border-[#b8ef3e]' : ''}`}
                  >
                    PORTFOLIO ({(data.tailoredPortfolio || []).length})
                  </button>
                )}

                {activePage !== 'home' && activePage !== 'tailored' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveTab('hero_highlights')}
                      className={`text-[11px] font-mono font-bold tracking-[0.16em] uppercase pb-1 transition shrink-0 whitespace-nowrap ${activeTab === 'hero_highlights' ? 'text-[#b8ef3e] border-b-2 border-[#b8ef3e]' : 'text-white/40 hover:text-white'}`}
                    >
                      HERO & HIGHLIGHTS
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('why_benefits')}
                      className={`text-[11px] font-mono font-bold tracking-[0.16em] uppercase pb-1 transition shrink-0 whitespace-nowrap ${activeTab === 'why_benefits' ? 'text-[#b8ef3e] border-b-2 border-[#b8ef3e]' : 'text-white/40 hover:text-white'}`}
                    >
                      WHY & BENEFITS
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('faqs')}
                      className={`text-[11px] font-mono font-bold tracking-[0.16em] uppercase pb-1 transition shrink-0 whitespace-nowrap ${activeTab === 'faqs' ? 'text-[#b8ef3e] border-b-2 border-[#b8ef3e]' : 'text-white/40 hover:text-white'}`}
                    >
                      FAQS ({(data?.products?.[activePage]?.faqs || []).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('workspace_media')}
                      className={`text-[11px] font-mono font-bold tracking-[0.16em] uppercase pb-1 transition shrink-0 whitespace-nowrap ${activeTab === 'workspace_media' ? 'text-[#b8ef3e] border-b-2 border-[#b8ef3e]' : 'text-white/40 hover:text-white'}`}
                    >
                      WORKSPACE & MEDIA
                    </button>
                  </>
                )}
              </div>

              {activePage === 'home' && activeTab === 'modules' && (
                <button
                  type="button"
                  onClick={addModule}
                  className="rounded-full bg-[#b8ef3e] px-4 py-1.5 text-[10px] font-mono font-black text-[#161714] transition hover:bg-white"
                >
                  + ADD MODULE
                </button>
              )}
              {activeTab === 'ticker' && (
                <button
                  type="button"
                  onClick={addTickerItem}
                  className="rounded-full bg-[#b8ef3e] px-4 py-1.5 text-[10px] font-mono font-black text-[#161714] transition hover:bg-white"
                >
                  + ADD TICKER
                </button>
              )}
            </div>

            {/* TAB 1: MODULES */}
            {activeTab === 'modules' && (
              <div className="flex flex-col gap-8">
                {data.modules.map((mod, idx) => (
                  <div key={mod.id || idx} className="rounded-2xl bg-[#0c0e16] p-6 border border-white/10 flex flex-col gap-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <input
                          type="text"
                          value={mod.name}
                          onChange={(e) => updateModule(idx, 'name', e.target.value)}
                          className="font-bold text-xl bg-transparent outline-none border-b border-transparent focus:border-[#b8ef3e] text-white min-w-0 flex-1"
                          placeholder="Module Name"
                        />
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveModule(idx, -1)}
                          disabled={idx === 0}
                          className="px-2 py-1 text-xs font-mono border border-white/10 rounded disabled:opacity-25 hover:border-[#b8ef3e]"
                          title="Move Up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveModule(idx, 1)}
                          disabled={idx === data.modules.length - 1}
                          className="px-2 py-1 text-xs font-mono border border-white/10 rounded disabled:opacity-25 hover:border-[#b8ef3e]"
                          title="Move Down"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteModule(idx)}
                          className="px-2 py-1 text-xs font-mono text-[#ff7059] border border-[#ff7059]/30 rounded hover:bg-[#ff7059]/10 ml-2"
                          title="Delete Module"
                        >
                          ✕
                        </button>
                      </div>
                    </div>


                    <div>
                      <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Short Description</label>
                      <input
                        type="text"
                        value={mod.description}
                        onChange={(e) => updateModule(idx, 'description', e.target.value)}
                        className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-[#b8ef3e]"
                      />
                    </div>


                    {/* Accent selection */}
                    <div className="flex items-center gap-4 flex-wrap">
                      <label className="text-[10px] font-mono text-white/40 uppercase w-full">Accent Style:</label>
                      {(['chartreuse', 'coral', 'ink', 'sky', 'violet', 'amber'] as const).map((acc) => (
                        <button
                          type="button"
                          key={acc}
                          onClick={() => updateModule(idx, 'accent', acc)}
                          className={`text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full border transition ${mod.accent === acc
                            ? 'border-[#b8ef3e] bg-[#b8ef3e]/20 text-[#b8ef3e]'
                            : 'border-white/10 text-white/40'
                            }`}
                        >
                          {acc}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}



            {/* TAB 3: DEPLOYMENT STACK */}
            {activeTab === 'deployment' && (
              <div className="flex flex-col gap-6">
                {data.deploymentCards.map((card, cIdx) => (
                  <div key={card.code || cIdx} className="rounded-2xl bg-[#0c0e16] p-6 border border-white/10 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-[#b8ef3e] px-2 py-1 rounded bg-[#b8ef3e]/10">
                        LAYER 0{cIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={card.code}
                        onChange={(e) => updateDeploymentCard(cIdx, 'code', e.target.value)}
                        className="text-xs font-mono font-bold bg-transparent border-b border-white/20 focus:border-[#b8ef3e] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Heading</label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => updateDeploymentCard(cIdx, 'title', e.target.value)}
                        className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-sm font-bold outline-none focus:border-[#b8ef3e]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Description</label>
                      <textarea
                        value={card.description}
                        onChange={(e) => updateDeploymentCard(cIdx, 'description', e.target.value)}
                        rows={2}
                        className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-[#b8ef3e] resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}


            {/* TAB 5: TICKER */}
            {activeTab === 'ticker' && (
              <div className="flex flex-col gap-3">
                {data.ticker.map((item, tIdx) => (
                  <div key={tIdx} className="flex items-center gap-3 bg-[#0c0e16] p-3 rounded-xl border border-white/10">
                    <span className="text-xs font-mono text-white/40 w-6">#{tIdx + 1}</span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateTickerItem(tIdx, e.target.value)}
                      className="flex-1 bg-transparent border-b border-white/10 text-xs font-mono font-bold tracking-wider outline-none focus:border-[#b8ef3e]"
                    />
                    <button
                      type="button"
                      onClick={() => deleteTickerItem(tIdx)}
                      className="text-xs font-mono text-[#ff7059] px-2 py-1 hover:bg-[#ff7059]/10 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: PORTFOLIO */}
            {activeTab === 'portfolio' && (
              <div className="flex flex-col gap-6">
                {(data.tailoredPortfolio || []).map((proj, pIdx) => {
                  const projectImages = Array.isArray(proj.images) && proj.images.length > 0
                    ? proj.images
                    : (proj.image ? [proj.image] : (proj.logo ? [proj.logo] : []));

                  return (
                    <div key={proj.id || pIdx} className="rounded-2xl bg-[#0c0e16] p-6 border border-white/10 flex flex-col gap-5">
                      {/* Header with Title and Delete */}
                      <div className="flex items-center gap-4">
                        <input
                          type="text"
                          value={proj.title || proj.name || ''}
                          onChange={(e) => {
                            updateTailoredPortfolio(pIdx, 'title', e.target.value);
                            updateTailoredPortfolio(pIdx, 'name', e.target.value);
                          }}
                          className="font-bold text-xl bg-transparent outline-none border-b border-transparent focus:border-[#b8ef3e] text-white flex-1 text-left"
                          placeholder="Project Title (e.g. Operations, simplified.)"
                        />
                        <button
                          type="button"
                          onClick={() => deleteTailoredPortfolio(pIdx)}
                          className="text-[10px] font-mono text-[#ff7059] hover:underline px-2 py-1"
                        >
                          DELETE
                        </button>
                      </div>

                      {/* Category & Scope Tags */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Category</label>
                          <select
                            value={proj.category || 'Software'}
                            onChange={(e) => updateTailoredPortfolio(pIdx, 'category', e.target.value)}
                            className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-[#b8ef3e] text-white"
                          >
                            <option value="Software">Software</option>
                            <option value="Content">Content</option>
                            <option value="Digital marketing">Digital marketing</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Scope / Deliverables (comma separated)</label>
                          <input
                            type="text"
                            value={Array.isArray(proj.scope) ? proj.scope.join(', ') : (proj.scope ?? '')}
                            onChange={(e) => {
                              updateTailoredPortfolio(pIdx, 'scope', e.target.value);
                            }}
                            onBlur={(e) => {
                              const scopeArr = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                              updateTailoredPortfolio(pIdx, 'scope', scopeArr);
                            }}
                            placeholder="e.g. Product strategy, Interface design, Development"
                            className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-[#b8ef3e] text-white"
                          />
                          {((Array.isArray(proj.scope) ? proj.scope : (proj.scope || '').split(',').map((s: string) => s.trim()).filter(Boolean))).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {(Array.isArray(proj.scope) ? proj.scope : (proj.scope || '').split(',').map((s: string) => s.trim()).filter(Boolean)).map((tag: string, tIdx: number) => (
                                <span key={tIdx} className="bg-white/10 text-white/80 text-[10px] font-mono px-2 py-0.5 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[10px] font-mono text-white/40 uppercase">Description</label>
                          <span className="text-[10px] font-mono text-white/30">Shown directly on project card</span>
                        </div>
                        <textarea
                          value={proj.shortDescription || proj.short_description || (typeof proj.description === 'string' ? proj.description : '') || ''}
                          onChange={(e) => {
                            updateTailoredPortfolio(pIdx, 'shortDescription', e.target.value);
                            updateTailoredPortfolio(pIdx, 'short_description', e.target.value);
                          }}
                          placeholder="Summary of the project..."
                          rows={2}
                          className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-[#b8ef3e] text-white resize-none"
                        />
                      </div>

                      {/* Multiple Images Management */}
                      <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div>
                            <span className="block text-[10px] font-mono text-white/40 uppercase">
                              Project Images ({projectImages.length})
                            </span>
                            <span className="text-[10px] text-white/40">First image is automatically used as the card cover</span>
                          </div>
                          <label className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-[10px] font-mono font-bold uppercase hover:border-[#b8ef3e] transition">
                            {uploadingPortfolioIndex === pIdx ? 'UPLOADING...' : 'UPLOAD IMAGE ↗'}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingPortfolioIndex !== null}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handlePortfolioUpload(file, pIdx, 'images');
                              }}
                            />
                          </label>
                        </div>

                        {/* Add image URL directly */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            id={`add-img-url-${pIdx}`}
                            placeholder="Or paste image URL (e.g. /placeholder.svg?height=880&width=1250 or https://...)"
                            className="flex-1 bg-[#171a25] border border-white/10 rounded-lg p-2 text-xs outline-none focus:border-[#b8ef3e] text-white"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const input = e.currentTarget;
                                const val = input.value.trim();
                                if (val) {
                                  const updated = [...projectImages, val];
                                  updateTailoredPortfolio(pIdx, 'images', updated);
                                  updateTailoredPortfolio(pIdx, 'image', updated[0]);
                                  input.value = '';
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById(`add-img-url-${pIdx}`) as HTMLInputElement;
                              if (input && input.value.trim()) {
                                const val = input.value.trim();
                                const updated = [...projectImages, val];
                                updateTailoredPortfolio(pIdx, 'images', updated);
                                updateTailoredPortfolio(pIdx, 'image', updated[0]);
                                input.value = '';
                              }
                            }}
                            className="rounded-lg bg-white/10 px-3 py-2 text-xs font-mono text-white hover:bg-white/20 transition"
                          >
                            + ADD URL
                          </button>
                        </div>

                        {/* Images Grid */}
                        {projectImages.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-1">
                            {projectImages.map((img: string, imgIdx: number) => (
                              <div key={imgIdx} className="relative group rounded-xl border border-white/10 bg-white/5 overflow-hidden aspect-[4/3] flex items-center justify-center">
                                <img src={resolveImageUrl(img)} alt={`preview ${imgIdx}`} className="size-full object-cover" />
                                {imgIdx === 0 && (
                                  <span className="absolute top-1.5 left-1.5 bg-[#b8ef3e] text-black font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                                    COVER
                                  </span>
                                )}
                                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                                  {imgIdx > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newImgs = [...projectImages];
                                        const [moved] = newImgs.splice(imgIdx, 1);
                                        newImgs.unshift(moved);
                                        updateTailoredPortfolio(pIdx, 'images', newImgs);
                                        updateTailoredPortfolio(pIdx, 'image', moved);
                                      }}
                                      className="text-[9px] font-mono bg-white/20 hover:bg-[#b8ef3e] hover:text-black text-white px-2 py-1 rounded transition w-full"
                                    >
                                      MAKE COVER
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newImgs = [...projectImages];
                                      newImgs.splice(imgIdx, 1);
                                      updateTailoredPortfolio(pIdx, 'images', newImgs);
                                      updateTailoredPortfolio(pIdx, 'image', newImgs[0] || '');
                                    }}
                                    className="text-[9px] font-mono bg-[#ff7059]/20 hover:bg-[#ff7059] text-[#ff7059] hover:text-white px-2 py-1 rounded transition w-full"
                                  >
                                    REMOVE
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div className="mt-2">
                  <button
                    type="button"
                    onClick={addTailoredPortfolio}
                    className="w-full rounded-xl border border-dashed border-white/20 p-4 text-xs font-mono font-bold text-white/50 hover:border-[#b8ef3e] hover:text-[#b8ef3e] transition"
                  >
                    + ADD NEW PROJECT
                  </button>
                </div>
              </div>
            )}

            {/* TAB: HERO & HIGHLIGHTS */}
            {activeTab === 'hero_highlights' && (
              <div className="flex flex-col gap-6">
                <div className="rounded-2xl bg-[#0c0e16] p-6 border border-white/10 flex flex-col gap-5">
                  <h3 className="text-xs font-mono font-bold text-[#b8ef3e] uppercase">Hero Header & Copy</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Eyebrow (e.g. MEET PRODUCT POSS)</label>
                      <input
                        type="text"
                        value={data?.products?.[activePage]?.hero_eyebrow || ''}
                        onChange={(e) => updateContent('hero_eyebrow', e.target.value)}
                        placeholder={`MEET PRODUCT ${activePage.toUpperCase()}`}
                        className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-[#b8ef3e]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Title Line 1</label>
                      <input
                        type="text"
                        value={data?.products?.[activePage]?.hero_title_1 || ''}
                        onChange={(e) => updateContent('hero_title_1', e.target.value)}
                        placeholder="Your counters."
                        className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-[#b8ef3e]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Title Line 2</label>
                      <input
                        type="text"
                        value={data?.products?.[activePage]?.hero_title_2 || ''}
                        onChange={(e) => updateContent('hero_title_2', e.target.value)}
                        placeholder="Always moving"
                        className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-[#b8ef3e]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Pricing Sub-note</label>
                      <input
                        type="text"
                        value={data?.products?.[activePage]?.hero_pricing_note || ''}
                        onChange={(e) => updateContent('hero_pricing_note', e.target.value)}
                        placeholder="₹20,000 / year. Your whole team included."
                        className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-[#b8ef3e]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Hero Description</label>
                    <textarea
                      value={data?.products?.[activePage]?.hero_desc || ''}
                      onChange={(e) => updateContent('hero_desc', e.target.value)}
                      rows={2}
                      placeholder="Brief overview description of the product..."
                      className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-[#b8ef3e] resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <div>
                      <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Primary CTA Button</label>
                      <input
                        type="text"
                        value={data?.products?.[activePage]?.hero_btn_features || ''}
                        onChange={(e) => updateContent('hero_btn_features', e.target.value)}
                        placeholder="See features"
                        className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-[#b8ef3e]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Secondary CTA Button</label>
                      <input
                        type="text"
                        value={data?.products?.[activePage]?.hero_btn_pricing || ''}
                        onChange={(e) => updateContent('hero_btn_pricing', e.target.value)}
                        placeholder="View pricing"
                        className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-[#b8ef3e]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <div>
                      <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Security Badge Title</label>
                      <input
                        type="text"
                        value={data?.products?.[activePage]?.hero_sec_title || ''}
                        onChange={(e) => updateContent('hero_sec_title', e.target.value)}
                        placeholder="Your data stays yours."
                        className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-[#b8ef3e]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Security Badge Subtitle</label>
                      <input
                        type="text"
                        value={data?.products?.[activePage]?.hero_sec_subtitle || ''}
                        onChange={(e) => updateContent('hero_sec_subtitle', e.target.value)}
                        placeholder="On-prem. On your terms."
                        className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-[#b8ef3e]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono font-bold text-[#b8ef3e] uppercase">3 Value Highlight Pillars (Below Showcase)</h3>
                    <button
                      type="button"
                      onClick={() => addContentArrayItem('highlights', true)}
                      className="text-[10px] font-mono font-bold text-[#b8ef3e] hover:underline"
                    >
                      + ADD PILLAR
                    </button>
                  </div>
                  {((data?.products?.[activePage]?.highlights || data?.products?.[activePage]?.features) || []).map((feat: any, fIdx: number) => (
                    <div key={fIdx} className="rounded-2xl bg-[#0c0e16] p-5 border border-white/10 flex flex-col gap-3">
                      <div className="flex items-center justify-between gap-4">
                        <input
                          type="text"
                          value={feat.title || ''}
                          onChange={(e) => updateContentArrayItem(data?.products?.[activePage]?.highlights ? 'highlights' : 'features', fIdx, 'title', e.target.value)}
                          placeholder="Pillar Title"
                          className="font-bold text-base bg-transparent outline-none border-b border-transparent focus:border-[#b8ef3e] text-white flex-1 text-left"
                        />
                        <button
                          type="button"
                          onClick={() => deleteContentArrayItem(data?.products?.[activePage]?.highlights ? 'highlights' : 'features', fIdx)}
                          className="text-[10px] font-mono text-[#ff7059] hover:underline"
                        >
                          DELETE
                        </button>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Detail</label>
                        <input
                          type="text"
                          value={feat.desc || ''}
                          onChange={(e) => updateContentArrayItem(data?.products?.[activePage]?.highlights ? 'highlights' : 'features', fIdx, 'desc', e.target.value)}
                          placeholder="Short detail description..."
                          className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2 text-xs outline-none focus:border-[#b8ef3e]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: WHY & BENEFITS */}
            {activeTab === 'why_benefits' && (
              <div className="flex flex-col gap-6">
                <div className="rounded-2xl bg-[#0c0e16] p-6 border border-white/10 flex flex-col gap-4">
                  <h3 className="text-xs font-mono font-bold text-[#b8ef3e] uppercase">Why Section Copy</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Section Eyebrow</label>
                      <input
                        type="text"
                        value={data?.products?.[activePage]?.built_around || ''}
                        onChange={(e) => updateContent('built_around', e.target.value)}
                        placeholder="BUILT AROUND OWNERSHIP"
                        className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-[#b8ef3e]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Main Heading</label>
                      <input
                        type="text"
                        value={data?.products?.[activePage]?.comp_title || ''}
                        onChange={(e) => updateContent('comp_title', e.target.value)}
                        placeholder={`A ${activePage.toUpperCase()} that answers to your business.`}
                        className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-[#b8ef3e]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Intro Description</label>
                    <textarea
                      value={data?.products?.[activePage]?.comp_desc || ''}
                      onChange={(e) => updateContent('comp_desc', e.target.value)}
                      rows={2}
                      placeholder="Why this product stands out..."
                      className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-[#b8ef3e] resize-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono font-bold text-[#b8ef3e] uppercase">3 Benefit Cards</h3>
                    <button
                      type="button"
                      onClick={() => addContentArrayItem('benefits', true)}
                      className="text-[10px] font-mono font-bold text-[#b8ef3e] hover:underline"
                    >
                      + ADD BENEFIT CARD
                    </button>
                  </div>
                  {(data?.products?.[activePage]?.benefits || []).map((b: any, bIdx: number) => (
                    <div key={bIdx} className="rounded-2xl bg-[#0c0e16] p-5 border border-white/10 flex flex-col gap-3">
                      <div className="flex items-center justify-between gap-4">
                        <input
                          type="text"
                          value={b.title || ''}
                          onChange={(e) => updateContentArrayItem('benefits', bIdx, 'title', e.target.value)}
                          placeholder="Benefit Title"
                          className="font-bold text-base bg-transparent outline-none border-b border-transparent focus:border-[#b8ef3e] text-white flex-1 text-left"
                        />
                        <button
                          type="button"
                          onClick={() => deleteContentArrayItem('benefits', bIdx)}
                          className="text-[10px] font-mono text-[#ff7059] hover:underline"
                        >
                          DELETE
                        </button>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Copy</label>
                        <textarea
                          value={b.copy || ''}
                          onChange={(e) => updateContentArrayItem('benefits', bIdx, 'copy', e.target.value)}
                          rows={2}
                          placeholder="Benefit explanation..."
                          className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-[#b8ef3e] resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: FAQS */}
            {activeTab === 'faqs' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-[#b8ef3e] uppercase">{activePage.toUpperCase()} Frequently Asked Questions</h3>
                    <p className="text-xs text-white/40 mt-0.5">Customize the plain-language FAQ accordion rendered on this product page.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addContentArrayItem('faqs', true)}
                    className="rounded-full bg-[#b8ef3e] px-4 py-1.5 text-[10px] font-mono font-black text-[#161714] transition hover:bg-white"
                  >
                    + ADD FAQ
                  </button>
                </div>

                {(!data?.products?.[activePage]?.faqs || data?.products?.[activePage]?.faqs.length === 0) ? (
                  <div className="rounded-2xl bg-[#0c0e16] p-8 border border-white/10 text-center flex flex-col items-center gap-4">
                    <p className="text-sm text-white/50">No custom FAQs defined yet for this product. Default system FAQs will display until you add your own.</p>
                    <button
                      type="button"
                      onClick={() => addContentArrayItem('faqs', true)}
                      className="rounded-xl border border-dashed border-[#b8ef3e]/40 px-5 py-3 text-xs font-mono font-bold text-[#b8ef3e] hover:bg-[#b8ef3e]/10 transition"
                    >
                      + ADD FIRST FAQ
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {(data?.products?.[activePage]?.faqs || []).map((faq: any, idx: number, allFaqs: any[]) => (
                      <div key={idx} className="rounded-2xl bg-[#0c0e16] p-6 border border-white/10 flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-xs font-mono font-bold text-[#b8ef3e] px-2 py-0.5 rounded bg-[#b8ef3e]/10">
                            Q{idx + 1}
                          </span>
                          <input
                            type="text"
                            value={faq.question || ''}
                            onChange={(e) => updateContentArrayItem('faqs', idx, 'question', e.target.value)}
                            placeholder="Question"
                            className="font-bold text-base bg-transparent outline-none border-b border-transparent focus:border-[#b8ef3e] text-white flex-1 text-left"
                          />
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => moveContentArrayItem('faqs', idx, -1)}
                              disabled={idx === 0}
                              className="px-2 py-1 text-xs font-mono border border-white/10 rounded disabled:opacity-25 hover:border-[#b8ef3e] transition"
                              title="Move Up"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => moveContentArrayItem('faqs', idx, 1)}
                              disabled={idx === allFaqs.length - 1}
                              className="px-2 py-1 text-xs font-mono border border-white/10 rounded disabled:opacity-25 hover:border-[#b8ef3e] transition"
                              title="Move Down"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteContentArrayItem('faqs', idx)}
                              className="text-[10px] font-mono text-[#ff7059] border border-[#ff7059]/30 px-2 py-1 rounded hover:bg-[#ff7059]/10 ml-1 transition"
                            >
                              DELETE
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Answer</label>
                          <textarea
                            value={faq.answer || ''}
                            onChange={(e) => updateContentArrayItem('faqs', idx, 'answer', e.target.value)}
                            rows={3}
                            placeholder="Detailed answer..."
                            className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-[#b8ef3e] resize-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: WORKSPACE & MEDIA */}
            {activeTab === 'workspace_media' && (
              <div className="flex flex-col gap-6">
                <div className="rounded-2xl bg-[#0c0e16] p-6 border border-white/10 flex flex-col gap-3">
                  <h3 className="text-xs font-mono font-bold text-[#b8ef3e] uppercase">Video Preview URL</h3>
                  <p className="text-xs text-white/40">Provide an MP4 or web video URL to render in the interactive preview frame.</p>
                  <input
                    type="text"
                    value={data?.products?.[activePage]?.video_url || ''}
                    onChange={(e) => updateContent('video_url', e.target.value)}
                    placeholder="/placeholder.mp4 or https://..."
                    className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-[#b8ef3e]"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="text-xs font-mono font-bold text-[#b8ef3e] uppercase">Product Screenshots & Images</h3>
                  {(data?.products?.[activePage]?.images || []).map((imgUrl: string, iIdx: number, allImgs: string[]) => (
                    <div key={iIdx} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10">
                      <div className="w-16 h-16 rounded-lg bg-black/50 overflow-hidden flex-shrink-0 border border-white/10 flex items-center justify-center">
                        <img src={resolveImageUrl(imgUrl)} alt="preview" className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-mono text-white/40 uppercase">
                          Image #{iIdx + 1}
                        </div>
                        <div className="text-xs text-white/60 truncate font-mono mt-0.5">
                          {imgUrl}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => moveContentArrayItem('images', iIdx, -1)}
                          disabled={iIdx === 0}
                          className="px-2.5 py-1 text-xs font-mono border border-white/10 rounded disabled:opacity-25 hover:border-[#b8ef3e] transition"
                          title="Move Up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveContentArrayItem('images', iIdx, 1)}
                          disabled={iIdx === allImgs.length - 1}
                          className="px-2.5 py-1 text-xs font-mono border border-white/10 rounded disabled:opacity-25 hover:border-[#b8ef3e] transition"
                          title="Move Down"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteContentArrayItem('images', iIdx)}
                          className="px-2.5 py-1 text-xs font-mono text-[#ff7059] border border-[#ff7059]/30 rounded hover:bg-[#ff7059]/10 ml-2 transition"
                          title="Delete Image"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}

                  <label className="mt-2 w-full cursor-pointer flex items-center justify-center rounded-xl border border-dashed border-white/20 p-4 text-xs font-mono font-bold text-white/40 hover:border-[#b8ef3e] hover:text-[#b8ef3e] transition">
                    {uploadingIndex !== null ? 'UPLOADING...' : '+ UPLOAD NEW IMAGE ↗'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingIndex !== null}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setUploadingIndex(-1);
                          try {
                            const publicUrl = await uploadToR2(file);
                            setData((prev) => {
                              if (!prev) return prev;
                              const isProduct = activePage !== 'home' && activePage !== 'tailored';
                              const arr = isProduct
                                ? [...(prev.products?.[activePage]?.images || [])]
                                : [...(prev.images || [])];

                              arr.push(publicUrl);

                              if (isProduct) {
                                const products = { ...prev.products };
                                products[activePage] = { ...(products[activePage] || {}), images: arr };
                                return { ...prev, products };
                              } else {
                                return { ...prev, images: arr };
                              }
                            });
                            setStatus('UPLOAD COMPLETE ✓');
                            setTimeout(() => setStatus(''), 3000);
                          } catch (err: any) {
                            setStatus('UPLOAD ERROR: ' + err.message);
                            alert('Upload failed: ' + err.message);
                          } finally {
                            setUploadingIndex(null);
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            )}

          </section>

        </main>
      </div>
    </div >
  );
}












