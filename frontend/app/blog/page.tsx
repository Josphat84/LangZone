
'use client';

import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, BarChart, Bar,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area,
  ScatterChart, Scatter, ZAxis,
  ComposedChart,
  Treemap,
  Sankey,
  RadialBarChart, RadialBar,
} from "recharts";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { ResponsiveWaffle } from "@nivo/waffle";
import { ResponsiveFunnel } from "@nivo/funnel";
import { ResponsiveStream } from "@nivo/stream";
import { ResponsiveBump } from "@nivo/bump";
import { ResponsiveSunburst } from "@nivo/sunburst";

// --- Default Data ---
const monthlyData = [
  { month: "Jan", revenue: 47000, expenses: 2500, profit: 1500, growth: 5, customers: 120 },
  { month: "Feb", revenue: 3000, expenses: 2000, profit: 1000, growth: -25, customers: 95 },
  { month: "Mar", revenue: 5000, expenses: 3500, profit: 1500, growth: 67, customers: 150 },
  { month: "Apr", revenue: 4780, expenses: 3000, profit: 1780, growth: -4, customers: 140 },
  { month: "May", revenue: 5890, expenses: 3500, profit: 2390, growth: 23, customers: 180 },
  { month: "Jun", revenue: 7390, expenses: 4000, profit: 3390, growth: 25, customers: 2210 },
  { month: "Jul", revenue: 6900, expenses: 37800, profit: 3200, growth: -7, customers: 210 },
  { month: "Aug", revenue: 8200, expenses: 4200, profit: 4000, growth: 19, customers: 2502 },
];

const COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899"];

const totalData = monthlyData.reduce(
  (acc, d) => {
    acc.revenue += d.revenue;
    acc.expenses += d.expenses;
    acc.profit += d.profit;
    return acc;
  },
  { revenue: 0, expenses: 0, profit: 0 }
);

const pieData = [
  { name: "Revenue", value: totalData.revenue, color: COLORS[0] },
  { name: "Expenses", value: totalData.expenses, color: COLORS[1] },
  { name: "Profit", value: totalData.profit, color: COLORS[2] },
];

const radarData = [
  { metric: "Marketing", value: 85, fullMark: 100 },
  { metric: "Sales", value: 92, fullMark: 100 },
  { metric: "Support", value: 78, fullMark: 100 },
  { metric: "Product", value: 88, fullMark: 100 },
  { metric: "Tech", value: 95, fullMark: 100 },
];

const treemapData = [
  { name: "Product A", size: 4000, color: COLORS[0] },
  { name: "Product B", size: 3000, color: COLORS[1] },
  { name: "Product C", size: 2500, color: COLORS[2] },
  { name: "Product D", size: 2000, color: COLORS[3] },
  { name: "Product E", size: 1500, color: COLORS[4] },
];

const streamData = monthlyData.map(d => ({
  month: d.month,
  "Product A": Math.random() * 1000 + 500,
  "Product B": Math.random() * 10040 + 500,
  "Product C": Math.random() * 1000 + 500,
}));

const bumpData = [
  {
    id: "Product A",
    data: monthlyData.map((d, i) => ({ x: d.month, y: Math.floor(Math.random() * 5) + 1 }))
  },
  {
    id: "Product B",
    data: monthlyData.map((d, i) => ({ x: d.month, y: Math.floor(Math.random() * 5) + 1 }))
  },
  {
    id: "Product C",
    data: monthlyData.map((d, i) => ({ x: d.month, y: Math.floor(Math.random() * 5) + 1 }))
  },
];

const sunburstData = {
  name: "revenue",
  color: COLORS[0],
  children: [
    {
      name: "Products",
      color: COLORS[1],
      children: [
        { name: "Product A", color: COLORS[2], loc: 4000 },
        { name: "Product B", color: COLORS[3], loc: 3000 },
      ],
    },
    {
      name: "Services",
      color: COLORS[4],
      children: [
        { name: "Consulting", color: COLORS[5], loc: 2500 },
        { name: "Support", color: COLORS[0], loc: 2000 },
      ],
    },
  ],
};

const radialBarData = [
  { name: "Q1", value: 75, fill: COLORS[0] },
  { name: "Q2", value: 85, fill: COLORS[1] },
  { name: "Q3", value: 92, fill: COLORS[2] },
  { name: "Q4", value: 88, fill: COLORS[3] },
];

