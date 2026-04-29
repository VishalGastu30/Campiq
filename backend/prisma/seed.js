"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const baseColleges = [
    {
        name: 'IIT Madras - Indian Institute of Technology',
        slug: 'iit-madras',
        location: 'Chennai, Tamil Nadu',
        city: 'Chennai',
        state: 'Tamil Nadu',
        type: 'GOVERNMENT',
        establishedYear: 1959,
        rating: 4.8,
        totalRatings: 12450,
        minFees: 85000,
        maxFees: 220000,
        nirfRank: 1,
        naacGrade: 'A++',
        placementPercent: 97.5,
        avgPackage: 28.4,
        highestPackage: 2.1,
        topRecruiters: 'Google, Microsoft, Goldman Sachs, McKinsey',
        about: 'IIT Madras is one of the foremost institutes of national importance in higher technological education, basic and applied research. It has been ranked No.1 engineering institution in India by NIRF for several consecutive years.',
        website: 'https://www.iitm.ac.in',
        phone: '+91 44 2257 8000',
        email: 'info@iitm.ac.in',
        address: 'IIT P.O., Chennai 600 036, India',
        ugcApproved: true,
        aiuMember: true,
        courses: [
            { name: 'B.Tech Computer Science and Engineering', degree: 'B.Tech', duration: 4, fees: 215000, seats: 87, category: 'Engineering', eligibility: 'JEE Advanced' },
            { name: 'B.Tech Electrical Engineering', degree: 'B.Tech', duration: 4, fees: 215000, seats: 120, category: 'Engineering', eligibility: 'JEE Advanced' },
            { name: 'M.Tech Data Science', degree: 'M.Tech', duration: 2, fees: 85000, seats: 45, category: 'Engineering', eligibility: 'GATE' }
        ]
    },
    {
        name: 'IIT Bombay - Indian Institute of Technology',
        slug: 'iit-bombay',
        location: 'Mumbai, Maharashtra',
        city: 'Mumbai',
        state: 'Maharashtra',
        type: 'GOVERNMENT',
        establishedYear: 1958,
        rating: 4.9,
        totalRatings: 14200,
        minFees: 90000,
        maxFees: 230000,
        nirfRank: 3,
        naacGrade: 'A++',
        placementPercent: 96.8,
        avgPackage: 30.2,
        highestPackage: 3.6,
        topRecruiters: 'Apple, Microsoft, Optiver, Tower Research',
        about: 'IIT Bombay is a public technical and research university located in Powai, Mumbai. It is globally recognized as a leader in the field of engineering education and research.',
        website: 'https://www.iitb.ac.in',
        phone: '+91 22 2572 2545',
        email: 'pro@iitb.ac.in',
        address: 'Main Gate Rd, IIT Area, Powai, Mumbai, Maharashtra 400076',
        ugcApproved: true,
        aiuMember: true,
        courses: [
            { name: 'B.Tech Computer Science and Engineering', degree: 'B.Tech', duration: 4, fees: 230000, seats: 145, category: 'Engineering', eligibility: 'JEE Advanced' },
            { name: 'B.Tech Mechanical Engineering', degree: 'B.Tech', duration: 4, fees: 230000, seats: 160, category: 'Engineering', eligibility: 'JEE Advanced' }
        ]
    },
    {
        name: 'IISc Bangalore - Indian Institute of Science',
        slug: 'iisc-bangalore',
        location: 'Bangalore, Karnataka',
        city: 'Bangalore',
        state: 'Karnataka',
        type: 'GOVERNMENT',
        establishedYear: 1909,
        rating: 4.9,
        totalRatings: 8500,
        minFees: 35000,
        maxFees: 120000,
        nirfRank: 2,
        naacGrade: 'A++',
        placementPercent: 99.0,
        avgPackage: 32.0,
        highestPackage: 1.8,
        topRecruiters: 'Intel, IBM Research, Amazon, TCS Research',
        about: 'The Indian Institute of Science is a public, deemed, research university for higher education and research in science, engineering, design, and management. It is considered one of the most prestigious academic institutions in India.',
        website: 'https://iisc.ac.in',
        phone: '+91 80 2293 2004',
        email: 'registrar@iisc.ac.in',
        address: 'CV Raman Rd, Bengaluru, Karnataka 560012',
        ugcApproved: true,
        aiuMember: true,
        courses: [
            { name: 'B.Sc (Research) Physics', degree: 'B.Sc', duration: 4, fees: 35000, seats: 120, category: 'Science', eligibility: 'JEE Main/NEET/KVPY' },
            { name: 'M.Tech Artificial Intelligence', degree: 'M.Tech', duration: 2, fees: 85000, seats: 40, category: 'Engineering', eligibility: 'GATE' }
        ]
    },
    {
        name: 'BITS Pilani - Birla Institute of Technology and Science',
        slug: 'bits-pilani',
        location: 'Pilani, Rajasthan',
        city: 'Pilani',
        state: 'Rajasthan',
        type: 'DEEMED',
        establishedYear: 1964,
        rating: 4.6,
        totalRatings: 11200,
        minFees: 450000,
        maxFees: 550000,
        nirfRank: 20,
        naacGrade: 'A',
        placementPercent: 95.5,
        avgPackage: 18.5,
        highestPackage: 1.3,
        topRecruiters: 'Qualcomm, Cisco, Oracle, J.P. Morgan',
        about: 'BITS Pilani is a private deemed university and an institute of eminence. It is one of the premier engineering and science institutes in India with campuses in Pilani, Goa, Hyderabad, and Dubai.',
        website: 'https://www.bits-pilani.ac.in',
        courses: [
            { name: 'B.E. Computer Science', degree: 'B.E.', duration: 4, fees: 550000, seats: 200, category: 'Engineering', eligibility: 'BITSAT' },
            { name: 'B.E. Electronics & Instrumentation', degree: 'B.E.', duration: 4, fees: 550000, seats: 150, category: 'Engineering', eligibility: 'BITSAT' }
        ]
    },
    {
        name: 'VIT Vellore - Vellore Institute of Technology',
        slug: 'vit-vellore',
        location: 'Vellore, Tamil Nadu',
        city: 'Vellore',
        state: 'Tamil Nadu',
        type: 'PRIVATE',
        establishedYear: 1984,
        rating: 4.1,
        totalRatings: 25000,
        minFees: 198000,
        maxFees: 495000,
        nirfRank: 11,
        naacGrade: 'A++',
        placementPercent: 88.0,
        avgPackage: 8.5,
        highestPackage: 1.02,
        topRecruiters: 'TCS, Infosys, Wipro, Cognizant, Microsoft',
        about: 'Vellore Institute of Technology is a private deemed university located in Vellore, Tamil Nadu.',
        website: 'https://vit.ac.in',
        courses: [
            { name: 'B.Tech Computer Science (Core)', degree: 'B.Tech', duration: 4, fees: 198000, seats: 1200, category: 'Engineering', eligibility: 'VITEEE' },
            { name: 'B.Tech Information Technology', degree: 'B.Tech', duration: 4, fees: 198000, seats: 600, category: 'Engineering', eligibility: 'VITEEE' }
        ]
    },
    {
        name: 'IIM Ahmedabad - Indian Institute of Management',
        slug: 'iim-ahmedabad',
        location: 'Ahmedabad, Gujarat',
        city: 'Ahmedabad',
        state: 'Gujarat',
        type: 'GOVERNMENT',
        establishedYear: 1961,
        rating: 4.9,
        totalRatings: 6700,
        minFees: 1200000,
        maxFees: 2400000,
        nirfRank: 1,
        naacGrade: 'A++',
        placementPercent: 100.0,
        avgPackage: 33.0,
        highestPackage: 1.5,
        topRecruiters: 'BCG, McKinsey, Bain & Company, Goldman Sachs',
        about: 'The Indian Institute of Management Ahmedabad is a business school located in Ahmedabad, Gujarat, India.',
        website: 'https://www.iima.ac.in',
        courses: [
            { name: 'Post Graduate Programme in Management (PGP)', degree: 'MBA', duration: 2, fees: 2400000, seats: 400, category: 'Management', eligibility: 'CAT' }
        ]
    },
    {
        name: 'NIT Trichy - National Institute of Technology',
        slug: 'nit-trichy',
        location: 'Tiruchirappalli, Tamil Nadu',
        city: 'Tiruchirappalli',
        state: 'Tamil Nadu',
        type: 'GOVERNMENT',
        establishedYear: 1964,
        rating: 4.4,
        totalRatings: 8900,
        minFees: 75000,
        maxFees: 150000,
        nirfRank: 9,
        naacGrade: 'A+',
        placementPercent: 92.5,
        avgPackage: 12.5,
        highestPackage: 0.5,
        topRecruiters: 'Texas Instruments, Qualcomm, Google, Tata Motors',
        about: 'National Institute of Technology Tiruchirappalli is a public technical and research university near the city of Tiruchirappalli in Tamil Nadu, India.',
        website: 'https://www.nitt.edu',
        courses: [
            { name: 'B.Tech Computer Science and Engineering', degree: 'B.Tech', duration: 4, fees: 150000, seats: 120, category: 'Engineering', eligibility: 'JEE Main' }
        ]
    },
    {
        name: 'SRM Institute of Science and Technology',
        slug: 'srm-ist-chennai',
        location: 'Chennai, Tamil Nadu',
        city: 'Chennai',
        state: 'Tamil Nadu',
        type: 'PRIVATE',
        establishedYear: 1985,
        rating: 3.9,
        totalRatings: 18000,
        minFees: 250000,
        maxFees: 450000,
        nirfRank: 19,
        naacGrade: 'A++',
        placementPercent: 85.0,
        avgPackage: 7.5,
        highestPackage: 0.45,
        topRecruiters: 'Cognizant, TCS, Wipro, Capgemini',
        about: 'SRM Institute of Science and Technology is a top-ranking deemed university in India.',
        website: 'https://www.srmist.edu.in',
        courses: [
            { name: 'B.Tech Computer Science', degree: 'B.Tech', duration: 4, fees: 450000, seats: 1500, category: 'Engineering', eligibility: 'SRMJEEE' }
        ]
    },
    {
        name: 'Delhi Technological University (DTU)',
        slug: 'dtu-delhi',
        location: 'New Delhi, Delhi',
        city: 'New Delhi',
        state: 'Delhi',
        type: 'GOVERNMENT',
        establishedYear: 1941,
        rating: 4.3,
        totalRatings: 10500,
        minFees: 166000,
        maxFees: 219000,
        nirfRank: 29,
        naacGrade: 'A',
        placementPercent: 91.0,
        avgPackage: 15.0,
        highestPackage: 0.65,
        topRecruiters: 'Apple, Microsoft, Google, Amazon',
        about: 'Delhi Technological University is a state university located in Rohini, Delhi.',
        website: 'http://www.dtu.ac.in',
        courses: [
            { name: 'B.Tech Computer Engineering', degree: 'B.Tech', duration: 4, fees: 219000, seats: 360, category: 'Engineering', eligibility: 'JEE Main' }
        ]
    },
    {
        name: 'Manipal Institute of Technology',
        slug: 'mit-manipal',
        location: 'Manipal, Karnataka',
        city: 'Manipal',
        state: 'Karnataka',
        type: 'PRIVATE',
        establishedYear: 1957,
        rating: 4.2,
        totalRatings: 13000,
        minFees: 335000,
        maxFees: 460000,
        nirfRank: 55,
        naacGrade: 'A++',
        placementPercent: 88.5,
        avgPackage: 10.5,
        highestPackage: 0.44,
        topRecruiters: 'Deloitte, Accenture, Microsoft, L&T',
        about: 'Manipal Institute of Technology is a private engineering institute located in Manipal, Karnataka.',
        website: 'https://manipal.edu/mit.html',
        courses: [
            { name: 'B.Tech Computer Science', degree: 'B.Tech', duration: 4, fees: 460000, seats: 240, category: 'Engineering', eligibility: 'MET' }
        ]
    }
];
const generatedColleges = Array.from({ length: 65 }).map((_, i) => {
    const isGov = i % 3 === 0;
    const states = ['Maharashtra', 'Delhi', 'Uttar Pradesh', 'West Bengal', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Rajasthan'];
    const cities = ['Pune', 'New Delhi', 'Lucknow', 'Kolkata', 'Ahmedabad', 'Bangalore', 'Chennai', 'Jaipur'];
    const types = ['PRIVATE', 'GOVERNMENT', 'DEEMED', 'AUTONOMOUS'];
    const stateIndex = i % states.length;
    const state = states[stateIndex];
    const city = cities[stateIndex];
    return {
        name: `${isGov ? 'National' : 'Global'} Institute of Technology ${i + 11}`,
        slug: `institute-tech-${i + 11}`,
        location: `${city}, ${state}`,
        city,
        state,
        type: types[i % types.length],
        establishedYear: 1950 + (i % 70),
        rating: parseFloat((3.5 + (i % 15) / 10).toFixed(1)),
        totalRatings: 500 + (i * 100),
        minFees: 50000 + (i * 10000),
        maxFees: 100000 + (i * 15000),
        nirfRank: i + 60,
        naacGrade: i % 2 === 0 ? 'A+' : 'A',
        placementPercent: 75 + (i % 20),
        avgPackage: 5 + (i % 10),
        highestPackage: 0.3 + (i % 5) / 10,
        topRecruiters: 'TCS, Infosys, Wipro, IBM',
        about: `A premier institute for higher education located in ${city}, offering various undergraduate and postgraduate programs.`,
        website: `https://www.institute${i + 11}.edu.in`,
        courses: [
            { name: 'B.Tech Computer Science', degree: 'B.Tech', duration: 4, fees: 100000, seats: 120, category: 'Engineering', eligibility: 'Entrance Exam' },
            { name: 'MBA General', degree: 'MBA', duration: 2, fees: 150000, seats: 60, category: 'Management', eligibility: 'CAT/MAT' }
        ]
    };
});
async function main() {
    console.log('Clearing database...');
    await prisma.course.deleteMany();
    await prisma.savedCollege.deleteMany();
    await prisma.college.deleteMany();
    await prisma.user.deleteMany();
    console.log('Seeding Demo User...');
    const passwordHash = await bcryptjs_1.default.hash('DemoPass123', 10);
    await prisma.user.create({
        data: {
            name: 'Demo User',
            email: 'demo@campiq.in',
            password: passwordHash
        }
    });
    const allColleges = [...baseColleges, ...generatedColleges];
    console.log(`Seeding ${allColleges.length} colleges...`);
    for (const c of allColleges) {
        const { courses, ...collegeData } = c;
        await prisma.college.create({
            data: {
                ...collegeData,
                courses: {
                    create: courses
                }
            }
        });
    }
    console.log('Seeding finished successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
