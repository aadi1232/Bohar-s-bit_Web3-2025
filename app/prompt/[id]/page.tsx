import { getUser } from "@/actions/user/getUser";
import PromptDetailsPage from "./_page";

const Page = async ({ params }: { params: any }) => {
  const data = await getUser();
  

  return (
    <div>
      <PromptDetailsPage
        user={data?.user}
        isSellerExist={data?.shop ? true : false}
        isUserExist={data?.user ? true : false}
        promptId={params.id}
      />
    </div>
  );
};

export default Page;
