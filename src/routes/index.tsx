import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonStyles } from "@/components/ui/button";
import { DurationField } from "@/components/ui/duration-field";
import { useCreateTask, useImproveDescription } from "@/utils/tasks";
import { useProjects } from "@/projects/projects.service";
// import { Tag, TagGroup, TagList } from "@/components/ui";
import { motion, AnimatePresence } from "motion/react";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  // const typeOptions = ["Manual Review", "AI Pre-review"] as const;
  // const [type, setType] =
  //   useState<(typeof typeOptions)[number]>("Manual Review");
  const [description, setDescription] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");
  const [improvedDescription, setImprovedDescription] = useState("");
  const [duration, setDuration] = useState({ days: 0, hours: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [showUndo, setShowUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const createTask = useCreateTask();
  const improveDescription = useImproveDescription();
  const { data: projects, refetch: refetchProjects } = useProjects();
  // const handleTypeChange = (keys: Iterable<string>) => {
  //   const first = Array.from(keys)[0];
  //   if (first && typeOptions.includes(first as any)) {
  //     setType(first as (typeof typeOptions)[number]);
  //   }
  // };

  const handleImproveDescription = async () => {
    if (!description.trim() || isImproving) return;
    
    setOriginalDescription(description);
    setIsImproving(true);
    setShowUndo(false);
    
    try {
      const response = await improveDescription.mutateAsync({
        text: description.trim(),
      } as any);
      const improvedText = (response as any)?.result ?? (response as any)?.improvedDescription ?? "";
      if (improvedText) {
        setDescription(improvedText);
        setImprovedDescription(improvedText);
        setShowUndo(true);
        setCanRedo(false);
      }
    } catch (error) {
      console.error("Failed to improve description:", error);
    } finally {
      setIsImproving(false);
    }
  };

  const handleUndoImprovement = () => {
    setDescription(originalDescription);
    setShowUndo(false);
    setCanRedo(true);
  };

  const handleRedoImprovement = () => {
    if (!improvedDescription) return;
    setDescription(improvedDescription);
    setShowUndo(true);
    setCanRedo(false);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      // Convert duration to a readable format
      const timeLimit =
        duration.days > 0 || duration.hours > 0
          ? `${duration.days > 0 ? `${duration.days} day${duration.days > 1 ? "s" : ""}` : ""}${duration.days > 0 && duration.hours > 0 ? " " : ""}${duration.hours > 0 ? `${duration.hours} hour${duration.hours > 1 ? "s" : ""}` : ""}`.trim()
          : undefined;

      await createTask.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        timeLimit: timeLimit,
      });

      setTitle("");
      setDescription("");
      setDuration({ days: 0, hours: 0 });
      refetchProjects();
      navigate({ to: "/projects" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = title.trim().length > 0;
  const hasActiveProjects = projects && projects.length > 0;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      {hasActiveProjects && (
        <div className="mb-6 flex justify-end">
          <Link
            to="/projects"
            className={buttonStyles({
              intent: "primary",
              className: "inline-flex items-center gap-1 rounded-sm",
            })}
          >
            <span className="mr-2 font-medium">List of active projects</span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-white/20 text-white text-xs items-center justify-center font-semibold">
              {projects.length}
            </span>
          </Link>
        </div>
      )}
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
          <div className="relative">
            <Textarea
              aria-label="Description"
              placeholder="Describe your task in detail..."
              value={description}
              onChange={(v) => setDescription(String(v))}
              className={`text-primary leading-6 min-h-60 w-full transition-all duration-300 ${
                isImproving 
                  ? 'opacity-60 border-transparent' 
                  : ''
              }`}
              autoSize
              isDisabled={isImproving}
            />
            {isImproving && (
              <AnimatePresence>
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Animated border using mask */}
                  <motion.div
                    className="absolute inset-0 rounded border-2"
                    style={{
                      WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                      padding: 2,
                      background: "conic-gradient(from 0deg, rgba(59,130,246,0.6), rgba(168,85,247,0.6), rgba(236,72,153,0.6), rgba(59,130,246,0.6))",
                    } as React.CSSProperties}
                    transition={{ duration: 6, ease: "linear", repeat: Infinity }}
                  />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
          <div className="flex justify-end gap-2">
            {showUndo && (
              <>
                <Button
                  type="button"
                  intent="outline"
                  size="sm"
                  onPress={handleUndoImprovement}
                  className="animate-in fade-in-0 slide-in-from-right-2 duration-200"
                >
                  ↶ Undo
                </Button>
              </>
            )}
            {canRedo && (
              <Button
                type="button"
                intent="outline"
                size="sm"
                onPress={handleRedoImprovement}
                className="animate-in fade-in-0 slide-in-from-right-2 duration-200"
              >
                ↷ Redo
              </Button>
            )}
            <Button
              type="button"
              intent="outline"
              size="sm"
              onPress={handleImproveDescription}
              isDisabled={!description.trim() || isImproving}
              className="relative overflow-hidden"
            >
              <>
                <span className="relative z-10">✨ Improve with AI</span>
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-120%", "120%"] }}
                  transition={{ duration: 1.75, repeat: Infinity, ease: "easeInOut" }}
                />
              </>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {/* <TagGroup
            label="Submission Type"
            selectionMode="single"
            selectedKeys={new Set([type])}
            onSelectionChange={(keys) =>
              handleTypeChange(keys as Iterable<string>)
            }
          >
            <TagList aria-label="Submission type">
              {typeOptions.map((opt) => (
                <Tag id={opt} key={opt}>
                  {opt}
                </Tag>
              ))}
            </TagList>
          </TagGroup> */}
        </div>

        <DurationField
          label="Time to Complete"
          description="How long should this task take to complete?"
          value={duration}
          onChange={setDuration}
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
