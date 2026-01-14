import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ArrowRight, Sparkles, FolderOpen, Loader2 } from "lucide-react";
import { useProjectApi, Project } from "@/hooks/useProjectApi";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const ProjectSkeleton = () => (
  <div className="glass-card p-6 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <Skeleton className="w-10 h-10 rounded-lg" />
      <div>
        <Skeleton className="h-5 w-40 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    <Skeleton className="w-5 h-5" />
  </div>
);

const Projects = () => {
  const navigate = useNavigate();
  const { viewProjects, createProject, deleteProject } = useProjectApi();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedProjects = await viewProjects();
        setProjects(fetchedProjects);
      } catch (err) {
        setError("Failed to load projects. Please try again.");
        toast.error("Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    const projectId = crypto.randomUUID();
    const projectName = newProjectName.trim();

    setIsSubmitting(true);

    try {
      await createProject(projectId, projectName);
      
      const newProject: Project = {
        id: projectId,
        name: projectName,
        createdAt: new Date(),
      };

      setProjects([newProject, ...projects]);
      setNewProjectName("");
      setIsCreating(false);
      toast.success("Project created successfully!");
    } catch (err) {
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
      toast.success("Project deleted");
    } catch (err) {
      toast.error("Failed to delete project");
    }
  };

  const openProject = (id: string) => {
    navigate(`/projects/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container px-4 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">Fusion Dev</span>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-4xl font-bold mb-2">Your Projects</h1>
            <p className="text-muted-foreground">
              Create and manage your AI-powered projects
            </p>
          </motion.div>

          {/* Create Project */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            {isCreating ? (
              <div className="glass-card p-6 flex gap-4">
                <input
                  type="text"
                  placeholder="Project name..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !isSubmitting && handleCreateProject()}
                  autoFocus
                  disabled={isSubmitting}
                  className="flex-1 bg-background/50 border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                />
                <Button onClick={handleCreateProject} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </Button>
                <Button variant="ghost" onClick={() => setIsCreating(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setIsCreating(true)}
                className="w-full glass-card p-6 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all group"
              >
                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Create New Project</span>
              </button>
            )}
          </motion.div>

          {/* Projects List */}
          <div className="space-y-4">
            {isLoading ? (
              // Loading skeletons
              <>
                <ProjectSkeleton />
                <ProjectSkeleton />
                <ProjectSkeleton />
              </>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </motion.div>
            ) : projects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center py-16"
              >
                <FolderOpen className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first project to get started
                </p>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </motion.div>
            ) : (
              projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  onClick={() => openProject(project.id)}
                  className="glass-card p-6 flex items-center justify-between cursor-pointer hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Created {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDeleteProject(project.id, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Projects;
