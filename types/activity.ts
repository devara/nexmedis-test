export interface UserActivity {
  description: string,
  by: {
    name: string,
  },
  type: 'USER' | 'TASK',
  createdAt: string,
}