// --- Custom Gauge Chart ---
const GaugeChart = ({ value = 0, max = 1, label = "", color = COLORS[0] }) => {
  const percentage = Math.min(100, (value / max) * 100);
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="relative w-48 h-24 overflow-hidden" style={{ borderRadius: '120px 120px 0 0' }}>
        <div className="w-full h-full absolute top-0 left-0 bg-gray-200 dark:bg-neutral-700"></div>
        <div 
          className="absolute bottom-0 left-0 h-full origin-bottom-center transition-transform duration-1000"
          style={{ 
            backgroundColor: color, 
            width: '200%',
            transform: `rotate(${((percentage / 100) * 180) - 180}deg)`,
            transformOrigin: '50% 100%',
          }}
        ></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-18 bg-white dark:bg-neutral-800 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      <div className="text-center mt-4">
        <p className="text-3xl font-bold dark:text-white" style={{ color }}>
          ${value.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {label} (Goal: ${max.toLocaleString()})
        </p>
      </div>
    </div>
  );
};

// --- ApexCharts Mock Component ---
const ApexChart = ({ type, series, options, height }) => {
  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill={options.colors?.[0] || COLORS[0]} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke={COLORS[0]} strokeWidth={3} />
              <Line type="monotone" dataKey="expenses" stroke={COLORS[1]} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke={COLORS[0]} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "radialBar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RadialBarChart innerRadius="10%" outerRadius="80%" data={radialBarData}>
              <RadialBar dataKey="value" />
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
            </RadialBarChart>
          </ResponsiveContainer>
        );
      case "radar":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Performance" dataKey="value" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        );
      case "donut":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={5}>
                {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={v => `$${v}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case "heatmap":
        const heatmapData = [
          { id: "Revenue", data: monthlyData.map(d => ({ x: d.month, y: d.revenue })) },
          { id: "Expenses", data: monthlyData.map(d => ({ x: d.month, y: d.expenses })) },
          { id: "Profit", data: monthlyData.map(d => ({ x: d.month, y: d.profit })) },
        ];
        return (
          <div style={{ height }}>
            <ResponsiveHeatMap
              data={heatmapData}
              margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
              axisTop={{ tickSize: 5, tickPadding: 5, tickRotation: -45 }}
              colors={{
                type: 'sequential',
                scheme: 'blues'
              }}
            />
          </div>
        );
      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="revenue" name="Revenue" />
              <YAxis dataKey="expenses" name="Expenses" />
              <ZAxis dataKey="profit" range={[100, 1000]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Performance" data={monthlyData} fill={COLORS[0]} />
            </ScatterChart>
          </ResponsiveContainer>
        );
      default:
        return <div>Chart type not supported</div>;
    }
  };

  return <div className="w-full h-full">{renderChart()}</div>;
};

// --- Main Dashboard Component ---
export default function DashboardPage() {
  const [metric, setMetric] = useState("revenue");
  const metricColor = metric === "revenue" ? COLORS[0] : metric === "expenses" ? COLORS[1] : COLORS[2];
  const capitalizedMetric = metric.charAt(0).toUpperCase() + metric.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 p-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Advanced Visualization Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">30+ Chart Types & Styles</p>
        </div>
        <select 
          value={metric} 
          onChange={(e) => setMetric(e.target.value)}
          className="mt-4 md:mt-0 bg-white dark:bg-neutral-800 border-2 border-gray-300 dark:border-neutral-700 text-gray-800 dark:text-white rounded-xl px-6 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent transition shadow-lg"
        >
          <option value="revenue">Revenue</option>
          <option value="expenses">Expenses</option>
          <option value="profit">Profit</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Gradient Line Chart */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700 hover:shadow-3xl transition-all">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
            Smooth Line Chart
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData}>
              <defs>
                <linearGradient id="gradientLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={COLORS[0]} />
                  <stop offset="100%" stopColor={COLORS[4]} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff' }}
                formatter={v => [`$${v}`, capitalizedMetric]}
              />
              <Line type="monotone" dataKey={metric} stroke="url(#gradientLine)" strokeWidth={4} dot={{ r: 6, fill: metricColor }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 2. Apex Bar Chart */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
            Apex Bar Chart
          </h2>
          <ApexChart type="bar" series={[]} options={{ colors: [metricColor] }} height={280} />
        </div>

        {/* 3. Donut Chart with Gradient */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-purple-500 rounded-full mr-3"></span>
            Apex Donut Chart
          </h2>
          <ApexChart type="donut" series={[]} options={{}} height={280} />
        </div>

        {/* 4. Area Chart with Gradient Fill */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
            Apex Area Chart
          </h2>
          <ApexChart type="area" series={[]} options={{}} height={280} />
        </div>

        {/* 5. Radar Chart */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></span>
            Apex Radar Chart
          </h2>
          <ApexChart type="radar" series={[]} options={{}} height={280} />
        </div>

        {/* 6. Radial Bar */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-pink-500 rounded-full mr-3"></span>
            Apex Radial Bar
          </h2>
          <ApexChart type="radialBar" series={[]} options={{}} height={280} />
        </div>

        {/* 7. Multi-Line Chart */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-indigo-500 rounded-full mr-3"></span>
            Multi-Line Comparison
          </h2>
          <ApexChart type="line" series={[]} options={{}} height={280} />
        </div>

        {/* 8. Scatter Plot */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-cyan-500 rounded-full mr-3"></span>
            Apex Scatter Plot
          </h2>
          <ApexChart type="scatter" series={[]} options={{}} height={280} />
        </div>

        {/* 9. Composed Chart */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
            Composed Chart
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill={COLORS[0]} radius={[8, 8, 0, 0]} />
              <Line type="monotone" dataKey="profit" stroke={COLORS[2]} strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* 10. Treemap */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-teal-500 rounded-full mr-3"></span>
            Treemap
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <Treemap
              data={treemapData}
              dataKey="size"
              stroke="#fff"
              fill={COLORS[0]}
            >
              {treemapData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Treemap>
          </ResponsiveContainer>
        </div>

        {/* 11. Waffle Chart */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-lime-500 rounded-full mr-3"></span>
            Waffle Chart
          </h2>
          <div style={{ height: 280 }}>
            <ResponsiveWaffle
              data={[
                { id: "Completed", label: "Revenue", value: totalData.revenue, color: COLORS[0] },
                { id: "Remaining", label: "Goal", value: 20000, color: "#d1d5db" }
              ]}
              total={50000}
              rows={10}
              columns={10}
              padding={1}
              colors={{ datum: 'color' }}
            />
          </div>
        </div>

        {/* 12. Funnel Chart */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-rose-500 rounded-full mr-3"></span>
            Funnel Chart
          </h2>
          <div style={{ height: 280 }}>
            <ResponsiveFunnel
              data={[
                { id: "Leads", value: 10000, label: "Leads" },
                { id: "Qualified", value: 5000, label: "Qualified" },
                { id: "Proposal", value: 3000, label: "Proposal" },
                { id: "Negotiation", value: 1500, label: "Negotiation" },
                { id: "Closed", value: 800, label: "Closed" },
              ]}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              colors={{ scheme: 'blues' }}
              borderWidth={20}
              labelColor="white"
            />
          </div>
        </div>

        {/* 13. Stream Chart */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700 col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-violet-500 rounded-full mr-3"></span>
            Stream Chart
          </h2>
          <div style={{ height: 280 }}>
            <ResponsiveStream
              data={streamData}
              keys={['Product A', 'Product B', 'Product C']}
              margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
              }}
              colors={{ scheme: 'nivo' }}
              offsetType="silhouette"
              curve="cardinal"
            />
          </div>
        </div>

        {/* 14. Bump Chart */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700 col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-fuchsia-500 rounded-full mr-3"></span>
            Bump Chart (Rankings)
          </h2>
          <div style={{ height: 280 }}>
            <ResponsiveBump
              data={bumpData}
              colors={{ scheme: 'spectral' }}
              lineWidth={3}
              activeLineWidth={6}
              inactiveLineWidth={3}
              inactiveOpacity={0.15}
              pointSize={10}
              activePointSize={16}
              margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
            />
          </div>
        </div>

        {/* 15. Sunburst */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700 col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-amber-500 rounded-full mr-3"></span>
            Sunburst Chart
          </h2>
          <div style={{ height: 320 }}>
            <ResponsiveSunburst
              data={sunburstData}
              margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              id="name"
              value="loc"
              cornerRadius={2}
              borderColor={{ theme: 'background' }}
              colors={{ scheme: 'nivo' }}
              childColor={{ from: 'color', modifiers: [['brighter', 0.4]] }}
              enableArcLabels={true}
              arcLabelsSkipAngle={10}
            />
          </div>
        </div>

        {/* 16. Nivo Bar Chart */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></span>
            Nivo Bar Chart
          </h2>
          <div style={{ height: 280 }}>
            <ResponsiveBar
              data={monthlyData}
              keys={['revenue', 'expenses', 'profit']}
              indexBy="month"
              margin={{ top: 20, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              colors={{ scheme: 'nivo' }}
              borderRadius={8}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
              }}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'bottom-right',
                  direction: 'column',
                  translateX: 120,
                  itemWidth: 100,
                  itemHeight: 20,
                }
              ]}
            />
          </div>
        </div>

        {/* 17. Heatmap */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700 col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-sky-500 rounded-full mr-3"></span>
            Apex Heatmap
          </h2>
          <ApexChart type="heatmap" series={[]} options={{}} height={280} />
        </div>

        {/* 18. Custom Gauge */}
        <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700">
          <h2 className="text-xl font-bold p-6 pb-0 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
            Performance Gauge
          </h2>
          <GaugeChart value={totalData.profit} max={25000} label="Total Profit" color={COLORS[2]} />
        </div>

        {/* 19. Stacked Area Chart */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700 col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-indigo-500 rounded-full mr-3"></span>
            Stacked Area Chart
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[1]} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS[1]} stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[2]} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={COLORS[2]} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff' }} />
              <Legend />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke={COLORS[0]} fill="url(#colorRev)" />
              <Area type="monotone" dataKey="expenses" stackId="1" stroke={COLORS[1]} fill="url(#colorExp)" />
              <Area type="monotone" dataKey="profit" stackId="1" stroke={COLORS[2]} fill="url(#colorProf)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 20. Radial Gradient Pie */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-pink-500 rounded-full mr-3"></span>
            Radial Pie Chart
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <defs>
                {COLORS.map((color, idx) => (
                  <radialGradient key={idx} id={`gradient${idx}`}>
                    <stop offset="0%" stopColor={color} stopOpacity={1} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                  </radialGradient>
                ))}
              </defs>
              <Pie 
                data={pieData} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius={100}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={`url(#gradient${index})`} />
                ))}
              </Pie>
              <Tooltip formatter={v => `${v.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 21. Mixed Bar & Line */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-cyan-500 rounded-full mr-3"></span>
            Revenue vs Growth
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis yAxisId="left" stroke="#6b7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff' }} />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" fill={COLORS[0]} radius={[8, 8, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="growth" stroke={COLORS[2]} strokeWidth={3} dot={{ r: 5 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* 22. Scatter with Multiple Series */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-orange-500 rounded-full mr-3"></span>
            Multi-Series Scatter
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="revenue" name="Revenue" stroke="#6b7280" />
              <YAxis dataKey="profit" name="Profit" stroke="#6b7280" />
              <ZAxis dataKey="customers" range={[100, 1000]} name="Customers" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff' }} />
              <Legend />
              <Scatter name="Q1-Q2" data={monthlyData.slice(0, 4)} fill={COLORS[0]} />
              <Scatter name="Q3-Q4" data={monthlyData.slice(4)} fill={COLORS[4]} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* 23. Vertical Bar with Gradient */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-violet-500 rounded-full mr-3"></span>
            Gradient Bar Chart
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS[4]} stopOpacity={1}/>
                  <stop offset="100%" stopColor={COLORS[0]} stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff' }} />
              <Bar dataKey="profit" fill="url(#barGradient)" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 24. Progress Rings */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-teal-500 rounded-full mr-3"></span>
            Progress Rings
          </h2>
          <div className="flex justify-around items-center h-64">
            {[
              { label: "Revenue", value: (totalData.revenue / 50000) * 100, color: COLORS[0] },
              { label: "Profit", value: (totalData.profit / 20000) * 100, color: COLORS[2] },
              { label: "Growth", value: 78, color: COLORS[4] },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle 
                      cx="48" cy="48" r="40" 
                      stroke={item.color} 
                      strokeWidth="8" 
                      fill="none"
                      strokeDasharray={`${(item.value / 100) * 251.2} 251.2`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold dark:text-white">{Math.round(item.value)}%</span>
                  </div>
                </div>
                <p className="text-sm mt-2 dark:text-gray-300">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 25. Horizontal Bar Comparison */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700 col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-rose-500 rounded-full mr-3"></span>
            Horizontal Comparison
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis type="category" dataKey="month" stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff' }} />
              <Legend />
              <Bar dataKey="revenue" fill={COLORS[0]} radius={[0, 8, 8, 0]} />
              <Bar dataKey="expenses" fill={COLORS[1]} radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 26. Area with Dots */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-lime-500 rounded-full mr-3"></span>
            Area with Markers
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="markerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[4]} stopOpacity={0.9}/>
                  <stop offset="95%" stopColor={COLORS[4]} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff' }} />
              <Area 
                type="monotone" 
                dataKey="customers" 
                stroke={COLORS[4]} 
                fill="url(#markerGradient)" 
                strokeWidth={3}
                dot={{ r: 6, fill: COLORS[4], strokeWidth: 2, stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 27. Mini Sparklines */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-amber-500 rounded-full mr-3"></span>
            Sparkline Stats
          </h2>
          <div className="space-y-6">
            {[
              { label: "Revenue Trend", data: monthlyData.map(d => d.revenue), color: COLORS[0], total: totalData.revenue },
              { label: "Expense Trend", data: monthlyData.map(d => d.expenses), color: COLORS[1], total: totalData.expenses },
              { label: "Profit Trend", data: monthlyData.map(d => d.profit), color: COLORS[2], total: totalData.profit },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
                  <p className="text-2xl font-bold dark:text-white">${item.total.toLocaleString()}</p>
                </div>
                <div className="w-32 h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <Area type="monotone" dataKey={item.label.split(' ')[0].toLowerCase()} stroke={item.color} fill={item.color} fillOpacity={0.3} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 28. Bullet Chart */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700 col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
            Goal Progress (Bullet Chart)
          </h2>
          <div className="space-y-6">
            {[
              { label: "Monthly Revenue Target", current: 6900, goal: 10000, color: COLORS[0] },
              { label: "Monthly Profit Target", current: 3200, goal: 5000, color: COLORS[2] },
              { label: "Customer Acquisition", current: 210, goal: 300, color: COLORS[4] },
            ].map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold dark:text-white">{item.label}</span>
                  <span className="text-gray-600 dark:text-gray-400">{((item.current / item.goal) * 100).toFixed(0)}%</span>
                </div>
                <div className="relative w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-6">
                  <div 
                    className="h-6 rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                    style={{ width: `${Math.min(100, (item.current / item.goal) * 100)}%`, backgroundColor: item.color }}
                  >
                    <span className="text-xs font-bold text-white">{item.current}</span>
                  </div>
                  <div 
                    className="absolute top-0 h-8 w-1 bg-black dark:bg-white rounded"
                    style={{ left: `${(item.goal * 0.75) / item.goal * 100}%`, top: '-4px' }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Current: {item.current.toLocaleString()}</span>
                  <span>Goal: {item.goal.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 29. Candlestick-Style Chart */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-neutral-700">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
            Range Chart
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px', color: '#fff' }} />
              <Bar dataKey="expenses" fill={COLORS[1]} radius={[4, 4, 4, 4]} />
              <Bar dataKey="profit" fill={COLORS[2]} radius={[4, 4, 4, 4]} />
              <Line type="monotone" dataKey="revenue" stroke={COLORS[0]} strokeWidth={3} dot={{ r: 5 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* 30. KPI Cards with Mini Charts */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-3xl shadow-2xl border border-blue-400 text-white col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="w-4 h-4 bg-white rounded-full mr-3"></span>
            Executive KPI Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                title: "Total Revenue", 
                value: `${totalData.revenue.toLocaleString()}`, 
                change: "+23%",
                positive: true,
                data: monthlyData.map(d => d.revenue)
              },
              { 
                title: "Total Expenses", 
                value: `${totalData.expenses.toLocaleString()}`, 
                change: "+12%",
                positive: false,
                data: monthlyData.map(d => d.expenses)
              },
              { 
                title: "Net Profit", 
                value: `${totalData.profit.toLocaleString()}`, 
                change: "+45%",
                positive: true,
                data: monthlyData.map(d => d.profit)
              },
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
                <p className="text-sm opacity-90 mb-1">{kpi.title}</p>
                <div className="flex items-end justify-between mb-3">
                  <p className="text-3xl font-bold">{kpi.value}</p>
                  <span className={`text-sm font-semibold px-2 py-1 rounded ${kpi.positive ? 'bg-green-500' : 'bg-red-500'}`}>
                    {kpi.change}
                  </span>
                </div>
                <div className="h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <Area type="monotone" dataKey={kpi.title.split(' ')[1].toLowerCase()} stroke="#fff" fill="#fff" fillOpacity={0.3} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>  
  );
};