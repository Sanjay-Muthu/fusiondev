import ProjectDetail from "@/pages/ProjectDetail";
import { useAuth0 } from "@auth0/auth0-react";
import { createClient } from "@supabase/supabase-js";

const API_URL = import.meta.env.VITE_API_URL;
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
}

export const useProjectApi = () => {
  const { user } = useAuth0();
  const userId = user?.sub.split("|")[1] || "";

  const viewProjects = async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
    
    if (error) {
      console.error("Failed to read from Supabase", error)
      throw new Error(error.message);
    }

    return data.map((p) => ({id: p.project_id,
      name: p.project_name,
      createdAt: new Date(p.created_at)}));
  };

  const getProjectfromID = async (projectID: string): Promise<Project> => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("project_id", projectID)
      .single();
    
    if (error) {
      console.error("Failed to read from Supabase", error)
      throw new Error(error.message);
    }

    return {
      id: data.project_id,
      name: data.project_name,
      createdAt: new Date(data.created_at)
    };
  }

  const createProject = async (projectId: string, projectName: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/create_project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: projectId,
          project_name: projectName,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create project: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  };

  const deleteProject = async (projectId: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/delete_project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: projectId,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete project: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  };

  const sendMessage = async (projectId: string, messageContent: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/message_sent`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: projectId,
          message_content: messageContent,
          user_id: userId,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    }
  };

  return {
    viewProjects,
    getProjectfromID,
    createProject,
    deleteProject,
    sendMessage,
  };
};
