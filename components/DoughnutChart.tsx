"use client";

import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  data: {
    labels: string[];
    values: number[];
    colors?: string[];
  };
  size?: number;
  cutout?: string;
  showLegend?: boolean;
  centerText?: {
    value: string | number;
    label?: string;
  };
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  size = 120,
  cutout = "60%",
  showLegend = false,
  centerText,
}) => {
  // Premium color palette for the chart - blue theme
  const defaultColors = [
    "#0047B3", // Primary Blue
    "#2065D8", // Medium Blue
    "#2389FA", // Light Blue
    "#0BA5EC", // Sky Blue
    "#4DA3FF", // Accent Blue
    "#1756B6", // Royal Blue
    "#003B8E", // Navy Blue
  ];

  // Generate chart data with enhanced hover effects
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: data.colors || defaultColors,
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverBackgroundColor:
          data.colors?.map((color) => {
            // Lighten the color on hover
            const c = color.replace("#", "");
            return `rgba(${parseInt(c.substring(0, 2), 16)}, ${parseInt(
              c.substring(2, 4),
              16
            )}, ${parseInt(c.substring(4, 6), 16)}, 0.85)`;
          }) ||
          defaultColors.map((color) => {
            const c = color.replace("#", "");
            return `rgba(${parseInt(c.substring(0, 2), 16)}, ${parseInt(
              c.substring(2, 4),
              16
            )}, ${parseInt(c.substring(4, 6), 16)}, 0.85)`;
          }),
        hoverOffset: 6,
        borderRadius: 4,
        hoverBorderWidth: 3,
        hoverBorderColor: "#ffffff",
        // Note: shadow styles not supported by Chart.js out of the box
      },
    ],
  };

  // Chart options
  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 8,
        bottom: 8,
        left: 8,
        right: 8,
      },
    },
    // Add animation
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1000,
      easing: "easeOutQuart",
    },
    // Improve tooltip handling
    hover: {
      mode: "nearest",
      intersect: true,
    },
    plugins: {
      legend: {
        display: showLegend ?? false,
        position: "bottom" as const,
        align: "center" as const,
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          padding: 15,
          font: {
            size: 11,
            family: "Inter, sans-serif",
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(20, 60, 120, 0.95)",
        titleColor: "#fff",
        bodyColor: "#fff",
        titleFont: { size: 13, weight: "bold" },
        bodyFont: { size: 12 },
        padding: 14,
        cornerRadius: 6,
        boxPadding: 6,
        displayColors: true,
        caretSize: 8,
        caretPadding: 10,
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.2)",
        position: "nearest",
        intersect: true,
        mode: "nearest",
        callbacks: {
          title: (tooltipItems) => {
            return `${tooltipItems[0].label}`;
          },
          label: (context) => {
            const value = context.raw as number;
            const total = context.dataset.data.reduce(
              (sum, val) => sum + (val as number),
              0
            );
            const percentage = total
              ? ((value / total) * 100).toFixed(1)
              : "0.0";
            return [`Share: ${percentage}%`];
          },
          labelTextColor: () => "#ffffff",
        },
        animation: {
          duration: 150,
        },
      },
    },
    cutout,
    // Prevent hover effects from causing layout shifts
    onHover: (_event, _elements, chart) => {
      chart.canvas.style.cursor = _elements.length ? "pointer" : "default";
    },
  };

  return (
    <div
      className="chart-container relative"
      style={{
        width: size,
        height: size,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        overflow: "visible", // Ensure tooltips aren't cut off
      }}
    >
      <div
        className="relative"
        style={{
          width: size,
          height: size,
          overflow: "visible",
          position: "relative",
          zIndex: 10, // Ensure chart is above other elements
        }}
      >
        <Doughnut data={chartData} options={options} />

        {centerText && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              pointerEvents: "none",
            }}
          >
            {/* Dynamic font sizing to avoid overlap for small charts */}
            <div
              className={`${
                size <= 110 ? "text-lg" : size <= 130 ? "text-xl" : "text-2xl"
              } font-bold text-gray-900`}
            >
              {centerText.value}
            </div>
            {centerText.label && (
              <div
                className={`${
                  size <= 110 ? "text-[10px]" : "text-xs"
                } font-medium text-gray-600`}
              >
                {centerText.label}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoughnutChart;
