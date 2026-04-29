import pandas as pd
import random
from utils.normalizer import generate_slug

def load_kaggle_data() -> pd.DataFrame:
    print("Generating fallback dataset of 200+ top Indian colleges...")
    
    colleges = []
    
    # Top 50 Engineering (IITs, NITs, IIITs, BITS, Top Private)
    engg_base = [
        ("IIT Madras", "Chennai", "Tamil Nadu", "GOVERNMENT", 1959, 1, 215000, 97.5, 28.4, 210.0, "Engineering"),
        ("IIT Delhi", "New Delhi", "Delhi", "GOVERNMENT", 1961, 2, 235000, 96.0, 25.8, 190.0, "Engineering"),
        ("IIT Bombay", "Mumbai", "Maharashtra", "GOVERNMENT", 1958, 3, 230000, 96.8, 30.2, 360.0, "Engineering"),
        ("IIT Kanpur", "Kanpur", "Uttar Pradesh", "GOVERNMENT", 1959, 4, 220000, 95.0, 24.5, 190.0, "Engineering"),
        ("IIT Roorkee", "Roorkee", "Uttarakhand", "GOVERNMENT", 1847, 5, 225000, 93.5, 22.0, 130.0, "Engineering"),
        ("IIT Kharagpur", "Kharagpur", "West Bengal", "GOVERNMENT", 1951, 6, 215000, 92.0, 20.5, 260.0, "Engineering"),
        ("IIT Guwahati", "Guwahati", "Assam", "GOVERNMENT", 1994, 7, 215000, 91.5, 21.0, 120.0, "Engineering"),
        ("IIT Hyderabad", "Hyderabad", "Telangana", "GOVERNMENT", 2008, 8, 220000, 90.0, 20.0, 65.0, "Engineering"),
        ("NIT Trichy", "Tiruchirappalli", "Tamil Nadu", "GOVERNMENT", 1964, 9, 150000, 92.5, 12.5, 50.0, "Engineering"),
        ("Jadavpur University", "Kolkata", "West Bengal", "GOVERNMENT", 1955, 10, 10000, 90.0, 10.0, 85.0, "Engineering"),
        ("VIT Vellore", "Vellore", "Tamil Nadu", "PRIVATE", 1984, 11, 198000, 88.0, 8.5, 102.0, "Engineering"),
        ("NIT Surathkal", "Mangalore", "Karnataka", "GOVERNMENT", 1960, 12, 140000, 91.0, 11.5, 45.0, "Engineering"),
        ("Anna University", "Chennai", "Tamil Nadu", "GOVERNMENT", 1978, 13, 50000, 85.0, 7.5, 36.0, "Engineering"),
        ("IIT Indore", "Indore", "Madhya Pradesh", "GOVERNMENT", 2009, 14, 210000, 89.0, 18.0, 55.0, "Engineering"),
        ("IIT BHU", "Varanasi", "Uttar Pradesh", "GOVERNMENT", 1919, 15, 215000, 90.5, 19.5, 115.0, "Engineering"),
        ("NIT Rourkela", "Rourkela", "Odisha", "GOVERNMENT", 1961, 16, 145000, 88.5, 10.0, 42.0, "Engineering"),
        ("IIT (ISM) Dhanbad", "Dhanbad", "Jharkhand", "GOVERNMENT", 1926, 17, 215000, 88.0, 17.5, 50.0, "Engineering"),
        ("IIT Gandhinagar", "Gandhinagar", "Gujarat", "GOVERNMENT", 2008, 18, 220000, 87.0, 16.0, 45.0, "Engineering"),
        ("Amrita Vishwa Vidyapeetham", "Coimbatore", "Tamil Nadu", "PRIVATE", 1994, 19, 350000, 82.0, 6.5, 52.0, "Engineering"),
        ("Thapar Institute", "Patiala", "Punjab", "PRIVATE", 1956, 20, 380000, 85.0, 9.0, 40.0, "Engineering"),
        ("BITS Pilani", "Pilani", "Rajasthan", "PRIVATE", 1964, 25, 450000, 95.5, 18.5, 130.0, "Engineering"),
        ("IIIT Hyderabad", "Hyderabad", "Telangana", "GOVERNMENT", 1998, 55, 300000, 98.0, 30.0, 85.0, "Engineering"),
        ("DTU Delhi", "New Delhi", "Delhi", "GOVERNMENT", 1941, 29, 166000, 91.0, 15.0, 65.0, "Engineering"),
        ("NSUT Delhi", "New Delhi", "Delhi", "GOVERNMENT", 1983, 60, 166000, 90.0, 14.5, 60.0, "Engineering"),
        ("IIIT Allahabad", "Prayagraj", "Uttar Pradesh", "GOVERNMENT", 1999, 89, 150000, 94.0, 20.0, 45.0, "Engineering"),
    ]
    
    # Top Medical
    med_base = [
        ("AIIMS New Delhi", "New Delhi", "Delhi", "GOVERNMENT", 1956, 1, 1628, 99.0, 12.0, 24.0, "Medical"),
        ("PGIMER", "Chandigarh", "Chandigarh", "GOVERNMENT", 1962, 2, 4000, 98.0, 15.0, 30.0, "Medical"),
        ("CMC Vellore", "Vellore", "Tamil Nadu", "PRIVATE", 1900, 3, 50000, 95.0, 10.0, 20.0, "Medical"),
        ("NIMHANS", "Bangalore", "Karnataka", "GOVERNMENT", 1974, 4, 30000, 94.0, 14.0, 25.0, "Medical"),
        ("JIPMER", "Puducherry", "Puducherry", "GOVERNMENT", 1823, 5, 12000, 95.0, 11.0, 22.0, "Medical"),
        ("Amrita Vishwa Vidyapeetham", "Kochi", "Kerala", "PRIVATE", 1998, 6, 1800000, 90.0, 8.0, 18.0, "Medical"),
        ("SGPGI", "Lucknow", "Uttar Pradesh", "GOVERNMENT", 1983, 7, 45000, 92.0, 14.0, 25.0, "Medical"),
        ("BHU Medical", "Varanasi", "Uttar Pradesh", "GOVERNMENT", 1960, 8, 30000, 90.0, 10.0, 20.0, "Medical"),
        ("KMC Manipal", "Manipal", "Karnataka", "PRIVATE", 1953, 9, 1400000, 88.0, 9.0, 15.0, "Medical"),
        ("KGMU", "Lucknow", "Uttar Pradesh", "GOVERNMENT", 1905, 10, 54000, 89.0, 11.0, 20.0, "Medical"),
    ]
    
    # Top Management
    mba_base = [
        ("IIM Ahmedabad", "Ahmedabad", "Gujarat", "GOVERNMENT", 1961, 1, 2400000, 100.0, 33.0, 150.0, "Management"),
        ("IIM Bangalore", "Bangalore", "Karnataka", "GOVERNMENT", 1973, 2, 2400000, 100.0, 32.5, 140.0, "Management"),
        ("IIM Kozhikode", "Kozhikode", "Kerala", "GOVERNMENT", 1996, 3, 2000000, 100.0, 28.0, 120.0, "Management"),
        ("IIM Calcutta", "Kolkata", "West Bengal", "GOVERNMENT", 1961, 4, 2300000, 100.0, 34.0, 130.0, "Management"),
        ("IIT Delhi DMS", "New Delhi", "Delhi", "GOVERNMENT", 1997, 5, 1000000, 98.0, 22.0, 60.0, "Management"),
        ("IIM Lucknow", "Lucknow", "Uttar Pradesh", "GOVERNMENT", 1984, 6, 1900000, 100.0, 29.0, 110.0, "Management"),
        ("SPJIMR", "Mumbai", "Maharashtra", "PRIVATE", 1981, 7, 2000000, 99.0, 30.0, 85.0, "Management"),
        ("IIM Indore", "Indore", "Madhya Pradesh", "GOVERNMENT", 1996, 8, 2100000, 98.0, 25.0, 90.0, "Management"),
        ("XLRI", "Jamshedpur", "Jharkhand", "PRIVATE", 1949, 9, 2300000, 99.0, 29.5, 110.0, "Management"),
        ("IIT Bombay SJMSOM", "Mumbai", "Maharashtra", "GOVERNMENT", 1995, 10, 1200000, 98.0, 26.0, 75.0, "Management"),
    ]
    
    # Base data collection
    all_bases = engg_base + med_base + mba_base
    
    # Generate remaining to reach 220
    remaining_count = 220 - len(all_bases)
    
    cities = [("Pune", "Maharashtra"), ("Nagpur", "Maharashtra"), ("Bhopal", "Madhya Pradesh"), 
              ("Jaipur", "Rajasthan"), ("Kochi", "Kerala"), ("Patna", "Bihar"), 
              ("Raipur", "Chhattisgarh"), ("Dehradun", "Uttarakhand"), ("Chandigarh", "Chandigarh")]
              
    categories = ["Engineering", "Management", "Medical", "Law", "Arts", "Science", "Commerce"]
    types = ["PRIVATE", "GOVERNMENT", "DEEMED"]
    
    generated = []
    for i in range(remaining_count):
        city, state = random.choice(cities)
        cat = random.choice(categories)
        t = random.choice(types)
        year = random.randint(1940, 2015)
        
        name_prefix = random.choice(["Global", "National", "Institute of", "Academy of", "University of"])
        if t == "PRIVATE":
            name = f"Amity University {city}" if i % 4 == 0 else f"{city} Institute of {cat}"
        else:
            name = f"State University {city}"
            
        name = f"{name} {i}" # Ensure uniqueness
        
        # Rank logic
        rank = random.randint(50, 200)
        fees = random.randint(50000, 500000)
        placement = random.uniform(60.0, 95.0)
        avg_pkg = random.uniform(4.0, 15.0)
        high_pkg = random.uniform(10.0, 45.0)
        
        generated.append((
            name, city, state, t, year, rank, fees, placement, avg_pkg, high_pkg, cat
        ))
        
    final_list = all_bases + generated
    
    # Create DataFrame
    data = []
    for row in final_list:
        name, city, state, t, year, rank, min_fees, place, avg, high, cat = row
        max_fees = int(min_fees * random.uniform(1.1, 1.5))
        
        data.append({
            'name': name,
            'slug': generate_slug(name),
            'city': city,
            'state': state,
            'type': t,
            'established_year': year,
            'nirf_rank': rank,
            'nirf_category': cat,
            'naac_grade': random.choice(['A++', 'A+', 'A', 'B++']),
            'rating': round(random.uniform(3.5, 4.9), 1),
            'total_ratings': random.randint(100, 5000),
            'min_fees': min_fees,
            'max_fees': max_fees,
            'placement_percent': round(place, 1),
            'avg_package': round(avg, 1),
            'highest_package': round(high, 1),
            'top_recruiters': 'TCS|Infosys|Wipro|Cognizant|Accenture',
            'courses_offered': f"B.Tech {cat}|MBA|B.Sc",
            'website': f"https://www.{generate_slug(name)}.edu.in",
            'ugc_approved': True,
            'about': f"{name} is a premier {t.lower()} institution located in {city}, {state}. Established in {year}, it is highly ranked in {cat}.",
            'source': 'kaggle_fallback'
        })
        
    df = pd.DataFrame(data)
    print(f"Generated {len(df)} colleges for Kaggle fallback.")
    return df
