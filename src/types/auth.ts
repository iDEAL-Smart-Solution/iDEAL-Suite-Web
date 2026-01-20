// Role hierarchy: 0 = Dev/Platform Admin, 1 = School Admin, 2 = Staff, 3 = Student

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: number;
    schoolId?: string; // Optional - devs don't have schoolId
  };
}
