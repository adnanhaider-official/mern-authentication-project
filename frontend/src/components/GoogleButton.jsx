import { GoogleLogin } from "@react-oauth/google";

function GoogleButton({ onSuccess, onError }) {
  return (
    <div className="flex justify-center">
      <GoogleLogin onSuccess={onSuccess} onError={onError} />
    </div>
  );
}

export default GoogleButton;
