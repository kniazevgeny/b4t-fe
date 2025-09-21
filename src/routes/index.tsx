import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonStyles } from "@/components/ui/button";
import { DurationField } from "@/components/ui/duration-field";
import {
  useCreateTask,
  useImproveDescription,
  useRefineQuiz,
} from "@/utils/tasks";
import { useProjects } from "@/projects/projects.service";
import { Tag, TagGroup, TagList, QuizBlock, QcmBlock } from "@/components/ui";
import type { QcmOptionDefinition, QcmSelectionState } from "@/components/ui";
import type { AjtbdSuggestion } from "@/utils/types";
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
  const [duration, setDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [showUndo, setShowUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  // input mode
  const [mode, setMode] = useState<"quiz" | "manual">("quiz");
  // quiz states
  const [problem, setProblem] = useState("");
  const [contextText, setContextText] = useState("");
  const [outcomesText, setOutcomesText] = useState("");
  const [showQcm, setShowQcm] = useState(false);
  const refineQuiz = useRefineQuiz();
  const [qcmProblemOptions, setQcmProblemOptions] = useState<
    QcmOptionDefinition[]
  >([]);
  const [qcmContextOptions, setQcmContextOptions] = useState<
    QcmOptionDefinition[]
  >([]);
  const [qcmOutcomesOptions, setQcmOutcomesOptions] = useState<
    QcmOptionDefinition[]
  >([]);
  const [qcmProblemState, setQcmProblemState] = useState<QcmSelectionState>({
    selectedId: null,
    fieldValues: {},
    otherText: "",
  });
  const [qcmContextState, setQcmContextState] = useState<QcmSelectionState>({
    selectedId: null,
    fieldValues: {},
    otherText: "",
  });
  const [qcmOutcomesState, setQcmOutcomesState] = useState<QcmSelectionState>({
    selectedId: null,
    fieldValues: {},
    otherText: "",
  });

  const [evaluation, setEvaluation] = useState<
    "manual" | "expert" | "expert_interview"
  >("manual");
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
      const improvedText =
        (response as any)?.result ??
        (response as any)?.improvedDescription ??
        "";
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
      // Convert duration (hours-only) to a readable format
      const hoursNum = Number.parseInt(duration || "");
      const timeLimit =
        Number.isFinite(hoursNum) && hoursNum > 0
          ? `${hoursNum} hour${hoursNum > 1 ? "s" : ""}`
          : undefined;

      await createTask.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        timeLimit: timeLimit,
      });

      setTitle("");
      setDescription("");
      setDuration("");
      refetchProjects();
      navigate({ to: "/projects" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = title.trim().length > 0;
  const hasActiveProjects = projects && projects.length > 0;

  const canContinueQuiz =
    problem.trim().length > 0 &&
    contextText.trim().length > 0 &&
    outcomesText.trim().length > 0;
  const canGenerateFromQuiz =
    showQcm &&
    !!qcmProblemState.selectedId &&
    !!qcmContextState.selectedId &&
    !!qcmOutcomesState.selectedId;

  const handleContinueQuiz = async () => {
    if (!canContinueQuiz || refineQuiz.isPending) return;
    try {
      const res = await refineQuiz.mutateAsync({
        problem: problem,
        context: contextText,
        expected_outcome: outcomesText,
      });
      const toOpts = (
        arr: AjtbdSuggestion[],
        prefix: string
      ): QcmOptionDefinition[] =>
        (arr ?? []).map((s, i) => ({
          id: `${prefix}_${i}` as string,
          label: s.kind === "variation" ? undefined : s.suggestion,
          description: s.kind === "variation" ? s.suggestion : "",
          kind: s.kind,
        }));

      const nextProblem = toOpts((res as any)?.problem || [], "p");
      const nextContext = toOpts((res as any)?.context || [], "c");
      const nextOutcome = toOpts((res as any)?.expected_outcome || [], "o");
      setQcmProblemOptions(nextProblem);
      setQcmContextOptions(nextContext);
      setQcmOutcomesOptions(nextOutcome);
      const toFieldValues = (opts: QcmOptionDefinition[]) =>
        Object.fromEntries(opts.map((o) => [o.id, o.description]));
      setQcmProblemState({
        selectedId: null,
        fieldValues: toFieldValues(nextProblem),
        otherText: "",
      });
      setQcmContextState({
        selectedId: null,
        fieldValues: toFieldValues(nextContext),
        otherText: "",
      });
      setQcmOutcomesState({
        selectedId: null,
        fieldValues: toFieldValues(nextOutcome),
        otherText: "",
      });
      setShowQcm(true);
    } catch (e) {
      console.error("Failed to refine quiz", e);
    }
  };

  const handleGenerateFromQuiz = async () => {
    const takeFinal = (s: QcmSelectionState) => {
      if (!s.selectedId) return "";
      return s.selectedId === "other"
        ? (s.otherText || "").trim()
        : (s.fieldValues[s.selectedId] || "").trim();
    };
    const text = [
      "Problem:",
      takeFinal(qcmProblemState),
      "",
      "Context:",
      takeFinal(qcmContextState),
      "",
      "Expected outcome:",
      takeFinal(qcmOutcomesState),
    ]
      .filter(Boolean)
      .join("\n");

    if (!text.trim() || isImproving) return;
    setOriginalDescription(text);
    setIsImproving(true);
    try {
      const response = await improveDescription.mutateAsync({ text } as any);
      const improvedText =
        (response as any)?.result ??
        (response as any)?.improvedDescription ??
        "";
      if (improvedText) {
        setDescription(improvedText);
        setImprovedDescription(improvedText);
        setMode("manual");
        setShowUndo(true);
        setCanRedo(false);
      }
    } catch (error) {
      console.error("Failed to generate description:", error);
    } finally {
      setIsImproving(false);
    }
  };

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
          className="min-h-10 text-3xl font-math leading-7 w-full"
          autoSize
          errorMessage={!isValid ? "Title is required" : undefined}
          isRequired
        />
        <div className="flex flex-col gap-3">
          <TagGroup
            label="How would you like to start?"
            selectionMode="single"
            selectedKeys={new Set([mode])}
            onSelectionChange={(keys) => {
              const first = Array.from(keys as Set<string>)[0];
              if (first === "quiz" || first === "manual") {
                setMode(first);
              }
            }}
          >
            <TagList aria-label="Input method">
              <Tag id="quiz">Guided quiz</Tag>
              <Tag id="manual">Type description manually</Tag>
            </TagList>
          </TagGroup>

          {mode === "quiz" && (
            <div
              className="p-3 bg-muted rounded border text-sm text-muted-foreground flex items-start gap-2"
              role="note"
            >
              💡
              <div>
                Take a short guided quiz to help us understand your needs. It’s
                based on the AJTBD framework. Based on this brief description of
                your idea, we'll suggest a test task for the candidates.
              </div>
            </div>
          )}

          {mode === "quiz" && (
            <div className="space-y-2">
              <QuizBlock
                title="What's the problem you're solving?"
                helperText="Let's think in problem-solution mindset. A tool or a product is a solution people can use to achieve a goal. Is there something inconvenient or annoying that users do? What's the pain point?"
                ariaLabel="Problem"
                value={problem}
                onChange={setProblem}
                isDisabled={isImproving}
              >
                {showQcm && (
                  <QcmBlock
                    title="Problem details"
                    helperText="Choose the closest fit, then edit fields to match your context."
                    options={qcmProblemOptions}
                    value={qcmProblemState}
                    onChange={setQcmProblemState}
                  />
                )}
              </QuizBlock>

              <QuizBlock
                title="In which context people encounter this problem?"
                helperText="What's the environment where this problem occurs? Did they try other solutions? What triggers searching for a solution?"
                ariaLabel="Context"
                value={contextText}
                onChange={setContextText}
                isDisabled={isImproving}
              >
                {showQcm && (
                  <QcmBlock
                    title="Context details"
                    helperText="Pick the environment and refine the specifics."
                    options={qcmContextOptions}
                    value={qcmContextState}
                    onChange={setQcmContextState}
                  />
                )}
              </QuizBlock>

              <QuizBlock
                title="What are the expected outcomes?"
                helperText="What's the desired result? What are the expected outcomes? Are there any criteria for success?"
                ariaLabel="Outcomes"
                value={outcomesText}
                onChange={setOutcomesText}
                isDisabled={isImproving}
              >
                {showQcm && (
                  <QcmBlock
                    title="Outcome details"
                    helperText="Select the outcome you care about and set targets."
                    options={qcmOutcomesOptions}
                    value={qcmOutcomesState}
                    onChange={setQcmOutcomesState}
                  />
                )}
              </QuizBlock>

              {!showQcm && (
                <div className="pt-1">
                  <Button
                    type="button"
                    intent="primary"
                    size="md"
                    className="w-full"
                    isDisabled={!canContinueQuiz || refineQuiz.isPending}
                    onPress={handleContinueQuiz}
                  >
                    {refineQuiz.isPending ? "Loading suggestions…" : "Continue"}
                  </Button>
                </div>
              )}
              {showQcm && (
                <div className="pt-1">
                  <Button
                    type="button"
                    intent="primary"
                    size="md"
                    className="w-full"
                    isDisabled={!canGenerateFromQuiz || isImproving}
                    onPress={handleGenerateFromQuiz}
                  >
                    {isImproving ? "Generating…" : "Generate task description"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {mode === "manual" && (
          <div className="space-y-2">
            <div className="relative">
              <Textarea
                aria-label="Description"
                placeholder="Describe your task in a few paragraphs..."
                value={description}
                onChange={(v) => setDescription(String(v))}
                className={`text-primary leading-6 min-h-60 w-full transition-all duration-300 ${
                  isImproving ? "opacity-60 border-transparent" : ""
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
                      style={
                        {
                          WebkitMask:
                            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                          WebkitMaskComposite: "xor",
                          maskComposite: "exclude",
                          padding: 2,
                          background:
                            "conic-gradient(from 0deg, rgba(59,130,246,0.6), rgba(168,85,247,0.6), rgba(236,72,153,0.6), rgba(59,130,246,0.6))",
                        } as React.CSSProperties
                      }
                      transition={{
                        duration: 6,
                        ease: "linear",
                        repeat: Infinity,
                      }}
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
                    transition={{
                      duration: 1.75,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </>
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <TagGroup
            label="How you'd like submissions to be evaluated"
            selectionMode="single"
            selectedKeys={new Set([evaluation])}
            onSelectionChange={(keys) => {
              const first = Array.from(keys as Set<string>)[0];
              if (first) setEvaluation(first as any);
            }}
          >
            <TagList aria-label="Evaluation method">
              <Tag id="manual">Manual</Tag>
              <Tag id="expert">Expert</Tag>
              <Tag id="expert_interview">Expert + interview</Tag>
            </TagList>
          </TagGroup>

          {evaluation === "manual" && (
            <div className="p-4 bg-muted rounded border">
              <h4 className="font-medium mb-1">Manual evaluation</h4>
              <p className="text-sm text-muted-foreground">
                Your team reviews artifacts and decisions. Use rubric hints and
                a shareable evidence pack to keep calls consistent.
              </p>
            </div>
          )}

          {evaluation === "expert" && (
            <div className="p-4 bg-muted rounded border">
              <h4 className="font-medium mb-1">Expert evaluation</h4>
              <p className="text-sm text-muted-foreground">
                Calibrated specialist scores the submission against your
                context. Receive a clear level read, red flags, and a
                recommendation.
              </p>
            </div>
          )}

          {evaluation === "expert_interview" && (
            <div className="space-y-2 p-4 bg-muted rounded border">
              <h4 className="font-medium mb-1">
                Expert evaluation + interview
              </h4>
              <p className="text-sm text-muted-foreground">
                Calibrated specialist scores the submission against your
                context. Receive a clear level read, red flags, and a
                recommendation.
              </p>
              <p className="text-sm text-muted-foreground">
                Adds a focused 30–45 min interview to probe decisions and
                trade‑offs. Best for senior roles or ambiguous signals.
              </p>
            </div>
          )}
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
