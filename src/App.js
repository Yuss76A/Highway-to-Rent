import { useContext, useEffect, useState } from "react";  // Import statements go here
import NavBar from "./components/NavBar";
import { Outlet } from "react-router-dom";
import { UserContext } from "./contexts/UserContext";

function App() {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [setUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default App;