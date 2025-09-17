import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TextField } from "@/components/ui/text-field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TagGroup, TagList, Tag } from "@/components/ui/tag-group";
import { useCreateTask } from "@/utils/tasks";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const [title, setTitle] = useState("");
  const typeOptions = [
    "Frontend Challenge",
    "Backend Challenge", 
    "Full-stack Project",
    "Algorithm/Data Structure",
    "System Design",
    "Code Review",
  ] as const;
  const [type, setType] =
    useState<(typeof typeOptions)[number]>("Frontend Challenge");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createTask = useCreateTask();

  const handleTypeChange = (keys: Iterable<string>) => {
    const first = Array.from(keys)[0];
    if (first && typeOptions.includes(first as any)) {
      setType(first as (typeof typeOptions)[number]);
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      await createTask.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        timeLimit: deadline || undefined,
      });
      setTitle("");
      setDescription("");
      setDeadline("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = title.trim().length > 0;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Textarea
          aria-label="Title"
          placeholder="Title"
          value={title}
          onChange={(v) => setTitle(String(v))}
          onBlur={() => setTitle(title)}
          className="min-h-21 text-2xl font-medium leading-7 w-full"
          autoSize
          errorMessage={!isValid ? "Title is required" : undefined}
          isRequired
        />

        <div className="flex flex-col gap-2">
          <TagGroup
            label="Type"
            selectionMode="single"
            selectedKeys={new Set([type])}
            onSelectionChange={(keys) =>
              handleTypeChange(keys as Iterable<string>)
            }
          >
            <TagList aria-label="Request type">
              {typeOptions.map((opt) => (
                <Tag id={opt} key={opt}>
                  {opt}
                </Tag>
              ))}
            </TagList>
          </TagGroup>
        </div>

        <div className="p-4 bg-muted rounded">
          <h3 className="font-medium mb-2">
            How to write a good task description:
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              • <strong>Goal:</strong> What should be achieved?
            </li>
            <li>
              • <strong>Context:</strong> Background, dataset, or problem domain
            </li>
            <li>
              • <strong>Tasks:</strong> Specific deliverables or steps
            </li>
            <li>
              • <strong>Requirements:</strong> Technical constraints, tools,
              frameworks
            </li>
            <li>
              • <strong>Success criteria:</strong> How will it be evaluated?
            </li>
            <li>
              • <strong>Optional extras:</strong> Nice-to-have features
            </li>
            <li>
              • <strong>References:</strong> Links to examples or inspiration
            </li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2">
            Keep it clear, actionable, and include all necessary details for
            implementation.
          </p>
        </div>

        <div className="space-y-2">
          <Textarea
            aria-label="Description"
            placeholder="Describe your task in detail..."
            value={description}
            onChange={(v) => setDescription(String(v))}
            className="text-primary leading-6 min-h-60 w-full"
            autoSize
          />
          <div className="flex justify-end">
            <Button
              type="button"
              intent="outline"
              size="sm"
              onPress={() => {
                // TODO: Implement AI improvement
                console.log('Improve with AI clicked');
              }}
            >
              ✨ Improve with AI
            </Button>
          </div>
        </div>

        <TextField
          aria-label="Deadline"
          type="date"
          label="Deadline"
          value={deadline}
          onChange={(v) => setDeadline(String(v))}
        />

        <div className="pt-2">
          <Button
            type="submit"
            intent="primary"
            size="lg"
            isDisabled={!isValid || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Submitting…" : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
