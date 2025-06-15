import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Send, Mail, Phone, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface HelpProps {
  onBack: () => void;
}

const faqItems = [
  {
    question: "How do I withdraw money?",
    answer: "To withdraw money, go to your Wallet page and click on the Withdraw button in your Withdrawal Wallet section. You'll need a minimum balance of ₹100 to withdraw. Processing takes 2-4 hours."
  },
  {
    question: "What happens if I lose a tournament?",
    answer: "If you lose a tournament, your entry fee is not refunded as it contributes to the prize pool for winners. However, you can join other tournaments and try again!"
  },
  {
    question: "How does the referral system work?",
    answer: "Share your unique referral code with friends. When they register and make their first deposit, you earn 7% commission on their deposit amount. You also earn 2% from your team's deposits (multi-level)."
  },
  {
    question: "Can I use referral coins for tournaments?",
    answer: "Yes! Referral wallet coins can be used to join tournaments, but they cannot be withdrawn as cash. They work exactly like deposit coins for tournament entries."
  },
  {
    question: "How long does deposit take to reflect?",
    answer: "Deposits are usually instant. If you don't see your deposit within 5 minutes, please contact support with your transaction ID."
  },
];

export default function Help({ onBack }: HelpProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    tournamentId: '',
    issueType: '',
    description: '',
  });
  
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const submitHelpMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest('POST', '/api/help', {
        userId: user?.id,
        ...data,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Request submitted!", description: "We'll get back to you soon" });
      setFormData({ tournamentId: '', issueType: '', description: '' });
    },
    onError: (error: any) => {
      toast({ title: "Failed to submit", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.issueType || !formData.description) {
      toast({ title: "Missing information", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    submitHelpMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-4">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">Help & Support</h1>
      </div>

      {/* Support Form */}
      <Card className="bg-gray-850 border-border">
        <CardHeader>
          <CardTitle>Report an Issue</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="tournamentId">Tournament ID (if applicable)</Label>
              <Input
                id="tournamentId"
                value={formData.tournamentId}
                onChange={(e) => handleInputChange('tournamentId', e.target.value)}
                placeholder="Enter tournament ID"
              />
            </div>
            
            <div>
              <Label htmlFor="issueType">Issue Type *</Label>
              <Select onValueChange={(value) => handleInputChange('issueType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payment">Payment Issue</SelectItem>
                  <SelectItem value="tournament">Tournament Problem</SelectItem>
                  <SelectItem value="account">Account Issue</SelectItem>
                  <SelectItem value="technical">Technical Problem</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your issue in detail..."
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full gradient-gaming" 
              disabled={submitHelpMutation.isPending}
            >
              <Send className="w-4 h-4 mr-2" />
              {submitHelpMutation.isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="bg-gray-850 border-border">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <Collapsible key={index} open={expandedFaq === index} onOpenChange={() => toggleFaq(index)}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between text-left h-auto p-4">
                    <span className="font-medium">{item.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 py-3 text-sm text-muted-foreground bg-gray-800 rounded-b-lg">
                  {item.answer}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card className="bg-gray-850 border-border">
        <CardHeader>
          <CardTitle>Still Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-center">
            <Button variant="outline" className="w-full" asChild>
              <a href="mailto:support@kirda.com" className="flex items-center justify-center">
                <Mail className="w-4 h-4 mr-2" />
                support@kirda.com
              </a>
            </Button>
            
            <Button variant="outline" className="w-full" asChild>
              <a href="tel:+911234567890" className="flex items-center justify-center">
                <Phone className="w-4 h-4 mr-2" />
                +91 12345 67890
              </a>
            </Button>
            
            <p className="text-sm text-muted-foreground mt-4">
              Available 24/7 for urgent issues
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
