// Search Analytics Page
// This page displays search analytics data for the admin dashboard.
// app/admin/search-analytics/page.tsx

"use client";

import { useEffect, useState, useMemo } from "react";
import Typesense from "typesense";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, TrendingUp, TrendingDown, BarChart3, Target, AlertCircle, 
  Sparkles, Calendar, Download, Clock, Zap, History
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// --- Configuration Constants ---
// Typesense enforced maximum hits per page
const TYPESENSE_PER_PAGE_MAX = 250; 
// Safety limit for analytics processing (e.g., 10k logs)
const MAX_LOGS_TO_FETCH = 10000; 

// Typesense admin client - Initialize lazily (matching the pattern from lib/typesense/client.ts)
let typesenseAdminClient: Typesense.Client | null = null;

const getTypesenseAdminClient = () => {
  if (!typesenseAdminClient) {
    const host = process.env.NEXT_PUBLIC_TYPESENSE_HOST;
    const port = Number(process.env.NEXT_PUBLIC_TYPESENSE_PORT || 443);
    const protocol = process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || "https";
    const apiKey = process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY;

    if (!host) {
      throw new Error('NEXT_PUBLIC_TYPESENSE_HOST is not defined');
    }

    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY is not defined');
    }

    typesenseAdminClient = new Typesense.Client({
      nodes: [
        {
          host,
          port,
          protocol: protocol as "http" | "https",
        },
      ],
      apiKey,
      connectionTimeoutSeconds: 10,
    });
  }
  
  return typesenseAdminClient;
};

interface SearchLog {
  id: string;
  query: string;
  result_count: number;
  filter_type: string;
  clicked_result: string | null;
  timestamp: number;
  user_agent: string;
  session_id: string;
  search_latency_ms?: number; 
}

