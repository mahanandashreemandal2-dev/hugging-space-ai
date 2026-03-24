import { CreditCard as CardIcon, Eye, EyeOff, Copy, Lock, Snowflake } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const cards = [
  {
    id: 1,
    name: "Platinum Card",
    number: "4532 •••• •••• 8721",
    fullNumber: "4532 8912 3456 8721",
    expiry: "09/28",
    balance: "$12,450.00",
    type: "Visa",
    color: "from-blue-600 to-blue-800",
  },
  {
    id: 2,
    name: "Gold Card",
    number: "5412 •••• •••• 3345",
    fullNumber: "5412 7634 9012 3345",
    expiry: "03/27",
    balance: "$8,320.50",
    type: "Mastercard",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: 3,
    name: "Business Card",
    number: "3782 •••• •••• 0005",
    fullNumber: "3782 8224 6310 0005",
    expiry: "12/26",
    balance: "$24,461.39",
    type: "Amex",
    color: "from-emerald-600 to-teal-700",
  },
];

const Cards = () => {
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const toggleReveal = (id: number) => {
    setRevealedCards((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copyNumber = (fullNumber: string) => {
    navigator.clipboard.writeText(fullNumber.replace(/\s/g, ""));
    toast({ title: "Copied!", description: "Card number copied to clipboard." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cards</h1>
        <p className="text-sm text-muted-foreground">Manage your debit and credit cards.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div key={card.id} className="space-y-3">
            {/* Visual card */}
            <div className={`relative h-48 overflow-hidden rounded-xl bg-gradient-to-br ${card.color} p-6 text-white shadow-lg`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium opacity-80">{card.type}</span>
                <CardIcon className="h-8 w-8 opacity-50" />
              </div>
              <p className="mt-8 font-mono text-lg tracking-wider">
                {revealedCards.has(card.id) ? card.fullNumber : card.number}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase opacity-60">Card Holder</p>
                  <p className="text-sm font-medium">demo123</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase opacity-60">Expires</p>
                  <p className="text-sm font-medium">{card.expiry}</p>
                </div>
              </div>
            </div>

            {/* Card actions */}
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{card.name}</p>
                  <p className="text-xs text-muted-foreground">Balance: {card.balance}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => toggleReveal(card.id)}>
                    {revealedCards.has(card.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => copyNumber(card.fullNumber)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Lock className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Snowflake className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
