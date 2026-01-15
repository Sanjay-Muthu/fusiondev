import { useAuth0 } from "@auth0/auth0-react";
import { createClient } from "@supabase/supabase-js";

const API_URL = import.meta.env.VITE_API_URL;
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Message {
  userId: string;
  projectId: string;
  messageId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
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

    return data.map((p) => ({
      id: p.project_id,
      name: p.project_name,
      createdAt: new Date(p.created_at)
    }));
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
    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          user_id: userId,
          project_id: projectId,
          project_name: projectName
        }
      ]);
    
    if (error) {
      console.error("Failed to insert into Supabase", error)
      return false;
    }

    return true;
  }

  const deleteProject = async (projectId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from("projects")
      .delete()
      .eq("project_id", projectId)
      .eq("user_id", userId);
    
    if (error) {
      console.error("Failed to delete from Supabase", error)
      throw new Error(error.message);
    }

    return true;
  }

  const viewMessages = async (projectId: string, userId: string): Promise<Message[]> => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("user_id", userId)
      .eq("project_id", projectId);
    
    if (error) {
      console.error("Failed to read messages from Supabase", error)
      throw new Error(error.message);
    }

    return data.map((m) => ({
      userId: m.user_id,
      projectId: m.project_id,
      messageId: m.message_id,
      role: m.role,
      content: m.content,
      timestamp: new Date(m.sent_at)
    }));
  };

  const sendMessage = async (message: Message): Promise<Message> => {
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          user_id: message.userId,
          project_id: message.projectId,
          message_id: message.messageId,
          role: message.role,
          content: message.content,
          sent_at: message.timestamp
        }
      ])
      .select()
      .single();
    
      if (error) {
        console.error("Failed to insert message into Supabase", error)
        throw new Error(error.message);
      }

    return {
      userId: data.user_id,
      projectId: data.project_id,
      messageId: data.message_id,
      role: data.role,
      content: data.content,
      timestamp: new Date(data.sent_at)
    };
  }

  return {
    viewProjects,
    getProjectfromID,
    createProject,
    deleteProject,
    viewMessages,
    sendMessage,
  };
};
