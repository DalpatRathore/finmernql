import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative h-full bg-[url(https://images.unsplash.com/photo-1604014237800-1c9102c219da?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80)] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-gray-900/75"></div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 lg:py-32 lg:flex lg:items-center">
        <div className="max-w-xl text-center space-y-5">
          <h2 className="text-3xl font-extrabold text-white sm:text-3xl">
            Take Control of Your Finances with
            <strong className="block font-extrabold text-rose-500">
              MERN Expense Tracker
            </strong>
          </h2>

          <p className="mt-4 max-w-lg text-white sm:text-lg">
            With our powerful expense tracker, you can effortlessly monitor your
            spending, set budgets, and achieve your savings goals
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
            <Link
              to="/login"
              className="block w-full rounded bg-rose-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring active:bg-rose-500 sm:w-auto"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
