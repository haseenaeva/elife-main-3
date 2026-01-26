import { Target, Eye, Users } from "lucide-react";

export function AboutSection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              About e-Life Society
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              e-Life Society is a transformative women empowerment ecosystem rooted in 
              Kerala's rich cultural heritage. We work at the panchayath level to bring 
              meaningful change to the lives of housewives across the state.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Through our seven specialized divisions, we provide comprehensive support 
              including skill development, entrepreneurship training, welfare assistance, 
              and income-generation opportunities.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Our Vision</h3>
                  <p className="text-sm text-muted-foreground">
                    A Kerala where every woman is economically empowered and socially respected.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Target className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Our Mission</h3>
                  <p className="text-sm text-muted-foreground">
                    To empower women through structured programs, training, and sustainable 
                    income-generation initiatives at the grassroots level.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Panchayath Model</h3>
                  <p className="text-sm text-muted-foreground">
                    Working at the local level to ensure every woman has access to 
                    opportunities and support within her community.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Visual Element */}
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-accent/10 to-secondary overflow-hidden relative">
              {/* Decorative circles */}
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary/20" />
              <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-accent/30" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/10" />
              
              {/* Center content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="font-display text-6xl font-bold text-primary mb-2">e-Life</p>
                  <p className="text-lg text-muted-foreground">ഇ-ലൈഫ് സൊസൈറ്റി</p>
                  <p className="text-sm text-muted-foreground mt-2">Kerala • കേരളം</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
