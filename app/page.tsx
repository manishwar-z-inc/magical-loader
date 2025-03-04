import { ArticleCard } from "./components/profile";
import UserProfile from "./components/profile/UserProfile";

const App = () => {
  return (
    <div className="p-8">
      <UserProfile />
      <ArticleCard />
    </div>
  );
};

export default App;
