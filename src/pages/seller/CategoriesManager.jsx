import React, { useState } from 'react';
import { adminService, categoryService } from '../../api/api';
import { toast } from 'react-toastify';
import { Plus, Edit2, Trash2, Search, X, Image as ImageIcon } from 'lucide-react';
import { useUploadImage } from '../../hooks/useUploadImage';
import { useAppContext } from '../../context/AppContext';

const CategoriesManager = () => {
    const { categories, fetchCategories } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { uploadImage, uploading } = useUploadImage();
    const [imagePreview, setImagePreview] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        path: '',
        bg_color: '#F3F4F6',
        image_url: '',
        cloudinary_url: '',
        cloudinary_public_id: ''
    });

    const handleOpenModal = (category = null) => {
        if (category) {
            setIsEditing(true);
            setFormData({
                id: category.id,
                name: category.name,
                path: category.path,
                bg_color: category.bg_color || '#F3F4F6',
                image_url: category.cloudinary_url || category.image_url || '',
                cloudinary_url: category.cloudinary_url || '',
                cloudinary_public_id: category.cloudinary_public_id || ''
            });
            setImagePreview(category.cloudinary_url || category.image_url || null);
        } else {
            setIsEditing(false);
            setFormData({
                id: null,
                name: '',
                path: '',
                bg_color: '#F3F4F6',
                image_url: '',
                cloudinary_url: '',
                cloudinary_public_id: ''
            });
            setImagePreview(null);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setImagePreview(null);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const result = await uploadImage(file, 'categories');
                if (result) {
                    setFormData(prev => ({ 
                        ...prev, 
                        image_url: result.url,
                        cloudinary_url: result.url,
                        cloudinary_public_id: result.public_id
                    }));
                    setImagePreview(result.url);
                }
            } catch (err) {
                toast.error("Image upload failed");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.submitter.disabled = true;
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing) {
                await categoryService.update(formData.id, { category: formData });
                toast.success("Category updated successfully");
            } else {
                await categoryService.create({ category: formData });
                toast.success("Category created successfully");
            }
            handleCloseModal();
            fetchCategories(); // Refresh list via AppContext
        } catch (err) {
            toast.error(err || "Failed to save category");
        } finally {
            setLoading(false);
            e.submitter.disabled = false;
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await categoryService.delete(id);
                toast.success("Category deleted");
                fetchCategories(); // Refresh list via AppContext
            } catch (err) {
                toast.error(err || "Failed to delete category");
            }
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.path.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in text-gray-100 h-full flex flex-col relative">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Categories Management</h1>
                    <p className="text-sm text-gray-400">Manage product categories and UI layout.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-gray-800 border-none rounded-lg text-sm text-white focus:ring-2 focus:ring-primary w-full sm:w-64"
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        New Category
                    </button>
                </div>
            </div>

            <div className="bg-gray-800 border border-gray-700/50 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider sticky top-0">
                            <tr>
                                <th className="px-6 py-4 font-medium">Category Info</th>
                                <th className="px-6 py-4 font-medium hidden sm:table-cell">Category Name</th>
                                <th className="px-6 py-4 font-medium hidden md:table-cell">Theme Color</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                                        No categories found.
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-700/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="w-14 h-14 rounded-lg flex items-center justify-center border border-gray-700/50 shadow-sm overflow-hidden"
                                                    style={{ backgroundColor: category.bg_color }}
                                                >
                                                    <img
                                                        src={category.image_url}
                                                        alt={category.name}
                                                        className="w-10 h-10 object-contain hover:scale-110 transition-transform"
                                                    />
                                                </div>
                                                <div className="text-sm font-medium text-white">{category.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            <span className="text-sm text-gray-400 font-mono bg-gray-900 px-2 py-1 rounded">{category.name}</span>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full border border-gray-600 shadow-sm" style={{ backgroundColor: category.bg_color }}></div>
                                                <span className="text-sm text-gray-400 uppercase">{category.bg_color}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button onClick={() => handleOpenModal(category)} className="text-indigo-400 hover:text-indigo-300 transition-colors p-1" title="Edit">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(category.id)} className="text-red-400 hover:text-red-300 transition-colors p-1" title="Delete">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Category Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-gray-700/80">
                            <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
                            <button type="button" onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors bg-gray-700/50 p-1.5 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form id="categoryForm" onSubmit={handleSubmit} className="space-y-5">

                                {/* Image Upload Area */}
                                <div
                                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl p-6 transition-colors"
                                    style={{ backgroundColor: formData.bg_color ? `${formData.bg_color}20` : 'transparent' }}
                                >
                                    {imagePreview ? (
                                        <div className="relative group">
                                            <div className="p-4 rounded-lg" style={{ backgroundColor: formData.bg_color }}>
                                                <img src={imagePreview} alt="Preview" className="h-24 object-contain" />
                                            </div>
                                            <label className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-sm">
                                                <span className="text-sm font-medium text-white">Change Image</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                            </label>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center w-full h-32 cursor-pointer">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                {uploading ? (
                                                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <>
                                                        <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                                        <p className="mb-2 text-sm text-gray-400"><span className="font-semibold text-primary">Click to upload</span> category icon</p>
                                                    </>
                                                )}
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                        </label>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Category Name *</label>
                                        <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary outline-none" placeholder="e.g. Fresh Fruits" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">URL Path *</label>
                                        <input required type="text" value={formData.path} onChange={e => setFormData({ ...formData, path: e.target.value.replace(/\s+/g, '') })} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary outline-none font-mono text-sm" placeholder="e.g. fruits" />
                                        <p className="text-xs text-gray-500 mt-1">No spaces allowed. This is used in the URL.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Background Color (Hex) *</label>
                                        <div className="flex gap-3">
                                            <div className="w-12 h-11 rounded-lg border border-gray-700 shadow-sm overflow-hidden flex-shrink-0">
                                                <input type="color" value={formData.bg_color} onChange={e => setFormData({ ...formData, bg_color: e.target.value })} className="w-16 h-16 -ml-2 -mt-2 cursor-pointer border-0 p-0" />
                                            </div>
                                            <input required type="text" value={formData.bg_color} onChange={e => setFormData({ ...formData, bg_color: e.target.value })} className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white font-mono uppercase focus:ring-2 focus:ring-primary outline-none" placeholder="#FFFFFF" />
                                        </div>
                                    </div>
                                </div>

                            </form>
                        </div>

                        <div className="p-6 border-t border-gray-700/80 bg-gray-800/50 flex justify-end gap-3">
                            <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button type="submit" form="categoryForm" disabled={loading || uploading} className="px-5 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 shadow-md">
                                {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                                {isEditing ? 'Save Changes' : 'Create Category'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesManager;
