import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";

interface HandwritingTrainingProps {
  onComplete: (trainedLetters: Record<string, string>) => void;
  onClose: () => void;
}

const trainingLetters = ['a', 'e', 'i', 'o', 'u', 'n', 'm', 'r', 's', 't', 'l', 'd', 'h', 'c', 'f'];

export const HandwritingTraining = ({ onComplete, onClose }: HandwritingTrainingProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trainedLetters, setTrainedLetters] = useState<Record<string, string>>({});
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>("");

  const currentLetter = trainingLetters[currentIndex];
  const progress = ((currentIndex + 1) / trainingLetters.length) * 100;

  const handleNext = () => {
    if (currentIndex < trainingLetters.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentPath("");
    } else {
      // Training complete
      onComplete(trainedLetters);
      toast("Handschrift-Training abgeschlossen!");
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentPath("");
    }
  };

  const handleSkip = () => {
    // Use default letter shape
    const defaultPath = generateDefaultLetterPath(currentLetter);
    setTrainedLetters(prev => ({ ...prev, [currentLetter]: defaultPath }));
    handleNext();
  };

  const generateDefaultLetterPath = (letter: string): string => {
    // Generate basic letter paths
    const paths: Record<string, string> = {
      'a': 'M 10 30 Q 20 10 30 30 L 40 30 M 15 25 L 35 25',
      'e': 'M 10 20 Q 25 10 40 20 Q 25 30 10 20',
      'i': 'M 20 15 L 20 30 M 20 10 L 20 12',
      'o': 'M 10 20 Q 25 10 40 20 Q 25 30 10 20 Z',
      'u': 'M 10 15 L 10 25 Q 20 35 30 25 L 30 15',
      'n': 'M 10 30 L 10 15 Q 20 10 30 15 L 30 30',
      'm': 'M 5 30 L 5 15 Q 12 10 20 15 L 20 30 M 20 15 Q 27 10 35 15 L 35 30',
      'r': 'M 10 30 L 10 15 Q 20 10 30 15',
      's': 'M 30 18 Q 20 10 10 18 Q 20 25 30 30',
      't': 'M 20 12 L 20 28 Q 25 32 30 28 M 15 18 L 25 18',
      'l': 'M 20 8 L 20 30',
      'd': 'M 35 8 L 35 30 M 10 20 Q 22 10 35 20 Q 22 30 10 20',
      'h': 'M 10 8 L 10 30 M 10 18 Q 20 15 30 18 L 30 30',
      'c': 'M 30 18 Q 20 10 10 18 Q 20 26 30 22',
      'f': 'M 25 8 Q 20 5 15 8 L 15 30 M 10 18 L 22 18'
    };
    return paths[letter] || 'M 10 30 L 10 15 L 30 15';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="glass-card p-8 max-w-2xl w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold gradient-text mb-2">Handschrift-Training</h2>
          <p className="text-muted-foreground">
            Zeichnen Sie den Buchstaben "{currentLetter.toUpperCase()}" in das lila Feld
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
            <div className="text-8xl font-serif mb-4 text-primary">
              {currentLetter.toUpperCase()}
            </div>
            <p className="text-sm text-muted-foreground">
              Zeichnen Sie diesen Buchstaben nach
            </p>
          </div>

          {/* Drawing Canvas */}
          <div className="flex flex-col items-center">
            <div 
              className="w-64 h-64 border-2 border-primary border-dashed rounded-lg bg-primary/5 relative cursor-crosshair"
              style={{ touchAction: 'none' }}
            >
              <canvas
                width={256}
                height={256}
                className="absolute inset-0 w-full h-full"
                onMouseDown={(e) => setIsDrawing(true)}
                onMouseUp={() => setIsDrawing(false)}
                onMouseMove={(e) => {
                  if (isDrawing) {
                    // Simplified drawing - in real implementation you'd track the actual path
                    setCurrentPath("drawn");
                  }
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-primary/30 text-sm">Zeichnen Sie hier</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setCurrentPath("");
                setIsDrawing(false);
              }}
            >
              Löschen
            </Button>
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
            <Button variant="outline" onClick={handleSkip}>
              Überspringen
            </Button>
            <Button 
              onClick={() => {
                // Save the drawn letter
                const path = currentPath || generateDefaultLetterPath(currentLetter);
                setTrainedLetters(prev => ({ ...prev, [currentLetter]: path }));
                handleNext();
              }}
              disabled={!currentPath && currentIndex === trainingLetters.length - 1}
            >
              {currentIndex === trainingLetters.length - 1 ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Fertig
                </>
              ) : (
                <>
                  Weiter
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};