interface Analytics {
  totalSearches: number;
  uniqueSearches: number;
  avgResultsPerSearch: number;
  clickThroughRate: number;
  avgSearchLatency: number; 
  topQueries: { query: string; count: number }[];
  zeroResultsQueries: { query: string; count: number }[];
  filterUsage: { filter: string; count: number }[];
  searchTrends: { date: string; count: number }[];
  hourlyDistribution: { hour: string; count: number }[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

const calculateAnalyticsFromLogs = (logs: SearchLog[]): Omit<Analytics, 'searchTrends' | 'hourlyDistribution'> => {
  const totalSearches = logs.length;
  const uniqueSearches = new Set(logs.map(log => log.query.toLowerCase())).size;
  const avgResults = totalSearches > 0 ? logs.reduce((sum, log) => sum + log.result_count, 0) / totalSearches : 0;
  const clickedSearches = logs.filter(log => log.clicked_result).length;
  const ctr = (clickedSearches / totalSearches) * 100 || 0;

  const totalLatency = logs.reduce((sum, log) => sum + (log.search_latency_ms || 0), 0);
  const avgSearchLatency = totalSearches > 0 ? totalLatency / totalSearches : 0;

  const queryCounts = logs.reduce((acc, log) => {
    const query = log.query.toLowerCase();
    acc[query] = (acc[query] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topQueries = Object.entries(queryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([query, count]) => ({ query, count }));

  const zeroResults = logs.filter(log => log.result_count === 0);
  const zeroResultsCounts = zeroResults.reduce((acc, log) => {
    const query = log.query.toLowerCase();
    acc[query] = (acc[query] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const zeroResultsQueries = Object.entries(zeroResultsCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([query, count]) => ({ query, count }));

  const filterCounts = logs.reduce((acc, log) => {
    acc[log.filter_type] = (acc[log.filter_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const filterUsage = Object.entries(filterCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([filter, count]) => ({ filter, count }));

  return {
    totalSearches,
    uniqueSearches,
    avgResultsPerSearch: avgResults,
    clickThroughRate: ctr,
    avgSearchLatency, 
    topQueries,
    zeroResultsQueries,
    filterUsage,
  };
};

export default function SearchAnalyticsDashboard() {
  const [logs, setLogs] = useState<SearchLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7'); 
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null); 
  const [comparisonAnalytics, setComparisonAnalytics] = useState<Omit<Analytics, 'searchTrends' | 'hourlyDistribution'> | null>(null); 
  const [error, setError] = useState<string | null>(null);


  const calculateAllAnalytics = useMemo(() => (logs: SearchLog[]) => {
    const baseAnalytics = calculateAnalyticsFromLogs(logs);

    const daysCounts = logs.reduce((acc, log) => {
      const date = format(new Date(log.timestamp * 1000), 'MMM d');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const searchTrends = Object.entries(daysCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); 

    const hourlyCounts = logs.reduce((acc, log) => {
      const hour = format(new Date(log.timestamp * 1000), 'HH:00');
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const hourlyDistribution = Object.entries(hourlyCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([hour, count]) => ({ hour, count }));

    setAnalytics({
      ...baseAnalytics,
      searchTrends,
      hourlyDistribution
    });
  }, []);

  // --- LOG FETCHING FUNCTION (Uses Pagination to avoid 422 error) ---
  useEffect(() => {
    const fetchLogs = async (daysAgo: number, isComparison = false): Promise<SearchLog[]> => {
      if (!isComparison) {
        setLoading(true);
        setError(null);
      }
      try {
        const typesenseAdmin = getTypesenseAdminClient();
        
        const end = new Date();
        const start = subDays(end, daysAgo);
        
        const startTimestamp = Math.floor(startOfDay(start).getTime() / 1000);
        const endTimestamp = Math.floor(endOfDay(end).getTime() / 1000);

        let currentPage = 1;
        let totalFetchedLogs: SearchLog[] = [];
        let morePages = true;

        while (morePages && totalFetchedLogs.length < MAX_LOGS_TO_FETCH) {
          const searchResults = await typesenseAdmin
            .collections('search_logs')
            .documents()
            .search({
              q: '*',
              query_by: 'query',
              filter_by: `timestamp:>=${startTimestamp} && timestamp:<=${endTimestamp}`,
              per_page: TYPESENSE_PER_PAGE_MAX, // Use the Typesense maximum limit (250)
              page: currentPage,
              sort_by: 'timestamp:desc'
            });

          const fetchedLogs = (searchResults.hits?.map((hit: any) => hit.document) || []) as SearchLog[];
          totalFetchedLogs = totalFetchedLogs.concat(fetchedLogs);

          // Check for more pages
          const totalHits = searchResults.found || 0;
          const totalPages = Math.ceil(totalHits / TYPESENSE_PER_PAGE_MAX);

          if (currentPage >= totalPages || totalFetchedLogs.length >= MAX_LOGS_TO_FETCH) {
            morePages = false;
          } else {
            currentPage++;
          }
        }
        
        // Return only up to the global safety limit
        return totalFetchedLogs.slice(0, MAX_LOGS_TO_FETCH);
      } catch (error: any) {
        if (!isComparison) {
          console.error('Error fetching search logs:', error);
          setError(error.message || 'Failed to fetch search logs. Please check your Typesense configuration.');
        } else {
          console.warn('Error fetching comparison logs:', error);
        }
        return [];
      }
    };

    const runAnalysis = async () => {
      const daysAgo = parseInt(dateRange);

      // 1. Fetch current period logs
      const currentLogs = await fetchLogs(daysAgo, false);
      setLogs(currentLogs);
      setLastUpdated(new Date()); 

      // 2. Calculate current period analytics
      calculateAllAnalytics(currentLogs);

      // 3. Fetch comparison period logs (e.g., last 7 days vs 7 days before that)
      const comparisonDays = daysAgo * 2;
      const comparisonLogs = await fetchLogs(comparisonDays, true);

      // Filter comparison logs to only include the *previous* period (e.g., days 8-14)
      const comparisonStart = subDays(new Date(), comparisonDays);
      const comparisonEnd = subDays(new Date(), daysAgo);
      
      const filteredComparisonLogs = comparisonLogs.filter(log => {
        const logDate = new Date(log.timestamp * 1000);
        // We use startOfDay and endOfDay for cleaner comparison boundaries
        return logDate >= startOfDay(comparisonStart) && logDate <= endOfDay(comparisonEnd);
      });
      
      // 4. Calculate comparison analytics
      setComparisonAnalytics(calculateAnalyticsFromLogs(filteredComparisonLogs));
      
      setLoading(false);
    };

    runAnalysis();
  }, [dateRange, calculateAllAnalytics]);
  
  // --- EXISTING FEATURE LOGIC (No change needed) ---

  const getChange = (current: number, comparison: number) => {
    if (comparison === 0) return current > 0 ? 100 : 0;
    const diff = ((current - comparison) / comparison) * 100;
    return diff;
  };

  const totalSearchesChange = analytics && comparisonAnalytics ? getChange(analytics.totalSearches, comparisonAnalytics.totalSearches) : 0;
  const clickThroughRateChange = analytics && comparisonAnalytics ? getChange(analytics.clickThroughRate, comparisonAnalytics.clickThroughRate) : 0;
  const zeroResultsChange = analytics && comparisonAnalytics ? getChange(analytics.zeroResultsQueries.reduce((sum, q) => sum + q.count, 0) || 0, comparisonAnalytics.zeroResultsQueries.reduce((sum, q) => sum + q.count, 0) || 0) : 0;
  // Latency is better when lower, so invert the change percentage for positive visualization
  const avgLatencyChange = analytics && comparisonAnalytics ? getChange(analytics.avgSearchLatency, comparisonAnalytics.avgSearchLatency) : 0;
  
  const daysInPeriod = parseInt(dateRange);
  const comparisonPeriodLabel = `vs. previous ${daysInPeriod} days`;
  
  const exportToCSV = () => {
    const headers = ['Query', 'Results', 'Filter', 'Clicked', 'Timestamp', 'Session', 'Latency_ms'];
    const rows = logs.map(log => [
      log.query,
      log.result_count,
      log.filter_type,
      log.clicked_result || 'None',
      format(new Date(log.timestamp * 1000), 'yyyy-MM-dd HH:mm:ss'),
      log.session_id,
      log.search_latency_ms || 'N/A' 
    ]);
    
    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `search-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  if (loading) {
     // ... (loading state remains the same)
     return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <Skeleton className="h-96" />
          </div>
        </div>
      );
  }

  if (error) {
    // ... (error state remains the same)
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
          <div className="max-w-7xl mx-auto">
            <Card className="border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-900 dark:text-red-100">
                  <AlertCircle className="w-6 h-6" />
                  Configuration Error
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-red-800 dark:text-red-200">{error}</p>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-red-300 dark:border-red-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Required Environment Variables:</p>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                    <li><code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">NEXT_PUBLIC_TYPESENSE_HOST</code></li>
                    <li><code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY</code> or <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">NEXT_PUBLIC_TYPESENSE_ADMIN_API_KEY</code></li>
                  </ul>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                    Make sure these are set in your <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">.env.local</code> file
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
  }

  const renderPercentageChange = (value: number) => {
    const isPositive = value >= 0;
    const icon = isPositive ? TrendingUp : TrendingDown;
    const color = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    
    // Correct usage here (it's already correct in your original code, as 'icon' is a local variable)
    const IconComponent = icon; 

    return (
      <div className="flex items-center gap-1 text-xs mt-1">
        <IconComponent className={`w-4 h-4 ${color}`} /> 
        <span className={`${color} font-medium`}>
          {value.toFixed(1)}%
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          {comparisonPeriodLabel}
        </span>
      </div>
    );
  };
  
  // 💥 FIX APPLIED HERE 
  const MetricCard = ({ 
    title, 
    value, 
    unit, 
    icon: IconComponent, // Destructure 'icon' and rename it to 'IconComponent' (capitalized)
    change, 
    isLatency = false 
  }: { 
    title: string; 
    value: string | number; 
    unit: string; 
    icon: React.ElementType; 
    change: number; 
    isLatency?: boolean 
  }) => {
    
    // Latency change is inverted because negative change (faster) is good
    const changeValue = isLatency ? change * -1 : change; 
    
    return (
      <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
            {/* Render the component using JSX syntax */}
            <IconComponent className="w-4 h-4" /> 
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}{unit}
          </div>
          {comparisonAnalytics && renderPercentageChange(changeValue)}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-indigo-600" />
              Search Analytics
            </h1>
            <div className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2 text-sm">
              Insights into user search behavior and patterns 
              {/* Last Updated Timestamp */}
              {lastUpdated && (
                <span className="flex items-center gap-1 ml-4 text-xs">
                  <Clock className="w-3 h-3" />
                  Last Updated: {format(lastUpdated, 'HH:mm:ss')}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Last 24 hours</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={exportToCSV} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Total Searches */}
          <MetricCard 
            title="Total Searches"
            value={analytics?.totalSearches.toLocaleString() || 0}
            unit=""
            icon={Search}
            change={totalSearchesChange}
          />

          {/* Unique Searches */}
          <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <History className="w-4 h-4" />
                Unique Searches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics?.uniqueSearches.toLocaleString() || 0}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Distinct queries made
              </p>
            </CardContent>
          </Card>
          
          {/* Click-Through Rate */}
          <MetricCard 
            title="Click-Through Rate"
            value={analytics?.clickThroughRate.toFixed(1) || 0}
            unit="%"
            icon={Target}
            change={clickThroughRateChange}
          />

          {/* Average Latency */}
          <MetricCard 
            title="Avg Latency"
            value={analytics?.avgSearchLatency.toFixed(0) || 0}
            unit="ms"
            icon={Zap}
            change={avgLatencyChange}
            isLatency={true} 
          />

          {/* Zero Results */}
          <MetricCard 
            title="Zero Results"
            value={analytics?.zeroResultsQueries.reduce((sum, q) => sum + q.count, 0) || 0}
            unit=""
            icon={AlertCircle}
            change={zeroResultsChange}
            isLatency={true} 
          />
        </div>

        {/* Charts */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="queries">Top Queries</TabsTrigger>
            <TabsTrigger value="filters">Filters</TabsTrigger>
            <TabsTrigger value="timing">Timing</TabsTrigger>
          </TabsList>

          {/* Search Trends */}
          <TabsContent value="trends" className="space-y-6">
            <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  Search Volume Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={analytics?.searchTrends || []}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorCount)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Top Queries */}
          <TabsContent value="queries" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Most Popular Queries */}
              <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Top Search Queries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.topQueries.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Badge variant="secondary" className="flex-shrink-0">
                            #{index + 1}
                          </Badge>
                          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.query}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-24 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                              style={{ width: `${(item.count / (analytics.topQueries[0]?.count || 1)) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-12 text-right">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Zero Results Queries */}
              <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    Zero Results Queries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics?.zeroResultsQueries.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Sparkles className="w-12 h-12 mx-auto mb-3 text-green-500" />
                      <p className="font-medium">Great job!</p>
                      <p className="text-sm">No searches with zero results</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {analytics?.zeroResultsQueries.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Badge variant="destructive" className="flex-shrink-0">
                              #{index + 1}
                            </Badge>
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {item.query}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full w-24 overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full"
                                style={{ width: `${(item.count / (analytics.zeroResultsQueries[0]?.count || 1)) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-12 text-right">
                              {item.count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Filter Usage */}
          <TabsContent value="filters" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    Filter Type Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics?.filterUsage || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="filter" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-600" />
                    Filter Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics?.filterUsage || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ filter, percent }) => `${filter}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {analytics?.filterUsage.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Timing Analysis */}
          <TabsContent value="timing" className="space-y-6">
            <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  Search Activity by Hour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={analytics?.hourlyDistribution || []}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="hour" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                  Peak search hours help optimize content updates and system maintenance windows
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Insights & Recommendations */}
        <Card className="border-2 border-indigo-200 dark:border-indigo-800 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
              <Sparkles className="w-5 h-5" />
              Key Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Recommendation for Low CTR */}
              {analytics && analytics.clickThroughRate < 30 && (
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-amber-200 dark:border-amber-800">
                  <AlertCircle className="w-5 h-5 text-amber-600 mb-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Low CTR Detected</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click-through rate is below 30%. Consider improving result relevance or adding more engaging snippets.
                  </p>
                </div>
              )}
              
              {/* Recommendation for High Zero Results */}
              {analytics && analytics.zeroResultsQueries.length > 5 && (
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertCircle className="w-5 h-5 text-red-600 mb-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">High Zero Results</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Many searches return no results. Consider adding content for: "{analytics.zeroResultsQueries[0].query}"
                  </p>
                </div>
              )}
              
              {/* Recommendation for High Latency */}
              {analytics && analytics.avgSearchLatency > 500 && (
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-red-200 dark:border-red-800">
                  <Zap className="w-5 h-5 text-red-600 mb-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">High Latency Detected</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Average search time is over 500ms. Review Typesense performance, indexing, and query complexity.
                  </p>
                </div>
              )}
              
              {/* Recommendation for Popular Content (original) */}
              {analytics && analytics.topQueries.length > 0 && (
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-green-200 dark:border-green-800">
                  <TrendingUp className="w-5 h-5 text-green-600 mb-2" />
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Popular Content</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    "{analytics.topQueries[0].query}" is highly searched. Consider featuring this content prominently.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}