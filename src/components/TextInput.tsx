import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PenTool, FileText } from "lucide-react";
import { marked } from "marked";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onDrawText: () => void;
}

export const TextInput = ({ value, onChange, onDrawText }: TextInputProps) => {
  const [previewMode, setPreviewMode] = useState(false);

  const parseMarkdown = async (text: string) => {
    return await marked(text);
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <Label htmlFor="text-input" className="text-lg font-semibold gradient-text">
          Text eingeben (Markdown unterstützt)
        </Label>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={togglePreview}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            {previewMode ? "Bearbeiten" : "Vorschau"}
          </Button>
        </div>
      </div>
      
      {previewMode ? (
        <div className="min-h-[200px] p-4 border rounded-lg bg-card prose prose-sm max-w-none">
          <div className="text-card-foreground">
            {value.split('\n').map((line, index) => (
              <div key={index}>{line || <br />}</div>
            ))}
          </div>
        </div>
      ) : (
        <Textarea
          id="text-input"
          placeholder="Fügen Sie hier Ihren Text ein. Markdown wird unterstützt:

# Überschrift
## Unterüberschrift

**Fett** und *kursiv* Text

- Aufzählungspunkt 1
- Aufzählungspunkt 2

1. Nummerierte Liste
2. Zweiter Punkt

> Zitat

`Code` und ```Codeblöcke```"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[200px] resize-none smooth-transition"
        />
      )}
      
      <Button
        onClick={onDrawText}
        className="mt-4 w-full flex items-center gap-2 glow-effect"
        disabled={!value.trim()}
      >
        <PenTool className="w-4 h-4" />
        Text in Handschrift umwandeln
      </Button>
      
      <p className="text-sm text-muted-foreground mt-2 text-center">
        Geben Sie ChatGPT-Antworten oder beliebigen Text ein und konvertieren Sie ihn in natürliche Handschrift
      </p>
    </Card>
  );
};