import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";

function Root() {
  return (
    <div className="min-h-[100vh] grid grid-rows-[auto_1fr_auto]">
      <Header></Header>
      <main>
        <Outlet></Outlet>
      </main>
      <Toaster />
      <Footer></Footer>
    </div>
  );
}

export default Root;
