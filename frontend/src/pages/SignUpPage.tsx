import SignupForm from "@/components/forms/SignupForm";
import { GET_AUTHENTICATED_USER } from "@/graphql/queries/user.query";
import { useQuery } from "@apollo/client";
import { Navigate } from "react-router-dom";

const SignUpPage = () => {
  const { loading, data } = useQuery(GET_AUTHENTICATED_USER);

  if (loading) return null;

  if (data?.authUser) {
    return <Navigate to="/" />;
  }
  return (
    <div className="w-full h-full max-w-7xl mx-auto py-5 flex flex-col-reverse lg:flex-row items-center justify-center">
      <div className="w-full">
        <div className="md:h-[400px] p-2 hidden lg:block">
          <img
            src="/management-img.webp"
            className="w-full h-full object-contain rounded-lg"
            alt=""
          />
        </div>
      </div>
      <div className="w-full">
        <SignupForm></SignupForm>
      </div>
    </div>
  );
};

export default SignUpPage;
