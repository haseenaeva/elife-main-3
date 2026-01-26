import { Layout } from "@/components/layout/Layout";
import { Target, Eye, Users, Heart, Sprout, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              About e-Life Society
            </h1>
            <p className="text-lg text-muted-foreground">
              ഇ-ലൈഫ് സൊസൈറ്റിയെക്കുറിച്ച്
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-8">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Eye className="h-7 w-7 text-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Our Vision
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A Kerala where every woman is economically empowered, socially respected, 
                  and actively contributing to the development of their families and communities.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  ഓരോ സ്ത്രീയും സാമ്പത്തികമായി ശാക്തീകരിക്കപ്പെടുന്ന ഒരു കേരളം
                </p>
              </CardContent>
            </Card>

            <Card className="border-accent/20 bg-gradient-to-br from-accent/10 to-transparent">
              <CardContent className="p-8">
                <div className="h-14 w-14 rounded-xl bg-accent/20 flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-accent" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Our Mission
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To empower women through comprehensive programs including skill development, 
                  entrepreneurship training, welfare support, and sustainable income-generation 
                  initiatives at the grassroots level.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  പരിശീലനം, പിന്തുണ, വരുമാന മാർഗങ്ങൾ എന്നിവയിലൂടെ സ്ത്രീകളെ ശാക്തീകരിക്കുക
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Panchayath Model */}
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                The Panchayath-Based Empowerment Model
              </h2>
              <p className="text-muted-foreground">
                പഞ്ചായത്ത് അധിഷ്ഠിത ശാക്തീകരണ മാതൃക
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Local Focus</h3>
                  <p className="text-sm text-muted-foreground">
                    Working within each panchayath to ensure accessibility and community involvement
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Community Driven</h3>
                  <p className="text-sm text-muted-foreground">
                    Programs designed with local needs and cultural context in mind
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Sprout className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Sustainable Growth</h3>
                  <p className="text-sm text-muted-foreground">
                    Building long-term capacity and self-reliance in communities
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground">ഞങ്ങളുടെ മൂല്യങ്ങൾ</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Heart, title: "Compassion", titleMl: "കരുണ" },
              { icon: Users, title: "Community", titleMl: "സമൂഹം" },
              { icon: Target, title: "Empowerment", titleMl: "ശാക്തീകരണം" },
              { icon: Sprout, title: "Sustainability", titleMl: "സുസ്ഥിരത" },
            ].map((value, index) => (
              <div key={index} className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.titleMl}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
