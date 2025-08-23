"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Calculator,
  RefreshCw,
  Download,
  ArrowRight,
  Sliders,
} from "lucide-react";
import { fundamentalAnalysisService } from "@/lib/api/fundamentalAnalysisService";
import { ValuationModel } from "@/lib/types/fundamental-analysis-types";

export default function ValuationModels() {
  const [searchTicker, setSearchTicker] = useState("");
  const [ticker, setTicker] = useState("AAPL");
  const [modelType, setModelType] = useState("DCF");
  const [valuationModels, setValuationModels] = useState<ValuationModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [customParams, setCustomParams] = useState({
    discountRate: 10,
    terminalGrowthRate: 3,
    projectionYears: 5,
  });

  useEffect(() => {
    fetchValuationData();
  }, [ticker, modelType]);

  const fetchValuationData = async () => {
    setLoading(true);
    try {
      const data = await fundamentalAnalysisService.getValuationModels(ticker);

      // Convert the record to an array and filter by model type if needed
      const modelsArray = Object.values(data);
      const filteredModels =
        modelType === "All"
          ? modelsArray
          : modelsArray.filter((model) => model.modelType === modelType);

      setValuationModels(filteredModels);
    } catch (error) {
      console.error("Error fetching valuation data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTicker.trim()) {
      setTicker(searchTicker.toUpperCase());
    }
  };

  const handleCustomParamChange = (param: string, value: number) => {
    setCustomParams((prev) => ({
      ...prev,
      [param]: value,
    }));
  };

  const recalculateModel = async () => {
    setLoading(true);
    try {
      // Since there's no actual recalculation API, we'll simulate it
      // by applying the custom parameters to the current model
      if (valuationModels.length === 0) {
        await fetchValuationData();
        return;
      }

      const currentModel = { ...valuationModels[0] };

      // Apply custom parameters
      currentModel.discountRate = customParams.discountRate;
      currentModel.projectionYears = customParams.projectionYears;
      currentModel.terminalGrowthRate = customParams.terminalGrowthRate;

      // Simple recalculation logic (in a real app, this would be more complex)
      // This is just a very simplified example of how DCF changes with discount rate
      const baseFairValue = currentModel.fairValue;
      const baseDiscountRate = 10; // Assume 10% is the base discount rate

      // Adjust fair value based on discount rate change (simplified calculation)
      const adjustmentFactor =
        (1 + baseDiscountRate / 100) / (1 + customParams.discountRate / 100);
      currentModel.fairValue = baseFairValue * adjustmentFactor;

      // Recalculate upside based on new fair value
      const currentPrice = baseFairValue / (1 + currentModel.upside / 100);
      currentModel.upside = (currentModel.fairValue / currentPrice - 1) * 100;

      // Update sensitivity matrix if it exists
      if (currentModel.sensitivity && currentModel.sensitivity.matrix) {
        // Adjust all values in the sensitivity matrix by the same factor
        currentModel.sensitivity.matrix = currentModel.sensitivity.matrix.map(
          (row) => row.map((value) => value * adjustmentFactor)
        );
      }

      setValuationModels([currentModel, ...valuationModels.slice(1)]);
    } catch (error) {
      console.error("Error recalculating valuation model:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  const downloadValuationReport = () => {
    if (!valuationModels.length) return;

    const model = valuationModels[0];

    // Create a simple report for downloading
    const reportContent = `
Valuation Report for ${ticker}
Model Type: ${model.modelType}
Generated: ${new Date().toLocaleDateString()}

Fair Value Estimate: ${formatCurrency(model.fairValue)}
Upside Potential: ${formatPercentage(model.upside)}

Key Assumptions:
- Discount Rate: ${model.discountRate}%
- Terminal Growth Rate: ${model.terminalGrowthRate || "N/A"}%
- Projection Years: ${model.projectionYears}

Sensitivity Analysis:
${model.sensitivity.discountRates
  .map(
    (dr, i) =>
      `Discount Rate ${dr}%: Fair Value Range ${model.sensitivity.growthRates
        .map((gr) =>
          formatCurrency(
            model.sensitivity.matrix[i][
              model.sensitivity.growthRates.indexOf(gr)
            ]
          )
        )
        .join(" - ")}`
  )
  .join("\n")}

This valuation is for informational purposes only and should not be used as the sole basis for investment decisions.
`;

    const blob = new Blob([reportContent], {
      type: "text/plain;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${ticker}_${modelType}_valuation.txt`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const modelTypeOptions = [
    { value: "All", label: "All Models" },
    { value: "DCF", label: "Discounted Cash Flow" },
    { value: "DDM", label: "Dividend Discount Model" },
    { value: "Comparables", label: "Comparable Company Analysis" },
    { value: "AssetBased", label: "Asset-Based Valuation" },
    { value: "EVA", label: "Economic Value Added" },
  ];

  const renderSensitivityTable = (model: ValuationModel) => {
    if (!model.sensitivity || !model.sensitivity.matrix.length) return null;

    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Sensitivity Analysis</h3>
        <div className="overflow-x-auto">
          <Table className="border text-sm">
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Discount Rate / Growth</TableHead>
                {model.sensitivity.growthRates.map((rate, i) => (
                  <TableHead key={i} className="text-right">
                    {rate}%
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {model.sensitivity.discountRates.map((discountRate, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell className="font-medium">{discountRate}%</TableCell>
                  {model.sensitivity.growthRates.map((_, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={`text-right ${
                        model.sensitivity.matrix[rowIndex][colIndex] >
                        model.fairValue * 1.1
                          ? "text-green-600"
                          : model.sensitivity.matrix[rowIndex][colIndex] <
                            model.fairValue * 0.9
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      {formatCurrency(
                        model.sensitivity.matrix[rowIndex][colIndex]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  const renderModelContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center p-8">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2">Loading valuation data...</span>
        </div>
      );
    }

    if (!valuationModels.length) {
      return (
        <div className="text-center p-8 text-gray-500">
          {modelType === "All"
            ? "No valuation data available for this ticker."
            : `No ${modelType} valuation model available for this ticker. Try selecting a different model type.`}
        </div>
      );
    }

    const model = valuationModels[0];
    const currentPrice = model.fairValue / (1 + model.upside / 100);

    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Fair Value Estimate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">
                  {formatCurrency(model.fairValue)}
                </span>
                <span
                  className={`ml-2 text-lg ${
                    model.upside > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {formatPercentage(model.upside)}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Current Price: {formatCurrency(currentPrice)}
              </div>
              <div className="flex items-center mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      model.upside > 20
                        ? "bg-green-500"
                        : model.upside > 0
                        ? "bg-green-400"
                        : model.upside > -20
                        ? "bg-red-400"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        Math.max(50 + model.upside / 2, 0),
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Undervalued</span>
                <span>Fair Value</span>
                <span>Overvalued</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Model Assumptions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    Discount Rate (%)
                  </label>
                  <Input
                    type="number"
                    value={customParams.discountRate}
                    onChange={(e) =>
                      handleCustomParamChange(
                        "discountRate",
                        parseFloat(e.target.value)
                      )
                    }
                    min={1}
                    max={30}
                    step={0.5}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Terminal Growth (%)
                  </label>
                  <Input
                    type="number"
                    value={customParams.terminalGrowthRate}
                    onChange={(e) =>
                      handleCustomParamChange(
                        "terminalGrowthRate",
                        parseFloat(e.target.value)
                      )
                    }
                    min={0}
                    max={10}
                    step={0.1}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Projection Years</label>
                <Input
                  type="number"
                  value={customParams.projectionYears}
                  onChange={(e) =>
                    handleCustomParamChange(
                      "projectionYears",
                      parseInt(e.target.value)
                    )
                  }
                  min={1}
                  max={20}
                  step={1}
                />
              </div>
              <Button onClick={recalculateModel} className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Recalculate
              </Button>
            </CardContent>
          </Card>
        </div>

        {modelType === "DCF" && (
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Cash Flow Projections</CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="border">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Year</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Growth</TableHead>
                    <TableHead className="text-right">EBITDA</TableHead>
                    <TableHead className="text-right">Margin</TableHead>
                    <TableHead className="text-right">FCF</TableHead>
                    <TableHead className="text-right">PV of FCF</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }, (_, i) => {
                    const yearData = (model.modelSpecificData as any)
                      ?.cashFlowProjections?.[i];
                    return yearData ? (
                      <TableRow key={i}>
                        <TableCell>{new Date().getFullYear() + i}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(yearData.revenue)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPercentage(yearData.growth)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(yearData.ebitda)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPercentage(yearData.margin)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(yearData.fcf)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(yearData.pvFcf)}
                        </TableCell>
                      </TableRow>
                    ) : null;
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {renderSensitivityTable(model)}

        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={downloadValuationReport}>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Valuation Models</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-end mb-6">
            <div className="flex-1 flex space-x-2">
              <Input
                placeholder="Enter stock ticker (e.g., AAPL)"
                value={searchTicker}
                onChange={(e) => setSearchTicker(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            <div className="flex space-x-2">
              <Select value={modelType} onValueChange={setModelType}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Valuation Model" />
                </SelectTrigger>
                <SelectContent>
                  {modelTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {renderModelContent()}
        </CardContent>
      </Card>
    </div>
  );
}
