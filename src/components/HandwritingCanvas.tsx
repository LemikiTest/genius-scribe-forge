import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Path, Group } from "fabric";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Download, Eraser } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

interface HandwritingCanvasProps {
  text: string;
  selectedBackground: string;
  onExport?: () => void;
}

export const HandwritingCanvas = ({ text, selectedBackground, onExport }: HandwritingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [letterSpacing, setLetterSpacing] = useState([8]);
  const [wordSpacing, setWordSpacing] = useState([20]);
  const [letterSize, setLetterSize] = useState([16]);
  const [lineSpacing, setLineSpacing] = useState([24]);
  const [lineWidth, setLineWidth] = useState([2]);
  const [messyFactor, setMessyFactor] = useState([0.3]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: selectedBackground,
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [selectedBackground]);

  const generateHandwritingPath = (char: string, x: number, y: number) => {
    const size = letterSize[0];
    const messy = messyFactor[0];
    const width = lineWidth[0];
    
    // Simple letter path generation (this is a simplified version)
    // In a real implementation, you'd have trained letter shapes
    const randomOffset = () => (Math.random() - 0.5) * messy * 2;
    
    let path = "";
    switch (char.toLowerCase()) {
      case 'a':
        path = `M ${x + randomOffset()} ${y + randomOffset()} 
                Q ${x + size/3 + randomOffset()} ${y - size/2 + randomOffset()} ${x + size/2 + randomOffset()} ${y + randomOffset()}
                L ${x + size + randomOffset()} ${y + randomOffset()}
                M ${x + size/4 + randomOffset()} ${y - size/4 + randomOffset()} 
                L ${x + 3*size/4 + randomOffset()} ${y - size/4 + randomOffset()}`;
        break;
      case 'e':
        path = `M ${x + randomOffset()} ${y - size/4 + randomOffset()} 
                Q ${x + size/2 + randomOffset()} ${y - size/2 + randomOffset()} ${x + size + randomOffset()} ${y - size/4 + randomOffset()}
                Q ${x + size/2 + randomOffset()} ${y + randomOffset()} ${x + randomOffset()} ${y - size/4 + randomOffset()}`;
        break;
      case 'l':
        path = `M ${x + randomOffset()} ${y - size + randomOffset()} 
                L ${x + randomOffset()} ${y + randomOffset()}`;
        break;
      case 'o':
        path = `M ${x + randomOffset()} ${y - size/4 + randomOffset()} 
                Q ${x + size/2 + randomOffset()} ${y - size/2 + randomOffset()} ${x + size + randomOffset()} ${y - size/4 + randomOffset()}
                Q ${x + size/2 + randomOffset()} ${y + randomOffset()} ${x + randomOffset()} ${y - size/4 + randomOffset()} Z`;
        break;
      case ' ':
        return null;
      default:
        // Generic letter shape
        path = `M ${x + randomOffset()} ${y + randomOffset()} 
                L ${x + randomOffset()} ${y - size/2 + randomOffset()}
                L ${x + size/2 + randomOffset()} ${y - size/2 + randomOffset()}`;
        break;
    }
    
    return new Path(path, {
      fill: '',
      stroke: '#2d1b69',
      strokeWidth: width,
      selectable: false,
    });
  };

  const renderHandwriting = () => {
    if (!fabricCanvas || !text) return;

    fabricCanvas.clear();
    fabricCanvas.backgroundColor = selectedBackground;

    const lines = text.split('\n');
    let currentY = 80;
    
    lines.forEach((line) => {
      let currentX = 60;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const pathObj = generateHandwritingPath(char, currentX, currentY);
        
        if (pathObj) {
          fabricCanvas.add(pathObj);
        }
        
        if (char === ' ') {
          currentX += wordSpacing[0];
        } else {
          currentX += letterSize[0] + letterSpacing[0];
        }
        
        // Line wrapping
        if (currentX > 720) {
          currentY += lineSpacing[0];
          currentX = 60;
        }
      }
      
      currentY += lineSpacing[0];
    });

    fabricCanvas.renderAll();
  };

  useEffect(() => {
    renderHandwriting();
  }, [text, letterSpacing, wordSpacing, letterSize, lineSpacing, lineWidth, messyFactor, fabricCanvas]);

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = selectedBackground;
    fabricCanvas.renderAll();
    toast("Canvas gelöscht!");
  };

  const handleExportPDF = () => {
    if (!fabricCanvas) return;
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = fabricCanvas.toDataURL({ format: 'png', multiplier: 1 });
    
    // A4 dimensions in mm: 210 x 297
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 142.5);
    pdf.save('geniedetache-handwriting.pdf');
    
    toast("PDF erfolgreich exportiert!");
    onExport?.();
  };

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <Card className="glass-card p-6">
        <div className="border-2 border-dashed border-primary/20 rounded-lg overflow-hidden">
          <canvas ref={canvasRef} className="handwriting-canvas max-w-full" />
        </div>
      </Card>

      {/* Controls */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 gradient-text">Handschrift anpassen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Buchstabenabstand</Label>
            <Slider
              value={letterSpacing}
              onValueChange={setLetterSpacing}
              min={2}
              max={20}
              step={1}
              className="smooth-transition"
            />
            <span className="text-sm text-muted-foreground">{letterSpacing[0]}px</span>
          </div>

          <div className="space-y-2">
            <Label>Wortabstand</Label>
            <Slider
              value={wordSpacing}
              onValueChange={setWordSpacing}
              min={10}
              max={40}
              step={2}
              className="smooth-transition"
            />
            <span className="text-sm text-muted-foreground">{wordSpacing[0]}px</span>
          </div>

          <div className="space-y-2">
            <Label>Buchstabengröße</Label>
            <Slider
              value={letterSize}
              onValueChange={setLetterSize}
              min={8}
              max={32}
              step={1}
              className="smooth-transition"
            />
            <span className="text-sm text-muted-foreground">{letterSize[0]}px</span>
          </div>

          <div className="space-y-2">
            <Label>Zeilenabstand</Label>
            <Slider
              value={lineSpacing}
              onValueChange={setLineSpacing}
              min={16}
              max={48}
              step={2}
              className="smooth-transition"
            />
            <span className="text-sm text-muted-foreground">{lineSpacing[0]}px</span>
          </div>

          <div className="space-y-2">
            <Label>Strichstärke</Label>
            <Slider
              value={lineWidth}
              onValueChange={setLineWidth}
              min={1}
              max={5}
              step={0.5}
              className="smooth-transition"
            />
            <span className="text-sm text-muted-foreground">{lineWidth[0]}px</span>
          </div>

          <div className="space-y-2">
            <Label>Unordentlichkeit</Label>
            <Slider
              value={messyFactor}
              onValueChange={setMessyFactor}
              min={0}
              max={2}
              step={0.1}
              className="smooth-transition"
            />
            <span className="text-sm text-muted-foreground">{messyFactor[0].toFixed(1)}</span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={handleClear} variant="outline" className="flex items-center gap-2">
            <Eraser className="w-4 h-4" />
            Löschen
          </Button>
          <Button onClick={handleExportPDF} className="flex items-center gap-2 glow-effect">
            <Download className="w-4 h-4" />
            Als GoodNotes PDF speichern
          </Button>
        </div>
      </Card>
    </div>
  );
};