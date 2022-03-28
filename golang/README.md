This is reference of glitchfuck is so basic that it can be considerd the reference implementation. It simply xor's two images together and saves the result.

It has been tested on Windows and Linux. The only dependency is libpng. After getting that library (golang comes with it on Windows) simply do `go build glitchfuck.go` and use the resulting exe.

That resulting exe is a command line application, there is no GUI. You will need to launch it from `cmd.exe` or your favorite terminal emulator.

**Usage:** `[./glitchfuck or glitchfuck.exe] <link to first image> <link to second image> <the output image (default: output-[time].png)>