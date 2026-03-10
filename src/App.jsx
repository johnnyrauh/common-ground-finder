import React, { useState, useEffect, useRef } from 'react';

// ─── Constants ──────────────────────────────────────────────────────

const C = {
  bg: '#0d0d0f',
  surface: '#1a1a1e',
  surfaceLight: '#252529',
  border: '#2a2a2e',
  gold: '#e8b84b',
  goldDim: 'rgba(232, 184, 75, 0.12)',
  text: '#e8e6e1',
  textMuted: '#8a8a8e',
  dem: '#4a8ff5',
  ind: '#a0a0a0',
  rep: '#f5604a',
  green: '#4caf50',
  amber: '#ff9800',
  red: '#f44336',
};

const FONT = {
  heading: "'Playfair Display', Georgia, serif",
  body: "'DM Sans', system-ui, sans-serif",
};

const TOPICS = [
  { emoji: '🌎', label: 'Immigration' },
  { emoji: '🔫', label: 'Gun Control' },
  { emoji: '🏥', label: 'Healthcare' },
  { emoji: '🌡️', label: 'Climate Change' },
  { emoji: '⚖️', label: 'Abortion Rights' },
  { emoji: '💰', label: 'Economy & Taxes' },
  { emoji: '🔒', label: 'Criminal Justice' },
  { emoji: '🎓', label: 'Education' },
  { emoji: '💬', label: 'Social Media & Free Speech' },
  { emoji: '💊', label: 'Drug Policy' },
  { emoji: '🗳️', label: 'Voting Rights' },
  { emoji: '🌐', label: 'Foreign Policy' },
];

const PARTIES = [
  { id: 'Democrat', color: C.dem },
  { id: 'Independent', color: C.ind },
  { id: 'Republican', color: C.rep },
];

const SYSTEM_PROMPT = `You are a rigorous, non-partisan political analyst. Your goal is to help Americans find common ground by presenting balanced, steelmanned perspectives on political issues.

When given a political topic and optionally a user's political party, provide a structured analysis. Return ONLY valid JSON with these exact keys:

- leftPerspective: array of 3-4 strings (strongest progressive arguments)
- rightPerspective: array of 3-4 strings (strongest conservative arguments)
- commonGround: array of 3-5 strings (specific areas of genuine agreement)
- sharedValues: array of 4-6 strings (deeper human values motivating both sides)
- keyDataPoints: array of 3-4 strings (verifiable statistics both sides should acknowledge)
- personalizedInsight: string or null (only if party provided — what the other side genuinely believes and why, written for someone of this party)
- overlapScore: number 0-100 (how much genuine overlap exists on this topic)

Be analytical, data-driven, and scrupulously fair. Never strawman either side.`;

// ─── Style helpers ──────────────────────────────────────────────────

const sectionLabel = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '2.5px',
  fontFamily: FONT.body,
  color: C.gold,
  margin: 0,
};

const getScoreColor = (score) => {
  if (score <= 34) return C.red;
  if (score <= 59) return C.amber;
  return C.green;
};

const getPartyColor = (party) => {
  const p = PARTIES.find((x) => x.id === party);
  return p ? p.color : C.gold;
};

// ─── Main Component ─────────────────────────────────────────────────

