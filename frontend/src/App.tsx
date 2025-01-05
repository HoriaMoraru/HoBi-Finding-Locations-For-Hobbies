import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebaseConfig";
import { loginSuccess, logout, setLoading } from "./store/authSlice";
import { useRoutes } from "react-router-dom";
import routes from "./routes/routes";

function App() {
    const routing = useRoutes(routes);
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                dispatch(
                    loginSuccess({
                        email: user.email || "",
                    })
                );
            } else {
                dispatch(logout());
            }
            dispatch(setLoading(false));
        });

        return () => unsubscribe(); // Clean up the listener
    }, [dispatch]);

    return <div className="App">{routing}</div>;
}

export default App;
