'use client';

import React, { useEffect, useState, useMemo } from 'react';
import type { SvanthamData, ModuleItem, DashboardViewItem, DeploymentCardItem } from '@/lib/get-data';

export default function AdminPage() {
  const [data, setData] = useState<SvanthamData | null>(null);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [activeSectionFilter, setActiveSectionFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'modules' | 'dashboard' | 'deployment' | 'ticker'>('modules');
  const [loaded, setLoaded] = useState(false);
  const [pin, setPin] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

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
        .catch(() => {});
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
      const res = await fetch('/api/save-all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${pin}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus('SAVED SUCCESSFULLY ✓');
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
      return {
        ...prev,
        content: { ...prev.content, [key]: value },
      };
    });
  };

  const filteredKeys = useMemo(() => {
    if (!data?.content) return [];
    const keys = Object.keys(data.content);

    return keys.filter((k) => {
      const val = String(data.content[k] || '');
      const matchesSearch =
        search.trim() === '' ||
        k.toLowerCase().includes(search.toLowerCase()) ||
        val.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (activeSectionFilter === 'all') return true;
      if (activeSectionFilter === 'hero' && (k.startsWith('hero_') || k.startsWith('nav_'))) return true;
      if (activeSectionFilter === 'cost' && (k.startsWith('cost_') || k.startsWith('saas_') || k.startsWith('svantham_') || k.startsWith('saving_'))) return true;
      if (activeSectionFilter === 'suite' && k.startsWith('suite_')) return true;
      if (activeSectionFilter === 'deployment' && (k.startsWith('deployment_') || k.startsWith('contact_'))) return true;
      if (activeSectionFilter === 'footer' && k.startsWith('footer_')) return true;

      return false;
    });
  }, [data?.content, search, activeSectionFilter]);

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
        code: `0${prev.modules.length + 1}`,
        name: 'New Module',
        eyebrow: 'Operations',
        description: 'Description of the new module.',
        context: 'Operational context and advantages.',
        features: ['Feature 01', 'Feature 02', 'Feature 03'],
        tags: ['OFFLINE-FIRST', 'FIXED COST'],
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

  // Cloudflare R2 Upload
  const handleR2Upload = async (file: File, moduleIndex: number) => {
    setUploadingIndex(moduleIndex);
    setStatus('REQUESTING R2 PRESIGNED URL...');
    try {
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${pin}`,
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to obtain presigned URL');
      }

      setStatus('UPLOADING DIRECTLY TO R2...');
      const uploadRes = await fetch(resData.presignedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error('Upload to Cloudflare R2 failed');
      }

      updateModule(moduleIndex, 'image', resData.publicUrl);
      setStatus('UPLOAD COMPLETE ✓');
      setTimeout(() => setStatus(''), 3000);
    } catch (err: any) {
      console.error(err);
      setStatus('UPLOAD ERROR: ' + err.message);
      alert('Upload failed: ' + err.message);
    } finally {
      setUploadingIndex(null);
    }
  };

  // Dashboard views helpers
  const updateDashboardView = (index: number, key: string, value: any) => {
    setData((prev) => {
      if (!prev) return prev;
      const updated = [...prev.dashboardViews];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, dashboardViews: updated };
    });
  };

  const updateDashboardMetric = (viewIdx: number, metricKey: 'metric1' | 'metric2', field: 'label' | 'val' | 'sub', value: string) => {
    setData((prev) => {
      if (!prev) return prev;
      const updated = [...prev.dashboardViews];
      updated[viewIdx] = {
        ...updated[viewIdx],
        [metricKey]: {
          ...updated[viewIdx][metricKey],
          [field]: value,
        },
      };
      return { ...prev, dashboardViews: updated };
    });
  };

  const updateDashboardActivity = (viewIdx: number, actKey: 'activity1' | 'activity2', field: 'title' | 'subtitle', value: string) => {
    setData((prev) => {
      if (!prev) return prev;
      const updated = [...prev.dashboardViews];
      updated[viewIdx] = {
        ...updated[viewIdx],
        [actKey]: {
          ...updated[viewIdx][actKey],
          [field]: value,
        },
      };
      return { ...prev, dashboardViews: updated };
    });
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
          <div className="flex items-center gap-2 tracking-[.2em] font-mono text-xs text-[#b8ef3e] font-bold uppercase">
            <span className="inline-block w-2 h-2 rounded-full bg-[#b8ef3e] animate-pulse" /> SVANTHAM CMS
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Admin Control Room</h1>
          <p className="text-xs text-white/50 mb-2">Enter 4-digit PIN to authenticate and edit content</p>
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
    <div className="min-h-screen bg-[#0c0e16] text-[#f4f2ec] pb-24 selection:bg-[#b8ef3e] selection:text-[#0c0e16]">
      <div className="mx-auto max-w-[1440px] px-5 pt-10 sm:px-8 lg:px-12">
        {/* Top Header */}
        <header className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-[0.18em] text-[#b8ef3e]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#b8ef3e]" />
              UPSTASH REDIS SYNCED
            </div>
            <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-[-0.05em] text-white">Svantham Admin</h1>
          </div>
          <div className="flex items-center flex-wrap gap-4">
            {status && (
              <span className="text-xs font-mono font-bold tracking-[.14em] text-[#b8ef3e] bg-[#b8ef3e]/10 px-3 py-1.5 rounded-full border border-[#b8ef3e]/20">
                {status}
              </span>
            )}
            <button
              type="button"
              onClick={save}
              className="rounded-full bg-[#b8ef3e] px-6 py-3 text-xs font-mono font-black tracking-[.14em] text-[#161714] transition hover:bg-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(184,239,62,0.3)]"
            >
              SAVE CHANGES
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/20 px-5 py-3 text-xs font-mono font-bold tracking-[0.12em] transition hover:border-[#b8ef3e] hover:text-[#b8ef3e]"
            >
              VIEW SITE ↗
            </a>
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem('svantham_admin_pin');
                setAuthenticated(false);
                setPin('');
              }}
              className="rounded-full border border-white/10 px-4 py-3 text-xs font-mono text-white/50 hover:text-white transition"
              title="Lock Admin"
            >
              LOCK
            </button>
          </div>
        </header>

        {/* Two-Column Editor Layout */}
        <main className="grid gap-10 lg:grid-cols-[1.1fr_1.4fr] items-start">
          {/* Left Column: Content Dictionary */}
          <section className="rounded-3xl bg-[#12141c] p-6 sm:p-8 border border-white/10 lg:sticky lg:top-8 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-xs font-mono font-bold tracking-[0.18em] text-[#b8ef3e]">CONTENT DICTIONARY</h2>
              <span className="text-[10px] font-mono text-white/40">{filteredKeys.length} keys</span>
            </div>

            {/* Quick Section Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['all', 'hero', 'cost', 'suite', 'deployment', 'footer'].map((sec) => (
                <button
                  type="button"
                  key={sec}
                  onClick={() => setActiveSectionFilter(sec)}
                  className={`text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full border transition ${
                    activeSectionFilter === sec
                      ? 'border-[#b8ef3e] bg-[#b8ef3e]/15 text-[#b8ef3e]'
                      : 'border-white/10 text-white/50 hover:text-white'
                  }`}
                >
                  {sec}
                </button>
              ))}
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
                const val = data.content[key] || '';
                const isLong = val.length > 70 || val.includes('\n');
                return (
                  <div key={key} className="group">
                    <label className="block text-[10px] font-mono font-bold tracking-[.14em] text-white/40 group-focus-within:text-[#b8ef3e] uppercase mb-1.5 transition">
                      {key}
                    </label>
                    {isLong ? (
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
            <div className="flex items-center justify-between flex-wrap gap-4 mb-8 border-b border-white/10 pb-4">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('modules')}
                  className={`text-[11px] font-mono font-bold tracking-[0.16em] uppercase pb-1 transition ${
                    activeTab === 'modules' ? 'text-[#b8ef3e] border-b-2 border-[#b8ef3e]' : 'text-white/40 hover:text-white'
                  }`}
                >
                  MODULES ({data.modules.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className={`text-[11px] font-mono font-bold tracking-[0.16em] uppercase pb-1 transition ${
                    activeTab === 'dashboard' ? 'text-[#b8ef3e] border-b-2 border-[#b8ef3e]' : 'text-white/40 hover:text-white'
                  }`}
                >
                  DASHBOARD ({data.dashboardViews.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('deployment')}
                  className={`text-[11px] font-mono font-bold tracking-[0.16em] uppercase pb-1 transition ${
                    activeTab === 'deployment' ? 'text-[#b8ef3e] border-b-2 border-[#b8ef3e]' : 'text-white/40 hover:text-white'
                  }`}
                >
                  DEPLOYMENT ({data.deploymentCards.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('ticker')}
                  className={`text-[11px] font-mono font-bold tracking-[0.16em] uppercase pb-1 transition ${
                    activeTab === 'ticker' ? 'text-[#b8ef3e] border-b-2 border-[#b8ef3e]' : 'text-white/40 hover:text-white'
                  }`}
                >
                  TICKER ({data.ticker.length})
                </button>
              </div>

              {activeTab === 'modules' && (
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
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-white/10 text-[#b8ef3e]">
                          {mod.code}
                        </span>
                        <input
                          type="text"
                          value={mod.name}
                          onChange={(e) => updateModule(idx, 'name', e.target.value)}
                          className="font-bold text-xl bg-transparent outline-none border-b border-transparent focus:border-[#b8ef3e] text-white"
                          placeholder="Module Name"
                        />
                      </div>
                      <div className="flex items-center gap-1">
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Code</label>
                        <input
                          type="text"
                          value={mod.code}
                          onChange={(e) => updateModule(idx, 'code', e.target.value)}
                          className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-[#b8ef3e]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Eyebrow / Category</label>
                        <input
                          type="text"
                          value={mod.eyebrow}
                          onChange={(e) => updateModule(idx, 'eyebrow', e.target.value)}
                          className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-[#b8ef3e]"
                        />
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

                    <div>
                      <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Deep Dive Context (Dossier)</label>
                      <textarea
                        value={mod.context || ''}
                        onChange={(e) => updateModule(idx, 'context', e.target.value)}
                        rows={2}
                        className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs outline-none focus:border-[#b8ef3e] resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Features (one per line)</label>
                      <textarea
                        value={(mod.features || []).join('\n')}
                        onChange={(e) => updateModule(idx, 'features', e.target.value.split('\n'))}
                        rows={3}
                        className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs font-mono outline-none focus:border-[#b8ef3e]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={(mod.tags || []).join(', ')}
                        onChange={(e) =>
                          updateModule(
                            idx,
                            'tags',
                            e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                          )
                        }
                        className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2.5 text-xs font-mono outline-none focus:border-[#b8ef3e]"
                      />
                    </div>

                    {/* Accent selection */}
                    <div className="flex items-center gap-4">
                      <label className="text-[10px] font-mono text-white/40 uppercase">Accent Style:</label>
                      {(['chartreuse', 'coral', 'ink'] as const).map((acc) => (
                        <button
                          type="button"
                          key={acc}
                          onClick={() => updateModule(idx, 'accent', acc)}
                          className={`text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full border transition ${
                            mod.accent === acc
                              ? 'border-[#b8ef3e] bg-[#b8ef3e]/20 text-[#b8ef3e]'
                              : 'border-white/10 text-white/40'
                          }`}
                        >
                          {acc}
                        </button>
                      ))}
                    </div>

                    {/* Cloudflare R2 Upload Widget */}
                    <div className="border-t border-white/10 pt-4 flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <span className="block text-[10px] font-mono text-white/40 uppercase">R2 Media Asset</span>
                        {mod.image ? (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono text-[#b8ef3e] truncate max-w-[200px]">{mod.image}</span>
                            <button
                              type="button"
                              onClick={() => updateModule(idx, 'image', '')}
                              className="text-[10px] font-mono text-[#ff7059] hover:underline"
                            >
                              remove
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-white/30 mt-1 block">No image uploaded</span>
                        )}
                      </div>
                      <div>
                        <label className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 text-[10px] font-mono font-bold uppercase hover:border-[#b8ef3e] transition">
                          {uploadingIndex === idx ? 'UPLOADING...' : 'UPLOAD TO R2 ↗'}
                          <input
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            disabled={uploadingIndex !== null}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleR2Upload(file, idx);
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: DASHBOARD VIEWS */}
            {activeTab === 'dashboard' && (
              <div className="flex flex-col gap-8">
                {data.dashboardViews.map((dash, vIdx) => (
                  <div key={dash.id || vIdx} className="rounded-2xl bg-[#0c0e16] p-6 border border-white/10 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#b8ef3e] px-2 py-1 rounded bg-[#b8ef3e]/10">
                        VIEW {vIdx + 1}: {dash.tabLabel}
                      </span>
                      <input
                        type="text"
                        value={dash.tabLabel}
                        onChange={(e) => updateDashboardView(vIdx, 'tabLabel', e.target.value)}
                        className="text-xs font-mono bg-transparent border-b border-white/20 focus:border-[#b8ef3e] outline-none text-right"
                        placeholder="Tab Label"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Badge Text</label>
                        <input
                          type="text"
                          value={dash.badge}
                          onChange={(e) => updateDashboardView(vIdx, 'badge', e.target.value)}
                          className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2 text-xs font-mono outline-none focus:border-[#b8ef3e]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Status Dot Text</label>
                        <input
                          type="text"
                          value={dash.statusText}
                          onChange={(e) => updateDashboardView(vIdx, 'statusText', e.target.value)}
                          className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2 text-xs font-mono outline-none focus:border-[#b8ef3e]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Control Room Subtitle</label>
                        <input
                          type="text"
                          value={dash.subtitle}
                          onChange={(e) => updateDashboardView(vIdx, 'subtitle', e.target.value)}
                          className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2 text-xs outline-none focus:border-[#b8ef3e]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Greeting / Main Line</label>
                        <input
                          type="text"
                          value={dash.heading}
                          onChange={(e) => updateDashboardView(vIdx, 'heading', e.target.value)}
                          className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2 text-xs outline-none focus:border-[#b8ef3e]"
                        />
                      </div>
                    </div>

                    {/* Metric 1 & 2 */}
                    <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                      <div className="bg-[#171a25] p-3 rounded-xl border border-white/10 flex flex-col gap-2">
                        <span className="text-[10px] font-mono text-[#b8ef3e] font-bold">METRIC TILE 1</span>
                        <input
                          type="text"
                          value={dash.metric1.label}
                          onChange={(e) => updateDashboardMetric(vIdx, 'metric1', 'label', e.target.value)}
                          placeholder="Label"
                          className="bg-transparent border-b border-white/10 text-xs font-mono outline-none"
                        />
                        <input
                          type="text"
                          value={dash.metric1.val}
                          onChange={(e) => updateDashboardMetric(vIdx, 'metric1', 'val', e.target.value)}
                          placeholder="Value (e.g. 1,284)"
                          className="bg-transparent border-b border-white/10 text-lg font-extrabold outline-none"
                        />
                        <input
                          type="text"
                          value={dash.metric1.sub}
                          onChange={(e) => updateDashboardMetric(vIdx, 'metric1', 'sub', e.target.value)}
                          placeholder="Subtext (+18.4%)"
                          className="bg-transparent text-xs font-mono text-white/60 outline-none"
                        />
                      </div>

                      <div className="bg-[#171a25] p-3 rounded-xl border border-white/10 flex flex-col gap-2">
                        <span className="text-[10px] font-mono text-[#ff7059] font-bold">METRIC TILE 2</span>
                        <input
                          type="text"
                          value={dash.metric2.label}
                          onChange={(e) => updateDashboardMetric(vIdx, 'metric2', 'label', e.target.value)}
                          placeholder="Label"
                          className="bg-transparent border-b border-white/10 text-xs font-mono outline-none"
                        />
                        <input
                          type="text"
                          value={dash.metric2.val}
                          onChange={(e) => updateDashboardMetric(vIdx, 'metric2', 'val', e.target.value)}
                          placeholder="Value (e.g. 48)"
                          className="bg-transparent border-b border-white/10 text-lg font-extrabold outline-none"
                        />
                        <input
                          type="text"
                          value={dash.metric2.sub}
                          onChange={(e) => updateDashboardMetric(vIdx, 'metric2', 'sub', e.target.value)}
                          placeholder="Subtext (12 due today)"
                          className="bg-transparent text-xs font-mono text-white/60 outline-none"
                        />
                      </div>
                    </div>

                    {/* Chart Titles */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Chart Title</label>
                        <input
                          type="text"
                          value={dash.chartTitle}
                          onChange={(e) => updateDashboardView(vIdx, 'chartTitle', e.target.value)}
                          className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2 text-xs font-mono outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-white/40 uppercase mb-1">Chart Legend/Sub</label>
                        <input
                          type="text"
                          value={dash.chartSubtitle}
                          onChange={(e) => updateDashboardView(vIdx, 'chartSubtitle', e.target.value)}
                          className="w-full bg-[#171a25] border border-white/10 rounded-lg p-2 text-xs font-mono outline-none"
                        />
                      </div>
                    </div>

                    {/* Activities */}
                    <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
                      <span className="text-[10px] font-mono text-white/40 uppercase">Activity Feeds</span>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={dash.activity1.title}
                          onChange={(e) => updateDashboardActivity(vIdx, 'activity1', 'title', e.target.value)}
                          className="bg-[#171a25] border border-white/10 p-2 rounded text-xs outline-none"
                          placeholder="Activity 1 title"
                        />
                        <input
                          type="text"
                          value={dash.activity1.subtitle}
                          onChange={(e) => updateDashboardActivity(vIdx, 'activity1', 'subtitle', e.target.value)}
                          className="bg-[#171a25] border border-white/10 p-2 rounded text-xs outline-none text-white/60"
                          placeholder="Activity 1 sub"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={dash.activity2.title}
                          onChange={(e) => updateDashboardActivity(vIdx, 'activity2', 'title', e.target.value)}
                          className="bg-[#171a25] border border-white/10 p-2 rounded text-xs outline-none"
                          placeholder="Activity 2 title"
                        />
                        <input
                          type="text"
                          value={dash.activity2.subtitle}
                          onChange={(e) => updateDashboardActivity(vIdx, 'activity2', 'subtitle', e.target.value)}
                          className="bg-[#171a25] border border-white/10 p-2 rounded text-xs outline-none text-white/60"
                          placeholder="Activity 2 sub"
                        />
                      </div>
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
          </section>
        </main>
      </div>
    </div>
  );
}
