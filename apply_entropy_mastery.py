import re

with open(r'C:\Users\Marketing - Apolo\.gemini\antigravity-ide\scratch\layout-forge\app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update archetypesPool and switch in renderGenerativeContent
old_dispatcher = """    // Determina o Arquétipo Arquitetônico
    let activeArchetype = state.archetype;
    if (activeArchetype === 'random_infinite') {
      let archetypesPool;
      if (entropyFactor < 0.30) {
        // 0% a 30%: Rigor Suíço Estrito (Cânones Clássicos e Ortogonais de Zurique)
        archetypesPool = [
          'swiss_monumental_top',
          'swiss_bottom_anchor',
          'swiss_split_spine',
          'classical_book_canon'
        ];
      } else if (entropyFactor <= 0.70) {
        // 31% a 70%: Tensão Assimétrica & New Wave (Wolfgang Weingart / Ruder)
        archetypesPool = [
          'swiss_split_spine',
          'swiss_center_belt',
          'swiss_typographic_pure',
          'swiss_modular_quads',
          'swiss_inverted_field'
        ];
      } else {
        // 71% a 100%: Desconstrução Brutalista & Ruptura David Carson (Ray Gun)
        archetypesPool = [
          'constructivist_tension',
          'brutalist_data_matrix',
          'swiss_inverted_field',
          'swiss_typographic_pure'
        ];
      }
      const archIndex = Math.floor(seededRandom(s + 7) * archetypesPool.length);
      activeArchetype = archetypesPool[archIndex];
    }

    // DISPATCHER: RENDERIZA O ARQUÉTIPO SELECIONADO
    switch (activeArchetype) {
      case 'swiss_bottom_anchor':
        renderSwissBottomAnchor(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor);
        break;
      case 'swiss_split_spine':
        renderSwissSplitSpine(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor);
        break;
      case 'swiss_center_belt':
        renderSwissCenterBelt(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor);
        break;
      case 'swiss_typographic_pure':
        renderSwissTypographicPure(geom, content, bodyCopy, quoteItem, baseScale, s, entropyFactor);
        break;
      case 'swiss_modular_quads':
        renderSwissModularQuads(geom, content, bodyCopy, baseScale, s, entropyFactor);
        break;
      case 'swiss_inverted_field':
        renderSwissInvertedField(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor);
        break;
      case 'constructivist_tension':
        renderConstructivistTension(geom, content, bodyCopy, baseScale, s, entropyFactor);
        break;
      case 'brutalist_data_matrix':
        renderBrutalistDataMatrix(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor);
        break;
      case 'classical_book_canon':
        renderClassicalBookCanon(geom, content, bodyCopy, baseScale, s, entropyFactor);
        break;
      case 'swiss_monumental_top':
      default:
        renderSwissMonumentalTop(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor);
        break;
    }"""

new_dispatcher = """    // Determina o Arquétipo Arquitetônico
    let activeArchetype = state.archetype;
    if (activeArchetype === 'random_infinite') {
      let archetypesPool;
      if (entropyFactor < 0.25) {
        // 0% a 25%: Rigor Suíço Estrito (Cânones Clássicos e Ortogonais de Zurique)
        archetypesPool = [
          'swiss_monumental_top',
          'swiss_bottom_anchor',
          'swiss_split_spine',
          'classical_book_canon'
        ];
      } else if (entropyFactor <= 0.60) {
        // 26% a 60%: Tensão Assimétrica & Eixos 90° / Tarjas (Weingart / New Wave)
        archetypesPool = [
          'swiss_split_spine',
          'swiss_center_belt',
          'brutalist_tape_strips',
          'swiss_modular_quads',
          'swiss_inverted_field',
          'cross_axis_avantgarde'
        ];
      } else {
        // 61% a 100%: Ruptura Estrutural, Headline Vertical 90°, Tarjas Invertidas & Vanguardas
        archetypesPool = [
          'vertical_spine_90',
          'brutalist_tape_strips',
          'cross_axis_avantgarde',
          'constructivist_tension',
          'brutalist_data_matrix',
          'swiss_inverted_field'
        ];
      }
      const archIndex = Math.floor(seededRandom(s + 7) * archetypesPool.length);
      activeArchetype = archetypesPool[archIndex];
    }

    // DISPATCHER: RENDERIZA O ARQUÉTIPO SELECIONADO
    switch (activeArchetype) {
      case 'vertical_spine_90':
        renderVerticalSpine90(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor);
        break;
      case 'brutalist_tape_strips':
        renderBrutalistTapeStrips(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor);
        break;
      case 'cross_axis_avantgarde':
        renderCrossAxisAvantGarde(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor);
        break;
      case 'swiss_bottom_anchor':
        renderSwissBottomAnchor(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor);
        break;
      case 'swiss_split_spine':
        renderSwissSplitSpine(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor);
        break;
      case 'swiss_center_belt':
        renderSwissCenterBelt(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor);
        break;
      case 'swiss_typographic_pure':
        renderSwissTypographicPure(geom, content, bodyCopy, quoteItem, baseScale, s, entropyFactor);
        break;
      case 'swiss_modular_quads':
        renderSwissModularQuads(geom, content, bodyCopy, baseScale, s, entropyFactor);
        break;
      case 'swiss_inverted_field':
        renderSwissInvertedField(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor);
        break;
      case 'constructivist_tension':
        renderConstructivistTension(geom, content, bodyCopy, baseScale, s, entropyFactor);
        break;
      case 'brutalist_data_matrix':
        renderBrutalistDataMatrix(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor);
        break;
      case 'classical_book_canon':
        renderClassicalBookCanon(geom, content, bodyCopy, baseScale, s, entropyFactor);
        break;
      case 'swiss_monumental_top':
      default:
        renderSwissMonumentalTop(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor);
        break;
    }"""

assert old_dispatcher in code, "old_dispatcher not found"
code = code.replace(old_dispatcher, new_dispatcher)

# 2. Update titles in archetypes (eliminating cheap -1.8deg tilt, using tape strips / clean 0deg ghosting)
# swiss_monumental_top
old_smt = """    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, titleMaxWidth, baseScale * (r2 > 0.5 ? 2.5 : 2.2), titleMaxH);
    const titleRot = entropyFactor > 0.6 ? (seededRandom(s + 99) > 0.5 ? -1.8 : 2.0) : 0;
    const titleGhost = entropyFactor > 0.65;
    appendSvgText(layerContent, titleLines, titleX, titleY, titleSize, 1.08, '800', '#1d1d1f', titleRot, titleGhost);"""

new_smt = """    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, titleMaxWidth, baseScale * (r2 > 0.5 ? 2.5 : 2.2), titleMaxH);
    if (entropyFactor > 0.65 && seededRandom(s + 99) > 0.35) {
      appendTapeStripHeadline(layerContent, titleLines, titleX, titleY, titleSize, 1.25, '800', entropyFactor, s, columns, colWidth);
    } else {
      appendSvgText(layerContent, titleLines, titleX, titleY, titleSize, 1.08, '800', '#1d1d1f', 0, entropyFactor > 0.45);
    }"""
assert old_smt in code, "old_smt not found"
code = code.replace(old_smt, new_smt)

# swiss_bottom_anchor
old_sba = """    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, titleW, baseScale * (2.0 + r1 * 0.5), rowHeight * bottomRowSpan);
    const titleRot = entropyFactor > 0.6 ? (seededRandom(s + 98) > 0.5 ? 1.6 : -1.8) : 0;
    appendSvgText(layerContent, titleLines, titleX, titleY, titleSize, 1.08, '800', '#1d1d1f', titleRot, entropyFactor > 0.65);"""

new_sba = """    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, titleW, baseScale * (2.0 + r1 * 0.5), rowHeight * bottomRowSpan);
    if (entropyFactor > 0.65 && seededRandom(s + 98) > 0.35) {
      appendTapeStripHeadline(layerContent, titleLines, titleX, titleY, titleSize, 1.25, '800', entropyFactor, s, columns, colWidth);
    } else {
      appendSvgText(layerContent, titleLines, titleX, titleY, titleSize, 1.08, '800', '#1d1d1f', 0, entropyFactor > 0.45);
    }"""
assert old_sba in code, "old_sba not found"
code = code.replace(old_sba, new_sba)

# swiss_split_spine
old_sss = """    const titleY = rows[0].y + baseScale * 3.6;
    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, spineW, baseScale * (1.3 + r1 * 0.4), rowHeight * 4);
    const titleRot = entropyFactor > 0.6 ? (seededRandom(s + 97) > 0.5 ? -2.0 : 1.5) : 0;
    appendSvgText(layerContent, titleLines, spineX, titleY, titleSize, 1.1, '800', '#1d1d1f', titleRot, entropyFactor > 0.65);"""

new_sss = """    const titleY = rows[0].y + baseScale * 3.6;
    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, spineW, baseScale * (1.3 + r1 * 0.4), rowHeight * 4);
    if (entropyFactor > 0.6) {
      // Título Vertical 90° na coluna espinha se alta entropia!
      const spineBotY = rows[Math.min(rows.length - 1, 5)].y + rowHeight;
      appendSvgVerticalHeadline(layerContent, content.title, spineX + spineW * 0.5, spineBotY, spineBotY - rows[0].y, baseScale * 1.8, '800', '#1d1d1f', entropyFactor > 0.75 ? 'red' : 'black', -90);
    } else {
      appendSvgText(layerContent, titleLines, spineX, titleY, titleSize, 1.1, '800', '#1d1d1f', 0, entropyFactor > 0.45);
    }"""
assert old_sss in code, "old_sss not found"
code = code.replace(old_sss, new_sss)

# swiss_center_belt
old_scb = """    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, fullW, baseScale * (2.1 + r1 * 0.4), rowHeight * (r2 > 0.5 ? 2.5 : 2.0));
    const titleRot = entropyFactor > 0.6 ? (seededRandom(s + 95) > 0.5 ? -1.5 : 2.0) : 0;
    appendSvgText(layerContent, titleLines, columns[0].x, beltY, titleSize, 1.08, '800', '#1d1d1f', titleRot, entropyFactor > 0.65);"""

new_scb = """    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, fullW, baseScale * (2.1 + r1 * 0.4), rowHeight * (r2 > 0.5 ? 2.5 : 2.0));
    if (entropyFactor > 0.65) {
      appendTapeStripHeadline(layerContent, titleLines, columns[0].x, beltY, titleSize, 1.25, '800', entropyFactor, s, columns, colWidth);
    } else {
      appendSvgText(layerContent, titleLines, columns[0].x, beltY, titleSize, 1.08, '800', '#1d1d1f', 0, entropyFactor > 0.45);
    }"""
assert old_scb in code, "old_scb not found"
code = code.replace(old_scb, new_scb)

old_stp = """    const titleRowsSpan = r2 > 0.5 ? 4 : 3;
    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, fullW, baseScale * (2.6 + r1 * 0.5), rowHeight * titleRowsSpan);
    const titleRot = entropyFactor > 0.6 ? (seededRandom(s + 94) > 0.5 ? 2.0 : -1.8) : 0;
    appendSvgText(layerContent, titleLines, columns[titleColStart].x, rows[0].y, titleSize, 1.06, '800', '#1d1d1f', titleRot, entropyFactor > 0.65);"""

new_stp = """    const titleRowsSpan = r2 > 0.5 ? 4 : 3;
    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, fullW, baseScale * (2.6 + r1 * 0.5), rowHeight * titleRowsSpan);
    if (entropyFactor > 0.65 && seededRandom(s + 94) > 0.35) {
      appendTapeStripHeadline(layerContent, titleLines, columns[titleColStart].x, rows[0].y, titleSize, 1.25, '800', entropyFactor, s, columns, colWidth);
    } else {
      appendSvgText(layerContent, titleLines, columns[titleColStart].x, rows[0].y, titleSize, 1.06, '800', '#1d1d1f', 0, entropyFactor > 0.45);
    }"""
assert old_stp in code, "old_stp not found"
code = code.replace(old_stp, new_stp)

# swiss_modular_quads
old_smq = """    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, titleW, baseScale * (1.6 + r1 * 0.3), img1H * 0.8);
    const titleRot = entropyFactor > 0.6 ? (seededRandom(s + 93) > 0.5 ? -2.0 : 1.8) : 0;
    appendSvgText(layerContent, titleLines, titleX, rows[0].y, titleSize, 1.1, '800', '#1d1d1f', titleRot, entropyFactor > 0.65);"""

new_smq = """    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, titleW, baseScale * (1.6 + r1 * 0.3), img1H * 0.8);
    if (entropyFactor > 0.65) {
      appendTapeStripHeadline(layerContent, titleLines, titleX, rows[0].y, titleSize, 1.25, '800', entropyFactor, s, columns, colWidth);
    } else {
      appendSvgText(layerContent, titleLines, titleX, rows[0].y, titleSize, 1.1, '800', '#1d1d1f', 0, entropyFactor > 0.45);
    }"""
assert old_smq in code, "old_smq not found"
code = code.replace(old_smq, new_smq)

# swiss_inverted_field
old_sif = """    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, invW - titlePadding * 2, baseScale * (2.0 + r1 * 0.5), invH * 0.55);
    const titleRot = entropyFactor > 0.6 ? (seededRandom(s + 92) > 0.5 ? -1.5 : 1.8) : 0;
    appendSvgText(layerContent, titleLines, invX + titlePadding, invY + titlePadding, titleSize, 1.08, '800', '#ffffff', titleRot, entropyFactor > 0.65);"""

new_sif = """    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, invW - titlePadding * 2, baseScale * (2.0 + r1 * 0.5), invH * 0.55);
    appendSvgText(layerContent, titleLines, invX + titlePadding, invY + titlePadding, titleSize, 1.08, '800', '#ffffff', 0, entropyFactor > 0.45);"""
assert old_sif in code, "old_sif not found"
code = code.replace(old_sif, new_sif)

# constructivist_tension
old_ct = """    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, titleW, baseScale * (2.4 + r1 * 0.4), rowHeight * 2.5);
    const titleRot = entropyFactor > 0.55 ? (seededRandom(s + 90) > 0.5 ? -2.2 : 2.0) : 0;
    appendSvgText(layerContent, titleLines, titleX, titleY, titleSize, 1.06, '800', '#1d1d1f', titleRot, entropyFactor > 0.65);"""

new_ct = """    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, titleW, baseScale * (2.4 + r1 * 0.4), rowHeight * 2.5);
    if (entropyFactor > 0.65) {
      appendTapeStripHeadline(layerContent, titleLines, titleX, titleY, titleSize, 1.25, '800', entropyFactor, s, columns, colWidth);
    } else {
      appendSvgText(layerContent, titleLines, titleX, titleY, titleSize, 1.06, '800', '#1d1d1f', 0, entropyFactor > 0.45);
    }"""
assert old_ct in code, "old_ct not found"
code = code.replace(old_ct, new_ct)

# brutalist_data_matrix
old_bdm = """    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, titleW, baseScale * (1.9 + r1 * 0.4), rowHeight * 2.5);
    const titleRot = entropyFactor > 0.6 ? (seededRandom(s + 91) > 0.5 ? 2.0 : -1.8) : 0;
    appendSvgText(layerContent, titleLines, columns[titleStartCol].x, titleY, titleSize, 1.08, '800', '#1d1d1f', titleRot, entropyFactor > 0.65);"""

new_bdm = """    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, titleW, baseScale * (1.9 + r1 * 0.4), rowHeight * 2.5);
    if (entropyFactor > 0.65) {
      appendTapeStripHeadline(layerContent, titleLines, columns[titleStartCol].x, titleY, titleSize, 1.25, '800', entropyFactor, s, columns, colWidth);
    } else {
      appendSvgText(layerContent, titleLines, columns[titleStartCol].x, titleY, titleSize, 1.08, '800', '#1d1d1f', 0, entropyFactor > 0.45);
    }"""
assert old_bdm in code, "old_bdm not found"
code = code.replace(old_bdm, new_bdm)

# 3. Add 3 new archetypes right after renderClassicalBookCanon
target_end_canon = """    const bodyY = imgY + imgH + rowHeight * (0.4 + r1 * 0.3);
    const numCols = columns.length >= 4 ? (r2 > 0.5 ? 2 : 3) : 1;
    appendMultiColumnBody(layerContent, columns, 0, columns.length, colWidth, bodyY, h - margins.bottom - 5, bodyCopy, numCols, baseScale);
  }"""

new_archetypes_code = """    const bodyY = imgY + imgH + rowHeight * (0.4 + r1 * 0.3);
    const numCols = columns.length >= 4 ? (r2 > 0.5 ? 2 : 3) : 1;
    appendMultiColumnBody(layerContent, columns, 0, columns.length, colWidth, bodyY, h - margins.bottom - 5, bodyCopy, numCols, baseScale);
  }

  // -------------------------------------------------------------------------
  // ARQUÉTIPO 11: VANGUARDA 90° (Headline Vertical Monumental + Galeria)
  // -------------------------------------------------------------------------
  function renderVerticalSpine90(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor = 0) {
    const { w, h, margins, columns, rows, colWidth, rowHeight } = geom;

    const r1 = seededRandom(s + 110);
    const r2 = seededRandom(s + 111);

    const spineOnLeft = r1 > 0.35;
    const spineColIdx = spineOnLeft ? 0 : columns.length - 1;
    const galleryStartCol = spineOnLeft ? 1 : 0;
    const gallerySpanCols = columns.length - 1;

    const spineX = columns[spineColIdx].x + colWidth * 0.55;
    const spineY = rows[rows.length - 1].y + rowHeight;
    const spineH = spineY - rows[0].y;
    const spineFontSize = baseScale * (2.8 + r2 * 0.6);

    appendSvgVerticalHeadline(layerContent, content.title, spineX, spineY, spineH, spineFontSize, '800', '#1d1d1f', entropyFactor > 0.7 ? 'red' : (entropyFactor > 0.4 ? 'black' : false), -90);

    const galX = columns[galleryStartCol].x;
    const galW = (columns[galleryStartCol + gallerySpanCols - 1].x + colWidth) - galX;

    const imgH = rowHeight * Math.max(2, Math.floor(rows.length * (0.35 + r1 * 0.2)));
    appendSvgImageFrame(layerContent, galX, rows[0].y, galW, imgH, 'AVANT-GARDE 90° // HERO VISION', entropyFactor);

    const midRow = Math.min(rows.length - 2, Math.max(2, Math.floor(rows.length * 0.5)));
    const midY = rows[midRow].y;

    const subSize = Math.max(7, baseScale * 0.48);
    const subLines = wrapTextToWidth(content.sub.toUpperCase(), galW * 0.65, subSize, '600');
    appendSvgText(layerContent, subLines, galX, midY, subSize, 1.25, '600', '#1d1d1f');

    const statW = galW * 0.3;
    const statX = galX + galW - statW;
    appendStatBadge(layerContent, statX, midY, statW, rowHeight * 1.8, statItem.num, statItem.label, baseScale, entropyFactor);

    const bodyRow = Math.min(rows.length - 2, midRow + 2);
    const bodyY = rows[bodyRow]?.y || (midY + rowHeight * 2);
    const numSubCols = gallerySpanCols >= 4 ? 2 : 1;
    appendMultiColumnBody(layerContent, columns, galleryStartCol, gallerySpanCols, colWidth, bodyY, h - margins.bottom - 5, bodyCopy, numSubCols, baseScale);
  }

  // -------------------------------------------------------------------------
  // ARQUÉTIPO 12: PÓS-MODERNO (Tarjas Negativas Invertidas Escalonadas)
  // -------------------------------------------------------------------------
  function renderBrutalistTapeStrips(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor = 0) {
    const { w, h, margins, columns, rows, colWidth, rowHeight } = geom;

    const r1 = seededRandom(s + 120);
    const r2 = seededRandom(s + 121);

    const titleStartCol = (columns.length >= 5 && r1 > 0.6) ? 1 : 0;
    const titleX = columns[titleStartCol].x;
    const titleMaxW = (columns[columns.length - 1].x + colWidth) - titleX;
    const titleY = rows[0].y;

    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, titleMaxW * 0.9, baseScale * (2.2 + r2 * 0.4), rowHeight * 3.2);
    appendTapeStripHeadline(layerContent, titleLines, titleX, titleY, titleSize, 1.28, '800', entropyFactor, s, columns, colWidth);

    const subY = titleY + (titleLines.length * titleSize * 1.28) + 8;
    const subLines = wrapTextToWidth(content.sub.toUpperCase(), titleMaxW, Math.max(6.5, titleSize * 0.35), '600', 'JetBrains Mono, monospace');
    appendSvgText(layerContent, subLines, titleX, subY, Math.max(6.5, titleSize * 0.35), 1.25, '600', '#6e6e73');

    const imgRowStart = Math.min(rows.length - 3, Math.max(3, Math.floor(rows.length * 0.45)));
    const imgY = rows[imgRowStart].y;
    const imgH = rowHeight * Math.max(2, Math.floor(rows.length * 0.28));

    if (columns.length >= 6 && r1 > 0.4) {
      const splitCol = Math.floor(columns.length * 0.6);
      const w1 = (columns[splitCol - 1].x + colWidth) - columns[0].x;
      const x2 = columns[splitCol].x;
      const w2 = (columns[columns.length - 1].x + colWidth) - x2;
      appendSvgImageFrame(layerContent, columns[0].x, imgY, w1, imgH, 'PRIMARY VISUAL // SHIFT', entropyFactor);
      appendStatBadge(layerContent, x2, imgY, w2, imgH, statItem.num, statItem.label, baseScale, entropyFactor);
    } else {
      appendSvgImageFrame(layerContent, columns[0].x, imgY, (columns[columns.length - 1].x + colWidth) - columns[0].x, imgH, 'BRUTALIST PANORAMA', entropyFactor);
    }

    const bodyRow = imgRowStart + Math.max(2, Math.floor(imgH / rowHeight)) + 1;
    const bodyY = rows[Math.min(rows.length - 2, bodyRow)]?.y || (imgY + imgH + 12);
    appendMultiColumnBody(layerContent, columns, 0, columns.length, colWidth, bodyY, h - margins.bottom - 5, bodyCopy, columns.length >= 4 ? 3 : 2, baseScale);
  }

  // -------------------------------------------------------------------------
  // ARQUÉTIPO 13: BIAXIAL 90° (Eixos Cruzados / Tipofoto Perpendicular)
  // -------------------------------------------------------------------------
  function renderCrossAxisAvantGarde(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor = 0) {
    const { w, h, margins, columns, rows, colWidth, rowHeight } = geom;

    const r1 = seededRandom(s + 130);
    const r2 = seededRandom(s + 131);

    const imgRow = Math.min(rows.length - 3, Math.max(1, Math.floor(rows.length * 0.25)));
    const imgY = rows[imgRow].y;
    const imgH = rowHeight * (r1 > 0.5 ? 3 : 2.5);
    const imgW = (columns[columns.length - 1].x + colWidth) - columns[0].x;
    appendSvgImageFrame(layerContent, columns[0].x, imgY, imgW, imgH, 'HORIZONTAL AXIS // LOOKBOOK 2026', entropyFactor);

    const crossColIdx = Math.max(1, Math.min(columns.length - 2, Math.floor(columns.length * (r2 > 0.5 ? 0.35 : 0.65))));
    const crossX = columns[crossColIdx].x + colWidth * 0.5;
    const crossH = (rows[rows.length - 1].y + rowHeight) - rows[0].y;
    const crossY = rows[rows.length - 1].y + rowHeight;
    const titleSize = baseScale * (2.4 + r1 * 0.5);

    appendSvgVerticalHeadline(layerContent, content.title, crossX, crossY, crossH, titleSize, '800', '#1d1d1f', entropyFactor > 0.7 ? 'red' : 'black', -90);

    const focalCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    focalCircle.setAttribute('cx', crossX);
    focalCircle.setAttribute('cy', imgY + imgH / 2);
    focalCircle.setAttribute('r', rowHeight * 0.85);
    focalCircle.setAttribute('fill', 'none');
    focalCircle.setAttribute('stroke', '#e63946');
    focalCircle.setAttribute('stroke-width', '1.5');
    layerContent.appendChild(focalCircle);

    const crossMark = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    crossMark.setAttribute('x', crossX);
    crossMark.setAttribute('y', imgY + imgH / 2 + 4);
    crossMark.setAttribute('font-family', 'JetBrains Mono, monospace');
    crossMark.setAttribute('font-size', '14');
    crossMark.setAttribute('font-weight', '700');
    crossMark.setAttribute('fill', '#e63946');
    crossMark.setAttribute('text-anchor', 'middle');
    crossMark.textContent = '+';
    layerContent.appendChild(crossMark);

    const leftCols = crossColIdx;
    const rightStartCol = crossColIdx + 1;
    const rightCols = columns.length - rightStartCol;

    const bodyY = imgY + imgH + rowHeight * 0.5;
    if (leftCols >= 2) {
      appendMultiColumnBody(layerContent, columns, 0, leftCols, colWidth, bodyY, h - margins.bottom - 5, bodyCopy, 1, baseScale);
    }
    if (rightCols >= 2) {
      appendStatBadge(layerContent, columns[rightStartCol].x, bodyY, (columns[columns.length - 1].x + colWidth) - columns[rightStartCol].x, rowHeight * 2, statItem.num, statItem.label, baseScale, entropyFactor);
      const subBodyY = bodyY + rowHeight * 2.3;
      if (subBodyY < h - margins.bottom - 15) {
        appendMultiColumnBody(layerContent, columns, rightStartCol, rightCols, colWidth, subBodyY, h - margins.bottom - 5, bodyCopy, 1, baseScale);
      }
    }
  }"""
assert target_end_canon in code, "target_end_canon not found"
code = code.replace(target_end_canon, new_archetypes_code)

# 4. Add appendSvgVerticalHeadline and appendTapeStripHeadline right after appendSvgText
old_append_text = """  function appendSvgText(parent, lines, x, startY, fontSize, lineSpacing, fontWeight, color, rotation = 0, ghostEffect = false) {"""

new_helpers_code = """  // -------------------------------------------------------------------------
  // TIPOGRAFIA VERTICAL 90° / -90° (VANGUARDA EDITORIAL / RUNNING SPINE)
  // -------------------------------------------------------------------------
  function appendSvgVerticalHeadline(parent, text, x, y, height, fontSize, fontWeight, color, bgStrip = false, dir = -90) {
    if (state.layoutManifest && (parent === layerContent || (parent && parent.closest && parent.closest('#LAYER_CONTENT')) || parent === null)) {
      state.layoutManifest.push({
        type: 'verticalHeadline',
        text: text,
        x: x,
        y: y,
        length: height,
        fontSize: fontSize,
        fontWeight: fontWeight,
        color: color,
        bgStrip: bgStrip,
        rotation: dir
      });
    }

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('transform', `translate(${x.toFixed(2)}, ${y.toFixed(2)}) rotate(${dir})`);

    measureCtx.font = `${fontWeight} ${fontSize}px Inter, sans-serif`;
    let textW = measureCtx.measureText(text.toUpperCase()).width;
    let finalFontSize = fontSize;
    if (textW > height && height > 20) {
      finalFontSize = Math.max(8, fontSize * (height / textW) * 0.95);
      measureCtx.font = `${fontWeight} ${finalFontSize}px Inter, sans-serif`;
      textW = measureCtx.measureText(text.toUpperCase()).width;
    }

    if (bgStrip) {
      const stripH = finalFontSize * 1.45;
      const stripRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      stripRect.setAttribute('x', '0');
      stripRect.setAttribute('y', dir === -90 ? (-stripH * 0.85).toFixed(2) : (-stripH * 0.15).toFixed(2));
      stripRect.setAttribute('width', (Math.min(height, textW + finalFontSize * 1.2)).toFixed(2));
      stripRect.setAttribute('height', stripH.toFixed(2));
      stripRect.setAttribute('fill', bgStrip === 'red' ? '#e63946' : '#1d1d1f');
      group.appendChild(stripRect);
    }

    const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textEl.setAttribute('x', '0');
    textEl.setAttribute('y', '0');
    textEl.setAttribute('font-family', 'Inter, -apple-system, sans-serif');
    textEl.setAttribute('font-weight', fontWeight);
    textEl.setAttribute('font-size', finalFontSize);
    textEl.setAttribute('fill', bgStrip ? '#ffffff' : color);
    textEl.setAttribute('letter-spacing', '2');
    textEl.textContent = text.toUpperCase();
    group.appendChild(textEl);

    if (parent) parent.appendChild(group);
  }

  // -------------------------------------------------------------------------
  // TARJAS NEGATIVAS INVERTIDAS ESCALONADAS (BRUTALIST TAPE STRIPS)
  // -------------------------------------------------------------------------
  function appendTapeStripHeadline(parent, lines, startX, startY, fontSize, lineSpacing, fontWeight, entropyFactor, s, columns, colWidth) {
    const step = fontSize * lineSpacing;
    const numCols = columns ? columns.length : 1;

    lines.forEach((lineStr, idx) => {
      let currentX = startX;
      if (entropyFactor > 0.35 && columns && numCols >= 4) {
        if (idx === 1) {
          const colJump = Math.min(numCols - 2, Math.max(1, Math.floor(seededRandom(s + 81 + idx) * (numCols * 0.4))));
          if (columns[colJump]) currentX = columns[colJump].x;
        } else if (idx >= 2) {
          const colJump = Math.min(numCols - 1, Math.floor(seededRandom(s + 82 + idx) * (numCols * 0.3)));
          if (columns[colJump]) currentX = columns[colJump].x;
        }
      }

      const currentY = startY + (idx * step);

      measureCtx.font = `${fontWeight} ${fontSize}px Inter, sans-serif`;
      const textW = measureCtx.measureText(lineStr).width;
      const padX = fontSize * 0.4;
      const padY = fontSize * 0.15;
      const boxW = textW + padX * 2;
      const boxH = fontSize * 1.32;

      const isRed = (idx === 0 && entropyFactor > 0.75) || (idx === lines.length - 1 && entropyFactor > 0.85);
      const boxColor = isRed ? '#e63946' : '#1d1d1f';

      if (state.layoutManifest && (parent === layerContent || (parent && parent.closest && parent.closest('#LAYER_CONTENT')) || parent === null)) {
        state.layoutManifest.push({
          type: 'tapeStrip',
          text: lineStr,
          x: currentX - padX,
          y: currentY - padY,
          width: boxW,
          height: boxH,
          fontSize: fontSize,
          fontWeight: fontWeight,
          boxColor: boxColor
        });
      }

      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', (currentX - padX).toFixed(2));
      rect.setAttribute('y', (currentY - padY).toFixed(2));
      rect.setAttribute('width', boxW.toFixed(2));
      rect.setAttribute('height', boxH.toFixed(2));
      rect.setAttribute('fill', boxColor);
      group.appendChild(rect);

      const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textEl.setAttribute('x', currentX.toFixed(2));
      textEl.setAttribute('y', (currentY + fontSize * 0.95 - padY).toFixed(2));
      textEl.setAttribute('font-family', 'Inter, -apple-system, sans-serif');
      textEl.setAttribute('font-weight', fontWeight);
      textEl.setAttribute('font-size', fontSize);
      textEl.setAttribute('fill', '#ffffff');
      textEl.textContent = lineStr;
      group.appendChild(textEl);

      if (parent) parent.appendChild(group);
    });
  }

  function appendSvgText(parent, lines, x, startY, fontSize, lineSpacing, fontWeight, color, rotation = 0, ghostEffect = false) {"""
assert old_append_text in code, "old_append_text not found"
code = code.replace(old_append_text, new_helpers_code)

# 5. Add vertical 90-degree metadata tag on image frames
old_img_end = """    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', x + width / 2);
    label.setAttribute('y', y + height / 2);
    label.setAttribute('font-family', 'JetBrains Mono, monospace');
    label.setAttribute('font-size', Math.max(5.5, Math.min(8, width * 0.05)));
    label.setAttribute('fill', '#86868b');
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('dominant-baseline', 'middle');
    label.textContent = labelText;
    group.appendChild(label);"""

new_img_end = """    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', x + width / 2);
    label.setAttribute('y', y + height / 2);
    label.setAttribute('font-family', 'JetBrains Mono, monospace');
    label.setAttribute('font-size', Math.max(5.5, Math.min(8, width * 0.05)));
    label.setAttribute('fill', '#86868b');
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('dominant-baseline', 'middle');
    label.textContent = labelText;
    group.appendChild(label);

    // Legenda Técnica Vertical 90° colada na calha externa da imagem
    if (entropyFactor > 0.28) {
      const vertTag = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      const tagX = x - 3.5;
      const tagY = y + height;
      vertTag.setAttribute('transform', `translate(${tagX.toFixed(2)}, ${tagY.toFixed(2)}) rotate(-90)`);
      vertTag.setAttribute('font-family', 'JetBrains Mono, monospace');
      vertTag.setAttribute('font-size', '5');
      vertTag.setAttribute('fill', entropyFactor > 0.65 ? '#e63946' : '#86868b');
      vertTag.setAttribute('letter-spacing', '1.2');
      vertTag.textContent = `[REF. 2026 // MODULAR ${Math.round(width)}x${Math.round(height)} // 90° AXIS]`;
      group.appendChild(vertTag);
    }"""
assert old_img_end in code, "old_img_end not found"
code = code.replace(old_img_end, new_img_end)

# 6. Add verticalHeadline and tapeStrip handling in generateInDesignJsxScript
old_jsx_block_case = """      } else if (block.type === 'text') {"""

new_jsx_block_case = """      } else if (block.type === 'verticalHeadline') {
        const safeText = block.text.replace(/\\\\/g, '\\\\\\\\').replace(/\"/g, '\\\\\"');
        const vLength = block.length || 150;
        const vWidth = Math.max(20, block.fontSize * 1.5);
        manifestScript += `
    // Headline Vertical 90° (Vanguarda Editorial)
    try {
        ${block.bgStrip ? `
        var vStrip${idx} = page.rectangles.add(framesLayer);
        vStrip${idx}.geometricBounds = [${(block.y - vLength).toFixed(2)}, ${block.x.toFixed(2)}, ${block.y.toFixed(2)}, ${(block.x + vWidth).toFixed(2)}];
        vStrip${idx}.contentType = ContentType.UNASSIGNED;
        vStrip${idx}.fillColor = ${block.bgStrip === 'red' ? 'doc.colors.item("Vermilion") || doc.colors.item("Black")' : 'doc.colors.item("Black")'};
        vStrip${idx}.strokeWeight = 0;
        ` : ''}
        var vFrame${idx} = page.textFrames.add(contentLayer);
        vFrame${idx}.geometricBounds = [${(block.y - vLength).toFixed(2)}, ${block.x.toFixed(2)}, ${block.y.toFixed(2)}, ${(block.x + vWidth).toFixed(2)}];
        vFrame${idx}.contents = \"${safeText.toUpperCase()}\";
        vFrame${idx}.paragraphs.item(0).appliedParagraphStyle = styleDisplay;
        if (${block.bgStrip ? 'true' : 'false'}) {
            vFrame${idx}.paragraphs.item(0).fillColor = doc.colors.item("Paper");
        }
        vFrame${idx}.rotationAngle = ${block.rotation || -90};
    } catch(e) {}
`;
      } else if (block.type === 'tapeStrip') {
        const safeText = block.text.replace(/\\\\/g, '\\\\\\\\').replace(/\"/g, '\\\\\"');
        manifestScript += `
    // Tarja Negativa de Alto Contraste (Tape Strip)
    try {
        var stripBg${idx} = page.rectangles.add(framesLayer);
        stripBg${idx}.geometricBounds = [${block.y.toFixed(2)}, ${block.x.toFixed(2)}, ${(block.y + block.height).toFixed(2)}, ${(block.x + block.width).toFixed(2)}];
        stripBg${idx}.contentType = ContentType.UNASSIGNED;
        stripBg${idx}.fillColor = ${block.boxColor === '#e63946' ? 'doc.colors.item("Vermilion") || doc.colors.item("Black")' : 'doc.colors.item("Black")'};
        stripBg${idx}.strokeWeight = 0;

        var stripText${idx} = page.textFrames.add(contentLayer);
        stripText${idx}.geometricBounds = [${block.y.toFixed(2)}, ${block.x.toFixed(2)}, ${(block.y + block.height).toFixed(2)}, ${(block.x + block.width).toFixed(2)}];
        stripText${idx}.contents = \"${safeText}\";
        stripText${idx}.paragraphs.item(0).appliedParagraphStyle = styleDisplay;
        stripText${idx}.paragraphs.item(0).fillColor = doc.colors.item("Paper");
    } catch(e) {}
`;
      } else if (block.type === 'text') {"""
assert old_jsx_block_case in code, "old_jsx_block_case not found"
code = code.replace(old_jsx_block_case, new_jsx_block_case)

with open(r'C:\Users\Marketing - Apolo\.gemini\antigravity-ide\scratch\layout-forge\app.js', 'w', encoding='utf-8') as f:
    f.write(code)

print('app.js updated successfully! Length:', len(code))
