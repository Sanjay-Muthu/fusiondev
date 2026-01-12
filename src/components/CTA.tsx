import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative glass-card p-12 md:p-20 text-center overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute inset-0 glow-orb opacity-20" />
          
          <div className="relative z-10">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Ready to Build Something{" "}
              <span className="gradient-text">Amazing?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Join thousands of creators who are building the future with AI. 
              Start your first project today — it's free.
            </p>
            <Button size="lg" className="group">
              Get Started Now
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
