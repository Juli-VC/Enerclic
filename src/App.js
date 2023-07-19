import "./App.css";
import { CloudContext } from "./context/CloudContext";
import { AppRoutes } from "./AppRoutes/AppRoutes";

function App() {
  return (
    <CloudContext>
      <AppRoutes />
    </CloudContext>
  );
}

export default App;
