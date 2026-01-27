import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Calendar, MapPin, Filter, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

// Import division logos
import farmelifeLogo from "@/assets/divisions/farmelife.png";
import organelifeLogo from "@/assets/divisions/organelife.png";
import foodelifeLogo from "@/assets/divisions/foodelife.png";
import entrelifeLogo from "@/assets/divisions/entrelife.png";
import embryoLogo from "@/assets/divisions/embryo.png";
import avalLogo from "@/assets/divisions/aval.jpg";
import pennyekartLogo from "@/assets/divisions/pennyekart.png";

// Division metadata with Malayalam names and logos
const divisionMeta: Record<string, { nameMl: string; logo: string }> = {
  farmelife: { nameMl: "ഫാർമെലൈഫ്", logo: farmelifeLogo },
  organelife: { nameMl: "ഓർഗനെലൈഫ്", logo: organelifeLogo },
  foodelife: { nameMl: "ഫുഡെലൈഫ്", logo: foodelifeLogo },
  entrelife: { nameMl: "എന്ററലൈഫ്", logo: entrelifeLogo },
  embryo: { nameMl: "എംബ്രിയോ", logo: embryoLogo },
  aval: { nameMl: "അവൾ", logo: avalLogo },
  pennyekart: { nameMl: "പെന്നിക്കാർട്ട്", logo: pennyekartLogo },
};

interface Division {
  id: string;
  name: string;
  color: string | null;
}

interface Program {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  all_panchayaths: boolean;
  division: { name: string; color: string | null } | null;
  panchayath: { name: string } | null;
  modules: { module_type: string; is_published: boolean }[];
}

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch divisions
      const { data: divData } = await supabase
        .from("divisions")
        .select("id, name, color")
        .eq("is_active", true)
        .order("name");
      setDivisions(divData || []);

      // Fetch active programs with registration module published
      const { data: progData, error } = await supabase
        .from("programs")
        .select(`
          id,
          name,
          description,
          start_date,
          end_date,
          all_panchayaths,
          division:divisions(name, color),
          panchayath:panchayaths(name),
          modules:program_modules(module_type, is_published)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching programs:", error);
      }

      setPrograms(progData || []);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const filteredPrograms =
    filter === "all"
      ? programs
      : programs.filter((p) => p.division?.name?.toLowerCase() === filter.toLowerCase());

  // Check if program has any published content
  const hasPublishedContent = (program: Program) => {
    return program.modules?.some((m) => m.is_published);
  };

  const visiblePrograms = filteredPrograms.filter(hasPublishedContent);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our Programs
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Training, workshops, and events for women empowerment
            </p>
            <p className="text-muted-foreground">
              പരിശീലനം, ശിൽപ്പശാലകൾ, പരിപാടികൾ
            </p>
          </div>
        </div>
      </section>

      {/* Filter & Programs */}
      <section className="py-16">
        <div className="container">
          {/* Filter */}
          <div className="flex items-center gap-4 mb-8">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by division" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Divisions</SelectItem>
                {divisions.map((division) => (
                  <SelectItem key={division.id} value={division.name.toLowerCase()}>
                    {division.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {visiblePrograms.length} program{visiblePrograms.length !== 1 ? "s" : ""} found
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : visiblePrograms.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">No programs available at the moment.</p>
              <p className="text-sm text-muted-foreground">Check back soon for upcoming programs!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visiblePrograms.map((program) => {
                const divisionKey = program.division?.color || program.division?.name?.toLowerCase() || "";
                const meta = divisionMeta[divisionKey];
                
                return (
                  <Card key={program.id} className="flex flex-col hover:shadow-lg transition-shadow border-border/50 overflow-hidden">
                    {/* Division Header with Logo */}
                    <div className="bg-gradient-to-r from-secondary to-secondary/50 p-4 border-b border-border/30">
                      <div className="flex items-center gap-4">
                        {meta?.logo && (
                          <div className="h-16 w-16 flex-shrink-0 bg-card rounded-lg p-1.5 shadow-sm">
                            <img 
                              src={meta.logo} 
                              alt={program.division?.name || "Division"} 
                              className="h-full w-full object-contain"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-semibold text-lg text-foreground">
                            {program.division?.name || "Unknown"}
                          </h3>
                          {meta?.nameMl && (
                            <p className="text-sm text-muted-foreground">{meta.nameMl}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl leading-tight text-foreground">{program.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      {program.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {program.description}
                        </p>
                      )}
                      <div className="space-y-2 text-sm">
                        {program.start_date && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>
                              {format(new Date(program.start_date), "MMM d, yyyy")}
                              {program.end_date &&
                                ` - ${format(new Date(program.end_date), "MMM d, yyyy")}`}
                            </span>
                          </div>
                        )}
                        {program.panchayath?.name && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{program.panchayath.name}</span>
                          </div>
                        )}
                        {program.all_panchayaths && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>All Panchayaths</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link to={`/program/${program.id}`}>View & Register</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Programs;