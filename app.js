/**
 * LAYOUTFORGE — Motor Paramétrico de Grids, Guias & Diagramação Adaptativa
 * Inspiração: Josef Müller-Brockmann, Massimo Vignelli, Jan Tschichold, David Carson
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. ESTADO GLOBAL (STATE)
  // =========================================================================
  const state = {
    // Formato & Prancheta
    preset: 'a4_portrait',
    width: 210,         // na unidade selecionada
    height: 297,        // na unidade selecionada
    unit: 'mm',         // 'mm' | 'px' | 'pt' | 'cm'
    bleed: 3,           // em mm
    orientation: 'portrait',

    // Escola & Cânone de Grade
    school: 'swiss',    // 'swiss' | 'vandeGraaf' | 'bauhaus' | 'brutalist'
    cols: 6,
    rows: 8,
    gutter: 5,          // na unidade atual
    margin: 16,         // na unidade atual
    goldenMargins: false,

    // Motor Generativo & Diagramação
    entropy: 15,        // 0 a 100%
    archetype: 'random_infinite',
    activeProceduralArchetype: null,
    seed: 94021,
    textHierarchy: 'creative_auto', // 'creative_auto' | 'lead_and_body' | 'bilingual_dialogue' | 'quote_callout' | 'asymmetric_breathing' | 'classic_columns'

    // Visibilidade das Camadas
    showColumns: true,
    showRows: true,
    showMargins: true,
    showCanons: false,
    showBaseline: false,
    showContent: true,

    // Cores e Opacidade das Guias
    guideColor: 'monochrome',
    guideOpacity: 0.30,

    // Imagens, Mídia & Background Editorial
    imageCount: 'auto',          // 'auto' | 0 | 1 | 2 | 3 | 4 | 5 | 6
    imageDistribution: 'creative_auto', // 'creative_auto' | 'hero_dominant' | 'modular_balanced' | 'golden_tension' | 'staggered_rhythm'
    bgImageMode: 'none',         // 'none' | 'full_bleed' | 'hero_top' | 'bottom_half' | 'split_wing'
    bgTextContrast: true,        // inverte texto sobre o BG
    showBgImage: true,           // visibilidade da camada de fundo
    showImageFrames: true,       // visibilidade dos quadros de foto

    // Stage & Transform (Zoom / Pan)
    zoom: 1.0,
    panX: 0,
    panY: 0,
    isPanning: false,
    startX: 0,
    startY: 0,

    // Manifesto semântico de blocos para exportação 1:1 InDesign
    layoutManifest: []
  };

  // =========================================================================
  // 2. PRESETS DE TAMANHO
  // =========================================================================
  const presets = {
    a4_portrait:   { width: 210, height: 297, unit: 'mm', label: 'A4 Vertical' },
    a4_landscape:  { width: 297, height: 210, unit: 'mm', label: 'A4 Horizontal' },
    a3_portrait:   { width: 297, height: 420, unit: 'mm', label: 'A3 Poster' },
    poster_50x70:  { width: 500, height: 700, unit: 'mm', label: 'Poster 50x70 cm' },
    book_editorial:{ width: 140, height: 216, unit: 'mm', label: 'Livro Editorial' },
    square_print:  { width: 210, height: 210, unit: 'mm', label: 'Revista Quadrada' },
    ig_portrait:   { width: 1080, height: 1350, unit: 'px', label: 'Instagram Post 4:5' },
    ig_story:      { width: 1080, height: 1920, unit: 'px', label: 'Story / Reels 9:16' },
    screen_16_9:   { width: 1920, height: 1080, unit: 'px', label: 'Slide / Tela 16:9' },
    square_social: { width: 1080, height: 1080, unit: 'px', label: 'Post Quadrado 1:1' }
  };

  // Frases e Conteúdo Editorial para Composição
  const editorialPhrases = [
    { title: "NEUE FORMEN DER TYPOGRAFIE", sub: "Estética Racional & Construtiva", issue: "VOL. 01 / ED. 26" },
    { title: "ORDER, PROPORTION AND SPACE", sub: "O Vazio Ativo Como Linguagem", issue: "SYSTEMS / 04" },
    { title: "THE CANON OF PAGE DESIGN", sub: "Geometria Sagrada na Era Digital", issue: "FOLIO N° 82" },
    { title: "DECONSTRUCTION & ENTROPY", sub: "Quebrando os Eixos Ortogonais", issue: "RAY GUN / 94" },
    { title: "MODULAR GRID ARCHITECTURE", sub: "Harmonia Matemática Aplicada", issue: "MANIFESTO 12" }
  ];

  // Frases de Lead Monumental (Tamanho X para colunas de destaque, estilo Müller-Brockmann)
  const leadPhrases = [
    "Graphic design today still carries the imprint of the International Typographic Style.",
    "A clareza estrutural organiza o caos e liberta o olho para uma leitura intuitiva e precisa.",
    "Order, proportion and space: o vazio ativo como linguagem visual e autoridade cognitiva.",
    "A grelha tipográfica não é uma camisa de força, mas sim um instrumento de liberdade orquestrada.",
    "A visual communication manual: o grid como método universal de arquitetura gráfica.",
    "Na tradição suíça, a coerência estrutural é um dever moral com o entendimento do leitor.",
    "Quando tudo grita, nada é ouvido. A hierarquia se estabelece pela coragem de subtrair."
  ];

  // Micro-Etiquetas e Rótulos Técnicos para Colunas de Respiro
  const subLabels = [
    "SWISS STYLE // 1957",
    "SECTION 01 // TYPOGRAPHY",
    "GRID SYSTEMS // MANUAL",
    "JOSEF MÜLLER-BROCKMANN",
    "ZURICH // BASEL SCHOOL",
    "RATIONELLE GESTALTUNG",
    "NEUE GRAFIK // ARCHIVE"
  ];

  const bodyTexts = [
    "Photography and illustration, when used, are integrated with precision. Imagery aligns with the grid, reinforces the message, and avoids decoration for its own sake. Visuals are selected for relevance and clarity, not mood or trend.",
    "Swiss style promotes the idea that design should be invisible. The layout should not call attention to itself, but support the content it holds. Typography, spacing, and composition work quietly in the background.",
    "There is no sense of urgency or embellishment — just measured, methodical composition. This sense of restraint gives the work a timeless and confident quality.",
    "A grelha tipográfica não é uma camisa de força, mas sim um instrumento de liberdade orquestrada. Ela introduz ordem nas partes constituintes de uma composição, permitindo ao olho navegar com clareza cognitiva sem perder a tensão formal.",
    "O espaço em branco não representa o vazio ou a ausência; ele é o suporte ativo que confere autoridade e respiro à mensagem. Quando tudo grita, nada é ouvido. A hierarquia se estabelece pela coragem de subtrair o ornamento.",
    "Na tradição suíça de Müller-Brockmann e Vignelli, a coerência estrutural é um dever moral do designer com o leitor. Cada título, legenda e fotografia deve ancorar-se em um eixo comum, criando ressonância harmônica."
  ];

  // =========================================================================
  // 3. SELEÇÃO DE ELEMENTOS DO DOM
  // =========================================================================
  const presetSelect = document.getElementById('presetSelect');
  const inputWidth = document.getElementById('inputWidth');
  const inputHeight = document.getElementById('inputHeight');
  const unitLabelW = document.getElementById('unitLabelW');
  const unitLabelH = document.getElementById('unitLabelH');
  const unitSelect = document.getElementById('unitSelect');
  const bleedInput = document.getElementById('bleedInput');
  const btnSwapOrientation = document.getElementById('btnSwapOrientation');

  const schoolSelector = document.getElementById('schoolSelector');
  const colsSlider = document.getElementById('colsSlider');
  const colsVal = document.getElementById('colsVal');
  const rowsSlider = document.getElementById('rowsSlider');
  const rowsVal = document.getElementById('rowsVal');
  const gutterSlider = document.getElementById('gutterSlider');
  const gutterVal = document.getElementById('gutterVal');
  const marginSlider = document.getElementById('marginSlider');
  const marginVal = document.getElementById('marginVal');
  const checkGoldenMargins = document.getElementById('checkGoldenMargins');

  const entropySlider = document.getElementById('entropySlider');
  const entropyVal = document.getElementById('entropyVal');
  const layoutArchetype = document.getElementById('layoutArchetype');
  const textHierarchySelect = document.getElementById('textHierarchySelect');
  const btnRollLayout = document.getElementById('btnRollLayout');
  const btnResetLayout = document.getElementById('btnResetLayout');
  const currentSeedTag = document.getElementById('currentSeedTag');

  // Controles de Imagens, Slots & Background (Seção 04)
  const imageCountBadge = document.getElementById('imageCountBadge');
  const imageCountChips = document.getElementById('imageCountChips');
  const imageCountDesc = document.getElementById('imageCountDesc');
  const imageDistributionGroup = document.getElementById('imageDistributionGroup');
  const imageDistributionSelect = document.getElementById('imageDistributionSelect');
  const bgImageModeSelect = document.getElementById('bgImageModeSelect');
  const bgContrastRow = document.getElementById('bgContrastRow');
  const checkBgTextContrast = document.getElementById('checkBgTextContrast');

  // Visibilidade das Camadas (Seção 05)
  const showColumnsCheck = document.getElementById('showColumns');
  const showRowsCheck = document.getElementById('showRows');
  const showMarginsCheck = document.getElementById('showMargins');
  const showCanonsCheck = document.getElementById('showCanons');
  const showBaselineCheck = document.getElementById('showBaseline');
  const showContentCheck = document.getElementById('showContent');
  const showBgImageCheck = document.getElementById('showBgImage');
  const showImageFramesCheck = document.getElementById('showImageFrames');
  const guideColorSelect = document.getElementById('guideColor');
  const guideOpacitySelect = document.getElementById('guideOpacity');

  const artboardStage = document.getElementById('artboardStage');
  const artboardTransform = document.getElementById('artboardTransform');
  const artboardPaper = document.getElementById('artboardPaper');
  const canvasSvg = document.getElementById('canvasSvg');
  const bleedGuide = document.getElementById('bleedGuide');

  const layerBackground = document.getElementById('layerBackground');
  const layerFrames = document.getElementById('layerFrames');
  const layerMargins = document.getElementById('layerMargins');
  const layerColumns = document.getElementById('layerColumns');
  const layerModules = document.getElementById('layerModules');
  const layerCanons = document.getElementById('layerCanons');
  const layerBaseline = document.getElementById('layerBaseline');
  const layerContent = document.getElementById('layerContent');

  const specRatio = document.getElementById('specRatio');
  const specTotalCells = document.getElementById('specTotalCells');
  const specDimReal = document.getElementById('specDimReal');
  const topbarFormatName = document.getElementById('topbarFormatName');
  const topbarSchoolName = document.getElementById('topbarSchoolName');
  const badgeDims = document.getElementById('badgeDims');
  const badgeRatio = document.getElementById('badgeRatio');
  const zoomPercent = document.getElementById('zoomPercent');

  const btnZoomIn = document.getElementById('btnZoomIn');
  const btnZoomOut = document.getElementById('btnZoomOut');
  const btnFitScreen = document.getElementById('btnFitScreen');
  const btnToggleSidebar = document.getElementById('btnToggleSidebar');
  const sidebar = document.getElementById('sidebar');

  const btnCopySvg = document.getElementById('btnCopySvg');
  const btnExportPdf = document.getElementById('btnExportPdf');
  const btnExportSvg = document.getElementById('btnExportSvg');
  const btnExportPngDirect = document.getElementById('btnExportPngDirect');
  const btnExportInDesign = document.getElementById('btnExportInDesign');
  const btnMoreExport = document.getElementById('btnMoreExport');
  const moreExportDropdown = document.getElementById('moreExportDropdown');
  const btnExportJson = document.getElementById('btnExportJson');
  const btnExportPng = document.getElementById('btnExportPng');
  const btnSaveWithPicker = document.getElementById('btnSaveWithPicker');
  const btnOpenInBrowser = document.getElementById('btnOpenInBrowser');
  const btnOpenDownloads = document.getElementById('btnOpenDownloads');

  const appleToast = document.getElementById('appleToast');

  // =========================================================================
  // 4. MATEMÁTICA DE CONVERSÃO & LAYOUT
  // =========================================================================

  // Conversor de unidades para milímetros (base física interna)
  function toMillimeters(val, unit) {
    switch (unit) {
      case 'mm': return val;
      case 'cm': return val * 10;
      case 'pt': return val * 0.352778; // 1pt = 25.4 / 72 mm
      case 'px': return val * 0.264583; // 96 DPI padrão
      default: return val;
    }
  }

  // De milímetros para a unidade atual
  function fromMillimeters(valMm, targetUnit) {
    switch (targetUnit) {
      case 'mm': return valMm;
      case 'cm': return valMm / 10;
      case 'pt': return valMm / 0.352778;
      case 'px': return valMm / 0.264583;
      default: return valMm;
    }
  }

  // Obter proporção do formato (ex: 1:1.414, 16:9, etc.)
  function getRatioText(w, h) {
    const ratio = (h / w).toFixed(2);
    if (Math.abs(ratio - 1.41) < 0.03) return '1:1.414 (√2 DIN)';
    if (Math.abs(ratio - 1.62) < 0.03) return '1:1.618 (Áurea)';
    if (Math.abs(ratio - 1.00) < 0.03) return '1:1 (Quadrado)';
    if (Math.abs(ratio - 0.56) < 0.03) return '16:9 (Panorâmico)';
    if (Math.abs(ratio - 1.25) < 0.03) return '4:5 (Instagram)';
    if (Math.abs(ratio - 1.78) < 0.03) return '9:16 (Vertical)';
    return `1:${ratio}`;
  }

  // Gerador pseudo-aleatório baseado em Seed para reprodutibilidade
  function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // Retorna paleta de cores das guias
  function getGuideColorHex() {
    switch (state.guideColor) {
      case 'blueprint': return '#0071e3';
      case 'editorial': return '#e63946';
      case 'subtle': return '#86868b';
      case 'monochrome':
      default: return '#1d1d1f';
    }
  }

  // =========================================================================
  // 5. CÁLCULO DAS GRADES & MARGENS
  // =========================================================================
  function calculateGeometry() {
    const w = state.width;
    const h = state.height;

    // Cálculo das margens
    let margins = {
      top: state.margin,
      right: state.margin,
      bottom: state.margin,
      left: state.margin
    };

    if (state.goldenMargins || state.school === 'vandeGraaf') {
      // Cânone 2:3:4:6 (Van de Graaf / Tschichold)
      const baseM = state.margin * 0.75;
      margins = {
        left: baseM * 2,    // Margem interna / lombada
        top: baseM * 3,     // Margem superior (cabeço)
        right: baseM * 4,   // Margem externa
        bottom: baseM * 6   // Margem inferior (pé)
      };
    }

    const usableW = Math.max(10, w - (margins.left + margins.right));
    const usableH = Math.max(10, h - (margins.top + margins.bottom));

    // Colunas
    const colWidth = (usableW - (state.cols - 1) * state.gutter) / state.cols;
    const columns = [];
    for (let i = 0; i < state.cols; i++) {
      const x = margins.left + i * (colWidth + state.gutter);
      columns.push({ index: i, x, width: colWidth });
    }

    // Módulos Verticais (Linhas)
    const rowHeight = (usableH - (state.rows - 1) * state.gutter) / state.rows;
    const rows = [];
    for (let j = 0; j < state.rows; j++) {
      const y = margins.top + j * (rowHeight + state.gutter);
      rows.push({ index: j, y, height: rowHeight });
    }

    return { w, h, margins, usableW, usableH, colWidth, rowHeight, columns, rows };
  }

  // =========================================================================
  // 6. RENDERIZADOR SVG DO CANVAS
  // =========================================================================
  function renderArtboard() {
    const geom = calculateGeometry();
    const { w, h, margins, colWidth, rowHeight, columns, rows } = geom;

    // Configura tamanho físico no DOM do papel da prancheta
    const scale = getScreenScaleFactor();
    const screenW = w * scale;
    const screenH = h * scale;

    artboardPaper.style.width = `${screenW}px`;
    artboardPaper.style.height = `${screenH}px`;

    // Atualiza viewBox vetorial
    canvasSvg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    canvasSvg.setAttribute('width', screenW);
    canvasSvg.setAttribute('height', screenH);

    // Atualiza Bleed visual
    const bleedPx = state.bleed * scale;
    bleedGuide.style.top = `-${bleedPx}px`;
    bleedGuide.style.left = `-${bleedPx}px`;
    bleedGuide.style.right = `-${bleedPx}px`;
    bleedGuide.style.bottom = `-${bleedPx}px`;

    // Limpa camadas
    if (layerBackground) layerBackground.innerHTML = '';
    if (layerFrames) layerFrames.innerHTML = '';
    layerMargins.innerHTML = '';
    layerColumns.innerHTML = '';
    layerModules.innerHTML = '';
    layerCanons.innerHTML = '';
    layerBaseline.innerHTML = '';
    layerContent.innerHTML = '';

    const color = getGuideColorHex();
    const opacity = state.guideOpacity;

    // 1. CAMADA DE MARGENS
    if (state.showMargins) {
      const marginRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      marginRect.setAttribute('x', margins.left);
      marginRect.setAttribute('y', margins.top);
      marginRect.setAttribute('width', geom.usableW);
      marginRect.setAttribute('height', geom.usableH);
      marginRect.setAttribute('fill', 'none');
      marginRect.setAttribute('stroke', color);
      marginRect.setAttribute('stroke-width', '1');
      marginRect.setAttribute('stroke-dasharray', '4 4');
      marginRect.setAttribute('opacity', opacity * 1.3);
      layerMargins.appendChild(marginRect);
    }

    // 2. CAMADA DE COLUNAS
    if (state.showColumns) {
      columns.forEach(col => {
        const colRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        colRect.setAttribute('x', col.x);
        colRect.setAttribute('y', margins.top);
        colRect.setAttribute('width', col.width);
        colRect.setAttribute('height', geom.usableH);
        colRect.setAttribute('fill', color);
        colRect.setAttribute('fill-opacity', opacity * 0.18);
        colRect.setAttribute('stroke', color);
        colRect.setAttribute('stroke-width', '0.75');
        colRect.setAttribute('stroke-opacity', opacity);
        layerColumns.appendChild(colRect);
      });
    }

    // 3. CAMADA DE MÓDULOS VERTICAIS (HANG-LINES)
    if (state.showRows) {
      rows.forEach(row => {
        const rowLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rowLine.setAttribute('x1', margins.left);
        rowLine.setAttribute('y1', row.y);
        rowLine.setAttribute('x2', w - margins.right);
        rowLine.setAttribute('y2', row.y);
        rowLine.setAttribute('stroke', color);
        rowLine.setAttribute('stroke-width', '0.75');
        rowLine.setAttribute('stroke-opacity', opacity * 0.7);
        layerModules.appendChild(rowLine);

        // Linha final do módulo
        const rowEndLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        rowEndLine.setAttribute('x1', margins.left);
        rowEndLine.setAttribute('y1', row.y + row.height);
        rowEndLine.setAttribute('x2', w - margins.right);
        rowEndLine.setAttribute('y2', row.y + row.height);
        rowEndLine.setAttribute('stroke', color);
        rowEndLine.setAttribute('stroke-width', '0.5');
        rowEndLine.setAttribute('stroke-dasharray', '2 2');
        rowEndLine.setAttribute('stroke-opacity', opacity * 0.5);
        layerModules.appendChild(rowEndLine);
      });
    }

    // 4. CAMADA DE CANÔNES & DIAGONAIS
    if (state.showCanons || state.school === 'vandeGraaf' || state.school === 'bauhaus') {
      renderDiagonalsAndCanons(geom, color, opacity);
    }

    // 5. CAMADA DE BASELINE
    if (state.showBaseline) {
      const baselineStep = Math.max(3, rowHeight / 6);
      for (let y = margins.top; y <= h - margins.bottom; y += baselineStep) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', margins.left);
        line.setAttribute('y1', y);
        line.setAttribute('x2', w - margins.right);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width', '0.4');
        line.setAttribute('stroke-opacity', opacity * 0.35);
        layerBaseline.appendChild(line);
      }
    }

    // 6. MOTOR DE DIAGRAMAÇÃO & CONTEÚDO (LAYOUT ENGINE)
    state.layoutManifest = [];
    if (state.showBgImage && state.bgImageMode !== 'none') {
      try {
        renderBackgroundImageLayer(geom, state.entropy / 100);
      } catch (bgErr) {
        console.error('Erro ao renderizar camada de fundo BG:', bgErr);
      }
    }
    if (state.showContent) {
      try {
        renderGenerativeContent(geom);
      } catch (renderErr) {
        console.error('Erro ao renderizar conteúdo generativo:', renderErr);
      }
    }

    // Atualiza status bars e métricas técnicas
    updateStatsDisplay(geom);
  }

  // Renderiza Cânones Clássicos e Linhas Axiais (Bauhaus / Tschichold)
  function renderDiagonalsAndCanons(geom, color, opacity) {
    const { w, h, margins } = geom;

    // Diagonal Primária da Página (Jan Tschichold / Villard)
    const diag1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    diag1.setAttribute('x1', '0');
    diag1.setAttribute('y1', '0');
    diag1.setAttribute('x2', w);
    diag1.setAttribute('y2', h);
    diag1.setAttribute('stroke', color);
    diag1.setAttribute('stroke-width', '0.8');
    diag1.setAttribute('stroke-dasharray', '6 3');
    diag1.setAttribute('stroke-opacity', opacity * 1.1);
    layerCanons.appendChild(diag1);

    const diag2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    diag2.setAttribute('x1', w);
    diag2.setAttribute('y1', '0');
    diag2.setAttribute('x2', '0');
    diag2.setAttribute('y2', h);
    diag2.setAttribute('stroke', color);
    diag2.setAttribute('stroke-width', '0.8');
    diag2.setAttribute('stroke-dasharray', '6 3');
    diag2.setAttribute('stroke-opacity', opacity * 1.1);
    layerCanons.appendChild(diag2);

    // Se for Bauhaus: Linha de Tensão Axial a 45° ou Ponto Áureo
    if (state.school === 'bauhaus') {
      const goldenX = w * 0.618;
      const goldenY = h * 0.382;

      // Círculo concêntrico de tensão visual
      const focalCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      focalCircle.setAttribute('cx', goldenX);
      focalCircle.setAttribute('cy', goldenY);
      focalCircle.setAttribute('r', Math.min(w, h) * 0.18);
      focalCircle.setAttribute('fill', 'none');
      focalCircle.setAttribute('stroke', color);
      focalCircle.setAttribute('stroke-width', '0.75');
      focalCircle.setAttribute('stroke-opacity', opacity * 0.8);
      layerCanons.appendChild(focalCircle);

      // Linha axial cruzando o foco
      const axisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      axisLine.setAttribute('x1', '0');
      axisLine.setAttribute('y1', goldenY * 1.6);
      axisLine.setAttribute('x2', w);
      axisLine.setAttribute('y2', goldenY * 0.4);
      axisLine.setAttribute('stroke', '#e63946');
      axisLine.setAttribute('stroke-width', '1');
      axisLine.setAttribute('stroke-opacity', opacity * 1.2);
      layerCanons.appendChild(axisLine);
    }
  }

  // =========================================================================
  // 7. MOTOR DE DIAGRAMAÇÃO GENERATIVA COM ENTROPIA (LAYOUT ENGINE)
  // =========================================================================
  // =========================================================================
  // 7. MOTOR DE MEDIÇÃO TIPOGRÁFICA & DIAGRAMAÇÃO GENERATIVA
  // =========================================================================

  // Canvas invisível para medição precisa de larguras no sistema de coordenadas
  const measureCanvas = document.createElement('canvas');
  const measureCtx = measureCanvas.getContext('2d');

  function measureTextWidth(text, fontSize, fontWeight = '400', fontFamily = 'Inter, sans-serif') {
    measureCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    return measureCtx.measureText(text).width;
  }

  // Retorna o tamanho mínimo seguro relativo à unidade ativa (mm, cm, pt, px)
  function getMinUnitSize(sizeInPt) {
    if (state.unit === 'mm') return sizeInPt * 0.3528;
    if (state.unit === 'cm') return sizeInPt * 0.03528;
    if (state.unit === 'px') return sizeInPt * 1.8;
    return sizeInPt;
  }

  // Quebra de texto inteligente que respeita estritamente a largura máxima permitida
  function wrapTextToWidth(text, maxWidth, fontSize, fontWeight = '400', fontFamily = 'Inter, sans-serif') {
    measureCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    const words = text.split(/\s+/);
    const lines = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      
      // Quebra forçada de palavra caso ela sozinha seja maior que a coluna
      if (measureCtx.measureText(word).width > maxWidth) {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = '';
        }
        let tempWord = '';
        for (let char of word) {
          if (measureCtx.measureText(tempWord + char + '-').width > maxWidth) {
            lines.push(tempWord + '-');
            tempWord = char;
          } else {
            tempWord += char;
          }
        }
        word = tempWord;
      }

      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = measureCtx.measureText(testLine).width;

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = word;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  }

  // Ajuste algorítmico de escala (Copyfitting): reduz o tamanho da fonte se o título exceder a largura
  function fitHeadline(text, maxWidth, initialSize, maxHeight, fontFamily = 'Inter, sans-serif') {
    let size = initialSize;
    let lines = [];

    while (size >= 8) {
      lines = wrapTextToWidth(text, maxWidth, size, '800', fontFamily);
      measureCtx.font = `800 ${size}px ${fontFamily}`;
      const widest = Math.max(...lines.map(l => measureCtx.measureText(l).width));
      const totalHeight = lines.length * (size * 1.15);

      if (widest <= maxWidth && totalHeight <= maxHeight) {
        break;
      }
      size -= 0.5;
    }
    return { size, lines };
  }

  // =========================================================================
  // 7. MOTOR DE ZONEAMENTO ESPACIAL & DIAGRAMAÇÃO PROCEDURAL INFINITA
  // =========================================================================

  const calloutStats = [
    { num: "01", label: "PRINCÍPIO MODULAR // SISTEMA RACIONAL" },
    { num: "84%", label: "COERÊNCIA ESTRUTURAL E COGNITIVA" },
    { num: "√2", label: "PROPORÇÃO HARMÔNICA DA PÁGINA" },
    { num: "1:1.6", label: "SEÇÃO ÁUREA E TENSÃO FORMAL" },
    { num: "12", label: "COLUNAS DE RESSONÂNCIA VISUAL" }
  ];

  const pullQuotes = [
    "«O espaço em branco não é ausência; é o elemento ativo que confere autoridade à mensagem.»",
    "«A grelha tipográfica organiza o caos e liberta o olho para uma leitura intuitiva.»",
    "«Ordem sem liberdade é tirania; liberdade sem ordem é caos puro.» — Karl Gerstner"
  ];

    const allArchetypesList = [
    'vertical_spine_90',
    'brutalist_tape_strips',
    'cross_axis_avantgarde',
    'swiss_monumental_top',
    'swiss_bottom_anchor',
    'swiss_split_spine',
    'swiss_center_belt',
    'swiss_modular_quads',
    'swiss_inverted_field',
    'constructivist_tension',
    'brutalist_data_matrix',
    'classical_book_canon',
    'swiss_typographic_pure'
  ];

  function getArchetypeName(arch) {
    const names = {
      'random_infinite': 'Infinitas Variações Procedurais',
      'vertical_spine_90': 'Vanguarda 90°: Headline Monumental',
      'brutalist_tape_strips': 'Pós-Moderno: Tarjas Negativas',
      'cross_axis_avantgarde': 'Biaxial 90°: Eixos Cruzados',
      'swiss_monumental_top': 'Suíço: Headline Topo + Galeria',
      'swiss_bottom_anchor': 'Suíço: Ancoragem no Rodapé',
      'swiss_split_spine': 'Suíço: Coluna Espinha Split',
      'swiss_center_belt': 'Suíço: Cinturão Central',
      'swiss_typographic_pure': 'Manifesto Tipográfico Puro',
      'swiss_modular_quads': 'Matriz Gerstner: Multi-Imagens',
      'swiss_inverted_field': 'Bloco Invertido B&W',
      'classical_book_canon': 'Canônico: Diagramação Clássica',
      'constructivist_tension': 'Construtivista: Tensão Axial',
      'brutalist_data_matrix': 'Brutalista: Matriz Celular'
    };
    return names[arch] || 'Composição Paramétrica';
  }

  // =========================================================================
  // SISTEMA ADAPTATIVO DE IMAGENS, MÍDIA & BACKGROUND (SEÇÃO 04)
  // =========================================================================

  function getAdaptiveTextColor(geom, targetY = 0) {
    if (state.bgImageMode === 'none' || !state.bgTextContrast || !state.showBgImage) {
      return {
        title: '#1d1d1f',
        sub: '#6e6e73',
        body: '#1d1d1f',
        meta: '#6e6e73',
        isOverBg: false
      };
    }

    if (state.bgImageMode === 'full_bleed') {
      return {
        title: '#ffffff',
        sub: '#d1d1d6',
        body: '#f5f5f7',
        meta: '#d1d1d6',
        isOverBg: true
      };
    }

    if (state.bgImageMode === 'hero_top') {
      const thresholdY = geom.h * 0.48;
      if (targetY <= thresholdY) {
        return {
          title: '#ffffff',
          sub: '#d1d1d6',
          body: '#ffffff',
          meta: '#d1d1d6',
          isOverBg: true
        };
      } else {
        return {
          title: '#1d1d1f',
          sub: '#6e6e73',
          body: '#1d1d1f',
          meta: '#6e6e73',
          isOverBg: false
        };
      }
    }

    if (state.bgImageMode === 'bottom_half') {
      const thresholdY = geom.h * 0.50;
      if (targetY >= thresholdY) {
        return {
          title: '#ffffff',
          sub: '#d1d1d6',
          body: '#f5f5f7',
          meta: '#d1d1d6',
          isOverBg: true
        };
      } else {
        return {
          title: '#1d1d1f',
          sub: '#6e6e73',
          body: '#1d1d1f',
          meta: '#6e6e73',
          isOverBg: false
        };
      }
    }

    if (state.bgImageMode === 'split_wing') {
      return {
        title: '#ffffff',
        sub: '#d1d1d6',
        body: '#1d1d1f',
        meta: '#6e6e73',
        isOverBg: true
      };
    }

    return {
      title: '#1d1d1f',
      sub: '#6e6e73',
      body: '#1d1d1f',
      meta: '#6e6e73',
      isOverBg: false
    };
  }

  function getEffectiveImageCount(defaultCount) {
    if (state.imageCount === 'auto') return defaultCount;
    return parseInt(state.imageCount, 10);
  }

  function appendSvgBackgroundImageFrame(parent, x, y, width, height, labelText, entropyFactor = 0) {
    if (width <= 0 || height <= 0) return;
    if (!state.showBgImage) return;

    if (state.layoutManifest) {
      state.layoutManifest.unshift({
        type: 'image',
        isBg: true,
        x: x,
        y: y,
        width: width,
        height: height,
        label: labelText
      });
    }

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'bg-image-frame-group');

    // Fundo fotográfico simulado (tom escuro grafite sofisticado de editorial)
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('fill', '#1c1c1f');
    group.appendChild(rect);

    // Diagonais técnicas de quadro fotográfico padrão InDesign
    const c1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    c1.setAttribute('x1', x); c1.setAttribute('y1', y);
    c1.setAttribute('x2', x + width); c1.setAttribute('y2', y + height);
    c1.setAttribute('stroke', '#2c2c30'); c1.setAttribute('stroke-width', '0.75');
    group.appendChild(c1);

    const c2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    c2.setAttribute('x1', x + width); c2.setAttribute('y1', y);
    c2.setAttribute('x2', x); c2.setAttribute('y2', y + height);
    c2.setAttribute('stroke', '#2c2c30'); c2.setAttribute('stroke-width', '0.75');
    group.appendChild(c2);

    // Scrim gradiente semi-transparente para legibilidade cinematográfica dos textos por cima
    const scrim = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    scrim.setAttribute('x', x);
    scrim.setAttribute('y', y);
    scrim.setAttribute('width', width);
    scrim.setAttribute('height', height);
    scrim.setAttribute('fill', '#000000');
    scrim.setAttribute('opacity', '0.35');
    group.appendChild(scrim);

    // Marca d'água técnica discreta
    const tag = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    tag.setAttribute('x', x + width / 2);
    tag.setAttribute('y', y + height * 0.90);
    tag.setAttribute('font-family', 'JetBrains Mono, monospace');
    tag.setAttribute('font-size', Math.max(5.5, Math.min(8, width * 0.035)));
    tag.setAttribute('fill', '#ffffff');
    tag.setAttribute('opacity', '0.45');
    tag.setAttribute('text-anchor', 'middle');
    tag.textContent = `[ ${labelText} — Ctrl+D no InDesign ]`;
    group.appendChild(tag);

    if (parent) parent.appendChild(group);
  }

  function renderBackgroundImageLayer(geom, entropyFactor = 0) {
    if (!layerBackground) return;
    layerBackground.innerHTML = '';
    if (state.bgImageMode === 'none' || !state.showBgImage) return;

    const { w, h, rows, columns, colWidth, rowHeight } = geom;
    const bleed = state.bleed || 3;

    let bgX = 0, bgY = 0, bgW = w, bgH = h;
    let bgLabel = 'BACKGROUND PHOTOGRAPHY // FULL BLEED';

    if (state.bgImageMode === 'full_bleed') {
      bgX = -bleed;
      bgY = -bleed;
      bgW = w + (bleed * 2);
      bgH = h + (bleed * 2);
      bgLabel = 'BACKGROUND PHOTO // FULL BLEED';
    } else if (state.bgImageMode === 'hero_top') {
      const topRows = Math.max(2, Math.floor(rows.length * 0.45));
      bgX = -bleed;
      bgY = -bleed;
      bgW = w + (bleed * 2);
      bgH = (rows[topRows - 1].y + rowHeight) + bleed;
      bgLabel = 'HERO BACKGROUND // TOP BLEED';
    } else if (state.bgImageMode === 'bottom_half') {
      const startRow = Math.floor(rows.length * 0.5);
      bgX = -bleed;
      bgY = rows[startRow].y;
      bgW = w + (bleed * 2);
      bgH = (h - bgY) + bleed;
      bgLabel = 'BACKGROUND PHOTO // LOWER FIELD';
    } else if (state.bgImageMode === 'split_wing') {
      const splitCol = Math.floor(columns.length * 0.5);
      bgX = -bleed;
      bgY = -bleed;
      bgW = (columns[splitCol - 1].x + colWidth) + bleed;
      bgH = h + (bleed * 2);
      bgLabel = 'SPLIT BACKGROUND // LEFT WING';
    }

    appendSvgBackgroundImageFrame(layerBackground, bgX, bgY, bgW, bgH, bgLabel, entropyFactor);
  }

  function distributeCreativeImageSlots(parent, colStart, colSpan, rowStart, rowSpan, requestedCount, geom, entropyFactor, s, labelPrefix, distributionStyle = 'creative_auto') {
    if (!state.showImageFrames) return [];
    const count = (requestedCount === 'auto') ? 1 : parseInt(requestedCount, 10);
    if (count <= 0) return [];
    if (colSpan <= 0 || rowSpan <= 0) return [];

    const { columns, rows, colWidth, rowHeight } = geom;
    const safeColSpan = Math.max(1, Math.min(columns.length - colStart, colSpan));
    const safeRowSpan = Math.max(1, Math.min(rows.length - rowStart, rowSpan));
    const slots = [];

    function addSlot(cStart, cCount, rStart, rCount, slotLabel) {
      const sc = Math.max(0, Math.min(columns.length - 1, cStart));
      const ec = Math.max(sc, Math.min(columns.length - 1, cStart + cCount - 1));
      const sr = Math.max(0, Math.min(rows.length - 1, rStart));
      const er = Math.max(sr, Math.min(rows.length - 1, rStart + rCount - 1));

      const x = columns[sc].x;
      const w = (columns[ec].x + colWidth) - x;
      const y = rows[sr].y;
      const h = (rows[er].y + rowHeight) - y;

      if (w > 0 && h > 0) {
        appendSvgImageFrame(parent, x, y, w, h, slotLabel, entropyFactor);
        slots.push({ x, y, width: w, height: h, label: slotLabel });
      }
    }

    if (count === 1) {
      addSlot(colStart, safeColSpan, rowStart, safeRowSpan, `${labelPrefix} // HERO 01`);
    } else if (count === 2) {
      if (safeColSpan >= 2 && (safeRowSpan <= 3 || distributionStyle === 'golden_tension' || distributionStyle === 'modular_balanced')) {
        let splitCol = Math.floor(safeColSpan / 2);
        if (distributionStyle === 'golden_tension' && safeColSpan >= 3) {
          splitCol = Math.max(1, Math.round(safeColSpan * 0.62));
        }
        addSlot(colStart, splitCol, rowStart, safeRowSpan, `${labelPrefix} // 01`);
        addSlot(colStart + splitCol, safeColSpan - splitCol, rowStart, safeRowSpan, `${labelPrefix} // 02`);
      } else {
        const splitRow = Math.max(1, Math.floor(safeRowSpan / 2));
        addSlot(colStart, safeColSpan, rowStart, splitRow, `${labelPrefix} // UPPER`);
        addSlot(colStart, safeColSpan, rowStart + splitRow, safeRowSpan - splitRow, `${labelPrefix} // LOWER`);
      }
    } else if (count === 3) {
      if (distributionStyle === 'modular_balanced' && safeColSpan >= 3) {
        const c1 = Math.floor(safeColSpan / 3);
        const c2 = Math.floor((safeColSpan - c1) / 2);
        const c3 = safeColSpan - c1 - c2;
        addSlot(colStart, c1, rowStart, safeRowSpan, `${labelPrefix} // A`);
        addSlot(colStart + c1, c2, rowStart, safeRowSpan, `${labelPrefix} // B`);
        addSlot(colStart + c1 + c2, c3, rowStart, safeRowSpan, `${labelPrefix} // C`);
      } else if (safeColSpan >= 3 && safeRowSpan >= 2) {
        const heroCols = Math.max(1, Math.round(safeColSpan * 0.6));
        const subCols = safeColSpan - heroCols;
        const splitRow = Math.max(1, Math.floor(safeRowSpan / 2));
        addSlot(colStart, heroCols, rowStart, safeRowSpan, `${labelPrefix} // HERO`);
        addSlot(colStart + heroCols, subCols, rowStart, splitRow, `${labelPrefix} // DETAIL 01`);
        addSlot(colStart + heroCols, subCols, rowStart + splitRow, safeRowSpan - splitRow, `${labelPrefix} // DETAIL 02`);
      } else {
        const splitRow = Math.max(1, Math.floor(safeRowSpan * 0.5));
        const splitCol = Math.max(1, Math.floor(safeColSpan * 0.5));
        addSlot(colStart, safeColSpan, rowStart, splitRow, `${labelPrefix} // PANORAMA`);
        addSlot(colStart, splitCol, rowStart + splitRow, safeRowSpan - splitRow, `${labelPrefix} // SUB 01`);
        addSlot(colStart + splitCol, safeColSpan - splitCol, rowStart + splitRow, safeRowSpan - splitRow, `${labelPrefix} // SUB 02`);
      }
    } else if (count === 4) {
      if (distributionStyle === 'hero_dominant' && safeRowSpan >= 3) {
        const topRows = Math.max(1, Math.floor(safeRowSpan * 0.55));
        const botRows = safeRowSpan - topRows;
        addSlot(colStart, safeColSpan, rowStart, topRows, `${labelPrefix} // HERO WIDE`);
        const c1 = Math.floor(safeColSpan / 3);
        const c2 = Math.floor((safeColSpan - c1) / 2);
        const c3 = safeColSpan - c1 - c2;
        addSlot(colStart, c1, rowStart + topRows, botRows, `${labelPrefix} // SUB A`);
        addSlot(colStart + c1, c2, rowStart + topRows, botRows, `${labelPrefix} // SUB B`);
        addSlot(colStart + c1 + c2, c3, rowStart + topRows, botRows, `${labelPrefix} // SUB C`);
      } else {
        const splitCol = Math.max(1, Math.floor(safeColSpan / 2));
        const splitRow = Math.max(1, Math.floor(safeRowSpan / 2));
        addSlot(colStart, splitCol, rowStart, splitRow, `${labelPrefix} // QUAD 01`);
        addSlot(colStart + splitCol, safeColSpan - splitCol, rowStart, splitRow, `${labelPrefix} // QUAD 02`);
        addSlot(colStart, splitCol, rowStart + splitRow, safeRowSpan - splitRow, `${labelPrefix} // QUAD 03`);
        addSlot(colStart + splitCol, safeColSpan - splitCol, rowStart + splitRow, safeRowSpan - splitRow, `${labelPrefix} // QUAD 04`);
      }
    } else if (count === 5) {
      if (safeColSpan >= 4 && safeRowSpan >= 2) {
        const heroCols = Math.max(2, Math.round(safeColSpan * 0.55));
        const sideCols = safeColSpan - heroCols;
        const sideColA = Math.max(1, Math.floor(sideCols / 2));
        const sideColB = sideCols - sideColA;
        const splitRow = Math.max(1, Math.floor(safeRowSpan / 2));

        addSlot(colStart, heroCols, rowStart, safeRowSpan, `${labelPrefix} // HERO MAJOR`);
        addSlot(colStart + heroCols, sideColA, rowStart, splitRow, `${labelPrefix} // T1`);
        addSlot(colStart + heroCols + sideColA, sideColB, rowStart, splitRow, `${labelPrefix} // T2`);
        addSlot(colStart + heroCols, sideColA, rowStart + splitRow, safeRowSpan - splitRow, `${labelPrefix} // T3`);
        addSlot(colStart + heroCols + sideColA, sideColB, rowStart + splitRow, safeRowSpan - splitRow, `${labelPrefix} // T4`);
      } else {
        const topRows = Math.max(1, Math.floor(safeRowSpan * 0.5));
        const botRows = safeRowSpan - topRows;
        const topCol1 = Math.floor(safeColSpan / 2);
        addSlot(colStart, topCol1, rowStart, topRows, `${labelPrefix} // TOP 01`);
        addSlot(colStart + topCol1, safeColSpan - topCol1, rowStart, topRows, `${labelPrefix} // TOP 02`);

        const c1 = Math.floor(safeColSpan / 3);
        const c2 = Math.floor((safeColSpan - c1) / 2);
        const c3 = safeColSpan - c1 - c2;
        addSlot(colStart, c1, rowStart + topRows, botRows, `${labelPrefix} // BOT 01`);
        addSlot(colStart + c1, c2, rowStart + topRows, botRows, `${labelPrefix} // BOT 02`);
        addSlot(colStart + c1 + c2, c3, rowStart + topRows, botRows, `${labelPrefix} // BOT 03`);
      }
    } else if (count >= 6) {
      const numGridCols = safeColSpan >= 4 ? 3 : 2;
      const numGridRows = numGridCols === 3 ? 2 : 3;
      const splitRows = Math.max(1, Math.floor(safeRowSpan / numGridRows));

      for (let r = 0; r < numGridRows; r++) {
        const curRowStart = rowStart + (r * splitRows);
        const curRowSpan = (r === numGridRows - 1) ? (safeRowSpan - (r * splitRows)) : splitRows;

        if (numGridCols === 3) {
          const c1 = Math.floor(safeColSpan / 3);
          const c2 = Math.floor((safeColSpan - c1) / 2);
          const c3 = safeColSpan - c1 - c2;
          const colSplits = [c1, c2, c3];
          let runningCol = colStart;
          for (let c = 0; c < 3; c++) {
            const slotNum = String(r * 3 + c + 1).padStart(2, '0');
            addSlot(runningCol, colSplits[c], curRowStart, curRowSpan, `${labelPrefix} // GRID ${slotNum}`);
            runningCol += colSplits[c];
          }
        } else {
          const c1 = Math.floor(safeColSpan / 2);
          const c2 = safeColSpan - c1;
          const slotNumA = String(r * 2 + 1).padStart(2, '0');
          const slotNumB = String(r * 2 + 2).padStart(2, '0');
          addSlot(colStart, c1, curRowStart, curRowSpan, `${labelPrefix} // GRID ${slotNumA}`);
          addSlot(colStart + c1, c2, curRowStart, curRowSpan, `${labelPrefix} // GRID ${slotNumB}`);
        }
      }
    }

    return slots;
  }

function renderGenerativeContent(geom) {
    const { w, h, margins, columns, rows, colWidth, rowHeight, usableW, usableH } = geom;
    const entropyFactor = state.entropy / 100;
    // O seed procedural varia de forma rítmica com a entropia para transformar a composição em tempo real ao arrastar o slider
    const entropyMorph = Math.floor(state.entropy * 23);
    const s = state.seed + entropyMorph;

    if (columns.length === 0 || rows.length === 0) return;

    // Seleção procedural de frases e dados
    const phraseIndex = Math.floor(seededRandom(s) * editorialPhrases.length);
    const content = editorialPhrases[phraseIndex];
    const bodyCopy = bodyTexts[Math.floor(seededRandom(s + 1) * bodyTexts.length)];
    const statItem = calloutStats[Math.floor(seededRandom(s + 2) * calloutStats.length)];
    const quoteItem = pullQuotes[Math.floor(seededRandom(s + 3) * pullQuotes.length)];

    const isLandscape = w > h;
    const baseScale = (isLandscape ? h * 0.035 : w * 0.038) * (1.0 + entropyFactor * 0.18);

    // Determina o Arquétipo Arquitetônico
    let activeArchetype = state.archetype;
    if (activeArchetype === 'random_infinite' || !activeArchetype) {
      if (!state.activeProceduralArchetype) {
        const archIndex = Math.floor(seededRandom(s + 7) * allArchetypesList.length);
        state.activeProceduralArchetype = allArchetypesList[archIndex];
      }
      activeArchetype = state.activeProceduralArchetype;
    } else {
      activeArchetype = state.archetype;
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
    }

    // METADADOS COMUNS (TOP BARCODE / FOLIO)
    renderStandardMetadata(geom, content, baseScale, s, entropyFactor);
  }

  // =========================================================================
  // ANCORAGEM MODULAR RIGOROSA DE HEADLINE (Josef Müller-Brockmann / Gerstner)
  // Ancoragem milimétrica de caixa alta à hang-line de topo do módulo e
  // distribuição onde cada linha ocupa seu próprio módulo sem cortes ou flutuações.
  // =========================================================================
  function appendGridSnappedHeadline(parent, lines, x, startRowIdx, rows, maxWidth, textColor, entropyFactor = 0) {
    if (!lines || lines.length === 0 || !rows || rows.length === 0) return startRowIdx + 1;

    const rowHeight = rows[0].height;
    const numLines = lines.length;
    const endRowIdx = Math.min(rows.length - 1, startRowIdx + numLines - 1);
    const actualModules = endRowIdx - startRowIdx + 1;

    // A altura de caixa alta (Cap-Height) ideal para um módulo ocupa ~80% do rowHeight
    const targetCapHeight = rowHeight * 0.80;
    let idealFontSize = targetCapHeight / 0.72; // Cap-Height ≈ 0.72 * fontSize

    // Ajusta o tamanho da fonte para que nenhuma linha exceda a largura máxima permitida
    lines.forEach(line => {
      measureCtx.font = `800 ${idealFontSize}px Inter, sans-serif`;
      const w = measureCtx.measureText(line).width;
      if (w > maxWidth) {
        idealFontSize = Math.min(idealFontSize, (maxWidth / w) * idealFontSize * 0.98);
      }
    });

    const fontSize = Math.max(getMinUnitSize(14), idealFontSize);
    const capHeight = fontSize * 0.72;

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('id', 'MODULAR_HEADLINE_SNAPPED');

    if (state.layoutManifest && (parent === layerContent || (parent && parent.closest && parent.closest('#LAYER_CONTENT')) || parent === null)) {
      state.layoutManifest.push({
        type: 'text',
        lines: lines,
        x: x,
        y: rows[startRowIdx].y,
        fontSize: fontSize,
        lineSpacing: 1.0,
        fontWeight: '800',
        color: textColor,
        rotation: 0
      });
    }

    lines.forEach((lineStr, idx) => {
      const targetRow = Math.min(rows.length - 1, startRowIdx + idx);
      const rowY = rows[targetRow].y;

      // Ancoragem Suíça Estrita:
      // O topo da letra maiúscula toca exatamente a linha horizontal superior do módulo (rowY)
      // A baseline é calculada matematicamente como: rowY + capHeight
      // Assim: Topo = Baseline - CapHeight = (rowY + capHeight) - capHeight = rowY!
      // Zero pixels de folga, zero flutuação!
      const baselineY = rowY + capHeight;

      const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textEl.setAttribute('x', x);
      textEl.setAttribute('y', baselineY.toFixed(2));
      textEl.setAttribute('font-family', 'Inter, -apple-system, sans-serif');
      textEl.setAttribute('font-weight', '800');
      textEl.setAttribute('font-size', fontSize.toFixed(2));
      textEl.setAttribute('letter-spacing', '-0.025em');
      textEl.setAttribute('fill', textColor);
      textEl.textContent = lineStr;
      group.appendChild(textEl);
    });

    if (parent) parent.appendChild(group);

    return startRowIdx + actualModules;
  }

  // -------------------------------------------------------------------------
  // ARQUÉTIPO 1: SUÍÇO MONUMENTAL TOP (O clássico cartaz de concerto de Zurique)
  // -------------------------------------------------------------------------
  function renderSwissMonumentalTop(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor = 0) {
    const { w, h, margins, columns, rows, colWidth, rowHeight } = geom;

    const r1 = seededRandom(s + 10);
    const r2 = seededRandom(s + 11);
    const r3 = seededRandom(s + 12);
    const tc = getAdaptiveTextColor(geom, rows[0].y);

    // 1. TÍTULO NO TOPO (RIGOR MODULAR SUÍÇO)
    const titleColStart = (columns.length >= 4 && r1 > 0.7) ? 1 : 0;
    const titleX = columns[titleColStart].x;
    const titleMaxWidth = (columns[columns.length - 1].x + colWidth) - titleX;

    // Quebra equilibrada das linhas do título
    const titleLines = wrapTextToWidth(content.title, titleMaxWidth, baseScale * 2.2, '800');

    let nextRow = 0;
    if (entropyFactor > 0.65 && seededRandom(s + 99) > 0.35) {
      appendTapeStripHeadline(layerContent, titleLines, titleX, rows[0].y, baseScale * 2.0, 1.25, '800', entropyFactor, s, columns, colWidth);
      nextRow = Math.min(rows.length - 1, titleLines.length);
    } else {
      nextRow = appendGridSnappedHeadline(layerContent, titleLines, titleX, 0, rows, titleMaxWidth, tc.title, entropyFactor);
    }

    // Subtítulo perfeitamente ancorado na linha do módulo seguinte
    const subRow = Math.min(rows.length - 1, nextRow);
    const subSize = Math.max(getMinUnitSize(9), baseScale * 0.42);
    const subY = rows[subRow].y;
    const subLines = wrapTextToWidth(content.sub.toUpperCase(), titleMaxWidth, subSize, '600');
    appendSvgText(layerContent, subLines, titleX, subY, subSize, 1.25, '600', tc.sub);

    // 2. IMAGENS MODULARES (COMEÇAM NO MÓDULO SEGUINTE AO SUBTÍTULO)
    const effectiveCount = getEffectiveImageCount(1);
    const imgRowStart = Math.min(rows.length - 1, subRow + 1);
    const availableRows = rows.length - imgRowStart;
    const imgRowSpan = Math.max(1, Math.min(availableRows - 2, Math.floor(rows.length * (0.28 + r1 * 0.15))));
    
    const imgColStart = (columns.length >= 4 && r2 > 0.8) ? 1 : 0;
    const rawColSpan = columns.length >= 6 ? (r3 > 0.5 ? columns.length - 2 : columns.length - 1 - imgColStart) : columns.length - imgColStart;
    const imgColSpan = Math.max(1, Math.min(columns.length - imgColStart, rawColSpan));

    if (effectiveCount > 0 && imgRowStart < rows.length - 1) {
      distributeCreativeImageSlots(layerFrames || layerContent, imgColStart, imgColSpan, imgRowStart, imgRowSpan, effectiveCount, geom, entropyFactor, s, 'HERO PHOTOGRAPHY', state.imageDistribution);

      // Stat Callout ao lado da imagem se sobrar colunas
      if (columns.length >= 6 && imgColStart + imgColSpan < columns.length) {
        const statColX = columns[imgColStart + imgColSpan].x;
        const statW = (columns[columns.length - 1].x + colWidth) - statColX;
        const endRowIdx = Math.min(rows.length - 1, imgRowStart + imgRowSpan - 1);
        const imgH = (rows[endRowIdx].y + rowHeight) - rows[imgRowStart].y;
        appendStatBadge(layerContent, statColX, rows[imgRowStart].y, statW, imgH, statItem.num, statItem.label, baseScale, entropyFactor);
      }
    }

    // 3. COLUNAS DE TEXTO
    const bodyRowStart = (effectiveCount > 0) ? Math.max(0, Math.min(rows.length - 1, imgRowStart + imgRowSpan)) : Math.min(rows.length - 1, Math.max(1, Math.floor(rows.length * 0.3)));
    const bodyY = rows[bodyRowStart]?.y || (h - margins.bottom - 40);
    const numCols = columns.length >= 4 ? (r1 > 0.4 ? 2 : 3) : 1;
    appendMultiColumnBody(layerContent, columns, 0, columns.length, colWidth, bodyY, h - margins.bottom - 5, bodyCopy, numCols, baseScale);
  }

  // -------------------------------------------------------------------------
  // ARQUÉTIPO 2: SUÍÇO COM ANCORAGEM INFERIOR (Vignelli: Respiro no Topo)
  // -------------------------------------------------------------------------
  function renderSwissBottomAnchor(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor = 0) {
    const { w, h, margins, columns, rows, colWidth, rowHeight } = geom;

    const r1 = seededRandom(s + 20);
    const r2 = seededRandom(s + 21);
    const effectiveCount = getEffectiveImageCount(1);

    // 1. IMAGEM NO TOPO
    const imgColStart = (columns.length >= 4 && r1 > 0.6) ? 1 : 0;
    const imgColSpan = (columns.length >= 6 && r2 > 0.5) ? columns.length - 2 : columns.length - imgColStart;
    const imgRowSpan = Math.max(2, Math.floor(rows.length * (0.3 + r1 * 0.2)));

    if (effectiveCount > 0) {
      distributeCreativeImageSlots(layerFrames || layerContent, imgColStart, imgColSpan, 0, imgRowSpan, effectiveCount, geom, entropyFactor, s, 'VISUAL FIELD', state.imageDistribution);
    }

    // 2. TEXTO ESTATÍSTICO & NARRATIVA NO MEIO
    const midRow = (effectiveCount > 0) ? Math.max(imgRowSpan, Math.floor(rows.length * (0.35 + r2 * 0.15))) : 1;
    const midY = rows[midRow].y;
    const bodyCols = columns.length >= 6 ? (r1 > 0.5 ? columns.length - 2 : columns.length - 3) : columns.length;
    const numSubCols = bodyCols >= 4 ? (r2 > 0.5 ? 2 : 3) : 1;
    const endMidRow = Math.min(rows.length - 1, rows.length - 3);

    appendMultiColumnBody(layerContent, columns, 0, bodyCols, colWidth, midY, rows[endMidRow].y, bodyCopy, numSubCols, baseScale);

    if (columns.length >= 6 && bodyCols < columns.length) {
      const statX = columns[bodyCols].x;
      const statSpan = columns.length - bodyCols;
      appendStatBadge(layerContent, statX, midY, (columns[bodyCols + statSpan - 1].x + colWidth) - statX, rowHeight * 2, statItem.num, statItem.label, baseScale, entropyFactor);
    }

    // 3. TÍTULO MONUMENTAL ANCORADO NO RODAPÉ (MODULAR SUÍÇO)
    const titleColStart = (columns.length >= 4 && r2 > 0.7) ? 1 : 0;
    const titleX = columns[titleColStart].x;
    const titleW = (columns[columns.length - 1].x + colWidth) - titleX;
    const titleLines = wrapTextToWidth(content.title, titleW, baseScale * 2.2, '800');
    const bottomRow = Math.max(midRow + 1, rows.length - titleLines.length);

    if (entropyFactor > 0.65 && seededRandom(s + 98) > 0.35) {
      appendTapeStripHeadline(layerContent, titleLines, titleX, rows[bottomRow].y, baseScale * 2.0, 1.25, '800', entropyFactor, s, columns, colWidth);
    } else {
      appendGridSnappedHeadline(layerContent, titleLines, titleX, bottomRow, rows, titleW, tc.title, entropyFactor);
    }

    const subRow = Math.max(0, bottomRow - 1);
    const subSize = Math.max(getMinUnitSize(9), baseScale * 0.42);
    const subLines = wrapTextToWidth(content.sub.toUpperCase(), titleW, subSize, '600');
    appendSvgText(layerContent, subLines, titleX, rows[subRow].y, subSize, 1.2, '600', tc.sub);
  }

  // -------------------------------------------------------------------------
  // ARQUÉTIPO 3: SUÍÇO DIVISÃO LATERAL (Split Spine)
  // -------------------------------------------------------------------------
  function renderSwissSplitSpine(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor = 0) {
    const { w, h, margins, columns, rows, colWidth, rowHeight } = geom;

    const r1 = seededRandom(s + 30);
    const r2 = seededRandom(s + 31);

    const spineCols = Math.max(1, Math.floor(columns.length * (0.25 + r1 * 0.15)));
    const rightCols = columns.length - spineCols;
    const spineOnLeft = r2 > 0.3;
    const spineStartCol = spineOnLeft ? 0 : rightCols;
    const rightStartCol = spineOnLeft ? spineCols : 0;

    // 1. ESPINHA
    const spineX = columns[spineStartCol].x;
    const spineW = (columns[spineStartCol + spineCols - 1].x + colWidth) - spineX;
    const spineTc = getAdaptiveTextColor(geom, rows[0].y);

    const bigNum = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    bigNum.setAttribute('x', spineX);
    bigNum.setAttribute('y', rows[0].y + baseScale * 2.4);
    bigNum.setAttribute('font-family', 'Inter, sans-serif');
    bigNum.setAttribute('font-weight', '800');
    bigNum.setAttribute('font-size', baseScale * 2.8);
    bigNum.setAttribute('fill', entropyFactor > 0.75 ? '#e63946' : spineTc.title);
    bigNum.textContent = statItem.num;
    layerContent.appendChild(bigNum);

    const titleY = rows[0].y + baseScale * 3.6;
    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, spineW, baseScale * (1.3 + r1 * 0.4), rowHeight * 4);
    if (entropyFactor > 0.6) {
      const spineBotY = rows[Math.min(rows.length - 1, 5)].y + rowHeight;
      appendSvgVerticalHeadline(layerContent, content.title, spineX + spineW * 0.5, spineBotY, spineBotY - rows[0].y, baseScale * 1.8, '800', spineTc.title, entropyFactor > 0.75 ? 'red' : 'black', -90);
    } else {
      appendSvgText(layerContent, titleLines, spineX, titleY, titleSize, 1.1, '800', spineTc.title, 0, entropyFactor > 0.45);
    }

    const subFontSize = Math.max(getMinUnitSize(8.5), titleSize * 0.35);
    const subY = titleY + (titleLines.length * titleSize * 1.1) + 4;
    const subLines = wrapTextToWidth(content.sub.toUpperCase(), spineW, subFontSize, '600');
    appendSvgText(layerContent, subLines, spineX, subY, subFontSize, 1.25, '600', spineTc.sub);

    // 2. SEÇÃO GRANDE (Imagens + Corpo)
    const effectiveCount = getEffectiveImageCount(1);
    const imgRowSpan = Math.max(2, Math.floor(rows.length * (0.35 + r1 * 0.2)));
    const imgStartRow = (rows.length >= 6 && r1 > 0.7) ? 1 : 0;

    if (effectiveCount > 0) {
      distributeCreativeImageSlots(layerFrames || layerContent, rightStartCol, rightCols, imgStartRow, imgRowSpan, effectiveCount, geom, entropyFactor, s, 'EDITORIAL WING', state.imageDistribution);
    }

    const bodyRowStart = (effectiveCount > 0) ? Math.min(rows.length - 1, imgStartRow + imgRowSpan) : imgStartRow;
    const bodyY = rows[bodyRowStart]?.y || (rows[imgStartRow].y + 30);
    const numSubCols = rightCols >= 4 ? (r1 > 0.5 ? 2 : 3) : (rightCols >= 2 ? 2 : 1);
    appendMultiColumnBody(layerContent, columns, rightStartCol, rightCols, colWidth, bodyY, h - margins.bottom - 5, bodyCopy, numSubCols, baseScale);
  }

  // -------------------------------------------------------------------------
  // ARQUÉTIPO 4: CINTURÃO CENTRAL (Headline cortando horizontalmente o meio)
  // -------------------------------------------------------------------------
  function renderSwissCenterBelt(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor = 0) {
    const { w, h, margins, columns, rows, colWidth, rowHeight } = geom;

    const r1 = seededRandom(s + 40);
    const r2 = seededRandom(s + 41);

    const effectiveCount = getEffectiveImageCount(2);
    const fullW = (columns[columns.length - 1].x + colWidth) - columns[0].x;

    // Se o usuário quer imagens abaixo ou composição top-down:
    // A) Título no Topo + Cinturão de Fotos no Meio + Texto na Base (60%)
    // B) Fotos no Topo + Cinturão Tipográfico no Meio + Texto na Base (40%)
    const isTitleAtTop = r1 > 0.4;

    if (isTitleAtTop) {
      // 1. TÍTULO NO TOPO (RIGOR MODULAR SUÍÇO)
      const tc = getAdaptiveTextColor(geom, rows[0].y);
      const titleLines = wrapTextToWidth(content.title, fullW, baseScale * 2.2, '800');

      let nextRow = 0;
      if (entropyFactor > 0.65) {
        appendTapeStripHeadline(layerContent, titleLines, columns[0].x, rows[0].y, baseScale * 2.0, 1.25, '800', entropyFactor, s, columns, colWidth);
        nextRow = Math.min(rows.length - 1, titleLines.length);
      } else {
        nextRow = appendGridSnappedHeadline(layerContent, titleLines, columns[0].x, 0, rows, fullW, tc.title, entropyFactor);
      }

      const imgRowStart = Math.min(rows.length - 1, nextRow);
      const availableRows = rows.length - imgRowStart;
      const imgRowSpan = Math.max(1, Math.min(availableRows - 2, Math.floor(rows.length * 0.35)));

      // 2. FOTOS ABAIXO DO TÍTULO
      if (effectiveCount > 0 && imgRowStart < rows.length - 1) {
        distributeCreativeImageSlots(layerFrames || layerContent, 0, columns.length, imgRowStart, imgRowSpan, effectiveCount, geom, entropyFactor, s, 'BELT PANORAMA', state.imageDistribution);
      }

      // 3. TEXTO NA BASE
      const bodyRow = (effectiveCount > 0) ? (imgRowStart + imgRowSpan) : imgRowStart;
      const bodyY = rows[Math.min(rows.length - 1, bodyRow)]?.y || (h - margins.bottom - 40);
      const numCols = columns.length >= 6 ? (r1 > 0.5 ? 3 : 2) : (columns.length >= 4 ? 2 : 1);
      appendMultiColumnBody(layerContent, columns, 0, columns.length, colWidth, bodyY, h - margins.bottom - 5, bodyCopy, numCols, baseScale);

    } else {
      // B) FOTOS NO TOPO, CINTURÃO TIPOGRÁFICO NO CENTRO, TEXTO NA BASE
      const beltRow = Math.max(2, Math.floor(rows.length * 0.32));
      const beltY = rows[beltRow].y;

      // 1. Fotos no Topo (rows 0 a beltRow)
      if (effectiveCount > 0) {
        distributeCreativeImageSlots(layerFrames || layerContent, 0, columns.length, 0, beltRow, effectiveCount, geom, entropyFactor, s, 'BELT PANORAMA', state.imageDistribution);
      }

      // 2. Cinturão no Centro (RIGOR MODULAR)
      const beltTc = getAdaptiveTextColor(geom, beltY);
      const titleLines = wrapTextToWidth(content.title, fullW, baseScale * 2.1, '800');
      let beltEndRow = beltRow + 1;
      if (entropyFactor > 0.65) {
        appendTapeStripHeadline(layerContent, titleLines, columns[0].x, beltY, baseScale * 2.0, 1.25, '800', entropyFactor, s, columns, colWidth);
        beltEndRow = Math.min(rows.length - 1, beltRow + titleLines.length);
      } else {
        beltEndRow = appendGridSnappedHeadline(layerContent, titleLines, columns[0].x, beltRow, rows, fullW, beltTc.title, entropyFactor);
      }

      // 3. Texto na Base
      const bodyRow = Math.min(rows.length - 1, beltEndRow);
      const bodyY = rows[bodyRow]?.y || (beltY + 40);
      const numCols = columns.length >= 6 ? (r1 > 0.5 ? 3 : 2) : (columns.length >= 4 ? 2 : 1);
      appendMultiColumnBody(layerContent, columns, 0, columns.length, colWidth, bodyY, h - margins.bottom - 5, bodyCopy, numCols, baseScale);
    }
  }

  // -------------------------------------------------------------------------
  // ARQUÉTIPO 5: MANIFESTO TIPOGRÁFICO PURO
  // -------------------------------------------------------------------------
  function renderSwissTypographicPure(geom, content, bodyCopy, quoteItem, baseScale, s, entropyFactor = 0) {
    const { w, h, margins, columns, rows, colWidth, rowHeight } = geom;

    const r1 = seededRandom(s + 50);
    const r2 = seededRandom(s + 51);

    const titleColStart = (columns.length >= 4 && r1 > 0.6) ? 1 : 0;
    const fullW = (columns[columns.length - 1].x + colWidth) - columns[titleColStart].x;
    const tc = getAdaptiveTextColor(geom, rows[0].y);

    // 1. TÍTULO MASTODÔNTICO (MODULAR PURO)
    const titleLines = wrapTextToWidth(content.title, fullW, baseScale * 2.4, '800');
    let pureEndRow = 0;
    if (entropyFactor > 0.65 && seededRandom(s + 94) > 0.35) {
      appendTapeStripHeadline(layerContent, titleLines, columns[titleColStart].x, rows[0].y, baseScale * 2.2, 1.25, '800', entropyFactor, s, columns, colWidth);
      pureEndRow = Math.min(rows.length - 1, titleLines.length);
    } else {
      pureEndRow = appendGridSnappedHeadline(layerContent, titleLines, columns[titleColStart].x, 0, rows, fullW, tc.title, entropyFactor);
    }

    // 2. CITAÇÃO TIPOGRÁFICA NO MÓDULO SEGUINTE
    const quoteRow = Math.min(rows.length - 1, pureEndRow);
    const quoteY = rows[quoteRow].y;
    const quoteSize = Math.max(9, baseScale * (0.7 + r1 * 0.2));
    const quoteLines = wrapTextToWidth(quoteItem, fullW, quoteSize, '500');
    const quoteColStart = r1 > 0.5 ? titleColStart : (titleColStart + 1 < columns.length ? titleColStart + 1 : titleColStart);
    appendSvgText(layerContent, quoteLines, columns[quoteColStart].x, quoteY, quoteSize, 1.35, '500', tc.title);

    // Divisor
    const divY = quoteY + (quoteLines.length * quoteSize * 1.35) + rowHeight * (0.35 + r1 * 0.3);
    const divider = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    divider.setAttribute('x1', columns[0].x);
    divider.setAttribute('y1', divY);
    divider.setAttribute('x2', columns[columns.length - 1].x + colWidth);
    divider.setAttribute('y2', divY);
    divider.setAttribute('stroke', entropyFactor > 0.7 ? '#e63946' : tc.title);
    divider.setAttribute('stroke-width', r2 > 0.8 || entropyFactor > 0.6 ? '3' : '1');
    layerContent.appendChild(divider);

    // 3. IMAGENS OPCIONAIS SE O USUÁRIO SOLICITOU SLOTS
    const effectiveCount = getEffectiveImageCount(0);
    let bodyY = divY + rowHeight * (0.35 + r2 * 0.3);

    if (effectiveCount > 0) {
      const imgRow = rows.findIndex(r => r.y >= bodyY);
      const safeImgRow = imgRow !== -1 ? imgRow : Math.floor(rows.length * 0.5);
      const imgSpan = Math.max(2, Math.floor(rows.length * 0.25));
      distributeCreativeImageSlots(layerFrames || layerContent, 0, columns.length, safeImgRow, imgSpan, effectiveCount, geom, entropyFactor, s, 'TYPO COMPANION', state.imageDistribution);
      const nextRow = Math.min(rows.length - 1, safeImgRow + imgSpan);
      bodyY = rows[nextRow].y + rowHeight * 0.3;
    }

    const numCols = columns.length >= 6 ? (r1 > 0.5 ? 3 : 4) : (columns.length >= 4 ? 2 : 1);
    appendMultiColumnBody(layerContent, columns, 0, columns.length, colWidth, bodyY, h - margins.bottom - 5, bodyCopy, numCols, baseScale);
  }

  // -------------------------------------------------------------------------
  // ARQUÉTIPO 6: MATRIZ MODULAR DE GERSTNER (Multi-Imagens Escalonadas)
  // -------------------------------------------------------------------------
  function renderSwissModularQuads(geom, content, bodyCopy, baseScale, s, entropyFactor = 0) {
    const { w, h, margins, columns, rows, colWidth, rowHeight } = geom;

    const r1 = seededRandom(s + 60);
    const r2 = seededRandom(s + 61);

    const effectiveCount = getEffectiveImageCount(3);
    const tc = getAdaptiveTextColor(geom, rows[0].y);

    // 1. TÍTULO NO TOPO (Headline Monumental Gerstner ampla, travada à grade modular)
    const titleColStart = (columns.length >= 5 && r1 > 0.7) ? 1 : 0;
    const titleX = columns[titleColStart].x;
    const titleW = (columns[columns.length - 1].x + colWidth) - titleX;
    const titleLines = wrapTextToWidth(content.title, titleW, baseScale * 2.2, '800');

    let nextRow = 0;
    if (entropyFactor > 0.65) {
      appendTapeStripHeadline(layerContent, titleLines, titleX, rows[0].y, baseScale * 2.0, 1.25, '800', entropyFactor, s, columns, colWidth);
      nextRow = Math.min(rows.length - 1, titleLines.length);
    } else {
      nextRow = appendGridSnappedHeadline(layerContent, titleLines, titleX, 0, rows, titleW, tc.title, entropyFactor);
    }

    const subRow = Math.min(rows.length - 1, nextRow);
    const subSize = Math.max(getMinUnitSize(9), baseScale * 0.42);
    const subY = rows[subRow].y;
    const subLines = wrapTextToWidth(content.sub.toUpperCase(), titleW, subSize, '600');
    appendSvgText(layerContent, subLines, titleX, subY, subSize, 1.25, '600', tc.sub);

    // 2. IMAGENS COLOCADAS ESTRITAMENTE ABAIXO DO SUBTÍTULO
    const imgStartRow = Math.min(rows.length - 1, subRow + 1);

    const availableRows = rows.length - imgStartRow;
    const imgSpan = (effectiveCount > 0 && availableRows >= 4)
      ? Math.max(2, Math.min(availableRows - 2, Math.floor(rows.length * 0.38)))
      : Math.max(1, availableRows - 2);

    if (effectiveCount > 0 && imgStartRow < rows.length - 1) {
      distributeCreativeImageSlots(layerFrames || layerContent, 0, columns.length, imgStartRow, imgSpan, effectiveCount, geom, entropyFactor, s, 'GERSTNER MODULAR', state.imageDistribution);
    }

    // 3. CORPO DE TEXTO ESTRITAMENTE ABAIXO DAS IMAGENS
    const bodyRow = (effectiveCount > 0) ? (imgStartRow + imgSpan) : imgStartRow;
    const bodyY = rows[Math.min(rows.length - 1, bodyRow)]?.y || (rows[safeTitleRow].y + 30);
    const numCols = columns.length >= 6 ? (r1 > 0.5 ? 3 : 2) : (columns.length >= 4 ? 2 : 1);
    appendMultiColumnBody(layerContent, columns, 0, columns.length, colWidth, bodyY, h - margins.bottom - 5, bodyCopy, numCols, baseScale);
  }

  // -------------------------------------------------------------------------
  // ARQUÉTIPO 7: BLOCO INVERTIDO (Preto & Branco / Alto Contraste)
  // -------------------------------------------------------------------------
  function renderSwissInvertedField(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor = 0) {
    const { w, h, margins, columns, rows, colWidth, rowHeight } = geom;

    const r1 = seededRandom(s + 70);
    const r2 = seededRandom(s + 71);

    const invRows = Math.max(2, Math.floor(rows.length * (0.3 + r1 * 0.4)));
    const startCol = (columns.length >= 4 && r2 > 0.8) ? 1 : 0;
    const spanCols = columns.length >= 6 ? (r2 < 0.2 ? columns.length - 1 : columns.length - startCol) : columns.length - startCol;

    const invX = columns[startCol].x;
    const invY = rows[0].y;
    const invW = (columns[startCol + spanCols - 1].x + colWidth) - invX;
    const invH = (rows[invRows - 1].y + rowHeight) - invY;

    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('x', invX);
    bgRect.setAttribute('y', invY);
    bgRect.setAttribute('width', invW);
    bgRect.setAttribute('height', invH);
    bgRect.setAttribute('fill', entropyFactor > 0.8 ? '#e63946' : '#1d1d1f');
    layerContent.appendChild(bgRect);

    // Texto Branco dentro do bloco invertido
    const titlePadding = 12 + r1 * 10;
    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, invW - titlePadding * 2, baseScale * (2.0 + r1 * 0.5), invH * 0.55);
    appendSvgText(layerContent, titleLines, invX + titlePadding, invY + titlePadding, titleSize, 1.08, '800', '#ffffff', 0, entropyFactor > 0.45);

    const subY = invY + titlePadding + (titleLines.length * titleSize * 1.08) + 4;
    const subLines = wrapTextToWidth(content.sub.toUpperCase(), invW - titlePadding * 2, titleSize * 0.35, '600');
    appendSvgText(layerContent, subLines, invX + titlePadding, subY, titleSize * 0.35, 1.25, '600', '#a1a1a6');

    // Metade inferior
    const effectiveCount = getEffectiveImageCount(1);
    const botRow = Math.min(rows.length - 2, invRows + 1);
    const botY = rows[botRow]?.y || (invY + invH + rowHeight * 0.3);
    const splitPoint = Math.max(1, Math.floor(columns.length * (0.4 + r2 * 0.3)));
    const botSpanRows = Math.max(2, rows.length - botRow - 1);

    if (effectiveCount > 0) {
      distributeCreativeImageSlots(layerFrames || layerContent, 0, splitPoint, botRow, botSpanRows, effectiveCount, geom, entropyFactor, s, 'INVERTED DETAIL', state.imageDistribution);
      appendMultiColumnBody(layerContent, columns, splitPoint, columns.length - splitPoint, colWidth, botY, h - margins.bottom - 5, bodyCopy, 1, baseScale);
    } else {
      appendMultiColumnBody(layerContent, columns, 0, columns.length, colWidth, botY, h - margins.bottom - 5, bodyCopy, columns.length >= 4 ? 2 : 1, baseScale);
    }
  }

  // -------------------------------------------------------------------------
  // ARQUÉTIPO 8: CONSTRUTIVISTA & BAUHAUS (Linhas de Tensão & Acento Vermelho)
  // -------------------------------------------------------------------------
  function renderConstructivistTension(geom, content, bodyCopy, baseScale, s, entropyFactor = 0) {
    const { w, h, margins, columns, rows, colWidth, rowHeight } = geom;

    const r1 = seededRandom(s + 80);
    const r2 = seededRandom(s + 81);

    const redBarY = rows[Math.min(rows.length - 1, r1 > 0.5 ? 0 : 1)].y;
    const redBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    redBar.setAttribute('x', columns[0].x);
    redBar.setAttribute('y', redBarY);
    redBar.setAttribute('width', (columns[columns.length - 1].x + colWidth) - columns[0].x);
    redBar.setAttribute('height', 4 + r2 * 8 + entropyFactor * 8);
    redBar.setAttribute('fill', '#e63946');
    layerContent.appendChild(redBar);

    const titleY = redBarY + 12 + r2 * 10;
    const titleCol = (columns.length >= 4 && r2 > 0.6) ? 1 : 0;
    const titleX = columns[titleCol].x;
    const titleW = (columns[columns.length - 1].x + colWidth) - titleX;
    const tc = getAdaptiveTextColor(geom, titleY);

    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, titleW, baseScale * (2.4 + r1 * 0.4), rowHeight * 2.5);
    if (entropyFactor > 0.65) {
      appendTapeStripHeadline(layerContent, titleLines, titleX, titleY, titleSize, 1.25, '800', entropyFactor, s, columns, colWidth);
    } else {
      appendSvgText(layerContent, titleLines, titleX, titleY, titleSize, 1.06, '800', tc.title, 0, entropyFactor > 0.45);
    }

    const titleBottom = titleY + (titleLines.length * titleSize * 1.06) + 8;
    const titleEndRow = rows.findIndex(r => r.y >= titleBottom);
    const safeTitleRow = titleEndRow !== -1 ? titleEndRow : 3;

    const circleRow = Math.min(rows.length - 2, Math.max(safeTitleRow, Math.floor(2 + r1 * 2)));
    const circleX = r2 > 0.5 ? columns[columns.length - 1].x : columns[0].x + colWidth;
    const circleY = rows[Math.min(rows.length - 1, circleRow)].y + rowHeight / 2;
    const circleRadius = rowHeight * (0.6 + r1 * 0.4);

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', circleX);
    circle.setAttribute('cy', circleY);
    circle.setAttribute('r', circleRadius);
    circle.setAttribute('fill', r1 > 0.8 ? '#e63946' : 'none');
    circle.setAttribute('stroke', '#e63946');
    circle.setAttribute('stroke-width', '2');
    layerContent.appendChild(circle);

    const effectiveCount = getEffectiveImageCount(1);
    const imgStartRow = Math.max(safeTitleRow, circleRow + 1);

    if (effectiveCount > 0 && imgStartRow < rows.length - 2) {
      const imgRowSpan = Math.max(2, Math.floor(rows.length * 0.28));
      distributeCreativeImageSlots(layerFrames || layerContent, 0, Math.floor(columns.length * 0.75), imgStartRow, imgRowSpan, effectiveCount, geom, entropyFactor, s, 'CONSTRUCTIVIST FORM', state.imageDistribution);
      const bodyRow = Math.min(rows.length - 1, imgStartRow + imgRowSpan);
      appendMultiColumnBody(layerContent, columns, 0, columns.length, colWidth, rows[bodyRow].y, h - margins.bottom - 5, bodyCopy, columns.length >= 4 ? 2 : 1, baseScale);
    } else {
      const bodyRow = Math.min(rows.length - 1, safeTitleRow);
      const bodyY = rows[bodyRow]?.y || (titleBottom + 20);
      appendMultiColumnBody(layerContent, columns, 0, columns.length, colWidth, bodyY, h - margins.bottom - 5, bodyCopy, columns.length >= 4 ? 2 : 1, baseScale);
    }
  }

  // -------------------------------------------------------------------------
  // ARQUÉTIPO 9: BRUTALISMO PÓS-DIGITAL (Matriz Estrutural de Dados)
  // -------------------------------------------------------------------------
  function renderBrutalistDataMatrix(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor = 0) {
    const { w, h, margins, columns, rows, colWidth, rowHeight } = geom;

    const r1 = seededRandom(s + 90);
    const r2 = seededRandom(s + 91);

    // 1. TÍTULO NO TOPO (Limpo, sem coordenadas invasivas sobre o texto)
    const titleStartCol = (columns.length >= 4 && r2 > 0.5) ? 1 : 0;
    const titleW = (columns[columns.length - 1].x + colWidth) - columns[titleStartCol].x;
    const titleRowStart = r1 > 0.8 ? 1 : 0;
    const titleY = rows[titleRowStart].y;
    const tc = getAdaptiveTextColor(geom, titleY);

    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, titleW, baseScale * (1.9 + r1 * 0.4), rowHeight * 2.5);
    if (entropyFactor > 0.65) {
      appendTapeStripHeadline(layerContent, titleLines, columns[titleStartCol].x, titleY, titleSize, 1.25, '800', entropyFactor, s, columns, colWidth);
    } else {
      appendSvgText(layerContent, titleLines, columns[titleStartCol].x, titleY, titleSize, 1.08, '800', tc.title, 0, entropyFactor > 0.45);
    }

    const subSize = Math.max(getMinUnitSize(10), titleSize * 0.35);
    const subY = titleY + (titleLines.length * titleSize * 1.08) + 4;
    const subLines = wrapTextToWidth(content.sub.toUpperCase(), titleW, subSize, '600');
    appendSvgText(layerContent, subLines, columns[titleStartCol].x, subY, subSize, 1.25, '600', tc.sub);

    const titleBottom = subY + (subLines.length * subSize * 1.25) + 6;
    const titleEndRow = rows.findIndex(r => r.y >= titleBottom);
    const safeTitleRow = titleEndRow !== -1 ? titleEndRow : (titleRowStart + 2);
    const tableRowStart = Math.max(safeTitleRow, titleRowStart + 2);

    const effectiveCount = getEffectiveImageCount(1);
    if (effectiveCount > 0 && tableRowStart < rows.length - 2) {
      const tableH_Rows = Math.max(2, Math.floor(rows.length * 0.28));
      distributeCreativeImageSlots(layerFrames || layerContent, 0, columns.length, tableRowStart, tableH_Rows, effectiveCount, geom, entropyFactor, s, 'DATA ARRAY', state.imageDistribution);
      const bodyRow = Math.min(rows.length - 1, tableRowStart + tableH_Rows);
      appendMultiColumnBody(layerContent, columns, 0, columns.length, colWidth, rows[bodyRow].y, h - margins.bottom - 5, bodyCopy, columns.length >= 4 ? (r2 > 0.5 ? 3 : 2) : 1, baseScale);
    } else {
      const bodyRow = Math.min(rows.length - 1, safeTitleRow);
      const bodyY = rows[bodyRow]?.y || (titleBottom + 20);
      appendMultiColumnBody(layerContent, columns, 0, columns.length, colWidth, bodyY, h - margins.bottom - 5, bodyCopy, columns.length >= 4 ? 2 : 1, baseScale);
    }
  }

  // -------------------------------------------------------------------------
  // ARQUÉTIPO 10: CANÔNICO CLÁSSICO (Van de Graaf / Jan Tschichold)
  // -------------------------------------------------------------------------
  function renderClassicalBookCanon(geom, content, bodyCopy, baseScale, s, entropyFactor = 0) {
    const { w, h, margins, columns, rows, colWidth, rowHeight } = geom;

    const r1 = seededRandom(s + 100);
    const r2 = seededRandom(s + 101);
    const fullW = (columns[columns.length - 1].x + colWidth) - columns[0].x;

    const titleY = rows[0].y + (r1 > 0.5 ? rowHeight * 0.5 : 0);
    const tc = getAdaptiveTextColor(geom, titleY);
    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, fullW, baseScale * (1.8 + r2 * 0.4), rowHeight * 2.5);
    appendSvgText(layerContent, titleLines, columns[0].x, titleY, titleSize, 1.15, '700', tc.title);

    const titleBottom = titleY + (titleLines.length * titleSize * 1.15) + 6;
    const titleEndRow = rows.findIndex(r => r.y >= titleBottom);
    const safeTitleRow = titleEndRow !== -1 ? titleEndRow : 3;
    const imgStartRow = Math.max(safeTitleRow, 2);

    const effectiveCount = getEffectiveImageCount(1);
    const imgRowSpan = Math.max(2, Math.min(rows.length - imgStartRow - 2, Math.floor(rows.length * 0.3)));

    if (effectiveCount > 0 && imgStartRow < rows.length - 1) {
      distributeCreativeImageSlots(layerFrames || layerContent, 0, columns.length, imgStartRow, imgRowSpan, effectiveCount, geom, entropyFactor, s, 'CANONICAL FRAME', state.imageDistribution);
    }

    const bodyRowStart = (effectiveCount > 0) ? Math.min(rows.length - 1, imgStartRow + imgRowSpan) : imgStartRow;
    const bodyY = rows[bodyRowStart]?.y || (rows[imgStartRow].y + 20);
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
    const tc = getAdaptiveTextColor(geom, rows[0].y);

    appendSvgVerticalHeadline(layerContent, content.title, spineX, spineY, spineH, spineFontSize, '800', tc.title, entropyFactor > 0.7 ? 'red' : (entropyFactor > 0.4 ? 'black' : false), -90);

    const galX = columns[galleryStartCol].x;
    const galW = (columns[galleryStartCol + gallerySpanCols - 1].x + colWidth) - galX;

    const effectiveCount = getEffectiveImageCount(1);
    const imgRowSpan = Math.max(2, Math.floor(rows.length * (0.35 + r1 * 0.2)));

    if (effectiveCount > 0) {
      distributeCreativeImageSlots(layerFrames || layerContent, galleryStartCol, gallerySpanCols, 0, imgRowSpan, effectiveCount, geom, entropyFactor, s, 'AVANT-GARDE 90°', state.imageDistribution);
    }

    const safeMidRow = (effectiveCount > 0) ? Math.max(imgRowSpan, 2) : 1;
    const midRow = Math.min(rows.length - 3, safeMidRow);
    const midY = rows[midRow].y;

    const subSize = Math.max(7, baseScale * 0.48);
    const subLines = wrapTextToWidth(content.sub.toUpperCase(), galW * 0.65, subSize, '600');
    appendSvgText(layerContent, subLines, galX, midY, subSize, 1.25, '600', tc.sub);

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
    const tc = getAdaptiveTextColor(geom, titleY);

    const { size: titleSize, lines: titleLines } = fitHeadline(content.title, titleMaxW * 0.9, baseScale * (2.2 + r2 * 0.4), rowHeight * 3.2);
    appendTapeStripHeadline(layerContent, titleLines, titleX, titleY, titleSize, 1.28, '800', entropyFactor, s, columns, colWidth);

    const subSize = Math.max(getMinUnitSize(8.5), titleSize * 0.32);
    const subY = titleY + (titleLines.length * titleSize * 1.28) + 8;
    const subLines = wrapTextToWidth(content.sub.toUpperCase(), titleMaxW, subSize, '600', 'JetBrains Mono, monospace');
    appendSvgText(layerContent, subLines, titleX, subY, subSize, 1.25, '600', tc.sub);

    const titleBottom = subY + (subLines.length * subSize * 1.25) + 6;
    const titleEndRow = rows.findIndex(r => r.y >= titleBottom);
    const safeTitleRow = titleEndRow !== -1 ? titleEndRow : 3;
    const imgRowStart = Math.min(rows.length - 3, Math.max(safeTitleRow, 3));
    const imgRowSpan = Math.max(2, Math.floor(rows.length * 0.28));

    const effectiveCount = getEffectiveImageCount(1);
    if (effectiveCount > 0 && imgRowStart < rows.length - 1) {
      distributeCreativeImageSlots(layerFrames || layerContent, 0, columns.length, imgRowStart, imgRowSpan, effectiveCount, geom, entropyFactor, s, 'BRUTALIST TAPE', state.imageDistribution);
    }

    const bodyRow = imgRowStart + (effectiveCount > 0 ? imgRowSpan : 0);
    const bodyY = rows[Math.min(rows.length - 2, bodyRow)]?.y || (rows[imgRowStart].y + 30);
    appendMultiColumnBody(layerContent, columns, 0, columns.length, colWidth, bodyY, h - margins.bottom - 5, bodyCopy, columns.length >= 4 ? 3 : 2, baseScale);
  }

  // -------------------------------------------------------------------------
  // ARQUÉTIPO 13: BIAXIAL 90° (Eixos Cruzados / Tipofoto Perpendicular)
  // -------------------------------------------------------------------------
  function renderCrossAxisAvantGarde(geom, content, bodyCopy, statItem, baseScale, s, entropyFactor = 0) {
    const { w, h, margins, columns, rows, colWidth, rowHeight } = geom;

    const r1 = seededRandom(s + 130);
    const r2 = seededRandom(s + 131);

    const effectiveCount = getEffectiveImageCount(1);
    const imgRow = Math.min(rows.length - 3, Math.max(1, Math.floor(rows.length * 0.25)));
    const imgRowSpan = Math.max(2, Math.floor(rows.length * 0.3));

    if (effectiveCount > 0) {
      distributeCreativeImageSlots(layerFrames || layerContent, 0, columns.length, imgRow, imgRowSpan, effectiveCount, geom, entropyFactor, s, 'HORIZONTAL AXIS', state.imageDistribution);
    }

    const crossColIdx = Math.max(1, Math.min(columns.length - 2, Math.floor(columns.length * (r2 > 0.5 ? 0.35 : 0.65))));
    const crossX = columns[crossColIdx].x + colWidth * 0.5;
    const crossH = (rows[rows.length - 1].y + rowHeight) - rows[0].y;
    const crossY = rows[rows.length - 1].y + rowHeight;
    const titleSize = baseScale * (2.4 + r1 * 0.5);
    const tc = getAdaptiveTextColor(geom, rows[0].y);

    appendSvgVerticalHeadline(layerContent, content.title, crossX, crossY, crossH, titleSize, '800', tc.title, entropyFactor > 0.7 ? 'red' : 'black', -90);

    const focalCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    focalCircle.setAttribute('cx', crossX);
    focalCircle.setAttribute('cy', rows[imgRow].y + (rowHeight * imgRowSpan) / 2);
    focalCircle.setAttribute('r', rowHeight * 0.85);
    focalCircle.setAttribute('fill', 'none');
    focalCircle.setAttribute('stroke', '#e63946');
    focalCircle.setAttribute('stroke-width', '1.5');
    layerContent.appendChild(focalCircle);

    const crossMark = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    crossMark.setAttribute('x', crossX);
    crossMark.setAttribute('y', rows[imgRow].y + (rowHeight * imgRowSpan) / 2 + 4);
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

    const bodyY = rows[imgRow].y + (rowHeight * imgRowSpan) + rowHeight * 0.5;
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
  }

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

  function appendSvgText(parent, lines, x, startY, fontSize, lineSpacing, fontWeight, color, rotation = 0, ghostEffect = false) {
    if (state.layoutManifest && (parent === layerContent || (parent && parent.closest && parent.closest('#LAYER_CONTENT')) || parent === null)) {
      state.layoutManifest.push({
        type: 'text',
        lines: lines,
        x: x,
        y: startY,
        fontSize: fontSize,
        lineSpacing: lineSpacing,
        fontWeight: fontWeight,
        color: color,
        rotation: rotation
      });
    }

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    if (rotation !== 0) {
      group.setAttribute('transform', `rotate(${rotation.toFixed(1)}, ${x}, ${startY})`);
    }

    const step = fontSize * lineSpacing;
    const capHeight = fontSize * 0.72; // Altura real de caixa alta da fonte Inter para ancoragem precisa à hang-line

    // Eco Tipográfico / Ghosting (David Carson / Ray Gun - Desconstrução Pós-Digital)
    if (ghostEffect) {
      const ghostEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      ghostEl.setAttribute('font-family', 'Inter, -apple-system, sans-serif');
      ghostEl.setAttribute('font-weight', fontWeight);
      ghostEl.setAttribute('font-size', fontSize);
      ghostEl.setAttribute('fill', '#86868b');
      ghostEl.setAttribute('opacity', '0.22');
      lines.forEach((lineStr, idx) => {
        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.setAttribute('x', x + fontSize * 0.1);
        tspan.setAttribute('y', (startY + capHeight + (idx * step) + fontSize * 0.08).toFixed(2));
        tspan.textContent = lineStr;
        ghostEl.appendChild(tspan);
      });
      group.appendChild(ghostEl);
    }

    const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textEl.setAttribute('font-family', 'Inter, -apple-system, sans-serif');
    textEl.setAttribute('font-weight', fontWeight);
    textEl.setAttribute('font-size', fontSize);
    textEl.setAttribute('fill', color);

    lines.forEach((lineStr, idx) => {
      const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan.setAttribute('x', x);
      // Ancoragem estrita à hang-line da grade: o topo das letras maiúsculas toca exatamente startY
      tspan.setAttribute('y', (startY + capHeight + (idx * step)).toFixed(2));
      tspan.textContent = lineStr;
      textEl.appendChild(tspan);
    });
    group.appendChild(textEl);

    if (parent) parent.appendChild(group);
  }

  function appendSvgImageFrame(parent, x, y, width, height, labelText, entropyFactor = 0) {
    if (width <= 0 || height <= 0) return;
    if (state.layoutManifest) {
      state.layoutManifest.push({
        type: 'image',
        x: x,
        y: y,
        width: width,
        height: height,
        label: labelText
      });
    }

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Deslocamento de matriz risográfica / Wireframe Shift em média/alta entropia
    if (entropyFactor > 0.25) {
      const shiftDist = (entropyFactor * 6.5);
      const shiftRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      shiftRect.setAttribute('x', x + shiftDist);
      shiftRect.setAttribute('y', y + shiftDist);
      shiftRect.setAttribute('width', width);
      shiftRect.setAttribute('height', height);
      shiftRect.setAttribute('fill', 'none');
      shiftRect.setAttribute('stroke', entropyFactor > 0.65 ? '#e63946' : '#86868b');
      shiftRect.setAttribute('stroke-width', '0.75');
      shiftRect.setAttribute('stroke-dasharray', entropyFactor > 0.6 ? '4 3' : 'none');
      shiftRect.setAttribute('opacity', '0.65');
      group.appendChild(shiftRect);
    }

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('fill', '#f5f5f7');
    rect.setAttribute('stroke', '#d1d1d6');
    rect.setAttribute('stroke-width', '0.75');
    group.appendChild(rect);

    // Cruz interna clássica
    const c1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    c1.setAttribute('x1', x); c1.setAttribute('y1', y);
    c1.setAttribute('x2', x + width); c1.setAttribute('y2', y + height);
    c1.setAttribute('stroke', '#e5e5ea'); c1.setAttribute('stroke-width', '0.75');
    group.appendChild(c1);

    const c2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    c2.setAttribute('x1', x + width); c2.setAttribute('y1', y);
    c2.setAttribute('x2', x); c2.setAttribute('y2', y + height);
    c2.setAttribute('stroke', '#e5e5ea'); c2.setAttribute('stroke-width', '0.75');
    group.appendChild(c2);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
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
    }

    const targetLayer = layerFrames || parent;
    if (targetLayer) targetLayer.appendChild(group);
  }

  function appendStatBadge(parent, x, y, width, height, statNum, statLabel, baseScale, entropyFactor = 0) {
    if (state.layoutManifest) {
      state.layoutManifest.push({
        type: 'statBadge',
        x: x,
        y: y,
        width: width,
        height: height,
        statNum: statNum,
        statLabel: statLabel
      });
    }

    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Rotação dinâmica em média/alta entropia
    if (entropyFactor > 0.40) {
      const rot = (entropyFactor - 0.40) * 7 * (statNum.length % 2 === 0 ? 1 : -1);
      group.setAttribute('transform', `rotate(${rot.toFixed(1)}, ${x + width / 2}, ${y + height / 2})`);
    }

    const isSolid = entropyFactor > 0.50;
    const isRed = entropyFactor > 0.75;
    const bgColor = isRed ? '#e63946' : (isSolid ? '#1d1d1f' : 'none');
    const strokeColor = isRed ? '#e63946' : '#1d1d1f';
    const numColor = isSolid ? '#ffffff' : '#1d1d1f';
    const labelColor = isSolid ? 'rgba(255,255,255,0.85)' : '#86868b';

    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x); rect.setAttribute('y', y);
    rect.setAttribute('width', width); rect.setAttribute('height', height);
    rect.setAttribute('fill', bgColor);
    rect.setAttribute('stroke', strokeColor); rect.setAttribute('stroke-width', '1');
    group.appendChild(rect);

    const innerW = Math.max(2, width - 12);

    // Dynamic sizing for the big number
    let numSize = baseScale * (2.0 + entropyFactor * 0.4);
    measureCtx.font = `800 ${numSize}px Inter, sans-serif`;
    const numW = measureCtx.measureText(statNum).width;
    if (numW > innerW) {
      numSize = Math.max(2, numSize * (innerW / numW) * 0.95);
    }

    const numText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    numText.setAttribute('x', x + 6);
    numText.setAttribute('y', y + numSize * 0.9 + 2);
    numText.setAttribute('font-family', 'Inter, sans-serif');
    numText.setAttribute('font-weight', '800');
    numText.setAttribute('font-size', numSize);
    numText.setAttribute('fill', numColor);
    numText.textContent = statNum;
    group.appendChild(numText);

    // Dynamic sizing for the label so long words don't break outside
    let lblSize = Math.max(getMinUnitSize(5.5), baseScale * 0.28);
    measureCtx.font = `600 ${lblSize}px JetBrains Mono, monospace`;
    const words = statLabel.split(/\s+/);
    const longestWordW = Math.max(...words.map(w => measureCtx.measureText(w).width));
    
    if (longestWordW > innerW) {
       lblSize = Math.max(1.5, lblSize * (innerW / longestWordW) * 0.95);
    }

    const lblLines = wrapTextToWidth(statLabel, innerW, lblSize, '600', 'JetBrains Mono, monospace');
    appendSvgText(group, lblLines, x + 6, y + numSize + 8, lblSize, 1.25, '600', labelColor);

    if (parent) parent.appendChild(group);
  }

  function calculateGridSnappedColumns(columns, startCol, numCols, preferredCount, unit = state.unit) {
    if (!columns || columns.length === 0 || numCols <= 0) return [];

    const colWidth = columns[0].width;
    const minReadableW = (unit === 'mm') ? 38.0 : ((unit === 'cm') ? 3.8 : ((unit === 'pt') ? 108.0 : 140.0));

    // Se o chamador quer explicitamente 1 coluna, retorne span total dos módulos
    if (preferredCount <= 1 || numCols === 1) {
      return [{ start: startCol, end: startCol + numCols - 1 }];
    }

    // Se uma única coluna de grid já é larga o suficiente (ex: layout de 2 ou 3 colunas largas)
    if (colWidth >= minReadableW) {
      const count = Math.min(numCols, preferredCount);
      const span = Math.floor(numCols / count);
      const res = [];
      for (let i = 0; i < count; i++) {
        const s = startCol + i * span;
        const e = (i < count - 1) ? (s + span - 1) : (startCol + numCols - 1);
        res.push({ start: s, end: e });
      }
      return res;
    }

    // Caso padrão: módulos estreitos (colWidth < minReadableW, ex: grids de 6, 8, 12 colunas)
    // Cada coluna de texto de corpo DEVE ter span >= 2 módulos para ter medida de leitura adequada
    const minSpan = 2;
    const maxPossibleCols = Math.floor(numCols / minSpan);

    if (maxPossibleCols <= 1) {
      // Se não dá para ter 2 colunas de pelo menos 2 módulos (ex: numCols = 2 ou 3),
      // funde em 1 coluna sólida e legível cobrindo todos os módulos disponíveis!
      return [{ start: startCol, end: startCol + numCols - 1 }];
    }

    const targetCount = Math.min(preferredCount, maxPossibleCols);

    // Procura divisão modular exata
    const valid = [];
    for (let count = targetCount; count >= 2; count--) {
      if (numCols % count === 0) {
        const span = numCols / count;
        if (span >= minSpan) {
          valid.push({ count, span });
        }
      }
    }

    if (valid.length > 0) {
      const best = valid[0];
      const res = [];
      for (let i = 0; i < best.count; i++) {
        const s = startCol + i * best.span;
        res.push({ start: s, end: s + best.span - 1 });
      }
      return res;
    }

    // Caso ímpar (ex: 5 módulos com target 2) -> Divisão simétrica com canal central de respiro suíço
    if (numCols === 5 && targetCount === 2) {
      return [
        { start: startCol, end: startCol + 1 },
        { start: startCol + 3, end: startCol + 4 }
      ];
    }

    // Fallback proporcional perfeitamente snappado aos módulos
    const spanA = Math.floor(numCols / targetCount);
    const res = [];
    let curr = startCol;
    for (let i = 0; i < targetCount; i++) {
      const span = (i < targetCount - 1) ? spanA : (startCol + numCols - curr);
      res.push({ start: curr, end: curr + span - 1 });
      curr += span;
    }
    return res;
  }

  // Helper para renderizar linhas de texto empacotadas no SVG com tspan
  function renderTextLines(parent, lines, x, startY, lineHeight, fontSize, fontWeight, color, opacity, maxY, letterSpacing) {
    if (!parent || !lines || lines.length === 0) return startY;
    const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textEl.setAttribute('font-family', 'Inter, -apple-system, sans-serif');
    textEl.setAttribute('font-size', fontSize.toFixed(2));
    if (fontWeight) textEl.setAttribute('font-weight', fontWeight);
    if (color) textEl.setAttribute('fill', color);
    if (opacity) textEl.setAttribute('opacity', opacity.toString());
    if (letterSpacing) textEl.setAttribute('letter-spacing', letterSpacing);

    let curY = startY;
    lines.forEach(l => {
      if (curY <= maxY) {
        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.setAttribute('x', x);
        tspan.setAttribute('y', curY.toFixed(2));
        tspan.textContent = l;
        textEl.appendChild(tspan);
        curY += lineHeight;
      }
    });
    parent.appendChild(textEl);
    return curY;
  }

  // =========================================================================
  // MOTOR CRIATIVO DE DIAGRAMAÇÃO TIPOGRÁFICA MULTICOLUNAR
  // Quebra a monotonia de colunas idênticas com Lead monumental (Tamanho X),
  // respiros suíços (negative space ativo), diálogo bilíngue e corpo (Tamanho Y).
  // Inspirado em Josef Müller-Brockmann, Emil Ruder & Karl Gerstner.
  // =========================================================================
  function appendMultiColumnBody(parent, columns, startCol, numCols, colWidth, startY, maxY, textCopy, preferredCols, baseScale) {
    if (!columns || columns.length === 0 || numCols <= 0) return;

    // Calcula colunas travadas estritamente aos módulos do grid
    const textColRanges = calculateGridSnappedColumns(columns, startCol, numCols, preferredCols || 3, state.unit);
    const totalCols = textColRanges.length;
    if (totalCols === 0) return;

    // Determina o modo ativo de hierarquia tipográfica
    let mode = state.textHierarchy || 'creative_auto';
    if (mode === 'creative_auto') {
      const roll = seededRandom(state.seed + startCol * 17 + 89);
      if (totalCols >= 3) {
        if (roll < 0.46) {
          mode = 'lead_and_body';       // 46%: Lead Monumental Tam. X + Respiro + Corpo Tam. Y (Pôster Swiss Style)
        } else if (roll < 0.72) {
          mode = 'bilingual_dialogue';  // 26%: Diálogo de Escalas Bilíngue (Grid Systems Müller-Brockmann)
        } else if (roll < 0.87) {
          mode = 'quote_callout';        // 15%: Citação Destaque com Fio de Acento + Coluna de Apoio
        } else {
          mode = 'asymmetric_breathing'; // 13%: Assimetria com Espaço Negativo Ativo & Índice
        }
      } else if (totalCols === 2) {
        if (roll < 0.65) {
          mode = 'lead_and_body';
        } else {
          mode = 'bilingual_dialogue';
        }
      } else {
        mode = 'lead_and_body';
      }
    }

    // Escalas Tipográficas Harmoniosas (baseScale derivado da prancheta)
    const minBody = getMinUnitSize(10.5);
    const bodySize = Math.max(minBody, baseScale * 0.48);
    const bodyLineH = bodySize * 1.42;

    const minLead = getMinUnitSize(16.5);
    const leadSize = Math.max(minLead, baseScale * 0.95);
    const leadLineH = leadSize * 1.20;

    const subLabelSize = Math.max(getMinUnitSize(6.5), baseScale * 0.28);
    const tc = (typeof getAdaptiveTextColor === 'function') ? getAdaptiveTextColor(null, startY) : { body: '#1d1d1f' };
    const textColor = tc.body || '#1d1d1f';
    const accentColor = '#e02424';

    if (mode === 'lead_and_body') {
      renderModeLeadAndBody(parent, columns, textColRanges, colWidth, startY, maxY, textCopy, baseScale, leadSize, leadLineH, bodySize, bodyLineH, subLabelSize, textColor, accentColor);
    } else if (mode === 'bilingual_dialogue') {
      renderModeBilingualDialogue(parent, columns, textColRanges, colWidth, startY, maxY, textCopy, baseScale, leadSize, bodySize, bodyLineH, subLabelSize, textColor, accentColor);
    } else if (mode === 'quote_callout') {
      renderModeQuoteCallout(parent, columns, textColRanges, colWidth, startY, maxY, textCopy, baseScale, bodySize, bodyLineH, subLabelSize, textColor, accentColor);
    } else if (mode === 'asymmetric_breathing') {
      renderModeAsymmetricBreathing(parent, columns, textColRanges, colWidth, startY, maxY, textCopy, baseScale, bodySize, bodyLineH, subLabelSize, textColor, accentColor);
    } else {
      renderModeClassicColumns(parent, columns, textColRanges, colWidth, startY, maxY, textCopy, bodySize, bodyLineH, textColor);
    }
  }

  // 1. MODO LEAD MONUMENTAL (TAMANHO X) + RESPIRO SUÍÇO + CORPO (TAMANHO Y)
  // Referência Exata: Pôster Swiss Style de Josef Müller-Brockmann
  function renderModeLeadAndBody(parent, columns, textColRanges, colWidth, startY, maxY, textCopy, baseScale, leadSize, leadLineH, bodySize, bodyLineH, subLabelSize, textColor, accentColor) {
    const totalCols = textColRanges.length;

    if (totalCols >= 3) {
      // COLUNA 0: LEAD MONUMENTAL (TAMANHO X)
      const r0 = textColRanges[0];
      const c0Start = Math.max(0, Math.min(columns.length - 1, r0.start));
      const c0End = Math.max(0, Math.min(columns.length - 1, r0.end));
      const col0X = columns[c0Start].x;
      const fullCol0W = (columns[c0End].x + colWidth) - col0X;
      const col0W = Math.max(10, fullCol0W - Math.max(1.5, state.gutter * 0.25));
      const col0H = Math.max(20, maxY - startY);

      const leadIndex = (state.seed + 1) % leadPhrases.length;
      const leadText = leadPhrases[leadIndex];
      const leadLines = wrapTextToWidth(leadText, col0W, leadSize, '600');

      if (state.layoutManifest) {
        state.layoutManifest.push({
          type: 'leadColumn',
          x: col0X,
          y: startY,
          width: fullCol0W,
          height: col0H,
          text: leadText,
          fontSize: leadSize,
          fontWeight: '600'
        });
      }

      renderTextLines(parent, leadLines, col0X, startY + (leadSize * 0.72), leadLineH, leadSize, '600', textColor, 0.96, maxY, '-0.02em');

      // COLUNAS INTERMEDIÁRIAS: RESPIRO SUÍÇO (NEGATIVE SPACE ATIVO) + MICRO-ETIQUETA
      for (let midIdx = 1; midIdx < totalCols - 1; midIdx++) {
        const rMid = textColRanges[midIdx];
        const cMidStart = Math.max(0, Math.min(columns.length - 1, rMid.start));
        const cMidEnd = Math.max(0, Math.min(columns.length - 1, rMid.end));
        const colMidX = columns[cMidStart].x;
        const fullColMidW = (columns[cMidEnd].x + colWidth) - colMidX;
        const colMidW = Math.max(10, fullColMidW - Math.max(1.5, state.gutter * 0.25));

        const midLabel = subLabels[(state.seed + midIdx) % subLabels.length];

        if (state.layoutManifest) {
          state.layoutManifest.push({
            type: 'subLabel',
            x: colMidX,
            y: startY,
            width: fullColMidW,
            height: subLabelSize * 2,
            text: midLabel,
            fontSize: subLabelSize
          });
        }

        renderTextLines(parent, [midLabel], colMidX, startY + (subLabelSize * 0.72), subLabelSize * 1.2, subLabelSize, '600', textColor, 0.75, maxY, '0.06em');

        // Hairline técnica sutil abaixo da micro-etiqueta
        const hairline = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        hairline.setAttribute('x1', colMidX);
        hairline.setAttribute('y1', (startY + subLabelSize * 1.5).toFixed(2));
        hairline.setAttribute('x2', colMidX + Math.min(colMidW, 20));
        hairline.setAttribute('y2', (startY + subLabelSize * 1.5).toFixed(2));
        hairline.setAttribute('stroke', textColor);
        hairline.setAttribute('stroke-width', '0.5');
        hairline.setAttribute('opacity', '0.25');
        if (parent) parent.appendChild(hairline);
        // O restante da coluna permanece vazio como respiro suíço
      }

      // ÚLTIMA COLUNA: CORPO DE LEITURA EM TAMANHO Y (MÚLTIPLOS PARÁGRAFOS)
      const rEnd = textColRanges[totalCols - 1];
      const cEndStart = Math.max(0, Math.min(columns.length - 1, rEnd.start));
      const cEndEnd = Math.max(0, Math.min(columns.length - 1, rEnd.end));
      const colEndX = columns[cEndStart].x;
      const fullColEndW = (columns[cEndEnd].x + colWidth) - colEndX;
      const colEndW = Math.max(10, fullColEndW - Math.max(1.5, state.gutter * 0.25));
      const colEndH = Math.max(20, maxY - startY);

      const p1 = bodyTexts[0];
      const p2 = bodyTexts[1];
      const p3 = bodyTexts[2];
      const narrative = `${p1}\n\n${p2}\n\n${p3}`;

      if (state.layoutManifest) {
        state.layoutManifest.push({
          type: 'bodyColumn',
          x: colEndX,
          y: startY,
          width: fullColEndW,
          height: colEndH,
          text: narrative,
          fontSize: bodySize,
          fontWeight: '400'
        });
      }

      let curYEnd = startY + (bodySize * 0.72);
      const paragraphs = [p1, p2, p3];
      for (const p of paragraphs) {
        const pLines = wrapTextToWidth(p, colEndW, bodySize, '400');
        curYEnd = renderTextLines(parent, pLines, colEndX, curYEnd, bodyLineH, bodySize, '400', textColor, 0.90, maxY, 'normal');
        curYEnd += bodySize * 0.55; // respiro harmônico entre parágrafos
        if (curYEnd >= maxY) break;
      }

    } else if (totalCols === 2) {
      // 2 Colunas: Coluna 0 é Lead Tamanho X, Coluna 1 é Corpo Tamanho Y
      const r0 = textColRanges[0];
      const c0Start = Math.max(0, Math.min(columns.length - 1, r0.start));
      const c0End = Math.max(0, Math.min(columns.length - 1, r0.end));
      const col0X = columns[c0Start].x;
      const fullCol0W = (columns[c0End].x + colWidth) - col0X;
      const col0W = Math.max(10, fullCol0W - Math.max(1.5, state.gutter * 0.25));
      const col0H = Math.max(20, maxY - startY);

      const leadText = leadPhrases[(state.seed) % leadPhrases.length];
      const leadLines = wrapTextToWidth(leadText, col0W, leadSize, '600');

      if (state.layoutManifest) {
        state.layoutManifest.push({
          type: 'leadColumn',
          x: col0X,
          y: startY,
          width: fullCol0W,
          height: col0H,
          text: leadText,
          fontSize: leadSize,
          fontWeight: '600'
        });
      }
      renderTextLines(parent, leadLines, col0X, startY + (leadSize * 0.72), leadLineH, leadSize, '600', textColor, 0.96, maxY, '-0.02em');

      const r1 = textColRanges[1];
      const c1Start = Math.max(0, Math.min(columns.length - 1, r1.start));
      const c1End = Math.max(0, Math.min(columns.length - 1, r1.end));
      const col1X = columns[c1Start].x;
      const fullCol1W = (columns[c1End].x + colWidth) - col1X;
      const col1W = Math.max(10, fullCol1W - Math.max(1.5, state.gutter * 0.25));
      const col1H = Math.max(20, maxY - startY);

      const p1 = bodyTexts[1];
      const p2 = bodyTexts[2];
      const narrative = `${p1}\n\n${p2}`;

      if (state.layoutManifest) {
        state.layoutManifest.push({
          type: 'bodyColumn',
          x: col1X,
          y: startY,
          width: fullCol1W,
          height: col1H,
          text: narrative,
          fontSize: bodySize,
          fontWeight: '400'
        });
      }

      let curY1 = startY + (bodySize * 0.72);
      const paragraphs = [p1, p2];
      for (const p of paragraphs) {
        const pLines = wrapTextToWidth(p, col1W, bodySize, '400');
        curY1 = renderTextLines(parent, pLines, col1X, curY1, bodyLineH, bodySize, '400', textColor, 0.90, maxY, 'normal');
        curY1 += bodySize * 0.55;
        if (curY1 >= maxY) break;
      }

    } else {
      // 1 Coluna: Split Vertical Lead no topo + Corpo abaixo
      const r0 = textColRanges[0];
      const cStart = Math.max(0, Math.min(columns.length - 1, r0.start));
      const cEnd = Math.max(0, Math.min(columns.length - 1, r0.end));
      const colX = columns[cStart].x;
      const fullColW = (columns[cEnd].x + colWidth) - colX;
      const colW = Math.max(10, fullColW - Math.max(1.5, state.gutter * 0.25));

      const leadText = leadPhrases[(state.seed) % leadPhrases.length];
      const leadLines = wrapTextToWidth(leadText, colW, leadSize * 0.88, '600');
      let curY = renderTextLines(parent, leadLines, colX, startY + (leadSize * 0.88 * 0.72), leadLineH * 0.88, leadSize * 0.88, '600', textColor, 0.96, maxY, '-0.02em');

      curY += bodySize * 0.8;
      if (curY + bodyLineH <= maxY) {
        const pLines = wrapTextToWidth(bodyTexts[0], colW, bodySize, '400');
        renderTextLines(parent, pLines, colX, curY + (bodySize * 0.72), bodyLineH, bodySize, '400', textColor, 0.90, maxY, 'normal');
      }
    }
  }

  // 2. MODO DIÁLOGO DE ESCALAS BILÍNGUE
  // Referência: Capa e miolo de Grid Systems de Josef Müller-Brockmann
  function renderModeBilingualDialogue(parent, columns, textColRanges, colWidth, startY, maxY, textCopy, baseScale, leadSize, bodySize, bodyLineH, subLabelSize, textColor, accentColor) {
    const totalCols = textColRanges.length;

    // COLUNA 0: TÍTULO DE SEÇÃO + DECLARAÇÃO TÉCNICA EM TAMANHO X
    const r0 = textColRanges[0];
    const c0Start = Math.max(0, Math.min(columns.length - 1, r0.start));
    const c0End = Math.max(0, Math.min(columns.length - 1, r0.end));
    const col0X = columns[c0Start].x;
    const fullCol0W = (columns[c0End].x + colWidth) - col0X;
    const col0W = Math.max(10, fullCol0W - Math.max(1.5, state.gutter * 0.25));

    const phrase = editorialPhrases[state.seed % editorialPhrases.length];
    const sectionTitle = phrase.sub.toUpperCase();
    const subTitleSize = Math.max(getMinUnitSize(12.5), baseScale * 0.68);
    const subTitleLines = wrapTextToWidth(sectionTitle, col0W, subTitleSize, '700');

    let curY0 = renderTextLines(parent, subTitleLines, col0X, startY + (subTitleSize * 0.72), subTitleSize * 1.18, subTitleSize, '700', textColor, 0.98, maxY, '-0.01em');

    // Sub-bloco técnico em tamanho intermediário
    curY0 += subTitleSize * 0.45;
    const techText = "A visual communication manual for graphic designers, typographers and three-dimensional designers.";
    const techSize = Math.max(getMinUnitSize(10.5), baseScale * 0.52);
    const techLines = wrapTextToWidth(techText, col0W, techSize, '500');
    renderTextLines(parent, techLines, col0X, curY0 + (techSize * 0.72), techSize * 1.30, techSize, '500', textColor, 0.85, maxY, 'normal');

    if (state.layoutManifest) {
      state.layoutManifest.push({
        type: 'leadColumn',
        x: col0X,
        y: startY,
        width: fullCol0W,
        height: Math.max(20, maxY - startY),
        text: `${sectionTitle}\n${techText}`,
        fontSize: subTitleSize,
        fontWeight: '700'
      });
    }

    // COLUNAS COMPLEMENTARES: CORPO BILÍNGUE / EXPLICATIVO EM TAMANHO Y
    for (let cIdx = 1; cIdx < totalCols; cIdx++) {
      const r = textColRanges[cIdx];
      const cStart = Math.max(0, Math.min(columns.length - 1, r.start));
      const cEnd = Math.max(0, Math.min(columns.length - 1, r.end));
      const colX = columns[cStart].x;
      const fullColW = (columns[cEnd].x + colWidth) - colX;
      const colW = Math.max(10, fullColW - Math.max(1.5, state.gutter * 0.25));

      const germanHeader = (cIdx === 1) ? "RASTER SYSTEME // GESTALTUNG" : "TYPOGRAFISCHE ORDNUNG";
      renderTextLines(parent, [germanHeader], colX, startY + (subLabelSize * 0.72), subLabelSize * 1.2, subLabelSize, '700', accentColor, 0.95, maxY, '0.06em');

      const colParagraph = bodyTexts[(cIdx + 1) % bodyTexts.length];
      const pLines = wrapTextToWidth(colParagraph, colW, bodySize, '400');
      renderTextLines(parent, pLines, colX, startY + subLabelSize * 2.2 + (bodySize * 0.72), bodyLineH, bodySize, '400', textColor, 0.90, maxY, 'normal');

      if (state.layoutManifest) {
        state.layoutManifest.push({
          type: 'bodyColumn',
          x: colX,
          y: startY,
          width: fullColW,
          height: Math.max(20, maxY - startY),
          text: `${germanHeader}\n${colParagraph}`,
          fontSize: bodySize,
          fontWeight: '400'
        });
      }
    }
  }

  // 3. MODO CITAÇÃO DESTAQUE COM FIO DE ACENTO + COLUNAS DE APOIO
  function renderModeQuoteCallout(parent, columns, textColRanges, colWidth, startY, maxY, textCopy, baseScale, bodySize, bodyLineH, subLabelSize, textColor, accentColor) {
    const totalCols = textColRanges.length;

    // COLUNA 0: CITAÇÃO MANIFESTO EM TAMANHO X COM BARRA VERTICAL VERMELHA/PRETA
    const r0 = textColRanges[0];
    const c0Start = Math.max(0, Math.min(columns.length - 1, r0.start));
    const c0End = Math.max(0, Math.min(columns.length - 1, r0.end));
    const col0X = columns[c0Start].x;
    const fullCol0W = (columns[c0End].x + colWidth) - col0X;
    const col0W = Math.max(10, fullCol0W - Math.max(1.5, state.gutter * 0.25) - 6);
    const col0H = Math.max(20, maxY - startY);

    const quoteSize = Math.max(getMinUnitSize(13.5), baseScale * 0.72);
    const quoteLineH = quoteSize * 1.26;
    const quoteText = "«O espaço em branco não representa o vazio ou a ausência; ele é o suporte ativo que confere autoridade e respiro à mensagem.»";
    const quoteLines = wrapTextToWidth(quoteText, col0W, quoteSize, '500');

    // Fio de acento vertical à esquerda
    const bar = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    bar.setAttribute('x1', col0X);
    bar.setAttribute('y1', startY);
    bar.setAttribute('x2', col0X);
    bar.setAttribute('y2', Math.min(maxY, startY + quoteLines.length * quoteLineH + quoteSize));
    bar.setAttribute('stroke', accentColor);
    bar.setAttribute('stroke-width', '2.5');
    if (parent) parent.appendChild(bar);

    let curY0 = renderTextLines(parent, quoteLines, col0X + 6, startY + (quoteSize * 0.72), quoteLineH, quoteSize, '500', textColor, 0.95, maxY, '-0.01em');

    // Crédito do autor na base da citação
    curY0 += subLabelSize * 0.8;
    if (curY0 <= maxY) {
      renderTextLines(parent, ["// JOSEF MÜLLER-BROCKMANN"], col0X + 6, curY0 + (subLabelSize * 0.72), subLabelSize * 1.2, subLabelSize, '600', textColor, 0.65, maxY, '0.08em');
    }

    if (state.layoutManifest) {
      state.layoutManifest.push({
        type: 'quoteBlock',
        x: col0X,
        y: startY,
        width: fullCol0W,
        height: col0H,
        text: quoteText,
        fontSize: quoteSize,
        fontWeight: '500'
      });
    }

    // COLUNAS RESTANTES: CORPO EM TAMANHO Y
    for (let cIdx = 1; cIdx < totalCols; cIdx++) {
      const r = textColRanges[cIdx];
      const cStart = Math.max(0, Math.min(columns.length - 1, r.start));
      const cEnd = Math.max(0, Math.min(columns.length - 1, r.end));
      const colX = columns[cStart].x;
      const fullColW = (columns[cEnd].x + colWidth) - colX;
      const colW = Math.max(10, fullColW - Math.max(1.5, state.gutter * 0.25));

      const colParagraph = bodyTexts[(cIdx + state.seed) % bodyTexts.length];
      const pLines = wrapTextToWidth(colParagraph, colW, bodySize, '400');
      renderTextLines(parent, pLines, colX, startY + (bodySize * 0.72), bodyLineH, bodySize, '400', textColor, 0.90, maxY, 'normal');

      if (state.layoutManifest) {
        state.layoutManifest.push({
          type: 'bodyColumn',
          x: colX,
          y: startY,
          width: fullColW,
          height: Math.max(20, maxY - startY),
          text: colParagraph,
          fontSize: bodySize,
          fontWeight: '400'
        });
      }
    }
  }

  // 4. MODO ASSIMETRIA COM ESPAÇO NEGATIVO ATIVO & ÍNDICE
  function renderModeAsymmetricBreathing(parent, columns, textColRanges, colWidth, startY, maxY, textCopy, baseScale, bodySize, bodyLineH, subLabelSize, textColor, accentColor) {
    const totalCols = textColRanges.length;

    // COLUNA 0: ESPAÇO EM BRANCO ATIVO COM NÚMERO DE SEÇÃO MONUMENTAL
    const r0 = textColRanges[0];
    const c0Start = Math.max(0, Math.min(columns.length - 1, r0.start));
    const c0End = Math.max(0, Math.min(columns.length - 1, r0.end));
    const col0X = columns[c0Start].x;
    const fullCol0W = (columns[c0End].x + colWidth) - col0X;

    const numSize = Math.max(getMinUnitSize(22.0), baseScale * 1.35);
    renderTextLines(parent, ["01."], col0X, startY + (numSize * 0.72), numSize * 1.1, numSize, '800', accentColor, 0.95, maxY, '-0.04em');
    renderTextLines(parent, ["ESTUDO DE PROPORÇÃO"], col0X, startY + numSize + (subLabelSize * 0.72), subLabelSize * 1.2, subLabelSize, '700', textColor, 0.70, maxY, '0.08em');

    if (state.layoutManifest) {
      state.layoutManifest.push({
        type: 'subLabel',
        x: col0X,
        y: startY,
        width: fullCol0W,
        height: numSize + subLabelSize * 2,
        text: "01. ESTUDO DE PROPORÇÃO",
        fontSize: numSize
      });
    }

    // COLUNAS SEGUINTES: CORPO EM TAMANHO Y
    for (let cIdx = 1; cIdx < totalCols; cIdx++) {
      const r = textColRanges[cIdx];
      const cStart = Math.max(0, Math.min(columns.length - 1, r.start));
      const cEnd = Math.max(0, Math.min(columns.length - 1, r.end));
      const colX = columns[cStart].x;
      const fullColW = (columns[cEnd].x + colWidth) - colX;
      const colW = Math.max(10, fullColW - Math.max(1.5, state.gutter * 0.25));

      const colParagraph = bodyTexts[(cIdx) % bodyTexts.length];
      const pLines = wrapTextToWidth(colParagraph, colW, bodySize, '400');
      renderTextLines(parent, pLines, colX, startY + (bodySize * 0.72), bodyLineH, bodySize, '400', textColor, 0.90, maxY, 'normal');

      if (state.layoutManifest) {
        state.layoutManifest.push({
          type: 'bodyColumn',
          x: colX,
          y: startY,
          width: fullColW,
          height: Math.max(20, maxY - startY),
          text: colParagraph,
          fontSize: bodySize,
          fontWeight: '400'
        });
      }
    }
  }

  // 5. MODO COLUNAS UNIFORMES COM LEAD-IN
  function renderModeClassicColumns(parent, columns, textColRanges, colWidth, startY, maxY, textCopy, bodySize, bodyLineH, textColor) {
    textColRanges.forEach((range, colIdx) => {
      const cStart = Math.max(0, Math.min(columns.length - 1, range.start));
      const cEnd = Math.max(0, Math.min(columns.length - 1, range.end));
      const colX = columns[cStart].x;
      const fullColW = (columns[cEnd].x + colWidth) - colX;
      const colW = Math.max(10, fullColW - Math.max(1.5, state.gutter * 0.25));
      const colH = Math.max(20, maxY - startY);

      const colParagraph = bodyTexts[(colIdx + state.seed) % bodyTexts.length] || textCopy;

      if (state.layoutManifest) {
        state.layoutManifest.push({
          type: 'bodyColumn',
          x: colX,
          y: startY,
          width: fullColW,
          height: colH,
          text: colParagraph,
          fontSize: bodySize,
          fontWeight: '400'
        });
      }

      const lines = wrapTextToWidth(colParagraph, colW, bodySize, '400');
      renderTextLines(parent, lines, colX, startY + (bodySize * 0.72), bodyLineH, bodySize, '400', textColor, 0.92, maxY, 'normal');
    });
  }


  // -------------------------------------------------------------------------
  // METADADOS COMUNS (TOP BARCODE / FOLIO)
  // -------------------------------------------------------------------------
  function renderStandardMetadata(geom, content, baseScale, s, entropyFactor = 0) {
    const { w, h, margins } = geom;
    const metaGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    metaGroup.setAttribute('id', 'METADATA_MICROTYPOGRAPHY');
    const metaSize = Math.max(getMinUnitSize(5.5), baseScale * 0.25);

    const r1 = seededRandom(s + 200);
    const r2 = seededRandom(s + 201);

    const topHeader = `LAYOUTFORGE // ${content.issue} // SEED #${state.seed}`;
    const folioText = `P. 01 — GRID: ${state.cols} COL × ${state.rows} MOD // ${state.school.toUpperCase()}`;

    if (state.layoutManifest) {
      state.layoutManifest.push({
        type: 'topFolio',
        x: margins.left,
        y: Math.max(metaSize + 1, margins.top - 6),
        width: w - margins.left - margins.right,
        height: 5,
        text: topHeader
      });
      state.layoutManifest.push({
        type: 'bottomFolio',
        x: margins.left,
        y: h - Math.max(4, margins.bottom * 0.4),
        width: w - margins.left - margins.right,
        height: 5,
        text: folioText
      });
    }

    // Helper for texts
    const addText = (text, x, y, anchor = 'start') => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      el.setAttribute('x', x);
      el.setAttribute('y', y);
      el.setAttribute('font-family', 'JetBrains Mono, monospace');
      el.setAttribute('font-size', metaSize);
      el.setAttribute('letter-spacing', '0.04em');
      el.setAttribute('fill', '#86868b');
      el.setAttribute('text-anchor', anchor);
      el.textContent = text;
      metaGroup.appendChild(el);
    };

    // Variações de Posicionamento da Microtipografia de Borda
    const topY = Math.max(metaSize + 1, margins.top - 3);
    const botY = h - Math.max(3, margins.bottom * 0.35);

    if (r1 < 0.33) {
      // Clássico: Topo Esq, Base Esq, Barcode Base Dir
      addText(topHeader, margins.left, topY);
      addText(folioText, margins.left, botY);
      drawBarcode(w - margins.right - 28, botY - 6, 28, metaGroup);
    } else if (r1 < 0.66) {
      // Moderno Invertido: Topo Dir, Base Dir, Barcode Topo Esq
      addText(topHeader, w - margins.right, topY, 'end');
      addText(folioText, w - margins.right, botY, 'end');
      drawBarcode(margins.left, topY - 6, 28, metaGroup);
    } else {
      // Minimalista Centrado: Base Centro, Topo Centro, Crosshairs laterais
      addText(topHeader, w / 2, topY, 'middle');
      addText(folioText, w / 2, botY, 'middle');
      
      if (r2 > 0.5) {
        drawCrosshair(margins.left, topY, metaGroup);
        drawCrosshair(w - margins.right, botY, metaGroup);
      } else {
        drawBarcode(margins.left, botY - 6, 28, metaGroup);
      }
    }

    // Tag vertical experimental ao longo da margem (David Carson / Ray Gun em alta entropia)
    if (entropyFactor > 0.65) {
      const vertTag = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      const vertX = margins.left - 4;
      const vertY = h / 2;
      vertTag.setAttribute('x', vertX);
      vertTag.setAttribute('y', vertY);
      vertTag.setAttribute('font-family', 'JetBrains Mono, monospace');
      vertTag.setAttribute('font-size', metaSize * 0.9);
      vertTag.setAttribute('letter-spacing', '0.12em');
      vertTag.setAttribute('fill', entropyFactor > 0.8 ? '#e63946' : '#86868b');
      vertTag.setAttribute('transform', `rotate(-90, ${vertX}, ${vertY})`);
      vertTag.setAttribute('text-anchor', 'middle');
      vertTag.textContent = `RAYGUN // ENTROPY: ${Math.round(entropyFactor * 100)}% // DISRUPTION MATRIX`;
      metaGroup.appendChild(vertTag);
    }

    layerContent.appendChild(metaGroup);
  }

  function drawBarcode(x, y, width, group) {
    for (let b = 0; b < 10; b++) {
      const bLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      bLine.setAttribute('x1', x + b * (width / 10));
      bLine.setAttribute('y1', y);
      bLine.setAttribute('x2', x + b * (width / 10));
      bLine.setAttribute('y2', y + 6);
      bLine.setAttribute('stroke', '#1d1d1f');
      bLine.setAttribute('stroke-width', b % 3 === 0 ? '1.2' : '0.5');
      group.appendChild(bLine);
    }
  }

  function drawCrosshair(x, y, group) {
    const s = 4;
    const c1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    c1.setAttribute('x1', x - s); c1.setAttribute('y1', y);
    c1.setAttribute('x2', x + s); c1.setAttribute('y2', y);
    c1.setAttribute('stroke', '#86868b'); c1.setAttribute('stroke-width', '0.75');
    
    const c2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    c2.setAttribute('x1', x); c2.setAttribute('y1', y - s);
    c2.setAttribute('x2', x); c2.setAttribute('y2', y + s);
    c2.setAttribute('stroke', '#86868b'); c2.setAttribute('stroke-width', '0.75');
    
    group.appendChild(c1);
    group.appendChild(c2);
  }

  // =========================================================================
  // 8. ESCALA & FIT TO SCREEN
  // =========================================================================
  function getScreenScaleFactor() {
    // Normaliza unidades para uma visualização confortável em tela
    // Para mm: 1mm equivale a ~2.4 a 3px de tela dependendo da área
    if (state.unit === 'px') return 0.55;
    if (state.unit === 'cm') return 25.0;
    if (state.unit === 'pt') return 0.9;
    return 2.5; // mm base
  }

  function fitArtboardToScreen() {
    const stageRect = artboardStage.getBoundingClientRect();
    const geom = calculateGeometry();
    const scale = getScreenScaleFactor();
    const paperW = geom.w * scale;
    const paperH = geom.h * scale;

    const availW = stageRect.width - 120;
    const availH = stageRect.height - 120;

    const fitZoom = Math.min(availW / paperW, availH / paperH, 1.6);
    state.zoom = Math.max(0.2, parseFloat(fitZoom.toFixed(2)));
    state.panX = 0;
    state.panY = 0;
    applyTransform();
  }

  function applyTransform() {
    artboardTransform.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
    zoomPercent.textContent = `${Math.round(state.zoom * 100)}%`;
  }

  // =========================================================================
  // 9. ATUALIZAÇÃO DE MÉTRICAS & LABELS
  // =========================================================================
  function updateStatsDisplay(geom) {
    const ratioStr = getRatioText(geom.w, geom.h);
    const totalCells = state.cols * state.rows;
    const dimText = `${geom.w} × ${geom.h} ${state.unit}`;

    specRatio.textContent = ratioStr;
    specTotalCells.textContent = `${totalCells} módulos`;
    specDimReal.textContent = dimText;

    topbarFormatName.textContent = presets[state.preset]?.label || 'Personalizado';
    
    const activeArch = state.activeProceduralArchetype || state.archetype;
    topbarSchoolName.textContent = getArchetypeName(activeArch);

    badgeDims.textContent = dimText;
    badgeRatio.textContent = ratioStr;
    currentSeedTag.textContent = `#${state.seed}`;
  }

  let activeToastFile = null;
  appleToast.style.cursor = 'pointer';
  appleToast.addEventListener('click', () => {
    const url = activeToastFile ? `/api/open-downloads?file=${encodeURIComponent(activeToastFile)}` : '/api/open-downloads';
    fetch(url);
  });

  function showToast(message, duration = 3000, filename = null) {
    appleToast.textContent = message;
    appleToast.classList.add('show');
    activeToastFile = filename;
    setTimeout(() => {
      appleToast.classList.remove('show');
    }, duration);
  }

  // =========================================================================
  // 10. EXPORTADORES (SVG, INDESIGN JSX, JSON)
  // =========================================================================

  // A. EXPORTAR SVG ESTRUTURADO COM CAMADAS
  function generateLayeredSvgString() {
    const geom = calculateGeometry();
    const svgClone = canvasSvg.cloneNode(true);
    
    // Configura atributos padrão do arquivo SVG
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgClone.setAttribute('width', `${geom.w}${state.unit}`);
    svgClone.setAttribute('height', `${geom.h}${state.unit}`);
    svgClone.setAttribute('viewBox', `0 0 ${geom.w} ${geom.h}`);

    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgClone);

    // Cabeçalho de autor e metadados
    const headerComment = `<!--\n  LayoutForge — Vector Layered Layout\n  Escola: ${state.school.toUpperCase()}\n  Dimensões: ${geom.w} x ${geom.h} ${state.unit}\n  Compatível com Adobe Illustrator, Figma e Affinity\n-->\n`;
    return headerComment + svgString;
  }

  /**
   * Mecanismo Universal de Download de Arquivos
   * 1. Salva diretamente no disco do usuário (pasta Downloads do Windows e exports/) via POST.
   * 2. Também aciona o download nativo do navegador para compatibilidade com Chrome/Edge externos.
   * 3. Exibe toast interativo permitindo abrir a pasta Downloads diretamente no Windows Explorer.
   */
  async function triggerUniversalDownload(filename, content, mimeType, isBase64 = false) {
    // 1. Gravação direta no disco via servidor local (salva em C:\Users\...\Downloads)
    try {
      fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, content, mimeType, isBase64 })
      }).catch(err => console.warn('Fetch download warn:', err));
    } catch (err) {
      console.warn('Gravação direta via fetch falhou:', err);
    }

    // 2. Download via formulário POST (para o gerenciador de downloads do navegador)
    try {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '/api/download';
      form.style.display = 'none';

      const createHidden = (name, val) => {
        const inp = document.createElement('input');
        inp.type = 'hidden';
        inp.name = name;
        inp.value = val;
        return inp;
      };

      form.appendChild(createHidden('filename', filename));
      form.appendChild(createHidden('mimeType', mimeType));
      form.appendChild(createHidden('content', content));
      form.appendChild(createHidden('isBase64', isBase64 ? 'true' : 'false'));

      document.body.appendChild(form);
      form.submit();
      setTimeout(() => {
        if (form.parentNode) form.parentNode.removeChild(form);
      }, 2000);
    } catch (err) {
      console.warn('Form download falhou:', err);
    }
  }

  function downloadPdfFile() {
    showToast('Gerando documento PDF de alta resolução...', 3000);
    const geom = calculateGeometry();
    const svgContent = generateLayeredSvgString();
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        // Renderiza em alta resolução para gráfica (300 DPI)
        const pxPerUnit = state.unit === 'mm' ? 11.811 : (state.unit === 'cm' ? 118.11 : 2.0);
        canvas.width = Math.min(6000, Math.round(geom.w * pxPerUnit));
        canvas.height = Math.min(8400, Math.round(geom.h * pxPerUnit));
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const { jsPDF } = window.jspdf || {};
        if (jsPDF) {
          const orientation = geom.w > geom.h ? 'landscape' : 'portrait';
          const pdfUnit = (state.unit === 'mm' || state.unit === 'cm' || state.unit === 'pt') ? state.unit : 'pt';
          const pdfW = state.unit === 'px' ? geom.w * 0.75 : geom.w;
          const pdfH = state.unit === 'px' ? geom.h * 0.75 : geom.h;
          
          const pdf = new jsPDF({
            orientation: orientation,
            unit: pdfUnit,
            format: [pdfW, pdfH]
          });

          const imgData = canvas.toDataURL('image/jpeg', 0.98);
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH);
          
          const filename = `layoutforge-${state.preset}-${state.school}.pdf`;
          const pdfBlob = pdf.output('blob');
          const reader = new FileReader();
          reader.onloadend = () => {
            triggerUniversalDownload(filename, reader.result, 'application/pdf', true);
            URL.revokeObjectURL(url);
            showToast(`✓ PDF para Impressão salvo: ${filename} (clique p/ abrir pasta)`, 6000, filename);
          };
          reader.readAsDataURL(pdfBlob);
        } else {
          exportHighResPng();
        }
      } catch (err) {
        console.error('Erro ao gerar PDF:', err);
        exportHighResPng();
      }
    };
    img.src = url;
  }

  function downloadSvgFile() {
    const svgContent = generateLayeredSvgString();
    const filename = `layoutforge-${state.preset}-${state.school}.svg`;
    triggerUniversalDownload(filename, svgContent, 'image/svg+xml;charset=utf-8', false);
    showToast(`✓ Salvo em Downloads: ${filename} (clique p/ abrir pasta)`, 6000, filename);
  }

  async function copySvgToClipboard() {
    try {
      const svgContent = generateLayeredSvgString();
      await navigator.clipboard.writeText(svgContent);
      showToast('SVG copiado! Cole direto no Figma ou Illustrator (Ctrl+V)');
    } catch (err) {
      showToast('Erro ao copiar SVG para a área de transferência');
    }
  }

  // B. EXPORTAR SCRIPT NATIVO JSX PARA ADOBE INDESIGN (1:1 COM A PRANCHETA)
  function generateInDesignJsxScript() {
    const geom = calculateGeometry();
    const { w, h, margins, columns, rows } = geom;

    // Garante que o manifesto com todos os blocos ativos está gerado
    if (!state.layoutManifest || state.layoutManifest.length === 0) {
      state.layoutManifest = [];
      renderGenerativeContent(geom);
    }

    const manifest = state.layoutManifest || [];
    const unitIndesign = state.unit === 'pt' ? 'MeasurementUnits.POINTS' : (state.unit === 'px' ? 'MeasurementUnits.POINTS' : 'MeasurementUnits.MILLIMETERS');

    // Constrói os blocos nativos dinamicamente
    let manifestScript = '';
    manifest.forEach((block, idx) => {
      if (block.type === 'topFolio') {
        const safeText = block.text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        manifestScript += `
    // Folio Topo Microtipografia
    try {
        var topFrame = page.textFrames.add(contentLayer);
        topFrame.geometricBounds = [${block.y.toFixed(2)}, ${block.x.toFixed(2)}, ${(block.y + block.height).toFixed(2)}, ${(block.x + block.width).toFixed(2)}];
        topFrame.contents = "${safeText}";
        topFrame.paragraphs.item(0).appliedParagraphStyle = styleFolio;
    } catch(e) {}
`;
      } else if (block.type === 'bottomFolio') {
        const safeText = block.text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        manifestScript += `
    // Folio Rodapé
    try {
        var botFrame = page.textFrames.add(contentLayer);
        botFrame.geometricBounds = [${block.y.toFixed(2)}, ${block.x.toFixed(2)}, ${(block.y + block.height).toFixed(2)}, ${(block.x + block.width).toFixed(2)}];
        botFrame.contents = "${safeText}";
        botFrame.paragraphs.item(0).appliedParagraphStyle = styleFolio;
    } catch(e) {}
`;
      } else if (block.type === 'verticalHeadline') {
        const safeText = block.text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
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
        vFrame${idx}.contents = "${safeText.toUpperCase()}";
        vFrame${idx}.paragraphs.item(0).appliedParagraphStyle = styleDisplay;
        if (${block.bgStrip ? 'true' : 'false'}) {
            vFrame${idx}.paragraphs.item(0).fillColor = doc.colors.item("Paper");
        }
        vFrame${idx}.rotationAngle = ${block.rotation || -90};
    } catch(e) {}
`;
      } else if (block.type === 'tapeStrip') {
        const safeText = block.text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
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
        stripText${idx}.contents = "${safeText}";
        stripText${idx}.paragraphs.item(0).appliedParagraphStyle = styleDisplay;
        stripText${idx}.paragraphs.item(0).fillColor = doc.colors.item("Paper");
    } catch(e) {}
`;
      } else if (block.type === 'text') {
        const safeLines = block.lines.map(l => l.replace(/\\/g, '\\\\').replace(/"/g, '\\"')).join('\\r');
        const isDisplay = block.fontSize >= 16;
        const isSub = block.fontSize >= 9.5 && block.fontSize < 16;
        const textH = Math.max(12, block.lines.length * block.fontSize * (block.lineSpacing || 1.1) + 4);
        const textW = Math.max(20, w - margins.right - block.x);
        const styleName = isDisplay ? 'styleDisplay' : (isSub ? 'styleSub' : 'styleMeta');

        manifestScript += `
    // Bloco de Texto (${isDisplay ? 'Título Principal' : (isSub ? 'Subtítulo' : 'Texto')})
    try {
        var textFrame${idx} = page.textFrames.add(contentLayer);
        textFrame${idx}.geometricBounds = [${block.y.toFixed(2)}, ${block.x.toFixed(2)}, ${(block.y + textH).toFixed(2)}, ${(block.x + textW).toFixed(2)}];
        textFrame${idx}.contents = "${safeLines}";
        for (var p = 0; p < textFrame${idx}.paragraphs.length; p++) {
            textFrame${idx}.paragraphs.item(p).appliedParagraphStyle = ${styleName};
        }
    } catch(e) {}
`;
      } else if (block.type === 'image') {
        const isBg = !!block.isBg;
        const targetLayer = isBg ? 'bgLayer' : 'framesLayer';
        manifestScript += `
    // Quadro de Imagem (${block.label || (isBg ? 'Fundo Fotográfico' : 'Hero Photography')})
    try {
        var imgFrame${idx} = page.rectangles.add(${targetLayer});
        imgFrame${idx}.geometricBounds = [${block.y.toFixed(2)}, ${block.x.toFixed(2)}, ${(block.y + block.height).toFixed(2)}, ${(block.x + block.width).toFixed(2)}];
        imgFrame${idx}.contentType = ContentType.GRAPHIC_TYPE;
        imgFrame${idx}.strokeColor = ${isBg ? 'doc.swatches.item("None")' : 'doc.colors.item("Black")'};
        imgFrame${idx}.strokeWeight = ${isBg ? '0' : '0.5'};
        imgFrame${idx}.strokeTint = ${isBg ? '0' : '40'};
        ${isBg ? 'try { imgFrame' + idx + '.sendToBack(); } catch(eSend) {}' : ''}
    } catch(e) {}
`;
      } else if (block.type === 'statBadge') {
        const safeLabel = block.statLabel.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        manifestScript += `
    // Badge de Estatística / Destaque (${block.statNum})
    try {
        var badgeBox${idx} = page.rectangles.add(framesLayer);
        badgeBox${idx}.geometricBounds = [${block.y.toFixed(2)}, ${block.x.toFixed(2)}, ${(block.y + block.height).toFixed(2)}, ${(block.x + block.width).toFixed(2)}];
        badgeBox${idx}.contentType = ContentType.UNASSIGNED;
        badgeBox${idx}.strokeColor = doc.colors.item("Black");
        badgeBox${idx}.strokeWeight = 1.0;

        var badgeText${idx} = page.textFrames.add(contentLayer);
        badgeText${idx}.geometricBounds = [${(block.y + 2).toFixed(2)}, ${(block.x + 2).toFixed(2)}, ${(block.y + block.height - 2).toFixed(2)}, ${(block.x + block.width - 2).toFixed(2)}];
        badgeText${idx}.contents = "${block.statNum}\\r${safeLabel}";
        try {
            badgeText${idx}.paragraphs.item(0).appliedParagraphStyle = styleBadgeNum;
            if (badgeText${idx}.paragraphs.length > 1) {
                badgeText${idx}.paragraphs.item(1).appliedParagraphStyle = styleBadgeLabel;
            }
        } catch(e) {}
    } catch(e) {}
`;
      } else if (block.type === 'leadColumn') {
        const safeText = block.text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        manifestScript += `
    // Lead Monumental (Tamanho X - Estilo Swiss Style)
    try {
        var leadCol${idx} = page.textFrames.add(contentLayer);
        leadCol${idx}.geometricBounds = [${block.y.toFixed(2)}, ${block.x.toFixed(2)}, ${(block.y + block.height).toFixed(2)}, ${(block.x + block.width).toFixed(2)}];
        leadCol${idx}.contents = "${safeText}";
        leadCol${idx}.paragraphs.item(0).appliedParagraphStyle = styleLead;
    } catch(e) {}
`;
      } else if (block.type === 'subLabel') {
        const safeText = block.text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        manifestScript += `
    // Micro-Etiqueta Suíça (Coluna de Respiro)
    try {
        var subLabel${idx} = page.textFrames.add(contentLayer);
        subLabel${idx}.geometricBounds = [${block.y.toFixed(2)}, ${block.x.toFixed(2)}, ${(block.y + Math.max(10, block.height)).toFixed(2)}, ${(block.x + block.width).toFixed(2)}];
        subLabel${idx}.contents = "${safeText}";
        subLabel${idx}.paragraphs.item(0).appliedParagraphStyle = styleSub;
    } catch(e) {}
`;
      } else if (block.type === 'quoteBlock') {
        const safeText = block.text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        manifestScript += `
    // Citação Destaque (Pull-Quote com Fio)
    try {
        var quoteCol${idx} = page.textFrames.add(contentLayer);
        quoteCol${idx}.geometricBounds = [${block.y.toFixed(2)}, ${block.x.toFixed(2)}, ${(block.y + block.height).toFixed(2)}, ${(block.x + block.width).toFixed(2)}];
        quoteCol${idx}.contents = "${safeText}";
        quoteCol${idx}.paragraphs.item(0).appliedParagraphStyle = styleQuote;
    } catch(e) {}
`;
      } else if (block.type === 'bodyColumn') {
        const safeText = block.text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        manifestScript += `
    // Coluna Editorial Snapped no Grid (Tamanho Y)
    try {
        var bodyCol${idx} = page.textFrames.add(contentLayer);
        bodyCol${idx}.geometricBounds = [${block.y.toFixed(2)}, ${block.x.toFixed(2)}, ${(block.y + block.height).toFixed(2)}, ${(block.x + block.width).toFixed(2)}];
        bodyCol${idx}.contents = "${safeText}";
        bodyCol${idx}.paragraphs.item(0).appliedParagraphStyle = styleBody;
    } catch(e) {}
`;
      } else if (block.type === 'body') {
        const safeText = block.text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        manifestScript += `
    // Colunas de Texto Editorial (${block.numCols} Colunas)
    try {
        var bodyFrame${idx} = page.textFrames.add(contentLayer);
        bodyFrame${idx}.geometricBounds = [${block.y.toFixed(2)}, ${block.x.toFixed(2)}, ${(block.y + block.height).toFixed(2)}, ${(block.x + block.width).toFixed(2)}];
        bodyFrame${idx}.textFramePreferences.textColumnCount = ${block.numCols || 1};
        bodyFrame${idx}.textFramePreferences.textColumnGutter = ${block.gutter || 5};
        bodyFrame${idx}.contents = "${safeText}";
        bodyFrame${idx}.paragraphs.item(0).appliedParagraphStyle = styleBody;
    } catch(e) {}
`;
      }
    });

    return `// =============================================================================
// LAYOUTFORGE — ADOBE INDESIGN AUTOMATION SCRIPT (.jsx)
// Arquitetura: 1:1 Cópia Fiel do Layout Paramétrico Renderizado
// Formato: ${w} x ${h} ${state.unit} | Grade: ${state.cols} Colunas x ${state.rows} Módulos
// Escola: ${state.school.toUpperCase()} | Seed: #${state.seed}
// =============================================================================

#target indesign

function createLayoutForgeDocument() {
    // 1. Criar Documento
    var doc = app.documents.add();
    
    // Configurações de Unidade e Dimensão
    doc.viewPreferences.horizontalMeasurementUnits = ${unitIndesign};
    doc.viewPreferences.verticalMeasurementUnits = ${unitIndesign};
    
    with (doc.documentPreferences) {
        pageWidth = ${w};
        pageHeight = ${h};
        facingPages = false;
        documentBleedTopOffset = ${state.bleed};
        documentBleedBottomOffset = ${state.bleed};
        documentBleedInsideOrLeftOffset = ${state.bleed};
        documentBleedOutsideOrRightOffset = ${state.bleed};
    }

    var page = doc.pages.item(0);

    // 2. Definir Margens da Página
    page.marginPreferences.top = ${margins.top};
    page.marginPreferences.bottom = ${margins.bottom};
    page.marginPreferences.left = ${margins.left};
    page.marginPreferences.right = ${margins.right};

    // 3. Criar Camadas Nativas do InDesign
    function getOrCreateLayer(name, color) {
        try {
            var lyr = doc.layers.itemByName(name);
            if (lyr.isValid) return lyr;
        } catch(e) {}
        try {
            return doc.layers.add({ name: name, layerColor: color });
        } catch(e) {
            return doc.activeLayer;
        }
    }

    var bgLayer = getOrCreateLayer("LayoutForge - Imagem de Fundo (BG)", UIColors.LIGHT_BLUE);
    var guidesLayer = getOrCreateLayer("LayoutForge - Guias de Grade", UIColors.CYAN);
    var framesLayer = getOrCreateLayer("LayoutForge - Quadros de Imagem", UIColors.MAGENTA);
    var contentLayer = getOrCreateLayer("LayoutForge - Diagramação & Tipografia", UIColors.CHARCOAL);

    try {
        bgLayer.move(ElementPlacement.AT_END);
    } catch(eLyrMove) {}

    // 4. Inserir Guias Nativas Verticais (Colunas)
    try {
        doc.activeLayer = guidesLayer;
        var columnPositions = [${columns.map(c => `[${c.x.toFixed(2)}, ${(c.x + c.width).toFixed(2)}]`).join(', ')}];
        for (var i = 0; i < columnPositions.length; i++) {
            page.guides.add(guidesLayer, { orientation: HorizontalOrVertical.VERTICAL, location: columnPositions[i][0] });
            page.guides.add(guidesLayer, { orientation: HorizontalOrVertical.VERTICAL, location: columnPositions[i][1] });
        }
    } catch(e) {}

    // 5. Inserir Guias Nativas Horizontais (Módulos)
    try {
        var rowPositions = [${rows.map(r => `[${r.y.toFixed(2)}, ${(r.y + r.height).toFixed(2)}]`).join(', ')}];
        for (var j = 0; j < rowPositions.length; j++) {
            page.guides.add(guidesLayer, { orientation: HorizontalOrVertical.HORIZONTAL, location: rowPositions[j][0] });
            page.guides.add(guidesLayer, { orientation: HorizontalOrVertical.HORIZONTAL, location: rowPositions[j][1] });
        }
    } catch(e) {}

    // 6. Criar Estilos de Parágrafo Prontos com Tipografia Suíça Clean (Arial / Sans)
    function getOrCreateParaStyle(name, props) {
        try {
            var s = doc.paragraphStyles.itemByName(name);
            if (s.isValid) return s;
        } catch(e) {}
        try {
            return doc.paragraphStyles.add(props);
        } catch(e) {
            try {
                delete props.appliedFont;
                delete props.fontStyle;
                return doc.paragraphStyles.add(props);
            } catch(e2) {
                return doc.paragraphStyles.item(0);
            }
        }
    }

    var styleDisplay = getOrCreateParaStyle("LayoutForge / Título Principal", { 
        name: "LayoutForge / Título Principal", 
        appliedFont: "Arial", 
        fontStyle: "Bold", 
        pointSize: 34, 
        leading: 37, 
        capitalization: Capitalization.ALL_CAPS 
    });

    var styleSub = getOrCreateParaStyle("LayoutForge / Subtítulo", { 
        name: "LayoutForge / Subtítulo", 
        appliedFont: "Arial", 
        fontStyle: "Bold", 
        pointSize: 11.5, 
        leading: 15, 
        capitalization: Capitalization.ALL_CAPS,
        tint: 65 
    });

    var styleLead = getOrCreateParaStyle("LayoutForge / Lead Monumental", { 
        name: "LayoutForge / Lead Monumental", 
        appliedFont: "Arial", 
        fontStyle: "Bold", 
        pointSize: 16.5, 
        leading: 20, 
        hyphenation: false 
    });

    var styleQuote = getOrCreateParaStyle("LayoutForge / Citação Destaque", { 
        name: "LayoutForge / Citação Destaque", 
        appliedFont: "Arial", 
        fontStyle: "Italic", 
        pointSize: 13.5, 
        leading: 17.5, 
        hyphenation: false 
    });

    var styleBody = getOrCreateParaStyle("LayoutForge / Corpo de Texto", { 
        name: "LayoutForge / Corpo de Texto", 
        appliedFont: "Arial", 
        fontStyle: "Regular", 
        pointSize: 9.5, 
        leading: 13.5, 
        hyphenation: false 
    });

    var styleBadgeNum = getOrCreateParaStyle("LayoutForge / Destaque Numérico", { 
        name: "LayoutForge / Destaque Numérico", 
        appliedFont: "Arial", 
        fontStyle: "Bold", 
        pointSize: 30, 
        leading: 32 
    });

    var styleBadgeLabel = getOrCreateParaStyle("LayoutForge / Legenda Destaque", { 
        name: "LayoutForge / Legenda Destaque", 
        appliedFont: "Arial", 
        fontStyle: "Bold", 
        pointSize: 6.5, 
        leading: 8.5, 
        capitalization: Capitalization.ALL_CAPS,
        tint: 60 
    });

    var styleFolio = getOrCreateParaStyle("LayoutForge / Folio & Microtipografia", { 
        name: "LayoutForge / Folio & Microtipografia", 
        appliedFont: "Courier New", 
        fontStyle: "Regular", 
        pointSize: 6.5, 
        leading: 8,
        tint: 55 
    });

    var styleMeta = getOrCreateParaStyle("LayoutForge / Metadados", { 
        name: "LayoutForge / Metadados", 
        appliedFont: "Arial", 
        fontStyle: "Regular", 
        pointSize: 8, 
        leading: 11,
        tint: 70 
    });

    // 7. Renderizar Elementos de Conteúdo Fielmente
    doc.activeLayer = contentLayer;
    ${manifestScript}

    // 8. Ajustar Zoom para Visualização Completa
    try {
        if (doc.layoutWindows.length > 0) {
            doc.layoutWindows[0].zoom(ZoomOptions.FIT_PAGE);
        }
    } catch(e) {}

    alert("✓ LayoutForge gerado com sucesso no InDesign!\\n\\n• Formato: ${w} x ${h} ${state.unit}\\n• Grade: ${state.cols} Colunas × ${state.rows} Módulos\\n• Escola: ${state.school.toUpperCase()}\\n• Seed: #${state.seed}\\n\\nComposição fiel 1:1 com todas as caixas, colunas, imagens e estilos prontos.");
}

createLayoutForgeDocument();
`;
  }

  function downloadInDesignJsx() {
    const jsxContent = generateInDesignJsxScript();
    const filename = `layoutforge-${state.preset}.jsx`;
    triggerUniversalDownload(filename, jsxContent, 'text/javascript;charset=utf-8', false);
    showToast(`✓ Script JSX salvo em Downloads: ${filename} (clique p/ abrir pasta)`, 6000, filename);
  }

  // C. EXPORTAR TOKENS JSON
  function downloadJsonTokens() {
    const geom = calculateGeometry();
    const tokens = {
      generator: 'LayoutForge v1.0',
      timestamp: new Date().toISOString(),
      artboard: {
        preset: state.preset,
        width: geom.w,
        height: geom.h,
        unit: state.unit,
        bleed: state.bleed,
        orientation: state.orientation,
        ratio: getRatioText(geom.w, geom.h)
      },
      school: state.school,
      entropy: state.entropy,
      seed: state.seed,
      margins: geom.margins,
      grid: {
        cols: state.cols,
        rows: state.rows,
        gutter: state.gutter,
        columnWidth: geom.colWidth,
        rowHeight: geom.rowHeight,
        columns: geom.columns,
        rows: geom.rows
      }
    };

    const jsonStr = JSON.stringify(tokens, null, 2);
    const filename = `layoutforge-tokens-${state.preset}.json`;
    triggerUniversalDownload(filename, jsonStr, 'application/json;charset=utf-8', false);
    showToast(`✓ Tokens JSON salvos em Downloads: ${filename} (clique p/ abrir pasta)`, 6000, filename);
  }

  // D. EXPORTAR IMAGEM PNG (RASTERIZADA)
  function exportHighResPng() {
    const geom = calculateGeometry();
    const svgContent = generateLayeredSvgString();
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const dpr = 2.0; // Alta resolução (Retina / 300 DPI preview)
      canvas.width = geom.w * 4 * dpr;
      canvas.height = geom.h * 4 * dpr;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/png');
      const filename = `layoutforge-${state.preset}-preview.png`;
      triggerUniversalDownload(filename, dataUrl, 'image/png', true);
      URL.revokeObjectURL(url);
      showToast(`✓ Imagem PNG salva em Downloads: ${filename} (clique p/ abrir pasta)`, 6000, filename);
    };
    img.src = url;
  }

  // =========================================================================
  // 11. EVENT LISTENERS & VINCULAÇÃO DE CONTROLES
  // =========================================================================

  // PRESET SELECT
  presetSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    state.preset = val;

    if (val !== 'custom' && presets[val]) {
      const p = presets[val];
      state.width = p.width;
      state.height = p.height;
      state.unit = p.unit;

      inputWidth.value = p.width;
      inputHeight.value = p.height;
      unitSelect.value = p.unit;
      unitLabelW.textContent = p.unit;
      unitLabelH.textContent = p.unit;
      
      state.orientation = p.width > p.height ? 'landscape' : 'portrait';
    }

    renderArtboard();
    fitArtboardToScreen();
  });

  // INPUTS DE DIMENSÃO LIVRE
  inputWidth.addEventListener('input', (e) => {
    state.width = Math.max(10, parseFloat(e.target.value) || 210);
    state.preset = 'custom';
    presetSelect.value = 'custom';
    renderArtboard();
  });

  inputHeight.addEventListener('input', (e) => {
    state.height = Math.max(10, parseFloat(e.target.value) || 297);
    state.preset = 'custom';
    presetSelect.value = 'custom';
    renderArtboard();
  });

  unitSelect.addEventListener('change', (e) => {
    state.unit = e.target.value;
    unitLabelW.textContent = state.unit;
    unitLabelH.textContent = state.unit;
    renderArtboard();
    fitArtboardToScreen();
  });

  bleedInput.addEventListener('input', (e) => {
    state.bleed = Math.max(0, parseFloat(e.target.value) || 0);
    renderArtboard();
  });

  btnSwapOrientation.addEventListener('click', () => {
    const temp = state.width;
    state.width = state.height;
    state.height = temp;

    inputWidth.value = state.width;
    inputHeight.value = state.height;
    state.orientation = state.width > state.height ? 'landscape' : 'portrait';
    state.preset = 'custom';
    presetSelect.value = 'custom';

    renderArtboard();
    fitArtboardToScreen();
    showToast(`Orientação alternada para ${state.orientation === 'landscape' ? 'Horizontal' : 'Vertical'}`);
  });

  // ESCOLA DE DESIGN
  schoolSelector.querySelectorAll('.segment-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      schoolSelector.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.school = btn.dataset.school;

      // Ajusta parâmetros típicos de cada escola
      if (state.school === 'swiss') {
        state.cols = 6;
        state.rows = 8;
        state.goldenMargins = false;
        checkGoldenMargins.checked = false;
      } else if (state.school === 'vandeGraaf') {
        state.cols = 2;
        state.rows = 6;
        state.goldenMargins = true;
        checkGoldenMargins.checked = true;
      } else if (state.school === 'bauhaus') {
        state.cols = 4;
        state.rows = 6;
        state.goldenMargins = false;
        checkGoldenMargins.checked = false;
      } else if (state.school === 'brutalist') {
        state.cols = 8;
        state.rows = 12;
        state.gutter = 0;
        gutterSlider.value = 0;
        gutterVal.textContent = `0 ${state.unit}`;
      }

      colsSlider.value = state.cols;
      colsVal.textContent = state.cols;
      rowsSlider.value = state.rows;
      rowsVal.textContent = state.rows;

      renderArtboard();
    });
  });

  // SLIDERS DE GRADE
  colsSlider.addEventListener('input', (e) => {
    state.cols = parseInt(e.target.value);
    colsVal.textContent = state.cols;
    renderArtboard();
  });

  rowsSlider.addEventListener('input', (e) => {
    state.rows = parseInt(e.target.value);
    rowsVal.textContent = state.rows;
    renderArtboard();
  });

  gutterSlider.addEventListener('input', (e) => {
    state.gutter = parseFloat(e.target.value);
    gutterVal.textContent = `${state.gutter} ${state.unit}`;
    renderArtboard();
  });

  marginSlider.addEventListener('input', (e) => {
    state.margin = parseFloat(e.target.value);
    marginVal.textContent = `${state.margin} ${state.unit}`;
    renderArtboard();
  });

  checkGoldenMargins.addEventListener('change', (e) => {
    state.goldenMargins = e.target.checked;
    renderArtboard();
  });

  // ENTROPIA E GERAÇÃO
  entropySlider.addEventListener('input', (e) => {
    state.entropy = parseInt(e.target.value);
    entropyVal.textContent = `${state.entropy}%`;
    renderArtboard();
  });

  layoutArchetype.addEventListener('change', (e) => {
    state.archetype = e.target.value;
    state.seed = Math.floor(Math.random() * 89999) + 10000;
    if (state.archetype === 'random_infinite') {
      const current = state.activeProceduralArchetype;
      const available = allArchetypesList.filter(a => a !== current);
      state.activeProceduralArchetype = available[Math.floor(Math.random() * available.length)];
    } else {
      state.activeProceduralArchetype = state.archetype;
    }
    renderArtboard();
    const archName = getArchetypeName(state.activeProceduralArchetype || state.archetype);
    showToast(`Arquétipo: ${archName}`);
  });

  if (textHierarchySelect) {
    textHierarchySelect.addEventListener('change', (e) => {
      state.textHierarchy = e.target.value;
      renderArtboard();
      const labels = {
        'creative_auto': '✨ Dinâmico Criativo (Tam. X na Col. 1, Tam. Y na Col. 3/Fim)',
        'lead_and_body': '👑 Lead Monumental (Tam. X) + Corpo (Tam. Y) [Müller-Brockmann]',
        'bilingual_dialogue': '🇩🇪 Diálogo de Escalas (Grid Systems)',
        'quote_callout': '💬 Citação Destaque (Tam. X) + Apoio (Tam. Y)',
        'asymmetric_breathing': '⚖️ Assimetria com Espaço Negativo (Respiro Suíço)',
        'classic_columns': '📖 Colunas Uniformes Equilibradas'
      };
      showToast(`Ritmo Tipográfico: ${labels[state.textHierarchy] || state.textHierarchy}`);
    });
  }

  btnRollLayout.addEventListener('click', () => {
    state.seed = Math.floor(Math.random() * 89999) + 10000;
    
    // Sorteia um novo arquétipo aleatório garantidamente diferente do anterior
    if (state.archetype === 'random_infinite' || !state.archetype) {
      const current = state.activeProceduralArchetype;
      const available = allArchetypesList.filter(a => a !== current);
      state.activeProceduralArchetype = available[Math.floor(Math.random() * available.length)];
    } else {
      // Se estiver em um arquétipo específico, mas o usuário clicou no botão para gerar aleatório:
      state.seed = Math.floor(Math.random() * 89999) + 10000;
    }
    
    renderArtboard();
    const currentArch = state.activeProceduralArchetype || state.archetype;
    const archName = getArchetypeName(currentArch);
    showToast(`✓ Nova Composição: ${archName} (Seed #${state.seed})`);
  });

  btnResetLayout.addEventListener('click', () => {
    state.seed = 94021;
    state.entropy = 15;
    state.archetype = 'random_infinite';
    state.textHierarchy = 'creative_auto';
    state.activeProceduralArchetype = 'swiss_monumental_top';
    if (layoutArchetype) layoutArchetype.value = 'random_infinite';
    if (textHierarchySelect) textHierarchySelect.value = 'creative_auto';
    entropySlider.value = 15;
    entropyVal.textContent = '15%';
    renderArtboard();
    showToast('Composição restaurada para o padrão canônico');
  });

  // VISIBILIDADE DAS CAMADAS
  // CONTROLES DE IMAGENS & BACKGROUND (SEÇÃO 04)
  const countDescriptions = {
    'auto': 'Distribuição procedural conforme arquétipo ativo',
    '0': '0 Imagens: Manifesto tipográfico puro (zero fotos no miolo)',
    '1': '1 Imagem: Hero fotográfico monumental de grande impacto',
    '2': '2 Imagens: Dupla editorial / split modular equilibrado',
    '3': '3 Imagens: 1 Hero dominante + 2 detalhes empilhados',
    '4': '4 Imagens: Matriz modular 2x2 perfeitamente snappada',
    '5': '5 Imagens: 1 Hero amplo + 4 módulos de apoio em lookbook',
    '6': '6 Imagens: Grade catalográfica modular completa (3x2 ou 2x3)'
  };

  const countBadges = {
    'auto': 'Auto',
    '0': '0 Fotos',
    '1': '1 Foto',
    '2': '2 Fotos',
    '3': '3 Fotos',
    '4': '4 Fotos',
    '5': '5 Fotos',
    '6': '6 Fotos'
  };

  if (imageCountChips) {
    imageCountChips.addEventListener('click', (e) => {
      const btn = e.target.closest('.chip-btn');
      if (!btn) return;
      imageCountChips.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.dataset.count;
      state.imageCount = val;
      if (imageCountBadge) imageCountBadge.textContent = countBadges[val] || val;
      if (imageCountDesc) imageCountDesc.textContent = countDescriptions[val] || '';
      if (imageDistributionGroup) {
        imageDistributionGroup.style.display = (val === '0') ? 'none' : 'block';
      }
      renderArtboard();
      showToast(`Slots de imagem ajustados: ${countBadges[val] || val}`);
    });
  }

  if (imageDistributionSelect) {
    imageDistributionSelect.addEventListener('change', (e) => {
      state.imageDistribution = e.target.value;
      renderArtboard();
    });
  }

  if (bgImageModeSelect) {
    bgImageModeSelect.addEventListener('change', (e) => {
      state.bgImageMode = e.target.value;
      if (bgContrastRow) {
        bgContrastRow.style.display = (state.bgImageMode === 'none') ? 'none' : 'flex';
      }
      renderArtboard();
      const label = bgImageModeSelect.options[bgImageModeSelect.selectedIndex].text;
      showToast(`Imagem de Fundo: ${label}`);
    });
  }

  if (checkBgTextContrast) {
    checkBgTextContrast.addEventListener('change', (e) => {
      state.bgTextContrast = e.target.checked;
      renderArtboard();
    });
  }

  if (showBgImageCheck) {
    showBgImageCheck.addEventListener('change', (e) => {
      state.showBgImage = e.target.checked;
      renderArtboard();
    });
  }

  if (showImageFramesCheck) {
    showImageFramesCheck.addEventListener('change', (e) => {
      state.showImageFrames = e.target.checked;
      renderArtboard();
    });
  }

  showColumnsCheck.addEventListener('change', (e) => { state.showColumns = e.target.checked; renderArtboard(); });
  showRowsCheck.addEventListener('change', (e) => { state.showRows = e.target.checked; renderArtboard(); });
  showMarginsCheck.addEventListener('change', (e) => { state.showMargins = e.target.checked; renderArtboard(); });
  showCanonsCheck.addEventListener('change', (e) => { state.showCanons = e.target.checked; renderArtboard(); });
  showBaselineCheck.addEventListener('change', (e) => { state.showBaseline = e.target.checked; renderArtboard(); });
  showContentCheck.addEventListener('change', (e) => { state.showContent = e.target.checked; renderArtboard(); });

  guideColorSelect.addEventListener('change', (e) => { state.guideColor = e.target.value; renderArtboard(); });
  guideOpacitySelect.addEventListener('change', (e) => { state.guideOpacity = parseFloat(e.target.value); renderArtboard(); });

  // ZOOM E PAN CONTROLS
  btnZoomIn.addEventListener('click', () => {
    state.zoom = Math.min(3.0, parseFloat((state.zoom + 0.15).toFixed(2)));
    applyTransform();
  });

  btnZoomOut.addEventListener('click', () => {
    state.zoom = Math.max(0.2, parseFloat((state.zoom - 0.15).toFixed(2)));
    applyTransform();
  });

  btnFitScreen.addEventListener('click', () => {
    fitArtboardToScreen();
    showToast('Prancheta ajustada à tela');
  });

  // INTERAÇÃO DE ARRASTAR (PAN) COM O MOUSE
  artboardStage.addEventListener('mousedown', (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    state.isPanning = true;
    state.startX = e.clientX - state.panX;
    state.startY = e.clientY - state.panY;
    artboardStage.classList.add('grabbing');
  });

  window.addEventListener('mousemove', (e) => {
    if (!state.isPanning) return;
    state.panX = e.clientX - state.startX;
    state.panY = e.clientY - state.startY;
    applyTransform();
  });

  window.addEventListener('mouseup', () => {
    state.isPanning = false;
    artboardStage.classList.remove('grabbing');
  });

  // ZOOM COM SCROLL DO MOUSE
  artboardStage.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    state.zoom = Math.min(3.0, Math.max(0.2, parseFloat((state.zoom + delta).toFixed(2))));
    applyTransform();
  }, { passive: false });

  // TOGGLE SIDEBAR
  btnToggleSidebar.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    setTimeout(() => fitArtboardToScreen(), 320);
  });

  // EXPORTAÇÃO
  btnCopySvg.addEventListener('click', copySvgToClipboard);
  if (btnExportPdf) btnExportPdf.addEventListener('click', downloadPdfFile);
  btnExportSvg.addEventListener('click', downloadSvgFile);
  if (btnExportPngDirect) btnExportPngDirect.addEventListener('click', exportHighResPng);
  btnExportInDesign.addEventListener('click', downloadInDesignJsx);

  const btnRunInDesign = document.getElementById('btnRunInDesign');
  if (btnRunInDesign) {
    btnRunInDesign.addEventListener('click', () => {
      downloadInDesignJsx();
      const filename = `layoutforge-${state.preset}.jsx`;
      showToast('🚀 Enviando script e iniciando Adobe InDesign 2026...', 4000);
      setTimeout(() => {
        fetch(`/api/run-indesign?file=${encodeURIComponent(filename)}`)
          .then(res => res.json())
          .then(() => {
            showToast('✓ Script enviado ao Adobe InDesign com sucesso!', 4000);
          })
          .catch(() => {
            showToast('Comando enviado ao InDesign.', 3000);
          });
      }, 600);
    });
  }

  btnMoreExport.addEventListener('click', (e) => {
    e.stopPropagation();
    moreExportDropdown.classList.toggle('show');
  });

  window.addEventListener('click', () => {
    moreExportDropdown.classList.remove('show');
  });

  btnExportJson.addEventListener('click', downloadJsonTokens);
  btnExportPng.addEventListener('click', exportHighResPng);

  if (btnSaveWithPicker) {
    btnSaveWithPicker.addEventListener('click', async () => {
      moreExportDropdown.classList.remove('show');
      if (!('showSaveFilePicker' in window)) {
        showToast('Seletor nativo indisponível neste navegador. Usando download padrão...');
        downloadSvgFile();
        return;
      }
      try {
        const svgContent = generateLayeredSvgString();
        const filename = `layoutforge-${state.preset}-${state.school}.svg`;
        const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const handle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: 'Arquivo Vetorial SVG (*.svg)',
            accept: { 'image/svg+xml': ['.svg'] }
          }]
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        showToast(`Arquivo salvo com sucesso: ${filename}`);
      } catch (err) {
        if (err.name !== 'AbortError') {
          showToast('Erro ao salvar arquivo no sistema');
        }
      }
    });
  }

  if (btnOpenDownloads) {
    btnOpenDownloads.addEventListener('click', () => {
      fetch('/api/open-downloads');
      showToast('Abrindo pasta Downloads no Windows Explorer...', 2500);
    });
  }

  if (btnOpenInBrowser) {
    btnOpenInBrowser.addEventListener('click', () => {
      moreExportDropdown.classList.remove('show');
      fetch('/api/open-browser');
      showToast('Abrindo no Chrome/Edge padrão do Windows...', 2500);
    });
  }

  // ATALHOS DE TECLADO
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c' && !window.getSelection().toString()) {
      e.preventDefault();
      copySvgToClipboard();
    }
  });

  // =========================================================================
  // 12. INICIALIZAÇÃO
  // =========================================================================
  renderArtboard();
  setTimeout(() => {
    fitArtboardToScreen();
  }, 100);

  window.addEventListener('resize', () => {
    fitArtboardToScreen();
  });

});
