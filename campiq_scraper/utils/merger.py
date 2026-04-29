import pandas as pd
from utils.normalizer import fuzzy_match_name

def merge_all_sources(dfs: dict[str, pd.DataFrame]) -> pd.DataFrame:
    # 1. Use NIRF as the spine
    nirf_df = dfs.get("nirf", pd.DataFrame())
    shiksha_df = dfs.get("shiksha", pd.DataFrame())
    careers360_df = dfs.get("careers360", pd.DataFrame())
    collegedunia_df = dfs.get("collegedunia", pd.DataFrame())
    kaggle_df = dfs.get("kaggle", pd.DataFrame())
    
    print(f"Initial counts - NIRF: {len(nirf_df)}, Shiksha: {len(shiksha_df)}, Careers360: {len(careers360_df)}, CollegeDunia: {len(collegedunia_df)}, Kaggle: {len(kaggle_df)}")

    # Add source column if not present
    for src, df in dfs.items():
        if not df.empty and 'source' not in df.columns:
            df['source'] = src
            
    # Base columns
    columns = [
        'name', 'slug', 'city', 'state', 'type', 'established_year', 'nirf_rank',
        'nirf_category', 'naac_grade', 'rating', 'total_ratings', 'min_fees', 'max_fees',
        'placement_percent', 'avg_package', 'highest_package', 'top_recruiters',
        'courses_offered', 'website', 'ugc_approved', 'about', 'source'
    ]
    
    # Initialize final dataframe
    final_data = []
    
    # Start with NIRF and Kaggle as base
    if not nirf_df.empty:
        for _, row in nirf_df.iterrows():
            final_data.append(row.to_dict())
    
    if not kaggle_df.empty:
        # If NIRF is empty, Kaggle is the sole base. If not, append Kaggle directly
        # since Kaggle is our trusted fallback.
        for _, row in kaggle_df.iterrows():
            final_data.append(row.to_dict())
            
    # Helper to merge dicts
    def merge_row(base: dict, new: dict, source_name: str):
        for col in columns:
            if col in new and pd.notna(new[col]) and new[col] != "" and new[col] != 0:
                # Priority logic: don't overwrite if base already has it, unless we are accumulating
                if col not in base or pd.isna(base[col]) or base[col] == "" or base[col] == 0:
                    base[col] = new[col]
                    # Update source if we significantly augment
                    if col in ['min_fees', 'rating', 'placement_percent']:
                        if source_name not in str(base.get('source', '')):
                            base['source'] = f"{base.get('source', '')},{source_name}".strip(',')

    # Merge logic
    base_names = [d.get('name', '') for d in final_data]
    
    for src_name, df in [("shiksha", shiksha_df), ("careers360", careers360_df), ("collegedunia", collegedunia_df)]:
        if df.empty:
            continue
            
        for _, row in df.iterrows():
            row_dict = row.to_dict()
            name = row_dict.get('name', '')
            if not name:
                continue
                
            match = fuzzy_match_name(name, base_names, threshold=85)
            
            if match:
                # Find the matched row and update it
                for item in final_data:
                    if item['name'] == match:
                        merge_row(item, row_dict, src_name)
                        break
            else:
                # Add as new row if it's from a supplementary source
                # Set nirf_rank to None
                row_dict['nirf_rank'] = None
                row_dict['source'] = src_name
                final_data.append(row_dict)
                base_names.append(name) # Update candidates
                
    final_df = pd.DataFrame(final_data)
    
    if final_df.empty:
        # Create empty df with required columns
        final_df = pd.DataFrame(columns=columns)
        return final_df
        
    # Deduplicate exact matches
    final_df = final_df.drop_duplicates(subset=['name', 'state'], keep='first')
    
    # Ensure all columns exist
    for col in columns:
        if col not in final_df.columns:
            final_df[col] = None
            
    # Fill defaults
    final_df['rating'] = final_df['rating'].fillna(3.5)
    final_df['total_ratings'] = final_df['total_ratings'].fillna(0).astype(int)
    final_df['placement_percent'] = final_df['placement_percent'].fillna(0.0)
    
    # Generate about
    def gen_about(row):
        if pd.notna(row['about']) and row['about'] != "":
            return str(row['about']).replace('\n', ' ')
        name = row.get('name', '')
        ctype = str(row.get('type', 'private')).lower()
        city = row.get('city', '')
        state = row.get('state', '')
        return f"{name} is a {ctype} institution located in {city}, {state}."
        
    if 'about' in final_df.columns:
        final_df['about'] = final_df.apply(gen_about, axis=1)
        
    # Reorder columns
    final_df = final_df[columns]
    
    return final_df
