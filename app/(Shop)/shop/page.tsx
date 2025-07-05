import ShopSidebar from '@/components/Shop/ShopSidebar';
import DashboardOverViewCard from '@/components/Shop/DashboardOverViewCard';
import { getSellerOrders } from '@/actions/orders/getSellerOrders';
import { getSellerInfo } from '@/actions/shop/getSellerInfo';
import OrderAnalytics from '@/components/Analytics/OrderAnalytics';
import CategorySuggestions from '@/components/ai/CategorySuggestions';

const Page = async () => {
  const sellerData:any = await getSellerInfo();
  const orders = await getSellerOrders();

  return (
    <div className='flex w-full'>
      <div className="h-screen flex p-2 bg-[#111c42] md:w-[20%] 2xl:w-[17%]">
        <ShopSidebar active={0} />
      </div>
      <div className="md:w-[80%] 2xl:w-[83%] p-5">
        <DashboardOverViewCard 
          totalEarning={sellerData?.shop?.totalEarning} 
          totalPrompts={sellerData?.shop?.allProducts}
          totalOrders={orders?.length}
        />
        <br />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <OrderAnalytics isDashboard={true} />
          </div>
          <div className="xl:col-span-1">
            <CategorySuggestions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
