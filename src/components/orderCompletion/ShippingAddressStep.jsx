import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MapPin, MapPinHouse, ChevronDown } from "lucide-react";
import CustomDropdown from "../../components/common/CustomDropdown";
import orderService from "../../services/orderService";

const ShippingAddressStep = ({ onNext }) => {
  const [selectedCityIndex, setSelectedCityIndex] = useState(null);

  const cities = [
    "Hà Nội",
    "TP Hồ Chí Minh",
    "Đà Nẵng",
    "Hải Phòng",
    "Cần Thơ",
  ];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      ward: "",
      district: "",
      city: "",
      postalCode: "",
    },
  });

  const handleSelectCity = (index) => {
    setSelectedCityIndex(index);
    setValue("city", cities[index]);
  };

  const onSubmit = async (data) => {
    try {
      const orderId = 1;

      const shippingAddress = [
        data.fullName,
        data.phone,
        data.address,
        data.ward,
        data.district,
        data.city,
        data.postalCode,
      ]
        .filter(Boolean)
        .join(", ");

      await orderService.setShippingAddress(orderId, shippingAddress);

      onNext();
    } catch (error) {
      console.error("Error submitting shipping address:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-8 bg-gradient-to-br from-slate-900/80 to-slate-800/60 rounded-2xl border border-slate-700/50 backdrop-blur-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <MapPinHouse className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white font-['Montserrat']">
              Địa chỉ giao hàng
            </h3>
            <p className="text-sm text-gray-400 font-['Montserrat']">
              Vui lòng cung cấp địa chỉ chính xác để giao hàng
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name & Email */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="fullName"
              className="block text-gray-300 font-semibold mb-2 font-['Montserrat']"
            >
              Họ và tên <span className="text-red-400">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Nhập họ và tên"
              {...register("fullName", {
                required: "Vui lòng nhập họ tên",
                minLength: {
                  value: 3,
                  message: "Họ tên phải có ít nhất 3 ký tự",
                },
                pattern: {
                  value: /^[a-zA-ZÀ-ỿ\s]+$/,
                  message: "Họ tên không được chứa ký tự đặc biệt",
                },
              })}
              className={`w-full px-5 py-3.5 bg-slate-800/50 text-slate-100 font-semibold border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 placeholder-slate-500 backdrop-blur-sm ${
                errors.fullName ? "border-red-500/50" : "border-slate-600/50"
              }`}
            />
            {errors.fullName && (
              <p className="text-red-400 text-sm mt-2 font-['Montserrat']">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-gray-300 font-semibold mb-2 font-['Montserrat']"
            >
              Email <span className="text-red-400">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@email.com"
              {...register("email", {
                required: "Vui lòng nhập email",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email không hợp lệ",
                },
              })}
              className={`w-full px-5 py-3.5 bg-slate-800/50 text-slate-100 font-semibold border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 placeholder-slate-500 backdrop-blur-sm ${
                errors.email ? "border-red-500/50" : "border-slate-600/50"
              }`}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-2 font-['Montserrat']">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-gray-300 font-semibold mb-2 font-['Montserrat']"
          >
            Số điện thoại <span className="text-red-400">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="0123456789"
            {...register("phone", {
              required: "Vui lòng nhập số điện thoại",
              pattern: {
                value: /^0\d{9,10}$/,
                message: "Số điện thoại phải bắt đầu bằng 0 và có 10-11 chữ số",
              },
            })}
            className={`w-full px-5 py-3.5 bg-slate-800/50 text-slate-100 font-semibold border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 placeholder-slate-500 backdrop-blur-sm ${
              errors.phone ? "border-red-500/50" : "border-slate-600/50"
            }`}
          />
          {errors.phone && (
            <p className="text-red-400 text-sm mt-2 font-['Montserrat']">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-gray-300 font-semibold mb-2 font-['Montserrat']"
          >
            Địa chỉ chi tiết <span className="text-red-400">*</span>
          </label>
          <input
            id="address"
            type="text"
            placeholder="Số nhà, đường phố..."
            {...register("address", {
              required: "Vui lòng nhập địa chỉ",
              minLength: {
                value: 5,
                message: "Địa chỉ phải có ít nhất 5 ký tự",
              },
            })}
            className={`w-full px-5 py-3.5 bg-slate-800/50 text-slate-100 font-semibold border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 placeholder-slate-500 backdrop-blur-sm ${
              errors.address ? "border-red-500/50" : "border-slate-600/50"
            }`}
          />
          {errors.address && (
            <p className="text-red-400 text-sm mt-2 font-['Montserrat']">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Ward & District */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="ward"
              className="block text-gray-300 font-semibold mb-2 font-['Montserrat']"
            >
              Phường/Xã <span className="text-red-400">*</span>
            </label>
            <input
              id="ward"
              type="text"
              placeholder="Nhập phường/xã"
              {...register("ward", {
                required: "Vui lòng nhập phường/xã",
              })}
              className={`w-full px-5 py-3.5 bg-slate-800/50 text-slate-100 font-semibold border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 placeholder-slate-500 backdrop-blur-sm ${
                errors.ward ? "border-red-500/50" : "border-slate-600/50"
              }`}
            />
            {errors.ward && (
              <p className="text-red-400 text-sm mt-2 font-['Montserrat']">
                {errors.ward.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="district"
              className="block text-gray-300 font-semibold mb-2 font-['Montserrat']"
            >
              Quận/Huyện <span className="text-red-400">*</span>
            </label>
            <input
              id="district"
              type="text"
              placeholder="Nhập quận/huyện"
              {...register("district", {
                required: "Vui lòng nhập quận/huyện",
              })}
              className={`w-full px-5 py-3.5 bg-slate-800/50 text-slate-100 font-semibold border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 placeholder-slate-500 backdrop-blur-sm ${
                errors.district ? "border-red-500/50" : "border-slate-600/50"
              }`}
            />
            {errors.district && (
              <p className="text-red-400 text-sm mt-2 font-['Montserrat']">
                {errors.district.message}
              </p>
            )}
          </div>
        </div>

        {/* City & Postal Code */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="district"
              className="block text-gray-300 font-semibold mb-2 font-['Montserrat']"
            >
              Thành phố <span className="text-red-400">*</span>
            </label>
            <CustomDropdown
              options={cities}
              selectedIndex={selectedCityIndex}
              onSelect={handleSelectCity}
              placeholder="Chọn thành phố"
              accentColor="amber"
              error={!!errors.city}
            />
            {/* Hidden input for form registration */}
            <input
              id="city"
              type="hidden"
              {...register("city", {
                required: "Vui lòng chọn thành phố",
              })}
              value={
                selectedCityIndex !== null ? cities[selectedCityIndex] : ""
              }
            />
            {errors.city && (
              <p className="text-red-400 text-sm mt-2 font-['Montserrat']">
                {errors.city.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="postalCode"
              className="block text-gray-300 font-semibold mb-2 font-['Montserrat']"
            >
              Mã bưu chính
            </label>
            <input
              id="postalCode"
              type="text"
              placeholder="Mã bưu chính (tuỳ chọn)"
              {...register("postalCode")}
              className="w-full px-5 py-3.5 bg-slate-800/50 text-slate-100 font-semibold border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 placeholder-slate-500 backdrop-blur-sm border-slate-600/50"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="p-5 bg-gradient-to-r from-amber-900/30 via-amber-800/20 to-amber-900/30 border border-amber-500/50 rounded-xl">
          <p className="text-amber-200 text-sm font-semibold flex items-start gap-3">
            Vui lòng kiểm tra kỹ thông tin địa chỉ để tránh lỗi giao hàng. Nếu
            có thay đổi, bạn có thể cập nhật trong bước xác nhận.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg font-['Montserrat']"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 hover:from-amber-500 hover:to-orange-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-amber-500/50 font-['Montserrat'] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              "Tiếp tục"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShippingAddressStep;
