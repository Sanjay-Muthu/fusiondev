import { useAuth0 } from "@auth0/auth0-react";

const API_URL = "https://ideal-garbanzo-6p5q4j4x97p3wpq-5000.app.github.dev/api";

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
}

interface ViewProjectsResponse {
  projects: Project[];
}

export const useProjectApi = () => {
  const { user } = useAuth0();
  const userId = user?.sub.split("|")[1] || "";

  const viewProjects = async (): Promise<Project[]> => {
    try {
      const response = await fetch(`${API_URL}/view_projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`);
      }

      const data: ViewProjectsResponse = await response.json();
      return data.projects.map((p) => ({
        ...p,
        createdAt: new Date(p.createdAt),
      }));
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  };

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
        method: "POST",
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
    createProject,
    deleteProject,
    sendMessage,
  };
};
