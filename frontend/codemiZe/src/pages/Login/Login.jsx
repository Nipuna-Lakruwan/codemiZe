import { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const themeColor = 'rgba(62, 5, 128, 1)';

  // Mascot position class - can be adjusted to change position
  const mascotPositionClass = "md:ml-12"; // Add margin-left on medium screens and up

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', email);
    // Authentication logic would go here
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
                    />
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
                    />
                  </div>
                </div>

                {/* Sign In button positioned at the bottom of the form */}
                <div className="mt-auto pt-8">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-[rgba(62,5,128,1)] hover:bg-[rgba(62,5,128,0.8)] text-white font-medium rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgba(62,5,128,0.2)]"
                  >
                    Sign In
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