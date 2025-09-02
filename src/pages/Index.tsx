import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TextInput } from "@/components/TextInput";
import { BackgroundSelector } from "@/components/BackgroundSelector";
import { HandwritingCanvas } from "@/components/HandwritingCanvas";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<"hero" | "editor">("hero");
  const [inputText, setInputText] = useState("");
  const [selectedBackground, setSelectedBackground] = useState("#ffffff");
  const [hasDrawnText, setHasDrawnText] = useState(false);

  const handleGetStarted = () => {
    setCurrentStep("editor");
    toast("Willkommen bei Geniedetache! Geben Sie Ihren Text ein, um zu beginnen.");
  };

  const handleDrawText = () => {
    if (inputText.trim()) {
      setHasDrawnText(true);
      toast("Text wird in Handschrift umgewandelt...");
    }
  };

  const handleBackToHero = () => {
    setCurrentStep("hero");
    setHasDrawnText(false);
    setInputText("");
  };

  const handleExport = () => {
    toast("PDF wurde erfolgreich erstellt und heruntergeladen!");
  };

  if (currentStep === "hero") {
    return (
      <div className="min-h-screen">
        <Header />
        <Hero onGetStarted={handleGetStarted} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={handleBackToHero}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Startseite
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Input & Settings */}
          <div className="space-y-6">
            <TextInput
              value={inputText}
              onChange={setInputText}
              onDrawText={handleDrawText}
            />
            
            <BackgroundSelector
              selectedBackground={selectedBackground}
              onBackgroundChange={setSelectedBackground}
            />
          </div>

          {/* Right Column - Canvas */}
          <div>
            {hasDrawnText ? (
              <HandwritingCanvas
                text={inputText}
                selectedBackground={selectedBackground}
                onExport={handleExport}
              />
            ) : (
              <div className="glass-card p-12 text-center rounded-2xl">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 border-2 border-primary border-dashed rounded"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 gradient-text">
                    Bereit für Ihre Handschrift
                  </h3>
                  <p className="text-muted-foreground">
                    Geben Sie Text ein und klicken Sie auf "Text in Handschrift umwandeln", um zu beginnen.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
