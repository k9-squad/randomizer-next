import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Play, Settings, Share2, Save } from "lucide-react";
import Link from "next/link";

export default function ProjectPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex justify-center py-6 md:py-8 px-4 md:px-6">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Project {params.id}</h1>
              <p className="text-sm text-muted-foreground">
                Last edited: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left side - Input */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Input</CardTitle>
                  <CardDescription>
                    Enter your items to randomize
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Input
                    key={i}
                    placeholder={`Item ${i}`}
                    defaultValue={i <= 3 ? `Sample Item ${i}` : ""}
                  />
                ))}
                <Button variant="outline" className="w-full">
                  Add More Items
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right side - Output */}
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
              <CardDescription>
                Your randomized output will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    Click the button below to randomize
                  </p>
                  <Button size="lg">
                    <Play className="mr-2 h-5 w-5" />
                    Randomize
                  </Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Total items: 3</p>
                <p>Last randomized: Never</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Configure your randomizer options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Results</label>
                <Input type="number" defaultValue="1" min="1" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Allow Duplicates</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Animation Speed</label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                  <option>Fast</option>
                  <option>Normal</option>
                  <option>Slow</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
