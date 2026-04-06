export type Student = {
  schoolName: string;
  uin: string;
  firstName: string;
  lastName: string;
  middleName: string;
  gender: string;
  email: string;
  dateOfBirth: string;
  className: string;
  phoneNumber: string;
  sourceSystem?: string;
};

export type GetStudentsResponse = {
  data?: Student[];
  students?: Student[];
  message?: string;
  statusCode?: number;
};
