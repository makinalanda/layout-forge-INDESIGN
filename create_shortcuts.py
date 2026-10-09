import os
import subprocess

target = r"C:\Users\Marketing - Apolo\AppData\Roaming\Adobe\InDesign\Version 21.0\pt_BR\Scripts\Scripts Panel"
dl_shortcut = r"C:\Users\Marketing - Apolo\Downloads\Pasta Scripts InDesign.lnk"
desktop_shortcut = r"C:\Users\Marketing - Apolo\Desktop\Pasta Scripts InDesign.lnk"

vbs = f'''
Set sh = CreateObject("WScript.Shell")
Set sc1 = sh.CreateShortcut("{dl_shortcut}")
sc1.TargetPath = "{target}"
sc1.Description = "Atalho para o Painel de Scripts do InDesign"
sc1.Save

Set sc2 = sh.CreateShortcut("{desktop_shortcut}")
sc2.TargetPath = "{target}"
sc2.Description = "Atalho para o Painel de Scripts do InDesign"
sc2.Save
'''

with open("make_shortcuts.vbs", "w", encoding="utf-8") as f:
    f.write(vbs)

subprocess.run(["cscript", "//nologo", "make_shortcuts.vbs"])
if os.path.exists("make_shortcuts.vbs"):
    os.remove("make_shortcuts.vbs")

print("Atalhos criados com sucesso!")
print("Downloads:", os.path.exists(dl_shortcut))
print("Desktop:", os.path.exists(desktop_shortcut))
