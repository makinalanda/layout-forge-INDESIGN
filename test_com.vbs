
On Error Resume Next
Set myInDesign = CreateObject("InDesign.Application")
If Err.Number <> 0 Then
    WScript.Echo "ERRO_COM: " & Err.Description
Else
    WScript.Echo "VERSAO: " & myInDesign.Version
End If
