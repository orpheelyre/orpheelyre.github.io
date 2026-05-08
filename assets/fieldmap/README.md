# Field Map Data Interface (QGIS -> site)

Export all vector layers as **GeoJSON** in **EPSG:4326 (WGS84 lon/lat)**.

## Required files

- `seacliff.manifest.json`
- `points.geojson`
- `paths.geojson`
- `roads.geojson` (optional visual context)
- `areas.geojson` (optional polygons)
- `notes.json` (fieldnotes + multi-image visits)

## 1) seacliff.manifest.json

```json
{
  "title": "Seacliff Field Notes Atlas",
  "subtitle": "Dunedin - Turau Aruhe Seacliff - Waikouaiti",
  "description": "...",
  "projectId": "turau-aruhe-seacliff",
  "extent": [170.45, -45.93, 170.73, -45.55],
  "defaultMonth": "2026-05",
  "accumulateDefault": true,
  "months": [
    { "id": "2026-02", "label": "February 2026" },
    { "id": "2026-03", "label": "March 2026" }
  ],
  "files": {
    "areas": "areas.geojson",
    "roads": "roads.geojson",
    "paths": "paths.geojson",
    "points": "points.geojson",
    "notes": "notes.json"
  }
}
```

## 2) points.geojson fields

Geometry: `Point`

Properties used by UI:
- `site_id` (required, stable id)
- `title` (display name)
- `place` (secondary label)
- `month_start` (first visible month, e.g. `2026-03`)
- `month_end` (optional)
- `month` or `months` (optional, for one-off time windows)

## 3) paths.geojson fields

Geometry: `LineString` or `MultiLineString`

Properties used by timeline:
- `month_start` (required for timeline behavior)
- `month_end` (optional)
- `month` or `months` (optional alternative)
- `label` (optional)

With `accumulateDefault=true`, older paths stay visible and current month paths are highlighted.

## 4) roads.geojson fields

Geometry: `LineString` or `MultiLineString`

No required attributes; this is a static base context layer.

## 5) areas.geojson fields

Geometry: `Polygon` or `MultiPolygon`

No required attributes; this is an optional context/study-zone layer.

## 6) notes.json (for revisits + multi-image fieldnotes)

```json
{
  "sites": [
    {
      "site_id": "seacliff-core",
      "title": "Seacliff Core",
      "place": "Turau Aruhe Seacliff",
      "visits": [
        {
          "id": "seacliff-2026-03",
          "month": "2026-03",
          "title": "Trace Return",
          "note": "...",
          "tags": ["trace", "return"],
          "images": [
            { "src": "assets/fieldmap/img/trace-1.jpg", "alt": "...", "caption": "..." },
            { "src": "assets/fieldmap/img/trace-2.jpg", "alt": "...", "caption": "..." }
          ]
        }
      ]
    }
  ]
}
```

A single `site_id` can have many visits across months. This is how repeated returns are represented.
