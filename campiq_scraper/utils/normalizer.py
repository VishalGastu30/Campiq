import re
from thefuzz import fuzz

def generate_slug(name: str) -> str:
    slug = name.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug).strip('-')
    return slug

def normalize_state(state: str) -> str:
    if not state:
        return ""
    state_map = {
        "ap": "Andhra Pradesh", "ar": "Arunachal Pradesh", "as": "Assam", "br": "Bihar",
        "cg": "Chhattisgarh", "ga": "Goa", "gj": "Gujarat", "hr": "Haryana",
        "hp": "Himachal Pradesh", "jh": "Jharkhand", "ka": "Karnataka", "kl": "Kerala",
        "mp": "Madhya Pradesh", "mh": "Maharashtra", "mn": "Manipur", "ml": "Meghalaya",
        "mz": "Mizoram", "nl": "Nagaland", "od": "Odisha", "pb": "Punjab",
        "rj": "Rajasthan", "sk": "Sikkim", "tn": "Tamil Nadu", "ts": "Telangana",
        "tr": "Tripura", "up": "Uttar Pradesh", "uk": "Uttarakhand", "wb": "West Bengal",
        "an": "Andaman and Nicobar Islands", "ch": "Chandigarh", "dn": "Dadra and Nagar Haveli",
        "dd": "Daman and Diu", "dl": "Delhi", "jk": "Jammu and Kashmir", "la": "Ladakh",
        "ld": "Lakshadweep", "py": "Puducherry"
    }
    cleaned = state.lower().strip()
    return state_map.get(cleaned, state.title())

def normalize_college_type(raw: str) -> str:
    if not raw:
        return "PRIVATE"
    cleaned = raw.lower()
    if any(x in cleaned for x in ["govt", "government", "state"]):
        return "GOVERNMENT"
    if any(x in cleaned for x in ["deemed"]):
        return "DEEMED"
    if any(x in cleaned for x in ["autonomous"]):
        return "AUTONOMOUS"
    return "PRIVATE"

def clean_fees(raw: str) -> tuple[int, int]:
    if not raw:
        return (0, 0)
    
    # Extract numbers with optional decimals and multipliers (K, L, Lakh, Lakhs)
    raw = str(raw).lower()
    parts = re.findall(r'(\d+(?:\.\d+)?)\s*(k|l|lakh|lakhs)?', raw)
    
    values = []
    for num, mult in parts:
        val = float(num)
        if mult == 'k':
            val *= 1000
        elif mult in ['l', 'lakh', 'lakhs']:
            val *= 100000
        values.append(int(val))
    
    if not values:
        # Check for plain numbers like 85,000
        plain_nums = re.findall(r'\d+(?:,\d+)*', raw)
        values = [int(n.replace(',', '')) for n in plain_nums]
        
    if not values:
        return (0, 0)
        
    values.sort()
    if len(values) == 1:
        return (values[0], values[0])
    return (values[0], values[-1])

def clean_package(raw: str) -> float:
    if not raw:
        return 0.0
    
    raw = str(raw).lower()
    # E.g. "28.4 LPA", "₹28 Lakhs", "28,40,000"
    if "lpa" in raw or "lakh" in raw or "l" in raw:
        match = re.search(r'(\d+(?:\.\d+)?)', raw)
        if match:
            return float(match.group(1))
            
    # Try parsing large numbers
    plain_num = re.search(r'\d+(?:,\d+)*', raw)
    if plain_num:
        val = float(plain_num.group().replace(',', ''))
        if val > 1000: # Assuming it's in absolute INR, convert to LPA
            return round(val / 100000, 2)
        return float(val)
        
    return 0.0

def fuzzy_match_name(name: str, candidates: list[str], threshold=85) -> str | None:
    if not candidates or not name:
        return None
    best_match = None
    best_score = -1
    
    for cand in candidates:
        score = fuzz.token_sort_ratio(name, cand)
        if score > best_score:
            best_score = score
            best_match = cand
            
    if best_score >= threshold:
        return best_match
    return None
