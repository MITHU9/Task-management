import { Link } from "react-router-dom";
import { useTaskContext } from "../../hooks/useTaskContext";

const Navbar = () => {
  const { signOutUser } = useTaskContext();

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {/* <img src="/logo.png" alt="Logo" className="h-10" /> */}
          <span className="text-xl font-semibold text-gray-800">MyWebsite</span>
        </div>

        <Link
          onClick={() => {
            signOutUser();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Logout
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
