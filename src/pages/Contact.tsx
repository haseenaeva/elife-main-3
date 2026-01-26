import { Layout } from "@/components/layout/Layout";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We will get back to you soon.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Contact Us
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Get in touch with e-Life Society
            </p>
            <p className="text-muted-foreground">
              ഞങ്ങളുമായി ബന്ധപ്പെടുക
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Help Desk</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Phone</p>
                      <p className="text-sm text-muted-foreground">+91 XXXXX XXXXX</p>
                      <p className="text-sm text-muted-foreground">+91 XXXXX XXXXX</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">info@elifesociety.org</p>
                      <p className="text-sm text-muted-foreground">help@elifesociety.org</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Address</p>
                      <p className="text-sm text-muted-foreground">
                        e-Life Society Head Office<br />
                        Kerala, India
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Working Hours</p>
                      <p className="text-sm text-muted-foreground">
                        Monday - Saturday<br />
                        9:00 AM - 5:00 PM
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Need Immediate Help?</h3>
                  <p className="text-sm opacity-90 mb-4">
                    For urgent welfare support or assistance, contact our Aval helpline.
                  </p>
                  <p className="font-medium">Aval Helpline: +91 XXXXX XXXXX</p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Fill out the form below and we'll get back to you
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name / പേര് *</Label>
                        <Input id="name" required placeholder="Enter your full name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number / ഫോൺ *</Label>
                        <Input id="phone" type="tel" required placeholder="+91" />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email (Optional)</Label>
                        <Input id="email" type="email" placeholder="your@email.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="panchayath">Panchayath / പഞ്ചായത്ത്</Label>
                        <Input id="panchayath" placeholder="Enter your panchayath" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject / വിഷയം *</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="programs">Programs & Training</SelectItem>
                          <SelectItem value="farmelife">Farmelife Division</SelectItem>
                          <SelectItem value="organelife">Organelife Division</SelectItem>
                          <SelectItem value="foodelife">Foodelife Division</SelectItem>
                          <SelectItem value="entrelife">Entrelife Division</SelectItem>
                          <SelectItem value="embryo">Embryo Division</SelectItem>
                          <SelectItem value="aval">Aval (Welfare Support)</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message / സന്ദേശം *</Label>
                      <Textarea 
                        id="message" 
                        required 
                        placeholder="How can we help you?"
                        className="min-h-32"
                      />
                    </div>

                    <Button type="submit" size="lg" className="gap-2">
                      <Send className="h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
