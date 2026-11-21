"""Integrate individually generated recipe assets without cross-recipe fallbacks."""
from pathlib import Path
import fcntl
import hashlib
import json
import os
import tempfile
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
# Several generation workers may finish together; serialize manifest updates.
lock_key = hashlib.sha256(str(ROOT).encode()).hexdigest()[:16]
integration_lock = (Path(tempfile.gettempdir()) / f'recipe-images-{lock_key}.lock').open('a')
fcntl.flock(integration_lock.fileno(), fcntl.LOCK_EX)
recipes = json.loads((ROOT / 'dist/recipes.json').read_text())
by_id = {recipe['id']: recipe for recipe in recipes}
manifest_path = ROOT / 'dist/recipe-images.json'
manifest = json.loads(manifest_path.read_text())

for fragment_path in sorted((ROOT / 'source-assets/image-batches').glob('*.json')):
    fragment = json.loads(fragment_path.read_text())
    entries = fragment.items() if isinstance(fragment, dict) else ((row['id'], row) for row in fragment)
    for recipe_id, row in entries:
        assert recipe_id in by_id, f'Unknown recipe: {recipe_id}'
        assert row['title'] == by_id[recipe_id]['title'], f'Title mismatch: {recipe_id}'
        expected = f'assets/recipes/{recipe_id}-3d.webp'
        assert row['src'] == expected, f'Unexpected image path: {recipe_id}'
        destination = ROOT / 'dist' / expected
        if not destination.exists():
            source = row.get('source') or row.get('generated_path') or row.get('source_png')
            assert source and Path(source).is_file(), f'Missing generated source: {recipe_id}'
            image = Image.open(source).convert('RGB')
            image.thumbnail((960, 640), Image.Resampling.LANCZOS)
            destination.parent.mkdir(parents=True, exist_ok=True)
            temporary = destination.with_suffix('.tmp.webp')
            image.save(temporary, 'WEBP', quality=82, method=6)
            os.replace(temporary, destination)
        with Image.open(destination) as image:
            image.verify()
        manifest[recipe_id] = {'src': expected, 'title': row['title'], 'kind': 'generated-3d'}

hashes = set()
for recipe_id, row in manifest.items():
    row['title'] = by_id[recipe_id]['title']
    digest = hashlib.sha256((ROOT / 'dist' / row['src']).read_bytes()).hexdigest()
    assert digest not in hashes, f'Duplicate image content: {recipe_id}'
    hashes.add(digest)
    row['revision'] = digest[:12]
manifest = dict(sorted(manifest.items(), key=lambda row: int(row[0][1:])))
temporary = manifest_path.with_suffix('.tmp.json')
temporary.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
os.replace(temporary, manifest_path)
coverage = {'total': len(recipes), 'illustrated': len(manifest), 'missing': len(recipes) - len(manifest), 'categories': {}}
for category in dict.fromkeys(recipe['category'] for recipe in recipes):
    rows = [recipe for recipe in recipes if recipe['category'] == category]
    coverage['categories'][category] = {'recipes': len(rows), 'images': sum(recipe['id'] in manifest for recipe in rows)}
coverage_path = ROOT / 'source-assets/image-coverage.json'
coverage_temporary = coverage_path.with_suffix('.tmp.json')
coverage_temporary.write_text(json.dumps(coverage, ensure_ascii=False, indent=2) + '\n')
os.replace(coverage_temporary, coverage_path)
print(json.dumps(coverage, ensure_ascii=False))
