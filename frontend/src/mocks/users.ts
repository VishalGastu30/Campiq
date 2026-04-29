import { User, SavedCollege } from '@/types';
import { colleges } from './colleges';

export const users = [
  {
    id: 'u_1',
    name: 'Vishal Gupta',
    email: 'vishal@campiq.in',
    password: 'Campus@2026' // Plain text for mock purposes
  },
  {
    id: 'u_2',
    name: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    password: 'Priya#Secure1'
  },
  {
    id: 'u_3',
    name: 'Demo User',
    email: 'demo@campiq.in',
    password: 'DemoPass123'
  }
];

// Initialize mock saved colleges mapping
// In a real app this is in the DB
export const mockSavedColleges: Record<string, SavedCollege[]> = {
  'u_1': [
    { id: 's_1', collegeId: 'c_1', savedAt: new Date().toISOString(), college: colleges.find(c => c.id === 'c_1')! },
    { id: 's_2', collegeId: 'c_3', savedAt: new Date().toISOString(), college: colleges.find(c => c.id === 'c_3')! },
    { id: 's_3', collegeId: 'c_4', savedAt: new Date().toISOString(), college: colleges.find(c => c.id === 'c_4')! },
    { id: 's_4', collegeId: 'c_7', savedAt: new Date().toISOString(), college: colleges.find(c => c.id === 'c_7')! },
    { id: 's_5', collegeId: 'c_10', savedAt: new Date().toISOString(), college: colleges.find(c => c.id === 'c_10')! },
  ],
  'u_2': [
    { id: 's_6', collegeId: 'c_2', savedAt: new Date().toISOString(), college: colleges.find(c => c.id === 'c_2')! },
    { id: 's_7', collegeId: 'c_5', savedAt: new Date().toISOString(), college: colleges.find(c => c.id === 'c_5')! },
  ],
  'u_3': []
};
