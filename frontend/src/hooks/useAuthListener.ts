import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { loginSuccess, logout, setLoading } from "../store/authSlice";

const useAuthListener = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(true)); // Start loading

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

            dispatch(setLoading(false)); // Stop loading once auth state is determined
        });

        return () => unsubscribe(); // Clean up the listener
    }, [dispatch]);
};

export default useAuthListener;
