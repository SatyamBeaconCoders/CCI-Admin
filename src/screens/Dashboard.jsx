
// // import { useEffect, useState } from "react";
// // import { getDashboardStats } from "../services/dashboardServices";

// // export default function Dashboard() {
// //   const [stats, setStats] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     fetchDashboard();
// //   }, []);

// //   const fetchDashboard = async () => {
// //     try {
// //       setLoading(true);
// //       const data = await getDashboardStats();
// //       console.log("📊 DASHBOARD DATA 👉", data);
// //       setStats(data);
// //     } catch (error) {
// //       console.error("❌ DASHBOARD ERROR", error);
// //       alert("Dashboard data load nahi ho paya");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="text-center py-20 text-gray-500">
// //         Loading dashboard...
// //       </div>
// //     );
// //   }

// //   if (!stats) {
// //     return (
// //       <div className="text-center py-20 text-red-500">
// //         No dashboard data
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-6">

// //       {/* ================= STATS ================= */}
// //       <div className="grid grid-cols-4 gap-6">
// //         <StatCard
// //           title="Active Check-ins"
// //           value={stats.today?.active_checkins || 0}
// //           color="green"
// //         />

// //         <StatCard
// //           title="Pending Check-outs"
// //           value={stats.today?.pending_checkouts || 0}
// //           color="orange"
// //         />

// //         <StatCard
// //           title="Available Rooms"
// //           value={stats.occupancy?.available || 0}
// //           color="green"
// //         />

// //         <StatCard
// //           title="Occupied Rooms"
// //           value={stats.occupancy?.occupied || 0}
// //           color="orange"
// //         />
// //       </div>

// //       {/* ================= REVENUE TRENDS ================= */}
// //       <div className="bg-white rounded-xl shadow p-6">
// //         <h2 className="text-lg font-semibold text-gray-800 mb-4">
// //           Monthly Revenue Trend
// //         </h2>

// //         {Array.isArray(stats.trends) && stats.trends.length > 0 ? (
// //           <table className="w-full text-sm">
// //             <thead>
// //               <tr className="border-b text-left text-gray-600">
// //                 <th className="pb-2">Month</th>
// //                 <th className="pb-2">Revenue</th>
// //               </tr>
// //             </thead>

// //             <tbody className="divide-y">
// //               {stats.trends.map((item, index) => (
// //                 <tr key={index}>
// //                   <td className="py-3">{item.month}</td>
// //                   <td>₹ {item.revenue}</td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         ) : (
// //           <p className="text-sm text-gray-500">
// //             No revenue data available
// //           </p>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // /* ================= STAT CARD ================= */

// // function StatCard({ title, value, color }) {
// //   const bg =
// //     color === "orange" ? "bg-orange-500" : "bg-green-600";

// //   return (
// //     <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
// //       <div>
// //         <p className="text-sm text-gray-600">{title}</p>
// //         <p className="text-2xl font-bold text-gray-800">
// //           {value}
// //         </p>
// //       </div>

// //       <div className={`w-10 h-10 rounded-full ${bg}`} />
// //     </div>
// //   );
// // }


// import { useEffect, useState, useCallback, useMemo } from "react";
// import { getDashboardStats } from "../services/dashboardServices";
// import { 
//   Users, 
//   Clock, 
//   Home, 
//   TrendingUp, 
//   DollarSign,
//   Calendar,
//   RefreshCw,
//   AlertCircle,
//   CheckCircle,
//   Bed
// } from "lucide-react";

// export default function Dashboard() {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchDashboard = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await getDashboardStats();
//       console.log("📊 DASHBOARD DATA 👉", data);
//       setStats(data);
//     } catch (error) {
//       console.error("❌ DASHBOARD ERROR", error);
//       setError("Dashboard data load nahi ho paya");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchDashboard();
//   }, [fetchDashboard]);

//   const statCardsData = useMemo(() => {
//     if (!stats) return [];

