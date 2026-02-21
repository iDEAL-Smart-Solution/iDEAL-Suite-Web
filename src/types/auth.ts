// Role hierarchy: 0 = Dev/Platform Admin, 1 = School Admin, 2 = Staff, 3 = Student
// Role mapping: Dev = 0, SchoolAdmin = 1, Staff = 2, Student = 3

export interface LoginRequest {
  email: string;
  password: string;
}

export interface BackendLoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    userId: string;
    uin: string;
    fullName: string;
    email: string;
    role: string; // "Dev", "SchoolAdmin", "Staff", "Student"
    schoolId: string;
  };
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: number;
    schoolId?: string;
    fullName?: string;
    uin?: string;
  };
}
