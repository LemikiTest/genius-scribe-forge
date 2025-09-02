import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Check } from "lucide-react";
import { toast } from "sonner";

interface BackgroundSelectorProps {
  selectedBackground: string;
  onBackgroundChange: (background: string) => void;
}

const predefinedBackgrounds = [
  { id: "white", name: "Weißes Papier", color: "#ffffff", pattern: "none" },
  { id: "cream", name: "Cremefarbenes Papier", color: "#fef7ed", pattern: "none" },
  { id: "yellow", name: "Gelbes Papier", color: "#fefce8", pattern: "none" },
  { id: "lined", name: "Liniert", color: "#ffffff", pattern: "lined" },
  { id: "grid", name: "Kariert", color: "#ffffff", pattern: "grid" },
  { id: "dotted", name: "Gepunktet", color: "#ffffff", pattern: "dotted" },
];

export const BackgroundSelector = ({ selectedBackground, onBackgroundChange }: BackgroundSelectorProps) => {
  const [customBackground, setCustomBackground] = useState<string>("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setCustomBackground(result);
          onBackgroundChange(result);
          toast("Hintergrund erfolgreich hochgeladen!");
        };
        reader.readAsDataURL(file);
      } else {
        toast("Bitte wählen Sie eine Bilddatei oder PDF aus.");
      }
    }
  };

  const getBackgroundStyle = (bg: any) => {
    if (bg.pattern === "lined") {
      return {
        backgroundColor: bg.color,
        backgroundImage: `repeating-linear-gradient(
          transparent,
          transparent 23px,
          #e2e8f0 23px,
          #e2e8f0 24px
        )`
      };
    } else if (bg.pattern === "grid") {
      return {
        backgroundColor: bg.color,
        backgroundImage: `
          linear-gradient(to right, #e2e8f0 1px, transparent 1px),
          linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
        `,
        backgroundSize: "24px 24px"
      };
    } else if (bg.pattern === "dotted") {
      return {
        backgroundColor: bg.color,
        backgroundImage: `radial-gradient(circle, #e2e8f0 1px, transparent 1px)`,
        backgroundSize: "24px 24px"
      };
    }
    return { backgroundColor: bg.color };
  };

  return (
    <Card className="glass-card p-6">
      <Label className="text-lg font-semibold mb-4 block gradient-text">
        Papierhintergrund wählen
      </Label>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {predefinedBackgrounds.map((bg) => (
          <div
            key={bg.id}
            className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
              selectedBackground === bg.color
                ? "border-primary ring-2 ring-primary/20"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => onBackgroundChange(bg.color)}
          >
            <div
              className="w-full h-20 rounded-t-lg"
              style={getBackgroundStyle(bg)}
            />
            <div className="p-2 text-center">
              <span className="text-xs font-medium">{bg.name}</span>
            </div>
            {selectedBackground === bg.color && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <Label htmlFor="background-upload" className="text-sm font-medium">
          Eigenen Hintergrund hochladen
        </Label>
        <div className="flex gap-2">
          <Input
            id="background-upload"
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            className="flex-1"
          />
          <Button variant="outline" size="icon" asChild>
            <label htmlFor="background-upload" className="cursor-pointer">
              <Upload className="w-4 h-4" />
            </label>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Unterstützte Formate: PNG, JPG, PDF
        </p>
      </div>
    </Card>
  );
};