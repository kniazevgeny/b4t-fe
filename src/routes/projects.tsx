import { createFileRoute, Link } from "@tanstack/react-router";
import { useProjects } from "@/projects/projects.service";
import { Button, Loader, Badge } from "@/components/ui";
import type { Project, Task } from "@/utils/types";
import { buttonStyles } from "@/components/ui/button";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-destructive mb-2">
            Error loading projects
          </h2>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Link to="/">
            <Button intent="outline">Go back to create task</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No tasks found</h2>
          <p className="text-muted-foreground mb-4">
            You haven't created any tasks yet.
          </p>
          <Link to="/" className={buttonStyles({ intent: "primary" })}>
            Create your first task
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Link to="/" className={buttonStyles({ intent: "outline" })}>
          Create New Task
        </Link>
      </div>

      <div className="space-y-6">
        {projects.map((project) => {
          const tasks = project.tasks || [];

          if (tasks.length === 0) {
            return null; // Skip projects with no tasks
          }

          if (tasks.length === 1) {
            // Single task: hide project wrapper, show just the task
            return (
              <TaskCard
                key={`${project.id}-${tasks[0].id}`}
                task={tasks[0]}
                project={project}
                showProjectInfo={true}
              />
            );
          }

          // Multiple tasks: show access code in first task and chain tasks
          return (
            <div key={project.id} className="space-y-3">
              {tasks.map((task, index) => (
                <TaskCard
                  key={`${project.id}-${task.id}`}
                  task={task}
                  project={project}
                  showProjectInfo={index === 0} // Show project info only in first task
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TaskCard({
  task,
  project,
  showProjectInfo,
}: {
  task: Task;
  project: Project;
  showProjectInfo: boolean;
}) {
  return (
    <div className="border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors">
      {/* Project info (access code, client) - only shown in first task of chain */}
      {showProjectInfo && (
        <div className="mb-4 pb-3 border-b">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              Invite Link:
              <a
                href={`https://t.me/scout_test_task_bot?start=${project.accessCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 bg-primary px-2 py-1 rounded text-xs font-mono text-white hover:bg-muted/80 transition-colors"
              >
                {`https://t.me/scout_test_task_bot?start=${project.accessCode}`}
              </a>
            </span>
            {project.finalDate && (
              <span>
                Due: {new Date(project.finalDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Task content */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">{task.title}</h3>
          {task.description && (
            <p className="text-muted-foreground mb-3 whitespace-pre-wrap max-h-[300px] overflow-y-auto">
              {task.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2 text-sm">
            {task.status && (
              <Badge variant="outline">Status: {task.status}</Badge>
            )}
            {task.timeLimit && (
              <Badge variant="outline">Time Limit: {task.timeLimit}</Badge>
            )}
            {task.createdAt && (
              <Badge variant="outline">
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
