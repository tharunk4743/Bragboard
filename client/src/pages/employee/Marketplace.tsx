import React, { useState, useEffect } from "react";
import { apiService } from "../../services/apiService";
import { useAuth } from "../../context/AuthContext";
import { Reward } from "../../data/types";
import {
  ShoppingBag,
  Star,
  Zap,
  Clock,
  Pizza,
  Award,
  Gift,
  Home,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const Marketplace: React.FC = () => {
  const { authState, updateUser } = useAuth();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const data = await apiService.getRewards();
      setRewards(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleRedeem = async (reward: Reward) => {
    if (!authState.user) return;
    if (authState.user.points < reward.cost) {
      alert("Insufficient points!");
      return;
    }

    setRedeemingId(reward.id);
    try {
      const newBalance = await apiService.redeemReward(
        authState.user.id,
        reward.id
      );
      updateUser({ ...authState.user, points: newBalance });
      setSuccessMsg(`Successfully redeemed: ${reward.title}!`);
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setRedeemingId(null);
    }
  };

  const getIcon = (name: string) => {
    switch (name) {
      case "Clock":
        return <Clock className="w-6 h-6" />;
      case "Pizza":
        return <Pizza className="w-6 h-6" />;
      case "Award":
        return <Award className="w-6 h-6" />;
      case "Gift":
        return <Gift className="w-6 h-6" />;
      case "Home":
        return <Home className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  if (loading)
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-10 h-10 animate-spin mx-auto text-indigo-600" />
      </div>
    );

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
            Marketplace
          </h2>
          <p className="text-slate-500 font-medium">
            Redeem your BragPoints for exclusive team perks.
          </p>
        </div>
        <div className="bg-slate-900 text-white px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-500 rounded-2xl">
            <Zap className="w-6 h-6 text-slate-900 fill-slate-900" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Available Balance
            </p>
            <p className="text-2xl font-black">
              {authState.user?.points}{" "}
              <span className="text-amber-500">BP</span>
            </p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl font-bold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 mr-3" />
          {successMsg}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rewards.map((reward) => {
          const isAffordable =
            (authState.user?.points || 0) >= reward.cost;
          return (
            <div
              key={reward.id}
              className="glass rounded-[2.5rem] border border-slate-100 p-8 flex flex-col hover:shadow-2xl hover:shadow-indigo-100 transition-all group bg-white"
            >
              <div className="flex items-start justify-between mb-8">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-sm ${
                    isAffordable
                      ? "bg-indigo-50 text-indigo-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {getIcon(reward.icon)}
                </div>
                <span
                  className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                    reward.category === "Wellness"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : reward.category === "Career"
                      ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                      : "bg-violet-50 text-violet-600 border-violet-100"
                  }`}
                >
                  {reward.category}
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-2">
                {reward.title}
              </h3>
              <p className="text-slate-500 text-sm font-medium mb-8 flex-1">
                {reward.description}
              </p>

              <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                    Cost
                  </p>
                  <p className="text-xl font-black text-slate-900">
                    {reward.cost}{" "}
                    <span className="text-amber-500 text-sm">
                      BP
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={!isAffordable || redeemingId === reward.id}
                  className={`px-6 py-3 rounded-2xl font-black text-xs transition-all flex items-center shadow-lg ${
                    isAffordable
                      ? "bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-indigo-200"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                  }`}
                >
                  {redeemingId === reward.id ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <ShoppingBag className="w-4 h-4 mr-2" />
                  )}
                  {isAffordable ? "Redeem" : "Need More BP"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Marketplace;
