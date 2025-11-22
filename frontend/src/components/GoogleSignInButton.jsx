
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Api } from '../api.js';

export default function GoogleSignInButton() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Send credential to backend for verification and login
      const { token, user } = await Api.googleLogin(credentialResponse.credential);
      await login(user.email, null, token, user); // Pass token and user to login
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/orders');
      }
    } catch (error) {
      alert(error.message || 'Google sign-in failed');
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => {
        alert('Google sign-in failed');
      }}
      width="100%"
      shape="rect"
      theme="filled_blue"
      text="signin_with"
    />
  );
}
