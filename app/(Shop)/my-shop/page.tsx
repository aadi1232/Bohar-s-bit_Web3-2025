import ShopSidebar from "@/components/Shop/ShopSidebar";
import ShopRoot from "./_page";
import { getUser } from "@/actions/user/getUser";
import { getShopOrders } from "@/actions/orders/getShopOrders";
import { getAllPromptsByShop } from "@/actions/shop/getAllPromptsByShop";

type Props = {};

const Page = async (props: Props) => {
  const sellerId: any = await getUser();
  const ordersData = await getShopOrders({ sellerId: sellerId?.user.id });
  const promptsData = await getAllPromptsByShop();

  return (
    <div className="min-h-screen">
      {/* Fixed Sidebar */}
      <ShopSidebar active={0} />
      
      {/* Main Content */}
      <div className="md:ml-[280px]">
        <ShopRoot ordersData={ordersData} promptsData={promptsData} />
      </div>
    </div>
  );
};

export default Page;
