import { TrendingUp, ShoppingCart, DollarSign, Package, AlertTriangle, Star } from 'lucide-react';

const BusinessOverview = ({ businessData }) => {
  if (!businessData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Business overview data not available</p>
      </div>
    );
  }

  const { todayMetrics, inventory, bestSellingProducts } = businessData;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <div className="space-y-6">
      {/* Today's Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium mb-1">Meta Ads Spent Today</p>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(todayMetrics.metaAdsSpent)}</p>
            </div>
            <div className="bg-blue-200 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium mb-1">Today's Orders</p>
              <p className="text-2xl font-bold text-green-900">{formatNumber(todayMetrics.orderQuantity)}</p>
            </div>
            <div className="bg-green-200 p-3 rounded-full">
              <ShoppingCart className="w-6 h-6 text-green-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium mb-1">Today's Revenue</p>
              <p className="text-2xl font-bold text-purple-900">{formatCurrency(todayMetrics.revenue)}</p>
            </div>
            <div className="bg-purple-200 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Status */}
        <div className="space-y-4">
          {/* Low Stock Products */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900">Low Stock Products</h3>
            </div>
            
            {inventory.lowStock.length === 0 ? (
              <p className="text-gray-500 text-sm">No products with low stock</p>
            ) : (
              <div className="space-y-3">
                {inventory.lowStock.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{product.productName}</p>
                      <p className="text-xs text-gray-600">Code: {product.productCode}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-200 text-orange-800">
                        {product.quantity} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Out of Stock Products */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">Out of Stock</h3>
            </div>
            
            {inventory.outOfStock.length === 0 ? (
              <p className="text-gray-500 text-sm">No out of stock products</p>
            ) : (
              <div className="space-y-3">
                {inventory.outOfStock.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{product.productName}</p>
                      <p className="text-xs text-gray-600">Code: {product.productCode}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-200 text-red-800">
                        Out of Stock
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">Top 5 Best Selling Products</h3>
          </div>
          
          <div className="space-y-3">
            {bestSellingProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{product.productName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-900">{formatNumber(product.lifetimeSales)}</p>
                      <p className="text-xs text-gray-500">Lifetime Sales</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-semibold ${
                        product.currentInventory < 20 ? 'text-red-600' : 
                        product.currentInventory < 50 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {formatNumber(product.currentInventory)}
                      </p>
                      <p className="text-xs text-gray-500">In Stock</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessOverview;