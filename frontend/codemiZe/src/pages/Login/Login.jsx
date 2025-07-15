import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const themeColor = 'rgba(62, 5, 128, 1)';
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();

  // Check if user is already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/student/games-roadmap');
    }
  }, [isAuthenticated, loading, navigate]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Mascot position class - can be adjusted to change position
  const mascotPositionClass = "md:ml-12"; // Add margin-left on medium screens and up

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        console.log('Login successful, redirecting...');
        navigate('/student/games-roadmap');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Campus logo box in top left corner */}
      <div className="absolute top-0 left-0 z-20 bg-white rounded-br-lg p-3 shadow-md">
        <img
          src="/campus-logo.png"
          alt="Campus Logo"
          className="h-18 w-auto"
        />
      </div>

      {/* Ellipse image at the bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full z-0">
        <img
          src="/Ellipse 1.png"
          alt="Ellipse background"
          className="w-full max-w-[1200px] h-auto mx-auto"
        />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Side - Title and Mascot */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left mb-8 md:mb-0">
            {/* Title image */}
            <img
              src="/login-title.png"
              alt="CodemiZe"
              className="w-60 md:w-80 lg:w-200 h-auto mb-6"
            />
            {/* Mascot image with animation */}
            <div className={`w-full flex justify-center md:justify-center ${mascotPositionClass}`}>
              <img
                src="/login-mascot.png"
                alt="CodemiZe Mascot"
                className="w-96 md:w-[30rem] lg:w-[34rem] h-auto max-w-full transition-transform duration-300 hover:scale-105 animate-mascot"
              />
            </div>
          </div>

          {/* Right Side - Glass Effect Login Box */}
          <div className="w-full md:w-5/12 flex justify-center">
            <div className="w-full md:w-[420px] min-h-[450px] bg-stone-200/5 rounded-lg shadow-[0px_0px_34px_8px_rgba(104,104,104,0.22)] border border-white/5 backdrop-blur-[5.90px] p-8 flex flex-col">
              <h2 className="text-2xl font-bold text-center text-white mb-10">Sign In</h2>

              <form onSubmit={handleSubmit} className="flex flex-col flex-1">
                <div className="space-y-6 flex-1">
                  <div>
                    <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-3 bg-white/10 border border-white/30 rounded-md text-white placeholder-white/70 outline-none transition duration-200 focus:ring-2 focus:ring-purple-900"
                      placeholder="Enter your email"
                      required
                      disabled={isLoading}
                    />
                    {email === '' && (
                      <p className="text-xs text-purple-300 mt-1 ml-1">Hint: test@coding.lk</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-3 bg-white/10 border border-white/30 rounded-md text-white placeholder-white/70 outline-none transition duration-200 focus:ring-2 focus:ring-purple-900"
                      placeholder="Enter your password"
                      required
                      disabled={isLoading}
                    />
                    {password === '' && (
                      <p className="text-xs text-purple-300 mt-1 ml-1">Hint: test@123</p>
                    )}
                  </div>

                  {error && (
                    <div className="bg-red-800/40 border border-red-500/50 rounded-md p-2 mt-2">
                      <p className="text-red-200 text-sm text-center">{error}</p>
                    </div>
                  )}
                </div>

                {/* Sign In button positioned at the bottom of the form */}
                <div className="mt-auto pt-8">
                  <button
                    type="submit"
                    className={`w-full py-3 px-4 ${isLoading
                        ? 'bg-[rgba(62,5,128,0.6)] cursor-not-allowed'
                        : 'bg-[rgba(62,5,128,1)] hover:bg-[rgba(62,5,128,0.8)]'
                      } text-white font-medium rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgba(62,5,128,0.2)] flex justify-center items-center`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;