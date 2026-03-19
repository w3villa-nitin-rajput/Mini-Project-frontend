import React, { useState, useEffect } from 'react';
import { adminService, productService } from '../../api/api';
import { toast } from 'react-toastify';
import { Search, X, Image as ImageIcon, Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUploadImage } from '../../hooks/useUploadImage';
import { useAppContext } from '../../context/AppContext';

const ProductsManager = () => {
    const { products: contextProducts, fetchProducts, categories, currency } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [paginatedProducts, setPaginatedProducts] = useState([]);
    const itemsPerPage = 10;
    const [fetching, setFetching] = useState(true);

    const fetchAdminProducts = async (currentPage, currentSearch) => {
        setFetching(true);
        try {
            const res = await productService.getAll("", currentPage, itemsPerPage, currentSearch);
            // Since we're passing page, backend returns { products, meta }
            setPaginatedProducts(res.data.products);
            setTotalPages(res.data.meta.total_pages);
            setPage(res.data.meta.current_page);
        } catch (err) {
            toast.error(err || 'Failed to fetch products');
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchAdminProducts(page, search);
        }, 300); // debounce search
        return () => clearTimeout(timeoutId);
    }, [page, search]);

    // When search changes, reset to page 1
    useEffect(() => {
        setPage(1);
    }, [search]);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { uploadImage, uploading } = useUploadImage();
    const [imagePreview, setImagePreview] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        category: '',
        price: '',
        offer_price: '',
        description: '',
        image_url: '',
        cloudinary_url: '',
        cloudinary_public_id: '',
        in_stock: true
    });

    const handleOpenModal = (product = null) => {
        if (product) {
            setIsEditing(true);
            setFormData({
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                offer_price: product.offer_price || '',
                description: product.description ? product.description.join('\n') : '',
                image_url: product.cloudinary_url || product.image_urls?.[0] || '',
                cloudinary_url: product.cloudinary_url || '',
                cloudinary_public_id: product.cloudinary_public_id || '',
                in_stock: product.in_stock
            });
            setImagePreview(product.cloudinary_url || product.image_urls?.[0] || null);
        } else {
            setIsEditing(false);
            setFormData({
                id: null,
                name: '',
                category: categories?.[0]?.name || '',
                price: '',
                offer_price: '',
                description: '',
                image_url: '',
                cloudinary_url: '',
                cloudinary_public_id: '',
                in_stock: true
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
                const result = await uploadImage(file, 'products');
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
            const payload = {
                name: formData.name,
                category: formData.category,
                price: parseFloat(formData.price),
                offer_price: formData.offer_price ? parseFloat(formData.offer_price) : null,
                description: formData.description.split('\n').filter(Boolean),
                image_urls: formData.image_url ? [formData.image_url] : [],
                cloudinary_url: formData.cloudinary_url,
                cloudinary_public_id: formData.cloudinary_public_id,
                in_stock: formData.in_stock
            };

            if (isEditing) {
                await productService.update(formData.id, payload);
                toast.success("Product updated successfully");
            } else {
                await productService.create(payload);
                toast.success("Product created successfully");
            }
            handleCloseModal();
            fetchAdminProducts(page, search); // Refresh local admin list
            fetchProducts(); // Refresh global list
        } catch (err) {
            toast.error(err || "Failed to save product");
        } finally {
            setLoading(false);
            e.submitter.disabled = false;
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await productService.delete(id);
                toast.success("Product deleted");
                fetchAdminProducts(page, search); // Refresh local admin list
                fetchProducts(); // Refresh global list
            } catch (err) {
                toast.error(err || "Failed to delete product");
            }
        }
    };

    return (
        <div className="space-y-6 animate-fade-in text-gray-100 h-full flex flex-col relative">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Products Management</h1>
                    <p className="text-sm text-gray-400">Manage your store catalog and inventory.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
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
                        New Product
                    </button>
                </div>
            </div>

            <div className="bg-gray-800 border border-gray-700/50 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left">
                        <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider sticky top-0">
                            <tr>
                                <th className="px-6 py-4 font-medium">Product</th>
                                <th className="px-6 py-4 font-medium hidden sm:table-cell">Category</th>
                                <th className="px-6 py-4 font-medium">Price</th>
                                <th className="px-6 py-4 font-medium hidden md:table-cell">Stock Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {fetching ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                        <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin inline-block"></span>
                                        <p className="mt-2 text-sm">Loading products...</p>
                                    </td>
                                </tr>
                            ) : paginatedProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-700/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-12 w-12 flex-shrink-0 bg-white rounded-lg p-1">
                                                    <img className="h-full w-full object-contain" src={product.image_urls?.[0]} alt={product.name} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-white max-w-[200px] truncate">{product.name}</div>
                                                    <div className="text-xs text-gray-400 sm:hidden">{product.category}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden sm:table-cell">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-white">
                                                {currency}{product.offer_price || product.price}
                                            </div>
                                            {product.offer_price && (
                                                <div className="text-xs text-gray-400 line-through">
                                                    {currency}{product.price}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${product.in_stock ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                {product.in_stock ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button onClick={() => handleOpenModal(product)} className="text-indigo-400 hover:text-indigo-300 transition-colors p-1" title="Edit">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-300 transition-colors p-1" title="Delete">
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-700/50 bg-gray-900/30 flex items-center justify-between">
                        <p className="text-sm text-gray-400">
                            Page <span className="font-medium text-white">{page}</span> of <span className="font-medium text-white">{totalPages}</span>
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="flex justify-between items-center p-6 border-b border-gray-700/80">
                            <h2 className="text-xl font-bold text-white">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors bg-gray-700/50 p-1.5 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            <form id="productForm" onSubmit={handleSubmit} className="space-y-5">

                                {/* Image Upload Area */}
                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl p-6 bg-gray-900/50">
                                    {imagePreview ? (
                                        <div className="relative group">
                                            <img src={imagePreview} alt="Preview" className="h-32 object-contain bg-white rounded-lg p-2" />
                                            <label className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
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
                                                        <p className="mb-2 text-sm text-gray-400"><span className="font-semibold text-primary">Click to upload</span> product image</p>
                                                    </>
                                                )}
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                        </label>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Product Name *</label>
                                        <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Category *</label>
                                        <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer">
                                            <option value="" disabled>Select a category</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.path}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Original Price ({currency}) *</label>
                                        <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Offer Price ({currency})</label>
                                        <input type="number" step="0.01" value={formData.offer_price} onChange={e => setFormData({ ...formData, offer_price: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-600" placeholder="Optional" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Description (One point per line)</label>
                                    <textarea rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none" placeholder="Rich in vitamins&#10;Farm fresh quality"></textarea>
                                </div>

                                <div className="flex items-center gap-3 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                                    <input type="checkbox" id="in_stock" checked={formData.in_stock} onChange={e => setFormData({ ...formData, in_stock: e.target.checked })} className="w-5 h-5 rounded border-gray-600 text-primary focus:ring-primary bg-gray-800 cursor-pointer" />
                                    <label htmlFor="in_stock" className="text-sm font-medium text-gray-200 cursor-pointer">Product is currently in stock</label>
                                </div>

                            </form>
                        </div>

                        <div className="p-6 border-t border-gray-700/80 bg-gray-800/50 flex justify-end gap-3">
                            <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button type="submit" form="productForm" disabled={loading || uploading} className="px-5 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 shadow-md">
                                {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                                {isEditing ? 'Save Changes' : 'Create Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsManager;
