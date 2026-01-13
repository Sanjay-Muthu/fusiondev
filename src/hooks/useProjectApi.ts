const PLACEHOLDER_API_URL = "https://api.placeholder.example.com";

interface ApiPayload {
  type: "project_created" | "project_deleted" | "message_sent";
  projectId?: string;
  projectName?: string;
  messageContent?: string;
  timestamp: string;
}

export const useProjectApi = () => {
  const callApi = async (payload: ApiPayload) => {
    try {
      console.log("API Call:", payload);
      
      // Placeholder API call - replace URL with your actual endpoint
      const response = await fetch(PLACEHOLDER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      // Log response for debugging (will fail with placeholder URL)
      console.log("API Response status:", response.status);
      return response;
    } catch (error) {
      // Expected to fail with placeholder URL - log for debugging
      console.log("API call attempted (placeholder URL):", payload);
      return null;
    }
  };

  const onProjectCreated = (projectId: string, projectName: string) => {
    return callApi({
      type: "project_created",
      projectId,
      projectName,
      timestamp: new Date().toISOString(),
    });
  };

  const onProjectDeleted = (projectId: string) => {
    return callApi({
      type: "project_deleted",
      projectId,
      timestamp: new Date().toISOString(),
    });
  };

  const onMessageSent = (projectId: string, messageContent: string) => {
    return callApi({
      type: "message_sent",
      projectId,
      messageContent,
      timestamp: new Date().toISOString(),
    });
  };

  return {
    onProjectCreated,
    onProjectDeleted,
    onMessageSent,
  };
};
