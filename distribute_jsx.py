import os
import glob

jsx_content = """// =============================================================================
// LAYOUTFORGE — ADOBE INDESIGN AUTOMATION SCRIPT (.jsx)
// Execução: No InDesign, abra "Janela > Utilitários > Scripts" e clique duas vezes neste script.
// Cria documento nativo, réguas, guias, caixas de texto e quadros de imagem na grade.
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

    // 3. Criar Camadas Nativas do InDesign com tratamento de duplicação
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

    // 6. Criar Estilos de Parágrafo Prontos
    function getOrCreateParaStyle(name, props) {
        try {
            var s = doc.paragraphStyles.itemByName(name);
            if (s.isValid) return s;
        } catch(e) {}
        return doc.paragraphStyles.add(props);
    }

    var styleDisplay = getOrCreateParaStyle("LayoutForge / Título Principal", { name: "LayoutForge / Título Principal", pointSize: 34, leading: 38, capitalization: Capitalization.ALL_CAPS });
    var styleSub = getOrCreateParaStyle("LayoutForge / Subtítulo", { name: "LayoutForge / Subtítulo", pointSize: 13, leading: 17 });
    var styleBody = getOrCreateParaStyle("LayoutForge / Corpo de Texto", { name: "LayoutForge / Corpo de Texto", pointSize: 9.5, leading: 13.5, hyphenation: false });
    var styleMeta = getOrCreateParaStyle("LayoutForge / Metadados & Legenda", { name: "LayoutForge / Metadados & Legenda", pointSize: 7.5, leading: 10 });

    // 7. Criar Quadro de Imagem (com cruz interna X nativa do InDesign)
    try {
        doc.activeLayer = framesLayer;
        var imgTop = 16 + 33.75 * 2.5;
        var imgBottom = 16 + 33.75 * 6;
        var imageFrame = page.rectangles.add(framesLayer);
        imageFrame.contentType = ContentType.GRAPHIC_TYPE;
        imageFrame.geometricBounds = [imgTop, 16, imgBottom, 210 - 16];
        imageFrame.strokeColor = doc.colors.item("Black");
        imageFrame.strokeWeight = 0.5;
    } catch(e) {}

    // 8. Criar Quadro de Texto do Título na Camada de Conteúdo
    try {
        doc.activeLayer = contentLayer;
        var headlineFrame = page.textFrames.add(contentLayer);
        headlineFrame.geometricBounds = [16, 16, 16 + 33.75 * 2.2, 210 - 16];
        headlineFrame.contents = "CANONICAL STRUCTURE\\rSISTEMA PARAMÉTRICO DE DESIGN";
        try {
            headlineFrame.paragraphs.item(0).appliedParagraphStyle = styleDisplay;
            if (headlineFrame.paragraphs.length > 1) {
                headlineFrame.paragraphs.item(1).appliedParagraphStyle = styleSub;
            }
        } catch(e) {}
    } catch(e) {}

    // 9. Quadro de Texto para Corpo Editorial
    try {
        var bodyFrame = page.textFrames.add(contentLayer);
        bodyFrame.geometricBounds = [16 + 33.75 * 6.5, 16, 297 - 16, 210 - 16];
        bodyFrame.textFramePreferences.textColumnCount = 2;
        bodyFrame.textFramePreferences.textColumnGutter = 5;
        bodyFrame.contents = "A grade tipográfica é a expressão mais pura da ordem matemática aplicada à comunicação visual. Criada com precisão absoluta, define ritmo, hierarquia e legibilidade em todas as páginas.";
        try {
            bodyFrame.paragraphs.item(0).appliedParagraphStyle = styleBody;
        } catch(e) {}
    } catch(e) {}

    // 10. Ajustar Zoom para Visualização Completa
    try {
        if (doc.layoutWindows.length > 0) {
            doc.layoutWindows[0].zoom(ZoomOptions.FIT_PAGE);
        }
    } catch(e) {}

    alert("✓ LayoutForge gerado com sucesso no InDesign!\\n\\n• Formato: 210 x 297 mm (A4 Vertical)\\n• Grade: 6 Colunas × 8 Módulos\\n• Escola: SUÍÇO (Müller-Brockmann)\\n\\nCamadas, guias e caixas de texto prontas para diagramação.");
}

createLayoutForgeDocument();
"""

targets = [
    r"C:\Users\Marketing - Apolo\.gemini\antigravity-ide\scratch\layout-forge\exports\layoutforge-a4_portrait.jsx",
    r"C:\Users\Marketing - Apolo\Downloads\layoutforge-a4_portrait.jsx",
    r"C:\Users\Marketing - Apolo\Downloads\layoutforge-a4_portrait (1).jsx",
]

# Adiciona todos os painéis de scripts do InDesign no sistema
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

for target in targets:
    try:
        os.makedirs(os.path.dirname(target), exist_ok=True)
        with open(target, 'w', encoding='utf-8') as f:
            f.write(jsx_content)
        print("ATUALIZADO:", target)
    except Exception as e:
        print("ERRO:", target, e)
