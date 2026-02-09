import { toast } from "@/hooks/use-toast";

const API_BASE_URL = "https://rotin-backend.onrender.com";

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    time?: string;
    day?: string;
    user_id?: string;
}

export interface ScheduleItem {
    id: string;
    time: string;
    title: string;
    duration: string;
    category: "work" | "personal" | "health" | "learning";
    completed?: boolean;
    day?: string;
    user_id?: string;
}

export interface Subject {
    id: string;
    title: string;
    content: string;
    updatedAt: number;
}

async function handleResponse(response: Response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Erro na requisição");
    }
    return response.json();
}

// --- TASKS ---
export async function fetchTasks(userId?: string): Promise<Task[]> {
    const query = userId ? `?user_id=${userId}` : "";
    const response = await fetch(`${API_BASE_URL}/tasks${query}`);
    return handleResponse(response);
}

export async function createTask(task: Task): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
    });
    return handleResponse(response);
}

export async function updateTask(id: string, task: Task): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
    });
    return handleResponse(response);
}

export async function deleteTask(id: string, userId?: string): Promise<void> {
    const query = userId ? `?user_id=${userId}` : "";
    const response = await fetch(`${API_BASE_URL}/tasks/${id}${query}`, {
        method: "DELETE",
    });
    await handleResponse(response);
}

// --- SCHEDULE ---
export async function fetchSchedule(userId?: string): Promise<ScheduleItem[]> {
    const query = userId ? `?user_id=${userId}` : "";
    const response = await fetch(`${API_BASE_URL}/schedule${query}`);
    return handleResponse(response);
}

export async function createScheduleItem(item: ScheduleItem): Promise<ScheduleItem> {
    const response = await fetch(`${API_BASE_URL}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
    });
    return handleResponse(response);
}

export async function updateScheduleItem(id: string, item: ScheduleItem): Promise<ScheduleItem> {
    const response = await fetch(`${API_BASE_URL}/schedule/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
    });
    return handleResponse(response);
}

export async function deleteScheduleItem(id: string, userId?: string): Promise<void> {
    const query = userId ? `?user_id=${userId}` : "";
    const response = await fetch(`${API_BASE_URL}/schedule/${id}${query}`, {
        method: "DELETE",
    });
    await handleResponse(response);
}

// --- SUBJECT NOTES ---
export async function fetchNotes(date: string, userId?: string): Promise<Subject[]> {
    const query = userId ? `?user_id=${userId}` : "";
    const response = await fetch(`${API_BASE_URL}/notes/${date}${query}`);
    return handleResponse(response);
}

export async function saveNotes(date: string, subjects: Subject[], userId?: string): Promise<Subject[]> {
    const query = userId ? `?user_id=${userId}` : "";
    const response = await fetch(`${API_BASE_URL}/notes/${date}${query}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subjects),
    });
    return handleResponse(response);
}
