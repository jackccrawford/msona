# Image Guidelines for mVara Luminary

## Directory Structure
```
public/
└── images/
    ├── banner.png
    ├── features/
    │   └── overview.png
    ├── themes/
    │   ├── showcase.png
    │   ├── ocean.png
    │   ├── midnight.png
    │   ├── sunset.png
    │   ├── forest.png
    │   ├── lavender.png
    │   └── monochrome.png
    └── mobile/
        └── interface.png
```

## Image Specifications

### Banner Image (`/public/images/banner.png`)
- Resolution: 1200x400px
- Aspect ratio: 3:1
- Format: PNG with transparency
- Purpose: Hero image showing the app with multiple themes
- Max file size: 200KB

### Features Overview (`/public/images/features/overview.png`)
- Resolution: 1200x800px
- Aspect ratio: 3:2
- Format: PNG
- Purpose: Grid showing multiple features in action
- Max file size: 300KB

### Theme Showcase (`/public/images/themes/showcase.png`)
- Resolution: 1200x600px
- Aspect ratio: 2:1
- Format: PNG
- Purpose: Side-by-side comparison of different themes
- Max file size: 250KB

### Individual Theme Screenshots (`/public/images/themes/*.png`)
- Resolution: 600x400px
- Aspect ratio: 3:2
- Format: PNG
- Purpose: Individual theme demonstrations
- Max file size: 150KB each

### Mobile Interface (`/public/images/mobile/interface.png`)
- Resolution: 390x844px
- Aspect ratio: ~9:19.5 (iPhone dimensions)
- Format: PNG
- Purpose: Mobile responsive design demonstration
- Max file size: 150KB

## Guidelines

1. **Optimization**
   - Use WebP format with PNG fallback
   - Compress images using tools like ImageOptim
   - Remove metadata
   - Use appropriate compression levels

2. **Accessibility**
   - Include descriptive alt text in implementation
   - Maintain sufficient contrast ratios
   - Avoid text in images where possible

3. **Responsive Design**
   - Provide multiple sizes for responsive images
   - Use srcset for optimal loading
   - Consider mobile bandwidth

4. **Quality Standards**
   - Minimum 2x resolution for retina displays
   - Sharp, clear screenshots without artifacts
   - Consistent lighting and presentation
   - Professional appearance

5. **Content Guidelines**
   - Use real application content
   - Demonstrate key features
   - Show diverse themes and configurations
   - Include mobile and desktop views

## Example Implementation

```html
<img
  src="/images/banner.png"
  srcset="/images/banner.webp"
  alt="mVara Luminary application showing multiple theme options"
  width="1200"
  height="400"
  loading="lazy"
/>
```

## Tools Recommended

- **Capture**: macOS Screenshot, Windows Snipping Tool
- **Editing**: Figma, GIMP, or Photoshop
- **Optimization**: ImageOptim, TinyPNG
- **Format Conversion**: Squoosh.app

## Version Control

- Store image source files separately from the repository
- Document any significant image updates
- Track image versions in CHANGELOG.md