import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function FeatureCards() {
  const features = [
    {
      title: "Private by design",
      description: "Images are processed locally in your browser and never leave your device.",
    },
    {
      title: "Fast",
      description: "Conversion runs directly on the canvas, with results in milliseconds.",
    },
    {
      title: "Free to use",
      description: "No account, no limits, no cost.",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16">
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="bg-white/80 backdrop-blur-sm shadow-lg border-0"
          >
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-[#2D3748]/70">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
