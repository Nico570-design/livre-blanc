# Livre Blanc — Design Ops par Maëlyne

## Contexte du projet

Landing page de promotion d'un livre blanc sur l'industrialisation du design, écrit par **Maëlyne**, UX/UI Designer (Master UX Design · ESD Toulouse).

### Thèse centrale
L'industrialisation du design (Design Ops) n'est pas l'ennemi de la créativité — c'est son socle. Les standards, process, templates et frameworks libèrent du temps cognitif pour créer davantage de valeur.

### Contenu du livre blanc
- Diagnostic des symptômes d'une équipe design non structurée
- Définition et périmètre du Design Ops (3 niveaux : opérationnel, organisationnel, stratégique)
- Ce qui doit être industrialisé vs ce qui doit rester créatif
- 4 templates/frameworks concrets adaptés par niveau de maturité (Solo, Petite équipe, Scale-up, Grand groupe)

### Public cible
UX Designer, UI Designer, Product Designer, Design Ops, Design System, Lead/Head of Design

---

## Concept créatif : "La grille qui libère"

La landing page EST la démonstration de la thèse : une grille rigoureuse visible en filigrane, des éléments qui la respectent et la débordent délibérément. Structure et liberté coexistent.

### Direction artistique
- **Palette** : `#F4F1EC` crème · `#0F0F0F` noir · `#FF4D1C` orange brûlé (accent unique) · `#9B9790` gris · `#111111` fond sombre
- **Typo** : Playfair Display (serif éditorial, titres) + Inter (sans-serif précis, corps) + Roboto Mono (labels, tags)
- **Grille** : 12 colonnes, visible en filigrane, s'estompe vers le bas
- **Tension** : mix serif/sans-serif dans les titres heroes incarne structure ↔ créativité

---

## Fichiers du projet

```
livre-blanc/
├── index.html          # Maquette HTML complète (single-file, tout inline)
├── figma-plugin/
│   ├── manifest.json   # Plugin Figma
│   └── code.js         # Génère la maquette dans Figma (11 sections)
└── CLAUDE.md           # Ce fichier
```

### index.html — Sections
1. Navigation sticky
2. Hero (titre 3 lignes mix Playfair/Inter/Playfair italic orange)
3. Le Débat (citation barrée animée)
4. Contenu (4 blocs 2×2)
5. À qui s'adresse (marquee profils + badges maturité)
6. Statistiques (87% / 52%, section sombre, count-up)
7. Templates (4 cartes inclinées)
8. Bio Maëlyne (portrait géométrique abstrait)
9. CTA orange brûlé
10. Réassurance (✗ / ✓)
11. Footer sombre

### Plugin Figma
Ouvrir Figma Desktop → Plugins → Development → Import plugin from manifest → sélectionner `figma-plugin/manifest.json` → lancer.
Crée un frame 1440 × 5220px avec toutes les sections. Calque `_Grille 12 colonnes` toggleable.

---

## Copywriting clé

**Headline hero :**
> LA STRUCTURE, / C'EST CE QUI REND / LA CRÉATIVITÉ POSSIBLE.

**Accroche :**
> Un livre blanc pour les designers qui veulent arrêter de choisir entre bien travailler et bien créer.

**CTA :**
> Vous pouvez continuer à travailler dans le désordre. Ou vous pouvez lire ça d'abord.

**Signature footer :**
> "La structure, c'est ce qui rend la créativité possible."

---

## Stack technique

- HTML/CSS/JS vanilla (zéro dépendance)
- Google Fonts : Playfair Display, Inter, Roboto Mono (dans le HTML)
- Animations : IntersectionObserver scroll-driven, count-up JS
- Curseur custom `+` (désactivé mobile)
- Modal téléchargement accessible

---

## Branche de travail

`claude/vibrant-carson-YydeW` sur `nico570-design/livre-blanc`

---

## Prochaines étapes possibles

- Intégrer un vrai formulaire de téléchargement (Mailchimp, ConvertKit, Notion form...)
- Ajouter la version mobile (déjà responsive mais à affiner)
- Connecter un domaine custom
- Améliorer les animations hero au load
- Ajouter des previews de pages du livre blanc en section 6 (templates)
