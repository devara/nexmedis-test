export interface TaskCreatePayload {
  title: string,
  description: string,
}

export interface TaskUpdatePayload {
  title?: string,
  description?: string,
  status?: string,
}

export type TaskStatus = 'DONE' | 'HOLD' | 'ONGOING' | 'CANCEL'

export interface UserTask {
  _id: string,
  title: string,
  description: string,
  status: TaskStatus,
  createdAt: string,
  by: {
    name: string,
  },
}
