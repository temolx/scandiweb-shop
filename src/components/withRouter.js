import { useNavigate, useParams, useLocation } from "react-router-dom";

export const withRouter = (WrappedComponent) => (props) => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  return <WrappedComponent {...props} params={params} navigate={navigate} location={location} />;
};