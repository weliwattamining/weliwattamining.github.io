// tweaks-app.jsx — Weliwatta Mining Co. tweaks
// Mounts the TweaksPanel and applies live edits to the static page via
// CSS custom properties + body classes.

const FONT_STACKS = {
  Cormorant: '"Cormorant Garamond", "Times New Roman", serif',
  Playfair: '"Playfair Display", "Times New Roman", serif',
  EBGaramond: '"EB Garamond", "Times New Roman", serif',
  DMSerif: '"DM Serif Display", "Times New Roman", serif',
};

const FONT_GOOGLE = {
  Cormorant: 'Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400',
  Playfair: 'Playfair+Display:ital,wght@0,400;0,500;0,600;1,400',
  EBGaramond: 'EB+Garamond:ital,wght@0,400;0,500;0,600;1,400',
  DMSerif: 'DM+Serif+Display:ital,wght@0,400;1,400',
};

const DENSITY_PAD = {
  Spacious: { pad: 'clamp(96px, 13vw, 180px)', heroPad: 160 },
  Standard: { pad: 'clamp(80px, 11vw, 160px)', heroPad: 140 },
  Compact:  { pad: 'clamp(56px, 7vw, 96px)',   heroPad: 110 },
};

const ACCENT_OPTIONS = [
  ['#BFA46F', '#C9B383'],        // champagne gold (default)
  ['#1E6FA8', '#2C8AC9'],        // sapphire blue
  ['#C7BBA4', '#D7CCB8'],        // ivory bone
  ['#9A6B45', '#B68660'],        // earth clay
];

function ensureFont(family) {
  const id = 'twk-font-' + family;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${FONT_GOOGLE[family]}&display=swap`;
  document.head.appendChild(link);
}

function App() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  const r = document.documentElement;
  const body = document.body;

  // ── Accent palette ────────────────────────────────────
  React.useEffect(() => {
    const [g, gs] = t.accent;
    r.style.setProperty('--gold', g);
    r.style.setProperty('--gold-soft', gs);
  }, [t.accent]);

  // ── Display serif ─────────────────────────────────────
  React.useEffect(() => {
    ensureFont(t.serif);
    r.style.setProperty('--serif', FONT_STACKS[t.serif]);
  }, [t.serif]);

  // ── Density ───────────────────────────────────────────
  React.useEffect(() => {
    const d = DENSITY_PAD[t.density];
    document.querySelectorAll('.pad-y').forEach(el => {
      el.style.paddingTop = d.pad;
      el.style.paddingBottom = d.pad;
    });
    const heroInner = document.querySelector('.hero-inner');
    if (heroInner) heroInner.style.paddingTop = d.heroPad + 'px';
  }, [t.density]);

  // ── Hero italic emphasis ──────────────────────────────
  React.useEffect(() => {
    const h1 = document.querySelector('.hero h1');
    if (!h1) return;
    h1.style.fontStyle = t.heroItalic ? 'italic' : 'normal';
    const emph = h1.querySelector('.emph');
    if (emph) emph.style.fontStyle = t.heroItalic ? 'normal' : 'italic';
  }, [t.heroItalic]);

  // ── Hero headline copy ────────────────────────────────
  React.useEffect(() => {
    const h1 = document.querySelector('.hero h1');
    if (!h1) return;
    const parts = t.heroHeadline.split('|');
    const [a, b, c] = [parts[0] || '', parts[1] || '', parts[2] || ''];
    h1.innerHTML = `${a}<br/>${b.replace(/\{(.+?)\}/g, '<span class="emph">$1</span>')}<br/>${c}`;
    // re-apply italic state since innerHTML wiped inline style on .emph
    const emph = h1.querySelector('.emph');
    if (emph) emph.style.fontStyle = t.heroItalic ? 'normal' : 'italic';
  }, [t.heroHeadline, t.heroItalic]);

  // ── Trust strip visibility ────────────────────────────
  React.useEffect(() => {
    const el = document.querySelector('.trust');
    if (el) el.style.display = t.showTrust ? '' : 'none';
  }, [t.showTrust]);

  // ── Editorial bg tone ─────────────────────────────────
  React.useEffect(() => {
    const tones = {
      'Warm Ivory': '#F7F2EA',
      'Cool Mist':  '#EFEFEA',
      'Putty':      '#EDE4D3',
    };
    r.style.setProperty('--ivory', tones[t.ivoryTone]);
  }, [t.ivoryTone]);

  // ── Hero motion intensity ────────────────────────────
  React.useEffect(() => {
    const map = { Off: [0, 0], Subtle: [0.6, 0], Cinematic: [1, 0] };
    const [motion, _] = map[t.heroMotion];
    r.style.setProperty('--hero-motion-opacity', motion);
  }, [t.heroMotion]);

  // ── Hero video src ───────────────────────────────
  React.useEffect(() => {
    const v = document.getElementById('hero-video');
    if (!v) return;
    if (t.heroVideoUrl && t.heroVideoUrl.trim()) {
      v.src = t.heroVideoUrl.trim();
      v.setAttribute('data-src', t.heroVideoUrl.trim());
      v.style.display = '';
      r.style.setProperty('--hero-video-opacity', '0.6');
      v.load();
      v.play().catch(() => {});
    } else {
      v.removeAttribute('src');
      v.setAttribute('data-src', '');
      r.style.setProperty('--hero-video-opacity', '0');
    }
  }, [t.heroVideoUrl]);

  return (
    <TweaksPanel title="Tweaks · Weliwatta">
      <TweakSection label="Accent" />
      <TweakColor
        label="Accent palette"
        value={t.accent}
        options={ACCENT_OPTIONS}
        onChange={(v) => setTweak('accent', v)}
      />

      <TweakSection label="Typography" />
      <TweakSelect
        label="Display serif"
        value={t.serif}
        options={['Cormorant', 'Playfair', 'EBGaramond', 'DMSerif']}
        onChange={(v) => setTweak('serif', v)}
      />
      <TweakToggle
        label="Hero in italic"
        value={t.heroItalic}
        onChange={(v) => setTweak('heroItalic', v)}
      />

      <TweakSection label="Hero copy" />
      <TweakText
        label="Headline (use | for line breaks, { } around emphasis)"
        value={t.heroHeadline}
        onChange={(v) => setTweak('heroHeadline', v)}
      />

      <TweakSection label="Hero motion" />
      <TweakRadio
        label="Motion intensity"
        value={t.heroMotion}
        options={['Off', 'Subtle', 'Cinematic']}
        onChange={(v) => setTweak('heroMotion', v)}
      />
      <TweakText
        label="Hero video URL (mp4)"
        value={t.heroVideoUrl}
        onChange={(v) => setTweak('heroVideoUrl', v)}
      />

      <TweakSection label="Layout" />
      <TweakRadio
        label="Density"
        value={t.density}
        options={['Compact', 'Standard', 'Spacious']}
        onChange={(v) => setTweak('density', v)}
      />
      <TweakSelect
        label="Editorial bg"
        value={t.ivoryTone}
        options={['Warm Ivory', 'Cool Mist', 'Putty']}
        onChange={(v) => setTweak('ivoryTone', v)}
      />
      <TweakToggle
        label="Trust strip"
        value={t.showTrust}
        onChange={(v) => setTweak('showTrust', v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<App />);
