import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Save,
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
} from "lucide-react";

/**
 * Modal bổ sung mô tả sản phẩm - Amber/Orange theme với WYSIWYG (Simplified)
 * Hỗ trợ: Bold, Italic, Underline, Heading
 */
const AddDescriptionModal = ({ isOpen, onClose, product, onSubmit }) => {
  const [additionalDescription, setAdditionalDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    if (isOpen && editorRef.current) {
      editorRef.current.focus();
    }
  }, [isOpen]);

  const handleClose = () => {
    setAdditionalDescription("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      await onSubmit({
        productId: product.productId,
        additionalDescription: additionalDescription.trim(),
      });
      handleClose();
    } catch (error) {
      console.error("Add description error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setAdditionalDescription(editorRef.current.innerHTML);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl shadow-amber-500/30 border border-slate-700/50 w-full max-w-2xl animate-in fade-in zoom-in-90 duration-300 border-slate-700">
        {/* Header with Amber/Orange Theme */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600  p-8 text-white relative rounded-t-3xl">
          <button
            onClick={handleClose}
            className="absolute top-8 right-8 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-black mb-2">
            Bổ sung thông tin sản phẩm
          </h2>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="px-8 pt-8 space-y-6 max-h-[80vh] overflow-y-auto flex flex-col"
        >
          {/* Product Info */}
          <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="flex items-start gap-4">
              <img
                src={product.mainImageUrl || null}
                alt={product.productName}
                className="w-20 h-20 object-cover rounded-lg border border-slate-600"
              />
              <div className="flex-1">
                <h3 className="font-bold text-slate-100 mb-1">
                  {product.productName}
                </h3>
                <p className="text-sm text-slate-400">
                  Danh mục: {product.category?.categoryName || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Current Description */}
          {product.description && (
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-200 mb-2">
                Mô tả hiện tại
              </label>
              <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700 max-h-32 overflow-y-auto">
                <p className="text-sm text-slate-300 whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            </div>
          )}

          {/* WYSIWYG Editor */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-200 mb-2">
              Thông tin bổ sung <span className="text-red-400">*</span>
            </label>

            {/* Toolbar */}
            <div className="flex items-center gap-2 p-3 bg-slate-800/50 border border-slate-700 border-b-0 rounded-t-xl flex-wrap">
              {/* Bold Button */}
              <button
                type="button"
                onClick={() => applyFormat("bold")}
                className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-300 hover:text-slate-100 group relative"
                title="In đậm (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-700 text-slate-200 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  In đậm
                </span>
              </button>

              {/* Italic Button */}
              <button
                type="button"
                onClick={() => applyFormat("italic")}
                className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-300 hover:text-slate-100 group relative"
                title="In nghiêng (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-700 text-slate-200 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  In nghiêng
                </span>
              </button>

              {/* Underline Button */}
              <button
                type="button"
                onClick={() => applyFormat("underline")}
                className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-300 hover:text-slate-100 group relative"
                title="Gạch dưới (Ctrl+U)"
              >
                <Underline className="w-4 h-4" />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-700 text-slate-200 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Gạch dưới
                </span>
              </button>

              {/* Divider */}
              <div className="w-px h-6 bg-slate-700 mx-1"></div>

              {/* Heading */}
              <button
                type="button"
                onClick={() => applyFormat("formatBlock", "<h2>")}
                className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-300 hover:text-slate-100"
                title="Tiêu đề lớn"
              >
                <Heading2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => applyFormat("formatBlock", "<h3>")}
                className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-300 hover:text-slate-100"
                title="Tiêu đề nhỏ"
              >
                <Heading3 className="w-4 h-4" />
              </button>
            </div>

            {/* Editor Area */}
            <div
              ref={editorRef}
              contentEditable
              onInput={handleEditorInput}
              className="min-h-[100px] max-h-[150px] overflow-y-auto p-4 bg-slate-800/50 border-2 border-slate-700 rounded-b-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all text-slate-100 outline-none"
              style={{
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
              data-placeholder="Nhập thông tin bổ sung cho sản phẩm..."
            />
          </div>

          {/* Info Box */}
          <div className="mb-6 p-4 bg-amber-500/10 border-2 border-amber-500/30 rounded-xl">
            <p className="text-sm text-amber-300 font-semibold">
              Lưu ý: Thông tin bổ sung sẽ được chèn vào cuối mô tả hiện tại,
              không thay thế nội dung cũ.
            </p>
          </div>

          {/* Actions */}
          <div className="sticky bottom-0 flex gap-3 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 px-8 py-6 border-t border-slate-700/50 rounded-xl -mx-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-3 px-6 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !additionalDescription.trim()}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>Lưu thông tin</>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx="true">{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #64748b;
          font-style: italic;
        }

        h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0.5em 0;
          color: inherit;
        }

        h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0.5em 0;
          color: inherit;
        }

        b,
        strong {
          font-weight: bold;
        }

        i,
        em {
          font-style: italic;
        }

        u {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default AddDescriptionModal;
