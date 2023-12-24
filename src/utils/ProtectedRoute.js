import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const user = useSelector((state) => state.auth.user);

    return (
        <Route
            {...rest}
            render={(props) =>
                user ? <Component {...props} /> : <Redirect to="/login" />
            }
        />
    );
}

export default ProtectedRoute;