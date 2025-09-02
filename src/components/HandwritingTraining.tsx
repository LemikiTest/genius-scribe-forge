import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Path } from "fabric";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface HandwritingTrainingProps {
  onComplete: (trainedLetters: Record<string, any[]>) => void;
  onClose: () => void;
}

const trainingLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

export const HandwritingTraining = ({ onComplete, onClose }: HandwritingTrainingProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trainedLetters, setTrainedLetters] = useState<Record<string, any[]>>({});
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const currentLetter = trainingLetters[currentIndex];
  const progress = ((currentIndex + 1) / trainingLetters.length) * 100;

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 300,
      height: 300,
      backgroundColor: '#ffffff',
      isDrawingMode: true,
    });

    // Konfiguriere Zeichenmodus
    canvas.freeDrawingBrush.color = '#2d1b69';
    canvas.freeDrawingBrush.width = 3;

    canvas.on('path:created', () => {
      setHasDrawn(true);
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [currentIndex]);

  const saveCurrentLetter = () => {
    if (!fabricCanvas || !hasDrawn) {
      toast("Bitte zeichnen Sie den Buchstaben!");
      return;
    }

    // Speichere alle gezeichneten Pfade für diesen Buchstaben
    const objects = fabricCanvas.getObjects();
    const letterPaths = objects.map(obj => {
      const pathObj = obj as Path;
      return {
        pathString: pathObj.toSVG(),
        left: obj.left || 0,
        top: obj.top || 0,
        scaleX: obj.scaleX || 1,
        scaleY: obj.scaleY || 1,
      };
    });

    setTrainedLetters(prev => ({ ...prev, [currentLetter]: letterPaths }));
    setHasDrawn(false);
    
    if (currentIndex < trainingLetters.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Training abgeschlossen
      onComplete({ ...trainedLetters, [currentLetter]: letterPaths });
      toast("Handschrift-Training abgeschlossen! Sie können jetzt Ihren Text eingeben.");
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setHasDrawn(false);
    }
  };

  const clearCanvas = () => {
    if (fabricCanvas) {
      fabricCanvas.clear();
      fabricCanvas.backgroundColor = '#ffffff';
      fabricCanvas.renderAll();
      setHasDrawn(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="glass-card p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold gradient-text mb-2">Ihre Handschrift lernen</h2>
          <p className="text-muted-foreground">
            Zeichnen Sie den Buchstaben "<span className="text-xl font-bold text-primary">{currentLetter.toUpperCase()}</span>" so, wie Sie normalerweise schreiben
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Buchstabe {currentIndex + 1} von {trainingLetters.length}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Letter Display */}
          <div className="text-center">
            <div className="text-9xl font-serif mb-4 text-primary/70 select-none">
              {currentLetter.toUpperCase()}
            </div>
            <div className="text-6xl font-serif mb-4 text-primary/50 select-none">
              {currentLetter.toLowerCase()}
            </div>
            <p className="text-sm text-muted-foreground">
              Schauen Sie sich den Buchstaben an und zeichnen Sie ihn nach
            </p>
          </div>

          {/* Drawing Canvas */}
          <div className="flex flex-col items-center">
            <div className="border-2 border-primary rounded-lg p-4 bg-white">
              <canvas
                ref={canvasRef}
                className="border border-gray-200 rounded cursor-crosshair"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={clearCanvas}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Löschen
              </Button>
              <span className="text-sm text-muted-foreground flex items-center">
                {hasDrawn ? "✓ Gezeichnet" : "Zeichnen Sie den Buchstaben"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          </div>

          <div className="space-x-2">
            <Button 
              onClick={saveCurrentLetter}
              disabled={!hasDrawn}
              className="flex items-center gap-2"
            >
              {currentIndex === trainingLetters.length - 1 ? (
                <>
                  <Check className="w-4 h-4" />
                  Training abschließen
                </>
              ) : (
                <>
                  Buchstabe speichern
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};