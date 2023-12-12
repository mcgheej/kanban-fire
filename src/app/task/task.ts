export interface Task {
  id?: string;
  title: string;
  description: string;
}

export const copyTaskWithoutId = (task: Task): Omit<Task, 'id'> => {
  const { id, ...withoutId } = task;
  return withoutId;
};
