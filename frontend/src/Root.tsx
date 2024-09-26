import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";

function Root() {
  return (
    <div className="min-h-[100vh] grid grid-rows-[auto_1fr_auto]">
      <Header></Header>
      <main>
        <Outlet></Outlet>
      </main>
      <Footer></Footer>
    </div>
  );
}

export default Root;
