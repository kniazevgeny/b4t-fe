import { createFileRoute, Link } from "@tanstack/react-router";
import { useTasks } from "@/utils/tasks";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
});

function TasksPage() {
  const { data: tasks, isLoading, error } = useTasks();

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-6">
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-destructive mb-2">
            Error loading tasks
          </h2>
          <p className="text-muted-foreground mb-4">
            {error.message}
          </p>
          <Link to="/">
            <Button intent="outline">Go back to create task</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No tasks found</h2>
          <p className="text-muted-foreground mb-4">
            You haven't created any tasks yet.
          </p>
          <Link to="/">
            <Button intent="primary">Create your first task</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Active Tasks</h1>
        <Link to="/">
          <Button intent="outline">Create New Task</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{task.title}</h3>
                {task.description && (
                  <p className="text-muted-foreground mb-3 whitespace-pre-wrap">
                    {task.description}
                  </p>
                )}
                {task.description && (
                  <p className="text-muted-foreground mb-3 whitespace-pre-wrap">
                    {task.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  {task.status && (
                    <span className="px-2 py-1 bg-muted rounded text-xs">
                      Status: {task.status}
                    </span>
                  )}
                  {task.timeLimit && (
                    <span className="px-2 py-1 bg-muted rounded text-xs">
                      Time Limit: {task.timeLimit}
                    </span>
                  )}
                  {task.createdAt && (
                    <span className="px-2 py-1 bg-muted rounded text-xs">
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
