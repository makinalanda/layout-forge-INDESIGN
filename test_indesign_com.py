import subprocess
import os

vbs_code = '''
On Error Resume Next
Set myInDesign = CreateObject("InDesign.Application")
If Err.Number <> 0 Then
    WScript.Echo "ERRO_COM: " & Err.Description
Else
    WScript.Echo "VERSAO: " & myInDesign.Version
End If
'''

with open("test_com.vbs", "w", encoding="utf-8") as f:
    f.write(vbs_code)

res = subprocess.run(["cscript", "//nologo", "test_com.vbs"], capture_output=True, text=True)
print("STDOUT:", res.stdout)
print("STDERR:", res.stderr)
if os.path.exists("test_com.vbs"):
    os.remove("test_com.vbs")