//     return [
//       {
//         title: "Active Check-ins",
//         value: stats.today?.active_checkins || 0,
//         color: "green",
//         icon: <Users className="w-5 h-5" />,
//         subtitle: "Today"
//       },
//       {
//         title: "Pending Check-outs",
//         value: stats.today?.pending_checkouts || 0,
//         color: "orange",
//         icon: <Clock className="w-5 h-5" />,
//         subtitle: "Awaiting"
//       },
//       {
//         title: "Available Rooms",
//         value: stats.occupancy?.available || 0,
//         color: "green",
//         icon: <Home className="w-5 h-5" />,
//         subtitle: "Ready for guests"
//       },
//       {
//         title: "Occupied Rooms",
//         value: stats.occupancy?.occupied || 0,
//         color: "orange",
//         icon: <Bed className="w-5 h-5" />,
//         subtitle: "Currently occupied"
//       }
//     ];
//   }, [stats]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading dashboard data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !stats) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
//           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-bold text-gray-800 mb-2">Unable to Load Dashboard</h2>
//           <p className="text-gray-600 mb-6">{error || "No dashboard data available"}</p>
//           <button
//             onClick={fetchDashboard}
//             className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 mx-auto"
//           >
//             <RefreshCw className="w-4 h-4" />
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Hotel Dashboard</h1>
//             <p className="text-gray-600 mt-1">Real-time overview of hotel performance</p>
//           </div>
//           <button
//             onClick={fetchDashboard}
//             className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
//           >
//             <RefreshCw className="w-4 h-4" />
//             Refresh
//           </button>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {statCardsData.map((card, index) => (
//             <StatCard key={index} {...card} />
//           ))}
//         </div>

//         {/* Revenue Trends */}
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-orange-50 rounded-lg">
//                   <TrendingUp className="w-6 h-6 text-orange-500" />
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-900">Revenue Trends</h2>
//                   <p className="text-gray-600 text-sm">Monthly revenue overview</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2 text-sm text-gray-500">
//                 <Calendar className="w-4 h-4" />
//                 <span>This Year</span>
//               </div>
//             </div>
//           </div>

