import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { Icon } from "../components/ui/icon";
import { staticTransition } from "../components/ui/drawer";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingComponent,
});

function OnboardingComponent() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [blockScreen, setBlockScreen] = useState(true);

  const steps = [
    {
      id: 0,
      title: "Добро пожаловать! 👋",
      subtitle: "Платформа для найма разработчиков",
      description:
        "Этот бот соединяет разработчиков и работодателей, чтобы сделать найм проще и эффективнее. Мы не сайт с вакансиями - вместо этого мы фокусируемся на упрощении работы с тестовыми заданиями.",
      blocks: [
        {
          icon: "request",
          text: "Создавайте проекты с тестовыми заданиями",
          color: "bg-blue-500/20",
          iconColor: "text-blue-500",
        },
        {
          icon: "comment",
          text: "Кандидаты выполняют задачи и отправляют результаты",
          color: "bg-green-500/20",
          iconColor: "text-green-500",
        },
        {
          icon: "circle",
          text: "Оценивайте работы и находите лучших кандидатов",
          color: "bg-purple-500/20",
          iconColor: "text-purple-500",
        },
      ],
    },
    {
      id: 1,
      title: "Как это работает?",
      subtitle: "Простой процесс найма",
      description:
        "Создавайте проекты, добавляйте задачи и приглашайте кандидатов. Они выполняют задания, а вы оцениваете результаты.",
      blocks: [
        {
          icon: "idea",
          text: "Создайте проект и добавьте детальное описание",
          color: "bg-orange-500/20",
          iconColor: "text-orange-500",
        },
        {
          icon: "comment",
          text: "Создавайте задачи с четкими требованиями и критериями",
          color: "bg-cyan-500/20",
          iconColor: "text-cyan-500",
        },
        {
          icon: "circle",
          text: "Поделитесь кодом доступа с кандидатами",
          color: "bg-pink-500/20",
          iconColor: "text-pink-500",
        },
      ],
    },
    {
      id: 2,
      title: "Готовы начать?",
      subtitle: "Переходим на веб-платформу",
      description:
        "Теперь у вас есть полноценная веб-платформа для управления проектами и тестовыми заданиями. Создайте свой первый проект!",
      blocks: [
        {
          icon: "circle",
          text: "Создайте новый проект с описанием",
          color: "bg-indigo-500/20",
          iconColor: "text-indigo-500",
        },
        {
          icon: "request",
          text: "Добавьте тестовые задания с детальными требованиями",
          color: "bg-emerald-500/20",
          iconColor: "text-emerald-500",
        },
        {
          icon: "idea",
          text: "Пригласите кандидатов и оцените их работы",
          color: "bg-rose-500/20",
          iconColor: "text-rose-500",
        },
      ],
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setBlockScreen(false);
    }, 200);
  }, []);

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

  if (blockScreen) {
    return (
      <div
        className="absolute inset-0"
        style={{ 
          background: "var(--gradient, linear-gradient(113deg, oklch(0.36 0.05 230) 0%, oklch(0.28 0.04 240) 84.92%))"
        }}
      />
    );
  }

  return (
    <div 
      className="relative" 
      style={{ 
        background: "var(--gradient, linear-gradient(113deg, oklch(0.36 0.05 230) 0%, oklch(0.28 0.04 240) 84.92%))"
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
          {/* Header Section */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-left mb-8"
            >
              <div className="text-white/80 text-sm font-medium mb-2 tracking-wide uppercase">
                {steps[currentStep].subtitle}
              </div>
              <h1 className="text-white text-4xl font-bold leading-tight mb-6">
                {steps[currentStep].title}
              </h1>
              <p className="text-white/90 text-base leading-relaxed max-w-md">
                {steps[currentStep].description}
              </p>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-4 mb-8"
            >
              {steps[currentStep].blocks.map((block, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ 
                    delay: 0.6 + index * 0.15, 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -4,
                    transition: { duration: 0.2 }
                  }}
                  className={`relative overflow-hidden rounded-3xl p-6 ${block.color} backdrop-blur-sm border border-white/10 shadow-2xl`}
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: 0.8 + index * 0.15,
                        duration: 0.4,
                        type: "spring",
                        stiffness: 200
                      }}
                      className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center"
                    >
                      <Icon variant={block.icon as any} size="lg" />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm leading-relaxed">
                        {block.text}
                      </p>
                    </div>
                  </div>
                  
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>
                </motion.div>
              ))}
            </motion.div>
          </div>

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
                  index === currentStep 
                    ? "bg-white w-8" 
                    : "bg-white/30 w-2"
                }`}
                animate={{
                  scale: index === currentStep ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Fixed Bottom Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/20 to-transparent backdrop-blur-sm"
      >
        <div className="flex gap-4">
          {currentStep > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.4 }}
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
            transition={{ delay: 1.4, duration: 0.4 }}
            className={currentStep > 0 ? "flex-1" : "w-full"}
          >
            <Button
              className="h-14 text-white font-semibold w-full bg-accent/80 hover:bg-accent border-2 border-accent/60 hover:border-accent backdrop-blur-sm rounded-2xl transition-all duration-300 shadow-lg"
              intent="brand"
              size="md"
              onPress={nextStep}
            >
              {currentStep === steps.length - 1
                ? "Создать проект 🚀"
                : "Далее"}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
