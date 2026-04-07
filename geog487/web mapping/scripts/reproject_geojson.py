import json
import math
import glob
import os
import shutil

def reproject_coordinates(coords):
    """Convert Web Mercator (EPSG:3857) to WGS84 (EPSG:4326)"""
    x, y = coords[0], coords[1]
    lng = (x / 20037508.34) * 180
    lat = (y / 20037508.34) * 180
    lat = 180 / math.pi * (2 * math.atan(math.exp(lat * math.pi / 180)) - math.pi / 2)
    return [lng, lat]

def reproject_geometry(geometry):
    """Reproject geometry coordinates"""
    geom_type = geometry['type']
    
    if geom_type == 'Polygon':
        geometry['coordinates'] = [
            [reproject_coordinates(coord) for coord in ring]
            for ring in geometry['coordinates']
        ]
    elif geom_type == 'MultiPolygon':
        geometry['coordinates'] = [
            [[reproject_coordinates(coord) for coord in ring] for ring in polygon]
            for polygon in geometry['coordinates']
        ]
    elif geom_type == 'LineString':
        geometry['coordinates'] = [
            reproject_coordinates(coord) for coord in geometry['coordinates']
        ]
    elif geom_type == 'Point':
        geometry['coordinates'] = reproject_coordinates(geometry['coordinates'])
    
    return geometry

def reproject_file(input_file, overwrite=False):
    """Reproject a single GeoJSON file"""
    # Create output filename
    if overwrite:
        output_file = input_file
        backup_file = f"{input_file}.backup"
        # Create backup
        import shutil
        shutil.copy2(input_file, backup_file)
        print(f"  Created backup: {backup_file}")
    else:
        base_name = os.path.splitext(input_file)[0]
        output_file = f"{base_name}_reprojected.geojson"
    
    print(f"\nProcessing {input_file}...")
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"  Original CRS: {data.get('crs', 'Not specified')}")
        
        # Reproject each feature
        print(f"  Reprojecting {len(data.get('features', []))} features...")
        for feature in data['features']:
            feature['geometry'] = reproject_geometry(feature['geometry'])
        
        # Remove CRS property (will be WGS84 by default)
        if 'crs' in data:
            del data['crs']
        
        # Save reprojected file
        print(f"  Saving to {output_file}...")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f)
        
        print(f"  ✓ Done!")
        return output_file
        
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return None

# Process CDM_2508 files (don't overwrite)
pattern = 'data/drought2025/CDM_2508*.geojson'
files = glob.glob(pattern)
files = [f for f in files if '_reprojected' not in f]

print(f"Found {len(files)} CDM_2508 files to reproject:")
for f in files:
    print(f"  - {f}")

reprojected_files = []
if files:
    for input_file in files:
        output = reproject_file(input_file, overwrite=False)
        if output:
            reprojected_files.append(output)

# Process DroughtAugust2019 files (overwrite original)
pattern2019 = 'data/DroughtAugust2019/CDM_*.geojson'
files2019 = glob.glob(pattern2019)
files2019 = [f for f in files2019 if '.backup' not in f]

print(f"\n{'='*60}")
print(f"Found {len(files2019)} DroughtAugust2019 files to reproject (will overwrite):")
for f in files2019:
    print(f"  - {f}")

if files2019:
    for input_file in files2019:
        output = reproject_file(input_file, overwrite=True)
        if output:
            reprojected_files.append(output)

# Process DroughtAugust2024 files (overwrite original)
pattern2024 = 'data/DroughtAugust2024/CDM_*.geojson'
files2024 = glob.glob(pattern2024)
files2024 = [f for f in files2024 if '.backup' not in f]

print(f"\n{'='*60}")
print(f"Found {len(files2024)} DroughtAugust2024 files to reproject (will overwrite):")
for f in files2024:
    print(f"  - {f}")

if files2024:
    for input_file in files2024:
        output = reproject_file(input_file, overwrite=True)
        if output:
            reprojected_files.append(output)

print(f"\n{'='*60}")
print(f"Successfully processed {len(reprojected_files)} files")
if files:
    print(f"\nCDM_2508 files saved with '_reprojected.geojson' suffix")
if files2019:
    print(f"DroughtAugust2019 files overwritten (backups saved with .backup extension)")
if files2024:
    print(f"DroughtAugust2024 files overwritten (backups saved with .backup extension)")
