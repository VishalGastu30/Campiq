HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept-Language": "en-IN,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

MIN_DELAY = 1.5   # seconds between requests
MAX_DELAY = 3.5

OUTPUT_PATH = "output/campiq_colleges.csv"
CACHE_DIR = "cache/"

NIRF_CATEGORIES = {
    "Engineering": "https://www.nirfindia.org/Rankings/2024/EngineeringRanking.html",
    "Management": "https://www.nirfindia.org/Rankings/2024/ManagementRanking.html",
    "Medical": "https://www.nirfindia.org/Rankings/2024/MedicalRanking.html",
    "Law": "https://www.nirfindia.org/Rankings/2024/LawRanking.html",
    "University": "https://www.nirfindia.org/Rankings/2024/UniversityRanking.html",
    "Overall": "https://www.nirfindia.org/Rankings/2024/OverallRanking.html",
}
