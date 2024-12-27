export interface TaskCreatePayload {
  title: string,
  description: string,
}

export interface TaskUpdatePayload {
  title?: string,
  description?: string,
  status?: string,
}

export interface TaskResponse {
  _id: string,
  title: string,
  description: string,
  status: string,
  createdAt: string,
  by: {
    name: string,
  },
}
