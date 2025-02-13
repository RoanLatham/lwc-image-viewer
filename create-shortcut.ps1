# Get the directory where the script is located
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Define the path to the launch script
$launchScript = Join-Path $scriptPath "launch-image-viewer.ps1"

# Create a shortcut on the desktop
$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut([System.IO.Path]::Combine($scriptPath, "Image Viewer.lnk"))
$Shortcut.TargetPath = "powershell.exe"
$Shortcut.Arguments = "-ExecutionPolicy Bypass -NoProfile -File `"$launchScript`""
$Shortcut.WorkingDirectory = $scriptPath
$Shortcut.IconLocation = "shell32.dll,238" # Uses a generic image icon from Windows
$Shortcut.Description = "Launch Image Viewer Application"
$Shortcut.Save()

Write-Host "Shortcut created successfully!"
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 