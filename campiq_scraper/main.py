import os
import pandas as pd
from scrapers import nirf_scraper, shiksha_scraper, careers360_scraper, collegedunia_scraper, kaggle_loader
from utils import merger, exporter

def main():
    print("Starting Campiq Scraper Pipeline...")
    
    os.makedirs('output', exist_ok=True)
    os.makedirs('cache', exist_ok=True)
    
    dfs = {}
    
    # 1. Run Scrapers
    try:
        print("\n--- Scraping Kaggle (Fallback) ---")
        dfs['kaggle'] = kaggle_loader.load_kaggle_data()
    except Exception as e:
        print(f"Failed to load Kaggle data: {e}")
        
    try:
        print("\n--- Scraping NIRF ---")
        dfs['nirf'] = nirf_scraper.scrape()
    except Exception as e:
        print(f"NIRF Scraper failed: {e}")
        
    try:
        print("\n--- Scraping Shiksha ---")
        dfs['shiksha'] = shiksha_scraper.scrape()
    except Exception as e:
        print(f"Shiksha Scraper failed: {e}")
        
    try:
        print("\n--- Scraping Careers360 ---")
        dfs['careers360'] = careers360_scraper.scrape()
    except Exception as e:
        print(f"Careers360 Scraper failed: {e}")
        
    try:
        print("\n--- Scraping CollegeDunia ---")
        dfs['collegedunia'] = collegedunia_scraper.scrape()
    except Exception as e:
        print(f"CollegeDunia Scraper failed: {e}")
        
    # 2. Merge Data
    print("\n--- Merging Data ---")
    final_df = merger.merge_all_sources(dfs)
    
    # 3. Export
    print("\n--- Exporting Final CSV ---")
    output_path = "output/campiq_colleges.csv"
    exporter.export_csv(final_df, output_path)
    
    print("\nPipeline complete!")

if __name__ == "__main__":
    main()
