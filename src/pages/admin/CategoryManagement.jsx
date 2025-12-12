import React, { useEffect, useState } from "react";
import categoryService from "../../services/categoryService";
import helpers from "../../utils/helpers";


const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({ categoryName: "", parentId: null });
    const [showForm, setShowForm] = useState(false);

    const [expanded, setExpanded] = useState({});
    const toggleExpand = (id) => {
        setExpanded(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const loadCategories = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await categoryService.getAllCategoriesFlat();

            const normalized = data.map(c => ({
                ...c,
                parent: c.parent || null
            }));

            const tree = helpers.buildCategoryTree(normalized);

            setCategories(tree);
        } catch (err) {
            console.error("Failed to load categories:", err);
            setError("Không thể tải danh mục");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ 
            ...formData, 
            [e.target.name]: e.target.value 
        });
    };

    // Create or update category
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (selectedCategory) {
                // Update
                await categoryService.updateCategory(selectedCategory.categoryId, formData);
                alert("Cập nhật danh mục thành công");
            } else {
                // Create
                await categoryService.createCategory(formData);
                alert("Thêm danh mục thành công");
            }

            setShowForm(false);
            setSelectedCategory(null);
            setFormData({ categoryName: "", parentId: null });
            loadCategories();

        } catch (err) {
            console.error("Failed to save category:", err);
            alert("Lỗi khi lưu danh mục");
        }
    };

    // Delete category
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;

        try {
            await categoryService.deleteCategory(id);
            alert("Đã xóa danh mục");
            loadCategories();
        } catch (err) {
            console.error("Failed to delete:", err);
            alert(err.response?.data || "Không thể xóa danh mục");
        }
    };

    // Open form for edit
    const handleEdit = (category) => {
        setSelectedCategory(category);
        setFormData({
            categoryName: category.categoryName,
            parentId: category.parentId || null,
        });
        setShowForm(true);
    };

    const renderCategoryTree = (nodes, level = 0) => {
        return nodes.map(cat => {
            const isParent = cat.children?.length > 0;
            const isOpen = expanded[cat.categoryId];

            return (
                <React.Fragment key={cat.categoryId}>
                    <tr
                        className="border-b border-slate-700 hover:bg-slate-700/40 transition"
                    >
                        {/* ID */}
                        <td className="p-3 font-semibold text-slate-300">
                            {cat.categoryId}
                        </td>

                        {/* Name */}
                        <td className="p-3 flex items-center gap-2">
                            {/* Indent */}
                            <span style={{ marginLeft: level * 20 }} />

                            {/* Toggle icon */}
                            {isParent ? (
                                <button
                                    onClick={() => toggleExpand(cat.categoryId)}
                                    className="text-amber-400 hover:text-amber-300 transition"
                                >
                                    {isOpen ? "▼" : "▶"}
                                </button>
                            ) : (
                                <span className="opacity-0">▶</span>
                            )}

                            <span className="font-bold text-white">
                                {cat.categoryName}
                            </span>
                        </td>

                        {/* Parent ID */}
                        <td className="p-3 text-slate-400">
                            {cat.parent ? cat.parent.categoryId : "-"}
                        </td>

                        {/* Actions */}
                        <td className="p-3 flex gap-2">
                            <button
                                onClick={() => handleEdit(cat)}
                                className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 transition"
                            >
                                Sửa
                            </button>
                            <button
                                onClick={() => handleDelete(cat.categoryId)}
                                className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 transition"
                            >
                                Xóa
                            </button>
                        </td>
                    </tr>

                    {/* Children */}
                    {isParent && isOpen && renderCategoryTree(cat.children, level + 1)}
                </React.Fragment>
            );
        });
    };


    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-amber-400 mb-6">
                Quản Lý Danh Mục
            </h1>

            {/* Button open form */}
            <button
                onClick={() => {
                    setSelectedCategory(null);
                    setFormData({ categoryName: "", parentId: null });
                    setShowForm(true);
                }}
                className="bg-amber-500 px-4 py-2 rounded text-white mb-6 font-bold"
            >
                + Thêm Danh Mục
            </button>

            {/* Error */}
            {error && <p className="text-red-400 mb-4">{error}</p>}

            {/* Loading */}
            {loading && <p className="text-white">Đang tải...</p>}

            {/* Category table */}
            {!loading && categories.length > 0 && (
                <table className="w-full text-left bg-slate-800/70 text-white rounded-xl shadow-lg overflow-hidden backdrop-blur-md">
                    <thead className="bg-slate-700/70">
                        <tr>
                            <th className="p-3">ID</th>
                            <th className="p-3">Tên danh mục</th>
                            <th className="p-3">Parent ID</th>
                            <th className="p-3">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderCategoryTree(categories)}
                    </tbody>
                </table>
            )}

            {/* Form Popup */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-xl w-[400px] text-slate-900">
                        <h2 className="text-xl font-bold mb-4">
                            {selectedCategory ? "Sửa Danh Mục" : "Thêm Danh Mục"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label>Tên danh mục:</label>
                                <input
                                    type="text"
                                    name="categoryName"
                                    value={formData.categoryName}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label>Parent ID (tuỳ chọn):</label>
                                <input
                                    type="number"
                                    name="parentId"
                                    value={formData.parentId || ""}
                                    onChange={handleChange}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 bg-gray-400 rounded"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-amber-500 text-white rounded"
                                >
                                    Lưu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};


export default CategoryManagement;
