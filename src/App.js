import { useContext, useEffect, useState } from "react";
import NavBar from "./components/NavBar";
import { Outlet } from "react-router-dom";
import { UserContext } from "./contexts/UserContext";
import Footer from "./components/Footer";
import WelcomeNotification from "./components/WelcomeNotification";

function App() {
  const { setUser } = useContext(UserContext);
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
      <WelcomeNotification />
      <Outlet />     
      <Footer />
    </>
  );
}

export default App;