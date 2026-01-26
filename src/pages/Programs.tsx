import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Calendar, Clock, MapPin, Users, Filter, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

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
              {visiblePrograms.map((program) => (
                <Card key={program.id} className="flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: program.division?.color || undefined,
                          color: program.division?.color ? "white" : undefined,
                        }}
                      >
                        {program.division?.name || "Unknown"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight">{program.name}</CardTitle>
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
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(program.start_date), "MMM d, yyyy")}
                            {program.end_date &&
                              ` - ${format(new Date(program.end_date), "MMM d, yyyy")}`}
                          </span>
                        </div>
                      )}
                      {program.panchayath?.name && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{program.panchayath.name}</span>
                        </div>
                      )}
                      {program.all_panchayaths && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
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
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Programs;