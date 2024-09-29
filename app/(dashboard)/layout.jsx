
import NavBar from "@components/NavBar"
import SideBar from "@components/SideBar"
import { getApiLimitCount } from "@lib/api-limit"
import { checkSubscription } from "@lib/subscription";


const DashboardLayout = async({children}) => {
  const apiLimitCount = await getApiLimitCount();
  const isPro = await checkSubscription();

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:flex-col md:fixed md:inset-y-0 md:w-72 bg-gray-900">
        <SideBar isPro={isPro} apiLimitCount={apiLimitCount} />
      </div>

      <main className="md:pl-72">
        <NavBar />
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout