// ================================================================
// PLUGIN FIGMA — Landing Page "Livre Blanc Design Ops" par Maëlyne
// Concept : "La grille qui libère"
// ================================================================

async function run() {

  // ── COULEURS (RGB 0–1) ──────────────────────────────────────────
  const C = {
    bg:     { r: 0.957, g: 0.945, b: 0.925 }, // #F4F1EC crème
    ink:    { r: 0.059, g: 0.059, b: 0.059 }, // #0F0F0F noir profond
    accent: { r: 1.000, g: 0.302, b: 0.110 }, // #FF4D1C orange brûlé
    gray:   { r: 0.608, g: 0.592, b: 0.565 }, // #9B9790 gris secondaire
    dark:   { r: 0.067, g: 0.067, b: 0.067 }, // #111111 fond sombre
    white:  { r: 1.000, g: 1.000, b: 1.000 }, // #FFFFFF blanc
    grid:   { r: 0.886, g: 0.871, b: 0.847 }, // #E2DED8 grille
    light:  { r: 0.925, g: 0.918, b: 0.898 }, // #ECEAE5 fond clair
  };

  // ── POLICES ─────────────────────────────────────────────────────
  const F = {
    serif_bold:   { family: "Playfair Display", style: "Bold" },
    serif_italic: { family: "Playfair Display", style: "Bold Italic" },
    serif_it:     { family: "Playfair Display", style: "Italic" },
    serif_reg:    { family: "Playfair Display", style: "Regular" },
    sans_reg:     { family: "Inter", style: "Regular" },
    sans_med:     { family: "Inter", style: "Medium" },
    sans_semi:    { family: "Inter", style: "SemiBold" },
    sans_light:   { family: "Inter", style: "Light" },
    mono:         { family: "Roboto Mono", style: "Regular" },
  };

  // Préchargement de toutes les polices
  figma.notify("Chargement des polices…", { timeout: 3000 });
  for (const font of Object.values(F)) {
    try { await figma.loadFontAsync(font); } catch (e) { /* ignore */ }
  }
  // Fallback obligatoire
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  // ── HELPERS ─────────────────────────────────────────────────────

  // Fill solide
  const fill = (color, opacity = 1) =>
    [{ type: "SOLID", color, opacity }];

  // Créer un frame-section
  function mkSection(name, w, h, bgColor) {
    const f = figma.createFrame();
    f.name = name;
    f.resize(w, h);
    f.fills = fill(bgColor);
    f.clipsContent = true;
    return f;
  }

  // Créer un rectangle
  function mkRect(w, h, color, opts = {}) {
    const r = figma.createRectangle();
    r.resize(w, h);
    r.fills = color ? fill(color, opts.opacity || 1) : [];
    if (opts.radius) r.cornerRadius = opts.radius;
    if (opts.stroke) {
      r.strokes = [{ type: "SOLID", color: opts.stroke }];
      r.strokeWeight = opts.strokeW || 1;
      r.strokeAlign = "INSIDE";
    }
    return r;
  }

  // Créer un nœud texte
  async function mkText(content, font, size, color, opts = {}) {
    const t = figma.createText();
    let resolvedFont = font;

    try {
      await figma.loadFontAsync(font);
    } catch (e) {
      resolvedFont = { family: "Inter", style: "Regular" };
      await figma.loadFontAsync(resolvedFont);
    }

    t.fontName = resolvedFont;
    t.fontSize = size;
    t.fills = fill(color);

    if (opts.lineHeight) {
      t.lineHeight = { value: opts.lineHeight, unit: "PIXELS" };
    }
    if (opts.letterSpacing !== undefined) {
      t.letterSpacing = { value: opts.letterSpacing, unit: "PERCENT" };
    }
    if (opts.align) {
      t.textAlignHorizontal = opts.align;
    }

    // Largeur fixe + hauteur auto
    if (opts.w) {
      t.textAutoResize = "HEIGHT";
      t.resize(opts.w, 50);
    }

    t.characters = content;

    if (opts.opacity !== undefined) t.opacity = opts.opacity;
    return t;
  }

  // Poser un nœud dans un parent à une position relative
  function put(parent, node, x, y) {
    parent.appendChild(node);
    node.x = x;
    node.y = y;
    return node;
  }

  // ── DIMENSIONS ──────────────────────────────────────────────────
  const W   = 1440;
  const PAD = 80;
  const INN = W - PAD * 2; // 1280px

  const SH = {
    nav:      80,
    hero:     900,
    debat:    660,
    contenu:  780,
    aqui:     500,
    stats:    400,
    tpl:      780,
    bio:      560,
    cta:      440,
    reassure: 460,
    footer:   220,
  };

  const TOTAL = Object.values(SH).reduce((a, b) => a + b, 0);

  // ── FRAME PRINCIPALE ────────────────────────────────────────────
  const PAGE = figma.createFrame();
  PAGE.name = "🖥  Landing Page — Livre Blanc Design Ops";
  PAGE.resize(W, TOTAL);
  PAGE.fills = fill(C.bg);
  PAGE.clipsContent = false;
  figma.currentPage.appendChild(PAGE);

  let Y = 0; // curseur vertical courant

  // ── GRILLE 12 COLONNES (posée en dernier pour être au-dessus) ───
  // Créée ici, ajoutée après toutes les sections
  const GRID_FRAME = figma.createFrame();
  GRID_FRAME.name = "_Grille 12 colonnes (toggle)";
  GRID_FRAME.resize(W, TOTAL);
  GRID_FRAME.fills = [];
  GRID_FRAME.clipsContent = false;

  const COL_W = INN / 12;
  for (let i = 0; i <= 12; i++) {
    const line = mkRect(1, TOTAL, C.grid, { opacity: 0.35 });
    GRID_FRAME.appendChild(line);
    line.x = PAD + i * COL_W;
    line.y = 0;
  }

  // ==============================================================
  // 01 — NAVIGATION
  // ==============================================================
  {
    const S = mkSection("01 · Navigation", W, SH.nav, C.bg);
    put(PAGE, S, 0, Y);

    // Ligne de séparation inférieure
    put(S, mkRect(W, 1, C.grid), 0, SH.nav - 1);

    // Logo
    const logo = await mkText("Maëlyne", F.mono, 13, C.ink, { letterSpacing: 5 });
    put(S, logo, PAD, Math.round((SH.nav - 16) / 2));

    // Liens ghost
    const l1 = await mkText("À propos", F.sans_reg, 14, C.gray);
    put(S, l1, W - PAD - 360, Math.round((SH.nav - 16) / 2));

    const l2 = await mkText("Le livre blanc", F.sans_reg, 14, C.gray);
    put(S, l2, W - PAD - 260, Math.round((SH.nav - 16) / 2));

    // Bouton CTA
    const ctaBg = mkRect(168, 40, C.accent, { radius: 4 });
    put(S, ctaBg, W - PAD - 168, Math.round((SH.nav - 40) / 2));
    const ctaTxt = await mkText("Télécharger →", F.sans_med, 13, C.white);
    put(S, ctaTxt, W - PAD - 148, Math.round((SH.nav - 40) / 2) + 12);

    Y += SH.nav;
  }

  // ==============================================================
  // 02 — HERO
  // ==============================================================
  {
    const S = mkSection("02 · Hero", W, SH.hero, C.bg);
    put(PAGE, S, 0, Y);

    // Texture de fond : "DESIGN OPS" très grand, opacité 4%
    const bgT = await mkText("DESIGN\nOPS", F.serif_bold, 340, C.ink, {
      opacity: 0.04, lineHeight: 300, w: 900
    });
    put(S, bgT, W - 560, 320);

    // Tag label
    const tagBg = mkRect(242, 26, null, { stroke: C.accent, strokeW: 1, radius: 2 });
    put(S, tagBg, PAD, 100);
    const tagTxt = await mkText("LIVRE BLANC · DESIGN OPS · 2025", F.mono, 10, C.accent, { letterSpacing: 2 });
    put(S, tagTxt, PAD + 10, 107);

    // Titre ligne 1 — Playfair Bold
    const t1 = await mkText("LA STRUCTURE,", F.serif_bold, 96, C.ink);
    put(S, t1, PAD, 168);

    // Titre ligne 2 — Inter Light (contraste typographique)
    const t2 = await mkText("C'EST CE QUI REND", F.sans_light, 76, C.ink);
    put(S, t2, PAD, 286);

    // Titre ligne 3 — Playfair Bold Italic, accent
    const t3 = await mkText("LA CRÉATIVITÉ POSSIBLE.", F.serif_italic, 88, C.accent);
    put(S, t3, PAD, 384);

    // Sous-titre
    const sub = await mkText(
      "Un livre blanc pour les designers qui veulent arrêter de choisir\nentre bien travailler et bien créer.",
      F.sans_reg, 18, C.ink, { lineHeight: 32, w: 600, opacity: 0.85 }
    );
    put(S, sub, PAD, 520);

    // CTA principal (rempli)
    const mainBtn = mkRect(272, 54, C.accent, { radius: 4 });
    put(S, mainBtn, PAD, 618);
    const mainBtnTxt = await mkText("↓  Télécharger gratuitement", F.sans_med, 15, C.white);
    put(S, mainBtnTxt, PAD + 24, 634);

    // CTA secondaire (contour)
    const secBtn = mkRect(200, 54, null, { stroke: C.ink, strokeW: 1, radius: 4 });
    put(S, secBtn, PAD + 292, 618);
    const secBtnTxt = await mkText("Voir le contenu →", F.sans_reg, 15, C.ink);
    put(S, secBtnTxt, PAD + 292 + 24, 634);

    // Indicateur de scroll
    const scrollHint = await mkText("↓  scroll", F.mono, 11, C.gray, { letterSpacing: 3 });
    put(S, scrollHint, Math.round(W / 2 - 30), SH.hero - 60);

    // Ligne verticale fine (accent décor)
    const decoLine = mkRect(2, 120, C.accent, { opacity: 0.3 });
    put(S, decoLine, W - PAD - 2, 60);

    Y += SH.hero;
  }

  // ==============================================================
  // 03 — LE DÉBAT
  // ==============================================================
  {
    const S = mkSection("03 · Le Débat", W, SH.debat, C.bg);
    put(PAGE, S, 0, Y);

    // Label section
    const label = await mkText("UNE IDÉE REÇUE QUI COÛTE CHER", F.mono, 11, C.gray, { letterSpacing: 3 });
    put(S, label, PAD, 80);

    // Colonne gauche (58%) : grande citation + barre de strikethrough
    const qColW = Math.round(INN * 0.58);
    const quote = await mkText(
      '"La structure\ntue la créativité."',
      F.serif_italic, 64, C.ink, { lineHeight: 78, w: qColW }
    );
    put(S, quote, PAD, 136);

    // Barre de barrage (strikethrough décoratif)
    const strike = mkRect(qColW - 60, 5, C.accent);
    put(S, strike, PAD, 228);

    // Reformulation
    const reframe = await mkText("Et si c'était l'inverse ?", F.serif_italic, 36, C.accent);
    put(S, reframe, PAD, 310);

    // Colonne droite (38%) : corps de texte
    const rColW = Math.round(INN * 0.38);
    const rColX = PAD + qColW + Math.round(INN * 0.04);
    const body = await mkText(
      "On l'a tous entendu. Parfois même dit. Les templates contraignent. Les process brident. Les design systems transforment les designers en ouvriers de la mise en page.\n\nCe livre blanc creuse l'autre hypothèse : la structure, quand elle est bien pensée, ne limite pas la créativité. Elle en devient le socle.",
      F.sans_reg, 16, C.ink, { lineHeight: 28, w: rColW }
    );
    put(S, body, rColX, 136);

    // Tags symptômes (bas de section)
    const tags = ["// fichiers_épars", "// composants_dupliqués", "// onboarding_improvisé", "// livrables_incohérents"];
    let tX = PAD;
    for (const tag of tags) {
      const t = await mkText(tag, F.mono, 12, C.gray, { opacity: 0.55 });
      put(S, t, tX, SH.debat - 80);
      tX += 240;
    }

    // Ligne de séparation basse
    put(S, mkRect(INN, 1, C.grid), PAD, SH.debat - 1);

    Y += SH.debat;
  }

  // ==============================================================
  // 04 — CE QUE CONTIENT LE LIVRE BLANC
  // ==============================================================
  {
    const S = mkSection("04 · Contenu du livre blanc", W, SH.contenu, C.white);
    put(PAGE, S, 0, Y);

    // Label section
    const label = await mkText("CE QUE VOUS ALLEZ TROUVER DEDANS", F.mono, 11, C.gray, { letterSpacing: 3 });
    put(S, label, PAD, 64);

    // Grille 2×2 de blocs
    const bW = Math.round((INN - 32) / 2); // 624px
    const bH = 296;
    const blocks = [
      {
        num: "01", title: "Le diagnostic",
        desc: "Les symptômes concrets d'une équipe design non structurée. Fichiers épars, onboarding improvisé, composants dupliqués, livrables incohérents d'un sprint à l'autre.",
      },
      {
        num: "02", title: "Le cadre",
        desc: "Ce qu'est vraiment le Design Ops — ses 3 niveaux d'intervention : opérationnel (quotidien), organisationnel (équipe), stratégique (entreprise).",
      },
      {
        num: "03", title: "La frontière",
        desc: "Ce qui doit être industrialisé (tokens, composants, rituels, repository…) et ce qui doit rester un espace de création (discovery, expérimentation, vision produit).",
      },
      {
        num: "04", title: "Les outils",
        desc: "4 templates directement applicables, adaptés à votre niveau de maturité : solo/duo, petite équipe, scale-up, grand groupe.",
      },
    ];

    for (let i = 0; i < 4; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const bX = PAD + col * (bW + 32);
      const bY = 120 + row * (bH + 24);
      const b = blocks[i];

      // Cadre du bloc
      const bFrame = mkRect(bW, bH, null, { stroke: C.grid, strokeW: 1, radius: 2 });
      put(S, bFrame, bX, bY);

      // Numéro de fond (décoratif)
      const bgNum = await mkText(b.num, F.serif_bold, 128, C.ink, { opacity: 0.06 });
      put(S, bgNum, bX + bW - 110, bY + bH - 120);

      // Numéro + titre
      const numTxt = await mkText(b.num, F.mono, 11, C.accent, { letterSpacing: 2 });
      put(S, numTxt, bX + 28, bY + 28);

      const titleTxt = await mkText(b.title, F.serif_bold, 24, C.ink, { w: bW - 56 });
      put(S, titleTxt, bX + 28, bY + 52);

      // Ligne de séparation interne
      put(S, mkRect(bW - 56, 1, C.grid), bX + 28, bY + 96);

      // Description
      const descTxt = await mkText(b.desc, F.sans_reg, 14, C.gray, { lineHeight: 24, w: bW - 56 });
      put(S, descTxt, bX + 28, bY + 114);
    }

    Y += SH.contenu;
  }

  // ==============================================================
  // 05 — À QUI S'ADRESSE CE LIVRE BLANC
  // ==============================================================
  {
    const S = mkSection("05 · À qui s'adresse", W, SH.aqui, C.light);
    put(PAGE, S, 0, Y);

    // Label
    const label = await mkText("VOUS VOUS RECONNAISSEZ ?", F.mono, 11, C.gray, { letterSpacing: 3 });
    put(S, label, PAD, 64);

    // Ligne de profils
    const profiles = ["UX Designer", "·", "UI Designer", "·", "Product Designer", "·", "Design Ops", "·", "Design System", "·", "Lead Designer"];
    let pX = PAD;
    for (const p of profiles) {
      const isDoT = p === "·";
      const pT = await mkText(p, isDoT ? F.sans_reg : F.sans_reg, 20, isDoT ? C.accent : C.ink, { opacity: isDoT ? 1 : 0.4 });
      put(S, pT, pX, 130);
      pX += isDoT ? 24 : (p.length * 10.5 + 16);
    }

    // Ligne de séparation
    put(S, mkRect(INN, 1, C.grid), PAD, 174);

    // Corps de texte
    const body = await mkText(
      "Que vous travailliez seul·e dans une startup ou dans une équipe de 30, ce livre blanc s'adapte à votre réalité. Chaque outil est tagué par niveau de maturité.",
      F.sans_reg, 16, C.ink, { lineHeight: 28, w: 680 }
    );
    put(S, body, PAD, 200);

    // Badges de maturité
    const badges = ["SOLO OU DUO", "PETITE ÉQUIPE", "SCALE-UP", "GRAND GROUPE"];
    let bX = PAD;
    for (const badge of badges) {
      const bg = mkRect(148, 34, null, { stroke: C.ink, strokeW: 1, radius: 4 });
      put(S, bg, bX, 340);
      const bTxt = await mkText(badge, F.mono, 10, C.ink, { letterSpacing: 1.5 });
      put(S, bTxt, bX + 14, 351);
      bX += 168;
    }

    Y += SH.aqui;
  }

  // ==============================================================
  // 06 — STATISTIQUES (section sombre)
  // ==============================================================
  {
    const S = mkSection("06 · Statistiques", W, SH.stats, C.dark);
    put(PAGE, S, 0, Y);

    // Divider vertical central
    put(S, mkRect(1, SH.stats - 80, C.gray, { opacity: 0.2 }), Math.round(W / 2), 40);

    const stats = [
      {
        num: "87%",
        desc: "des équipes ayant mis en place des pratiques de Design Ops déclarent une amélioration de la satisfaction de leurs parties prenantes.",
        src: "— DesignOps Summit 2024",
        x: PAD,
      },
      {
        num: "52%",
        desc: "des organisations observent un impact réel sur leur fonctionnement opérationnel depuis l'adoption du Design Ops.",
        src: "— DesignOps Assembly Benchmark Report 2024",
        x: Math.round(W / 2) + 56,
      },
    ];

    const sColW = Math.round(INN / 2) - 80;

    for (const s of stats) {
      const numT = await mkText(s.num, F.serif_bold, 96, C.accent);
      put(S, numT, s.x, 50);

      const descT = await mkText(s.desc, F.sans_reg, 15, C.white, { lineHeight: 26, w: sColW, opacity: 0.75 });
      put(S, descT, s.x, 168);

      const srcT = await mkText(s.src, F.serif_it, 13, C.gray, { w: sColW });
      put(S, srcT, s.x, 294);
    }

    Y += SH.stats;
  }

  // ==============================================================
  // 07 — LES TEMPLATES
  // ==============================================================
  {
    const S = mkSection("07 · Les Templates", W, SH.tpl, C.bg);
    put(PAGE, S, 0, Y);

    // Label
    const label = await mkText("4 OUTILS DIRECTEMENT APPLICABLES", F.mono, 11, C.gray, { letterSpacing: 3 });
    put(S, label, PAD, 64);

    // Intro
    const intro = await mkText(
      "Pas des slides théoriques. Des templates conçus pour être utilisés demain matin.",
      F.sans_reg, 18, C.ink, { w: 680 }
    );
    put(S, intro, PAD, 104);

    // 4 cartes template
    const cW = Math.round((INN - 3 * 24) / 4); // ~296px
    const cH = 500;
    const rotations = [-1.5, 0.8, -0.6, 1.3];

    const cards = [
      { num: "01", badge: "SOLO OU DUO",    title: "Architecture\nde design tokens",         desc: "Centraliser vos variables Figma dès le premier jour : couleurs, typographies, espacements." },
      { num: "02", badge: "PETITE ÉQUIPE",   title: "Framework\nrituels d'équipe",             desc: "Design critique, review, synchronisation : les cadences qui font monter une équipe en compétences." },
      { num: "03", badge: "SCALE-UP",        title: "Matrice\nindustrialisation /\nexploration", desc: "Tracer la frontière entre ce qui doit être standardisé et ce qui doit rester libre." },
      { num: "04", badge: "GRAND GROUPE",    title: "Kit onboarding\ndesign",                  desc: "Faire monter un·e nouveau·elle arrivant·e en autonomie sans perdre de temps." },
    ];

    for (let i = 0; i < 4; i++) {
      const cX = PAD + i * (cW + 24);
      const cY = 168;
      const c = cards[i];

      // Ombre (rectangle décalé)
      const shadow = mkRect(cW, cH, C.grid, { radius: 4, opacity: 0.6 });
      put(S, shadow, cX + 6, cY + 6);

      // Carte principale
      const card = mkRect(cW, cH, C.white, { radius: 4, stroke: C.grid, strokeW: 1 });
      card.rotation = rotations[i];
      put(S, card, cX, cY);

      // Badge template
      const badgeBg = mkRect(cW - 40, 28, C.accent, { radius: 3 });
      put(S, badgeBg, cX + 20, cY + 20);
      const badgeTxt = await mkText(`Template ${c.num}`, F.mono, 10, C.white, { letterSpacing: 1 });
      put(S, badgeTxt, cX + 30, cY + 28);

      // Titre carte
      const cTitle = await mkText(c.title, F.serif_bold, 20, C.ink, { lineHeight: 28, w: cW - 40 });
      put(S, cTitle, cX + 20, cY + 70);

      // Divider interne
      put(S, mkRect(cW - 40, 1, C.grid), cX + 20, cY + 168);

      // Description
      const cDesc = await mkText(c.desc, F.sans_reg, 13, C.gray, { lineHeight: 22, w: cW - 40 });
      put(S, cDesc, cX + 20, cY + 184);

      // Badge maturité (bas de carte)
      const mbg = mkRect(130, 26, null, { stroke: C.ink, strokeW: 1, radius: 3 });
      put(S, mbg, cX + 20, cY + cH - 48);
      const mTxt = await mkText(c.badge, F.mono, 9, C.ink, { letterSpacing: 1 });
      put(S, mTxt, cX + 28, cY + cH - 40);
    }

    Y += SH.tpl;
  }

  // ==============================================================
  // 08 — BIO / LÉGITIMITÉ
  // ==============================================================
  {
    const S = mkSection("08 · Bio", W, SH.bio, C.bg);
    put(PAGE, S, 0, Y);

    // Label
    const label = await mkText("QUI A ÉCRIT ÇA, ET POURQUOI", F.mono, 11, C.gray, { letterSpacing: 3 });
    put(S, label, PAD, 64);

    // Portrait géométrique abstrait (art CSS en Figma)
    const pW = 300, pH = 380;
    const pX = PAD, pY = 120;

    // Fond de base
    put(S, mkRect(pW, pH, C.light, { radius: 4 }), pX, pY);

    // Quadrant haut-gauche : ink
    const q1 = mkRect(Math.round(pW / 2), Math.round(pH * 0.55), C.dark);
    put(S, q1, pX, pY);

    // Quadrant haut-droite : accent
    const q2 = mkRect(Math.round(pW / 2), Math.round(pH * 0.55), C.accent);
    put(S, q2, pX + Math.round(pW / 2), pY);

    // Quadrant bas-gauche : crème
    const q3 = mkRect(Math.round(pW / 2), Math.round(pH * 0.45), C.bg);
    put(S, q3, pX, pY + Math.round(pH * 0.55));

    // Quadrant bas-droite : grille
    const q4 = mkRect(Math.round(pW / 2), Math.round(pH * 0.45), C.grid);
    put(S, q4, pX + Math.round(pW / 2), pY + Math.round(pH * 0.55));

    // Ellipse de texture
    const ellipse = figma.createEllipse();
    ellipse.resize(180, 220);
    ellipse.fills = fill(C.white, 0.12);
    put(S, ellipse, pX + 60, pY + 80);

    // Lignes de grille internes sur le portrait
    for (let li = 0; li < 5; li++) {
      const gl = mkRect(pW, 1, C.white, { opacity: 0.12 });
      put(S, gl, pX, pY + 56 + li * 60);
    }

    // Initiale décorative
    const initiale = await mkText("M.", F.serif_bold, 88, C.white, { opacity: 0.25 });
    put(S, initiale, pX + 80, pY + 130);

    // Texte bio (colonne droite)
    const bX = PAD + pW + 64;
    const bW = INN - pW - 64;

    const bioName = await mkText("Je m'appelle Maëlyne.", F.serif_bold, 34, C.ink, { w: bW });
    put(S, bioName, bX, 124);

    const bioBody = await mkText(
      "Je suis UX/UI Designer, et je me suis longtemps posé une question : pourquoi certaines équipes créent de la magie, et d'autres s'épuisent à refaire les mêmes choses en boucle ?\n\nCe livre blanc est ma réponse. Pas une thèse académique. Pas un discours de consultant. Un retour terrain, structuré pour être utile.",
      F.sans_reg, 16, C.ink, { lineHeight: 28, w: bW }
    );
    put(S, bioBody, bX, 180);

    // Credentials
    const cred1 = await mkText("Master UX Design · ESD Toulouse", F.mono, 12, C.gray);
    put(S, cred1, bX, 390);
    const cred2 = await mkText("Bachelor Communication", F.mono, 12, C.gray);
    put(S, cred2, bX, 412);

    // Lien portfolio
    const portfolioLink = await mkText("→  Voir mon portfolio", F.sans_reg, 14, C.accent);
    put(S, portfolioLink, bX, 450);

    Y += SH.bio;
  }

  // ==============================================================
  // 09 — CTA PRINCIPAL (section orange)
  // ==============================================================
  {
    const S = mkSection("09 · CTA Principal", W, SH.cta, C.accent);
    put(PAGE, S, 0, Y);

    const h1 = await mkText(
      "Vous pouvez continuer à travailler dans le désordre.",
      F.serif_bold, 56, C.white, { lineHeight: 68, w: INN }
    );
    put(S, h1, PAD, 80);

    const h2 = await mkText(
      "Ou vous pouvez lire ça d'abord.",
      F.serif_it, 36, C.white, { w: INN, opacity: 0.88 }
    );
    put(S, h2, PAD, 208);

    // Bouton sombre
    const btn = mkRect(316, 58, C.dark, { radius: 4 });
    put(S, btn, PAD, 290);
    const btnTxt = await mkText("Télécharger le livre blanc  →", F.sans_med, 15, C.white);
    put(S, btnTxt, PAD + 28, 306);

    // Texte de réassurance sous le bouton
    const reassure = await mkText(
      "Format PDF  ·  122 pages  ·  Accès immédiat  ·  Gratuit",
      F.mono, 11, C.white, { letterSpacing: 1, opacity: 0.65 }
    );
    put(S, reassure, PAD, 366);

    Y += SH.cta;
  }

  // ==============================================================
  // 10 — RÉASSURANCE
  // ==============================================================
  {
    const S = mkSection("10 · Réassurance", W, SH.reassure, C.white);
    put(PAGE, S, 0, Y);

    const half = Math.round(W / 2);
    const colW = Math.round(INN / 2) - 40;

    // Colonne gauche : Ce que ce n'est PAS
    const lLabel = await mkText("CE QUE CE N'EST PAS", F.mono, 11, C.gray, { letterSpacing: 2 });
    put(S, lLabel, PAD, 64);

    const negItems = [
      "✗   Une suite de théories sans application",
      "✗   Un contenu réservé aux grandes équipes",
      "✗   Un argument pour tout standardiser",
      "✗   Un énième ebook formaté en template Canva",
    ];
    for (let i = 0; i < negItems.length; i++) {
      const it = await mkText(negItems[i], F.sans_reg, 15, C.gray, { w: colW });
      put(S, it, PAD, 116 + i * 54);
    }

    // Divider vertical
    put(S, mkRect(1, SH.reassure - 80, C.grid), half, 40);

    // Colonne droite : Ce que c'est
    const rX = half + 56;
    const rLabel = await mkText("CE QUE C'EST", F.mono, 11, C.accent, { letterSpacing: 2 });
    put(S, rLabel, rX, 64);

    const posItems = [
      "✓   Un outil de travail",
      "✓   Des frameworks adaptés à votre maturité",
      "✓   Un point de vue assumé, pas un consensus mou",
      "✓   Écrit par une designer, pour des designers",
    ];
    for (let i = 0; i < posItems.length; i++) {
      const it = await mkText(posItems[i], F.sans_semi, 15, C.ink, { w: colW });
      put(S, it, rX, 116 + i * 54);
    }

    Y += SH.reassure;
  }

  // ==============================================================
  // 11 — FOOTER
  // ==============================================================
  {
    const S = mkSection("11 · Footer", W, SH.footer, C.dark);
    put(PAGE, S, 0, Y);

    // Logo
    const logo = await mkText("Maëlyne", F.mono, 13, C.white, { letterSpacing: 5 });
    put(S, logo, PAD, 44);

    // Liens
    const fLinks = ["Télécharger", "Portfolio", "LinkedIn"];
    let lX = W - PAD - 316;
    for (const link of fLinks) {
      const lt = await mkText(link, F.sans_reg, 13, C.white, { opacity: 0.55 });
      put(S, lt, lX, 47);
      lX += 112;
    }

    // Divider horizontal
    put(S, mkRect(INN, 1, C.gray, { opacity: 0.18 }), PAD, 96);

    // Citation signature
    const quote = await mkText(
      '"La structure, c\'est ce qui rend la créativité possible."',
      F.serif_it, 14, C.white, { w: 560, opacity: 0.45 }
    );
    put(S, quote, PAD, 120);

    // Année
    const yr = await mkText("2025", F.mono, 12, C.white, { opacity: 0.25 });
    put(S, yr, W - PAD - 36, 123);

    Y += SH.footer;
  }

  // ==============================================================
  // GRILLE (ajoutée en dernier pour apparaître au-dessus)
  // ==============================================================
  put(PAGE, GRID_FRAME, 0, 0);

  // ==============================================================
  // FINALISATION
  // ==============================================================
  figma.viewport.scrollAndZoomIntoView([PAGE]);
  figma.closePlugin(`✅ Landing page créée — ${TOTAL}px de hauteur. Désactivez le calque "_Grille 12 colonnes" pour masquer la grille.`);
}

run().catch(err => {
  figma.closePlugin(`❌ Erreur : ${err.message}`);
});
