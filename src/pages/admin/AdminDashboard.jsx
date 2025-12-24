import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  ShoppingBag,
  Banknote,
  CheckCircle,
  Eye,
  CreditCard,
  Activity,
} from "lucide-react";

import adminDashboardService from "../../services/adminDashboardService";

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, subtext, color }) => (
  <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-slate-400 text-sm font-semibold mb-2 uppercase tracking-wider">
          {label}
        </p>
        <p className={`text-3xl font-black ${color} mb-1 tracking-tight`}>
          {value}
        </p>
        {subtext && <p className="text-slate-500 text-xs">{subtext}</p>}
      </div>
      {Icon && (
        <div
          className={`p-3 rounded-xl ${color
            .replace("text-", "bg-")
            .replace("-300", "-500/20")
            .replace("-400", "-500/20")
            .replace("-500", "-500/20")}`}
        >
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      )}
    </div>
  </div>
);

// Chart Container Component with Toggle
const ChartContainer = ({
  title,
  description,
  children,
  onToggle,
  isBarChart,
}) => (
  <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300">
    <div className="flex items-center justify-between mb-1">
      <h3 className="text-lg font-bold text-slate-100">{title}</h3>
      <div className="flex gap-2 bg-slate-700/30 p-1 rounded-lg">
        <button
          onClick={() => isBarChart === false && onToggle()}
          className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-300 ${
            isBarChart
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
              : "bg-slate-700/50 text-slate-400 hover:text-slate-300"
          }`}
        >
          Cột
        </button>
        <button
          onClick={() => isBarChart === true && onToggle()}
          className={`px-3 py-1 text-xs font-bold rounded-md transition-all duration-300 ${
            !isBarChart
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
              : "bg-slate-700/50 text-slate-400 hover:text-slate-300"
          }`}
        >
          Đường
        </button>
      </div>
    </div>
    <p className="text-slate-500 text-sm mb-6">{description}</p>
    <div className="w-full h-64 flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-700/30">
      {children}
    </div>
  </div>
);

// Bar Chart
const BarChart = ({ data, valueKey = "count" }) => {
  if (!data || data.length === 0) {
    return <p className="text-slate-500">Không có dữ liệu</p>;
  }

  const values = data.map((d) => d[valueKey] ?? 0);
  const maxValue = Math.max(...values, 1);
  return (
    <div className="w-full flex items-flex-end justify-around gap-2 px-4 py-8">
      {data.map((item, idx) => (
        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
          <div className="relative w-full h-32 flex items-end justify-center">
            <div
              className="w-full max-w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg 
               transition-all duration-700 ease-out 
               hover:from-blue-600 hover:to-blue-500 cursor-pointer group 
               transform origin-bottom"
              style={{
                height: `${(item[valueKey] / maxValue) * 120}px`,
                animation: `scaleUp 0.7s ease-out ${idx * 0.1}s both`,
                transformOrigin: "bottom",
              }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 px-2 py-1 rounded text-xs text-blue-300 whitespace-nowrap">
                {item.count}
              </div>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {item.month}
          </span>
        </div>
      ))}
    </div>
  );
};

// Line Chart
const LineChart = ({ data, valueKey }) => {
  if (!data || data.length === 0) {
    return <p className="text-slate-500">Không có dữ liệu</p>;
  }

  if (data.length === 1) {
    return (
      <div className="text-slate-400 text-sm">
        {data[0].month}: {(data[0][valueKey] ?? 0).toLocaleString()}
      </div>
    );
  }

  const values = data.map((d) => d[valueKey] ?? 0);
  const maxValue = Math.max(...values, 1);

  const points = data.map((item, idx) => {
    const x = (idx / (data.length - 1)) * 100;
    const y = 100 - (item[valueKey] / maxValue) * 80;
    return { x, y, value: item[valueKey] };
  });

  if (!data || data.length === 0) {
    return <p className="text-slate-500">Không có dữ liệu</p>;
  }

  if (data.length === 1) {
    return (
      <div className="text-slate-400 text-sm">
        {data[0].month}: {data[0].revenue.toLocaleString()}
      </div>
    );
  }


  return (
    <>
      <style>{`
        @keyframes drawLine {
          from {
            stroke-dashoffset: ${pathLength};
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            r: 0;
            opacity: 0;
          }
          to {
            r: 3;
            opacity: 1;
          }
        }
      `}</style>
      <svg
        className="w-full h-full"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        <g stroke="#334155" strokeDasharray="4" opacity="0.2">
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={`hline-${y}`}
              x1="0"
              y1={y}
              x2="400"
              y2={y}
              strokeWidth="0.5"
            />
          ))}
        </g>
        {/* Line */}
        <polyline
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
          style={{
            strokeDasharray: pathLength,
            animation: `drawLine 1.5s ease-out forwards`,
          }}
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {/* Fill under line */}
        <polygon
          points={`0,100 ${points
            .map((p) => `${p.x},${p.y}`)
            .join(" ")} 400,100`}
          fill="url(#gradient)"
          opacity="0.3"
          style={{
            animation: `fadeInUp 1.2s ease-out 0.2s forwards`,
            opacity: 0,
          }}
        />
        {/* Data points */}
        {points.map((p, idx) => (
          <circle
            key={`point-${idx}`}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="#3b82f6"
            style={{
              animation: `scaleIn 0.6s ease-out ${0.8 + idx * 0.1}s forwards`,
              opacity: 0,
            }}
            className="hover:scale-125 transition-transform hover:fill-blue-300 cursor-pointer"
          />
        ))}
      </svg>
    </>
  );
};



const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState(null);
  const [chartData, setChartData] = useState(null);

  const [chartViews, setChartViews] = useState({
    auctions: true,
    revenue: true,
    users: true,
    upgrades: true,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await adminDashboardService.getDashboard();
        const { overview, charts } = data;

        // ===== OVERVIEW =====
        setStatsData({
          totalAuctions: overview.totalAuctions,
          totalRevenue: overview.totalRevenue,
          totalUsers: overview.totalUsers,
          newAuctions: overview.newAuctionsThisMonth,
          newSellers: overview.newSellersThisMonth,
          successRate: overview.successRate,
          topProduct: overview.topProduct,
          paymentStatus: overview.paymentSuccessRate,
        });

        // ===== CHARTS =====
        setChartData({
          auctionsTrend: charts.auctionsTrend,
          revenueTrend: charts.revenueTrend,
          usersTrend: charts.usersTrend,
          upgradesTrend: charts.upgradesTrend,
        });
      } catch (error) {
        console.error("Failed to load dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const toggleChartView = (key) => {
    setChartViews((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Đang tải dashboard...
      </div>
    );
  }

  if (!statsData || !chartData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-3xl shadow-2xl shadow-blue-500/20 p-8 border border-slate-700/50 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
            <div className="flex items-center gap-4 relative z-10">
              <BarChart3 className="w-12 h-12 text-blue-400" />
              <div>
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2 tracking-tight">
                  Bảng Điều Khiển Quản Trị
                </h1>
                <p className="text-slate-300 font-semibold tracking-wide">
                  Tổng quan hệ thống và phân tích dữ liệu
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Stats - 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={ShoppingBag}
            label="Tổng Sàn Đấu Giá"
            value={statsData.totalAuctions.toLocaleString()}
            subtext="Tất cả các lần"
            color="text-blue-400"
          />

          <StatCard
            icon={Banknote}
            label="Doanh Thu Hệ Thống"
            value={statsData.totalRevenue.toLocaleString()}
            subtext="Tính đến hôm nay"
            color="text-emerald-400"
          />

          <StatCard
            icon={Users}
            label="Tổng Người Dùng"
            value={statsData.totalUsers.toLocaleString()}
            subtext="Đang hoạt động"
            color="text-purple-400"
          />

          <StatCard
            icon={Activity}
            label="Sàn Mới (Tháng này)"
            value={statsData.newAuctions}
            subtext={`Seller mới: ${statsData.newSellers}`}
            color="text-amber-400"
          />
        </div>

        {/* Charts Grid - 2x2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartContainer
            title="Số Lượng Sàn Đấu Giá Mới"
            description="Xu hướng sàn đấu giá tạo mới theo tháng"
            isBarChart={chartViews.auctions}
            onToggle={() => toggleChartView("auctions")}
          >
            {chartViews.auctions ? (
              <BarChart data={chartData.auctionsTrend} />
            ) : (
              <LineChart data={chartData.auctionsTrend} valueKey="count" />
            )}
          </ChartContainer>

          <ChartContainer
            title="Doanh Thu Hệ Thống"
            description="Biểu đồ doanh thu 6 tháng gần đây"
            isBarChart={chartViews.revenue}
            onToggle={() => toggleChartView("revenue")}
          >
            {chartViews.revenue ? (
              <BarChart data={chartData.revenueTrend} valueKey="revenue" />
            ) : (
              <LineChart data={chartData.revenueTrend} valueKey="revenue" />
            )}
          </ChartContainer>

          <ChartContainer
            title="Số Lượng Người Dùng Mới"
            description="Tăng trưởng người dùng theo tháng"
            isBarChart={chartViews.users}
            onToggle={() => toggleChartView("users")}
          >
            {chartViews.users ? (
              <BarChart data={chartData.usersTrend} />
            ) : (
              <LineChart data={chartData.usersTrend} valueKey="count" />
            )}
          </ChartContainer>

          <ChartContainer
            title="Bidder Nâng Cấp Lên Seller"
            description="Yêu cầu nâng cấp theo tháng"
            isBarChart={chartViews.upgrades}
            onToggle={() => toggleChartView("upgrades")}
          >
            {chartViews.upgrades ? (
              <BarChart data={chartData.upgradesTrend} />
            ) : (
              <LineChart data={chartData.upgradesTrend} valueKey="count" />
            )}
          </ChartContainer>
        </div>

        {/* Additional Stats - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
              <h3 className="font-bold text-slate-100">Tỷ Lệ Thành Công</h3>
            </div>
            <p className="text-3xl font-black text-emerald-400 mb-2">
              {statsData.successRate}%
            </p>
            <p className="text-sm text-slate-400">
              Sàn đấu giá hoàn tất thành công
            </p>
            <div className="mt-4 w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${statsData.successRate}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-cyan-400" />
              <h3 className="font-bold text-slate-100">Top Sản Phẩm</h3>
            </div>
            <p className="text-lg font-bold text-slate-100 mb-2 truncate">
              {statsData.topProduct}
            </p>
            <p className="text-sm text-slate-400">
              Sản phẩm được quan tâm nhất
            </p>
            <button className="mt-4 w-full px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-cyan-300 text-sm font-semibold rounded-lg transition-colors">
              Xem Chi Tiết
            </button>
          </div>

          <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-green-400" />
              <h3 className="font-bold text-slate-100">
                Tình Trạng Thanh Toán
              </h3>
            </div>
            <p className="text-3xl font-black text-green-400 mb-2">
              {statsData.paymentStatus}%
            </p>
            <p className="text-sm text-slate-400">Giao dịch đã thanh toán</p>
            <div className="mt-4 w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${statsData.paymentStatus}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
