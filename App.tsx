
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
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <!-- App Settings -->
                <div class="bg-white rounded-xl card-shadow p-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-4">Pengaturan Aplikasi</h3>
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
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Import Database Produk</label>
                            <input type="file" id="import-file" accept=".json,.csv" 
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <p class="text-xs text-gray-500 mt-1">Format yang didukung: <strong>CSV</strong> atau <strong>JSON</strong>. Gunakan template untuk format kolom yang benar.</p>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <button onclick="downloadTemplate()" class="bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg transition-colors">
                                <i class="fas fa-file-download mr-2"></i>Download Template
                            </button>
                            <button onclick="importDatabase()" class="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors">
                                <i class="fas fa-upload mr-2"></i>Import Data
                            </button>
                            <button onclick="saveSettings()" class="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors">
                                <i class="fas fa-save mr-2"></i>Simpan Pengaturan
                            </button>
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
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-3">
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
        // Data Storage
        let products = safeJSONParse('products', []);
        let categories = safeJSONParse('categories', ["Elektronik", "Makanan", "Minuman", "Pakaian"]);
        let stockMovements = safeJSONParse('stockMovements', []);
        let orders = safeJSONParse('orders', []);
        let sales = safeJSONParse('sales', []);
        let settings = safeJSONParse('settings', {"minStockLimit":10,"currency":"IDR"});
        
        let editingProductId: string | null = null;
        let currentOrderFilter = 'all';
        let filteredSales: any[] = [];
        let editingSaleId: string | null = null;
        // A mock user object since the original script seems to imply its existence for some actions
        const currentUser = { name: 'Admin' }; 

        // Pagination State
        const ITEMS_PER_PAGE = 20;
        let currentPage = {
            products: 1,
            orders: 1,
            sales: 1,
            stockCard: 1
        };

        // Initialize App
        const initializeApp = () => {
            updateDashboard();
            renderProducts();
            renderCategories();
            renderOrders();
            renderSales();
            populateProductSelects();
            loadSettings();
            
            // Event listeners
            (document.getElementById('search-products') as HTMLInputElement).addEventListener('input', () => { currentPage.products = 1; filterProducts(); });
            (document.getElementById('category-filter') as HTMLSelectElement).addEventListener('change', () => { currentPage.products = 1; filterProducts(); });
            (document.getElementById('stock-card-product') as HTMLSelectElement).addEventListener('change', () => { currentPage.stockCard = 1; loadStockCard(); });
            (document.getElementById('stock-card-search') as HTMLInputElement).addEventListener('input', handleStockCardSearch);
            (document.getElementById('sale-product') as HTMLSelectElement).addEventListener('change', updateSaleInfo);
            (document.getElementById('sale-quantity') as HTMLInputElement).addEventListener('input', updateSaleTotal);
            (document.getElementById('sale-product-search') as HTMLInputElement).addEventListener('input', searchSaleProducts);
            (document.getElementById('order-product-search') as HTMLInputElement).addEventListener('input', handleOrderProductSearch);
            
            // Form submissions
            (document.getElementById('product-form') as HTMLFormElement).addEventListener('submit', handleProductSubmit);
            (document.getElementById('stock-in-form') as HTMLFormElement).addEventListener('submit', handleStockIn);
            (document.getElementById('stock-out-form') as HTMLFormElement).addEventListener('submit', handleStockOut);
            (document.getElementById('create-order-form') as HTMLFormElement).addEventListener('submit', handleCreateOrder);
            
            // Set default dates
            setDefaultDates();
            populateDashboardCategoryFilter();
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
            
            // Update nav buttons
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('text-blue-200');
            });
            if (event && event.target) {
                event.target.classList.add('text-blue-200');
            }
            
            // Close mobile menu
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
                    const saleDate = new Date(s.saleDate || s.createdAt).getTime();
                    return saleDate >= start && saleDate <= end;
                });

                const fromStr = new Date(dateFrom).toLocaleDateString('id-ID');
                const toStr = new Date(dateTo).toLocaleDateString('id-ID');
                 (document.getElementById('sales-summary-period') as HTMLElement).textContent = `(${fromStr} - ${toStr})`;

            } else {
                 (document.getElementById('sales-summary-period') as HTMLElement).textContent = '(Semua Waktu)';
            }

            const totalProducts = filteredProducts.length;
            const lowStockProducts = filteredProducts.filter((p: any) => p.currentStock <= settings.minStockLimit).length;
            const stockValue = filteredProducts.reduce((total: number, p: any) => total + (p.currentStock * p.hpp), 0);
            const periodTransactions = filteredMovements.length;

            (document.getElementById('total-products') as HTMLElement).textContent = totalProducts.toString();
            (document.getElementById('low-stock') as HTMLElement).textContent = lowStockProducts.toString();
            (document.getElementById('stock-value') as HTMLElement).textContent = formatCurrency(stockValue);
            (document.getElementById('today-transactions') as HTMLElement).textContent = periodTransactions.toString();

            // Sales by payment method
            const salesCash = filteredSalesData.filter(s => s.paymentMethod === 'cash' && s.status !== 'indent').reduce((sum, s) => sum + s.totalAmount, 0);
            const salesTransfer = filteredSalesData.filter(s => s.paymentMethod === 'transfer' && s.status !== 'indent').reduce((sum, s) => sum + s.totalAmount, 0);
            const salesUnpaid = filteredSalesData.filter(s => s.status === 'unpaid' || s.status === 'indent').reduce((sum, s) => sum + s.totalAmount, 0);

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
                const product = products.find((p: any) => p.id === activity.productId);
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
                const stockStatus = product.currentStock <= settings.minStockLimit ? 
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
                        <td class="px-6 py-4 text-sm text-gray-900">${product.currentStock} ${product.unit}</td>
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

        // Product CRUD Operations
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
            
            (document.getElementById('product-modal-title') as HTMLElement).textContent = 'Edit Produk';
            (document.getElementById('product-code') as HTMLInputElement).value = product.code;
            (document.getElementById('product-name') as HTMLInputElement).value = product.name;
            (document.getElementById('product-category') as HTMLSelectElement).value = product.category;
            (document.getElementById('product-hpp') as HTMLInputElement).value = product.hpp;
            (document.getElementById('product-price') as HTMLInputElement).value = product.price;
            (document.getElementById('product-initial-stock') as HTMLInputElement).value = product.currentStock;
            (document.getElementById('product-unit') as HTMLInputElement).value = product.unit;
            (document.getElementById('product-description') as HTMLTextAreaElement).value = product.description || '';
            
            populateProductCategories();
            showModal('product-modal');
        }

        const viewProduct = (productId: string) => {
            const product = products.find((p: any) => p.id === productId);
            alert(`Detail Produk:\n\nKode: ${product.code}\nNama: ${product.name}\nKategori: ${product.category}\nHPP: ${formatCurrency(product.hpp)}\nHarga Jual: ${formatCurrency(product.price)}\nStok: ${product.currentStock} ${product.unit}\nDeskripsi: ${product.description || 'Tidak ada deskripsi'}`);
        }

        const deleteProduct = (productId: string) => {
            if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
                products = products.filter((p: any) => p.id !== productId);
                stockMovements = stockMovements.filter((m: any) => m.productId !== productId);
                saveData();
                renderProducts();
                updateDashboard();
                populateProductSelects();
                alert('Produk berhasil dihapus!');
            }
        }

        const handleProductSubmit = (e: Event) => {
            e.preventDefault();
            
            const productData = {
                code: (document.getElementById('product-code') as HTMLInputElement).value,
                name: (document.getElementById('product-name') as HTMLInputElement).value,
                category: (document.getElementById('product-category') as HTMLSelectElement).value,
                hpp: parseFloat((document.getElementById('product-hpp') as HTMLInputElement).value),
                price: parseFloat((document.getElementById('product-price') as HTMLInputElement).value),
                currentStock: parseInt((document.getElementById('product-initial-stock') as HTMLInputElement).value),
                unit: (document.getElementById('product-unit') as HTMLInputElement).value,
                description: (document.getElementById('product-description') as HTMLTextAreaElement).value
            };

            if (editingProductId) {
                // Update existing product
                const productIndex = products.findIndex((p: any) => p.id === editingProductId);
                const oldProduct = { ...products[productIndex] };
                
                // Update product data while preserving id and createdAt
                products[productIndex] = { 
                    ...oldProduct,
                    ...productData,
                    updatedAt: new Date().toISOString()
                };
                
                // Check if stock changed and add movement record
                const stockDifference = productData.currentStock - oldProduct.currentStock;
                if (stockDifference !== 0) {
                    const movement = {
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        productId: editingProductId,
                        type: stockDifference > 0 ? 'in' : 'out',
                        quantity: Math.abs(stockDifference),
                        date: new Date().toISOString(),
                        note: `Edit produk - ${stockDifference > 0 ? 'penambahan' : 'pengurangan'} stok`
                    };
                    stockMovements.push(movement);
                }
                
                alert('Produk berhasil diperbarui!');
            } else {
                // Add new product
                const newProduct = {
                    id: Date.now().toString(),
                    ...productData,
                    createdAt: new Date().toISOString()
                };
                products.push(newProduct);
                
                // Add initial stock movement
                if (newProduct.currentStock > 0) {
                    stockMovements.push({
                        id: Date.now().toString(),
                        productId: newProduct.id,
                        type: 'in',
                        quantity: newProduct.currentStock,
                        date: new Date().toISOString(),
                        note: 'Stok awal'
                    });
                }
                alert('Produk berhasil ditambahkan!');
            }

            saveData();
            closeModal('product-modal');
            renderProducts();
            updateDashboard();
            populateProductSelects();
            populateOrderProductSelects();
            populateSaleProductSelects();
            loadStockCard(); // Refresh stock card if currently viewing
        }

        // Stock Movement Functions
        const showStockInModal = () => {
            const selectedProductId = (document.getElementById('stock-card-product') as HTMLSelectElement).value;
            (document.getElementById('stock-in-form') as HTMLFormElement).reset();
            // Set default date to current date and time
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            (document.getElementById('stock-in-date') as HTMLInputElement).value = now.toISOString().slice(0, 16);
            populateStockProductSelects();
            // Pre-select product if one is selected in stock card
            if (selectedProductId) {
                (document.getElementById('stock-in-product') as HTMLSelectElement).value = selectedProductId;
            }
            showModal('stock-in-modal');
        }

        const showStockOutModal = () => {
            const selectedProductId = (document.getElementById('stock-card-product') as HTMLSelectElement).value;
            (document.getElementById('stock-out-form') as HTMLFormElement).reset();
            // Set default date to current date and time
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            (document.getElementById('stock-out-date') as HTMLInputElement).value = now.toISOString().slice(0, 16);
            populateStockProductSelects();
            // Pre-select product if one is selected in stock card
            if (selectedProductId) {
                (document.getElementById('stock-out-product') as HTMLSelectElement).value = selectedProductId;
            }
            showModal('stock-out-modal');
        }

        const handleStockIn = (e: Event) => {
            e.preventDefault();
            
            const productId = (document.getElementById('stock-in-product') as HTMLSelectElement).value;
            const quantity = parseInt((document.getElementById('stock-in-quantity') as HTMLInputElement).value);
            const date = (document.getElementById('stock-in-date') as HTMLInputElement).value;
            const note = (document.getElementById('stock-in-note') as HTMLInputElement).value;

            const product = products.find((p: any) => p.id === productId);
            product.currentStock += quantity;

            const movement = {
                id: Date.now().toString(),
                productId: productId,
                type: 'in',
                quantity: quantity,
                date: date ? new Date(date).toISOString() : new Date().toISOString(),
                note: note || 'Stok masuk'
            };

            stockMovements.push(movement);
            saveData();
            closeModal('stock-in-modal');
            renderProducts();
            updateDashboard();
            loadStockCard();
            alert('Stok berhasil ditambahkan!');
        }

        const handleStockOut = (e: Event) => {
            e.preventDefault();
            
            const productId = (document.getElementById('stock-out-product') as HTMLSelectElement).value;
            const quantity = parseInt((document.getElementById('stock-out-quantity') as HTMLInputElement).value);
            const date = (document.getElementById('stock-out-date') as HTMLInputElement).value;
            const note = (document.getElementById('stock-out-note') as HTMLInputElement).value;

            const product = products.find((p: any) => p.id === productId);
            
            if (product.currentStock < quantity) {
                alert('Stok tidak mencukupi!');
                return;
            }

            product.currentStock -= quantity;

            const movement = {
                id: Date.now().toString(),
                productId: productId,
                type: 'out',
                quantity: quantity,
                date: date ? new Date(date).toISOString() : new Date().toISOString(),
                note: note || 'Stok keluar'
            };

            stockMovements.push(movement);
            saveData();
            closeModal('stock-out-modal');
            renderProducts();
            updateDashboard();
            loadStockCard();
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
                if (productInfoDiv) {
                    productInfoDiv.classList.add('hidden');
                }
                return;
            }

            // Show product information
            if (productInfoDiv) {
                const profitMargin = product.price > 0 ? ((product.price - product.hpp) / product.price * 100).toFixed(2) : 0;
                const currentStockValue = product.currentStock * product.hpp;
                const potentialRevenue = product.currentStock * product.price;
                
                productInfoDiv.innerHTML = `
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <div class="text-sm text-blue-600 font-medium">HPP (Harga Beli)</div>
                            <div class="text-lg font-bold text-blue-800">${formatCurrency(product.hpp)}</div>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg">
                            <div class="text-sm text-green-600 font-medium">Harga Jual</div>
                            <div class="text-lg font-bold text-green-800">${formatCurrency(product.price)}</div>
                        </div>
                        <div class="bg-purple-50 p-4 rounded-lg">
                            <div class="text-sm text-purple-600 font-medium">Margin Keuntungan</div>
                            <div class="text-lg font-bold text-purple-800">${profitMargin}%</div>
                        </div>
                        <div class="bg-orange-50 p-4 rounded-lg">
                            <div class="text-sm text-orange-600 font-medium">Stok Saat Ini</div>
                            <div class="text-lg font-bold text-orange-800">${product.currentStock} ${product.unit}</div>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <div class="text-sm text-gray-600 font-medium">Nilai Stok Saat Ini (HPP)</div>
                            <div class="text-xl font-bold text-gray-800">${formatCurrency(currentStockValue)}</div>
                        </div>
                        <div class="bg-yellow-50 p-4 rounded-lg">
                            <div class="text-sm text-yellow-600 font-medium">Potensi Pendapatan</div>
                            <div class="text-xl font-bold text-yellow-800">${formatCurrency(potentialRevenue)}</div>
                        </div>
                    </div>
                `;
                productInfoDiv.classList.remove('hidden');
            }

            const movements = stockMovements
                .filter((m: any) => m.productId === productId)
                .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort descending for latest first

            const paginatedMovements = paginate(movements, currentPage.stockCard, ITEMS_PER_PAGE);

            if (paginatedMovements.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-gray-500">Belum ada pergerakan stok untuk produk ini</td></tr>';
                renderPagination('stock-card-pagination', currentPage.stockCard, movements.length, ITEMS_PER_PAGE, changeStockCardPage);
                return;
            }
            
            const lastPage = Math.ceil(movements.length / ITEMS_PER_PAGE);
            const startingIndex = (lastPage - currentPage.stockCard) * ITEMS_PER_PAGE;
            
            let runningBalance = movements.slice(startingIndex + paginatedMovements.length).reduce((balance, movement) => {
                 return movement.type === 'in' ? balance - movement.quantity : balance + movement.quantity;
            }, product.currentStock);

            tbody.innerHTML = paginatedMovements.map((movement: any) => {
                const currentBalance = runningBalance;
                 if (movement.type === 'in') {
                    runningBalance -= movement.quantity;
                } else {
                    runningBalance += movement.quantity;
                }
                // Calculate stock value based on current balance
                const stockValue = currentBalance * product.hpp;
                const dateInfo = formatDate(movement.date);
                const timeAgo = getTimeAgo(movement.date);
                
                return `
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 text-sm text-gray-900">
                            <div>${dateInfo}</div>
                            <div class="text-xs text-gray-500">${timeAgo}</div>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-900">${movement.note}</td>
                        <td class="px-6 py-4 text-sm text-green-600">${movement.type === 'in' ? movement.quantity : '-'}</td>
                        <td class="px-6 py-4 text-sm text-red-600">${movement.type === 'out' ? movement.quantity : '-'}</td>
                        <td class="px-6 py-4 text-sm font-medium text-gray-900">${currentBalance} ${product.unit}</td>
                        <td class="px-6 py-4 text-sm font-medium text-blue-600">${formatCurrency(stockValue)}</td>
                    </tr>
                `;
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
                    <button onclick="deleteCategory('${category}')" class="text-red-600 hover:text-red-800">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }

        const addCategory = () => {
            const newCategory = (document.getElementById('new-category') as HTMLInputElement).value.trim();
            if (newCategory && !categories.includes(newCategory)) {
                categories.push(newCategory);
                saveData();
                renderCategories();
                populateProductCategories();
                (document.getElementById('new-category') as HTMLInputElement).value = '';
                alert('Kategori berhasil ditambahkan!');
            } else if (categories.includes(newCategory)) {
                alert('Kategori sudah ada!');
            }
        }

        const deleteCategory = (category: string) => {
            if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
                categories = categories.filter((c: string) => c !== category);
                saveData();
                renderCategories();
                populateProductCategories();
                alert('Kategori berhasil dihapus!');
            }
        }

        const loadSettings = () => {
            (document.getElementById('min-stock-limit') as HTMLInputElement).value = settings.minStockLimit;
            (document.getElementById('currency') as HTMLSelectElement).value = settings.currency;
            (document.getElementById('store-name') as HTMLInputElement).value = settings.storeName || 'Minimart An Nahl';
            (document.getElementById('store-address') as HTMLTextAreaElement).value = settings.storeAddress || 'Jl. Pramuka No. 1, Jakarta';
            (document.getElementById('store-phone') as HTMLInputElement).value = settings.storePhone || '021-12345678';
            (document.getElementById('store-email') as HTMLInputElement).value = settings.storeEmail || 'info@minimart.com';
        }

        const saveSettings = () => {
            settings.minStockLimit = parseInt((document.getElementById('min-stock-limit') as HTMLInputElement).value);
            settings.currency = (document.getElementById('currency') as HTMLSelectElement).value;
            settings.storeName = (document.getElementById('store-name') as HTMLInputElement).value;
            settings.storeAddress = (document.getElementById('store-address') as HTMLTextAreaElement).value;
            settings.storePhone = (document.getElementById('store-phone') as HTMLInputElement).value;
            settings.storeEmail = (document.getElementById('store-email') as HTMLInputElement).value;
            saveData();
            updateDashboard();
            renderProducts();
            alert('Pengaturan berhasil disimpan!');
        }

        // Utility Functions
        const populateProductCategories = () => {
            const select = (document.getElementById('product-category') as HTMLSelectElement);
            select.innerHTML = '<option value="">Pilih kategori</option>' +
                categories.map((cat: string) => `<option value="${cat}">${cat}</option>`).join('');
        }

        const populateProductSelects = () => {
            // This function is called when product data is globally updated.
            // It should refresh the stock card select according to its current filter.
            handleStockCardSearch();
        }

        const populateStockProductSelects = () => {
            const selects = ['stock-in-product', 'stock-out-product'];
            selects.forEach(selectId => {
                const select = (document.getElementById(selectId) as HTMLSelectElement);
                select.innerHTML = '<option value="">Pilih produk</option>' +
                    products.map((p: any) => `<option value="${p.id}">${p.name} (${p.code}) - Stok: ${p.currentStock}</option>`).join('');
            });
        }

        const setDefaultDates = () => {
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            const dateString = now.toISOString().slice(0, 10);
            
            // Set default dates for sales filter
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
        }

        const formatCurrency = (amount: number) => {
            const currency = settings.currency === 'USD' ? '$' : 'Rp ';
            return currency + amount.toLocaleString('id-ID');
        }

        const formatDate = (dateString: string) => {
            return new Date(dateString).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        const formatDateForExport = (dateString: string) => {
            if (!dateString) return '';
            return new Date(dateString).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }

        const getTimeAgo = (dateString: string) => {
            const now = new Date();
            const date = new Date(dateString);
            const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
            
            if (diffInSeconds < 60) {
                return 'Baru saja';
            } else if (diffInSeconds < 3600) {
                const minutes = Math.floor(diffInSeconds / 60);
                return `${minutes} menit yang lalu`;
            } else if (diffInSeconds < 86400) {
                const hours = Math.floor(diffInSeconds / 3600);
                return `${hours} jam yang lalu`;
            } else if (diffInSeconds < 2592000) {
                const days = Math.floor(diffInSeconds / 86400);
                return `${days} hari yang lalu`;
            } else {
                const months = Math.floor(diffInSeconds / 2592000);
                return `${months} bulan yang lalu`;
            }
        }

        const exportData = () => {
            if (products.length === 0) {
                alert('Tidak ada data produk untuk diekspor!');
                return;
            }
            const exportData: any[] = [];
            
            exportData.push({ 'Kode Produk': '=== LAPORAN DATA PRODUK STOKPRO ===' });
            
            products.forEach((product: any) => {
                const stockValue = product.currentStock * product.hpp;
                const potentialRevenue = product.currentStock * product.price;
                const profitMargin = product.price > 0 ? ((product.price - product.hpp) / product.price * 100).toFixed(2) : 0;
                let stockStatus = 'NORMAL';
                if (product.currentStock === 0) {
                    stockStatus = 'HABIS';
                } else if (product.currentStock <= settings.minStockLimit) {
                    stockStatus = 'RENDAH';
                }

                exportData.push({
                    'Kode Produk': product.code,
                    'Nama Produk': product.name,
                    'Kategori': product.category,
                    'HPP': product.hpp,
                    'Harga Jual': product.price,
                    'Stok Saat Ini': product.currentStock,
                    'Satuan': product.unit,
                    'Nilai Stok': stockValue,
                    'Potensi Pendapatan': potentialRevenue,
                    'Margin Keuntungan (%)': profitMargin,
                    'Status Stok': stockStatus,
                    'Deskripsi': product.description || ''
                });
            });

            createExcelFileXLS(exportData, `laporan-produk-${new Date().toISOString().split('T')[0]}.xls`, 'Laporan Produk');
            alert('Laporan produk berhasil diekspor!');
        }

        // Order Management Functions
        const renderOrders = () => {
            const tbody = (document.getElementById('orders-table') as HTMLElement);
            let filteredOrders = orders;
            
            if (currentOrderFilter !== 'all') {
                filteredOrders = orders.filter((order: any) => order.status === currentOrderFilter);
            }
            
            const sortedOrders = filteredOrders.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            const paginatedOrders = paginate(sortedOrders, currentPage.orders, ITEMS_PER_PAGE);

            if (paginatedOrders.length === 0) {
                const message = currentOrderFilter === 'all' ? 
                    'Belum ada order. Klik "Buat Order" untuk memulai.' :
                    `Tidak ada order dengan status ${getStatusText(currentOrderFilter)}.`;
                tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-8 text-center text-gray-500">${message}</td></tr>`;
                renderPagination('orders-pagination', currentPage.orders, sortedOrders.length, ITEMS_PER_PAGE, changeOrdersPage);
                return;
            }

            tbody.innerHTML = paginatedOrders.map((order: any) => {
                const product = products.find((p: any) => p.id === order.productId);
                const productName = product ? product.name : 'Produk tidak ditemukan';
                const statusBadge = getStatusBadge(order.status);

                return `
                    <tr class="hover:bg-gray-50">
                        <td class="px-6 py-4 text-sm font-medium text-gray-900">${order.orderNumber}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">${formatDate(order.createdAt)}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">${productName}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">${order.quantity} ${product?.unit || ''}</td>
                        <td class="px-6 py-4">${statusBadge}</td>
                        <td class="px-6 py-4 text-sm font-medium">
                            <div class="flex space-x-2">
                                <button onclick="viewOrder('${order.id}')" class="text-blue-600 hover:text-blue-900" title="Lihat Detail">
                                    <i class="fas fa-eye"></i>
                                </button>
                                ${order.status === 'pending' ? `
                                    <button onclick="approveOrder('${order.id}')" class="text-green-600 hover:text-green-900" title="Setujui Order">
                                        <i class="fas fa-check"></i>
                                    </button>
                                    <button onclick="rejectOrder('${order.id}')" class="text-red-600 hover:text-red-900" title="Tolak Order">
                                        <i class="fas fa-times"></i>
                                    </button>
                                ` : ''}
                                <button onclick="deleteOrder('${order.id}')" class="text-red-600 hover:text-red-900" title="Hapus Order">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
            renderPagination('orders-pagination', currentPage.orders, sortedOrders.length, ITEMS_PER_PAGE, changeOrdersPage);
        }

        const changeOrdersPage = (page: number) => {
            currentPage.orders = page;
            renderOrders();
        }

        const filterOrders = (status: string, event: any) => {
            currentOrderFilter = status;
            currentPage.orders = 1;
            
            // Update tab appearance
            document.querySelectorAll('.order-tab-btn').forEach(btn => {
                btn.classList.remove('border-blue-500', 'text-blue-600');
                btn.classList.add('border-transparent', 'text-gray-500');
            });
            event.target.classList.remove('border-transparent', 'text-gray-500');
            event.target.classList.add('border-blue-500', 'text-blue-600');
            
            renderOrders();
        }

        const showCreateOrderModal = () => {
            (document.getElementById('create-order-form') as HTMLFormElement).reset();
            populateOrderProductSelects();
            showModal('create-order-modal');
        }

        const handleCreateOrder = (e: Event) => {
            e.preventDefault();
            
            const productId = (document.getElementById('order-product') as HTMLSelectElement).value;
            const quantity = parseInt((document.getElementById('order-quantity') as HTMLInputElement).value);
            const note = (document.getElementById('order-note') as HTMLTextAreaElement).value;

            const newOrder = {
                id: Date.now().toString(),
                orderNumber: 'ORD-' + Date.now().toString().slice(-6),
                productId: productId,
                quantity: quantity,
                note: note,
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            orders.push(newOrder);
            saveData();
            closeModal('create-order-modal');
            renderOrders();
            alert('Order berhasil dibuat dan menunggu approval!');
        }

        const viewOrder = (orderId: string) => {
            const order = orders.find((o: any) => o.id === orderId);
            const product = products.find((p: any) => p.id === order.productId);
            
            const content = (document.getElementById('order-detail-content') as HTMLElement);
            content.innerHTML = `
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="font-medium text-gray-700">No. Order:</span>
                        <span class="text-gray-900">${order.orderNumber}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-medium text-gray-700">Tanggal:</span>
                        <span class="text-gray-900">${formatDate(order.createdAt)}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-medium text-gray-700">Produk:</span>
                        <span class="text-gray-900">${product ? product.name : 'Produk tidak ditemukan'}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-medium text-gray-700">Jumlah:</span>
                        <span class="text-gray-900">${order.quantity} ${product?.unit || ''}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="font-medium text-gray-700">Status:</span>
                        <span>${getStatusBadge(order.status)}</span>
                    </div>
                    ${order.approvedAt ? `
                        <div class="flex justify-between">
                            <span class="font-medium text-gray-700">Tanggal Approval:</span>
                            <span class="text-gray-900">${formatDate(order.approvedAt)}</span>
                        </div>
                    ` : ''}
                    ${order.note ? `
                        <div>
                            <span class="font-medium text-gray-700">Keterangan:</span>
                            <p class="text-gray-900 mt-1">${order.note}</p>
                        </div>
                    ` : ''}
                </div>
            `;

            const actions = (document.getElementById('order-actions') as HTMLElement);
            if (order.status === 'pending') {
                actions.innerHTML = `
                    <button onclick="approveOrder('${order.id}'); closeModal('order-detail-modal');" 
                            class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors">
                        <i class="fas fa-check mr-2"></i>Setujui
                    </button>
                    <button onclick="rejectOrder('${order.id}'); closeModal('order-detail-modal');" 
                            class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors">
                        <i class="fas fa-times mr-2"></i>Tolak
                    </button>
                `;
            } else {
                actions.innerHTML = `
                    <button onclick="closeModal('order-detail-modal')" 
                            class="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors">
                        Tutup
                    </button>
                `;
            }

            showModal('order-detail-modal');
        }

        const approveOrder = (orderId: string) => {
            const approvalDate = prompt('Masukkan tanggal approval (YYYY-MM-DD HH:MM) atau kosongkan untuk tanggal sekarang:');
            let approvalDateTime;
            
            if (approvalDate && approvalDate.trim()) {
                try {
                    approvalDateTime = new Date(approvalDate).toISOString();
                } catch (error) {
                    alert('Format tanggal tidak valid. Menggunakan tanggal sekarang.');
                    approvalDateTime = new Date().toISOString();
                }
            } else {
                approvalDateTime = new Date().toISOString();
            }
            
            const order = orders.find((o: any) => o.id === orderId);
            order.status = 'approved';
            order.updatedAt = approvalDateTime;
            order.approvedAt = approvalDateTime;
            order.approvedBy = currentUser.name;
            
            // Automatically add stock when order is approved
            const product = products.find((p: any) => p.id === order.productId);
            product.currentStock += order.quantity;
            
            // Add stock movement record with approval date
            const movement = {
                id: Date.now().toString(),
                productId: order.productId,
                type: 'in',
                quantity: order.quantity,
                date: approvalDateTime,
                note: `Order disetujui oleh ${currentUser.name} - ${order.orderNumber}`
            };
            stockMovements.push(movement);
            
            saveData();
            renderOrders();
            renderProducts();
            updateDashboard();
            loadStockCard(); // Refresh stock card if viewing
            alert('Order berhasil disetujui dan stok telah ditambahkan!');
        }

        const rejectOrder = (orderId: string) => {
            const order = orders.find((o: any) => o.id === orderId);
            order.status = 'rejected';
            order.updatedAt = new Date().toISOString();
            order.rejectedBy = currentUser.name;
            
            saveData();
            renderOrders();
            alert('Order telah ditolak.');
        }

        const getStatusBadge = (status: string) => {
            const badges: { [key: string]: string } = {
                pending: '<span class="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">Menunggu Approval</span>',
                approved: '<span class="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Disetujui</span>',
                rejected: '<span class="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Ditolak</span>'
            };
            return badges[status] || status;
        }

        const getStatusText = (status: string) => {
            const texts: { [key: string]: string } = {
                pending: 'Menunggu Approval',
                approved: 'Disetujui',
                rejected: 'Ditolak'
            };
            return texts[status] || status;
        }

        const deleteOrder = (orderId: string) => {
            const order = orders.find((o: any) => o.id === orderId);
            if (!order) {
                alert('Order tidak ditemukan!');
                return;
            }

            const product = products.find((p: any) => p.id === order.productId);
            const productName = product ? product.name : 'Produk tidak ditemukan';
            
            const confirmDelete = confirm(`Hapus order ${order.orderNumber}?\n\nProduk: ${productName}\nJumlah: ${order.quantity} ${product?.unit || ''}\nStatus: ${getStatusText(order.status)}\n\nPerhatian: Jika order sudah disetujui, stok akan dikurangi kembali.`);
            
            if (!confirmDelete) {
                return;
            }

            // If order was approved, reduce the stock back
            if (order.status === 'approved') {
                const product = products.find((p: any) => p.id === order.productId);
                if (product) {
                    product.currentStock -= order.quantity;

                    // Add stock movement record for reduction
                    const movement = {
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        productId: order.productId,
                        type: 'out',
                        quantity: order.quantity,
                        date: new Date().toISOString(),
                        note: `Pengurangan stok - Hapus order ${order.orderNumber}`
                    };
                    stockMovements.push(movement);
                }
            }

            // Remove related stock movements
            stockMovements = stockMovements.filter((movement: any) => 
                !movement.note.includes(order.orderNumber)
            );

            // Remove order
            orders = orders.filter((o: any) => o.id !== orderId);

            saveData();
            renderOrders();
            renderProducts();
            updateDashboard();
            loadStockCard();
            populateOrderProductSelects();

            alert('Order berhasil dihapus!');
        }

        const populateOrderProductSelects = (filteredList?: any[]) => {
            const select = (document.getElementById('order-product') as HTMLSelectElement);
            const productList = filteredList || products;
            select.innerHTML = '<option value="">Pilih produk</option>' +
                productList.map((p: any) => `<option value="${p.id}">${p.name} (${p.code}) - Stok: ${p.currentStock}</option>`).join('');
        }

        // Excel Utility Functions
        const createExcelFileXLS = (data: any[], filename: string, sheetName = 'Sheet1') => {
            if (data.length === 0) {
                alert('Tidak ada data untuk diekspor!');
                return;
            }

            const headers = Object.keys(data[0]);
            
            let htmlContent = `
                <html xmlns:o="urn:schemas-microsoft-com:office:office" 
                      xmlns:x="urn:schemas-microsoft-com:office:excel" 
                      xmlns="http://www.w3.org/TR/REC-html40">
                <head>
                    <meta charset="utf-8">
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
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
                    <style>
                        table { border-collapse: collapse; width: 100%; }
                        th { background-color: #f2f2f2; font-weight: bold; border: 1px solid #ddd; padding: 8px; text-align: left; }
                        td { border: 1px solid #ddd; padding: 8px; }
                        .number { text-align: right; }
                        .currency { text-align: right; }
                    </style>
                </head>
                <body>
                    <table>
                        <thead>
                            <tr>`;
            
            headers.forEach(header => {
                htmlContent += `<th>${header}</th>`;
            });
            htmlContent += `</tr></thead><tbody>`;
            
            data.forEach(row => {
                htmlContent += '<tr>';
                headers.forEach(header => {
                    let value = row[header];
                    let cellClass = '';
                    
                    if (value === null || value === undefined) {
                        value = '';
                    } else if (typeof value === 'number') {
                        cellClass = 'number';
                    }
                    
                    if (typeof value === 'string') {
                        value = value.replace(/&/g, '&amp;')
                                   .replace(/</g, '&lt;')
                                   .replace(/>/g, '&gt;')
                                   .replace(/"/g, '&quot;');
                    }
                    
                    htmlContent += `<td class="${cellClass}">${value}</td>`;
                });
                htmlContent += '</tr>';
            });
            
            htmlContent += `</tbody></table></body></html>`;

            const blob = new Blob([htmlContent], { 
                type: 'application/vnd.ms-excel;charset=utf-8' 
            });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            const xlsFilename = filename.replace(/\.(xlsx|csv)$/i, '.xls');
            
            link.setAttribute('href', url);
            link.setAttribute('download', xlsFilename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
        
        // Import Database Function
        const importDatabase = () => {
            const fileInput = (document.getElementById('import-file') as HTMLInputElement);
            const file = fileInput.files ? fileInput.files[0] : null;
            if (!file) {
                alert('Pilih file untuk diimport!');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const content = e.target?.result as string;
                    let rawData: any[] = [];
                    
                    if (file.name.endsWith('.json')) {
                        rawData = JSON.parse(content);
                        if (!Array.isArray(rawData)) throw new Error('File JSON harus berisi array produk.');
                    } else if (file.name.endsWith('.csv')) {
                        rawData = parseCSV(content);
                    } else {
                        throw new Error('Format file tidak didukung. Gunakan .csv atau .json.');
                    }

                    if (rawData.length === 0) {
                        alert('Tidak ada produk yang ditemukan dalam file.');
                        return;
                    }
                    
                    let importedCount = 0;
                    let skippedCount = 0;
                    const existingCodes = new Set(products.map(p => p.code));

                    rawData.forEach(p => {
                        const productCode = p['Kode Produk'] || p.code;
                        const productName = p['Nama Produk'] || p.name;
                        
                        if (!productCode || !productName) {
                            console.warn('Skipping invalid product data:', p);
                            return;
                        }
                        
                        if (existingCodes.has(productCode)) {
                            skippedCount++;
                        } else {
                            const newProduct = {
                                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                                code: productCode,
                                name: productName,
                                category: p['Kategori'] || p.category || 'Lainnya',
                                hpp: parseFloat(p['HPP'] || p.hpp || 0),
                                price: parseFloat(p['Harga Jual'] || p.price || 0),
                                currentStock: parseInt(p['Stok'] || p.currentStock || 0),
                                unit: p['Satuan'] || p.unit || 'pcs',
                                description: p['Deskripsi'] || p.description || '',
                                createdAt: new Date().toISOString()
                            };

                            products.push(newProduct);
                            if (newProduct.currentStock > 0) {
                                stockMovements.push({
                                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                                    productId: newProduct.id,
                                    type: 'in',
                                    quantity: newProduct.currentStock,
                                    date: new Date().toISOString(),
                                    note: 'Stok awal dari import'
                                });
                            }
                            importedCount++;
                            existingCodes.add(newProduct.code);
                        }
                    });

                    saveData();
                    initializeApp();
                    alert(`Import berhasil!\n\nProduk baru ditambahkan: ${importedCount}\nProduk duplikat dilewati: ${skippedCount}`);
                    
                } catch (error: any) {
                    alert('Error saat import data: ' + error.message);
                } finally {
                    fileInput.value = ''; // Reset file input
                }
            };
            reader.readAsText(file);
        }

        function parseCSV(csvText: string) {
            const lines = csvText.replace(/\r/g, '').split('\n').filter(line => line.trim() !== '');
            if (lines.length < 2) {
                throw new Error('File CSV tidak valid atau kosong. Pastikan ada header dan setidaknya satu baris data.');
            }
            
            const headers = lines[0].split(',').map(h => h.trim());
            const data = [];

            for (let i = 1; i < lines.length; i++) {
                // Regex to handle quoted fields with commas
                const values = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
                if (values.length > 0) {
                    const item: { [key: string]: string } = {};
                    headers.forEach((header, index) => {
                        if (index < values.length) {
                            let value = values[index].trim();
                            if (value.startsWith('"') && value.endsWith('"')) {
                                // Unescape double quotes and remove outer quotes
                                value = value.substring(1, value.length - 1).replace(/""/g, '"');
                            }
                            item[header] = value;
                        } else {
                            item[header] = ''; // Handle empty trailing columns
                        }
                    });
                    data.push(item);
                }
            }
            return data;
        }

        const saveData = () => {
            localStorage.setItem('products', JSON.stringify(products));
            localStorage.setItem('categories', JSON.stringify(categories));
            localStorage.setItem('stockMovements', JSON.stringify(stockMovements));
            localStorage.setItem('orders', JSON.stringify(orders));
            localStorage.setItem('sales', JSON.stringify(sales));
            localStorage.setItem('settings', JSON.stringify(settings));
        }

        // Global variables for sale management
        let currentSaleItems: any[] = [];
        let currentSaleType = 'normal'; // 'normal' or 'indent'

        // Sales Management Functions
        const renderSales = () => {
            filterSales();
        }

        const updateSalesTable = () => {
            const tbody = (document.getElementById('sales-table') as HTMLElement);

            const paginatedSales = paginate(filteredSales, currentPage.sales, ITEMS_PER_PAGE);
            
            if (paginatedSales.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" class="px-6 py-8 text-center text-gray-500">Belum ada transaksi penjualan. Klik "Transaksi Baru" untuk memulai.</td></tr>';
                renderPagination('sales-pagination', currentPage.sales, filteredSales.length, ITEMS_PER_PAGE, changeSalesPage);
                return;
            }

            tbody.innerHTML = paginatedSales.map(sale => {
                const itemsCount = sale.items ? sale.items.length : 1;
                const itemsText = sale.items ? `${itemsCount} item${itemsCount > 1 ? 's' : ''}` : 'Legacy';
                const paymentMethod = sale.paymentMethod === 'cash' ? 'Cash' : (sale.paymentMethod === 'transfer' ? 'Transfer' : 'Belum Bayar');
                
                let statusBadge = '';
                if (sale.status === 'indent') {
                    statusBadge = '<span class="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800 rounded-full">INDENT</span>';
                } else if (sale.status === 'unpaid') {
                    statusBadge = '<span class="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">Belum Terbayar</span>';
                } else {
                    statusBadge = '<span class="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">SELESAI</span>';
                }

                const rowClass = sale.status === 'indent' ? 'hover:bg-orange-50 bg-orange-25' : 
                                 sale.status === 'unpaid' ? 'hover:bg-yellow-50 bg-yellow-25' : 'hover:bg-gray-50';

                return `
                    <tr class="${rowClass}">
                        <td class="px-6 py-4 text-sm font-medium text-gray-900">${sale.transactionNumber}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">${formatDate(sale.saleDate || sale.createdAt)}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">${sale.customerName}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">${itemsText}</td>
                        <td class="px-6 py-4 text-sm text-gray-900">
                            <span class="px-2 py-1 text-xs font-semibold rounded-full ${sale.paymentMethod === 'cash' ? 'bg-green-100 text-green-800' : (sale.paymentMethod === 'transfer' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800')}">
                                ${paymentMethod}
                            </span>
                        </td>
                        <td class="px-6 py-4">${statusBadge}</td>
                        <td class="px-6 py-4 text-sm font-medium text-green-600">${formatCurrency(sale.totalAmount)}</td>
                        <td class="px-6 py-4 text-sm font-medium">
                            <div class="flex space-x-2">
                                <button onclick="viewSale('${sale.id}')" class="text-blue-600 hover:text-blue-900" title="Lihat Detail">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button onclick="printSaleReceipt('${sale.id}')" class="text-green-600 hover:text-green-900" title="Cetak Ulang Struk">
                                    <i class="fas fa-print"></i>
                                </button>
                                ${sale.status === 'indent' ? `
                                    <button onclick="confirmIndentPayment('${sale.id}')" class="text-purple-600 hover:text-purple-900" title="Konfirmasi Pembayaran">
                                        <i class="fas fa-check-circle"></i>
                                    </button>
                                ` : ''}
                                ${sale.status === 'unpaid' ? `
                                    <button onclick="showPaymentModal('${sale.id}')" class="text-blue-600 hover:text-blue-900" title="Proses Pembayaran">
                                        <i class="fas fa-money-check-alt"></i>
                                    </button>
                                ` : ''}
                                <button onclick="deleteSale('${sale.id}')" class="text-red-600 hover:text-red-900" title="Hapus Transaksi">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
             renderPagination('sales-pagination', currentPage.sales, filteredSales.length, ITEMS_PER_PAGE, changeSalesPage);
        }

        const changeSalesPage = (page: number) => {
            currentPage.sales = page;
            updateSalesTable();
        };

        const updateSalesSummary = () => {
            const totalCount = filteredSales.length;
            const totalAmount = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
            const avgAmount = totalCount > 0 ? totalAmount / totalCount : 0;

            (document.getElementById('total-sales-count') as HTMLElement).textContent = totalCount.toString();
            (document.getElementById('total-sales-amount') as HTMLElement).textContent = formatCurrency(totalAmount);
            (document.getElementById('avg-sales-amount') as HTMLElement).textContent = formatCurrency(avgAmount);
        }

        const filterSales = () => {
            const dateFrom = (document.getElementById('sales-date-from') as HTMLInputElement).value;
            const dateTo = (document.getElementById('sales-date-to') as HTMLInputElement).value;

            filteredSales = sales.filter(sale => {
                const saleDate = new Date(sale.createdAt).toISOString().split('T')[0];
                
                if (dateFrom && saleDate < dateFrom) return false;
                if (dateTo && saleDate > dateTo) return false;
                
                return true;
            }).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            currentPage.sales = 1;
            updateSalesTable();
            updateSalesSummary();
        }

        const showCreateSaleModal = () => {
            editingSaleId = null;
            currentSaleItems = [];
            currentSaleType = 'normal';
            (document.getElementById('sale-customer') as HTMLInputElement).value = '';
            (document.getElementById('sale-product') as HTMLSelectElement).value = '';
            (document.getElementById('sale-quantity') as HTMLInputElement).value = '';
            (document.getElementById('product-info') as HTMLElement).classList.add('hidden');
            
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            (document.getElementById('sale-date') as HTMLInputElement).value = now.toISOString().slice(0, 16);
            
            // Reset modal to create mode
            (document.getElementById('sale-modal-title') as HTMLElement).textContent = 'Transaksi Penjualan';
            (document.getElementById('sale-item-controls') as HTMLElement).style.display = 'block';
            ((document.querySelector('#sale-items-header button') as HTMLElement)!).style.display = 'block';
            const paymentMethodSelect = (document.getElementById('payment-method') as HTMLSelectElement);
            (paymentMethodSelect.querySelector('option[value="unpaid"]') as HTMLOptionElement).hidden = false;
            paymentMethodSelect.value = 'cash';
            (document.getElementById('sale-customer') as HTMLInputElement).readOnly = false;
            updateProcessButton();
            
            populateSaleProductSelects();
            updateSaleItemsTable();
            showModal('create-sale-modal');
        }

        const showPaymentModal = (saleId: string) => {
            const sale = sales.find((s: any) => s.id === saleId);
            if (!sale) {
                alert('Transaksi tidak ditemukan!');
                return;
            }

            editingSaleId = saleId;
            currentSaleItems = [...sale.items];

            (document.getElementById('sale-customer') as HTMLInputElement).value = sale.customerName;
            (document.getElementById('sale-customer') as HTMLInputElement).readOnly = true;

            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            (document.getElementById('sale-date') as HTMLInputElement).value = now.toISOString().slice(0, 16);
            
            // Configure modal for payment
            (document.getElementById('sale-modal-title') as HTMLElement).textContent = 'Proses Pembayaran';
            (document.getElementById('sale-item-controls') as HTMLElement).style.display = 'none';
            ((document.querySelector('#sale-items-header button') as HTMLElement)!).style.display = 'none';
            
            const paymentMethodSelect = (document.getElementById('payment-method') as HTMLSelectElement);
            (paymentMethodSelect.querySelector('option[value="unpaid"]') as HTMLOptionElement).hidden = true;
            paymentMethodSelect.value = 'cash';

            const processBtn = (document.getElementById('process-sale-btn') as HTMLButtonElement);
            processBtn.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Konfirmasi Pembayaran';
            processBtn.className = 'flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors font-medium';

            updateSaleItemsTable();
            showModal('create-sale-modal');
        }

        const populateSaleProductSelects = () => {
            const select = (document.getElementById('sale-product') as HTMLSelectElement);
            select.innerHTML = '<option value="">Pilih produk</option>' +
                products.map((p: any) => {
                    const stockInfo = p.currentStock > 0 ? `Stok: ${p.currentStock}` : 'HABIS';
                    const stockClass = p.currentStock > 0 ? '' : ' (Indent)';
                    return `<option value="${p.id}">${p.name} (${p.code}) - ${stockInfo}${stockClass}</option>`;
                }).join('');
        }

        const updateSaleInfo = () => {
            const productId = (document.getElementById('sale-product') as HTMLSelectElement).value;
            const productInfo = (document.getElementById('product-info') as HTMLElement);
            
            if (!productId) {
                productInfo.classList.add('hidden');
                return;
            }

            const product = products.find((p: any) => p.id === productId);
            if (product) {
                (document.getElementById('available-stock') as HTMLElement).textContent = `${product.currentStock} ${product.unit}`;
                (document.getElementById('product-price-display') as HTMLElement).textContent = formatCurrency(product.price);
                (document.getElementById('sale-quantity') as HTMLInputElement).max = product.currentStock.toString();
                productInfo.classList.remove('hidden');
            }
        }

        const updateSaleTotal = () => {
            const productId = (document.getElementById('sale-product') as HTMLSelectElement).value;
            const quantity = parseInt((document.getElementById('sale-quantity') as HTMLInputElement).value) || 0;
            
            if (!productId || quantity <= 0) {
                return;
            }

        }

        const searchSaleProducts = () => {
            const searchTerm = (document.getElementById('sale-product-search') as HTMLInputElement).value.toLowerCase().trim();
            const resultsContainer = (document.getElementById('product-search-results') as HTMLElement);
            
            if (searchTerm.length < 2) {
                resultsContainer.classList.add('hidden');
                return;
            }

            const filteredProducts = products.filter((product: any) => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.code.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );

            if (filteredProducts.length === 0) {
                resultsContainer.innerHTML = `<div class="p-3 text-center text-gray-500 text-sm">Tidak ada produk yang ditemukan untuk "${searchTerm}"</div>`;
                resultsContainer.classList.remove('hidden');
                return;
            }

            resultsContainer.innerHTML = filteredProducts.map((product: any) => {
                const stockInfo = product.currentStock > 0 ? `<span class="text-green-600">Stok: ${product.currentStock} ${product.unit}</span>` : `<span class="text-orange-600">HABIS (Indent)</span>`;
                const stockClass = product.currentStock > 0 ? 'hover:bg-gray-50' : 'hover:bg-orange-50';
                
                return `
                    <div class="p-3 border-b cursor-pointer ${stockClass}" onclick="selectProductFromSearch('${product.id}')">
                        <div class="flex justify-between items-start">
                            <div class="flex-1">
                                <div class="font-medium text-gray-900">${product.name}</div>
                                <div class="text-sm text-gray-600">${product.code} • ${product.category}</div>
                                <div class="text-sm">${stockInfo}</div>
                            </div>
                            <div class="text-right">
                                <div class="font-medium text-blue-600">${formatCurrency(product.price)}</div>
                                <div class="text-xs text-gray-500">per ${product.unit}</div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            resultsContainer.classList.remove('hidden');
        }

        const selectProductFromSearch = (productId: string) => {
            const product = products.find((p: any) => p.id === productId);
            if (!product) return;
            (document.getElementById('sale-product') as HTMLSelectElement).value = productId;
            (document.getElementById('sale-product-search') as HTMLInputElement).value = '';
            (document.getElementById('product-search-results') as HTMLElement).classList.add('hidden');
            updateSaleInfo();
            (document.getElementById('sale-quantity') as HTMLInputElement).focus();
        }

        const addItemToSale = () => {
            if (editingSaleId) return;
            const productId = (document.getElementById('sale-product') as HTMLSelectElement).value;
            const quantity = parseInt((document.getElementById('sale-quantity') as HTMLInputElement).value);
            
            if (!productId || !quantity || quantity <= 0) {
                alert('Pilih produk dan masukkan jumlah yang valid!');
                return;
            }

            const product = products.find((p: any) => p.id === productId);
            if (!product) {
                alert('Produk tidak ditemukan!');
                return;
            }

            let isIndentItem = false;
            if (product.currentStock < quantity) {
                const confirmIndent = confirm(`Stok ${product.name} tidak mencukupi!\n\nStok tersedia: ${product.currentStock} ${product.unit}\nJumlah diminta: ${quantity} ${product.unit}\n\nApakah Anda ingin melanjutkan sebagai INDENT (pesanan)?`);
                if (!confirmIndent) return;
                isIndentItem = true;
                currentSaleType = 'indent';
            }

            const existingItemIndex = currentSaleItems.findIndex(item => item.productId === productId);
            
            if (existingItemIndex >= 0) {
                const newQuantity = currentSaleItems[existingItemIndex].quantity + quantity;
                if (!isIndentItem && product.currentStock < newQuantity) {
                    const confirmIndentUpdate = confirm(`Total quantity (${newQuantity} ${product.unit}) melebihi stok yang tersedia (${product.currentStock} ${product.unit})!\n\nApakah Anda ingin melanjutkan sebagai INDENT?`);
                    if (!confirmIndentUpdate) return;
                    currentSaleType = 'indent';
                }
                currentSaleItems[existingItemIndex].quantity = newQuantity;
                currentSaleItems[existingItemIndex].totalPrice = newQuantity * product.price;
                currentSaleItems[existingItemIndex].isIndent = isIndentItem || currentSaleItems[existingItemIndex].isIndent;
            } else {
                currentSaleItems.push({
                    productId: productId,
                    productName: product.name,
                    productCode: product.code,
                    category: product.category,
                    unit: product.unit,
                    quantity: quantity,
                    unitPrice: product.price,
                    totalPrice: quantity * product.price,
                    isIndent: isIndentItem
                });
            }

            (document.getElementById('sale-product') as HTMLSelectElement).value = '';
            (document.getElementById('sale-quantity') as HTMLInputElement).value = '';
            (document.getElementById('product-info') as HTMLElement).classList.add('hidden');
            updateSaleItemsTable();
        }

        const removeItemFromSale = (index: number) => {
            if (editingSaleId) return;
            currentSaleItems.splice(index, 1);
            updateSaleItemsTable();
        }

        const updateSaleItemsTable = () => {
            const tbody = (document.getElementById('sale-items-table') as HTMLElement);
            const isPaymentMode = !!editingSaleId;
            
            if (currentSaleItems.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="px-3 py-8 text-center text-gray-500 text-sm">Belum ada produk ditambahkan</td></tr>';
                (document.getElementById('sale-subtotal') as HTMLElement).textContent = 'Rp 0';
                (document.getElementById('sale-grand-total') as HTMLElement).textContent = 'Rp 0';
                if (!isPaymentMode) currentSaleType = 'normal';
                return;
            }

            tbody.innerHTML = currentSaleItems.map((item, index) => {
                const rowClass = item.isIndent ? 'hover:bg-orange-50 bg-orange-25' : 'hover:bg-gray-50';
                const indentBadge = item.isIndent ? '<span class="text-xs bg-orange-100 text-orange-800 px-1 rounded">INDENT</span>' : '';
                return `
                    <tr class="${rowClass}">
                        <td class="px-3 py-2 text-sm">
                            <div class="font-medium">${item.productName}</div>
                            <div class="text-xs text-gray-500">${item.productCode} ${indentBadge}</div>
                        </td>
                        <td class="px-3 py-2 text-sm">${item.quantity} ${item.unit}</td>
                        <td class="px-3 py-2 text-sm">${formatCurrency(item.unitPrice)}</td>
                        <td class="px-3 py-2 text-sm font-medium">${formatCurrency(item.totalPrice)}</td>
                        <td class="px-3 py-2 text-sm">
                            <button onclick="removeItemFromSale(${index})" class="text-red-600 hover:text-red-900" ${isPaymentMode ? 'disabled style="cursor:not-allowed; opacity:0.5;"' : ''}>
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');

            const subtotal = currentSaleItems.reduce((sum, item) => sum + item.totalPrice, 0);
            (document.getElementById('sale-subtotal') as HTMLElement).textContent = formatCurrency(subtotal);
            (document.getElementById('sale-grand-total') as HTMLElement).textContent = formatCurrency(subtotal);
            updateProcessButton();
        }

        const updateProcessButton = () => {
            if (editingSaleId) return;
            const processBtn = document.querySelector('#process-sale-btn') as HTMLButtonElement;
            if (currentSaleType === 'indent') {
                processBtn.innerHTML = '<i class="fas fa-clipboard-list mr-2"></i>Proses Indent';
                processBtn.className = 'flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg transition-colors font-medium';
            } else {
                processBtn.innerHTML = '<i class="fas fa-shopping-cart mr-2"></i>Proses Penjualan';
                processBtn.className = 'flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors font-medium';
            }
        }

        const clearSaleItems = () => {
            if (editingSaleId) return;
            if (currentSaleItems.length > 0 && confirm('Hapus semua item dari transaksi?')) {
                currentSaleItems = [];
                updateSaleItemsTable();
            }
        }

        const processSale = () => {
            // UPDATE LOGIC
            if (editingSaleId) {
                const sale = sales.find((s: any) => s.id === editingSaleId);
                if (!sale) {
                    alert('Error: Transaksi tidak ditemukan untuk diperbarui.');
                    return;
                }

                const saleDate = (document.getElementById('sale-date') as HTMLInputElement).value;
                const paymentMethod = (document.getElementById('payment-method') as HTMLSelectElement).value;

                if (paymentMethod === 'unpaid') {
                    alert('Pilih metode pembayaran yang valid (Cash atau Transfer).');
                    return;
                }
                
                sale.status = 'completed';
                sale.paymentMethod = paymentMethod;
                sale.paymentDate = saleDate ? new Date(saleDate).toISOString() : new Date().toISOString();
                sale.confirmedBy = currentUser.name;
                
                saveData();
                closeModal('create-sale-modal');
                renderSales();
                alert(`Pembayaran untuk transaksi ${sale.transactionNumber} berhasil dikonfirmasi.`);
                editingSaleId = null; // Reset
                return;
            }
            
            // CREATE LOGIC
            const customerName = (document.getElementById('sale-customer') as HTMLInputElement).value;
            const saleDate = (document.getElementById('sale-date') as HTMLInputElement).value;
            
            if (!customerName.trim()) {
                alert('Masukkan nama customer!');
                return;
            }

            if (currentSaleItems.length === 0) {
                alert('Tambahkan minimal satu produk!');
                return;
            }
            
            // Re-evaluate sale type based on items
            currentSaleType = currentSaleItems.some(item => item.isIndent) ? 'indent' : 'normal';
            const paymentMethod = (document.getElementById('payment-method') as HTMLSelectElement).value;

            let saleStatus = 'completed';
            if (currentSaleType === 'indent') {
                saleStatus = 'indent';
            } else if (paymentMethod === 'unpaid') {
                saleStatus = 'unpaid';
            }
            
            const totalAmount = currentSaleItems.reduce((sum, item) => sum + item.totalPrice, 0);
            const transactionPrefix = saleStatus === 'indent' ? 'IND-' : (saleStatus === 'unpaid' ? 'UNP-' : 'TXN-');
            const newSale = {
                id: Date.now().toString(),
                transactionNumber: transactionPrefix + Date.now().toString().slice(-6),
                customerName: customerName,
                saleDate: saleDate ? new Date(saleDate).toISOString() : new Date().toISOString(),
                paymentMethod: paymentMethod,
                items: [...currentSaleItems],
                totalAmount: totalAmount,
                status: saleStatus,
                createdAt: new Date().toISOString()
            };

            sales.push(newSale);

            if (saleStatus === 'completed' || saleStatus === 'unpaid') {
                currentSaleItems.forEach(item => {
                    const product = products.find((p: any) => p.id === item.productId);
                    if (product && !item.isIndent) {
                        product.currentStock -= item.quantity;
                        const movement = {
                            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                            productId: item.productId,
                            type: 'out',
                            quantity: item.quantity,
                            date: newSale.saleDate,
                            note: `Penjualan - ${newSale.transactionNumber} (${customerName})`
                        };
                        stockMovements.push(movement);
                    }
                });
            }

            saveData();
            closeModal('create-sale-modal');
            renderSales();
            renderProducts();
            updateDashboard();
            loadStockCard();
            populateSaleProductSelects();
            showReceipt(newSale);
            const message = saleStatus === 'indent' ? 'Transaksi indent berhasil dibuat! Stok akan dikurangi setelah pembayaran dikonfirmasi.' : 
                              (saleStatus === 'unpaid' ? 'Transaksi berhasil dibuat dengan status Belum Terbayar.' : 'Transaksi penjualan berhasil diproses!');
            alert(message);
        }

        const showReceipt = (sale: any) => {
            const content = document.getElementById('receipt-content') as HTMLElement;
            const receiptDate = new Date(sale.saleDate || sale.createdAt).toLocaleString('id-ID', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            let itemsHtml = sale.items.map((item: any) => `
                <div class="item">
                    <div class="item-name">${item.productName}</div>
                    <div class="item-details">
                        <span>${item.quantity} ${item.unit} x ${item.unitPrice.toLocaleString('id-ID')}</span>
                        <span>${item.totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                </div>
            `).join('');

            let statusText = 'LUNAS';
            let statusColor = 'text-green-600';
            if (sale.status === 'indent') {
                statusText = 'INDENT - BELUM LUNAS';
                statusColor = 'text-orange-600';
            } else if (sale.status === 'unpaid') {
                statusText = 'BELUM TERBAYAR';
                statusColor = 'text-yellow-600';
            }

            content.innerHTML = `
                <style>
                    #receipt-content { font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.4; color: #000; }
                    .receipt-header, .receipt-footer { text-align: center; }
                    .receipt-header .store-name { font-size: 14px; font-weight: bold; }
                    .line { border-top: 1px dashed #000; margin: 8px 0; content: ''; display: block; }
                    .details-grid, .item-details, .total { display: flex; justify-content: space-between; }
                    .item-name { text-transform: uppercase; }
                    .item { margin-bottom: 4px; }
                    .total { font-weight: bold; font-size: 14px; margin-top: 4px; }
                    .status { text-align: right; font-weight: bold; margin-bottom: 4px; }
                    /* These classes are for the modal view only and print */
                    .text-green-600 { color: #059669 !important; }
                    .text-orange-600 { color: #EA580C !important; }
                    .text-yellow-600 { color: #D97706 !important; }
                    .font-semibold { font-weight: 600; }
                    .mt-2 { margin-top: 8px; }
                </style>
                <div class="receipt-body">
                    <div class="receipt-header">
                        <div class="store-name">${settings.storeName}</div>
                        <div>${settings.storeAddress}</div>
                        <div>Tel: ${settings.storePhone}</div>
                    </div>
                    <div class="line"></div>
                    <div class="details-grid"><span>No:</span><span>${sale.transactionNumber}</span></div>
                    <div class="details-grid"><span>Tanggal:</span><span>${receiptDate}</span></div>
                    <div class="details-grid"><span>Customer:</span><span>${sale.customerName}</span></div>
                    <div class="line"></div>
                    ${itemsHtml}
                    <div class="line"></div>
                    <div class="status ${statusColor}">${statusText}</div>
                    <div class="total"><span>TOTAL</span><span>${formatCurrency(sale.totalAmount)}</span></div>
                    <div class="line"></div>
                    <div class="receipt-footer">
                        ${sale.status === 'indent' || sale.status === 'unpaid' ? `<div class="font-semibold ${statusColor}">Silakan selesaikan pembayaran</div>` : '<div>Terima kasih!</div>'}
                    </div>
                </div>
            `;
            showModal('receipt-modal');
        }

        const printReceipt = () => {
            const receiptContent = (document.getElementById('receipt-content') as HTMLElement).innerHTML;
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Struk Penjualan</title>
                            <style>
                                @page {
                                    size: 58mm auto;
                                    margin: 3mm;
                                }
                                body {
                                    width: 52mm; /* 58mm - 3mm margin on each side */
                                    margin: 0;
                                    padding: 0;
                                    -webkit-print-color-adjust: exact; /* For Chrome */
                                    color-adjust: exact; /* Standard */
                                }
                            </style>
                        </head>
                        <body>
                            ${receiptContent}
                        </body>
                    </html>
                `);
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => { 
                    printWindow.print();
                    printWindow.close();
                }, 250);
            }
        }

        const printSaleReceipt = (saleId: string) => {
            const sale = sales.find((s: any) => s.id === saleId);
            if (sale) showReceipt(sale);
        }

        const confirmIndentPayment = (saleId: string) => {
            const sale = sales.find((s: any) => s.id === saleId);
            if (!sale || sale.status !== 'indent') {
                alert('Transaksi tidak ditemukan atau bukan transaksi indent!');
                return;
            }

            let canComplete = true;
            let insufficientItems: any[] = [];

            for (const item of sale.items) {
                const product = products.find((p: any) => p.id === item.productId);
                if (!product || product.currentStock < item.quantity) {
                    canComplete = false;
                    insufficientItems.push({
                        name: product ? product.name : 'Produk tidak ditemukan',
                        needed: item.quantity,
                        available: product ? product.currentStock : 0,
                        unit: product ? product.unit : ''
                    });
                }
            }

            if (!canComplete) {
                let message = 'Stok masih belum mencukupi untuk item berikut:\\n\\n';
                insufficientItems.forEach(item => {
                    message += `• ${item.name}: Butuh ${item.needed} ${item.unit}, Tersedia ${item.available} ${item.unit}\\n`;
                });
                message += '\\nSilakan tunggu hingga stok mencukupi.';
                alert(message);
                return;
            }

            const confirmPayment = confirm(`Konfirmasi pembayaran untuk transaksi ${sale.transactionNumber}?\n\nCustomer: ${sale.customerName}\nTotal: ${formatCurrency(sale.totalAmount)}\n\nStok akan dikurangi setelah konfirmasi.`);
            if (!confirmPayment) return;

            sale.status = 'completed';
            sale.completedAt = new Date().toISOString();
            sale.confirmedBy = currentUser.name;

            sale.items.forEach((item: any) => {
                const product = products.find((p: any) => p.id === item.productId);
                product.currentStock -= item.quantity;
                const movement = {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                    productId: item.productId,
                    type: 'out',
                    quantity: item.quantity,
                    date: new Date().toISOString(),
                    note: `Konfirmasi pembayaran indent oleh ${currentUser.name} - ${sale.transactionNumber} (${sale.customerName})`
                };
                stockMovements.push(movement);
            });

            saveData();
            renderSales();
            renderProducts();
            updateDashboard();
            loadStockCard();
            populateSaleProductSelects();
            alert('Pembayaran berhasil dikonfirmasi! Stok telah dikurangi dan transaksi selesai.');
        }

        const deleteSale = (saleId: string) => {
            const sale = sales.find((s: any) => s.id === saleId);
            if (!sale) {
                alert('Transaksi tidak ditemukan!');
                return;
            }

            const confirmDelete = confirm(`Hapus transaksi ${sale.transactionNumber}?\n\nCustomer: ${sale.customerName}\nTotal: ${formatCurrency(sale.totalAmount)}\n\nPerhatian: Jika transaksi sudah selesai atau belum terbayar, stok akan dikembalikan.`);
            if (!confirmDelete) return;

            if (sale.status === 'completed' || sale.status === 'unpaid' || !sale.status) {
                sale.items.forEach((item: any) => {
                    const product = products.find((p: any) => p.id === item.productId);
                    if (product) {
                        product.currentStock += item.quantity;
                        const movement = {
                            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                            productId: item.productId,
                            type: 'in',
                            quantity: item.quantity,
                            date: new Date().toISOString(),
                            note: `Pengembalian stok - Hapus transaksi ${sale.transactionNumber}`
                        };
                        stockMovements.push(movement);
                    }
                });
            }

            stockMovements = stockMovements.filter((movement: any) => !movement.note.includes(sale.transactionNumber));
            sales = sales.filter((s: any) => s.id !== saleId);

            saveData();
            renderSales();
            renderProducts();
            updateDashboard();
            loadStockCard();
            populateSaleProductSelects();
            alert('Transaksi berhasil dihapus!');
        }

        const viewSale = (saleId: string) => {
            const sale = sales.find((s: any) => s.id === saleId);
            const content = (document.getElementById('sale-detail-content') as HTMLElement);
            let itemsHtml = `<div><span class="font-medium text-gray-700">Items:</span><div class="mt-2 space-y-2">${sale.items.map((item: any) => `<div class="bg-gray-50 p-3 rounded"><div class="flex justify-between"><span class="font-medium">${item.productName}</span><span>${formatCurrency(item.totalPrice)}</span></div><div class="text-sm text-gray-600">${item.quantity} ${item.unit} × ${formatCurrency(item.unitPrice)}</div><div class="text-xs text-gray-500">Kategori: ${item.category}</div></div>`).join('')}</div></div>`;
            
            content.innerHTML = `<div class="space-y-3"><div class="flex justify-between"><span class="font-medium text-gray-700">No. Transaksi:</span><span class="text-gray-900">${sale.transactionNumber}</span></div><div class="flex justify-between"><span class="font-medium text-gray-700">Tanggal:</span><span class="text-gray-900">${formatDate(sale.saleDate || sale.createdAt)}</span></div><div class="flex justify-between"><span class="font-medium text-gray-700">Customer:</span><span class="text-gray-900">${sale.customerName}</span></div><div class="flex justify-between"><span class="font-medium text-gray-700">Pembayaran:</span><span class="text-gray-900">${sale.paymentMethod === 'cash' ? 'Cash' : (sale.paymentMethod === 'transfer' ? 'Transfer' : 'Belum Bayar')}</span></div>${itemsHtml}<div class="flex justify-between border-t pt-3"><span class="font-bold text-gray-700">Total:</span><span class="font-bold text-green-600">${formatCurrency(sale.totalAmount)}</span></div></div>`;
            showModal('sale-detail-modal');
        }

        const exportSalesData = () => {
            if (sales.length === 0) {
                alert('Tidak ada data penjualan untuk diekspor!');
                return;
            }
            const exportData: any[] = [];

            sales.forEach(sale => {
                if (sale.items && sale.items.length > 0) {
                    sale.items.forEach((item: any) => {
                        exportData.push({
                            'No Transaksi': sale.transactionNumber,
                            'Tanggal': formatDateForExport(sale.saleDate || sale.createdAt),
                            'Customer': sale.customerName,
                            'Metode Bayar': sale.paymentMethod,
                            'Status Transaksi': sale.status,
                            'Kode Produk': item.productCode,
                            'Nama Produk': item.productName,
                            'Kategori': item.category,
                            'Jumlah': item.quantity,
                            'Satuan': item.unit,
                            'Harga Satuan': item.unitPrice,
                            'Total Harga': item.totalPrice,
                        });
                    });
                }
            });

            if (exportData.length === 0) {
                alert('Tidak ada item penjualan yang ditemukan untuk diekspor!');
                return;
            }

            // Create a title row that uses the first column.
            const headers = Object.keys(exportData[0]);
            const titleRow: { [key: string]: string } = {};
            headers.forEach((header, index) => {
                titleRow[header] = index === 0 ? '=== LAPORAN DETAIL PENJUALAN ===' : '';
            });

            // Add the title row to the top of the data.
            exportData.unshift(titleRow);

            createExcelFileXLS(exportData, `laporan-penjualan-detail-${new Date().toISOString().split('T')[0]}.xls`, 'Laporan Penjualan Detail');
            alert('Laporan penjualan detail berhasil diekspor!');
        }
        
        const exportStockCard = () => {
             const productId = (document.getElementById('stock-card-product') as HTMLSelectElement).value;
            if (!productId) {
                alert('Pilih produk terlebih dahulu untuk mengekspor kartu stok.');
                return;
            }

            const product = products.find((p: any) => p.id === productId);
            if (!product) return;

            const movements = stockMovements
                .filter(m => m.productId === productId)
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
            if (movements.length === 0) {
                alert('Tidak ada pergerakan stok untuk produk ini.');
                return;
            }

            const dataToExport: any[] = [];
            let runningBalance = 0;

            movements.forEach(movement => {
                if (movement.type === 'in') {
                    runningBalance += movement.quantity;
                } else {
                    runningBalance -= movement.quantity;
                }
                const stockValue = runningBalance * product.hpp;
                dataToExport.push({
                    'Tanggal': formatDateForExport(movement.date),
                    'Keterangan': movement.note,
                    'Masuk': movement.type === 'in' ? movement.quantity : '',
                    'Keluar': movement.type === 'out' ? movement.quantity : '',
                    'Saldo': runningBalance,
                    'Nilai Stok': stockValue
                });
            });

            createExcelFileXLS(dataToExport, `kartu-stok-${product.code}-${new Date().toISOString().split('T')[0]}.xls`, `Kartu Stok ${product.code}`);
            alert('Kartu stok berhasil diekspor!');
        }

        const downloadTemplate = () => {
            const headers = ['Kode Produk', 'Nama Produk', 'Kategori', 'HPP', 'Harga Jual', 'Stok', 'Satuan', 'Deskripsi'];
            const examples = [
                ['MNM001', 'Kopi Instan Sachet', 'Minuman', '1200', '1500', '100', 'pcs', 'Kopi instan rasa original.'],
                ['MKN001', 'Mie Instan Goreng', 'Makanan', '2500', '3000', '250', 'pcs', 'Mie instan populer rasa goreng spesial.'],
                ['ATK001', 'Buku Tulis Sidu 58', 'Alat Tulis', '3500', '5000', '50', 'pcs', '"Buku tulis ukuran standar, 58 lembar."']
            ];
            
            const csvContent = [
                headers.join(','),
                ...examples.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
            ].join('\n');
            
            const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'template-import-produk.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        const backupData = () => {
            const backupData = { products, categories, stockMovements, orders, sales, settings, backupDate: new Date().toISOString(), version: '2.0' };
            const dataStr = JSON.stringify(backupData, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `stokpro-backup-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
            alert('Backup data berhasil diunduh!');
        }

        const restoreData = () => {
            const fileInput = (document.getElementById('restore-file') as HTMLInputElement);
            const file = fileInput.files ? fileInput.files[0] : null;
            if (!file) {
                alert('Pilih file backup untuk restore!');
                return;
            }
            if (!confirm('PERINGATAN! Ini akan mengganti semua data yang ada. Lanjutkan?')) {
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const backupData = JSON.parse(e.target?.result as string);
                    if (!backupData.products || !backupData.categories || !backupData.settings) {
                        throw new Error('File backup tidak valid.');
                    }
                    products = backupData.products || [];
                    categories = backupData.categories || [];
                    stockMovements = backupData.stockMovements || [];
                    orders = backupData.orders || [];
                    sales = backupData.sales || [];
                    settings = backupData.settings || { minStockLimit: 10, currency: 'IDR' };
                    saveData();
                    initializeApp();
                    alert('Restore data berhasil!');
                } catch (error: any) {
                    alert('Error saat restore data: ' + error.message);
                }
            };
            reader.readAsText(file);
        }

        // Pagination Functions
        const paginate = (items: any[], page: number, perPage: number) => {
            const start = (page - 1) * perPage;
            const end = start + perPage;
            return items.slice(start, end);
        }

        const renderPagination = (containerId: string, currentPage: number, totalItems: number, itemsPerPage: number, onPageChange: (page: number) => void) => {
            const container = document.getElementById(containerId);
            if (!container) return;

            const totalPages = Math.ceil(totalItems / itemsPerPage);
            if (totalPages <= 1) {
                container.innerHTML = '';
                return;
            }
            
            const startItem = (currentPage - 1) * itemsPerPage + 1;
            const endItem = Math.min(startItem + itemsPerPage - 1, totalItems);

            const prevDisabled = currentPage === 1;
            const nextDisabled = currentPage === totalPages;

            container.innerHTML = `
                <div class="text-sm text-gray-700">
                    Menampilkan <span class="font-medium">${startItem}</span> sampai <span class="font-medium">${endItem}</span> dari <span class="font-medium">${totalItems}</span> hasil
                </div>
                <div class="flex items-center space-x-2">
                    <button class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${prevDisabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}" 
                            onclick="${prevDisabled ? '' : `window.onPageChange['${containerId}'](${currentPage - 1})`}" ${prevDisabled ? 'disabled' : ''}>
                        Sebelumnya
                    </button>
                    <span class="text-sm text-gray-700">Halaman ${currentPage} dari ${totalPages}</span>
                    <button class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${nextDisabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}"
                            onclick="${nextDisabled ? '' : `window.onPageChange['${containerId}'](${currentPage + 1})`}" ${nextDisabled ? 'disabled' : ''}>
                        Selanjutnya
                    </button>
                </div>
            `;
             // Expose page change handlers to window object
            if (!window.onPageChange) {
                window.onPageChange = {};
            }
            window.onPageChange[containerId] = onPageChange;
        }


        // Assign functions to window object
        const win = window as any;
        win.showSection = showSection;
        win.toggleMobileMenu = toggleMobileMenu;
        win.showAddProductModal = showAddProductModal;
        win.exportData = exportData;
        win.filterOrders = filterOrders;
        win.showCreateOrderModal = showCreateOrderModal;
        win.filterSales = filterSales;
        win.showCreateSaleModal = showCreateSaleModal;
        win.exportSalesData = exportSalesData;
        win.showStockInModal = showStockInModal;
        win.showStockOutModal = showStockOutModal;
        win.exportStockCard = exportStockCard;
        win.addCategory = addCategory;
        win.downloadTemplate = downloadTemplate;
        win.importDatabase = importDatabase;
        win.saveSettings = saveSettings;
        win.backupData = backupData;
        win.restoreData = restoreData;
        win.closeModal = closeModal;
        win.viewProduct = viewProduct;
        win.editProduct = editProduct;
        win.deleteProduct = deleteProduct;
        win.approveOrder = approveOrder;
        win.rejectOrder = rejectOrder;
        win.viewOrder = viewOrder;
        win.deleteOrder = deleteOrder;
        win.selectProductFromSearch = selectProductFromSearch;
        win.addItemToSale = addItemToSale;
        win.clearSaleItems = clearSaleItems;
        win.processSale = processSale;
        win.removeItemFromSale = removeItemFromSale;
        win.viewSale = viewSale;
        win.printReceipt = printReceipt;
        win.printSaleReceipt = printSaleReceipt;
        win.confirmIndentPayment = confirmIndentPayment;
        win.deleteSale = deleteSale;
        win.deleteCategory = deleteCategory;
        win.showPaymentModal = showPaymentModal;
        win.applyDashboardFilter = applyDashboardFilter;
        win.resetDashboardFilter = resetDashboardFilter;
        win.changeProductsPage = changeProductsPage;
        win.changeOrdersPage = changeOrdersPage;
        win.changeSalesPage = changeSalesPage;
        win.changeStockCardPage = changeStockCardPage;
        
        // Initial load
        initializeApp();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div dangerouslySetInnerHTML={{ __html: htmlBody }} />
    );
};

export default App;

declare global {
    interface Window {
        onPageChange: { [key: string]: (page: number) => void };
    }
}