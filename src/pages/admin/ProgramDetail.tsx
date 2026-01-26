import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useProgram, useProgramRegistrations } from "@/hooks/usePrograms";
import { ModuleManager } from "@/components/programs/ModuleManager";
import { FormBuilder } from "@/components/programs/FormBuilder";
import { AnnouncementManager } from "@/components/programs/AnnouncementManager";
import { AdvertisementManager } from "@/components/programs/AdvertisementManager";
import { RegistrationsTable } from "@/components/programs/RegistrationsTable";
import {
  Loader2,
  ArrowLeft,
  Settings,
  Calendar,
  MapPin,
  ExternalLink,
  Copy,
  Check,
  Edit,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function ProgramDetail() {
  const { id } = useParams<{ id: string }>();
  const { program, isLoading, error, refetch } = useProgram(id);
  const { registrations, isLoading: registrationsLoading, refetch: refetchRegistrations } =
    useProgramRegistrations(id);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);

  const { toast } = useToast();

  const publicUrl = program ? `${window.location.origin}/program/${program.id}` : "";

  const openEditDialog = () => {
    if (program) {
      setEditName(program.name);
      setEditDescription(program.description || "");
      setEditStartDate(program.start_date || "");
      setEditEndDate(program.end_date || "");
      setEditIsActive(program.is_active);
      setIsEditDialogOpen(true);
    }
  };

  const handleUpdateProgram = async () => {
    if (!program) return;
    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from("programs")
        .update({
          name: editName.trim(),
          description: editDescription.trim() || null,
          start_date: editStartDate || null,
          end_date: editEndDate || null,
          is_active: editIsActive,
        })
        .eq("id", program.id);

      if (error) throw error;

      toast({
        title: "Program updated",
        description: "Program details have been saved.",
      });

      setIsEditDialogOpen(false);
      refetch();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update program",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProgram = async () => {
    if (!program) return;
    setIsUpdating(true);

    try {
      const { error } = await supabase.from("programs").delete().eq("id", program.id);

      if (error) throw error;

      toast({
        title: "Program deleted",
        description: "The program has been removed.",
      });

      // Redirect to programs list
      window.location.href = "/admin/programs";
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete program",
        variant: "destructive",
      });
      setIsUpdating(false);
    }
  };

  const copyPublicUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "URL copied",
      description: "Public registration URL has been copied to clipboard.",
    });
  };

  const toggleProgramStatus = async () => {
    if (!program) return;

    try {
      const { error } = await supabase
        .from("programs")
        .update({ is_active: !program.is_active })
        .eq("id", program.id);

      if (error) throw error;

      toast({
        title: program.is_active ? "Program deactivated" : "Program activated",
        description: program.is_active
          ? "The program is now hidden from public."
          : "The program is now visible to public.",
      });

      refetch();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8 flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !program) {
    return (
      <Layout>
        <div className="container py-8">
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">Program not found</p>
            <Button asChild className="mt-4">
              <Link to="/admin/programs">Back to Programs</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Check which modules are enabled
  const hasAnnouncements = program.modules?.some((m) => m.module_type === "announcement");
  const hasRegistration = program.modules?.some((m) => m.module_type === "registration");
  const hasAdvertisement = program.modules?.some((m) => m.module_type === "advertisement");

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <Button asChild variant="ghost" size="icon">
            <Link to="/admin/programs">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">{program.name}</h1>
              <Badge
                variant="secondary"
                style={{
                  backgroundColor: program.division?.color || undefined,
                  color: program.division?.color ? "white" : undefined,
                }}
              >
                {program.division?.name}
              </Badge>
              <Badge variant={program.is_active ? "default" : "secondary"}>
                {program.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            {program.description && (
              <p className="text-muted-foreground mb-2">{program.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {program.start_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(program.start_date), "MMM d, yyyy")}
                  {program.end_date && ` - ${format(new Date(program.end_date), "MMM d, yyyy")}`}
                </span>
              )}
              {program.panchayath?.name && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {program.panchayath.name}
                </span>
              )}
              {program.all_panchayaths && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  All Panchayaths
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={openEditDialog}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" onClick={toggleProgramStatus}>
              {program.is_active ? "Deactivate" : "Activate"}
            </Button>
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Public URL Card */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Public Registration URL
            </CardTitle>
            <CardDescription>
              Share this URL for public registration access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Input value={publicUrl} readOnly className="font-mono text-sm" />
              <Button variant="outline" size="icon" onClick={copyPublicUrl}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button asChild variant="outline" size="icon">
                <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="modules" className="space-y-6">
          <TabsList>
            <TabsTrigger value="modules" className="gap-2">
              <Settings className="h-4 w-4" />
              Modules
            </TabsTrigger>
            {hasAnnouncements && <TabsTrigger value="announcements">Announcements</TabsTrigger>}
            {hasRegistration && <TabsTrigger value="registration">Registration Form</TabsTrigger>}
            {hasAdvertisement && <TabsTrigger value="advertisements">Advertisements</TabsTrigger>}
            {hasRegistration && (
              <TabsTrigger value="registrations">
                Registrations ({program.registration_count || 0})
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="modules">
            <ModuleManager
              programId={program.id}
              modules={program.modules || []}
              onModulesChange={refetch}
            />
          </TabsContent>

          {hasAnnouncements && (
            <TabsContent value="announcements">
              <AnnouncementManager
                programId={program.id}
                announcements={program.announcements || []}
                onAnnouncementsChange={refetch}
              />
            </TabsContent>
          )}

          {hasRegistration && (
            <TabsContent value="registration">
              <FormBuilder
                programId={program.id}
                questions={program.form_questions || []}
                onQuestionsChange={refetch}
              />
            </TabsContent>
          )}

          {hasAdvertisement && (
            <TabsContent value="advertisements">
              <AdvertisementManager
                programId={program.id}
                advertisements={program.advertisements || []}
                onAdvertisementsChange={refetch}
              />
            </TabsContent>
          )}

          {hasRegistration && (
            <TabsContent value="registrations">
              <RegistrationsTable
                programName={program.name}
                questions={program.form_questions || []}
                registrations={registrations}
                isLoading={registrationsLoading}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Program</DialogTitle>
            <DialogDescription>Update program details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editName">Program Name *</Label>
              <Input
                id="editName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editStartDate">Start Date</Label>
                <Input
                  id="editStartDate"
                  type="date"
                  value={editStartDate}
                  onChange={(e) => setEditStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEndDate">End Date</Label>
                <Input
                  id="editEndDate"
                  type="date"
                  value={editEndDate}
                  onChange={(e) => setEditEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="editIsActive"
                checked={editIsActive}
                onCheckedChange={setEditIsActive}
              />
              <Label htmlFor="editIsActive">Program is active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProgram} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Program</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{program.name}"? This action cannot be undone.
              All associated modules, announcements, advertisements, and registrations will be
              deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProgram} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Program"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
