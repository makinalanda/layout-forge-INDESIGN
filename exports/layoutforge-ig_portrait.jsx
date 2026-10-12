// =============================================================================
// LAYOUTFORGE — ADOBE INDESIGN AUTOMATION SCRIPT (.jsx)
// Arquitetura: 1:1 Cópia Fiel do Layout Paramétrico Renderizado
// Formato: 1080 x 1350 px | Grade: 6 Colunas x 8 Módulos
// Escola: SWISS | Seed: #43757
// =============================================================================

#target indesign

function createLayoutForgeDocument() {
    // 1. Criar Documento
    var doc = app.documents.add();
    
    // Configurações de Unidade e Dimensão
    doc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.POINTS;
    doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.POINTS;
    
    with (doc.documentPreferences) {
        pageWidth = 1080;
        pageHeight = 1350;
        facingPages = false;
        documentBleedTopOffset = 3;
        documentBleedBottomOffset = 3;
        documentBleedInsideOrLeftOffset = 3;
        documentBleedOutsideOrRightOffset = 3;
    }

    var page = doc.pages.item(0);

    // 2. Definir Margens da Página
    page.marginPreferences.top = 16;
    page.marginPreferences.bottom = 16;
    page.marginPreferences.left = 16;
    page.marginPreferences.right = 16;

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
        var columnPositions = [[16.00, 172.33], [194.33, 350.67], [372.67, 529.00], [551.00, 707.33], [729.33, 885.67], [907.67, 1064.00]];
        for (var i = 0; i < columnPositions.length; i++) {
            page.guides.add(guidesLayer, { orientation: HorizontalOrVertical.VERTICAL, location: columnPositions[i][0] });
            page.guides.add(guidesLayer, { orientation: HorizontalOrVertical.VERTICAL, location: columnPositions[i][1] });
        }
    } catch(e) {}

    // 5. Inserir Guias Nativas Horizontais (Módulos)
    try {
        var rowPositions = [[16.00, 161.50], [183.50, 329.00], [351.00, 496.50], [518.50, 664.00], [686.00, 831.50], [853.50, 999.00], [1021.00, 1166.50], [1188.50, 1334.00]];
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
    
    // Bloco de Texto (Título Principal)
    try {
        var textFrame0 = page.textFrames.add(contentLayer);
        textFrame0.geometricBounds = [16.00, 16.00, 220.69, 1064.00];
        textFrame0.contents = "MODULAR GRID\rARCHITECTURE";
        for (var p = 0; p < textFrame0.paragraphs.length; p++) {
            textFrame0.paragraphs.item(p).appliedParagraphStyle = styleDisplay;
        }
    } catch(e) {}

    // Bloco de Texto (Título Principal)
    try {
        var textFrame1 = page.textFrames.add(contentLayer);
        textFrame1.geometricBounds = [220.69, 16.00, 261.85, 1064.00];
        textFrame1.contents = "HARMONIA MATEMÁTICA APLICADA";
        for (var p = 0; p < textFrame1.paragraphs.length; p++) {
            textFrame1.paragraphs.item(p).appliedParagraphStyle = styleDisplay;
        }
    } catch(e) {}

    // Quadro de Imagem (GERSTNER MODULAR // HERO)
    try {
        var imgFrame2 = page.rectangles.add(framesLayer);
        imgFrame2.geometricBounds = [351.00, 16.00, 831.50, 707.33];
        imgFrame2.contentType = ContentType.GRAPHIC_TYPE;
        imgFrame2.strokeColor = doc.colors.item("Black");
        imgFrame2.strokeWeight = 0.5;
        imgFrame2.strokeTint = 40;
        
    } catch(e) {}

    // Quadro de Imagem (GERSTNER MODULAR // DETAIL 01)
    try {
        var imgFrame3 = page.rectangles.add(framesLayer);
        imgFrame3.geometricBounds = [351.00, 729.33, 496.50, 1064.00];
        imgFrame3.contentType = ContentType.GRAPHIC_TYPE;
        imgFrame3.strokeColor = doc.colors.item("Black");
        imgFrame3.strokeWeight = 0.5;
        imgFrame3.strokeTint = 40;
        
    } catch(e) {}

    // Quadro de Imagem (GERSTNER MODULAR // DETAIL 02)
    try {
        var imgFrame4 = page.rectangles.add(framesLayer);
        imgFrame4.geometricBounds = [518.50, 729.33, 831.50, 1064.00];
        imgFrame4.contentType = ContentType.GRAPHIC_TYPE;
        imgFrame4.strokeColor = doc.colors.item("Black");
        imgFrame4.strokeWeight = 0.5;
        imgFrame4.strokeTint = 40;
        
    } catch(e) {}

    // Coluna Editorial Snapped no Grid
    try {
        var bodyCol5 = page.textFrames.add(contentLayer);
        bodyCol5.geometricBounds = [853.50, 16.00, 1329.00, 350.67];
        bodyCol5.contents = "Na tradição suíça de Müller-Brockmann e Vignelli, a coerência estrutural é um dever moral do designer com o leitor. Cada título, legenda e fotografia deve ancorar-se em um eixo comum, criando ressonância harmônica.";
        bodyCol5.paragraphs.item(0).appliedParagraphStyle = styleBody;
    } catch(e) {}

    // Coluna Editorial Snapped no Grid
    try {
        var bodyCol6 = page.textFrames.add(contentLayer);
        bodyCol6.geometricBounds = [853.50, 372.67, 1329.00, 707.33];
        bodyCol6.contents = "A grelha tipográfica não é uma camisa de força, mas sim um instrumento de liberdade orquestrada. Ela introduz ordem nas partes constituintes de uma composição, permitindo ao olho navegar com clareza cognitiva sem perder a tensão formal.";
        bodyCol6.paragraphs.item(0).appliedParagraphStyle = styleBody;
    } catch(e) {}

    // Coluna Editorial Snapped no Grid
    try {
        var bodyCol7 = page.textFrames.add(contentLayer);
        bodyCol7.geometricBounds = [853.50, 729.33, 1329.00, 1064.00];
        bodyCol7.contents = "O espaço em branco não representa o vazio ou a ausência; ele é o suporte ativo que confere autoridade e respiro à mensagem. Quando tudo grita, nada é ouvido. A hierarquia se estabelece pela coragem de subtrair o ornamento.";
        bodyCol7.paragraphs.item(0).appliedParagraphStyle = styleBody;
    } catch(e) {}

    // Folio Topo Microtipografia
    try {
        var topFrame = page.textFrames.add(contentLayer);
        topFrame.geometricBounds = [11.26, 16.00, 16.26, 1064.00];
        topFrame.contents = "LAYOUTFORGE // MANIFESTO 12 // SEED #43757";
        topFrame.paragraphs.item(0).appliedParagraphStyle = styleFolio;
    } catch(e) {}

    // Folio Rodapé
    try {
        var botFrame = page.textFrames.add(contentLayer);
        botFrame.geometricBounds = [1343.60, 16.00, 1348.60, 1064.00];
        botFrame.contents = "P. 01 — GRID: 6 COL × 8 MOD // SWISS";
        botFrame.paragraphs.item(0).appliedParagraphStyle = styleFolio;
    } catch(e) {}


    // 8. Ajustar Zoom para Visualização Completa
    try {
        if (doc.layoutWindows.length > 0) {
            doc.layoutWindows[0].zoom(ZoomOptions.FIT_PAGE);
        }
    } catch(e) {}

    alert("✓ LayoutForge gerado com sucesso no InDesign!\n\n• Formato: 1080 x 1350 px\n• Grade: 6 Colunas × 8 Módulos\n• Escola: SWISS\n• Seed: #43757\n\nComposição fiel 1:1 com todas as caixas, colunas, imagens e estilos prontos.");
}

createLayoutForgeDocument();
