import React, { useState } from "react";
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
const BarChart = ({ data }) => {
  const maxValue = Math.max(...data.map((d) => d.count));
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
                height: `${(item.count / maxValue) * 120}px`,
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
const LineChart = ({ data }) => {
  const maxValue = Math.max(...data.map((d) => d.revenue / 1000000));
  const points = data.map((item, idx) => {
    const x = (idx / (data.length - 1)) * 100;
    const y = 100 - (item.revenue / 1000000 / maxValue) * 80;
    return { x, y, value: item.revenue };
  });

  const pathLength =
    Math.sqrt(
      points.reduce((sum, p, idx) => {
        if (idx === 0) return 0;
        const prev = points[idx - 1];
        return (
          sum + Math.sqrt(Math.pow(p.x - prev.x, 2) + Math.pow(p.y - prev.y, 2))
        );
      }, 0),
    ) * 4;

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
  const [statsData] = useState({
    totalAuctions: 1250,
    totalRevenue: 125500000,
    totalUsers: 3450,
    newAuctions: 85,
    newSellers: 12,
    successRate: 87.5,
    topProduct: "iPhone 15 Pro Max",
    paymentStatus: 92,
  });

  // Chart view states
  const [chartViews, setChartViews] = useState({
    auctions: true, // true = bar, false = line
    revenue: true,
    users: true,
    upgrades: true,
  });

  const [chartData] = useState({
    auctionsTrend: [
      { month: "Jan", count: 45 },
      { month: "Feb", count: 52 },
      { month: "Mar", count: 48 },
      { month: "Apr", count: 61 },
      { month: "May", count: 55 },
      { month: "Jun", count: 67 },
    ],
    revenueTrend: [
      { month: "Jan", revenue: 8500000 },
      { month: "Feb", revenue: 9200000 },
      { month: "Mar", revenue: 8900000 },
      { month: "Apr", revenue: 11200000 },
      { month: "May", revenue: 10500000 },
      { month: "Jun", revenue: 12600000 },
    ],
    usersTrend: [
      { month: "Jan", users: 450 },
      { month: "Feb", users: 520 },
      { month: "Mar", users: 580 },
      { month: "Apr", users: 720 },
      { month: "May", users: 850 },
      { month: "Jun", users: 1050 },
    ],
    upgradesTrend: [
      { month: "Jan", count: 3 },
      { month: "Feb", count: 5 },
      { month: "Mar", count: 4 },
      { month: "Apr", count: 7 },
      { month: "May", count: 6 },
      { month: "Jun", count: 12 },
    ],
  });

  const toggleChartView = (chartKey) => {
    setChartViews((prev) => ({
      ...prev,
      [chartKey]: !prev[chartKey],
    }));
  };

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
            subtext="Tăng 15% so với tháng trước"
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
              <LineChart data={chartData.auctionsTrend} />
            )}
          </ChartContainer>

          <ChartContainer
            title="Doanh Thu Hệ Thống"
            description="Biểu đồ doanh thu 6 tháng gần đây"
            isBarChart={chartViews.revenue}
            onToggle={() => toggleChartView("revenue")}
          >
            {chartViews.revenue ? (
              <BarChart
                data={chartData.revenueTrend.map((item) => ({
                  month: item.month,
                  count: Math.round(item.revenue / 1000000),
                }))}
              />
            ) : (
              <LineChart data={chartData.revenueTrend} />
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
              <LineChart
                data={chartData.usersTrend.map((item) => ({
                  month: item.month,
                  revenue: item.users * 100000,
                }))}
              />
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
              <LineChart
                data={chartData.upgradesTrend.map((item) => ({
                  month: item.month,
                  revenue: item.count * 1000000,
                }))}
              />
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
