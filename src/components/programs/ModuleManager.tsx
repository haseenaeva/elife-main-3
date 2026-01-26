import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Megaphone, FileText, Video, Globe } from "lucide-react";
import { ProgramModule } from "@/hooks/usePrograms";

interface ModuleManagerProps {
  programId: string;
  modules: ProgramModule[];
  onModulesChange: () => void;
}

const MODULE_TYPES = [
  {
    type: "announcement",
    label: "Announcement",
    description: "Share news and updates with participants",
    icon: Megaphone,
  },
  {
    type: "registration",
    label: "Registration Form",
    description: "Allow users to register for this program",
    icon: FileText,
  },
  {
    type: "advertisement",
    label: "Advertisement",
    description: "Display promotional content for the program",
    icon: Video,
  },
];

export function ModuleManager({ programId, modules, onModulesChange }: ModuleManagerProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  const getModule = (type: string) => modules.find((m) => m.module_type === type);

  const handleModuleToggle = async (type: string) => {
    setIsUpdating(type);
    const existingModule = getModule(type);

    try {
      if (existingModule) {
        // Delete module
        const { error } = await supabase
          .from("program_modules")
          .delete()
          .eq("id", existingModule.id);

        if (error) throw error;

        toast({
          title: "Module disabled",
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} module has been removed.`,
        });
      } else {
        // Create module
        const { error } = await supabase.from("program_modules").insert({
          program_id: programId,
          module_type: type,
          is_published: false,
        });

        if (error) throw error;

        toast({
          title: "Module enabled",
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} module has been added.`,
        });
      }

      onModulesChange();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update module",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handlePublishToggle = async (moduleId: string, currentStatus: boolean) => {
    setIsUpdating(moduleId);

    try {
      const { error } = await supabase
        .from("program_modules")
        .update({ is_published: !currentStatus })
        .eq("id", moduleId);

      if (error) throw error;

      toast({
        title: !currentStatus ? "Module published" : "Module unpublished",
        description: !currentStatus
          ? "This module is now visible to the public."
          : "This module is now hidden from the public.",
      });

      onModulesChange();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update publish status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Program Modules
        </CardTitle>
        <CardDescription>
          Enable or disable features for this program. Toggle publish to make them visible.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {MODULE_TYPES.map((moduleType) => {
          const module = getModule(moduleType.type);
          const isEnabled = !!module;
          const isPublished = module?.is_published || false;
          const Icon = moduleType.icon;

          return (
            <div
              key={moduleType.type}
              className="flex items-start justify-between p-4 border rounded-lg"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted rounded-md">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Label className="font-medium">{moduleType.label}</Label>
                    {isEnabled && (
                      <Badge variant={isPublished ? "default" : "secondary"}>
                        {isPublished ? "Published" : "Draft"}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{moduleType.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {isEnabled && (
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`publish-${moduleType.type}`} className="text-sm">
                      Publish
                    </Label>
                    <Switch
                      id={`publish-${moduleType.type}`}
                      checked={isPublished}
                      onCheckedChange={() => handlePublishToggle(module!.id, isPublished)}
                      disabled={isUpdating === module?.id}
                    />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Label htmlFor={`enable-${moduleType.type}`} className="text-sm">
                    Enable
                  </Label>
                  <Switch
                    id={`enable-${moduleType.type}`}
                    checked={isEnabled}
                    onCheckedChange={() => handleModuleToggle(moduleType.type)}
                    disabled={isUpdating === moduleType.type}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
