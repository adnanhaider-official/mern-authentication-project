import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
    </div>
  );
}

export default Home;
