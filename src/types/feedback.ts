export type Feedback = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  schoolId: string;
  schoolName?: string;
  productId?: string;
  productName?: string;
  rating: number;
  subject: string;
  message: string;
  category?: string;
  status?: "pending" | "reviewed" | "resolved";
  createdAt: string;
  updatedAt?: string;
};

export type GetFeedbackResponse = {
  data: Feedback[];
  total: number;
  page: number;
  limit: number;
};
