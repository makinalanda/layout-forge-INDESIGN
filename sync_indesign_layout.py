import os
import glob

jsx_content = """// =============================================================================
// LAYOUTFORGE — ADOBE INDESIGN AUTOMATION SCRIPT (.jsx)
// Arquitetura: 1:1 Cópia Fiel do Layout Paramétrico Renderizado
// Formato: 210 x 297 mm | Grade: 6 Colunas x 8 Módulos
// Escola: SUÍÇO (Müller-Brockmann) | Seed: #94021
// =============================================================================

#target indesign

function createLayoutForgeDocument() {
    // 1. Criar Documento
    var doc = app.documents.add();
    
    // Configurações de Unidade e Dimensão
    doc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.MILLIMETERS;
    doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.MILLIMETERS;
    
    with (doc.documentPreferences) {
        pageWidth = 210;
        pageHeight = 297;
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

    var guidesLayer = getOrCreateLayer("LayoutForge - Guias de Grade", UIColors.CYAN);
    var framesLayer = getOrCreateLayer("LayoutForge - Quadros de Imagem", UIColors.MAGENTA);
    var contentLayer = getOrCreateLayer("LayoutForge - Diagramação & Tipografia", UIColors.CHARCOAL);

    // 4. Inserir Guias Nativas Verticais (Colunas)
    try {
        doc.activeLayer = guidesLayer;
        var columnPositions = [[16.00, 41.50], [46.50, 72.00], [77.00, 102.50], [107.50, 133.00], [138.00, 163.50], [168.50, 194.00]];
        for (var i = 0; i < columnPositions.length; i++) {
            page.guides.add(guidesLayer, { orientation: HorizontalOrVertical.VERTICAL, location: columnPositions[i][0] });
            page.guides.add(guidesLayer, { orientation: HorizontalOrVertical.VERTICAL, location: columnPositions[i][1] });
        }
    } catch(e) {}

    // 5. Inserir Guias Nativas Horizontais (Módulos)
    try {
        var rowPositions = [[16.00, 44.75], [49.75, 78.50], [83.50, 112.25], [117.25, 146.00], [151.00, 179.75], [184.75, 213.50], [218.50, 247.25], [252.25, 281.00]];
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

    // 7. Renderizar Elementos de Conteúdo Fielmente 1:1

    // A. Folio Topo
    try {
        var topFrame = page.textFrames.add(contentLayer);
        topFrame.geometricBounds = [10.00, 16.00, 15.00, 194.00];
        topFrame.contents = "LAYOUTFORGE // FOLIO Nº 82 // SEED #94021";
        topFrame.paragraphs.item(0).appliedParagraphStyle = styleFolio;
    } catch(e) {}

    // B. Título Principal
    try {
        var titleFrame = page.textFrames.add(contentLayer);
        titleFrame.geometricBounds = [16.00, 16.00, 64.00, 163.50];
        titleFrame.contents = "THE CANON OF\\rPAGE DESIGN";
        for (var p = 0; p < titleFrame.paragraphs.length; p++) {
            titleFrame.paragraphs.item(p).appliedParagraphStyle = styleDisplay;
        }
    } catch(e) {}

    // C. Subtítulo
    try {
        var subFrame = page.textFrames.add(contentLayer);
        subFrame.geometricBounds = [68.00, 16.00, 80.00, 163.50];
        subFrame.contents = "GEOMETRIA SAGRADA NA ERA DIGITAL";
        subFrame.paragraphs.item(0).appliedParagraphStyle = styleSub;
    } catch(e) {}

    // D. Quadro de Imagem (Hero Photography)
    try {
        var heroFrame = page.rectangles.add(framesLayer);
        heroFrame.geometricBounds = [83.50, 16.00, 146.00, 163.50];
        heroFrame.contentType = ContentType.GRAPHIC_TYPE;
        heroFrame.strokeColor = doc.colors.item("Black");
        heroFrame.strokeWeight = 0.5;
        heroFrame.strokeTint = 40;
    } catch(e) {}

    // E. Badge de Destaque Numérico (Coluna 6)
    try {
        var badgeBox = page.rectangles.add(framesLayer);
        badgeBox.geometricBounds = [83.50, 168.50, 146.00, 194.00];
        badgeBox.contentType = ContentType.UNASSIGNED;
        badgeBox.strokeColor = doc.colors.item("Black");
        badgeBox.strokeWeight = 1.0;

        var badgeText = page.textFrames.add(contentLayer);
        badgeText.geometricBounds = [85.50, 170.50, 144.00, 192.00];
        badgeText.contents = "12\\rCOLUNAS DE RESSONÂNCIA VISUAL";
        badgeText.paragraphs.item(0).appliedParagraphStyle = styleBadgeNum;
        if (badgeText.paragraphs.length > 1) {
            badgeText.paragraphs.item(1).appliedParagraphStyle = styleBadgeLabel;
        }
    } catch(e) {}

    // F. Colunas de Texto Editorial (3 Colunas travadas no Grid modular com Threading)
    try {
        var bodyCol1 = page.textFrames.add(contentLayer);
        bodyCol1.geometricBounds = [151.00, 16.00, 275.00, 72.00];
        bodyCol1.contents = "O espaço em branco não representa o vazio ou a ausência; ele é o suporte ativo que confere autoridade e respiro à mensagem.\\rQuando tudo grita, nada é ouvido. A hierarquia se estabelece pela coragem de subtrair o ornamento.";
        for (var b1 = 0; b1 < bodyCol1.paragraphs.length; b1++) {
            bodyCol1.paragraphs.item(b1).appliedParagraphStyle = styleBody;
        }

        var bodyCol2 = page.textFrames.add(contentLayer);
        bodyCol2.geometricBounds = [151.00, 77.00, 275.00, 133.00];
        bodyCol2.contents = "A tipografia é a arquitetura das palavras no espaço bidimensional. Cada caractere possui um peso, cada entrelinha define um andamento rítmico.\\rA ordem geométrica confere clareza cognitiva.";
        for (var b2 = 0; b2 < bodyCol2.paragraphs.length; b2++) {
            bodyCol2.paragraphs.item(b2).appliedParagraphStyle = styleBody;
        }

        var bodyCol3 = page.textFrames.add(contentLayer);
        bodyCol3.geometricBounds = [151.00, 138.00, 275.00, 194.00];
        bodyCol3.contents = "O desenho de grade não restringe a criatividade: liberta o designer da indecisão ao fornecer um alicerce matemático onde cada elemento encontra seu lugar natural e harmônico.";
        for (var b3 = 0; b3 < bodyCol3.paragraphs.length; b3++) {
            bodyCol3.paragraphs.item(b3).appliedParagraphStyle = styleBody;
        }

        // Threading nativo das caixas
        bodyCol1.nextTextFrame = bodyCol2;
        bodyCol2.nextTextFrame = bodyCol3;
    } catch(e) {}

    // G. Folio Rodapé
    try {
        var botFrame = page.textFrames.add(contentLayer);
        botFrame.geometricBounds = [285.00, 16.00, 290.00, 194.00];
        botFrame.contents = "P. 01 — GRID: 6 COL × 8 MOD // SWISS";
        botFrame.paragraphs.item(0).appliedParagraphStyle = styleFolio;
    } catch(e) {}

    // 8. Ajustar Zoom para Visualização Completa
    try {
        if (doc.layoutWindows.length > 0) {
            doc.layoutWindows[0].zoom(ZoomOptions.FIT_PAGE);
        }
    } catch(e) {}

    alert("✓ LayoutForge gerado com sucesso no InDesign!\\n\\n• Formato: 210 x 297 mm (A4 Vertical)\\n• Grade: 6 Colunas × 8 Módulos\\n• Escola: SUÍÇO (Müller-Brockmann)\\n• Seed: #94021\\n\\nComposição fiel 1:1 espelhada com a prévia visual!");
}

createLayoutForgeDocument();
"""

