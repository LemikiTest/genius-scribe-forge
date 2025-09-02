import { ArrowRight, Zap, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
            ChatGPT Antworten in
            <br />
            <span className="text-primary">echte Handschrift</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Verwandeln Sie digitalen Text in natürlich wirkende Handschrift. 
            Perfekt für Notizen, Studium und kreative Projekte.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 glow-effect"
              onClick={onGetStarted}
            >
              Jetzt kostenlos starten
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Demo ansehen
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="glass-card p-6 text-center smooth-transition hover:scale-105">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Blitzschnell</h3>
              <p className="text-muted-foreground">
                Konvertieren Sie Text in Sekunden zu natürlicher Handschrift
              </p>
            </Card>

            <Card className="glass-card p-6 text-center smooth-transition hover:scale-105">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Markdown Support</h3>
              <p className="text-muted-foreground">
                Vollständige Unterstützung für Markdown-Formatierung
              </p>
            </Card>

            <Card className="glass-card p-6 text-center smooth-transition hover:scale-105">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">GoodNotes Ready</h3>
              <p className="text-muted-foreground">
                Direkter Export als PDF für GoodNotes und andere Apps
              </p>
            </Card>
          </div>

          {/* Use Cases */}
          <div className="glass-card p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-6 gradient-text">Perfekt für</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="font-semibold mb-2">📚 Studenten & Schüler</h4>
                <p className="text-muted-foreground">
                  Verwandeln Sie ChatGPT-Antworten in handgeschriebene Notizen für besseres Lernen
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">👨‍🏫 Lehrkräfte</h4>
                <p className="text-muted-foreground">
                  Erstellen Sie persönliche, handgeschriebene Materialien für den Unterricht
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">💼 Berufstätige</h4>
                <p className="text-muted-foreground">
                  Professionelle handgeschriebene Dokumente für Meetings und Präsentationen
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🎨 Kreative</h4>
                <p className="text-muted-foreground">
                  Einzigartige handgeschriebene Designs für Projekte und Kunstwerke
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};