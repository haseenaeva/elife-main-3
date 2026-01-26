import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, Megaphone, Loader2, Edit, Image, Video } from "lucide-react";
import { ProgramAnnouncement } from "@/hooks/usePrograms";

interface AnnouncementManagerProps {
  programId: string;
  announcements: ProgramAnnouncement[];
  onAnnouncementsChange: () => void;
}

export function AnnouncementManager({
  programId,
  announcements,
  onAnnouncementsChange,
}: AnnouncementManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<ProgramAnnouncement | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const { toast } = useToast();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPosterUrl("");
    setVideoUrl("");
    setIsPublished(false);
    setEditingAnnouncement(null);
  };

  const openEditDialog = (announcement: ProgramAnnouncement) => {
    setEditingAnnouncement(announcement);
    setTitle(announcement.title);
    setDescription(announcement.description || "");
    setPosterUrl(announcement.poster_url || "");
    setVideoUrl(announcement.video_url || "");
    setIsPublished(announcement.is_published);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const announcementData = {
        program_id: programId,
        title: title.trim(),
        description: description.trim() || null,
        poster_url: posterUrl.trim() || null,
        video_url: videoUrl.trim() || null,
        is_published: isPublished,
      };

      if (editingAnnouncement) {
        const { error } = await supabase
          .from("program_announcements")
          .update(announcementData)
          .eq("id", editingAnnouncement.id);

        if (error) throw error;

        toast({
          title: "Announcement updated",
          description: "The announcement has been updated.",
        });
      } else {
        const { error } = await supabase
          .from("program_announcements")
          .insert(announcementData);

        if (error) throw error;

        toast({
          title: "Announcement created",
          description: "A new announcement has been added.",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      onAnnouncementsChange();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save announcement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (announcementId: string) => {
    try {
      const { error } = await supabase
        .from("program_announcements")
        .delete()
        .eq("id", announcementId);

      if (error) throw error;

      toast({
        title: "Announcement deleted",
        description: "The announcement has been removed.",
      });

      onAnnouncementsChange();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete announcement",
        variant: "destructive",
      });
    }
  };

  const togglePublish = async (announcement: ProgramAnnouncement) => {
    try {
      const { error } = await supabase
        .from("program_announcements")
        .update({ is_published: !announcement.is_published })
        .eq("id", announcement.id);

      if (error) throw error;

      toast({
        title: announcement.is_published ? "Unpublished" : "Published",
        description: `Announcement is now ${announcement.is_published ? "hidden" : "visible"}.`,
      });

      onAnnouncementsChange();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Announcements
              </CardTitle>
              <CardDescription>
                Create announcements for program participants
              </CardDescription>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Announcement
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {announcements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No announcements yet.</p>
              <p className="text-sm">Create announcements to share updates.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="flex items-start gap-3 p-4 border rounded-lg"
                >
                  {announcement.poster_url && (
                    <img
                      src={announcement.poster_url}
                      alt=""
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">{announcement.title}</span>
                      <Badge variant={announcement.is_published ? "default" : "secondary"}>
                        {announcement.is_published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    {announcement.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {announcement.description}
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      {announcement.poster_url && (
                        <Badge variant="outline" className="gap-1">
                          <Image className="h-3 w-3" />
                          Poster
                        </Badge>
                      )}
                      {announcement.video_url && (
                        <Badge variant="outline" className="gap-1">
                          <Video className="h-3 w-3" />
                          Video
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublish(announcement)}
                    >
                      {announcement.is_published ? "Unpublish" : "Publish"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(announcement)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(announcement.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingAnnouncement ? "Edit Announcement" : "New Announcement"}
            </DialogTitle>
            <DialogDescription>
              Create or update an announcement for this program
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Announcement title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Announcement details..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="posterUrl">Poster Image URL</Label>
              <Input
                id="posterUrl"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input
                id="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/..."
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="isPublished"
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />
              <Label htmlFor="isPublished">Publish immediately</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editingAnnouncement ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
