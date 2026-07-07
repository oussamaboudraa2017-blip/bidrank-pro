"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calculator, ArrowRight, Clock, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RoiCalculator() {
  const [rfpsPerMonth, setRfpsPerMonth] = useState(5);
  const [hoursPerRfp, setHoursPerRfp] = useState(12);

  const { monthlyHours, annualHours, annualCost } = useMemo(() => {
    const monthlyHours = rfpsPerMonth * hoursPerRfp;
    const annualHours = monthlyHours * 12;
    const annualCost = annualHours * 125;
    return { monthlyHours, annualHours, annualCost };
  }, [rfpsPerMonth, hoursPerRfp]);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-br-primary flex items-center gap-2">
          <Calculator className="w-5 h-5 text-br-accent" />
          Calculate Your ROI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rfps-per-month" className="text-sm font-medium text-br-dark/80">
              RFPs analyzed per month
            </Label>
            <Input
              id="rfps-per-month"
              type="number"
              min={1}
              value={rfpsPerMonth}
              onChange={(e) => setRfpsPerMonth(Math.max(1, Number(e.target.value)))}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hours-per-rfp" className="text-sm font-medium text-br-dark/80">
              Hours per RFP manually
            </Label>
            <Input
              id="hours-per-rfp"
              type="number"
              min={1}
              value={hoursPerRfp}
              onChange={(e) => setHoursPerRfp(Math.max(1, Number(e.target.value)))}
              className="h-11"
            />
          </div>
        </div>

        {/* Stat boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg bg-br-light p-4 text-center">
            <Clock className="w-5 h-5 text-br-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-br-primary font-mono-data">{monthlyHours}</p>
            <p className="text-xs text-br-dark/60 mt-1">hours saved/month</p>
          </div>
          <div className="rounded-lg bg-br-light p-4 text-center">
            <TrendingUp className="w-5 h-5 text-br-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-br-primary font-mono-data">{annualHours.toLocaleString()}</p>
            <p className="text-xs text-br-dark/60 mt-1">hours saved/year</p>
          </div>
          <div className="rounded-lg bg-br-accent/10 p-4 text-center border border-br-accent/20">
            <DollarSign className="w-5 h-5 text-br-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-br-accent font-mono-data">
              ${annualCost.toLocaleString()}
            </p>
            <p className="text-xs text-br-dark/60 mt-1">saved/year</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-2">
          <Link href="/free-tool">
            <Button
              size="lg"
              variant="secondary"
              className="font-semibold"
            >
              Try Free Analysis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}