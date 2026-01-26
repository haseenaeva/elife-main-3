import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Calendar, Clock, MapPin, Users, Filter } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const programs = [
  {
    id: 1,
    title: "Organic Vegetable Farming Workshop",
    titleMl: "ജൈവ പച്ചക്കറി കൃഷി ശിൽപ്പശാല",
    division: "organelife",
    divisionName: "Organelife",
    date: "2024-02-15",
    time: "10:00 AM - 4:00 PM",
    location: "Thrissur",
    seats: 30,
    description: "Learn organic vegetable farming techniques from expert farmers. Includes hands-on training on composting, natural pest control, and seasonal crop planning.",
  },
  {
    id: 2,
    title: "Home-Based Food Business Training",
    titleMl: "വീട്ടിൽ നിന്നുള്ള ഭക്ഷ്യ ബിസിനസ് പരിശീലനം",
    division: "foodelife",
    divisionName: "Foodelife",
    date: "2024-02-20",
    time: "9:00 AM - 1:00 PM",
    location: "Kochi",
    seats: 25,
    description: "Start your own food business from home. Learn about FSSAI registration, packaging, pricing, and marketing your homemade food products.",
  },
  {
    id: 3,
    title: "Entrepreneurship Basics",
    titleMl: "സംരംഭകത്വ അടിസ്ഥാനങ്ങൾ",
    division: "entrelife",
    divisionName: "Entrelife",
    date: "2024-02-25",
    time: "10:00 AM - 5:00 PM",
    location: "Kozhikode",
    seats: 40,
    description: "A comprehensive introduction to starting your own business. Covers business planning, finance basics, marketing, and government schemes for women entrepreneurs.",
  },
  {
    id: 4,
    title: "Backyard Poultry Farming",
    titleMl: "മുറ്റത്തെ കോഴി വളർത്തൽ",
    division: "farmelife",
    divisionName: "Farmelife",
    date: "2024-03-01",
    time: "9:00 AM - 2:00 PM",
    location: "Palakkad",
    seats: 35,
    description: "Learn profitable poultry farming in your backyard. Includes breed selection, housing, feeding, health management, and marketing of eggs and birds.",
  },
  {
    id: 5,
    title: "Early Childhood Care Workshop",
    titleMl: "ശൈശവ പരിചരണ ശിൽപ്പശാല",
    division: "embryo",
    divisionName: "Embryo",
    date: "2024-03-05",
    time: "10:00 AM - 3:00 PM",
    location: "Thiruvananthapuram",
    seats: 20,
    description: "Essential training for childcare providers and mothers. Learn about child nutrition, developmental milestones, early learning activities, and safety practices.",
  },
  {
    id: 6,
    title: "Women's Wellness Camp",
    titleMl: "വനിതാ ക്ഷേമ ക്യാമ്പ്",
    division: "aval",
    divisionName: "Aval",
    date: "2024-03-10",
    time: "9:00 AM - 4:00 PM",
    location: "Kannur",
    seats: 50,
    description: "A holistic wellness camp focusing on physical health, mental well-being, and financial literacy. Includes health check-ups, counseling sessions, and skill orientation.",
  },
];

const divisionFilters = [
  { value: "all", label: "All Divisions" },
  { value: "farmelife", label: "Farmelife" },
  { value: "organelife", label: "Organelife" },
  { value: "foodelife", label: "Foodelife" },
  { value: "entrelife", label: "Entrelife" },
  { value: "embryo", label: "Embryo" },
  { value: "aval", label: "Aval" },
];

const divisionColors: Record<string, string> = {
  farmelife: "bg-division-farmelife",
  organelife: "bg-division-organelife",
  foodelife: "bg-division-foodelife",
  entrelife: "bg-division-entrelife",
  embryo: "bg-division-embryo",
  aval: "bg-division-aval",
  pennyekart: "bg-division-pennyekart",
};

const Programs = () => {
  const [filter, setFilter] = useState("all");
  const [selectedProgram, setSelectedProgram] = useState<typeof programs[0] | null>(null);
  const { toast } = useToast();

  const filteredPrograms = filter === "all" 
    ? programs 
    : programs.filter(p => p.division === filter);

  const handleRegistration = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Registration Submitted!",
      description: "We will contact you soon with program details.",
    });
    setSelectedProgram(null);
  };

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
                {divisionFilters.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {filteredPrograms.length} program{filteredPrograms.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {/* Programs Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <Card key={program.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge 
                      variant="secondary" 
                      className={`${divisionColors[program.division]} text-white border-0`}
                    >
                      {program.divisionName}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{program.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{program.titleMl}</p>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {program.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(program.date).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{program.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{program.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{program.seats} seats available</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full" 
                        onClick={() => setSelectedProgram(program)}
                      >
                        Register Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Register for Program</DialogTitle>
                        <DialogDescription>
                          {program.title}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleRegistration} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name / പേര്</Label>
                          <Input id="name" required placeholder="Enter your full name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number / ഫോൺ നമ്പർ</Label>
                          <Input id="phone" type="tel" required placeholder="+91" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email (Optional)</Label>
                          <Input id="email" type="email" placeholder="your@email.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="panchayath">Panchayath / പഞ്ചായത്ത്</Label>
                          <Input id="panchayath" required placeholder="Enter your panchayath" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">Message (Optional)</Label>
                          <Textarea id="message" placeholder="Any additional information..." />
                        </div>
                        <Button type="submit" className="w-full">
                          Submit Registration
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredPrograms.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No programs found for the selected division.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Programs;
