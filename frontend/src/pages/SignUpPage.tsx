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
    <div className="flex justify-center p-5">
      <div className="w-full">
        <SignupForm></SignupForm>
      </div>
    </div>
  );
};

export default SignUpPage;
