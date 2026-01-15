import { motion } from "framer-motion";
import { Zap, Code2, Palette, Rocket, Shield, Layers } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate complete applications in seconds, not weeks. Our AI understands your vision instantly.",
  },
  {
    icon: Code2,
    title: "Production-Ready Code",
    description: "Clean, maintainable code following best practices. Ready to deploy from day one.",
  },
  {
    icon: Palette,
    title: "Stunning Designs",
    description: "Beautiful, responsive interfaces that adapt to any device and delight your users.",
  },
  {
    icon: Rocket,
    title: "One-Click Deploy",
    description: "Deploy to the cloud instantly. No configuration, no hassle, just results.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Built-in security best practices protect your data and your users.",
  },
  {
    icon: Layers,
    title: "Full-Stack Power",
    description: "From frontend to backend, databases to APIs. Everything you need in one place.",
  },
];

const Features = () => {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Ship Fast</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful features that help you go from idea to production in record time.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 group hover:border-primary/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
