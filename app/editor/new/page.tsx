import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shuffle, List, Dice1 } from "lucide-react";

export default function EditorPage() {
  return (
    <div className="flex justify-center py-6 md:py-8 px-4 md:px-6">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create New Project
          </h1>
          <p className="text-muted-foreground mt-1">
            Choose a template or start from scratch
          </p>
        </div>

        {/* Project Name */}
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Give your project a name</CardDescription>
          </CardHeader>
          <CardContent>
            <Input placeholder="Enter project name..." />
          </CardContent>
        </Card>

        {/* Templates */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Choose a Template</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader>
                <Shuffle className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Simple Randomizer</CardTitle>
                <CardDescription>Pick random items from a list</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Use Template</Button>
              </CardContent>
            </Card>

            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader>
                <List className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Team Generator</CardTitle>
                <CardDescription>
                  Create random teams from a list
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Use Template</Button>
              </CardContent>
            </Card>

            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader>
                <Dice1 className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Number Generator</CardTitle>
                <CardDescription>Generate random numbers</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Use Template</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Or blank */}
        <Card>
          <CardHeader>
            <CardTitle>Start from Scratch</CardTitle>
            <CardDescription>
              Create a custom randomizer with your own settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Create Blank Project
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
