import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { staticTransition } from "../components/ui/drawer";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingComponent,
});

function OnboardingComponent() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 0,
      title: "Know who can actually do your job.",
      subtitle: "Scout: Hiring Platform",
      description:
        "Context-specific competency verdict and price-to-skill guidance for non-technical hiring managers.",
      cta: "Decide: Hire · Guardrail · Pass",
      coreJobs: [
        {
          icon: "request",
          title: "Context mirroring",
          description:
            "Turn your real stack, constraints, and typical tickets into a short, fair scenario.",
          color: "bg-blue-500/20",
          iconColor: "text-blue-500",
        },
        {
          icon: "comment",
          title: "Explainable verdict",
          description:
            "Plain-English level assessment (Jr/Mid/etc), red flags, and price-to-skill fit.",
          color: "bg-purple-500/20",
          iconColor: "text-purple-500",
        },
      ],
    },
    {
      id: 1,
      title:
        "De-risk headcount decisions so projects ship on time without overpaying for underqualified talent.",
      subtitle: "What you get",
      description:
        "Clear, decision-ready evidence tailored to your stack and constraints.",
      valueProps: [
        "Confidence over vibes. Decisions grounded in your context, not generic puzzles.",
        "Speed, not grind. Decision-grade signal in <48 hours; candidate time ≤ the limit you set.",
        "Lower interview load. Cut engineering interviews by 50%+ while improving signal quality.",
        "Comp sanity. Stop paying senior rates for mid-level output.",
      ],
      bigJob: {
        title:
          "De-risk headcount decisions so projects ship on time without overpaying for underqualified talent.",
        description: "We do it by delivering these Core Jobs:",
      },
    },
    {
      id: 2,
      failuresTitle: "Why current approaches fail",
      failures: [
        "Generic coding tests ≠ your job; weak predictive validity.",
        "Unbounded/ill-scoped take-homes feel extractive, invite outside help, and kill completion rates.",
        "Interviews/references overweight storytelling and network effects.",
        "Notion/Sheets = inconsistent, time-hungry, hard to defend to finance/legal.",
      ],
      advantagesTitle: "What's our take on it?",
      advantages: [
        "Interactive builder → job-faithful scenarios in minutes (no rubric writing).",
        "Timebox control → 15 min to 12 hrs; match complexity without burning candidates.",
        "Signal over surveillance → we focus on decisions, trade-offs, and artifacts; no covert proctoring.",
        "Optional specialist review → calibrated human read for edge cases and executive confidence.",
        "Explainability → readable findings + concrete evidence you can circulate.",
      ],
    },
    {
      id: 3,
      title: "FAQ",
      faqs: [
        {
          q: "Will creating a task take me hours?",
          a: "No. Guided builder; typical setup 5–10 minutes.",
        },
        {
          q: "We sometimes need long tasks.",
          a: "Supported. Set up to 12 hours when depth matters; keep scope explicit and outcomes concrete.",
        },
        {
          q: "What about cheating or proctoring?",
          a: "We don’t provide anti-cheat or surveillance. The product is built for signal quality through task design + optional specialist assessment. If you require proctoring, pair our flow with your preferred tool or add a short live walkthrough.",
        },
        {
          q: "Is it fair and defensible?",
          a: "Yes–clear ladders (Jr/Mid/Senior/Staff), consistent scoring, and a shareable evidence pack for CFO/CEO/clients.",
        },
        {
          q: "Do I still need interviews?",
          a: "Use this as the decision-grade filter. Keep brief culture/behavior chats; reserve deep panels for strong signals.",
        },
      ],
    },
    {
      id: 4,
      title: "How it works",
      howItWorks: [
        "Describe your context and build a job-faithful task in minutes.",
        "Set the timebox – 15 min → 36 hrs.",
        "Invite candidates – link/email; clear expectations and deliverables.",
        "Get the report – level in your context, red flags, price-to-skill fit, recommendation.",
        "(Optional) Specialist assessor – calibrated human addendum for edge cases.",
        "Decide – Hire / Guardrail / Pass – share the one-page evidence pack.",
      ],
    },
  ];


  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate({ to: "/", replace: true });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Reset scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [currentStep]);

  const valueCardColors = [
    "bg-blue-500/10",
    "bg-emerald-500/10",
    "bg-amber-500/10",
    "bg-violet-500/10",
    "bg-rose-500/10",
  ];

  return (
    <div
      className="relative min-h-screen"
      style={{
        background:
          "var(--gradient, linear-gradient(113deg, oklch(0.36 0.05 230) 0%, oklch(0.28 0.04 240) 84.92%))",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ y: 50, opacity: 0, filter: "blur(5px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -50, opacity: 0, filter: "blur(5px)" }}
          transition={staticTransition}
          className="flex flex-col px-6 py-8 pb-32"
        >
          {/* Hero Section */}
          <div className="flex-1 flex flex-col justify-center">
            {currentStep === 0 ? (
              <>
                {/* Hero Content */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-left mb-4"
                >
                  <div className="text-white/80 text-sm font-medium mb-2 tracking-wide uppercase">
                    {steps[currentStep].subtitle}
                  </div>
                  <h1 className="text-white text-4xl font-math font-bold leading-tight mb-6 max-w-2xl">
                    {steps[currentStep].title}
                  </h1>
                  <p className="text-white/90 text-lg leading-relaxed max-w-xl mb-4">
                    {steps[currentStep].description}
                  </p>
                  <div className="text-white/80 text-base font-medium">
                    {steps[currentStep].cta}
                  </div>
                </motion.div>

                {/* Core Jobs Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="grid grid-cols-2 gap-3 my-6 max-w-6xl mx-auto"
                >
                  {steps[currentStep].coreJobs?.map((job, index) => (
                    <div
                      key={index}
                      className={`relative overflow-hidden rounded-lg p-4 ${job.color} backdrop-blur-sm border border-white/10 shadow-2xl`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-white font-math text-xl mb-2">
                            {job.title}
                          </h3>
                          <p className="text-white/80 text-xs leading-relaxed">
                            {job.description}
                          </p>
                        </div>
                      </div>

                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>
                    </div>
                  ))}
                </motion.div>
              </>
            ) : currentStep === 1 ? (
              <>
                {/* Big Job Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-left mb-6"
                >
                  <div className="text-white/80 text-sm font-medium mb-2 tracking-wide uppercase">
                    {steps[currentStep].subtitle}
                  </div>
                  <h1 className="text-white text-4xl font-math leading-tight mb-4 max-w-4xl">
                    {steps[currentStep].title}
                  </h1>
                  <p className="text-white/90 text-lg leading-relaxed max-w-2xl">
                    {steps[currentStep].description}
                  </p>
                </motion.div>

                {/* Swiss Layout Grid - 2x2 (compact, no icon on this layout) */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="space-y-3 mb-3 max-w-3xl mx-auto"
                >
                  {steps[currentStep].valueProps?.map((text, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        delay: 0.5 + index * 0.08,
                        duration: 0.4,
                        type: "spring",
                        stiffness: 140,
                      }}
                      className={`relative overflow-hidden rounded-lg p-4 ${valueCardColors[index % valueCardColors.length]} hover:bg-white/15 backdrop-blur-sm border border-white/10 hover:border-white/20 shadow-2xl transition-colors`}
                    >
                      {(() => {
                        const parts = String(text).split(". ");
                        const title = parts.shift() || "";
                        const description = parts.join(". ");
                        return (
                          <>
                            <h3 className="text-white font-math font-semibold text-lg leading-tight mb-1">
                              {title}
                            </h3>
                            {description && (
                              <p className="text-white/80 text-xs leading-relaxed">
                                {description}
                              </p>
                            )}
                          </>
                        );
                      })()}
                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            ) : currentStep === 2 ? (
              <>
                {/* Why current approaches fail */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-left mb-4"
                >
                  <h2 className="text-white font-math text-2xl leading-tight mb-2">
                    {steps[currentStep].failuresTitle}
                  </h2>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="space-y-3 mb-6 max-w-3xl mx-auto"
                >
                  {steps[currentStep].failures?.map(
                    (text: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          delay: 0.3 + index * 0.08,
                          duration: 0.4,
                          type: "spring",
                          stiffness: 140,
                        }}
                        className={`relative overflow-hidden rounded-lg p-4 bg-rose-500/20 hover:bg-white/15 backdrop-blur-sm border border-white/10 hover:border-white/20 shadow-2xl transition-colors`}
                      >
                        <p className="text-white/90 text-sm leading-relaxed">
                          {text}
                        </p>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>
                      </motion.div>
                    )
                  )}
                </motion.div>

                {/* Our advantages */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-left mb-4"
                >
                  <h2 className="text-white font-math text-2xl leading-tight mb-2">
                    {steps[currentStep].advantagesTitle}
                  </h2>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="space-y-3 mb-8 max-w-3xl mx-auto"
                >
                  {steps[currentStep].advantages?.map(
                    (text: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          delay: 0.3 + index * 0.08,
                          duration: 0.4,
                          type: "spring",
                          stiffness: 140,
                        }}
                        className={`relative overflow-hidden rounded-lg p-4 bg-emerald-500/20 hover:bg-white/15 backdrop-blur-sm border border-white/10 hover:border-white/20 shadow-2xl transition-colors`}
                      >
                        <p className="text-white/90 text-sm leading-relaxed">
                          {text}
                        </p>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>
                      </motion.div>
                    )
                  )}
                </motion.div>
              </>
            ) : currentStep === 3 ? (
              <>
                {/* FAQ */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-left mb-4"
                >
                  <h2 className="text-white font-math text-2xl leading-tight mb-2">
                    {steps[currentStep].title}
                  </h2>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="space-y-3 mb-8 max-w-3xl mx-auto"
                >
                  {steps[currentStep].faqs?.map(
                    (item: { q: string; a: string }, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          delay: 0.3 + index * 0.08,
                          duration: 0.4,
                          type: "spring",
                          stiffness: 140,
                        }}
                        className={`relative overflow-hidden rounded-lg p-4 ${valueCardColors[index % valueCardColors.length]} hover:bg-white/15 backdrop-blur-sm border border-white/10 hover:border-white/20 shadow-2xl transition-colors`}
                      >
                        <h3 className="text-white font-math font-semibold text-lg leading-tight mb-1">
                          {item.q}
                        </h3>
                        <p className="text-white/90 text-sm leading-relaxed">
                          {item.a}
                        </p>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>
                      </motion.div>
                    )
                  )}
                </motion.div>
              </>
            ) : currentStep === 4 ? (
              <>
                {/* How it works */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-left mb-4"
                >
                  <h2 className="text-white font-math text-2xl leading-tight mb-2">
                    {steps[currentStep].title}
                  </h2>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="space-y-3 mb-10 max-w-3xl mx-auto"
                >
                  {steps[currentStep].howItWorks?.map(
                    (text: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          delay: 0.3 + index * 0.06,
                          duration: 0.4,
                          type: "spring",
                          stiffness: 140,
                        }}
                        className={`relative overflow-hidden rounded-lg p-4 ${valueCardColors[index % valueCardColors.length]} hover:bg-white/15 backdrop-blur-sm border border-white/10 hover:border-white/20 shadow-2xl transition-colors`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 w-6 h-6 rounded-full bg-white/20 text-white/90 flex items-center justify-center font-math text-sm">
                            {index + 1}
                          </div>
                          <p className="text-white/90 text-sm leading-relaxed">
                            {text}
                          </p>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>
                      </motion.div>
                    )
                  )}
                </motion.div>
              </>
            ) : null}
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-18 left-0 right-0"
      >
        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex justify-center gap-3 mb-6"
        >
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep ? "bg-white w-8" : "bg-white/30 w-2"
              }`}
              animate={{
                scale: index === currentStep ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </motion.div>
      </motion.div>
      {/* Fixed Bottom Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/20 to-transparent backdrop-blur-sm"
      >
        <div className="flex gap-4">
          {currentStep > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-16"
            >
              <Button
                className="h-14 text-white font-semibold w-full border-2 border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/30 backdrop-blur-sm rounded-2xl transition-all duration-300"
                intent="secondary"
                size="md"
                onPress={prevStep}
              >
                ←
              </Button>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className={currentStep > 0 ? "flex-1" : "w-full"}
          >
            <Button
              className="h-14 text-white font-semibold w-full bg-accent/80 hover:bg-accent border-2 border-accent/60 hover:border-accent backdrop-blur-sm rounded-2xl transition-all duration-300 shadow-lg"
              intent="brand"
              size="md"
              onPress={nextStep}
            >
              {currentStep === steps.length - 1 ? "Create a task 🚀" : "Next"}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
