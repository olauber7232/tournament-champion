import { useState } from "react";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    recoveryQuestion: '',
    recoveryAnswer: '',
    referredBy: '',
  });
  
  const { login, register, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        await login(formData.username, formData.password);
        toast({ title: "Login successful!", description: "Welcome back to Kirda!" });
      } else {
        await register({
          username: formData.username,
          password: formData.password,
          recoveryQuestion: formData.recoveryQuestion,
          recoveryAnswer: formData.recoveryAnswer,
          referredBy: formData.referredBy || undefined,
        });
        toast({ title: "Registration successful!", description: "Welcome to Kirda!" });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Authentication failed",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-850 to-gray-900 p-4">
      <div className="max-w-md mx-auto pt-20">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto gradient-gaming rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Join Kirda</h2>
          <p className="text-muted-foreground">Enter the tournament arena</p>
        </div>

        {/* Auth Toggle */}
        <div className="flex bg-gray-850 rounded-lg p-1 mb-6">
          <Button
            variant={isLogin ? "default" : "ghost"}
            className="flex-1"
            onClick={() => setIsLogin(true)}
          >
            Login
          </Button>
          <Button
            variant={!isLogin ? "default" : "ghost"}
            className="flex-1"
            onClick={() => setIsLogin(false)}
          >
            Register
          </Button>
        </div>

        {/* Form */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder={isLogin ? "Enter username" : "Choose username"}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder={isLogin ? "Enter password" : "Create password"}
                  required
                />
              </div>

              {!isLogin && (
                <>
                  <div>
                    <Label htmlFor="recoveryQuestion">Recovery Question</Label>
                    <Select onValueChange={(value) => handleInputChange('recoveryQuestion', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a recovery question" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="favorite_game">What's your favorite game?</SelectItem>
                        <SelectItem value="pet_name">What's your pet's name?</SelectItem>
                        <SelectItem value="mother_maiden">What's your mother's maiden name?</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="recoveryAnswer">Answer</Label>
                    <Input
                      id="recoveryAnswer"
                      value={formData.recoveryAnswer}
                      onChange={(e) => handleInputChange('recoveryAnswer', e.target.value)}
                      placeholder="Your answer"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                    <Input
                      id="referralCode"
                      value={formData.referredBy}
                      onChange={(e) => handleInputChange('referredBy', e.target.value)}
                      placeholder="Enter referral code"
                    />
                  </div>
                </>
              )}

              <Button type="submit" className="w-full gradient-gaming" disabled={isLoading}>
                {isLoading ? "Loading..." : isLogin ? "Login to Tournament" : "Create Account"}
              </Button>

              {isLogin && (
                <Button type="button" variant="link" className="w-full">
                  Forgot Password?
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
