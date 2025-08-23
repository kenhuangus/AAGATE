"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import type { RiskHistory } from "@/lib/types"

const chartConfig = {
  riskScore: {
    label: "Risk Score",
    color: "hsl(var(--chart-1))",
  },
}

interface RiskScoreChartProps {
  data: RiskHistory[];
  title?: string;
  description?: string;
  className?: string;
}

export function RiskScoreChart({ data, title = "Risk Score Trend", description = "Visual representation of agent risk over time.", className }: RiskScoreChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
              top: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 100]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                indicator="dot"
                labelFormatter={(label, payload) => {
                  return `Date: ${new Date(payload?.[0]?.payload?.date).toLocaleDateString()}`
                }}
              />}
            />
            <defs>
              <linearGradient id="fillRiskScore" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-riskScore)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-riskScore)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="riskScore"
              type="natural"
              fill="url(#fillRiskScore)"
              stroke="var(--color-riskScore)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
