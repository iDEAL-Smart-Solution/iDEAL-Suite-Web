export interface SystemConfiguration {
  id: string;
  key: string;
  value: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSystemConfigRequest {
  key: string;
  value: string;
  description?: string;
}

export interface UpdateSystemConfigRequest {
  value: string;
  description?: string;
}

export interface BulkCreateSystemConfigRequest {
  configurations: CreateSystemConfigRequest[];
}