export default function CommonGroundFinder() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [customTopic, setCustomTopic] = useState('');
  const [selectedParty, setSelectedParty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);
  const resultsRef = useRef(null);

  const activeTopic = customTopic.trim() || selectedTopic;

  // Load Google Fonts and inject keyframe animations
  useEffect(() => {
    if (!document.getElementById('cgf-fonts')) {
      const link = document.createElement('link');
      link.id = 'cgf-fonts';
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@400;500;700&display=swap';
      document.head.appendChild(link);
    }
    if (!document.getElementById('cgf-keyframes')) {
      const style = document.createElement('style');
      style.id = 'cgf-keyframes';
      style.textContent = `
        @keyframes cgf-dot{0%,80%,100%{opacity:.25;transform:scale(.85)}40%{opacity:1;transform:scale(1.15)}}
        @keyframes cgf-fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes cgf-grow{from{width:0}to{width:var(--target-width)}}
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Scroll to results when they appear
  useEffect(() => {
    if (results && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [results]);

  // ── Handlers ────────────────────────────────────────────────────

  const handleTopicClick = (label) => {
    setCustomTopic('');
    setSelectedTopic((prev) => (prev === label ? null : label));
  };

  const handleAnalyze = async () => {
    if (!activeTopic) return;
    setLoading(true);
    setError(null);
    setResults(null);

    let userMsg = `Analyze this political topic: '${activeTopic}'`;
    if (selectedParty) userMsg += `. The user identifies as: ${selectedParty}`;
    userMsg += '. Return ONLY valid JSON, no markdown, no preamble.';

    try {
      const apiKey =
        (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ANTHROPIC_API_KEY) || '';

      const headers = {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      };
      if (apiKey) headers['x-api-key'] = apiKey;

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMsg }],
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`API ${res.status}: ${errBody.slice(0, 200)}`);
      }

      const data = await res.json();
      const raw = data.content?.[0]?.text || '';
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);

      if (!parsed.commonGround || !parsed.leftPerspective) {
        throw new Error('Unexpected response shape from API');
      }

      setResults(parsed);
      setActiveTab(0);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedTopic(null);
    setCustomTopic('');
    setSelectedParty(null);
    setResults(null);
    setError(null);
    setActiveTab(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Tab definitions ─────────────────────────────────────────────

  const tabs = ['Perspectives', 'Common Ground', 'Key Data'];
  if (results?.personalizedInsight) tabs.push('Your Insight');

  // ── Render ──────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.bg,
        color: C.text,
        fontFamily: FONT.body,
        lineHeight: 1.6,
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* ── Header ──────────────────────────────────────────── */}
        <header style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ ...sectionLabel, color: C.textMuted, marginBottom: 16 }}>
            Nonpartisan Analysis Tool
          </p>
          <h1
            style={{
              fontFamily: FONT.heading,
              fontSize: 'clamp(32px, 6vw, 52px)',
              fontWeight: 900,
              margin: '0 0 12px',
              letterSpacing: '-0.5px',
              lineHeight: 1.1,
            }}
          >
            Common Ground Finder
          </h1>
          <p
            style={{
              color: C.textMuted,
              fontSize: 17,
              margin: '0 auto',
              maxWidth: 480,
            }}
          >
            Discover shared values across the political divide through balanced,
            data-driven analysis.
          </p>
          <div
            style={{
              width: 48,
              height: 3,
              background: C.gold,
              margin: '28px auto 0',
              borderRadius: 2,
            }}
          />
        </header>

        {/* ── Input Flow ──────────────────────────────────────── */}
        {!results && !loading && (
          <div style={{ animation: 'cgf-fadeUp 0.5s ease-out' }}>
            {/* Step 01 — Topic */}
            <section style={{ marginBottom: 48 }}>
              <StepLabel number={1} text="Choose a Topic" />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                  gap: 12,
                }}
              >
                {TOPICS.map((t) => {
                  const active = !customTopic.trim() && selectedTopic === t.label;
                  return (
                    <button
                      key={t.label}
                      onClick={() => handleTopicClick(t.label)}
                      style={{
                        background: active ? C.goldDim : C.surface,
                        border: `1.5px solid ${active ? C.gold : C.border}`,
                        borderRadius: 10,
                        padding: '18px 10px 14px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease',
                        outline: 'none',
                      }}
                    >
                      <div style={{ fontSize: 26, marginBottom: 6 }}>{t.emoji}</div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: active ? C.gold : C.text,
                          fontFamily: FONT.body,
                          lineHeight: 1.3,
                        }}
                      >
                        {t.label}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div style={{ marginTop: 16 }}>
                <input
                  type="text"
                  placeholder="Or type a custom topic..."
                  value={customTopic}
                  onChange={(e) => {
                    setCustomTopic(e.target.value);
                    if (e.target.value.trim()) setSelectedTopic(null);
                  }}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '14px 18px',
                    background: C.surface,
                    border: `1.5px solid ${customTopic.trim() ? C.gold : C.border}`,
                    borderRadius: 10,
                    color: C.text,
                    fontSize: 15,
                    fontFamily: FONT.body,
                    outline: 'none',
                    transition: 'border-color 0.15s ease',
                  }}
                />
              </div>
            </section>

            {/* Step 02 — Party */}
            <section style={{ marginBottom: 48 }}>
              <StepLabel number={2} text="Select Your Party" optional />
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                {PARTIES.map((p) => {
                  const active = selectedParty === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() =>
                        setSelectedParty((prev) => (prev === p.id ? null : p.id))
                      }
                      style={{
                        padding: '14px 36px',
                        borderRadius: 999,
                        border: `2px solid ${p.color}`,
                        background: active ? p.color : 'transparent',
                        color: active ? '#fff' : p.color,
                        fontSize: 16,
                        fontWeight: 700,
                        fontFamily: FONT.body,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        outline: 'none',
                        minWidth: 160,
                      }}
                    >
                      {p.id}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Step 03 — Analyze */}
            <section>
              <StepLabel number={3} text="Analyze" />
              <button
                onClick={handleAnalyze}
                disabled={!activeTopic}
                style={{
                  display: 'block',
                  width: '100%',
                  maxWidth: 420,
                  margin: '0 auto',
                  padding: '18px 32px',
                  background: activeTopic ? C.gold : C.surfaceLight,
                  color: activeTopic ? C.bg : C.textMuted,
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: FONT.body,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  cursor: activeTopic ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease',
                  opacity: activeTopic ? 1 : 0.5,
                }}
              >
                Find Common Ground
              </button>
            </section>
          </div>
        )}

        {/* ── Loading State ───────────────────────────────────── */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: C.gold,
                    animation: `cgf-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
            <p style={{ marginTop: 28, color: C.textMuted, fontSize: 16 }}>
              Analyzing perspectives on{' '}
              <span style={{ color: C.gold, fontWeight: 600 }}>{activeTopic}</span>
              ...
            </p>
          </div>
        )}

        {/* ── Error State ─────────────────────────────────────── */}
        {error && (
          <div
            style={{
              textAlign: 'center',
              padding: 32,
              background: 'rgba(244,67,54,0.08)',
              border: `1px solid rgba(244,67,54,0.25)`,
              borderRadius: 10,
              marginTop: 32,
            }}
          >
            <p style={{ color: C.red, margin: '0 0 20px', fontSize: 15 }}>{error}</p>
            <button
              onClick={handleReset}
              style={{
                padding: '10px 28px',
                background: 'transparent',
                color: C.text,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                fontSize: 14,
                fontFamily: FONT.body,
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── Results ─────────────────────────────────────────── */}
        {results && (
          <div ref={resultsRef} style={{ animation: 'cgf-fadeUp 0.6s ease-out' }}>
            {/* Topic label */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <p style={{ ...sectionLabel, color: C.textMuted, marginBottom: 8 }}>
                Analysis
              </p>
              <h2
                style={{
                  fontFamily: FONT.heading,
                  fontSize: 28,
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                {activeTopic}
              </h2>
            </div>

            {/* Score Bar */}
            <ScoreBar score={results.overlapScore} />

            {/* Tab Bar */}
            <div
              style={{
                display: 'flex',
                borderBottom: `1px solid ${C.border}`,
                marginTop: 36,
                overflowX: 'auto',
              }}
            >
              {tabs.map((label, i) => (
                <button
                  key={label}
                  onClick={() => setActiveTab(i)}
                  style={{
                    padding: '14px 24px',
                    background: 'none',
                    border: 'none',
                    borderBottom: `2.5px solid ${
                      activeTab === i ? C.gold : 'transparent'
                    }`,
                    color: activeTab === i ? C.gold : C.textMuted,
                    fontFamily: FONT.body,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                    outline: 'none',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div
              key={activeTab}
              style={{ marginTop: 28, animation: 'cgf-fadeUp 0.35s ease-out' }}
            >
              {activeTab === 0 && <PerspectivesTab data={results} />}
              {activeTab === 1 && <CommonGroundTab data={results} />}
              {activeTab === 2 && <KeyDataTab data={results} />}
              {activeTab === 3 && results.personalizedInsight && (
                <InsightTab data={results} party={selectedParty} />
              )}
            </div>

            {/* Reset */}
            <button
              onClick={handleReset}
              style={{
                display: 'block',
                margin: '56px auto 0',
                padding: '14px 36px',
                background: 'transparent',
                color: C.gold,
                border: `1.5px solid ${C.gold}`,
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                fontFamily: FONT.body,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'opacity 0.15s ease',
              }}
            >
              Analyze Another Topic
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────

function StepLabel({ number, text, optional }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
      }}
    >
      <span style={{ ...sectionLabel, fontSize: 13, color: C.gold }}>
        {String(number).padStart(2, '0')}
      </span>
      <span
        style={{
          ...sectionLabel,
          fontSize: 11,
          color: C.textMuted,
        }}
      >
        &mdash; {text}
      </span>
      {optional && (
        <span
          style={{
            fontSize: 10,
            color: C.textMuted,
            fontFamily: FONT.body,
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            opacity: 0.6,
          }}
        >
          Optional
        </span>
      )}
    </div>
  );
}

function ScoreBar({ score }) {
  const color = getScoreColor(score);
  return (
    <div
      style={{
        background: C.surface,
        borderRadius: 12,
        padding: '24px 28px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 14,
        }}
      >
        <span style={{ ...sectionLabel, color: C.textMuted }}>
          Common Ground Score
        </span>
        <span
          style={{
            fontFamily: FONT.heading,
            fontSize: 36,
            fontWeight: 900,
            color,
            lineHeight: 1,
          }}
        >
          {score}
        </span>
      </div>
      <div
        style={{
          height: 8,
          background: C.surfaceLight,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: '100%',
            background: color,
            borderRadius: 4,
            transition: 'width 1s ease-out',
          }}
        />
      </div>
    </div>
  );
}

function PerspectivesTab({ data }) {
  return (
    <div>
      {/* Two columns */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {/* Left */}
        <div
          style={{
            flex: 1,
            minWidth: 280,
            borderTop: `3px solid ${C.dem}`,
            background: C.surface,
            borderRadius: '0 0 10px 10px',
            padding: '24px 22px',
          }}
        >
          <h3
            style={{
              ...sectionLabel,
              color: C.dem,
              fontSize: 11,
              marginBottom: 18,
            }}
          >
            Left Perspective
          </h3>
          {data.leftPerspective.map((p, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 10,
                marginBottom: 14,
                fontSize: 14,
                color: C.text,
                lineHeight: 1.55,
              }}
            >
              <span style={{ color: C.dem, flexShrink: 0, fontWeight: 700 }}>
                &bull;
              </span>
              <span>{p}</span>
            </div>
          ))}
        </div>

        {/* Right */}
        <div
          style={{
            flex: 1,
            minWidth: 280,
            borderTop: `3px solid ${C.rep}`,
            background: C.surface,
            borderRadius: '0 0 10px 10px',
            padding: '24px 22px',
          }}
        >
          <h3
            style={{
              ...sectionLabel,
              color: C.rep,
              fontSize: 11,
              marginBottom: 18,
            }}
          >
            Right Perspective
          </h3>
          {data.rightPerspective.map((p, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 10,
                marginBottom: 14,
                fontSize: 14,
                color: C.text,
                lineHeight: 1.55,
              }}
            >
              <span style={{ color: C.rep, flexShrink: 0, fontWeight: 700 }}>
                &bull;
              </span>
              <span>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Values tag cloud */}
      <div style={{ marginTop: 32 }}>
        <h3 style={{ ...sectionLabel, color: C.textMuted, marginBottom: 16 }}>
          Shared Human Values
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {data.sharedValues.map((v, i) => (
            <span
              key={i}
              style={{
                padding: '9px 20px',
                borderRadius: 999,
                border: `1px solid ${C.gold}`,
                color: C.gold,
                fontSize: 13,
                fontWeight: 500,
                fontFamily: FONT.body,
                background: C.goldDim,
              }}
            >
              {v}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CommonGroundTab({ data }) {
  return (
    <div>
      <h3 style={{ ...sectionLabel, color: C.textMuted, marginBottom: 24 }}>
        Areas of Agreement
      </h3>
      {data.commonGround.map((point, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'flex-start',
            marginBottom: 20,
            padding: '20px 22px',
            background: C.surface,
            borderRadius: 10,
            borderLeft: `3px solid ${C.gold}`,
          }}
        >
          <span
            style={{
              fontFamily: FONT.heading,
              fontSize: 22,
              fontWeight: 900,
              color: C.gold,
              lineHeight: 1,
              flexShrink: 0,
              minWidth: 32,
            }}
          >
            {String(i + 1).padStart(2, '0')}
          </span>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: C.text }}>
            {point}
          </p>
        </div>
      ))}
    </div>
  );
}

function KeyDataTab({ data }) {
  return (
    <div>
      <h3 style={{ ...sectionLabel, color: C.textMuted, marginBottom: 24 }}>
        Key Data Points
      </h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {data.keyDataPoints.map((point, i) => (
          <div
            key={i}
            style={{
              background: C.surface,
              padding: '22px 20px',
              borderRadius: 10,
              borderTop: `2px solid ${C.gold}`,
            }}
          >
            <div
              style={{
                ...sectionLabel,
                fontSize: 10,
                color: C.gold,
                marginBottom: 12,
              }}
            >
              Data Point {String(i + 1).padStart(2, '0')}
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: C.text }}>
              {point}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function InsightTab({ data, party }) {
  const color = getPartyColor(party);
  return (
    <div>
      <h3 style={{ ...sectionLabel, color: C.textMuted, marginBottom: 24 }}>
        Personalized Insight
        {party && (
          <span
            style={{
              marginLeft: 12,
              padding: '3px 10px',
              borderRadius: 999,
              background: color,
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              verticalAlign: 'middle',
              letterSpacing: '1px',
            }}
          >
            {party}
          </span>
        )}
      </h3>
      <div
        style={{
          borderLeft: `4px solid ${color}`,
          padding: '22px 26px',
          background: C.surface,
          borderRadius: '0 10px 10px 0',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 15,
            lineHeight: 1.7,
            color: C.text,
          }}
        >
          {data.personalizedInsight}
        </p>
      </div>
    </div>
  );
}
