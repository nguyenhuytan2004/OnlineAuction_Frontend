import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  ClipboardList,
  TrendingUp,
  Calendar,
  FileText,
  Star,
  AlertCircle,
} from "lucide-react";

import adminSellerUpgradeService from "../../services/adminSellerUpgradeService";
import { notify } from "../../utils/toast";

// Action Modal Component
const ActionModal = ({
  isModalOpen,
  selectedRequest,
  modalAction,
  setIsModalOpen,
  rejectionReason,
  setRejectionReason,
  handleConfirmAction,
}) => {
  if (!isModalOpen || !selectedRequest) return null;

  const isApprove = modalAction === "approve";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl w-full max-w-lg overflow-hidden border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-300">
        <div
          className={`bg-gradient-to-r ${
            isApprove
              ? "from-emerald-600 to-green-600"
              : "from-red-600 to-rose-600"
          } p-6 text-white`}
        >
          <div className="flex items-center gap-3 mb-2">
            {isApprove ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <XCircle className="w-6 h-6" />
            )}
            <h2 className="text-xl font-black">
              {isApprove ? "Duyệt Yêu Cầu" : "Từ Chối Yêu Cầu"}
            </h2>
          </div>
          <p className="text-sm text-white/90">
            {isApprove
              ? "Người dùng sẽ được nâng cấp lên Seller"
              : "Hãy cung cấp lý do từ chối"}
          </p>
        </div>

        <div className="p-6">
          <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-slate-400 mb-2">Người xin nâng cấp</p>
            <p className="font-bold text-slate-100 text-lg">
              {selectedRequest.name}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {selectedRequest.email}
            </p>
          </div>

          <div className="bg-slate-800/30 rounded-xl p-4 mb-6 border border-slate-700">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-slate-500 mb-1">Lượt Đấu</p>
                <p className="font-black text-slate-100">
                  {selectedRequest.participationCount ?? 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Lượt Thắng</p>
                <p className="font-black text-slate-100">
                  {selectedRequest.winCount ?? 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Đánh Giá</p>
                <p className="font-black text-slate-100">
                  {selectedRequest.avgRating ?? 0}⭐
                </p>
              </div>
            </div>
          </div>

          {!isApprove && (
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Nhập lý do từ chối nâng cấp..."
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 mb-6 resize-none"
              rows="4"
            />
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmAction}
              disabled={!isApprove && !rejectionReason.trim()}
              className={`flex-1 py-2.5 px-4 font-bold rounded-lg transition-all duration-300 ${
                isApprove
                  ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white hover:scale-105"
                  : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {isApprove ? "Duyệt" : "Từ Chối"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminUpgradeAccountReview = () => {
  const [upgradeRequests, setUpgradeRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPendingRequests = async () => {
    try {
      const res = await adminSellerUpgradeService.getPendingRequests();

      console.log("RAW RESPONSE:", res); // ← sẽ là array

      const raw = Array.isArray(res) ? res : [];

      const normalized = raw.map((r) => ({
        id: r.requestId,
        requestId: r.requestId,
        userId: r.userId,
        name: r.userFullName,
        email: r.userEmail,
        status: r.status,
        requestDate: r.requestAt,
        participationCount: 0,
        winCount: 0,
        avgRating: 0,
        reason: r.comments ?? "",
        phone: "N/A",
        location: "N/A",
      }));

      setUpgradeRequests(normalized);
    } catch (error) {
      console.error(error);
      notify.error("Không thể tải danh sách yêu cầu");
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const handleOpenModal = (request, action) => {
    setSelectedRequest(request);
    setModalAction(action);
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedRequest || !modalAction) return;

    try {
      const payload =
        modalAction === "approve"
          ? {
              status: "APPROVED",
              comments: null,
            }
          : {
              status: "REJECTED",
              comments: rejectionReason.trim(),
            };

      await adminSellerUpgradeService.reviewRequest(
        selectedRequest.id,
        payload,
      );

      notify.success(
        modalAction === "approve"
          ? "Đã duyệt yêu cầu nâng cấp"
          : "Đã từ chối yêu cầu nâng cấp",
      );

      // Xóa request khỏi danh sách UI
      setUpgradeRequests((prev) =>
        prev.filter((r) => r.id !== selectedRequest.id),
      );

      setIsModalOpen(false);
      setSelectedRequest(null);
      setRejectionReason("");
    } catch (error) {
      console.error(error);
      notify.error("Xử lý yêu cầu thất bại");
    }
  };


  const RatingBadge = ({ rating }) => (
    <div className="flex items-center gap-1">
      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
      <span className="font-bold text-slate-100">{rating ?? 0}</span>
      <span className="text-xs text-slate-500">/5</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-3xl shadow-2xl shadow-amber-500/20 p-8 border border-slate-700/50 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-orange-600/10"></div>
            <div className="flex items-center gap-4 relative z-10">
              <ClipboardList className="w-12 h-12 text-amber-400" />
              <div>
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 mb-2 tracking-tight">
                  Duyệt Yêu Cầu Nâng Cấp
                </h1>
                <p className="text-slate-300 font-semibold tracking-wide">
                  Xét duyệt yêu cầu nâng cấp từ Bidder → Seller
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-300 font-semibold mb-1">
              {loading
                ? "Đang tải danh sách..."
                : `Yêu cầu chờ xét duyệt: ${upgradeRequests.length}`}
            </p>
            <p className="text-blue-200/80 text-sm">
              Vui lòng kiểm tra thông tin người dùng trước khi duyệt hoặc từ chối
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {upgradeRequests.map((request) => {
            const participation = request.participationCount ?? 0;
            const win = request.winCount ?? 0;
            const winRate =
              participation > 0 ? ((win / participation) * 100).toFixed(1) : "0.0";

            const rawDate = request.requestDate ?? request.createdAt ?? request.createdTime;
            const dateLabel = rawDate
              ? new Date(rawDate).toLocaleDateString("vi-VN")
              : "N/A";

            return (
              <div
                key={request.id}
                className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-lg hover:shadow-slate-900/50"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-black text-white">
                          {(request.name ?? "?").charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-slate-100">
                            {request.name}
                          </h3>
                          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-500/20 text-amber-300">
                            <TrendingUp className="w-3 h-3 inline mr-1" />
                            Chờ xét duyệt
                          </span>
                        </div>
                        <p className="text-sm text-slate-400">{request.email}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-slate-500">
                      <div className="flex items-center gap-1 mb-1">
                        <Calendar className="w-4 h-4" />
                        {dateLabel}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <h4 className="text-sm font-bold text-slate-300 mb-3">
                        Thông Tin Cơ Bản
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-slate-500">ID Bidder</p>
                          <p className="font-semibold text-slate-100">
                            {request.bidderId ?? request.userId ?? "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Điện thoại</p>
                          <p className="font-semibold text-slate-100">
                            {request.phone ?? "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Địa điểm</p>
                          <p className="font-semibold text-slate-100">
                            {request.location ?? "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <h4 className="text-sm font-bold text-slate-300 mb-3">
                        Hoạt Động Hiện Tại
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Lượt tham gia</span>
                          <span className="font-bold text-blue-400">
                            {participation}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Lượt thắng</span>
                          <span className="font-bold text-emerald-400">{win}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Tỷ lệ thắng</span>
                          <span className="font-bold text-slate-100">{winRate}%</span>
                        </div>
                        <div className="pt-2 border-t border-slate-700 flex justify-between items-center">
                          <span className="text-slate-500">Xếp hạng</span>
                          <RatingBadge rating={request.avgRating} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <h4 className="text-sm font-bold text-slate-300 mb-3">
                        Lý Do Nâng Cấp
                      </h4>
                      <p className="text-sm text-slate-300 line-clamp-4">
                        {request.reason ?? "N/A"}
                      </p>
                      <button className="mt-3 text-xs text-slate-400 hover:text-slate-200 font-semibold flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Xem chi tiết
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-700">
                    <button
                      onClick={() => handleOpenModal(request, "reject")}
                      className="flex-1 py-3 px-4 bg-red-600/20 hover:bg-red-600/30 text-red-300 font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 group"
                    >
                      <XCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Từ Chối
                    </button>
                    <button
                      onClick={() => handleOpenModal(request, "approve")}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 group"
                    >
                      <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Duyệt
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!loading && upgradeRequests.length === 0 && (
          <div className="text-center py-16">
            <ClipboardList className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-semibold">
              Không có yêu cầu nâng cấp nào chờ xét duyệt
            </p>
          </div>
        )}
      </div>

      <ActionModal
        isModalOpen={isModalOpen}
        selectedRequest={selectedRequest}
        modalAction={modalAction}
        setIsModalOpen={setIsModalOpen}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        handleConfirmAction={handleConfirmAction}
      />
    </div>
  );
};

export default AdminUpgradeAccountReview;
