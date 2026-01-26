import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-sm font-medium mb-6">
            <Calendar className="h-4 w-4" />
            <span>Join Our Programs</span>
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Life?
          </h2>
          
          <p className="text-lg opacity-90 mb-8 leading-relaxed">
            Explore our programs and register for training sessions, workshops, and 
            income-generation initiatives designed specifically for women.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              variant="secondary"
              className="gap-2"
            >
              <Link to="/programs">
                Browse Programs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
          
          <p className="mt-8 text-sm opacity-70">
            പരിപാടികളിൽ പങ്കെടുക്കാൻ രജിസ്റ്റർ ചെയ്യുക
          </p>
        </div>
      </div>
    </section>
  );
}
