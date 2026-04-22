# Sanity Studio Client Guide

Welcome! Your website content is managed through **Sanity Studio**. Here's how to work with images and content.

## How to Access Studio

Open: `http://localhost:3000/studio` (local development)  
Or your production URL: `/studio`

---

## Image Management

### Where Images Are Stored

✅ **Images are stored in Sanity's CDN** (not on your server)
- Client uploads → Sanity servers → Automatic optimization → Global delivery
- When you upload an image, it's immediately available on your site

### How to Upload/Change Images

1. Open Sanity Studio
2. Navigate to **Site Content** (singleton document)
3. Go to the page group (Home, About, Projects, Contact)
4. Click the **Image field** (e.g., Featured Design > Main Image)
5. Click **Upload image** or drag-and-drop
6. Sanity auto-optimizes and stores it
7. **Publish** when done
8. Website updates within seconds

### Image Fields You Can Edit

**Home Page:**
- Featured Design Image
- Showcase Tiles (2 images)

**About Page:**
- Sidebar Image
- Award Image

**Projects Page:**
- Carousel Slide Images (4 slides)
- Spotlight Project Image

### Tips

- Click the **image thumbnail** to preview or replace it
- Images are compressed automatically for fast loading
- You can delete images by clicking the X button
- All uploads are version-controlled (Sanity keeps history)

---

## Text Content Management

### Home Page (editable fields)
- Hero Eyebrow
- Hero Title
- Hero Paragraphs (2)
- Hero Buttons
- Featured Design details

### About Page (editable fields)
- Page Title
- Sidebar Name & Subtitle
- License Numbers (array)
- Specializations (array)
- Profile sections
- Award Text
- Architecture Principles
- Services & descriptions

### Projects Page (editable fields)
- Showcase Title & Description
- Carousel Slides (tag, title)
- Portfolio Title
- Filter Labels
- Status Guide Cards
- Featured Project details

### Contact Page (editable fields)
- Contact Form text
- Contact details
- Office Location

---

## Publishing Changes

After editing:
1. Click **Publish** button (top right)
2. Your changes go live within seconds
3. Site automatically refreshes with new content

---

## Need Help?

All fields in Studio have **descriptions** and **validation**. If a field shows an error:
- Check the description below the field
- Fill in required fields (marked with *)
- Ensure URLs start with http/https
- Ensure emails are valid format

---

## Image Best Practices

- Upload images in **modern formats** (AVIF, WebP, JPG)
- Use images **1200px wide or larger** for best quality
- Sanity auto-crops via **hotspot** (click the crop tool)
- Large images are automatically compressed
