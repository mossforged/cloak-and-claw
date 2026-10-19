# A000 unattended runner check

The built-in image generation tool worked in this unattended run and returned one acorn image without refusal or an approval prompt.

Delivered:
- `assets/source/A000-runner-check/acorn.png`: 512 × 512 PNG.
- `docs/screens/A000/acorn.jpg`: 512 × 512 phone copy, JPEG quality 80.

The output was visually checked: one warm painted cartoon acorn, bold dark outline, upper-left lighting, green background, no ground shadow. The generated image was resized to 512 × 512 using macOS sips; the JPEG was exported with sips. This is a runner test, not production art. No additional review sheet, prompt file, or asset registry change was made, as instructed.

Tool: built-in `image_gen.imagegen`, opaque background.

Exact prompt:
> Use case: stylized-concept. Create one small square game item test image, about 512 x 512 pixels: a single acorn centered with comfortable margins. Warm painted cartoon style, rich warm brown nut and textured brown cap, bold dark outlines, simple readable silhouette, three-quarter view about 30 degrees toward the camera, slight rightward tilt. Light from upper left. Flat solid exact #00FF00 green background edge to edge. No ground shadow, no extra objects, no face, no text, no border, no watermark.

Folder check passed; branch `a000-runner-check` was already checked out. Git LFS 3.8.0 is available. No branch switch, pull, or push was performed. No questions for the user.
