import DashboardButton from "@/components/DashboardButton";

const NotFoundPage = () => {
  return (
    <div className="grid h-screen place-content-center  px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-gray-200">404</h1>

        <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Uh-oh!
        </p>

        <p className="mt-4 text-gray-500">We can't find that page.</p>

        <DashboardButton></DashboardButton>
      </div>
    </div>
  );
};

export default NotFoundPage;
