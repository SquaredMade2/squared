# PowerShell script to install squared CLI on Windows

# Compile the squared CLI (assuming Go is installed and in PATH)
go build -o squared.exe

# Define the installation directory (you can change this)
$installDir = "$env:USERPROFILE\bin"

# Create the directory if it doesn't exist
if (!(Test-Path $installDir)) {
    New-Item -ItemType Directory -Force -Path $installDir
}

# Move the executable to the installation directory
Move-Item -Path .\squared.exe -Destination $installDir -Force

# Add the installation directory to PATH if it's not already there
if ($env:PATH -notlike "*$installDir*") {
    [Environment]::SetEnvironmentVariable(
        "PATH",
        [Environment]::GetEnvironmentVariable("PATH", "User") + ";$installDir",
        "User"
    )
    $env:PATH += ";$installDir"
}

Write-Host "squared CLI has been installed to $installDir\squared.exe"
Write-Host "The installation directory has been added to your PATH. You may need to restart your terminal for changes to take effect."