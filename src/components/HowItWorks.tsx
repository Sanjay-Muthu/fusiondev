import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Describe Your Vision",
    description: "Tell us what you want to build in plain English. Be as detailed or as simple as you like.",
  },
  {
    number: "02",
    title: "AI Generates Code",
    description: "Our advanced AI interprets your prompt and creates production-ready code in real-time.",
  },
  {
    number: "03",
    title: "Preview & Iterate",
    description: "See your app come to life instantly. Refine with follow-up prompts until it's perfect.",
  },
  {
    number: "04",
    title: "Deploy & Scale",
    description: "Launch to the world with one click. Scale effortlessly as your user base grows.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden">
      {/* Background accent */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-72 h-72 glow-orb opacity-30" />
      
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            From Idea to App in{" "}
            <span className="gradient-text">Minutes</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A simple process that puts the power of development in your hands.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative flex gap-8 pb-12 last:pb-0"
            >
              {/* Line connector */}
              {index !== steps.length - 1 && (
                <div className="absolute left-[30px] top-16 w-px h-[calc(100%-4rem)] bg-gradient-to-b from-primary/50 to-transparent" />
              )}
              
              {/* Number */}
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl glass-card flex items-center justify-center">
                <span className="font-display text-xl font-bold gradient-text">{step.number}</span>
              </div>
              
              {/* Content */}
              <div className="pt-3">
                <h3 className="font-display text-2xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-lg">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
