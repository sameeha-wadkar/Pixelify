import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

export interface PixelArtSettings {
  preset: "retro" | "classic" | "detailed" | "modern";
  pixelSize: number;
  colorCount: number;
  contrast: number;
  dithering: boolean;
}

interface ControlPanelProps {
  settings: PixelArtSettings;
  onSettingsChange: (settings: Partial<PixelArtSettings>) => void;
}

const presets = [
  { id: "retro" as const, name: "Retro", description: "8-bit gaming style" },
  { id: "classic" as const, name: "Classic", description: "Traditional pixel art" },
  { id: "detailed" as const, name: "Detailed", description: "High-resolution pixels" },
  { id: "modern" as const, name: "Modern", description: "Contemporary style" },
];

export function ControlPanel({ settings, onSettingsChange }: ControlPanelProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader>
          <CardTitle>Conversion Settings</CardTitle>
          <CardDescription>Customize your pixel art transformation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Preset Selector */}
          <div>
            <Label className="mb-4 block">Style Preset</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {presets.map((preset) => {
                const isActive = settings.preset === preset.id;
                return (
                  <Card
                    key={preset.id}
                    className={`cursor-pointer transition-colors ${
                      isActive
                        ? "border-2 border-[#667EEA] bg-[#667EEA]/5"
                        : "border border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => onSettingsChange({ preset: preset.id })}
                  >
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-[#2D3748] mb-1">{preset.name}</p>
                      <p className="text-xs text-[#2D3748]/60">{preset.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Slider Controls */}
          <div className="space-y-6">
            {/* Pixel Size */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Pixel Size</Label>
                <span className="text-sm text-[#2D3748]">{settings.pixelSize}px</span>
              </div>
              <Slider
                value={[settings.pixelSize]}
                onValueChange={([value]) => onSettingsChange({ pixelSize: value })}
                min={4}
                max={64}
                step={2}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-[#2D3748]/60 mt-1">
                <span>Fine (4px)</span>
                <span>Coarse (64px)</span>
              </div>
            </div>

            {/* Color Count */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Color Count</Label>
                <span className="text-sm text-[#2D3748]">{settings.colorCount} colors</span>
              </div>
              <Slider
                value={[settings.colorCount]}
                onValueChange={([value]) => onSettingsChange({ colorCount: value })}
                min={4}
                max={64}
                step={4}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-[#2D3748]/60 mt-1">
                <span>Limited (4)</span>
                <span>Rich (64)</span>
              </div>
            </div>

            {/* Contrast */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Contrast</Label>
                <span className="text-sm text-[#2D3748]">{settings.contrast.toFixed(1)}x</span>
              </div>
              <Slider
                value={[settings.contrast]}
                onValueChange={([value]) => onSettingsChange({ contrast: value })}
                min={0.5}
                max={2.0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-[#2D3748]/60 mt-1">
                <span>Low (0.5x)</span>
                <span>High (2.0x)</span>
              </div>
            </div>
          </div>

          {/* Dithering toggle */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Label htmlFor="dithering">Dithering</Label>
            <Switch
              id="dithering"
              checked={settings.dithering}
              onCheckedChange={(checked) => onSettingsChange({ dithering: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
