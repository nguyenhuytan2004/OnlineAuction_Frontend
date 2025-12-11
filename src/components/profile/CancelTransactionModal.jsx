import React from "react";
import { useForm } from "react-hook-form";
import { AlertTriangle, XCircle, X } from "lucide-react";

/**
 * Modal huỷ giao dịch - Red theme
 */
const CancelTransactionModal = ({ isOpen, onClose, product, onSubmit }) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: {
            comment: "Người thắng không thanh toán",
        },
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmitForm = async (data) => {
        try {
            await onSubmit({
                productId: product.productId,
                comment: data.comment,
            });
            handleClose();
        } catch (error) {
            console.error("Cancel transaction error:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl w-[480px] overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-700">
                {/* Header with Red Theme */}
                <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6 text-white relative">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <h2 className="text-2xl font-black mb-2">Huỷ giao dịch</h2>
                    <p className="text-red-50">
                        Xác nhận huỷ giao dịch với người mua
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmitForm)} className="p-6">
                    {/* Product Info */}
                    <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="flex items-start gap-4">
                            <img
                                src={product.mainImageUrl}
                                alt={product.productName}
                                className="w-12 h-12 object-cover rounded-lg border border-slate-600"
                            />
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-100 mb-1">
                                    {product.productName}
                                </h3>
                                <p className="text-sm text-slate-400">
                                    Người mua:{" "}
                                    {product.winner?.fullName ||
                                        product.highestBidder?.fullName ||
                                        "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Warning */}
                    <div className="mb-6 p-5 bg-red-500/10 border-2 border-red-500/30 rounded-xl">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-red-400 font-bold mb-2">
                                    Cảnh báo quan trọng
                                </p>
                                <ul className="text-xs text-red-300 space-y-1 list-disc list-inside">
                                    <li>Người mua sẽ bị trừ 1 điểm đánh giá</li>
                                    <li>Hành động này không thể hoàn tác</li>
                                    <li>Giao dịch sẽ bị huỷ vĩnh viễn</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Comment */}
                    <div className="mb-6">
                        <label
                            htmlFor="comment"
                            className="block text-sm font-bold text-slate-200 mb-2"
                        >
                            Lý do huỷ giao dịch{" "}
                            <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            id="comment"
                            {...register("comment", {
                                required: "Vui lòng nhập lý do huỷ giao dịch",
                                maxLength: {
                                    value: 1000,
                                    message: "Lý do không được quá 1000 ký tự",
                                },
                            })}
                            className="w-full h-20 px-4 py-3 bg-slate-800/50 border-2 border-slate-600 rounded-xl focus:border-slate-500 focus:ring-4 focus:ring-slate-500/20 transition-all resize-none text-slate-100 placeholder-slate-500 focus:outline-none"
                            placeholder="Nhập lý do huỷ giao dịch..."
                        />
                        <div className="flex justify-between items-center mt-2">
                            {errors.comment && (
                                <p className="text-sm text-red-400 font-semibold">
                                    {errors.comment.message}
                                </p>
                            )}
                            <span className="text-sm text-slate-500 ml-auto">
                                {watch("comment")?.length || 0}/255
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 py-3 px-6 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-xl transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-5 h-5" />
                                    Xác nhận huỷ
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CancelTransactionModal;
