import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query";

function Root() {
  const { loading, error, data } = useQuery(GET_AUTHENTICATED_USER);

  console.log(loading);
  console.log(data);
  console.log(error);
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
