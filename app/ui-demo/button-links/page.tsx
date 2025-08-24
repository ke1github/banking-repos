"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  ExternalLink,
  Home,
  ChevronRight,
  Download,
  CreditCard,
  Briefcase,
} from "lucide-react";

export default function ButtonLinksDemo() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">
          ButtonLink Components
        </h1>
        <p className="text-muted-foreground">
          Reusable link components with button styling for consistent navigation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <ButtonLink href="#" variant="default">
                Default
              </ButtonLink>
              <ButtonLink href="#" variant="destructive">
                Destructive
              </ButtonLink>
              <ButtonLink href="#" variant="outline">
                Outline
              </ButtonLink>
              <ButtonLink href="#" variant="secondary">
                Secondary
              </ButtonLink>
              <ButtonLink href="#" variant="ghost">
                Ghost
              </ButtonLink>
              <ButtonLink href="#" variant="link">
                Link
              </ButtonLink>
              <ButtonLink href="#" variant="gradient">
                Gradient
              </ButtonLink>
            </div>
          </CardContent>
        </Card>

        {/* Sizes */}
        <Card>
          <CardHeader>
            <CardTitle>Sizes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <ButtonLink href="#" size="sm">
                Small
              </ButtonLink>
              <ButtonLink href="#" size="default">
                Default
              </ButtonLink>
              <ButtonLink href="#" size="lg">
                Large
              </ButtonLink>
              <ButtonLink href="#" size="xl">
                Extra Large
              </ButtonLink>
              <ButtonLink href="#" size="wide">
                Wide
              </ButtonLink>
              <ButtonLink href="#" size="narrow">
                Narrow
              </ButtonLink>
            </div>
          </CardContent>
        </Card>

        {/* Shapes */}
        <Card>
          <CardHeader>
            <CardTitle>Shapes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <ButtonLink href="#" shape="default">
                Default Rounded
              </ButtonLink>
              <ButtonLink href="#" shape="rounded">
                Fully Rounded
              </ButtonLink>
              <ButtonLink href="#" shape="square">
                Square
              </ButtonLink>
              <ButtonLink href="#" shape="pill">
                Pill Shape
              </ButtonLink>
            </div>
          </CardContent>
        </Card>

        {/* With Icons */}
        <Card>
          <CardHeader>
            <CardTitle>With Icons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <ButtonLink href="#" icon={<Home className="h-4 w-4" />}>
                Left Icon
              </ButtonLink>
              <ButtonLink
                href="#"
                icon={<ExternalLink className="h-4 w-4" />}
                iconPosition="right"
              >
                Right Icon
              </ButtonLink>
              <ButtonLink href="#" showArrow>
                With Arrow
              </ButtonLink>
              <ButtonLink
                href="#"
                icon={<Download className="h-4 w-4" />}
                shape="rounded"
              >
                Download
              </ButtonLink>
            </div>
          </CardContent>
        </Card>

        {/* Section-Specific */}
        <Card>
          <CardHeader>
            <CardTitle>Section-Specific</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <ButtonLink
                href="#"
                section="banking"
                icon={<CreditCard className="h-4 w-4" />}
              >
                Banking Section
              </ButtonLink>
              <ButtonLink
                href="#"
                section="investment"
                icon={<Briefcase className="h-4 w-4" />}
              >
                Investment Section
              </ButtonLink>
              <ButtonLink href="#" section="dashboard">
                Dashboard Section
              </ButtonLink>
            </div>
          </CardContent>
        </Card>

        {/* Combined Features */}
        <Card>
          <CardHeader>
            <CardTitle>Combined Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <ButtonLink
                href="#"
                variant="gradient"
                size="lg"
                shape="pill"
                icon={<ArrowRight className="h-4 w-4" />}
                iconPosition="right"
              >
                Call to Action
              </ButtonLink>
              <ButtonLink
                href="https://example.com"
                external
                variant="outline"
                icon={<ExternalLink className="h-4 w-4" />}
                iconPosition="right"
              >
                External Link
              </ButtonLink>
              <ButtonLink href="#" variant="banking" size="wide" fullWidth>
                Full Width Banking
              </ButtonLink>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      {/* Real-World Usage Examples */}
      <h2 className="text-2xl font-bold mb-4">Example Usage in Sections</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-700">Banking Section</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Add a new payment card to your account
            </p>
            <ButtonLink
              href="/banking/add-card"
              section="banking"
              size="wide"
              icon={<CreditCard className="h-4 w-4" />}
            >
              Add New Card
            </ButtonLink>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-700">Investment Section</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Explore our advanced stock screening tools
            </p>
            <ButtonLink
              href="/investment/screener"
              section="investment"
              size="wide"
              icon={<ChevronRight className="h-4 w-4" />}
              iconPosition="right"
            >
              Open Screener
            </ButtonLink>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-violet-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-violet-700">Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View your financial overview dashboard
            </p>
            <ButtonLink
              href="/"
              section="dashboard"
              variant="gradient"
              shape="pill"
              icon={<Home className="h-4 w-4" />}
            >
              Go to Dashboard
            </ButtonLink>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
