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
import { Plus, Trash2, Video, Loader2, Edit, Image } from "lucide-react";
import { ProgramAdvertisement } from "@/hooks/usePrograms";

interface AdvertisementManagerProps {
  programId: string;
  advertisements: ProgramAdvertisement[];
  onAdvertisementsChange: () => void;
}

export function AdvertisementManager({
  programId,
  advertisements,
  onAdvertisementsChange,
}: AdvertisementManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAd, setEditingAd] = useState<ProgramAdvertisement | null>(null);

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
    setEditingAd(null);
  };

  const openEditDialog = (ad: ProgramAdvertisement) => {
    setEditingAd(ad);
    setTitle(ad.title || "");
    setDescription(ad.description || "");
    setPosterUrl(ad.poster_url || "");
    setVideoUrl(ad.video_url || "");
    setIsPublished(ad.is_published);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const adData = {
        program_id: programId,
        title: title.trim() || null,
        description: description.trim() || null,
        poster_url: posterUrl.trim() || null,
        video_url: videoUrl.trim() || null,
        is_published: isPublished,
      };

      if (editingAd) {
        const { error } = await supabase
          .from("program_advertisements")
          .update(adData)
          .eq("id", editingAd.id);

        if (error) throw error;

        toast({
          title: "Advertisement updated",
          description: "The advertisement has been updated.",
        });
      } else {
        const { error } = await supabase
          .from("program_advertisements")
          .insert(adData);

        if (error) throw error;

        toast({
          title: "Advertisement created",
          description: "A new advertisement has been added.",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      onAdvertisementsChange();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save advertisement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (adId: string) => {
    try {
      const { error } = await supabase
        .from("program_advertisements")
        .delete()
        .eq("id", adId);

      if (error) throw error;

      toast({
        title: "Advertisement deleted",
        description: "The advertisement has been removed.",
      });

      onAdvertisementsChange();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete advertisement",
        variant: "destructive",
      });
    }
  };

  const togglePublish = async (ad: ProgramAdvertisement) => {
    try {
      const { error } = await supabase
        .from("program_advertisements")
        .update({ is_published: !ad.is_published })
        .eq("id", ad.id);

      if (error) throw error;

      toast({
        title: ad.is_published ? "Unpublished" : "Published",
        description: `Advertisement is now ${ad.is_published ? "hidden" : "visible"}.`,
      });

      onAdvertisementsChange();
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
                <Video className="h-5 w-5" />
                Advertisements
              </CardTitle>
              <CardDescription>
                Add promotional content for the program
              </CardDescription>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Advertisement
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {advertisements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No advertisements yet.</p>
              <p className="text-sm">Add promotional content for this program.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {advertisements.map((ad) => (
                <div key={ad.id} className="flex items-start gap-3 p-4 border rounded-lg">
                  {ad.poster_url && (
                    <img
                      src={ad.poster_url}
                      alt=""
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium truncate">
                        {ad.title || "Untitled Advertisement"}
                      </span>
                      <Badge variant={ad.is_published ? "default" : "secondary"}>
                        {ad.is_published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    {ad.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {ad.description}
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      {ad.poster_url && (
                        <Badge variant="outline" className="gap-1">
                          <Image className="h-3 w-3" />
                          Poster
                        </Badge>
                      )}
                      {ad.video_url && (
                        <Badge variant="outline" className="gap-1">
                          <Video className="h-3 w-3" />
                          Video
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => togglePublish(ad)}>
                      {ad.is_published ? "Unpublish" : "Publish"}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(ad)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(ad.id)}
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
              {editingAd ? "Edit Advertisement" : "New Advertisement"}
            </DialogTitle>
            <DialogDescription>
              Add promotional content for this program
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adTitle">Title</Label>
              <Input
                id="adTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Advertisement title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adDescription">Description</Label>
              <Textarea
                id="adDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Promotional text..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adPosterUrl">Poster Image URL</Label>
              <Input
                id="adPosterUrl"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adVideoUrl">Video URL</Label>
              <Input
                id="adVideoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/..."
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="adIsPublished"
                checked={isPublished}
                onCheckedChange={setIsPublished}
              />
              <Label htmlFor="adIsPublished">Publish immediately</Label>
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
              ) : editingAd ? (
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
