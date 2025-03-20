// "use client"; // Add this if you're using Next.js App Router
// import { useState } from 'react';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');
    
//     // Simple validation
//     if (!email || !password) {
//       setError('Please fill in all fields');
//       setIsLoading(false);
//       return;
//     }
    
//     // Simulate authentication (replace with actual authentication logic)
//     try {
//       // Fake login - in a real app, this would be your authentication API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // For demo purposes, successful login with any email/password
//       router.push('/startup-form');
//     } catch (err) {
//       setError('Invalid email or password');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#F3F0E7] p-4">
//       <div className="w-full max-w-md">
//         <Card className="border-[#9A9285] shadow-lg">
//           <CardHeader className="bg-[#9A9285] text-white rounded-t-lg">
//             <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
//             <CardDescription className="text-white/80 text-center">
//               Sign in to continue to your account
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="pt-6 pb-4 px-6">
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email" className="text-[#1E1E1E] font-medium">
//                   Email
//                 </Label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                     <Mail size={18} className="text-[#9A9285]" />
//                   </div>
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="name@example.com"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="pl-10 border-[#D6CBBE] focus:border-[#9A9285] focus:ring-[#9A9285]"
//                   />
//                 </div>
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="password" className="text-[#1E1E1E] font-medium">
//                   Password
//                 </Label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                     <Lock size={18} className="text-[#9A9285]" />
//                   </div>
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="••••••••"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="pl-10 pr-10 border-[#D6CBBE] focus:border-[#9A9285] focus:ring-[#9A9285]"
//                   />
//                   <div 
//                     className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? (
//                       <EyeOff size={18} className="text-[#9A9285]" />
//                     ) : (
//                       <Eye size={18} className="text-[#9A9285]" />
//                     )}
//                   </div>
//                 </div>
//               </div>
              
//               {error && (
//                 <div className="px-4 py-2 text-sm text-[#FF0606] bg-[#FFEDED] rounded-md">
//                   {error}
//                 </div>
//               )}
              
//               <Button 
//                 type="submit" 
//                 className="w-full bg-[#9A9285] hover:bg-[#8a8376] text-white"
//                 disabled={isLoading}
//               >
//                 {isLoading ? 'Signing in...' : 'Sign In'}
//               </Button>
//             </form>
//           </CardContent>
//           {/* <CardFooter className="flex flex-col space-y-2 bg-[#F3F0E7] rounded-b-lg p-6 pt-0">
//             <div className="text-sm text-center text-[#1E1E1E]/70">
//               Don't have an account?{' '}
//               <a href="#" className="text-[#9A9285] hover:underline font-medium">
//                 Create an account
//               </a>
//             </div>
//             <div className="text-sm text-center text-[#1E1E1E]/70">
//               <a href="#" className="text-[#9A9285] hover:underline font-medium">
//                 Forgot your password?
//               </a>
//             </div>
//           </CardFooter> */}
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client"; 
import { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useRouter } from "next/navigation";

const SERVER_URL = "http://192.168.0.128:1001"; // Define server URL

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${SERVER_URL}/login`, {
        email,
        password
      });

      if (response.status === 200) {
        // Handle successful login, store token if provided
        router.push('/startup-form'); // Navigate after login
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F0E7] p-4">
      <div className="w-full max-w-md">
        <Card className="border-[#9A9285] shadow-lg">
          <CardHeader className="bg-[#9A9285] text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-white/80 text-center">
              Sign in to continue to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-4 px-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#1E1E1E] font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9A9285]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-[#D6CBBE] focus:border-[#9A9285] focus:ring-[#9A9285]"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#1E1E1E] font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9A9285]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-[#D6CBBE] focus:border-[#9A9285] focus:ring-[#9A9285]"
                  />
                  <div 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} className="text-[#9A9285]" /> : <Eye size={18} className="text-[#9A9285]" />}
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="px-4 py-2 text-sm text-[#FF0606] bg-[#FFEDED] rounded-md">
                  {error}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-[#9A9285] hover:bg-[#8a8376] text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}