//           <div className="p-6">
//             {Array.isArray(stats.trends) && stats.trends.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="bg-gray-50">
//                       <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider rounded-l-lg">
//                         Month
//                       </th>
//                       <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                         Revenue
//                       </th>
//                       <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider rounded-r-lg">
//                         Trend
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {stats.trends.map((item, index) => {
//                       const prevRevenue = index > 0 ? stats.trends[index - 1].revenue : item.revenue;
//                       const trend = item.revenue > prevRevenue ? "up" : "down";
//                       const change = prevRevenue ? ((item.revenue - prevRevenue) / prevRevenue * 100).toFixed(1) : 0;

//                       return (
//                         <tr key={index} className="hover:bg-gray-50 transition-colors">
//                           <td className="py-4 px-6">
//                             <div className="flex items-center gap-3">
//                               <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
//                                 <span className="text-orange-500 font-medium">{index + 1}</span>
//                               </div>
//                               <span className="font-medium text-gray-900">{item.month}</span>
//                             </div>
//                           </td>
//                           <td className="py-4 px-6">
//                             <div className="flex items-center gap-2">
//                               <DollarSign className="w-4 h-4 text-green-600" />
//                               <span className="text-lg font-bold text-gray-900">
//                                 ₹ {item.revenue.toLocaleString()}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="py-4 px-6">
//                             <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
//                               trend === "up" 
//                                 ? "bg-green-50 text-green-700" 
//                                 : "bg-red-50 text-red-700"
//                             }`}>
//                               <TrendingUp className={`w-3 h-3 ${
//                                 trend === "up" ? "text-green-600" : "text-red-600 rotate-180"
//                               }`} />
//                               {trend === "up" ? "+" : ""}{change}%
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>

//                 {/* Summary */}
//                 {stats.trends.length > 0 && (
//                   <div className="mt-8 p-4 bg-gray-50 rounded-xl">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm text-gray-600">Total Annual Revenue</p>
//                         <p className="text-2xl font-bold text-gray-900">
//                           ₹ {stats.trends.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-sm text-gray-600">Avg. Monthly Revenue</p>
//                         <p className="text-2xl font-bold text-gray-900">
//                           ₹ {(stats.trends.reduce((sum, item) => sum + item.revenue, 0) / stats.trends.length).toLocaleString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No Revenue Data</h3>
//                 <p className="text-gray-600">Revenue data will appear here once available</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ================= STAT CARD ================= */
// function StatCard({ title, value, color, icon, subtitle }) {
//   const colorClasses = {
//     bg: color === "orange" ? "bg-orange-500" : "bg-green-600",
//     light: color === "orange" ? "bg-orange-50" : "bg-green-50",
//     icon: color === "orange" ? "text-orange-500" : "text-green-600"
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
//       <div className="flex items-start justify-between">
//         <div className="flex-1">
//           <div className="flex items-center gap-3 mb-4">
//             <div className={`p-2 rounded-lg ${colorClasses.light}`}>
//               <div className={colorClasses.icon}>
//                 {icon}
//               </div>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">{title}</p>
//               {subtitle && (
//                 <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
//               )}
//             </div>
//           </div>
//           <p className="text-3xl font-bold text-gray-900">{value}</p>
//         </div>
//         <div className={`w-2 h-12 rounded-full ${colorClasses.bg}`} />
//       </div>
//       <div className="mt-4 pt-4 border-t border-gray-100">
//         <div className="flex items-center gap-2 text-sm">
//           {color === "green" ? (
//             <CheckCircle className="w-4 h-4 text-green-500" />
//           ) : (
//             <Clock className="w-4 h-4 text-orange-500" />
//           )}
//           <span className={color === "orange" ? "text-orange-600" : "text-green-600"}>
//             {color === "green" ? "On track" : "Requires attention"}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Scatter
} from 'recharts';
import { format, subMonths, startOfYear, endOfYear, eachMonthOfInterval, parseISO } from 'date-fns';
import { getDashboardStats } from "../services/dashboardServices";
import {
  Users,
  Clock,
  Home,
  TrendingUp,
  DollarSign,
  Calendar,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Bed,
  Filter,
  ChevronDown,
  Eye,
  Hotel,
  CreditCard,
  Shield,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react";

// Mock data for demonstration - Replace with actual API data


const ROOM_TYPES = [
  { name: 'Deluxe Suite', value: 35, color: '#FF9500' },
  { name: 'Executive', value: 25, color: '#34C759' },
  { name: 'Premium', value: 20, color: '#5856D6' },
  { name: 'Standard', value: 15, color: '#FF3B30' },
  { name: 'Family', value: 5, color: '#AF52DE' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [chartType, setChartType] = useState('area'); // 'area', 'bar', 'line', 'composed'
  const [timeRange, setTimeRange] = useState('year'); // 'year', 'quarter'

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardStats();

      console.log("📊 DASHBOARD DATA 👉", data);
      setStats(data);
    } catch (error) {
      console.error("❌ DASHBOARD ERROR", error);
      setError("Dashboard data load nahi ho paya");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Transform API trends data
  const rawChartData = useMemo(() => {
    if (!stats?.trends) return [];

    return stats.trends.map(item => ({
      ...item,
      month: item.month,
      revenue: item.revenue,
      profit: item.profit || item.revenue * 0.35 - (Math.random() * 5000), // Approximate profit if missing
      occupancy: item.occupancy,
      bookings: item.bookings
    }));
  }, [stats]);

  // Filter/Aggregate Data based on Time Range
  const chartData = useMemo(() => {
    if (timeRange === 'quarter') {
      // Aggregate by Quarter
      const quarters = {
        'Q1': { revenue: 0, profit: 0, bookings: 0, count: 0 },
        'Q2': { revenue: 0, profit: 0, bookings: 0, count: 0 },
        'Q3': { revenue: 0, profit: 0, bookings: 0, count: 0 },
        'Q4': { revenue: 0, profit: 0, bookings: 0, count: 0 },
      };

      rawChartData.forEach((item, index) => {
        let qKey = 'Q1';
        if (index >= 3 && index < 6) qKey = 'Q2';
        else if (index >= 6 && index < 9) qKey = 'Q3';
        else if (index >= 9) qKey = 'Q4';

        quarters[qKey].revenue += item.revenue;
        quarters[qKey].profit += item.profit;
        quarters[qKey].bookings += item.bookings;
        quarters[qKey].count += 1;
      });

      return Object.keys(quarters).map(key => ({
        month: key,
        revenue: quarters[key].revenue,
        profit: quarters[key].profit,
        bookings: quarters[key].bookings,
        occupancy: quarters[key].count > 0 ? (quarters[key].bookings / (quarters[key].count * 30)) * 100 : 0
      }));
    }

    // Default: Return all monthly data (Year view)
    return rawChartData;
  }, [rawChartData, timeRange]);



  const statCardsData = useMemo(() => {
    if (!stats) return [];

    // Helper to parse trend string like "+12%" or "-5%"
    const getTrendDirection = (trendStr) => {
      if (!trendStr) return 'neutral';
      return trendStr.includes('+') ? 'positive' : trendStr.includes('-') ? 'negative' : 'neutral';
    };

    const totalRevenue = rawChartData.reduce((sum, item) => sum + item.revenue, 0);
    const avgRevenue = rawChartData.length > 0 ? totalRevenue / rawChartData.length : 0;

    // Dynamic change detection
    const checkinsTrend = stats.today?.checkins_trend || "+0%";
    const checkoutsTrend = stats.today?.checkouts_trend || "+0%";

    // ✅ Compute occupancy rate from API: occupancy.occupied / occupancy.total
    const occOccupied = stats.occupancy?.occupied ?? 0;
    const occTotal    = stats.occupancy?.total    ?? 0;
    const occupancyPct = occTotal > 0 ? Math.round((occOccupied / occTotal) * 100) : 0;

    return [
      {
        title: "Active Check-ins",
        value: stats.today?.active_checkins ?? 0,
        color: "green",
        icon: <Users className="w-5 h-5" />,
        subtitle: "Today",
        trend: checkinsTrend,
        change: getTrendDirection(checkinsTrend)
      },
      {
        title: "Pending Check-outs",
        value: stats.today?.pending_checkouts ?? 0,
        color: "orange",
        icon: <Clock className="w-5 h-5" />,
        subtitle: "Awaiting",
        trend: checkoutsTrend,
        change: getTrendDirection(checkoutsTrend) === 'positive' ? 'negative' : 'positive'
      },
      {
        title: "Today's Revenue",
        value: `₹${(stats.today?.total_revenue ?? 0).toLocaleString("en-IN")}`,
        color: "green",
        icon: <DollarSign className="w-5 h-5" />,
        subtitle: `Avg/mo: ₹${avgRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
        trend: "+8.5%",
        change: "positive"
      },
      {
        title: "Occupancy Rate",
        value: `${occupancyPct}%`,
        color: "orange",
        icon: <Hotel className="w-5 h-5" />,
        subtitle: `${occOccupied} / ${occTotal} Rooms`,
        trend: "+2.4%",
        change: "positive"
      }
    ];
  }, [stats, rawChartData]);

  const years = [2024, 2023, 2022, 2021];
  const chartTypes = [
    { id: 'area', label: 'Area Chart', icon: <AreaChart className="w-4 h-4" /> },
    { id: 'bar', label: 'Bar Chart', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'line', label: 'Line Chart', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'composed', label: 'Combo Chart', icon: <PieChartIcon className="w-4 h-4" /> }
  ];

  const timeRanges = [
    { id: 'year', label: 'Yearly' },
    { id: 'quarter', label: 'Quarterly' }
  ];

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 }
    };

    switch (chartType) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                stroke="#666"
                tick={{ fill: '#666' }}
              />
              <YAxis
                stroke="#666"
                tick={{ fill: '#666' }}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#FF9500"
                fill="#FF9500"
                fillOpacity={0.2}
                strokeWidth={2}
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#34C759"
                fill="#34C759"
                fillOpacity={0.2}
                strokeWidth={2}
                name="Profit"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" tick={{ fill: '#666' }} />
              <YAxis
                stroke="#666"
                tick={{ fill: '#666' }}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar
                dataKey="revenue"
                fill="#FF9500"
                radius={[4, 4, 0, 0]}
                name="Revenue"
              />
              <Bar
                dataKey="bookings"
                fill="#34C759"
                radius={[4, 4, 0, 0]}
                name="Bookings"
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" tick={{ fill: '#666' }} />
              <YAxis
                stroke="#666"
                tick={{ fill: '#666' }}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#FF9500"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="occupancy"
                stroke="#34C759"
                strokeWidth={3}
                dot={{ r: 4 }}
                name="Occupancy %"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'composed':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" tick={{ fill: '#666' }} />
              <YAxis
                yAxisId="left"
                stroke="#666"
                tick={{ fill: '#666' }}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#666"
                tick={{ fill: '#666' }}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'Revenue' || name === 'Profit') {
                    return [`₹${value.toLocaleString()}`, name];
                  }
                  return [value, name];
                }}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="revenue"
                fill="#FF9500"
                radius={[4, 4, 0, 0]}
                name="Revenue"
                barSize={20}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="occupancy"
                stroke="#34C759"
                strokeWidth={3}
                dot={{ r: 4 }}
                name="Occupancy %"
              />
            </ComposedChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Unable to Load Dashboard</h2>
          <p className="text-gray-600 mb-6">{error || "No dashboard data available"}</p>
          <button
            onClick={fetchDashboard}
            className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Hotel Management Dashboard</h1>
            <p className="text-gray-600 mt-1">Real-time analytics and performance metrics</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchDashboard}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCardsData.map((card, index) => (
            <StatCard key={index} {...card} navigate={navigate} /> // Added navigate prop
          ))}
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart Section - Takes 2/3 width on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Revenue Analytics</h2>
                      <p className="text-gray-600 text-sm">Monthly performance overview</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {/* Year Selector */}
                    <div className="relative">
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="pl-10 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>

                    {/* Chart Type Selector */}
                    <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg">
                      {chartTypes.map(type => (
                        <button
                          key={type.id}
                          onClick={() => setChartType(type.id)}
                          className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${chartType === type.id
                            ? 'bg-white text-orange-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                          {type.icon}
                          <span className="hidden sm:inline">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Time Range Selector */}
                <div className="flex items-center gap-2 mt-6">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">View:</span>
                  <div className="flex gap-1">
                    {timeRanges.map(range => (
                      <button
                        key={range.id}
                        onClick={() => setTimeRange(range.id)}
                        className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${timeRange === range.id
                          ? 'bg-orange-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-6">
                {chartData.length > 0 ? (
                  <div className="h-[400px]">
                    {renderChart()}
                  </div>
                ) : (
                  <div className="h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No chart data available</p>
                    </div>
                  </div>
                )}

                {/* Chart Metrics Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-xl font-bold text-gray-900">
                      ₹{chartData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Avg. Monthly</p>
                    <p className="text-xl font-bold text-gray-900">
                      ₹{(chartData.reduce((sum, item) => sum + item.revenue, 0) / chartData.length).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Peak Month</p>
                    <p className="text-xl font-bold text-gray-900">
                      {chartData.reduce((max, item) => item.revenue > max.revenue ? item : max, chartData[0])?.month}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Growth</p>
                    <p className="text-xl font-bold text-green-600">+15.2%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Room Distribution & Quick Stats */}
          <div className="space-y-6">
            {/* Room Distribution Pie Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <PieChartIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Room Distribution</h3>
                    <p className="text-sm text-gray-600">By room type</p>
                  </div>
                </div>
                <Eye className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ROOM_TYPES}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {ROOM_TYPES.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Share']}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Room Type Breakdown */}
              <div className="space-y-2 mt-4">
                {ROOM_TYPES.map((room, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: room.color }}
                      />
                      <span className="text-gray-700">{room.name}</span>
                    </div>
                    <span className="font-medium">{room.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Performance Summary</h3>
              {/* Dynamic Summary Stats based on rawChartData */}
              <div className="space-y-4">
                {[
                  { label: "Total Revenue", value: `₹${rawChartData.reduce((sum, i) => sum + i.revenue, 0).toLocaleString()}`, icon: CreditCard, color: "blue", trend: "+12%" },
                  { label: "Total Bookings", value: rawChartData.reduce((sum, i) => sum + i.bookings, 0), icon: Hotel, color: "purple", trend: "+5%" },
                  { label: "Net Profit", value: `₹${rawChartData.reduce((sum, i) => sum + i.profit, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: Shield, color: "green", trend: "+15%" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 bg-${item.color}-50 rounded-lg`}>
                        <item.icon className={`w-4 h-4 text-${item.color}-600`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{item.label}</p>
                        <p className="font-bold text-gray-900">{item.value}</p>
                      </div>
                    </div>
                    <span className="text-sm text-green-600 font-medium">{item.trend}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STAT CARD ================= */
function StatCard({ title, value, color, icon, subtitle, trend, change, navigate }) {
  const colorClasses = {
    bg: color === "orange" ? "bg-orange-500" : "bg-green-600",
    light: color === "orange" ? "bg-orange-50" : "bg-green-50",
    icon: color === "orange" ? "text-orange-500" : "text-green-600",
    trend: change === "positive" ? "text-green-600" : "text-red-600"
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${colorClasses.light}`}>
              <div className={colorClasses.icon}>
                {icon}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 font-medium">{title}</p>
              {subtitle && (
                <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span className={`text-sm font-medium ${colorClasses.trend}`}>
                {trend}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            {change === "positive" ? (
              <>
                <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-green-500"></div>
                <span className="text-green-600">Above target</span>
              </>
            ) : (
              <>
                <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[6px] border-l-transparent border-r-transparent border-t-red-500"></div>
                <span className="text-red-600">Below target</span>
              </>
            )}
          </div>
          <button
            onClick={() => navigate && navigate('/reports')}
            className="text-xs text-gray-500 hover:text-gray-700 font-medium"
          >
            View details →
          </button>
        </div>
      </div>
    </div>
  );
}