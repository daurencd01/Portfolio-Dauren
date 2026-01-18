# Base64 for a simple 100x100 dark gray PNG
$base64 = "iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA6SURBVHhe7cExAQAAAMKg9U9tDj2gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4IsNiQAABQ456wAAAABJRU5ErkJggg=="
$bytes = [Convert]::FromBase64String($base64)

# Paths
$paths = @(
    "assets/photo/profile.png",
    "assets/logos/sr-holding.png",
    "assets/logos/aitu.png",
    "assets/certificates/cert-1.png",
    "assets/certificates/cert-2.png",
    "assets/certificates/cert-3.png",
    "assets/certificates/cert-4.png"
)

foreach ($path in $paths) {
    if (!(Test-Path (Split-Path $path))) {
        New-Item -ItemType Directory -Force -Path (Split-Path $path) | Out-Null
    }
    [IO.File]::WriteAllBytes($path, $bytes)
    Write-Host "Generated $path"
}

# Remove SVGs if they exist
$svgs = Get-ChildItem -Path "assets" -Include *.svg -Recurse
if ($svgs) {
    Remove-Item $svgs -Force
    Write-Host "Removed persistent SVGs"
}
