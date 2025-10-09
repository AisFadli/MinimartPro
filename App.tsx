
import React, { useEffect } from 'react';

/**
 * Safely parses JSON from localStorage.
 * @param key The localStorage key.
 * @param defaultValue The default value to return if parsing fails or key doesn't exist.
 * @returns The parsed object or the default value.
 */
const safeJSONParse = (key: string, defaultValue: any) => {
    try {
        const item = localStorage.getItem(key);
        // If item is null or undefined, return default value
        if (item == null) {
            return defaultValue;
        }
        return JSON.parse(item);
    } catch (e) {
        console.error(`Error parsing JSON from localStorage for key "${key}". Returning default value.`, e);
        return defaultValue;
    }
};


const App: React.FC = () => {

    const htmlBody = `
    <!-- Header -->
    <header class="gradient-bg text-white shadow-lg">
        <div class="container mx-auto px-6 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <i class="fas fa-boxes text-2xl"></i>
                    <h1 class="text-2xl font-bold">Minimart An Nahl</h1>
                    <div id="status-indicator" title="Connecting..." class="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                </div>
                <nav id="main-nav" class="hidden md:flex space-x-6">
                    <button onclick="showSection('dashboard')" class="nav-btn hover:text-blue-200 transition-colors">Dashboard</button>
                    <button onclick="showSection('products')" class="nav-btn hover:text-blue-200 transition-colors">Produk</button>
                    <button onclick="showSection('orders')" class="nav-btn hover:text-blue-200 transition-colors">Order</button>
                    <button onclick="showSection('sales')" class="nav-btn hover:text-blue-200 transition-colors">Penjualan</button>
                    <button onclick="showSection('stock-card')" class="nav-btn hover:text-blue-200 transition-colors">Kartu Stok</button>
                    <button onclick="showSection('settings')" class="nav-btn hover:text-blue-200 transition-colors">Pengaturan</button>
                </nav>
                <div class="flex items-center space-x-4">
                    <button class="md:hidden" onclick="toggleMobileMenu()">
                        <i class="fas fa-bars text-xl"></i>
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- Mobile Menu -->
    <div id="mobile-menu" class="hidden bg-white shadow-lg md:hidden">
        <div class="px-6 py-4 space-y-2">
            <button onclick="showSection('dashboard')" class="block w-full text-left py-2 text-gray-700 hover:text-blue-600">Dashboard</button>
            <button onclick="showSection('products')" class="block w-full text-left py-2 text-gray-700 hover:text-blue-600">Produk</button>
            <button onclick="showSection('orders')" class="block w-full text-left py-2 text-gray-700 hover:text-blue-600">Order</button>
            <button onclick="showSection('sales')" class="block w-full text-left py-2 text-gray-700 hover:text-blue-600">Penjualan</button>
            <button onclick="showSection('stock-card')" class="block w-full text-left py-2 text-gray-700 hover:text-blue-600">Kartu Stok</button>
            <button onclick="showSection('settings')" class="block w-full text-left py-2 text-gray-700 hover:text-blue-600">Pengaturan</button>
        </div>
    </div>

    <div class="container mx-auto px-6 py-8">
        <!-- Dashboard Section -->
        <div id="dashboard-section" class="section animate-fade-in">
            <div class="mb-8">
                <h2 class="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
                <p class="text-gray-600">Ringkasan stok dan aktivitas terkini</p>
            </div>

            <!-- Dashboard Filters -->
            <div class="bg-white rounded-xl card-shadow p-6 mb-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Filter Laporan</h3>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                        <select id="dashboard-category-filter" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="">Semua Kategori</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Dari Tanggal</label>
                        <input type="date" id="dashboard-date-from" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Sampai Tanggal</label>
                        <input type="date" id="dashboard-date-to" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div class="flex items-end gap-2">
                        <button onclick="applyDashboardFilter()" class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                            <i class="fas fa-filter mr-2"></i>Filter
                        </button>
                        <button onclick="resetDashboardFilter()" class="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                            <i class="fas fa-sync-alt mr-2"></i>Reset
                        </button>
                    </div>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="bg-white p-6 rounded-xl card-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Total Produk</p>
                            <p class="text-2xl font-bold text-gray-800" id="total-products">0</p>
                        </div>
                        <div class="bg-blue-100 p-3 rounded-full">
                            <i class="fas fa-box text-blue-600"></i>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-xl card-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Stok Rendah</p>
                            <p class="text-2xl font-bold text-red-600" id="low-stock">0</p>
                        </div>
                        <div class="bg-red-100 p-3 rounded-full">
                            <i class="fas fa-exclamation-triangle text-red-600"></i>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-xl card-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Nilai Stok</p>
                            <p class="text-2xl font-bold text-green-600" id="stock-value">Rp 0</p>
                        </div>
                        <div class="bg-green-100 p-3 rounded-full">
                            <i class="fas fa-money-bill-wave text-green-600"></i>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-xl card-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Transaksi Periode Ini</p>
                            <p class="text-2xl font-bold text-purple-600" id="today-transactions">0</p>
                        </div>
                        <div class="bg-purple-100 p-3 rounded-full">
                            <i class="fas fa-chart-line text-purple-600"></i>
                        </div>
                    </div>
                </div>
            </div>

             <!-- Sales by Payment Method -->
            <div class="bg-white rounded-xl card-shadow p-6 mb-8">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Ringkasan Penjualan <span id="sales-summary-period" class="text-base font-normal text-gray-500"></span></h3>
                <div id="payment-method-summary" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-green-50 p-4 rounded-lg">
                        <p class="text-green-600 font-medium">Penjualan Tunai (Cash)</p>
                        <p class="text-2xl font-bold text-green-800" id="sales-cash">Rp 0</p>
                    </div>
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <p class="text-blue-600 font-medium">Penjualan Transfer</p>
                        <p class="text-2xl font-bold text-blue-800" id="sales-transfer">Rp 0</p>
                    </div>
                    <div class="bg-yellow-50 p-4 rounded-lg">
                        <p class="text-yellow-600 font-medium">Penjualan Belum Bayar</p>
                        <p class="text-2xl font-bold text-yellow-800" id="sales-unpaid">Rp 0</p>
                    </div>
                </div>
            </div>

            <!-- Recent Activities -->
            <div class="bg-white rounded-xl card-shadow p-6">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Aktivitas Terkini</h3>
                <div id="recent-activities" class="space-y-3">
                    <p class="text-gray-500 text-center py-8">Belum ada aktivitas</p>
                </div>
            </div>
        </div>

        <!-- Products Section -->
        <div id="products-section" class="section hidden">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h2 class="text-3xl font-bold text-gray-800 mb-2">Manajemen Produk</h2>
                    <p class="text-gray-600">Kelola data produk dan stok</p>
                </div>
                <div class="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                    <button onclick="showAddProductModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                        <i class="fas fa-plus mr-2"></i>Tambah Produk
                    </button>
                    <button onclick="exportData()" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
                        <i class="fas fa-download mr-2"></i>Export Data
                    </button>
                </div>
            </div>

            <!-- Search and Filter -->
            <div class="bg-white rounded-xl card-shadow p-6 mb-6">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-1">
                        <input type="text" id="search-products" placeholder="Cari produk..." 
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                    <select id="category-filter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Semua Kategori</option>
                    </select>
                </div>
            </div>

            <!-- Products Table -->
            <div class="bg-white rounded-xl card-shadow overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HPP</th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga Jual</th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="products-table" class="bg-white divide-y divide-gray-200">
                            <tr>
                                <td colspan="7" class="px-6 py-8 text-center text-gray-500">Belum ada produk. Klik "Tambah Produk" untuk memulai.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div id="products-pagination" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between"></div>
            </div>
        </div>

        <!-- Orders Section -->
        <div id="orders-section" class="section hidden">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h2 class="text-3xl font-bold text-gray-800 mb-2">Manajemen Order</h2>
                    <p class="text-gray-600">Kelola permintaan stok dan approval</p>
                </div>
                <div class="mt-4 md:mt-0">
                    <button onclick="showCreateOrderModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                        <i class="fas fa-plus mr-2"></i>Buat Order
                    </button>
                </div>
            </div>

            <!-- Order Status Tabs -->
            <div class="bg-white rounded-xl card-shadow mb-6">
                <div class="border-b border-gray-200">
                    <nav class="flex space-x-8 px-6">
                        <button onclick="filterOrders('all', event)" class="order-tab-btn py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium">
                            Semua Order
                        </button>
                        <button onclick="filterOrders('pending', event)" class="order-tab-btn py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                            Menunggu Approval
                        </button>
                        <button onclick="filterOrders('approved', event)" class="order-tab-btn py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                            Disetujui
                        </button>
                        <button onclick="filterOrders('rejected', event)" class="order-tab-btn py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                            Ditolak
                        </button>
                    </nav>
                </div>
            </div>

            <!-- Orders Table -->
            <div class="bg-white rounded-xl card-shadow overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Order</th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="orders-table" class="bg-white divide-y divide-gray-200">
                            <tr>
                                <td colspan="6" class="px-6 py-8 text-center text-gray-500">Belum ada order. Klik "Buat Order" untuk memulai.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                 <div id="orders-pagination" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between"></div>
            </div>
        </div>

        <!-- Sales Section -->
        <div id="sales-section" class="section hidden">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h2 class="text-3xl font-bold text-gray-800 mb-2">Pencatatan Penjualan</h2>
                    <p class="text-gray-600">Kelola transaksi penjualan produk</p>
                </div>
                <div class="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                    <button onclick="showCreateSaleModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                        <i class="fas fa-plus mr-2"></i>Transaksi Baru
                    </button>
                    <button onclick="exportSalesData()" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
                        <i class="fas fa-download mr-2"></i>Export Penjualan
                    </button>
                </div>
            </div>

            <!-- Sales Filter -->
            <div class="bg-white rounded-xl card-shadow p-6 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Dari Tanggal</label>
                        <input type="date" id="sales-date-from" 
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Sampai Tanggal</label>
                        <input type="date" id="sales-date-to" 
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div class="flex items-end">
                        <button onclick="filterSales()" class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                            <i class="fas fa-filter mr-2"></i>Filter
                        </button>
                    </div>
                </div>
            </div>

            <!-- Sales Summary -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="bg-white p-6 rounded-xl card-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Total Transaksi</p>
                            <p class="text-2xl font-bold text-gray-800" id="total-sales-count">0</p>
                        </div>
                        <div class="bg-blue-100 p-3 rounded-full">
                            <i class="fas fa-receipt text-blue-600"></i>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-xl card-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Total Penjualan</p>
                            <p class="text-2xl font-bold text-green-600" id="total-sales-amount">Rp 0</p>
                        </div>
                        <div class="bg-green-100 p-3 rounded-full">
                            <i class="fas fa-money-bill-wave text-green-600"></i>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-xl card-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm">Rata-rata per Transaksi</p>
                            <p class="text-2xl font-bold text-purple-600" id="avg-sales-amount">Rp 0</p>
                        </div>
                        <div class="bg-purple-100 p-3 rounded-full">
                            <i class="fas fa-chart-bar text-purple-600"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sales Table -->
            <div class="bg-white rounded-xl card-shadow overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Transaksi</th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pembayaran</th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="sales-table" class="bg-white divide-y divide-gray-200">
                            <tr>
                                <td colspan="8" class="px-6 py-8 text-center text-gray-500">Belum ada transaksi penjualan. Klik "Transaksi Baru" untuk memulai.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div id="sales-pagination" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between"></div>
            </div>
        </div>

        <!-- Stock Card Section -->
        <div id="stock-card-section" class="section hidden">
            <div class="mb-8">
                <h2 class="text-3xl font-bold text-gray-800 mb-2">Kartu Stok</h2>
                <p class="text-gray-600">Riwayat pergerakan stok per produk</p>
            </div>

            <!-- Product Selection -->
            <div class="bg-white rounded-xl card-shadow p-6 mb-6">
                <div class="flex flex-col md:flex-row gap-4 items-end">
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Pilih Produk</label>
                        <input type="text" id="stock-card-search" placeholder="Cari berdasarkan nama atau kode..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-2">
                        <select id="stock-card-product" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="">Pilih produk untuk melihat kartu stok</option>
                        </select>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="showStockInModal()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                            <i class="fas fa-plus mr-2"></i>Stok Masuk
                        </button>
                        <button onclick="showStockOutModal()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                            <i class="fas fa-minus mr-2"></i>Stok Keluar
                        </button>
                        <button onclick="exportStockCard()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                            <i class="fas fa-download mr-2"></i>Export Kartu Stok
                        </button>
                    </div>
                </div>
            </div>

            <!-- Product Information -->
            <div id="stock-card-product-info" class="bg-white rounded-xl card-shadow p-6 mb-6 hidden">
                <!-- Product info will be populated here -->
            </div>

            <!-- Stock Card Table -->
            <div class="bg-white rounded-xl card-shadow overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Masuk</th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keluar</th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
                                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai Stok</th>
                            </tr>
                        </thead>
                        <tbody id="stock-card-table" class="bg-white divide-y divide-gray-200">
                            <tr>
                                <td colspan="6" class="px-6 py-8 text-center text-gray-500">Pilih produk untuk melihat kartu stok</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                 <div id="stock-card-pagination" class="px-6 py-4 border-t border-gray-200 flex items-center justify-between"></div>
            </div>
        </div>

        <!-- Settings Section -->
        <div id="settings-section" class="section hidden">
            <div class="mb-8">
                <h2 class="text-3xl font-bold text-gray-800 mb-2">Pengaturan</h2>
                <p class="text-gray-600">Konfigurasi aplikasi dan data master</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Categories Management -->
                <div class="bg-white rounded-xl card-shadow p-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-4">Kategori Produk</h3>
                    <div class="space-y-4">
                        <div class="flex gap-2">
                            <input type="text" id="new-category" placeholder="Nama kategori baru" 
                                   class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <button onclick="addCategory()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <div id="categories-list" class="space-y-2">
                            <!-- Categories will be populated here -->
                        </div>
                    </div>
                </div>

                <!-- Store Settings -->
                <div class="bg-white rounded-xl card-shadow p-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-4">Informasi Toko</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Nama Toko</label>
                            <input type="text" id="store-name" placeholder="Nama toko Anda"
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                            <textarea id="store-address" rows="2" placeholder="Alamat lengkap toko"
                                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Telepon</label>
                            <input type="text" id="store-phone" placeholder="Nomor telepon toko"
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input type="email" id="store-email" placeholder="Email toko"
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                         <div class="pt-4">
                            <button onclick="saveSettings()" class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors">
                                <i class="fas fa-save mr-2"></i>Simpan Pengaturan Toko
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <!-- App Settings -->
                <div class="bg-white rounded-xl card-shadow p-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-4">Pengaturan Aplikasi & Data</h3>
                    <div class="space-y-4">
                         <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Batas Stok Minimum</label>
                            <input type="number" id="min-stock-limit" value="10" 
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Mata Uang</label>
                            <select id="currency" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="IDR">Rupiah (IDR)</option>
                                <option value="USD">Dollar (USD)</option>
                            </select>
                        </div>
                        <div class="mt-4 pt-4 border-t">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Import Data Produk</label>
                             <input type="file" id="import-file" accept=".csv" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-3">
                             <button onclick="importProductsData()" class="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors">
                                <i class="fas fa-upload mr-2"></i>Import dari CSV
                            </button>
                        </div>

                        <div class="mt-4 pt-4 border-t">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Import Data Penjualan</label>
                            <p class="text-xs text-gray-500 mb-3">Gunakan template penjualan. Baris dengan 'sale_number' yang sama akan digabung menjadi satu transaksi.</p>
                            <input type="file" id="import-sales-file" accept=".csv" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 mb-3">
                            <button onclick="importSalesData()" class="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg transition-colors">
                                <i class="fas fa-file-import mr-2"></i>Import Penjualan
                            </button>
                        </div>

                        <div class="mt-4 pt-4 border-t">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Import Pergerakan Stok</label>
                            <p class="text-xs text-gray-500 mb-3">Gunakan template pergerakan stok. Pastikan 'product_code' sudah ada di data produk.</p>
                            <input type="file" id="import-stock-file" accept=".csv" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 mb-3">
                            <button onclick="importStockMovementData()" class="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-lg transition-colors">
                                <i class="fas fa-exchange-alt mr-2"></i>Import Pergerakan Stok
                            </button>
                        </div>

                        <div class="mt-4 pt-4 border-t">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Download Template Import (CSV)</label>
                            <p class="text-xs text-gray-500 mb-3">Gunakan template ini untuk memastikan format data yang benar saat mengimpor.</p>
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <button onclick="downloadProductTemplate()" class="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors text-sm">
                                    <i class="fas fa-box-open mr-2"></i>Produk
                                </button>
                                <button onclick="downloadCategoryTemplate()" class="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors text-sm">
                                    <i class="fas fa-tags mr-2"></i>Kategori
                                </button>
                                <button onclick="downloadStockMovementTemplate()" class="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors text-sm">
                                    <i class="fas fa-exchange-alt mr-2"></i>Stok
                                </button>
                                <button onclick="downloadOrderTemplate()" class="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors text-sm">
                                    <i class="fas fa-clipboard-list mr-2"></i>Order
                                </button>
                                <button onclick="downloadSaleTemplate()" class="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors text-sm">
                                    <i class="fas fa-receipt mr-2"></i>Penjualan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Backup & Restore -->
                <div class="bg-white rounded-xl card-shadow p-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-4">Backup & Restore Data</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Backup Data Aplikasi</label>
                            <p class="text-sm text-gray-600 mb-3">Download semua data aplikasi sebagai file backup</p>
                            <button onclick="backupData()" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                                <i class="fas fa-download mr-2"></i>Backup Data
                            </button>
                        </div>
                        
                        <div class="border-t pt-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Restore Data</label>
                            <p class="text-sm text-gray-600 mb-3">Pilih file backup untuk mengembalikan data</p>
                            <input type="file" id="restore-file" accept=".json" 
                                   class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 mb-3">
                            <button onclick="restoreData()" class="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg transition-colors">
                                <i class="fas fa-upload mr-2"></i>Restore Data
                            </button>
                            <p class="text-xs text-red-600 mt-2">⚠️ Restore akan mengganti semua data yang ada!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modals -->
    <!-- Add/Edit Product Modal -->
    <div id="product-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 id="product-modal-title" class="text-2xl font-bold text-gray-800">Tambah Produk</h3>
                    <button onclick="closeModal('product-modal')" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <form id="product-form" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Kode Produk</label>
                            <input type="text" id="product-code" required 
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Nama Produk</label>
                            <input type="text" id="product-name" required 
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                        <select id="product-category" required 
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="">Pilih kategori</option>
                        </select>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">HPP (Harga Pokok Penjualan)</label>
                            <input type="number" id="product-hpp" required min="0" step="0.01"
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Harga Jual</label>
                            <input type="number" id="product-price" required min="0" step="0.01"
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Stok Awal</label>
                            <input type="number" id="product-initial-stock" required min="0"
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Satuan</label>
                            <input type="text" id="product-unit" required placeholder="pcs, kg, liter, dll"
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                        <textarea id="product-description" rows="3" 
                                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                            <i class="fas fa-save mr-2"></i>Simpan
                        </button>
                        <button type="button" onclick="closeModal('product-modal')" 
                                class="px-6 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors">
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Stock In Modal -->
    <div id="stock-in-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl max-w-md w-full">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold text-gray-800">Stok Masuk</h3>
                    <button onclick="closeModal('stock-in-modal')" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <form id="stock-in-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Produk</label>
                        <select id="stock-in-product" required 
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="">Pilih produk</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                        <input type="datetime-local" id="stock-in-date" required
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah Masuk</label>
                        <input type="number" id="stock-in-quantity" required min="1"
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                        <input type="text" id="stock-in-note" placeholder="Pembelian, retur, dll"
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button type="submit" class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors">
                            <i class="fas fa-plus mr-2"></i>Tambah Stok
                        </button>
                        <button type="button" onclick="closeModal('stock-in-modal')" 
                                class="px-6 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors">
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Stock Out Modal -->
    <div id="stock-out-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl max-w-md w-full">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold text-gray-800">Stok Keluar</h3>
                    <button onclick="closeModal('stock-out-modal')" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <form id="stock-out-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Produk</label>
                        <select id="stock-out-product" required 
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="">Pilih produk</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
                        <input type="datetime-local" id="stock-out-date" required
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah Keluar</label>
                        <input type="number" id="stock-out-quantity" required min="1"
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                        <input type="text" id="stock-out-note" placeholder="Penjualan, rusak, dll"
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button type="submit" class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors">
                            <i class="fas fa-minus mr-2"></i>Kurangi Stok
                        </button>
                        <button type="button" onclick="closeModal('stock-out-modal')" 
                                class="px-6 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors">
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Create Order Modal -->
    <div id="create-order-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl max-w-md w-full">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold text-gray-800">Buat Order Stok</h3>
                    <button onclick="closeModal('create-order-modal')" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <form id="create-order-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Cari Produk</label>
                         <input type="text" id="order-product-search" placeholder="Ketik nama atau kode produk..."
                                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-2">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Produk</label>
                        <select id="order-product" required 
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="">Pilih produk</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah Order</label>
                        <input type="number" id="order-quantity" required min="1"
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Keterangan</label>
                        <textarea id="order-note" rows="3" placeholder="Alasan order, supplier, dll"
                                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>
                    <div class="flex gap-3 pt-4">
                        <button type="submit" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                            <i class="fas fa-paper-plane mr-2"></i>Kirim Order
                        </button>
                        <button type="button" onclick="closeModal('create-order-modal')" 
                                class="px-6 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors">
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Create Sale Modal -->
    <div id="create-sale-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 id="sale-modal-title" class="text-2xl font-bold text-gray-800">Transaksi Penjualan</h3>
                    <button onclick="closeModal('create-sale-modal')" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Left Column: Customer & Product Selection -->
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Nama Customer</label>
                            <input type="text" id="sale-customer" required placeholder="Masukkan nama customer"
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Penjualan</label>
                            <input type="datetime-local" id="sale-date" required
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</label>
                            <select id="payment-method" required 
                                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="cash">Cash</option>
                                <option value="transfer">Transfer</option>
                                <option value="unpaid">Belum Terbayar</option>
                            </select>
                        </div>
                        
                        <div id="sale-item-controls" class="border-t pt-4">
                            <h4 class="font-medium text-gray-700 mb-3">Tambah Produk</h4>
                            <div class="space-y-3">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Cari Produk</label>
                                    <input type="text" id="sale-product-search" placeholder="Ketik nama atau kode produk..."
                                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                </div>
                                
                                <div id="product-search-results" class="hidden max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                                    <!-- Search results will appear here -->
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Atau Pilih dari Daftar</label>
                                    <select id="sale-product" 
                                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                        <option value="">Pilih produk</option>
                                    </select>
                                </div>
                                
                                <div id="product-info" class="hidden bg-gray-50 p-3 rounded-lg">
                                    <div class="text-sm text-gray-600">
                                        <div class="flex justify-between">
                                            <span>Stok tersedia:</span>
                                            <span id="available-stock" class="font-medium">0</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span>Harga jual:</span>
                                            <span id="product-price-display" class="font-medium">Rp 0</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Jumlah</label>
                                    <input type="number" id="sale-quantity" min="1"
                                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                </div>
                                
                                <button type="button" onclick="addItemToSale()" class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors">
                                    <i class="fas fa-plus mr-2"></i>Tambah ke Transaksi
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Right Column: Items List & Summary -->
                    <div class="space-y-4">
                        <div id="sale-items-header" class="flex justify-between items-center">
                            <h4 class="font-medium text-gray-700">Daftar Produk</h4>
                            <button onclick="clearSaleItems()" class="text-red-600 hover:text-red-800 text-sm">
                                <i class="fas fa-trash mr-1"></i>Hapus Semua
                            </button>
                        </div>
                        
                        <div class="border rounded-lg overflow-hidden">
                            <table class="w-full text-sm">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-3 py-2 text-left">Produk</th>
                                        <th class="px-3 py-2 text-left">Qty</th>
                                        <th class="px-3 py-2 text-left">Harga</th>
                                        <th class="px-3 py-2 text-left">Total</th>
                                        <th class="px-3 py-2 text-left">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody id="sale-items-table">
                                    <tr>
                                        <td colspan="5" class="px-3 py-8 text-center text-gray-500 text-sm">Belum ada produk ditambahkan</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <div class="space-y-2">
                                <div class="flex justify-between">
                                    <span class="font-medium text-gray-700">Subtotal:</span>
                                    <span id="sale-subtotal" class="font-medium">Rp 0</span>
                                </div>
                                <div class="flex justify-between text-lg font-bold text-blue-600 border-t pt-2">
                                    <span>Total:</span>
                                    <span id="sale-grand-total">Rp 0</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex gap-3">
                            <button id="process-sale-btn" onclick="processSale()" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors font-medium">
                                <i class="fas fa-shopping-cart mr-2"></i>Proses Penjualan
                            </button>
                            <button onclick="closeModal('create-sale-modal')" 
                                    class="px-6 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg transition-colors">
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Sale Detail Modal -->
    <div id="sale-detail-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl max-w-lg w-full">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold text-gray-800">Detail Transaksi</h3>
                    <button onclick="closeModal('sale-detail-modal')" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div id="sale-detail-content" class="space-y-4">
                    <!-- Sale details will be populated here -->
                </div>
                <div class="flex gap-3 pt-6">
                    <button onclick="closeModal('sale-detail-modal')" 
                            class="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Receipt Modal -->
    <div id="receipt-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl max-w-md w-full">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold text-gray-800">Struk Penjualan</h3>
                    <button onclick="closeModal('receipt-modal')" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div id="receipt-content">
                    <!-- Receipt content will be populated here -->
                </div>
                <div class="flex gap-3 pt-6">
                    <button onclick="printReceipt()" 
                            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                        <i class="fas fa-print mr-2"></i>Print Struk
                    </button>
                    <button onclick="closeModal('receipt-modal')" 
                            class="px-6 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Order Detail Modal -->
    <div id="order-detail-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl max-w-lg w-full">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold text-gray-800">Detail Order</h3>
                    <button onclick="closeModal('order-detail-modal')" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div id="order-detail-content" class="space-y-4">
                    <!-- Order details will be populated here -->
                </div>
                <div id="order-actions" class="flex gap-3 pt-6">
                    <!-- Action buttons will be populated here -->
                </div>
            </div>
        </div>
    </div>
    `;

    useEffect(() => {
        // --- SUPABASE SETUP ---
        // Correctly read environment variables using Vite's `import.meta.env`
        const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim();
        const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            const root = document.getElementById('root');
            if(root) {
                root.innerHTML = `
                    <div class="p-8 text-center bg-red-100 text-red-800 rounded-lg">
                        <h2 class="text-2xl font-bold mb-4">Konfigurasi Supabase Diperlukan</h2>
                        <p>URL Supabase dan Kunci Anonim belum diatur. Silakan buat file <strong>.env</strong> dan atur variabel <strong>VITE_SUPABASE_URL</strong> dan <strong>VITE_SUPABASE_ANON_KEY</strong> untuk melanjutkan.</p>
                        <p class="mt-2 text-sm">Anda bisa mendapatkan nilai ini dari dasbor proyek Supabase Anda di bawah Pengaturan > API.</p>
                    </div>`;
            }
            console.error("Supabase URL and Anon Key are not configured in a .env file with VITE_ prefix.");
            return;
        }

        const supabase = (window as any).supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const win = window as any;

        // --- LOCAL STATE MANAGEMENT ---
        let products = safeJSONParse('products', []);
        let categories = safeJSONParse('categories', ["Elektronik", "Makanan", "Minuman", "Pakaian"]);
        let stockMovements = safeJSONParse('stockMovements', []);
        let orders = safeJSONParse('orders', []);
        let sales = safeJSONParse('sales', []);
        let settings = safeJSONParse('settings', {"minStockLimit":10,"currency":"IDR", "storeName": "Minimart An Nahl", "storeAddress": "Jl. Pramuka No. 1, Jakarta", "storePhone": "021-12345678", "storeEmail": "info@minimart.com"});
        
        let editingProductId: string | null = null;
        let currentOrderFilter = 'all';
        let filteredSales: any[] = [];
        let editingSaleId: string | null = null;
        let currentSaleItems: any[] = []; // For the sale modal
        const currentUser = { name: 'Admin' }; // Mock user
        let isOnline = navigator.onLine;

        // Pagination State
        const ITEMS_PER_PAGE = 20;
        let currentPage = {
            products: 1,
            orders: 1,
            sales: 1,
            stockCard: 1
        };
        
        // --- UI & DOM HELPERS ---
        const setStatusIndicator = (status: 'online' | 'offline' | 'syncing', message: string) => {
            const indicator = document.getElementById('status-indicator');
            if (!indicator) return;
            indicator.title = message;
            indicator.classList.remove('bg-green-500', 'bg-gray-400', 'bg-yellow-500', 'animate-pulse');
            switch (status) {
                case 'online':
                    indicator.classList.add('bg-green-500');
                    break;
                case 'offline':
                    indicator.classList.add('bg-gray-400');
                    break;
                case 'syncing':
                    indicator.classList.add('bg-yellow-500', 'animate-pulse');
                    break;
            }
        };

        // --- LOCAL DATA PERSISTENCE ---
        const saveLocalData = () => {
            localStorage.setItem('products', JSON.stringify(products));
            localStorage.setItem('categories', JSON.stringify(categories));
            localStorage.setItem('stockMovements', JSON.stringify(stockMovements));
            localStorage.setItem('orders', JSON.stringify(orders));
            localStorage.setItem('sales', JSON.stringify(sales));
            localStorage.setItem('settings', JSON.stringify(settings));
        };

        // --- OFFLINE SYNC QUEUE LOGIC ---
        const getSyncQueue = () => safeJSONParse('syncQueue', []);
        const saveSyncQueue = (queue: any[]) => localStorage.setItem('syncQueue', JSON.stringify(queue));

        const addToSyncQueue = (action: any) => {
            const queue = getSyncQueue();
            queue.push(action);
            saveSyncQueue(queue);
        };

        const processSyncQueue = async () => {
            if (!isOnline) return;
            let queue = getSyncQueue();
            if (queue.length === 0) {
                setStatusIndicator('online', 'Connected and up to date');
                return;
            }

            setStatusIndicator('syncing', `Syncing ${queue.length} offline change(s)...`);
            
            let failedActions: any[] = [];
            
            for (const action of queue) {
                let success = false;
                try {
                    switch (action.type) {
                        case 'CREATE': {
                            const { error } = await supabase.from(action.table).upsert(action.payload);
                            if (error) throw error;
                            success = true;
                            break;
                        }
                        case 'UPDATE': {
                             const { error } = await supabase.from(action.table).update(action.payload).eq('id', action.id);
                            if (error) throw error;
                            success = true;
                            break;
                        }
                        case 'DELETE': {
                            const { error } = await supabase.from(action.table).delete().eq('id', action.id);
                             if (error) throw error;
                            success = true;
                            break;
                        }
                    }
                } catch (error) {
                    console.error(`Failed to sync action:`, action, error);
                    failedActions.push(action);
                }
            }
            
            saveSyncQueue(failedActions);
            if (failedActions.length === 0) {
                console.log('Sync queue successfully processed.');
                setStatusIndicator('online', 'Sync complete!');
            } else {
                 console.error(`${failedActions.length} actions failed to sync.`);
                setStatusIndicator('online', 'Some changes failed to sync. Please check console.');
            }
            // Refresh data from server after sync to ensure consistency
            await syncAllDataFromServer();
        };

        // --- SUPABASE API WRAPPERS ---
        const createRecord = async (table: string, record: any) => {
            // Optimistic update is handled by the calling function
            if (isOnline) {
                const { error } = await supabase.from(table).insert(record);
                if (error) {
                    console.error(`Error creating record in ${table}, queueing for later.`, error);
                    addToSyncQueue({ type: 'CREATE', table, payload: record });
                }
            } else {
                addToSyncQueue({ type: 'CREATE', table, payload: record });
            }
        };

        const updateRecord = async (table: string, id: string, updates: any) => {
             if (isOnline) {
                const { error } = await supabase.from(table).update(updates).eq('id', id);
                if (error) {
                    console.error(`Error updating record in ${table}, queueing for later.`, error);
                    addToSyncQueue({ type: 'UPDATE', table, id, payload: updates });
                }
            } else {
                addToSyncQueue({ type: 'UPDATE', table, id, payload: updates });
            }
        };

        const deleteRecord = async (table: string, id: string) => {
            if (isOnline) {
                const { error } = await supabase.from(table).delete().eq('id', id);
                if (error) {
                    console.error(`Error deleting record in ${table}, queueing for later.`, error);
                    addToSyncQueue({ type: 'DELETE', table, id });
                }
            } else {
                addToSyncQueue({ type: 'DELETE', table, id });
            }
        };
        
        const syncAllDataFromServer = async () => {
            if (!isOnline) {
                console.log("Offline mode: Skipping sync from server.");
                return;
            }
            try {
                setStatusIndicator('syncing', 'Fetching latest data...');
                const tables = ['products', 'categories', 'stock_movements', 'orders', 'sales', 'settings'];
                const tableData: { [key: string]: any[] } = {};
                const rlsErrors: string[] = [];
                let otherError: any = null;

                for (const table of tables) {
                    const { data, error } = await supabase.from(table).select('*');
                    if (error) {
                        if (error.code === '42501' || error.message.includes('permission denied')) {
                            rlsErrors.push(table);
                        } else {
                            otherError = error;
                        }
                        // Continue to next table instead of stopping
                        continue;
                    }
                    tableData[table] = data || [];
                }

                if (rlsErrors.length > 0) {
                    const root = document.getElementById('root');
                    if (root) {
                        root.innerHTML = `
                        <div class="m-4 p-8 bg-red-100 text-red-800 rounded-lg shadow-lg">
                            <h2 class="text-2xl font-bold mb-4">Kesalahan Izin Akses Supabase (RLS)</h2>
                            <p class="mb-4">Aplikasi tidak dapat mengambil data dari tabel berikut karena kebijakan Row Level Security (RLS) yang memblokir akses:</p>
                            <ul class="list-disc list-inside mb-4 font-mono bg-red-50 p-3 rounded">
                                ${rlsErrors.map(t => `<li>${t}</li>`).join('')}
                            </ul>
                            <h3 class="text-xl font-semibold mb-2">Cara Memperbaiki:</h3>
                            <p class="mb-2">Anda perlu membuat kebijakan (policy) di Supabase untuk mengizinkan operasi baca (SELECT) dan tulis (INSERT, UPDATE, DELETE) untuk tabel-tabel di atas.</p>
                            <ol class="list-decimal list-inside space-y-2 text-left bg-red-50 p-4 rounded">
                                <li>Buka Dasbor Supabase proyek Anda.</li>
                                <li>Di menu samping, navigasi ke <strong>SQL Editor</strong>.</li>
                                <li>Klik <strong>"+ New query"</strong>.</li>
                                <li>Salin dan tempel kode SQL yang sesuai untuk membuat kebijakan akses. Untuk pengembangan, Anda bisa mengizinkan semua akses.</li>
                                <li>Klik <strong>"RUN"</strong> untuk menerapkan kebijakan.</li>
                                <li>Refresh halaman aplikasi ini.</li>
                            </ol>
                             <p class="mt-4 text-sm">Contoh SQL untuk memberikan akses penuh pada satu tabel (ganti 'nama_tabel'):<br><code class="bg-red-200 p-1 rounded">CREATE POLICY "Public full access" ON public.nama_tabel FOR ALL USING (true) WITH CHECK (true);</code></p>
                        </div>`;
                    }
                    console.error(`RLS Policy Error on tables: ${rlsErrors.join(', ')}`);
                    return; // Stop function after displaying the comprehensive error
                }

                if(otherError) throw otherError;

                products = tableData['products'] || products;
                categories = tableData['categories'] ? tableData['categories'].map(c => c.name) : categories;
                stockMovements = tableData['stock_movements'] || stockMovements;
                orders = tableData['orders'] || orders;
                sales = tableData['sales'] || sales;
                if (tableData['settings'] && tableData['settings'].length > 0) {
                    settings = tableData['settings'][0].data;
                }
                
                saveLocalData();
                renderAll();
                console.log('All data synced from server.');
                setStatusIndicator('online', 'Data is up to date.');

            } catch (error) {
                console.error("Failed to sync data from Supabase:", error);
                setStatusIndicator('offline', 'Error connecting to server.');
            }
        };

        // --- RENDER FUNCTIONS ---
        const renderAll = () => {
             updateDashboard();
             renderProducts();
             renderCategories();
             renderOrders();
             filterSales(); // Use filterSales to render and update summary
             populateProductSelects();
             loadSettings();
             populateDashboardCategoryFilter();
        }
        
        // --- REALTIME SUBSCRIPTIONS ---
        const setupRealtimeSubscriptions = () => {
            const handleTableChange = (payload: any, table: string, localDataArray: any[], renderFunc: () => void) => {
                const { eventType, new: newRecord, old: oldRecord } = payload;
                let changed = false;
                switch(eventType) {
                    case 'INSERT':
                        if (!localDataArray.find(item => item.id === newRecord.id)) {
                           localDataArray.push(newRecord);
                           changed = true;
                        }
                        break;
                    case 'UPDATE':
                        const index = localDataArray.findIndex(item => item.id === newRecord.id);
                        if (index > -1) {
                            localDataArray[index] = newRecord;
                            changed = true;
                        }
                        break;
                    case 'DELETE':
                        const oldId = oldRecord.id;
                        const initialLength = localDataArray.length;
                        localDataArray = localDataArray.filter(item => item.id !== oldId);
                        changed = localDataArray.length < initialLength;
                        break;
                }
                if (changed) {
                    // Update the global variable reference
                    if (table === 'products') products = localDataArray;
                    else if (table === 'stock_movements') stockMovements = localDataArray;
                    else if (table === 'orders') orders = localDataArray;
                    else if (table === 'sales') sales = localDataArray;
                    
                    saveLocalData();
                    renderFunc();
                    updateDashboard(); // Always update dashboard on any change
                }
            };

            supabase.channel('public:products')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => handleTableChange(payload, 'products', products, renderProducts))
                .subscribe();
            
            supabase.channel('public:stock_movements')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'stock_movements' }, (payload) => handleTableChange(payload, 'stock_movements', stockMovements, () => loadStockCard()))
                .subscribe();

            supabase.channel('public:orders')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => handleTableChange(payload, 'orders', orders, renderOrders))
                .subscribe();

            supabase.channel('public:sales')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'sales' }, (payload) => handleTableChange(payload, 'sales', sales, renderSales))
                .subscribe();
        };

        // Initialize App
        const initializeApp = async () => {
            setStatusIndicator('syncing', 'Loading local data...');
            filteredSales = [...sales];
            renderAll();
            
            // Event listeners
            (document.getElementById('search-products') as HTMLInputElement).addEventListener('input', () => { currentPage.products = 1; filterProducts(); });
            (document.getElementById('category-filter') as HTMLSelectElement).addEventListener('change', () => { currentPage.products = 1; filterProducts(); });
            (document.getElementById('stock-card-product') as HTMLSelectElement).addEventListener('change', () => { currentPage.stockCard = 1; loadStockCard(); });
            (document.getElementById('stock-card-search') as HTMLInputElement).addEventListener('input', handleStockCardSearch);
            (document.getElementById('sale-product') as HTMLSelectElement).addEventListener('change', updateSaleInfo);
            (document.getElementById('sale-quantity') as HTMLInputElement).addEventListener('input', updateSaleTotal);
            (document.getElementById('sale-product-search') as HTMLInputElement).addEventListener('input', searchSaleProducts);
            (document.getElementById('order-product-search') as HTMLInputElement).addEventListener('input', handleOrderProductSearch);
            (document.getElementById('sale-customer') as HTMLInputElement).addEventListener('input', updateProcessButton);

            // Form submissions
            (document.getElementById('product-form') as HTMLFormElement).addEventListener('submit', handleProductSubmit);
            (document.getElementById('stock-in-form') as HTMLFormElement).addEventListener('submit', handleStockIn);
            (document.getElementById('stock-out-form') as HTMLFormElement).addEventListener('submit', handleStockOut);
            (document.getElementById('create-order-form') as HTMLFormElement).addEventListener('submit', handleCreateOrder);
            
            // Set default dates
            setDefaultDates();
            
            await syncAllDataFromServer();
            await processSyncQueue();
            setupRealtimeSubscriptions();
        }
        
        const populateStockCardSelect = (filteredProducts?: any[]) => {
            const productList = filteredProducts || products;
            const select = (document.getElementById('stock-card-product') as HTMLSelectElement);
            const currentValue = select.value;

            select.innerHTML = '<option value="">Pilih produk untuk melihat kartu stok</option>' +
                productList.map((p: any) => `<option value="${p.id}">${p.name} (${p.code})</option>`).join('');
            
            // Restore selection if it still exists in the filtered list
            if (productList.some((p: any) => p.id === currentValue)) {
                select.value = currentValue;
            }
        }

        const handleStockCardSearch = () => {
            const searchTerm = (document.getElementById('stock-card-search') as HTMLInputElement).value.toLowerCase();
            const filtered = products.filter((p: any) => 
                p.name.toLowerCase().includes(searchTerm) || 
                p.code.toLowerCase().includes(searchTerm)
            );
            populateStockCardSelect(filtered);
        }

        const handleOrderProductSearch = () => {
            const searchTerm = (document.getElementById('order-product-search') as HTMLInputElement).value.toLowerCase();
            const filtered = products.filter((p: any) => 
                p.name.toLowerCase().includes(searchTerm) || 
                p.code.toLowerCase().includes(searchTerm)
            );
            populateOrderProductSelects(filtered);
        }

        // Navigation
        const showSection = (sectionName: string, event?: any) => {
            document.querySelectorAll('.section').forEach(section => {
                section.classList.add('hidden');
            });
            (document.getElementById(sectionName + '-section') as HTMLElement).classList.remove('hidden');
            
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('text-blue-200');
            });
            if (event && event.target) {
                event.target.classList.add('text-blue-200');
            }
            
            (document.getElementById('mobile-menu') as HTMLElement).classList.add('hidden');
        }

        const toggleMobileMenu = () => {
            (document.getElementById('mobile-menu') as HTMLElement).classList.toggle('hidden');
        }

        // Dashboard Functions
        const updateDashboard = (filters = {}) => {
            const { category = '', dateFrom = '', dateTo = '' } = filters as any;

            let filteredProducts = products;
            if (category) {
                filteredProducts = products.filter((p: any) => p.category === category);
            }
            
            let filteredMovements = stockMovements;
            let filteredSalesData = sales;

            if (dateFrom && dateTo) {
                const start = new Date(dateFrom).getTime();
                const end = new Date(dateTo).setHours(23, 59, 59, 999);
                
                filteredMovements = stockMovements.filter((m: any) => {
                    const movementDate = new Date(m.date).getTime();
                    return movementDate >= start && movementDate <= end;
                });
                
                filteredSalesData = sales.filter((s: any) => {
                    const saleDate = new Date(s.saleDate || s.created_at).getTime();
                    return saleDate >= start && saleDate <= end;
                });

                const fromStr = new Date(dateFrom).toLocaleDateString('id-ID');
                const toStr = new Date(dateTo).toLocaleDateString('id-ID');
                 (document.getElementById('sales-summary-period') as HTMLElement).textContent = `(${fromStr} - ${toStr})`;

            } else {
                 (document.getElementById('sales-summary-period') as HTMLElement).textContent = '(Semua Waktu)';
            }

            const totalProducts = filteredProducts.length;
            const lowStockProducts = filteredProducts.filter((p: any) => p.current_stock <= settings.minStockLimit).length;
            const stockValue = filteredProducts.reduce((total: number, p: any) => total + (p.current_stock * p.hpp), 0);
            const periodTransactions = filteredMovements.length;

            (document.getElementById('total-products') as HTMLElement).textContent = totalProducts.toString();
            (document.getElementById('low-stock') as HTMLElement).textContent = lowStockProducts.toString();
            (document.getElementById('stock-value') as HTMLElement).textContent = formatCurrency(stockValue);
            (document.getElementById('today-transactions') as HTMLElement).textContent = periodTransactions.toString();

            const salesCash = filteredSalesData.filter(s => s.payment_method === 'cash' && s.status !== 'indent').reduce((sum, s) => sum + s.total_amount, 0);
            const salesTransfer = filteredSalesData.filter(s => s.payment_method === 'transfer' && s.status !== 'indent').reduce((sum, s) => sum + s.total_amount, 0);
            const salesUnpaid = filteredSalesData.filter(s => s.status === 'unpaid' || s.status === 'indent').reduce((sum, s) => sum + s.total_amount, 0);

            (document.getElementById('sales-cash') as HTMLElement).textContent = formatCurrency(salesCash);
            (document.getElementById('sales-transfer') as HTMLElement).textContent = formatCurrency(salesTransfer);
            (document.getElementById('sales-unpaid') as HTMLElement).textContent = formatCurrency(salesUnpaid);

            renderRecentActivities();
        }

        const applyDashboardFilter = () => {
            const category = (document.getElementById('dashboard-category-filter') as HTMLSelectElement).value;
            const dateFrom = (document.getElementById('dashboard-date-from') as HTMLInputElement).value;
            const dateTo = (document.getElementById('dashboard-date-to') as HTMLInputElement).value;
            updateDashboard({ category, dateFrom, dateTo });
        }

        const resetDashboardFilter = () => {
            (document.getElementById('dashboard-category-filter') as HTMLSelectElement).value = '';
            (document.getElementById('dashboard-date-from') as HTMLInputElement).value = '';
            (document.getElementById('dashboard-date-to') as HTMLInputElement).value = '';
            updateDashboard();
        }

        const renderRecentActivities = () => {
            const recentActivities = stockMovements
                .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5);

            const container = (document.getElementById('recent-activities') as HTMLElement);
            
            if (recentActivities.length === 0) {
                container.innerHTML = '<p class="text-gray-500 text-center py-8">Belum ada aktivitas</p>';
                return;
            }

            container.innerHTML = recentActivities.map((activity: any) => {
                const product = products.find((p: any) => p.id === activity.product_id);
                const productName = product ? product.name : 'Produk tidak ditemukan';
                const icon = activity.type === 'in' ? 'fa-plus text-green-600' : 'fa-minus text-red-600';
                const typeText = activity.type === 'in' ? 'Masuk' : 'Keluar';
                
                return `
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div class="flex items-center space-x-3">
                            <i class="fas ${icon}"></i>
                            <div>
                                <p class="font-medium text-gray-800">${productName}</p>
                                <p class="text-sm text-gray-600">${activity.note || typeText}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-medium text-gray-800">${activity.quantity} ${product?.unit || ''}</p>
                            <p class="text-sm text-gray-500">${formatDate(activity.date)}</p>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Product Management
        const renderProducts = () => {
            const searchTerm = (document.getElementById('search-products') as HTMLInputElement).value.toLowerCase();
            const categoryFilterValue = (document.getElementById('category-filter') as HTMLSelectElement).value;
            
            const filteredData = products.filter((product: any) => {
                const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                                    product.code.toLowerCase().includes(searchTerm);
                const matchesCategory = !categoryFilterValue || product.category === categoryFilterValue;
                return matchesSearch && matchesCategory;
            });

            const paginatedData = paginate(filteredData, currentPage.products, ITEMS_PER_PAGE);

            const tbody = (document.getElementById('products-table') as HTMLElement);
            
            if (paginatedData.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-8 text-center text-gray-500">Tidak ada produk yang ditemukan.</td></tr>';
                renderPagination('products-pagination', currentPage.products, filteredData.length, ITEMS_PER_PAGE, changeProductsPage);
                return;
            }

            tbody.innerHTML = paginatedData.map((product: any) => {
                const stock = product.current_stock || 0;
                const stockStatus = stock <= settings.minStockLimit ? 
                    '<span class="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Stok Rendah</span>' :
                    '<span class="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Normal</span>';

                return `
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4">
                            <div>
                                <div class="font-medium text-gray-900">${product.name}</div>
                                <div class="text-sm text-gray-500">${product.code}</div>
                            </div>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-900">${product.category}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">${formatCurrency(product.hpp)}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">${formatCurrency(product.price)}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">${stock} ${product.unit}</td>
                        <td class="px-6 py-4">${stockStatus}</td>
                        <td class="px-6 py-4 text-sm font-medium">
                            <div class="flex space-x-2">
                                <button onclick="viewProduct('${product.id}')" class="text-blue-600 hover:text-blue-900">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button onclick="editProduct('${product.id}')" class="text-yellow-600 hover:text-yellow-900">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="deleteProduct('${product.id}')" class="text-red-600 hover:text-red-900">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');

            renderPagination('products-pagination', currentPage.products, filteredData.length, ITEMS_PER_PAGE, changeProductsPage);
            populateFilters();
        }

        const changeProductsPage = (page: number) => {
            currentPage.products = page;
            renderProducts();
        }

        const populateFilters = () => {
            const categoryFilter = (document.getElementById('category-filter') as HTMLSelectElement);
            const uniqueCategories = [...new Set(products.map((p: any) => p.category))];
            
            const currentVal = categoryFilter.value;
            categoryFilter.innerHTML = '<option value="">Semua Kategori</option>' +
                uniqueCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
            categoryFilter.value = currentVal;
        }

        const populateDashboardCategoryFilter = () => {
            const categoryFilter = (document.getElementById('dashboard-category-filter') as HTMLSelectElement);
            const uniqueCategories = [...new Set(products.map((p: any) => p.category))];
            
            categoryFilter.innerHTML = '<option value="">Semua Kategori</option>' +
                uniqueCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
        }

        const filterProducts = () => {
            renderProducts();
        }

        const showAddProductModal = () => {
            editingProductId = null;
            (document.getElementById('product-modal-title') as HTMLElement).textContent = 'Tambah Produk';
            (document.getElementById('product-form') as HTMLFormElement).reset();
            populateProductCategories();
            showModal('product-modal');
        }

        const editProduct = (productId: string) => {
            editingProductId = productId;
            const product = products.find((p: any) => p.id === productId);
            if(!product) return;
            
            (document.getElementById('product-modal-title') as HTMLElement).textContent = 'Edit Produk';
            (document.getElementById('product-code') as HTMLInputElement).value = product.code;
            (document.getElementById('product-name') as HTMLInputElement).value = product.name;
            (document.getElementById('product-category') as HTMLSelectElement).value = product.category;
            (document.getElementById('product-hpp') as HTMLInputElement).value = product.hpp;
            (document.getElementById('product-price') as HTMLInputElement).value = product.price;
            (document.getElementById('product-initial-stock') as HTMLInputElement).value = product.current_stock;
            (document.getElementById('product-unit') as HTMLInputElement).value = product.unit;
            (document.getElementById('product-description') as HTMLTextAreaElement).value = product.description || '';
            
            populateProductCategories();
            showModal('product-modal');
        }

        const viewProduct = (productId: string) => {
            const product = products.find((p: any) => p.id === productId);
            if(!product) return;
            alert(`Detail Produk:\n\nKode: ${product.code}\nNama: ${product.name}\nKategori: ${product.category}\nHPP: ${formatCurrency(product.hpp)}\nHarga Jual: ${formatCurrency(product.price)}\nStok: ${product.current_stock} ${product.unit}\nDeskripsi: ${product.description || 'Tidak ada deskripsi'}`);
        }

        const deleteProduct = async (productId: string) => {
            if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
                // Optimistic UI update
                products = products.filter((p: any) => p.id !== productId);
                stockMovements = stockMovements.filter((m: any) => m.product_id !== productId);
                
                saveLocalData();
                renderProducts();
                updateDashboard();
                populateProductSelects();

                // Sync with server
                await deleteRecord('products', productId);
                // We don't need to explicitly delete stock movements as they should be handled by db constraints (cascade delete)
                
                alert('Produk berhasil dihapus!');
            }
        }

        const handleProductSubmit = async (e: Event) => {
            e.preventDefault();
            
            const productData = {
                code: (document.getElementById('product-code') as HTMLInputElement).value,
                name: (document.getElementById('product-name') as HTMLInputElement).value,
                category: (document.getElementById('product-category') as HTMLSelectElement).value,
                hpp: parseFloat((document.getElementById('product-hpp') as HTMLInputElement).value),
                price: parseFloat((document.getElementById('product-price') as HTMLInputElement).value),
                current_stock: parseInt((document.getElementById('product-initial-stock') as HTMLInputElement).value),
                unit: (document.getElementById('product-unit') as HTMLInputElement).value,
                description: (document.getElementById('product-description') as HTMLTextAreaElement).value
            };

            if (editingProductId) {
                // Update existing product
                const productIndex = products.findIndex((p: any) => p.id === editingProductId);
                const oldProduct = { ...products[productIndex] };
                const updatedProduct = { ...oldProduct, ...productData, updated_at: new Date().toISOString() };
                products[productIndex] = updatedProduct;
                
                await updateRecord('products', editingProductId, productData);
                alert('Produk berhasil diperbarui!');
            } else {
                // Add new product
                const newProduct = {
                    id: crypto.randomUUID(),
                    ...productData,
                    created_at: new Date().toISOString()
                };
                products.push(newProduct);
                
                await createRecord('products', newProduct);
                alert('Produk berhasil ditambahkan!');
            }

            saveLocalData();
            closeModal('product-modal');
            renderProducts();
            updateDashboard();
            populateProductSelects();
        }

        // Stock Movement Functions
        const showStockInModal = () => {
            const selectedProductId = (document.getElementById('stock-card-product') as HTMLSelectElement).value;
            (document.getElementById('stock-in-form') as HTMLFormElement).reset();
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            (document.getElementById('stock-in-date') as HTMLInputElement).value = now.toISOString().slice(0, 16);
            populateStockProductSelects();
            if (selectedProductId) {
                (document.getElementById('stock-in-product') as HTMLSelectElement).value = selectedProductId;
            }
            showModal('stock-in-modal');
        }

        const showStockOutModal = () => {
            const selectedProductId = (document.getElementById('stock-card-product') as HTMLSelectElement).value;
            (document.getElementById('stock-out-form') as HTMLFormElement).reset();
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            (document.getElementById('stock-out-date') as HTMLInputElement).value = now.toISOString().slice(0, 16);
            populateStockProductSelects();
            if (selectedProductId) {
                (document.getElementById('stock-out-product') as HTMLSelectElement).value = selectedProductId;
            }
            showModal('stock-out-modal');
        }

        const handleStockIn = async (e: Event) => {
            e.preventDefault();
            
            const productId = (document.getElementById('stock-in-product') as HTMLSelectElement).value;
            const quantity = parseInt((document.getElementById('stock-in-quantity') as HTMLInputElement).value);
            const date = (document.getElementById('stock-in-date') as HTMLInputElement).value;
            const note = (document.getElementById('stock-in-note') as HTMLInputElement).value;

            const product = products.find((p: any) => p.id === productId);
            product.current_stock += quantity;

            const movement = {
                id: crypto.randomUUID(),
                product_id: productId,
                type: 'in',
                quantity: quantity,
                date: date ? new Date(date).toISOString() : new Date().toISOString(),
                note: note || 'Stok masuk'
            };
            stockMovements.push(movement);
            
            saveLocalData();
            closeModal('stock-in-modal');
            renderProducts();
            updateDashboard();
            loadStockCard();
            
            await updateRecord('products', productId, { current_stock: product.current_stock });
            await createRecord('stock_movements', movement);

            alert('Stok berhasil ditambahkan!');
        }

        const handleStockOut = async (e: Event) => {
            e.preventDefault();
            
            const productId = (document.getElementById('stock-out-product') as HTMLSelectElement).value;
            const quantity = parseInt((document.getElementById('stock-out-quantity') as HTMLInputElement).value);
            const date = (document.getElementById('stock-out-date') as HTMLInputElement).value;
            const note = (document.getElementById('stock-out-note') as HTMLInputElement).value;

            const product = products.find((p: any) => p.id === productId);
            
            if (product.current_stock < quantity) {
                alert('Stok tidak mencukupi!');
                return;
            }

            product.current_stock -= quantity;

            const movement = {
                id: crypto.randomUUID(),
                product_id: productId,
                type: 'out',
                quantity: quantity,
                date: date ? new Date(date).toISOString() : new Date().toISOString(),
                note: note || 'Stok keluar'
            };
            stockMovements.push(movement);

            saveLocalData();
            closeModal('stock-out-modal');
            renderProducts();
            updateDashboard();
            loadStockCard();
            
            await updateRecord('products', productId, { current_stock: product.current_stock });
            await createRecord('stock_movements', movement);

            alert('Stok berhasil dikurangi!');
        }

        // Stock Card Functions
        const loadStockCard = () => {
            const productId = (document.getElementById('stock-card-product') as HTMLSelectElement).value;
            const tbody = (document.getElementById('stock-card-table') as HTMLElement);
            const productInfoDiv = (document.getElementById('stock-card-product-info') as HTMLElement);
            
            if (!productId) {
                tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-gray-500">Pilih produk untuk melihat kartu stok</td></tr>';
                (document.getElementById('stock-card-pagination') as HTMLElement).innerHTML = '';
                if (productInfoDiv) {
                    productInfoDiv.classList.add('hidden');
                }
                return;
            }

            const product = products.find((p: any) => p.id === productId);
            if (!product) {
                tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-gray-500">Produk tidak ditemukan</td></tr>';
                 (document.getElementById('stock-card-pagination') as HTMLElement).innerHTML = '';
                if (productInfoDiv) productInfoDiv.classList.add('hidden');
                return;
            }

            if (productInfoDiv) {
                const profitMargin = product.price > 0 ? ((product.price - product.hpp) / product.price * 100).toFixed(2) : 0;
                const currentStockValue = product.current_stock * product.hpp;
                const potentialRevenue = product.current_stock * product.price;
                
                productInfoDiv.innerHTML = `
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="bg-blue-50 p-4 rounded-lg"><div class="text-sm text-blue-600 font-medium">HPP</div><div class="text-lg font-bold text-blue-800">${formatCurrency(product.hpp)}</div></div>
                        <div class="bg-green-50 p-4 rounded-lg"><div class="text-sm text-green-600 font-medium">Harga Jual</div><div class="text-lg font-bold text-green-800">${formatCurrency(product.price)}</div></div>
                        <div class="bg-purple-50 p-4 rounded-lg"><div class="text-sm text-purple-600 font-medium">Margin</div><div class="text-lg font-bold text-purple-800">${profitMargin}%</div></div>
                        <div class="bg-orange-50 p-4 rounded-lg"><div class="text-sm text-orange-600 font-medium">Stok</div><div class="text-lg font-bold text-orange-800">${product.current_stock} ${product.unit}</div></div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div class="bg-gray-50 p-4 rounded-lg"><div class="text-sm text-gray-600 font-medium">Nilai Stok (HPP)</div><div class="text-xl font-bold text-gray-800">${formatCurrency(currentStockValue)}</div></div>
                        <div class="bg-yellow-50 p-4 rounded-lg"><div class="text-sm text-yellow-600 font-medium">Potensi Pendapatan</div><div class="text-xl font-bold text-yellow-800">${formatCurrency(potentialRevenue)}</div></div>
                    </div>`;
                productInfoDiv.classList.remove('hidden');
            }

            const movements = stockMovements
                .filter((m: any) => m.product_id === productId)
                .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

            const paginatedMovements = paginate(movements, currentPage.stockCard, ITEMS_PER_PAGE);

            if (paginatedMovements.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-gray-500">Belum ada pergerakan stok</td></tr>';
                renderPagination('stock-card-pagination', currentPage.stockCard, movements.length, ITEMS_PER_PAGE, changeStockCardPage);
                return;
            }
            
            const lastPage = Math.ceil(movements.length / ITEMS_PER_PAGE);
            const startingIndex = (lastPage - currentPage.stockCard) * ITEMS_PER_PAGE;
            
            let runningBalance = movements.slice(startingIndex + paginatedMovements.length).reduce((balance, movement) => {
                 return movement.type === 'in' ? balance - movement.quantity : balance + movement.quantity;
            }, product.current_stock);

            tbody.innerHTML = paginatedMovements.map((movement: any) => {
                const currentBalance = runningBalance;
                 if (movement.type === 'in') runningBalance -= movement.quantity;
                 else runningBalance += movement.quantity;
                const stockValue = currentBalance * product.hpp;
                const dateInfo = formatDate(movement.date);
                const timeAgo = getTimeAgo(movement.date);
                
                return `
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 text-sm text-gray-900"><div>${dateInfo}</div><div class="text-xs text-gray-500">${timeAgo}</div></td>
                        <td class="px-6 py-4 text-sm text-gray-900">${movement.note}</td>
                        <td class="px-6 py-4 text-sm text-green-600">${movement.type === 'in' ? movement.quantity : '-'}</td>
                        <td class="px-6 py-4 text-sm text-red-600">${movement.type === 'out' ? movement.quantity : '-'}</td>
                        <td class="px-6 py-4 text-sm font-medium text-gray-900">${currentBalance} ${product.unit}</td>
                        <td class="px-6 py-4 text-sm font-medium text-blue-600">${formatCurrency(stockValue)}</td>
                    </tr>`;
            }).join('');
             renderPagination('stock-card-pagination', currentPage.stockCard, movements.length, ITEMS_PER_PAGE, changeStockCardPage);
        }

        const changeStockCardPage = (page: number) => {
            currentPage.stockCard = page;
            loadStockCard();
        }

        // Settings Functions
        const renderCategories = () => {
            const container = (document.getElementById('categories-list') as HTMLElement);
            container.innerHTML = categories.map((category: string) => `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span class="text-gray-800">${category}</span>
                    <button onclick="deleteCategory('${category}')" class="text-red-600 hover:text-red-800"><i class="fas fa-trash"></i></button>
                </div>
            `).join('');
        }

        const addCategory = async () => {
            const newCategoryName = (document.getElementById('new-category') as HTMLInputElement).value.trim();
            if (newCategoryName && !categories.includes(newCategoryName)) {
                categories.push(newCategoryName);
                
                saveLocalData();
                renderCategories();
                populateProductCategories();

                (document.getElementById('new-category') as HTMLInputElement).value = '';

                await createRecord('categories', { name: newCategoryName });

                alert('Kategori berhasil ditambahkan!');
            } else if (categories.includes(newCategoryName)) {
                alert('Kategori sudah ada!');
            }
        }

        const deleteCategory = async (categoryName: string) => {
            if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
                categories = categories.filter((c: string) => c !== categoryName);
                
                saveLocalData();
                renderCategories();
                populateProductCategories();
                
                await supabase.from('categories').delete().eq('name', categoryName);

                alert('Kategori berhasil dihapus!');
            }
        }

        const loadSettings = () => {
            (document.getElementById('min-stock-limit') as HTMLInputElement).value = settings.minStockLimit;
            (document.getElementById('currency') as HTMLSelectElement).value = settings.currency;
            (document.getElementById('store-name') as HTMLInputElement).value = settings.storeName;
            (document.getElementById('store-address') as HTMLTextAreaElement).value = settings.storeAddress;
            (document.getElementById('store-phone') as HTMLInputElement).value = settings.storePhone;
            (document.getElementById('store-email') as HTMLInputElement).value = settings.storeEmail;
        }

        const saveSettings = async () => {
            const newSettings = {
                minStockLimit: parseInt((document.getElementById('min-stock-limit') as HTMLInputElement).value),
                currency: (document.getElementById('currency') as HTMLSelectElement).value,
                storeName: (document.getElementById('store-name') as HTMLInputElement).value,
                storeAddress: (document.getElementById('store-address') as HTMLTextAreaElement).value,
                storePhone: (document.getElementById('store-phone') as HTMLInputElement).value,
                storeEmail: (document.getElementById('store-email') as HTMLInputElement).value
            };
            settings = newSettings;

            saveLocalData();
            updateDashboard();
            renderProducts();
            
            // In Supabase, settings are usually a single row in a table. We'll use upsert.
            await supabase.from('settings').upsert({ id: 1, data: newSettings });
            
            alert('Pengaturan berhasil disimpan!');
        }

        // Utility Functions
        const populateProductCategories = () => {
            const select = (document.getElementById('product-category') as HTMLSelectElement);
            select.innerHTML = '<option value="">Pilih kategori</option>' +
                categories.map((cat: string) => `<option value="${cat}">${cat}</option>`).join('');
        }

        const populateProductSelects = () => {
            handleStockCardSearch();
            populateSaleProductSelects();
        }

        const populateStockProductSelects = () => {
            const selects = ['stock-in-product', 'stock-out-product'];
            selects.forEach(selectId => {
                const select = (document.getElementById(selectId) as HTMLSelectElement);
                select.innerHTML = '<option value="">Pilih produk</option>' +
                    products.map((p: any) => `<option value="${p.id}">${p.name} (${p.code}) - Stok: ${p.current_stock}</option>`).join('');
            });
        }

        const setDefaultDates = () => {
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            const dateString = now.toISOString().slice(0, 10);
            
            (document.getElementById('sales-date-from') as HTMLInputElement).value = dateString;
            (document.getElementById('sales-date-to') as HTMLInputElement).value = dateString;
        }

        const showModal = (modalId: string) => {
            const modal = (document.getElementById(modalId) as HTMLElement);
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        const closeModal = (modalId: string) => {
            const modal = (document.getElementById(modalId) as HTMLElement);
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            
            if (modalId === 'create-sale-modal') {
                editingSaleId = null;
                (document.getElementById('sale-modal-title') as HTMLElement).textContent = 'Transaksi Penjualan';
                (document.getElementById('sale-customer') as HTMLInputElement).readOnly = false;
                (document.getElementById('sale-item-controls') as HTMLElement).style.display = 'block';
                (document.querySelector('#sale-items-header button') as HTMLElement).style.display = 'block';
                updateProcessButton();
                (document.getElementById('product-search-results') as HTMLElement).classList.add('hidden');
                (document.getElementById('sale-product-search') as HTMLInputElement).value = '';
            }
        }

        const formatCurrency = (amount: number) => {
            const currency = settings.currency === 'USD' ? '$' : 'Rp ';
            return currency + (amount || 0).toLocaleString('id-ID');
        }

        const formatDate = (dateString: string) => {
            return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        }

        const formatDateForExport = (dateString: string) => {
            if (!dateString) return '';
            return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
        }

        const getTimeAgo = (dateString: string) => {
            const now = new Date();
            const date = new Date(dateString);
            const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
            if (diffInSeconds < 60) return 'Baru saja';
            const minutes = Math.floor(diffInSeconds / 60); if (minutes < 60) return `${minutes} menit yang lalu`;
            const hours = Math.floor(minutes / 60); if (hours < 24) return `${hours} jam yang lalu`;
            const days = Math.floor(hours / 24); if (days < 30) return `${days} hari yang lalu`;
            const months = Math.floor(days / 30); return `${months} bulan yang lalu`;
        }

        const exportData = () => {
            if (products.length === 0) {
                alert('Tidak ada data produk untuk diekspor!');
                return;
            }
            const exportReadyData = products.map((product: any) => {
                const stockValue = product.current_stock * product.hpp;
                const potentialRevenue = product.current_stock * product.price;
                const profitMargin = product.price > 0 ? ((product.price - product.hpp) / product.price * 100).toFixed(2) : 0;
                let stockStatus = 'NORMAL';
                if (product.current_stock === 0) stockStatus = 'HABIS';
                else if (product.current_stock <= settings.minStockLimit) stockStatus = 'RENDAH';

                return {
                    'Kode Produk': product.code,
                    'Nama Produk': product.name,
                    'Kategori': product.category,
                    'HPP': product.hpp,
                    'Harga Jual': product.price,
                    'Stok Saat Ini': product.current_stock,
                    'Satuan': product.unit,
                    'Nilai Stok': stockValue,
                    'Potensi Pendapatan': potentialRevenue,
                    'Margin Keuntungan (%)': profitMargin,
                    'Status Stok': stockStatus,
                    'Deskripsi': product.description || ''
                };
            });
            createExcelFileXLS(exportReadyData, `laporan-produk-${new Date().toISOString().split('T')[0]}.xls`, 'Laporan Produk');
            alert('Laporan produk berhasil diekspor!');
        }


        // Order Management Functions
        const renderOrders = () => {
            const tbody = (document.getElementById('orders-table') as HTMLElement);
            let filteredOrders = orders;
            
            if (currentOrderFilter !== 'all') {
                filteredOrders = orders.filter((order: any) => order.status === currentOrderFilter);
            }
            
            const sortedOrders = filteredOrders.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            const paginatedOrders = paginate(sortedOrders, currentPage.orders, ITEMS_PER_PAGE);

            if (paginatedOrders.length === 0) {
                const message = currentOrderFilter === 'all' ? 'Belum ada order.' : `Tidak ada order dengan status ${getStatusText(currentOrderFilter)}.`;
                tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-8 text-center text-gray-500">${message}</td></tr>`;
                renderPagination('orders-pagination', currentPage.orders, sortedOrders.length, ITEMS_PER_PAGE, changeOrdersPage);
                return;
            }

            tbody.innerHTML = paginatedOrders.map((order: any) => {
                const product = products.find((p: any) => p.id === order.product_id);
                const productName = product ? product.name : 'Produk tidak ditemukan';
                const statusBadge = getStatusBadge(order.status);

                return `
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 text-sm font-medium text-gray-900">${order.order_number}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">${formatDate(order.created_at)}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">${productName}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">${order.quantity} ${product?.unit || ''}</td>
                        <td class="px-6 py-4">${statusBadge}</td>
                        <td class="px-6 py-4 text-sm font-medium">
                            <div class="flex space-x-2">
                                <button onclick="viewOrder('${order.id}')" class="text-blue-600 hover:text-blue-900" title="Lihat Detail"><i class="fas fa-eye"></i></button>
                                ${order.status === 'pending' ? `
                                    <button onclick="approveOrder('${order.id}')" class="text-green-600 hover:text-green-900" title="Setujui"><i class="fas fa-check"></i></button>
                                    <button onclick="rejectOrder('${order.id}')" class="text-red-600 hover:text-red-900" title="Tolak"><i class="fas fa-times"></i></button>
                                ` : ''}
                                <button onclick="deleteOrder('${order.id}')" class="text-red-600 hover:text-red-900" title="Hapus"><i class="fas fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
            renderPagination('orders-pagination', currentPage.orders, sortedOrders.length, ITEMS_PER_PAGE, changeOrdersPage);
        }

        const changeOrdersPage = (page: number) => { currentPage.orders = page; renderOrders(); }

        const filterOrders = (status: string, event: any) => {
            currentOrderFilter = status; currentPage.orders = 1;
            document.querySelectorAll('.order-tab-btn').forEach(btn => { btn.classList.remove('border-blue-500', 'text-blue-600'); btn.classList.add('border-transparent', 'text-gray-500'); });
            event.target.classList.add('border-blue-500', 'text-blue-600');
            renderOrders();
        }

        const showCreateOrderModal = () => {
            (document.getElementById('create-order-form') as HTMLFormElement).reset();
            populateOrderProductSelects();
            showModal('create-order-modal');
        }

        const handleCreateOrder = async (e: Event) => {
            e.preventDefault();
            const productId = (document.getElementById('order-product') as HTMLSelectElement).value;
            const quantity = parseInt((document.getElementById('order-quantity') as HTMLInputElement).value);
            const note = (document.getElementById('order-note') as HTMLTextAreaElement).value;

            const newOrder = {
                id: crypto.randomUUID(),
                order_number: 'ORD-' + Date.now().toString().slice(-6),
                product_id: productId,
                quantity: quantity,
                note: note,
                status: 'pending',
                created_at: new Date().toISOString()
            };

            orders.push(newOrder);
            saveLocalData();
            closeModal('create-order-modal');
            renderOrders();
            
            await createRecord('orders', newOrder);
            alert('Order berhasil dibuat!');
        }

        const viewOrder = (orderId: string) => {
            const order = orders.find((o: any) => o.id === orderId);
            const product = products.find((p: any) => p.id === order.product_id);
            const content = (document.getElementById('order-detail-content') as HTMLElement);
            content.innerHTML = `<div class="space-y-3">...</div>`; // Truncated for brevity
            const actions = (document.getElementById('order-actions') as HTMLElement);
            if (order.status === 'pending') {
                actions.innerHTML = `<button onclick="approveOrder('${order.id}'); closeModal('order-detail-modal');" class="flex-1 bg-green-600 ...">Setujui</button> ...`;
            } else {
                actions.innerHTML = `<button onclick="closeModal('order-detail-modal')" class="w-full bg-gray-300 ...">Tutup</button>`;
            }
            showModal('order-detail-modal');
        }

        const approveOrder = async (orderId: string) => {
            const approvalDateTime = new Date().toISOString();
            const order = orders.find((o: any) => o.id === orderId);
            if (!order) return;
            
            order.status = 'approved';
            order.updated_at = approvalDateTime;
            
            const product = products.find((p: any) => p.id === order.product_id);
            product.current_stock += order.quantity;
            
            const movement = {
                id: crypto.randomUUID(),
                product_id: order.product_id,
                type: 'in',
                quantity: order.quantity,
                date: approvalDateTime,
                note: `Order disetujui - ${order.order_number}`
            };
            stockMovements.push(movement);
            
            saveLocalData();
            renderOrders();
            renderProducts();
            updateDashboard();

            await updateRecord('orders', orderId, { status: 'approved', updated_at: approvalDateTime });
            await updateRecord('products', product.id, { current_stock: product.current_stock });
            await createRecord('stock_movements', movement);
            
            alert('Order disetujui dan stok ditambahkan!');
        }

        const rejectOrder = async (orderId: string) => {
            const order = orders.find((o: any) => o.id === orderId);
            if (!order) return;
            order.status = 'rejected';
            order.updated_at = new Date().toISOString();
            // FIX: Changed saveData to saveLocalData
            saveLocalData();
            renderOrders();
            
            await updateRecord('orders', orderId, { status: 'rejected', updated_at: order.updated_at });
            alert('Order telah ditolak.');
        }

        const getStatusBadge = (status: string) => {
            const badges: { [key: string]: string } = {
                pending: '<span class="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">Menunggu</span>',
                approved: '<span class="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Disetujui</span>',
                rejected: '<span class="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Ditolak</span>'
            };
            return badges[status] || status;
        }

        const getStatusText = (status: string) => ({ pending: 'Menunggu', approved: 'Disetujui', rejected: 'Ditolak' }[status] || status);

        const deleteOrder = async (orderId: string) => {
             if (!confirm('Hapus order ini?')) return;
             const order = orders.find((o: any) => o.id === orderId);
             if (!order) return;
             
             if (order.status === 'approved') {
                 const product = products.find((p: any) => p.id === order.product_id);
                 if (product) product.current_stock -= order.quantity;
             }
             
             orders = orders.filter((o: any) => o.id !== orderId);
            // FIX: Changed saveData to saveLocalData
            saveLocalData();
             renderOrders();
             
             await deleteRecord('orders', orderId);
             alert('Order berhasil dihapus!');
        }

        const populateOrderProductSelects = (filteredList?: any[]) => {
            const select = (document.getElementById('order-product') as HTMLSelectElement);
            const productList = filteredList || products;
            select.innerHTML = '<option value="">Pilih produk</option>' + productList.map((p: any) => `<option value="${p.id}">${p.name} (${p.code}) - Stok: ${p.current_stock}</option>`).join('');
        }

        const renderSales = () => {
            const paginatedSales = paginate(filteredSales, currentPage.sales, ITEMS_PER_PAGE);
            const tbody = document.getElementById('sales-table') as HTMLElement;

            if (paginatedSales.length === 0) {
                tbody.innerHTML = `<tr><td colspan="8" class="px-6 py-8 text-center text-gray-500">Tidak ada transaksi penjualan pada periode ini.</td></tr>`;
            } else {
                tbody.innerHTML = paginatedSales.map(sale => {
                    const statusColors: { [key: string]: string } = {
                        paid: 'bg-green-100 text-green-800',
                        unpaid: 'bg-yellow-100 text-yellow-800',
                        indent: 'bg-blue-100 text-blue-800'
                    };
                    const statusBadge = `<span class="px-2 py-1 text-xs font-semibold ${statusColors[sale.status] || 'bg-gray-100 text-gray-800'} rounded-full">${sale.status}</span>`;
                    
                    return `
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 text-sm font-medium text-gray-900">${sale.sale_number}</td>
                            <td class="px-6 py-4 text-sm text-gray-900">${formatDate(sale.saleDate)}</td>
                            <td class="px-6 py-4 text-sm text-gray-900">${sale.customer_name}</td>
                            <td class="px-6 py-4 text-sm text-gray-900">${sale.items.length}</td>
                            <td class="px-6 py-4 text-sm text-gray-900">${sale.payment_method}</td>
                            <td class="px-6 py-4">${statusBadge}</td>
                            <td class="px-6 py-4 text-sm font-medium text-gray-900">${formatCurrency(sale.total_amount)}</td>
                            <td class="px-6 py-4 text-sm font-medium">
                                <div class="flex space-x-2">
                                    <button onclick="viewSale('${sale.id}')" class="text-blue-600 hover:text-blue-900" title="Lihat Detail"><i class="fas fa-eye"></i></button>
                                    <button onclick="printSaleReceipt('${sale.id}')" class="text-gray-600 hover:text-gray-900" title="Cetak Struk"><i class="fas fa-print"></i></button>
                                    ${sale.status === 'unpaid' ? `<button onclick="confirmIndentPayment('${sale.id}')" class="text-green-600 hover:text-green-900" title="Konfirmasi Pembayaran"><i class="fas fa-check-circle"></i></button>` : ''}
                                    <button onclick="deleteSale('${sale.id}')" class="text-red-600 hover:text-red-900" title="Hapus"><i class="fas fa-trash"></i></button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('');
            }

            renderPagination('sales-pagination', currentPage.sales, filteredSales.length, ITEMS_PER_PAGE, changeSalesPage);
            updateSalesSummary();
        };

        const exportSalesData = () => {
            if (filteredSales.length === 0) {
                alert("Tidak ada data penjualan untuk diekspor pada periode ini.");
                return;
            }

            const exportReadyData = filteredSales.flatMap(sale => 
                sale.items.map((item: any) => ({
                    'No. Transaksi': sale.sale_number,
                    'Tanggal': formatDateForExport(sale.saleDate),
                    'Customer': sale.customer_name,
                    'Metode Pembayaran': sale.payment_method,
                    'Status': sale.status,
                    'Nama Produk': item.product_name,
                    'Jumlah': item.quantity,
                    'Harga Satuan': item.price_at_sale,
                    'Subtotal': item.total
                }))
            );

            const dateFrom = (document.getElementById('sales-date-from') as HTMLInputElement).value;
            const dateTo = (document.getElementById('sales-date-to') as HTMLInputElement).value;
            const filename = `laporan-penjualan-${dateFrom}-to-${dateTo}.xls`;
            
            createExcelFileXLS(exportReadyData, filename, 'Laporan Penjualan');
            alert(`Laporan penjualan berhasil diekspor sebagai ${filename}!`);
        };

        const createExcelFileXLS = (data: any[], filename: string, sheetName = 'Sheet1') => {
            if (data.length === 0) {
                alert("Tidak ada data untuk diekspor.");
                return;
            }

            const headers = Object.keys(data[0]);

            let table = `
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                <head>
                    <!--[if gte mso 9]>
                    <xml>
                        <x:ExcelWorkbook>
                            <x:ExcelWorksheets>
                                <x:ExcelWorksheet>
                                    <x:Name>${sheetName}</x:Name>
                                    <x:WorksheetOptions>
                                        <x:DisplayGridlines/>
                                    </x:WorksheetOptions>
                                </x:ExcelWorksheet>
                            </x:ExcelWorksheets>
                        </x:ExcelWorkbook>
                    </xml>
                    <![endif]-->
                    <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
                </head>
                <body>
                    <table>
                        <thead>
                            <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
                        </thead>
                        <tbody>
            `;

            data.forEach(row => {
                table += '<tr>';
                headers.forEach(header => {
                    const cellData = row[header] !== null && row[header] !== undefined ? row[header] : '';
                    const sanitizedData = String(cellData).replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    table += `<td>${sanitizedData}</td>`;
                });
                table += '</tr>';
            });

            table += `
                        </tbody>
                    </table>
                </body>
                </html>
            `;

            const dataType = 'application/vnd.ms-excel';
            const base64 = (s: string) => window.btoa(unescape(encodeURIComponent(s)));
            
            const a = document.createElement('a');
            a.href = `data:${dataType};base64,${base64(table)}`;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
        
        const importProductsData = async () => {
            const fileInput = document.getElementById('import-file') as HTMLInputElement;
            if (!fileInput.files || fileInput.files.length === 0) {
                alert('Silakan pilih file CSV produk untuk diimpor.');
                return;
            }
            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = async (event) => {
                try {
                    const csvText = event.target?.result as string;
                    const productData = parseCSV(csvText);

                    if (productData.length === 0) {
                        alert('File CSV kosong atau format tidak valid.');
                        return;
                    }
                    
                    let createdCount = 0;
                    let updatedCount = 0;
                    let errorCount = 0;
                    const errorDetails: string[] = [];
                    const newCategories = new Set<string>();

                    for (const row of productData) {
                        const { code, name, category, hpp, price, current_stock, unit, description } = row;

                        if (!code || !name) {
                            errorCount++;
                            errorDetails.push(`Baris dilewati: 'code' dan 'name' wajib diisi. Data: ${JSON.stringify(row)}`);
                            continue;
                        }

                        if (category && !categories.includes(category)) {
                            newCategories.add(category);
                        }
                        
                        const productPayload = {
                            code: code,
                            name: name,
                            category: category || 'Uncategorized',
                            hpp: parseFloat(hpp) || 0,
                            price: parseFloat(price) || 0,
                            current_stock: parseInt(current_stock) || 0,
                            unit: unit || 'pcs',
                            description: description || ''
                        };

                        const existingProduct = products.find((p: any) => p.code === code);

                        if (existingProduct) {
                            // Update existing product
                            const updatedProduct = { ...existingProduct, ...productPayload, updated_at: new Date().toISOString() };
                            const productIndex = products.findIndex((p: any) => p.id === existingProduct.id);
                            products[productIndex] = updatedProduct;
                            await updateRecord('products', existingProduct.id, productPayload);
                            updatedCount++;
                        } else {
                            // Create new product
                            const newProduct = {
                                id: crypto.randomUUID(),
                                ...productPayload,
                                created_at: new Date().toISOString()
                            };
                            products.push(newProduct);
                            await createRecord('products', newProduct);

                            // Create initial stock movement if stock is provided
                            if (newProduct.current_stock > 0) {
                                const movement = {
                                    id: crypto.randomUUID(),
                                    product_id: newProduct.id,
                                    type: 'in',
                                    quantity: newProduct.current_stock,
                                    date: new Date().toISOString(),
                                    note: 'Stok awal dari import CSV'
                                };
                                stockMovements.push(movement);
                                await createRecord('stock_movements', movement);
                            }
                            createdCount++;
                        }
                    }

                    // Add new categories
                    if (newCategories.size > 0) {
                        for (const catName of newCategories) {
                            if (!categories.includes(catName)) {
                                categories.push(catName);
                                await createRecord('categories', { name: catName });
                            }
                        }
                    }
                    
                    saveLocalData();
                    renderAll();
                    
                    let summaryMessage = `Impor Produk Selesai!\n\nBerhasil Dibuat: ${createdCount}\nBerhasil Diperbarui: ${updatedCount}\nGagal: ${errorCount}`;
                    if (errorDetails.length > 0) {
                        summaryMessage += `\n\nDetail Kegagalan:\n- ${errorDetails.slice(0, 5).join('\n- ')}`;
                    }
                    alert(summaryMessage);

                } catch (error) {
                    console.error('Gagal mengimpor file produk:', error);
                    alert('Terjadi kesalahan saat memproses file. Pastikan format file CSV sudah benar.');
                } finally {
                    fileInput.value = '';
                }
            };
            reader.readAsText(file);
        };

        // --- CSV TEMPLATE DOWNLOAD FUNCTIONS ---
        const downloadCSV = (filename: string, headers: string[], data: (string|number)[][]) => {
            // Sanitize data for CSV: ensure no commas in fields or wrap in quotes
            const sanitizeRow = (row: (string|number)[]) => row.map(field => {
                const strField = String(field || '');
                if (strField.includes(',')) {
                    return `"${strField.replace(/"/g, '""')}"`;
                }
                return strField;
            });

            const csvContent = [
                headers.join(','),
                ...data.map(row => sanitizeRow(row).join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert(`${filename} berhasil diunduh!`);
        };

        const downloadProductTemplate = () => {
            const headers = ["code", "name", "category", "hpp", "price", "current_stock", "unit", "description"];
            const sampleData = [
                ["SKU001", "Indomie Goreng", "Makanan Instan", 2500, 3000, 100, "pcs", "Mi instan goreng rasa original 85g"],
                ["SKU002", "Teh Botol Sosro", "Minuman", 3000, 4000, 50, "botol", "Minuman teh melati kemasan botol 250ml"]
            ];
            downloadCSV('template_produk.csv', headers, sampleData);
        };

        const downloadCategoryTemplate = () => {
            const headers = ["name"];
            const sampleData = [ ["Makanan Instan"], ["Minuman"], ["ATK"] ];
            downloadCSV('template_kategori.csv', headers, sampleData);
        };

        const downloadStockMovementTemplate = () => {
            const headers = ["product_code", "type", "quantity", "date", "note"];
            const sampleData = [
                ["SKU001", "in", 20, new Date().toISOString(), "Pembelian dari supplier A"],
                ["SKU002", "out", 5, new Date().toISOString(), "Rusak / Kadaluarsa"]
            ];
            downloadCSV('template_pergerakan_stok.csv', headers, sampleData);
        };

        const downloadOrderTemplate = () => {
            const headers = ["product_code", "quantity", "note", "status"];
            const sampleData = [
                ["SKU001", 50, "Stok mingguan", "pending"],
                ["SKU002", 24, "Request tambahan", "pending"]
            ];
            downloadCSV('template_order_stok.csv', headers, sampleData);
        };
        
        const downloadSaleTemplate = () => {
            const headers = ["sale_number", "customer_name", "saleDate", "payment_method", "status", "product_code", "quantity", "price_at_sale"];
            const sampleData = [
                ["SALE-2024-001", "Budi", new Date().toISOString(), "cash", "paid", "SKU001", 2, 3000],
                ["SALE-2024-001", "Budi", new Date().toISOString(), "cash", "paid", "SKU002", 1, 4000],
                ["SALE-2024-002", "Ani", new Date().toISOString(), "unpaid", "unpaid", "SKU001", 5, 3000]
            ];
            alert("Template Penjualan: Setiap baris adalah satu item produk dalam sebuah transaksi. Baris dengan 'sale_number' yang sama akan digabung menjadi satu transaksi saat import.");
            downloadCSV('template_penjualan.csv', headers, sampleData);
        };

        const backupData = () => {
            const backupObject = {
                products,
                categories,
                stockMovements,
                orders,
                sales,
                settings,
                timestamp: new Date().toISOString()
            };
            const jsonString = JSON.stringify(backupObject, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `minimart-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert('Backup data berhasil diunduh!');
        };
        
        const restoreData = async () => {
            const fileInput = document.getElementById('restore-file') as HTMLInputElement;
            if (!fileInput.files || fileInput.files.length === 0) {
                alert('Silakan pilih file backup untuk direstore.');
                return;
            }

            const file = fileInput.files[0];
            const confirmation = confirm(
                'PERINGATAN: Ini akan MENGGANTI SEMUA data di server Supabase dengan data dari file backup. Data lokal juga akan diganti. Aksi ini tidak dapat dibatalkan. Lanjutkan?'
            );

            if (!confirmation) {
                fileInput.value = ''; // Reset file input
                return;
            }

            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const data = JSON.parse(event.target?.result as string);

                    if (!data.products || !data.categories || !data.stockMovements || !data.orders || !data.sales || !data.settings) {
                        throw new Error('Format file backup tidak valid. Pastikan file berisi data products, categories, stockMovements, orders, sales, dan settings.');
                    }
                    
                    alert('Memulai proses restore. Ini mungkin memakan waktu beberapa saat. Jangan tutup halaman ini.');
                    setStatusIndicator('syncing', 'Restoring data to Supabase...');

                    // 1. Clear existing data in Supabase (in reverse order of dependency)
                    const tablesToDelete = ['stock_movements', 'sales', 'orders', 'products', 'categories'];
                    console.log('Clearing old data from Supabase...');
                    for (const table of tablesToDelete) {
                        // This `neq` is a trick to apply a filter that matches and deletes all rows.
                        const { error: deleteError } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
                         if (deleteError) console.warn(`Could not clear table ${table}. It might be empty already. Error: ${deleteError.message}`);
                    }

                    // 2. Restore data with robust, item-by-item insertion
                    const restoreErrors: { table: string, item: any, error: string }[] = [];

                    const robustUpsert = async (table: string, items: any[]) => {
                        if (!items || items.length === 0) return;
                        console.log(`Restoring ${items.length} items to ${table}...`);
                        for (const item of items) {
                            const { error } = await supabase.from(table).upsert(item);
                            if (error) {
                                console.error(`Failed to restore item in ${table}:`, item, error);
                                restoreErrors.push({ table, item, error: `${error.message} (Detail: ${error.details})` });
                            }
                        }
                    };

                    // Step 2a: Ensure all categories exist before inserting products
                    const categoriesFromProducts = [...new Set(data.products.map((p: any) => p.category).filter(Boolean))];
                    const allCategoryNames = [...new Set([...data.categories, ...categoriesFromProducts])];
                    if (allCategoryNames.length > 0) {
                        const categoriesToInsert = allCategoryNames.map((name: string) => ({ name }));
                        // For categories, we need to handle potential duplicates on name, so we use upsert
                        const { error } = await supabase.from('categories').upsert(categoriesToInsert, { onConflict: 'name' });
                        if (error) {
                             console.error("Gagal merestore kategori:", error);
                             restoreErrors.push({table: 'categories', item: categoriesToInsert, error: error.message});
                        }
                    }

                    // Step 2b: Restore other tables
                    await robustUpsert('products', data.products);
                    await robustUpsert('stock_movements', data.stockMovements);
                    await robustUpsert('orders', data.orders);
                    await robustUpsert('sales', data.sales);
                    
                    // Step 2c: Upsert settings (usually a single row, so robust upsert is overkill but safe)
                    await supabase.from('settings').upsert({ id: 1, data: data.settings });

                    // 3. Update local state with data from the backup file
                    products = data.products;
                    categories = allCategoryNames;
                    stockMovements = data.stockMovements;
                    orders = data.orders;
                    sales = data.sales;
                    settings = data.settings;

                    saveLocalData();
                    renderAll();
                    
                    setStatusIndicator('online', 'Restore complete.');
                    
                    // 4. Report final status to the user
                    if (restoreErrors.length > 0) {
                        const errorMessage = `Restore selesai dengan ${restoreErrors.length} kegagalan.\n\n` +
                            `Item yang berhasil telah direstore. Item berikut gagal (periksa file backup Anda untuk data yang tidak valid, duplikat, atau tidak cocok dengan skema database):\n\n` +
                            restoreErrors.map(e => `- Tabel: ${e.table}, ID/Kode: ${e.item.id || e.item.code || e.item.name || 'N/A'}, Error: ${e.error}`).slice(0, 10).join('\n') +
                            (restoreErrors.length > 10 ? `\n...dan ${restoreErrors.length - 10} lainnya.` : '');
                        
                        alert(errorMessage + "\n\nLihat konsol developer untuk daftar lengkap.");
                        console.error("Daftar lengkap kegagalan restore:", restoreErrors);
                    } else {
                        alert('Restore data berhasil! Semua data dari file backup telah dimuat ke server dan aplikasi.');
                    }

                } catch (error: any) {
                    console.error('Restore failed critically:', error);
                    setStatusIndicator('offline', 'Restore failed.');
                    alert(`Gagal total merestore data: ${error.message}. Periksa format file backup dan koneksi internet Anda. Lihat konsol untuk detail teknis.`);
                } finally {
                    fileInput.value = ''; // Reset file input
                }
            };
            reader.readAsText(file);
        };

        // Helper function to parse CSV
        const parseCSV = (text: string): { [key: string]: string }[] => {
            const lines = text.trim().replace(/\r/g, '').split('\n');
            if (lines.length < 2) return [];
        
            // Use shift() to get the header and remove it from lines array
            const headerLine = lines.shift();
            if (!headerLine) return [];
            const header = headerLine.split(',').map(h => h.trim());
            const result: { [key: string]: string }[] = [];
        
            for (const line of lines) {
                if (!line.trim()) continue;
                
                const values = [];
                let inQuote = false;
                let currentField = '';
        
                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    if (char === '"') {
                        // Handle escaped quotes ("")
                        if (inQuote && i < line.length - 1 && line[i + 1] === '"') {
                            currentField += '"';
                            i++; // Skip the next quote
                        } else {
                            inQuote = !inQuote;
                        }
                    } else if (char === ',' && !inQuote) {
                        values.push(currentField);
                        currentField = '';
                    } else {
                        currentField += char;
                    }
                }
                values.push(currentField); // Add the last field
        
                if (values.length > 0) {
                     const obj = header.reduce((acc, h, i) => {
                        acc[h] = (values[i] || '').trim();
                        return acc;
                    }, {} as { [key: string]: string });
                    result.push(obj);
                }
            }
            return result;
        };

        const importSalesData = () => {
            const fileInput = document.getElementById('import-sales-file') as HTMLInputElement;
            if (!fileInput.files || fileInput.files.length === 0) {
                alert('Silakan pilih file CSV untuk diimpor.');
                return;
            }
            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = async (event) => {
                try {
                    const csvText = event.target?.result as string;
                    const saleItemsData = parseCSV(csvText);

                    if (saleItemsData.length === 0) {
                        alert('File CSV kosong atau format tidak valid.');
                        return;
                    }
                    
                    // Group items by sale_number
                    const salesMap = new Map<string, any[]>();
                    saleItemsData.forEach(item => {
                        const saleNumber = item.sale_number;
                        if (!saleNumber) return; // Skip rows without sale_number
                        if (!salesMap.has(saleNumber)) {
                            salesMap.set(saleNumber, []);
                        }
                        salesMap.get(saleNumber)?.push(item);
                    });

                    let successCount = 0;
                    let errorCount = 0;
                    const errorDetails: string[] = [];

                    for (const [saleNumber, items] of salesMap.entries()) {
                        const firstItem = items[0];
                        const productLookups = items.map(item => {
                            const product = products.find((p: any) => p.code === item.product_code);
                            return { ...item, product };
                        });

                        // Validation
                        const invalidProduct = productLookups.find(item => !item.product);
                        if (invalidProduct) {
                            errorCount++;
                            errorDetails.push(`Transaksi ${saleNumber}: Produk dengan kode '${invalidProduct.product_code}' tidak ditemukan.`);
                            continue;
                        }

                        const stockErrors = productLookups.filter(item => {
                            const quantity = parseInt(item.quantity, 10);
                            return item.product.current_stock < quantity;
                        });

                        if (stockErrors.length > 0) {
                            errorCount++;
                            const errorMsgs = stockErrors.map(e => `stok '${e.product.name}' tidak cukup (butuh ${e.quantity}, tersedia ${e.product.current_stock})`).join(', ');
                            errorDetails.push(`Transaksi ${saleNumber}: ${errorMsgs}.`);
                            continue;
                        }

                        // If validation passes, process the sale
                        const saleId = crypto.randomUUID();
                        
                        // Robust date parsing
                        const saleDateStr = firstItem.saleDate;
                        const dateObj = saleDateStr ? new Date(saleDateStr) : new Date();

                        if (isNaN(dateObj.getTime())) {
                            errorCount++;
                            errorDetails.push(`Transaksi ${saleNumber}: Format tanggal tidak valid: '${saleDateStr}'. Gunakan format standar ISO (YYYY-MM-DDTHH:mm:ssZ).`);
                            continue; // Skip this invalid transaction
                        }
                        const saleDate = dateObj.toISOString();

                        const saleItems = productLookups.map(item => ({
                            product_id: item.product.id,
                            product_name: item.product.name,
                            quantity: parseInt(item.quantity, 10),
                            price_at_sale: parseFloat(item.price_at_sale),
                            total: parseInt(item.quantity, 10) * parseFloat(item.price_at_sale)
                        }));
                        
                        const totalAmount = saleItems.reduce((sum, item) => sum + item.total, 0);

                        const newSale = {
                            id: saleId,
                            sale_number: saleNumber,
                            customer_name: firstItem.customer_name,
                            saleDate: saleDate,
                            payment_method: firstItem.payment_method || 'cash',
                            status: firstItem.status || 'paid',
                            items: saleItems,
                            total_amount: totalAmount,
                            created_at: new Date().toISOString()
                        };

                        // Optimistic UI updates
                        sales.push(newSale);

                        for (const item of saleItems) {
                            const product = products.find((p: any) => p.id === item.product_id);
                            if (product) {
                                product.current_stock -= item.quantity;
                            }
                            
                            const movement = {
                                id: crypto.randomUUID(),
                                product_id: item.product_id,
                                type: 'out',
                                quantity: item.quantity,
                                date: saleDate,
                                note: `Penjualan - ${saleNumber}`
                            };
                            stockMovements.push(movement);

                            // Sync changes
                            await updateRecord('products', product.id, { current_stock: product.current_stock });
                            await createRecord('stock_movements', movement);
                        }

                        await createRecord('sales', newSale);
                        successCount++;
                    }
                    
                    saveLocalData();
                    renderAll();
                    
                    let summaryMessage = `Impor Selesai!\n\nBerhasil: ${successCount} transaksi.\nGagal: ${errorCount} transaksi.`;
                    if (errorDetails.length > 0) {
                        summaryMessage += `\n\nDetail Kegagalan:\n- ${errorDetails.slice(0, 5).join('\n- ')}`;
                        if (errorDetails.length > 5) {
                            summaryMessage += `\n...dan ${errorDetails.length - 5} lainnya (lihat konsol).`;
                            console.error("Detail kegagalan impor:", errorDetails);
                        }
                    }
                    alert(summaryMessage);

                } catch (error) {
                    console.error('Gagal mengimpor file penjualan:', error);
                    alert('Terjadi kesalahan saat memproses file. Pastikan format file CSV sudah benar.');
                } finally {
                    fileInput.value = '';
                }
            };
            reader.readAsText(file);
        };
        
        const importStockMovementData = async () => {
            const fileInput = document.getElementById('import-stock-file') as HTMLInputElement;
            if (!fileInput.files || fileInput.files.length === 0) {
                alert('Silakan pilih file CSV pergerakan stok untuk diimpor.');
                return;
            }
            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = async (event) => {
                try {
                    const csvText = event.target?.result as string;
                    const movementData = parseCSV(csvText);

                    if (movementData.length === 0) {
                        alert('File CSV kosong atau format tidak valid.');
                        return;
                    }
                    
                    let successCount = 0;
                    let errorCount = 0;
                    const errorDetails: string[] = [];

                    for (const row of movementData) {
                        const { product_code, type, quantity, date, note } = row;

                        // Validation
                        if (!product_code || !type || !quantity) {
                            errorCount++;
                            errorDetails.push(`Baris dilewati: 'product_code', 'type', dan 'quantity' wajib diisi. Data: ${JSON.stringify(row)}`);
                            continue;
                        }

                        const product = products.find((p: any) => p.code === product_code);
                        if (!product) {
                            errorCount++;
                            errorDetails.push(`Produk dengan kode '${product_code}' tidak ditemukan.`);
                            continue;
                        }
                        
                        const movementType = type.toLowerCase();
                        if (movementType !== 'in' && movementType !== 'out') {
                            errorCount++;
                            errorDetails.push(`Tipe pergerakan tidak valid untuk produk '${product_code}': '${type}'. Gunakan 'in' atau 'out'.`);
                            continue;
                        }
                        
                        const movementQuantity = parseInt(quantity, 10);
                        if (isNaN(movementQuantity) || movementQuantity <= 0) {
                            errorCount++;
                            errorDetails.push(`Jumlah tidak valid untuk produk '${product_code}': '${quantity}'. Harus angka positif.`);
                            continue;
                        }

                        if (movementType === 'out' && product.current_stock < movementQuantity) {
                            errorCount++;
                            errorDetails.push(`Stok tidak cukup untuk produk '${product.name}' (butuh ${movementQuantity}, tersedia ${product.current_stock}).`);
                            continue;
                        }
                        
                        // Process valid movement
                        if (movementType === 'in') {
                            product.current_stock += movementQuantity;
                        } else {
                            product.current_stock -= movementQuantity;
                        }
                        
                        const movement = {
                            id: crypto.randomUUID(),
                            product_id: product.id,
                            type: movementType,
                            quantity: movementQuantity,
                            date: date ? new Date(date).toISOString() : new Date().toISOString(),
                            note: note || `Import pergerakan stok (${movementType})`
                        };
                        stockMovements.push(movement);
                        
                        // Sync with server
                        await updateRecord('products', product.id, { current_stock: product.current_stock });
                        await createRecord('stock_movements', movement);
                        
                        successCount++;
                    }
                    
                    saveLocalData();
                    renderAll();
                    
                    let summaryMessage = `Impor Pergerakan Stok Selesai!\n\nBerhasil: ${successCount} baris.\nGagal: ${errorCount} baris.`;
                    if (errorDetails.length > 0) {
                        summaryMessage += `\n\nDetail Kegagalan:\n- ${errorDetails.slice(0, 5).join('\n- ')}`;
                        if (errorDetails.length > 5) {
                            summaryMessage += `\n...dan ${errorDetails.length - 5} lainnya (lihat konsol).`;
                            console.error("Detail kegagalan impor pergerakan stok:", errorDetails);
                        }
                    }
                    alert(summaryMessage);

                } catch (error) {
                    console.error('Gagal mengimpor file pergerakan stok:', error);
                    alert('Terjadi kesalahan saat memproses file. Pastikan format file CSV sudah benar.');
                } finally {
                    fileInput.value = '';
                }
            };
            reader.readAsText(file);
        };

        const paginate = (items: any[], page: number, perPage: number) => {
            const start = (page - 1) * perPage;
            const end = start + perPage;
            return items.slice(start, end);
        };
        const renderPagination = (containerId: string, currentPage: number, totalItems: number, itemsPerPage: number, onPageChange: (page: number) => void) => {
            const paginationContainer = document.getElementById(containerId);
            if (!paginationContainer) return;

            const totalPages = Math.ceil(totalItems / itemsPerPage);
            if (totalPages <= 1) {
                paginationContainer.innerHTML = '';
                return;
            }

            win.onPageChange[containerId] = onPageChange;

            let paginationHTML = `
                <div class="text-sm text-gray-700">
                    Menampilkan <span class="font-medium">${(currentPage - 1) * itemsPerPage + 1}</span> sampai <span class="font-medium">${Math.min(currentPage * itemsPerPage, totalItems)}</span> dari <span class="font-medium">${totalItems}</span> hasil
                </div>
                <div class="flex items-center space-x-2">
            `;

            paginationHTML += `
                <button 
                    onclick="window.onPageChange['${containerId}'](${currentPage - 1})" 
                    class="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    ${currentPage === 1 ? 'disabled' : ''}
                >
                    &laquo; Sebelumnya
                </button>
            `;

            paginationHTML += `
                <button 
                    onclick="window.onPageChange['${containerId}'](${currentPage + 1})" 
                    class="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    ${currentPage === totalPages ? 'disabled' : ''}
                >
                    Berikutnya &raquo;
                </button>
            `;

            paginationHTML += `</div>`;
            paginationContainer.innerHTML = paginationHTML;
        };
        const showCreateSaleModal = () => {
            editingSaleId = null;
            currentSaleItems.length = 0; // Clear the array

            (document.getElementById('sale-modal-title') as HTMLElement).textContent = 'Transaksi Penjualan';
            (document.getElementById('sale-customer') as HTMLInputElement).value = '';
            (document.getElementById('sale-customer') as HTMLInputElement).readOnly = false;
            
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            (document.getElementById('sale-date') as HTMLInputElement).value = now.toISOString().slice(0, 16);

            (document.getElementById('payment-method') as HTMLSelectElement).value = 'cash';
            
            (document.getElementById('sale-item-controls') as HTMLElement).style.display = 'block';
            (document.querySelector('#sale-items-header button') as HTMLElement).style.display = 'block';

            populateSaleProductSelects();
            updateSaleItemsTable();
            updateSaleTotal();
            updateProcessButton();
            (document.getElementById('product-info') as HTMLElement).classList.add('hidden');

            showModal('create-sale-modal');
        };

        const addItemToSale = () => {
            const productId = (document.getElementById('sale-product') as HTMLSelectElement).value;
            const quantityInput = (document.getElementById('sale-quantity') as HTMLInputElement);
            const quantity = parseInt(quantityInput.value);
            const product = products.find((p: any) => p.id === productId);

            if (!product) {
                alert('Silakan pilih produk terlebih dahulu.');
                return;
            }
            if (isNaN(quantity) || quantity <= 0) {
                alert('Masukkan jumlah yang valid.');
                return;
            }
            if (quantity > product.current_stock) {
                alert(`Stok tidak mencukupi. Stok tersedia: ${product.current_stock}`);
                return;
            }

            const existingItemIndex = currentSaleItems.findIndex(item => item.product_id === productId);
            if (existingItemIndex > -1) {
                 currentSaleItems[existingItemIndex].quantity += quantity;
                 currentSaleItems[existingItemIndex].total = currentSaleItems[existingItemIndex].quantity * currentSaleItems[existingItemIndex].price_at_sale;
            } else {
                 currentSaleItems.push({
                    product_id: product.id,
                    product_name: product.name,
                    quantity: quantity,
                    price_at_sale: product.price,
                    total: quantity * product.price
                });
            }

            updateSaleItemsTable();
            updateSaleTotal();
            updateProcessButton();

            (document.getElementById('sale-product') as HTMLSelectElement).value = '';
            quantityInput.value = '';
            (document.getElementById('product-info') as HTMLElement).classList.add('hidden');
        };
        const removeItemFromSale = (index: number) => {
            currentSaleItems.splice(index, 1);
            updateSaleItemsTable();
            updateSaleTotal();
            updateProcessButton();
        };
        const updateSaleItemsTable = () => {
            const tbody = (document.getElementById('sale-items-table') as HTMLElement);
            if (currentSaleItems.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="px-3 py-8 text-center text-gray-500 text-sm">Belum ada produk ditambahkan</td></tr>';
                return;
            }

            tbody.innerHTML = currentSaleItems.map((item, index) => `
                <tr class="border-b">
                    <td class="p-3 align-top">
                        <div class="font-medium">${item.product_name}</div>
                        <div class="text-xs text-gray-500">${formatCurrency(item.price_at_sale)}</div>
                    </td>
                    <td class="p-3 align-top">${item.quantity}</td>
                    <td class="p-3 align-top">${formatCurrency(item.price_at_sale)}</td>
                    <td class="p-3 align-top font-medium">${formatCurrency(item.total)}</td>
                    <td class="p-3 align-top">
                        <button onclick="removeItemFromSale(${index})" class="text-red-500 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        };
        const updateProcessButton = () => {
            const btn = (document.getElementById('process-sale-btn') as HTMLButtonElement);
            if (!btn) return;
            const customerName = (document.getElementById('sale-customer') as HTMLInputElement).value.trim();
            const hasItems = currentSaleItems.length > 0;
            
            if (customerName && hasItems) {
                btn.disabled = false;
                btn.classList.remove('opacity-50', 'cursor-not-allowed');
            } else {
                btn.disabled = true;
                btn.classList.add('opacity-50', 'cursor-not-allowed');
            }
        };
        const clearSaleItems = () => {
            if (confirm('Hapus semua item dari transaksi ini?')) {
                currentSaleItems.length = 0;
                updateSaleItemsTable();
                updateSaleTotal();
                updateProcessButton();
            }
        };
        const showReceipt = (sale: any) => {
            const receiptContent = document.getElementById('receipt-content');
            if (!receiptContent) return;

            const storeInfo = `
                <div class="text-center mb-4">
                    <h4 class="text-lg font-bold">${settings.storeName}</h4>
                    <p class="text-xs">${settings.storeAddress}</p>
                    <p class="text-xs">Tel: ${settings.storePhone}</p>
                </div>
            `;

            const saleInfo = `
                <div class="text-xs mb-4">
                    <div class="flex justify-between"><span>No:</span><span>${sale.sale_number}</span></div>
                    <div class="flex justify-between"><span>Tanggal:</span><span>${formatDate(sale.saleDate)}</span></div>
                    <div class="flex justify-between"><span>Customer:</span><span>${sale.customer_name}</span></div>
                    <div class="flex justify-between"><span>Kasir:</span><span>${currentUser.name}</span></div>
                </div>
            `;

            const itemsTable = `
                <div class="text-xs border-t border-b border-dashed py-2 mb-2">
                    ${sale.items.map((item: any) => `
                        <div class="mb-1">
                            <div>${item.product_name}</div>
                            <div class="flex justify-between">
                                <span>${item.quantity} x ${formatCurrency(item.price_at_sale)}</span>
                                <span>${formatCurrency(item.total)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            const totalInfo = `
                <div class="text-xs">
                    <div class="flex justify-between font-bold"><span>TOTAL:</span><span>${formatCurrency(sale.total_amount)}</span></div>
                    <div class="flex justify-between"><span>Metode:</span><span>${sale.payment_method.toUpperCase()}</span></div>
                </div>
            `;
            
            const footer = `<div class="text-center text-xs mt-4">Terima kasih!</div>`;

            receiptContent.innerHTML = `
                <div id="printable-receipt" class="font-mono p-2">
                    ${storeInfo}
                    ${saleInfo}
                    ${itemsTable}
                    ${totalInfo}
                    ${footer}
                </div>
            `;
            
            win.currentReceiptSale = sale;
            showModal('receipt-modal');
        };
        const printReceipt = () => {
            const receiptContent = document.getElementById('printable-receipt');
            if (!receiptContent) return;

            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write('<html><head><title>Struk</title>');
                printWindow.document.write('<style>body { font-family: monospace; font-size: 12px; margin: 0; padding: 10px; } .flex { display: flex; } .justify-between { justify-content: space-between; } .text-center { text-align: center; } .font-bold { font-weight: bold; } .mb-1 { margin-bottom: 4px; } .mb-2 { margin-bottom: 8px; } .mb-4 { margin-bottom: 16px; } .py-2 { padding-top: 8px; padding-bottom: 8px; } .border-t { border-top: 1px dashed black; } .border-b { border-bottom: 1px dashed black; }</style>');
                printWindow.document.write('</head><body>');
                printWindow.document.write(receiptContent.innerHTML);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
                printWindow.close();
            } else {
                alert('Gagal membuka jendela print. Mohon izinkan pop-up untuk situs ini.');
            }
        };
        const processSale = async () => {
            const customerName = (document.getElementById('sale-customer') as HTMLInputElement).value.trim();
            const saleDate = (document.getElementById('sale-date') as HTMLInputElement).value;
            const paymentMethod = (document.getElementById('payment-method') as HTMLSelectElement).value;

            if (!customerName || currentSaleItems.length === 0) {
                alert('Harap masukkan nama customer dan tambahkan setidaknya satu produk.');
                return;
            }

            const totalAmount = currentSaleItems.reduce((sum, item) => sum + item.total, 0);

            const newSale = {
                id: crypto.randomUUID(),
                sale_number: 'SALE-' + Date.now().toString().slice(-6),
                customer_name: customerName,
                saleDate: saleDate ? new Date(saleDate).toISOString() : new Date().toISOString(),
                payment_method: paymentMethod,
                status: paymentMethod === 'unpaid' ? 'unpaid' : 'paid',
                items: currentSaleItems.map(item => ({...item})), // create a copy
                total_amount: totalAmount,
                created_at: new Date().toISOString(),
            };

            sales.push(newSale);
            
            const stockUpdates: {productId: string, newStock: number}[] = [];
            const movementsToAdd: any[] = [];

            for (const item of newSale.items) {
                const product = products.find((p: any) => p.id === item.product_id);
                if (product) {
                    const newStock = product.current_stock - item.quantity;
                    product.current_stock = newStock;
                    stockUpdates.push({ productId: product.id, newStock });
                    
                    const movement = {
                        id: crypto.randomUUID(),
                        product_id: item.product_id,
                        type: 'out',
                        quantity: item.quantity,
                        date: newSale.saleDate,
                        note: `Penjualan - ${newSale.sale_number}`
                    };
                    stockMovements.push(movement);
                    movementsToAdd.push(movement);
                }
            }

            saveLocalData();
            closeModal('create-sale-modal');
            renderSales();
            renderProducts();
            updateDashboard();

            await createRecord('sales', newSale);
            for (const update of stockUpdates) {
                await updateRecord('products', update.productId, { current_stock: update.newStock });
            }
            for (const movement of movementsToAdd) {
                await createRecord('stock_movements', movement);
            }

            alert('Transaksi penjualan berhasil diproses!');
            showReceipt(newSale);
        };
        const printSaleReceipt = (saleId: string) => { /* ... */ };
        const confirmIndentPayment = (saleId: string) => { /* ... */ };
        const deleteSale = (saleId: string) => { /* ... */ };
        const viewSale = (saleId: string) => { /* ... */ };
        const updateSalesTable = () => { /* ... */ };
        const changeSalesPage = (page: number) => { 
            currentPage.sales = page;
            renderSales();
        };
        const updateSalesSummary = () => {
            const totalCount = filteredSales.length;
            const totalAmount = filteredSales.reduce((sum, sale) => sum + sale.total_amount, 0);
            const avgAmount = totalCount > 0 ? totalAmount / totalCount : 0;
            
            (document.getElementById('total-sales-count') as HTMLElement).textContent = totalCount.toString();
            (document.getElementById('total-sales-amount') as HTMLElement).textContent = formatCurrency(totalAmount);
            (document.getElementById('avg-sales-amount') as HTMLElement).textContent = formatCurrency(avgAmount);
        };
        const filterSales = () => {
            const dateFrom = (document.getElementById('sales-date-from') as HTMLInputElement).value;
            const dateTo = (document.getElementById('sales-date-to') as HTMLInputElement).value;
            
            if (dateFrom && dateTo) {
                const start = new Date(dateFrom).getTime();
                const end = new Date(dateTo).setHours(23, 59, 59, 999);
                filteredSales = sales.filter(s => {
                    const saleDate = new Date(s.saleDate || s.created_at).getTime();
                    return saleDate >= start && saleDate <= end;
                });
            } else {
                filteredSales = [...sales];
            }
            
            currentPage.sales = 1; // Reset to first page after filtering
            renderSales();
        };
        const showPaymentModal = (saleId: string) => { /* ... */ };
        const editSale = (saleId: string) => { /* ... */ };
        const populateSaleProductSelects = () => {
            const select = (document.getElementById('sale-product') as HTMLSelectElement);
            const availableProducts = products.filter((p: any) => p.current_stock > 0);
            select.innerHTML = '<option value="">Pilih produk</option>' +
                availableProducts.map((p: any) => `<option value="${p.id}">${p.name} (${p.code}) - Stok: ${p.current_stock}</option>`).join('');
        };
        const updateSaleInfo = () => {
            const productId = (document.getElementById('sale-product') as HTMLSelectElement).value;
            const productInfoDiv = (document.getElementById('product-info') as HTMLElement);
            
            if (!productId) {
                productInfoDiv.classList.add('hidden');
                return;
            }

            const product = products.find((p: any) => p.id === productId);
            if (product) {
                (document.getElementById('available-stock') as HTMLElement).textContent = product.current_stock;
                (document.getElementById('product-price-display') as HTMLElement).textContent = formatCurrency(product.price);
                productInfoDiv.classList.remove('hidden');
                (document.getElementById('sale-quantity') as HTMLInputElement).max = product.current_stock;
            } else {
                productInfoDiv.classList.add('hidden');
            }
        };
        const updateSaleTotal = () => {
            const subtotal = currentSaleItems.reduce((sum, item) => sum + item.total, 0);
            (document.getElementById('sale-subtotal') as HTMLElement).textContent = formatCurrency(subtotal);
            (document.getElementById('sale-grand-total') as HTMLElement).textContent = formatCurrency(subtotal);
        };
        const searchSaleProducts = () => {
            const searchTerm = (document.getElementById('sale-product-search') as HTMLInputElement).value.toLowerCase();
            const resultsContainer = (document.getElementById('product-search-results') as HTMLElement);
            
            if (searchTerm.length < 2) {
                resultsContainer.classList.add('hidden');
                resultsContainer.innerHTML = '';
                return;
            }

            const availableProducts = products.filter((p: any) => p.current_stock > 0);
            const filtered = availableProducts.filter((p: any) =>
                p.name.toLowerCase().includes(searchTerm) ||
                p.code.toLowerCase().includes(searchTerm)
            );

            if (filtered.length > 0) {
                resultsContainer.innerHTML = filtered.slice(0, 5).map((p: any) => `
                    <div onclick="selectProductFromSearch('${p.id}')" class="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0">
                        <div class="font-medium">${p.name} (${p.code})</div>
                        <div class="text-sm text-gray-600">Stok: ${p.current_stock} | Harga: ${formatCurrency(p.price)}</div>
                    </div>
                `).join('');
            } else {
                resultsContainer.innerHTML = '<div class="p-3 text-center text-gray-500">Produk tidak ditemukan</div>';
            }
            
            resultsContainer.classList.remove('hidden');
        };
        const selectProductFromSearch = (productId: string) => {
            (document.getElementById('sale-product') as HTMLSelectElement).value = productId;
    
            // Manually trigger change event to update UI
            const event = new Event('change', { bubbles: true });
            (document.getElementById('sale-product') as HTMLSelectElement).dispatchEvent(event);

            (document.getElementById('product-search-results') as HTMLElement).classList.add('hidden');
            (document.getElementById('sale-product-search') as HTMLInputElement).value = '';
        };
        const exportStockCard = () => {
            const productId = (document.getElementById('stock-card-product') as HTMLSelectElement).value;
            if (!productId) {
                alert('Silakan pilih produk terlebih dahulu untuk mengekspor kartu stok.');
                return;
            }

            const product = products.find((p: any) => p.id === productId);
            if (!product) {
                alert('Produk tidak ditemukan.');
                return;
            }

            const movements = stockMovements
                .filter((m: any) => m.product_id === productId)
                .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

            if (movements.length === 0) {
                alert('Tidak ada pergerakan stok untuk produk ini.');
                return;
            }

            // 1. Build product details table
            const stockValue = product.current_stock * product.hpp;
            const productDetailsHTML = `
                <h2>Detail Produk</h2>
                <table border="1">
                    <tbody>
                        <tr><td><strong>Kode Produk</strong></td><td>${product.code}</td></tr>
                        <tr><td><strong>Nama Produk</strong></td><td>${product.name}</td></tr>
                        <tr><td><strong>Kategori</strong></td><td>${product.category}</td></tr>
                        <tr><td><strong>HPP</strong></td><td>${product.hpp}</td></tr>
                        <tr><td><strong>Harga Jual</strong></td><td>${product.price}</td></tr>
                        <tr><td><strong>Stok Saat Ini</strong></td><td>${product.current_stock}</td></tr>
                        <tr><td><strong>Satuan</strong></td><td>${product.unit}</td></tr>
                        <tr><td><strong>Nilai Stok (HPP)</strong></td><td>${stockValue}</td></tr>
                    </tbody>
                </table>
                <br/>
            `;

            // 2. Build movements table
            let balance = 0;
            const movementsHeaders = ['Tanggal', 'Keterangan', 'Masuk', 'Keluar', 'Saldo'];
            const movementsRows = movements.map(movement => {
                if (movement.type === 'in') {
                    balance += movement.quantity;
                } else {
                    balance -= movement.quantity;
                }
                return {
                    'Tanggal': formatDateForExport(movement.date),
                    'Keterangan': movement.note,
                    'Masuk': movement.type === 'in' ? movement.quantity : '',
                    'Keluar': movement.type === 'out' ? movement.quantity : '',
                    'Saldo': balance
                };
            });

            const movementsTableHTML = `
                <h2>Riwayat Pergerakan Stok</h2>
                <table border="1">
                    <thead>
                        <tr>${movementsHeaders.map(h => `<th>${h}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
                        ${movementsRows.map(row => `
                            <tr>
                                <td>${row.Tanggal}</td>
                                <td>${row.Keterangan}</td>
                                <td>${row.Masuk}</td>
                                <td>${row.Keluar}</td>
                                <td>${row.Saldo}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;

            // 3. Combine and wrap in full HTML for Excel
            const sheetName = `Kartu Stok ${product.name.replace(/ /g, '_')}`;
            const fullHTML = `
                <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
                <head>
                    <!--[if gte mso 9]>
                    <xml>
                        <x:ExcelWorkbook>
                            <x:ExcelWorksheets>
                                <x:ExcelWorksheet>
                                    <x:Name>${sheetName}</x:Name>
                                    <x:WorksheetOptions>
                                        <x:DisplayGridlines/>
                                    </x:WorksheetOptions>
                                </x:ExcelWorksheet>
                            </x:ExcelWorksheets>
                        </x:ExcelWorkbook>
                    </xml>
                    <![endif]-->
                    <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
                    <style>
                        table, th, td { border: 1px solid black; border-collapse: collapse; }
                        th, td { padding: 5px; }
                        h2 { font-size: 14pt; }
                    </style>
                </head>
                <body>
                    ${productDetailsHTML}
                    ${movementsTableHTML}
                </body>
                </html>
            `;

            // 4. Trigger download
            const filename = `kartu-stok-${product.code}-${new Date().toISOString().split('T')[0]}.xls`;
            const dataType = 'application/vnd.ms-excel';
            const base64 = (s: string) => window.btoa(unescape(encodeURIComponent(s)));
            
            const a = document.createElement('a');
            a.href = `data:${dataType};base64,${base64(fullHTML)}`;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            alert(`Kartu stok untuk ${product.name} berhasil diekspor!`);
        };


        // --- GLOBAL ASSIGNMENTS ---
        win.showSection = showSection; win.toggleMobileMenu = toggleMobileMenu;
        win.showAddProductModal = showAddProductModal; win.exportData = exportData;
        win.filterOrders = filterOrders; win.showCreateOrderModal = showCreateOrderModal;
        win.filterSales = filterSales; win.showCreateSaleModal = showCreateSaleModal;
        win.exportSalesData = exportSalesData; win.showStockInModal = showStockInModal;
        win.showStockOutModal = showStockOutModal; win.exportStockCard = exportStockCard;
        win.addCategory = addCategory;
        win.downloadProductTemplate = downloadProductTemplate;
        win.downloadCategoryTemplate = downloadCategoryTemplate;
        win.downloadStockMovementTemplate = downloadStockMovementTemplate;
        win.downloadOrderTemplate = downloadOrderTemplate;
        win.downloadSaleTemplate = downloadSaleTemplate;
        win.importProductsData = importProductsData; win.saveSettings = saveSettings;
        win.backupData = backupData; win.restoreData = restoreData;
        win.importSalesData = importSalesData;
        win.importStockMovementData = importStockMovementData;
        win.closeModal = closeModal; win.viewProduct = viewProduct;
        win.editProduct = editProduct; win.deleteProduct = deleteProduct;
        win.approveOrder = approveOrder; win.rejectOrder = rejectOrder;
        win.viewOrder = viewOrder; win.deleteOrder = deleteOrder;
        win.selectProductFromSearch = selectProductFromSearch; win.addItemToSale = addItemToSale;
        win.clearSaleItems = clearSaleItems; win.processSale = processSale;
        win.removeItemFromSale = removeItemFromSale; win.viewSale = viewSale;
        win.printReceipt = printReceipt; win.printSaleReceipt = printSaleReceipt;
        win.confirmIndentPayment = confirmIndentPayment; win.deleteSale = deleteSale;
        win.deleteCategory = deleteCategory; win.showPaymentModal = showPaymentModal;
        win.editSale = editSale; win.applyDashboardFilter = applyDashboardFilter;
        win.resetDashboardFilter = resetDashboardFilter;
        win.onPageChange = {}; // Setup pagination handler object

        // --- ONLINE/OFFLINE LISTENERS ---
        window.addEventListener('online', () => { isOnline = true; setStatusIndicator('online', 'Connection restored.'); processSyncQueue(); });
        window.addEventListener('offline', () => { isOnline = false; setStatusIndicator('offline', 'Connection lost. You are now offline.'); });
        
        initializeApp();

        return () => {
            supabase.removeAllChannels();
        };

    }, []);

    return (
        <div dangerouslySetInnerHTML={{ __html: htmlBody }} />
    );
};

export default App;

declare global {
    interface Window {
        onPageChange: { [key: string]: (page: number) => void };
        supabase: any; // Add Supabase to window type
        currentReceiptSale?: any;
    }
    // Add import.meta.env for Vite
    interface ImportMeta {
        readonly env: {
            [key: string]: string;
            VITE_SUPABASE_URL: string;
            VITE_SUPABASE_ANON_KEY: string;
        };
    }
}