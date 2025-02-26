import client from "../utils/client";

type TaskOption = {
  title: string;
  description: string;
};

export async function getAllTask() {
  const { data } = await client.get<any>("/v1/tasks");
  return data.data;
}

export async function getTaskByID(id: any) {
  const { data } = await client.get<any>(`/v1/tasks/${id}`);
  return data.data;
}

export async function updateTask(id: any, options: TaskOption) {
  const { data } = await client.put<any>(`/v1/tasks/${id}`, options);
  return data.data;
}

export async function deleteTask(id: any) {
  const { data } = await client.delete<any>(`/v1/tasks/${id}`);
  return data;
}

export async function createTask(options: TaskOption) {
  const { data } = await client.post<any>("/v1/tasks", options);
  return data;
}
