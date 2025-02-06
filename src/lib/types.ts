export interface User {
    email: string;
    password: string;
    role: 'student' | 'startup';
    firstName?: string;
    lastName?: string;
    school?: string;
    graduationYear?: string;
    location?: string;
    companyName?: string;
    companySize?: string;
  }