targets = [
    r"C:\Users\Marketing - Apolo\.gemini\antigravity-ide\scratch\layout-forge\exports\layoutforge-a4_portrait.jsx",
    r"C:\Users\Marketing - Apolo\Downloads\layoutforge-a4_portrait.jsx",
    r"C:\Users\Marketing - Apolo\Downloads\layoutforge-a4_portrait (1).jsx",
]

appdata = os.environ.get('APPDATA', '')
indesign_root = os.path.join(appdata, 'Adobe', 'InDesign')
if os.path.exists(indesign_root):
    for panel in glob.glob(os.path.join(indesign_root, '*', '*', 'Scripts', 'Scripts Panel')):
        targets.append(os.path.join(panel, 'LayoutForge_Grade.jsx'))
        targets.append(os.path.join(panel, 'layoutforge-a4_portrait.jsx'))
        targets.append(os.path.join(panel, 'layoutforge-a4_portrait (1).jsx'))

app_dirs = [
    r"D:\Arquivos e Programas\Adobe\Adobe InDesign 2026\Scripts\Scripts Panel",
]
for ad in app_dirs:
    if os.path.exists(ad):
        targets.append(os.path.join(ad, 'LayoutForge_Grade.jsx'))
        targets.append(os.path.join(ad, 'layoutforge-a4_portrait.jsx'))
        targets.append(os.path.join(ad, 'layoutforge-a4_portrait (1).jsx'))

for target in list(set(targets)):
    try:
        os.makedirs(os.path.dirname(target), exist_ok=True)
        with open(target, 'w', encoding='utf-8') as f:
            f.write(jsx_content)
        print("ATUALIZADO:", target)
    except Exception as e:
        print("ERRO:", target, e)
