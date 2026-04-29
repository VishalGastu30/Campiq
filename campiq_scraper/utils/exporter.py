import pandas as pd
from utils.normalizer import generate_slug

def export_csv(df: pd.DataFrame, path: str):
    print("Validating and exporting CSV...")
    
    if df.empty:
        print("⚠️ Warning: Empty DataFrame provided for export.")
        df.to_csv(path, index=False)
        return
        
    required_cols = [
        'name', 'slug', 'city', 'state', 'type', 'established_year', 'nirf_rank',
        'nirf_category', 'naac_grade', 'rating', 'total_ratings', 'min_fees', 'max_fees',
        'placement_percent', 'avg_package', 'highest_package', 'top_recruiters',
        'courses_offered', 'website', 'ugc_approved', 'about', 'source'
    ]
    
    # Validate columns
    for col in required_cols:
        if col not in df.columns:
            raise ValueError(f"Missing required column: {col}")
            
    # Ensure no empty name or state
    if df['name'].isna().any() or df['state'].isna().any() or (df['name'] == '').any() or (df['state'] == '').any():
        print("⚠️ Warning: Rows with empty name or state found. Dropping them.")
        df = df.dropna(subset=['name', 'state'])
        df = df[(df['name'] != '') & (df['state'] != '')]
        
    # Generate and deduplicate slugs
    if 'slug' not in df.columns or df['slug'].isna().all():
        df['slug'] = df['name'].apply(lambda x: generate_slug(str(x)))
        
    # Handle duplicate slugs
    slug_counts = df['slug'].value_counts()
    duplicates = slug_counts[slug_counts > 1].index
    
    for slug in duplicates:
        dup_indices = df[df['slug'] == slug].index
        for i, idx in enumerate(dup_indices):
            if i > 0:
                city = str(df.loc[idx, 'city'] or '').lower().replace(' ', '-')
                if city:
                    df.loc[idx, 'slug'] = f"{slug}-{city}"
                else:
                    df.loc[idx, 'slug'] = f"{slug}-{i}"
                    
    # Validate type
    valid_types = ['GOVERNMENT', 'PRIVATE', 'DEEMED', 'AUTONOMOUS']
    df['type'] = df['type'].apply(lambda x: x if pd.notna(x) and x in valid_types else 'PRIVATE')
    
    # Validate fees
    df['min_fees'] = pd.to_numeric(df['min_fees'], errors='coerce').fillna(0).astype(int)
    df['max_fees'] = pd.to_numeric(df['max_fees'], errors='coerce').fillna(0).astype(int)
    
    # Clean top recruiters
    def clean_recruiters(x):
        if pd.isna(x) or not str(x).strip():
            return ""
        parts = [p.strip() for p in str(x).split('|') if p.strip()]
        return '|'.join(parts[:10])
        
    df['top_recruiters'] = df['top_recruiters'].apply(clean_recruiters)
    
    # Save
    df = df[required_cols]
    df.to_csv(path, index=False)
    print(f"Successfully exported {len(df)} rows to {path}")
