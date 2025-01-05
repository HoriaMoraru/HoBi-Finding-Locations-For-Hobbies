import { useRoutes } from "react-router-dom";
import routes from "./routes/routes";
import useAuthListener from "./hooks/useAuthListener.ts";

function App() {
    const routing = useRoutes(routes);
    useAuthListener();

    return <div className="App">{routing}</div>;
}

export default App;
