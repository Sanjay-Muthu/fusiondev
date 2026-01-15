import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Sparkles, Loader2, GripVertical } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useProjectApi, Message, Project } from "@/hooks/useProjectApi";
import { useAuth0 } from "@auth0/auth0-react";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const userId = useAuth0().user?.sub.split("|")[1] || "";
  const navigate = useNavigate();
  const { sendMessage: apiSendMessage, getProjectfromID } = useProjectApi();
  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (projectId) {
        setProject(await getProjectfromID(projectId));
      }
    }

    fetchProject();
  }, [projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      userId: userId,
      projectId: projectId,
      messageId: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const resp = await apiSendMessage(userMessage);

    setMessages((prev) => [...prev, resp]);
    setIsLoading(false);
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm shrink-0">
        <div className="px-4 h-14 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/projects")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">{project.name}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Chat Panel */}
        <ResizablePanel defaultSize={50} minSize={30} maxSize={70}>
          <div className="h-full flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">
                    What would you like to build?
                  </h2>
                  <p className="text-muted-foreground max-w-md">
                    Describe your app idea, and I'll help you create it. You can ask
                    for features, layouts, functionality, and more.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <motion.div
                    key={message.messageId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "glass-card"
                      }`}
                    >
                      {message.content}
                    </div>
                  </motion.div>
                ))
              )}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="glass-card rounded-2xl px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Describe what you want to build..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 bg-background/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button
                  size="icon"
                  className="h-12 w-12 rounded-xl"
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </ResizablePanel>

        {/* Resizable Handle */}
        <ResizableHandle withHandle className="bg-border/50 hover:bg-primary/50 transition-colors">
          <div className="flex items-center justify-center h-full">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
        </ResizableHandle>

        {/* Preview Panel */}
        <ResizablePanel defaultSize={50} minSize={30} maxSize={70}>
          <div className="h-full bg-muted/30 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center px-8"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
                <div className="absolute inset-0 glow-orb opacity-30" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Preview Area</h3>
              <p className="text-muted-foreground max-w-sm">
                Your app preview will appear here once you start building. Send a
                message to get started!
              </p>
            </motion.div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProjectDetail;
