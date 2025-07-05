"use client";
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { FiZap, FiTrendingUp, FiSearch } from "react-icons/fi";
import { styles } from "@/utils/styles";
import { TrendingCategory } from "@/types/ai";

type Props = {
  onCategoryFilter?: (category: string) => void;
  currentCategory?: string;
};

const MarketplaceAIAssistant = ({ onCategoryFilter, currentCategory }: Props) => {
  const [recommendations, setRecommendations] = useState<TrendingCategory[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/trending-categories');
      const data = await response.json();
      
      if (data.success && data.data) {
        // Sort by demand score and take top 3
        const sorted = data.data.sort((a: TrendingCategory, b: TrendingCategory) => 
          b.demandScore - a.demandScore
        ).slice(0, 3);
        setRecommendations(sorted);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <Card className="w-full bg-[#1a1a2e] border border-[#16213e] mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <FiZap className="text-[#835DED] text-xl" />
          <h3 className={`${styles.heading} !text-lg`}>
            AI Marketplace Assistant
          </h3>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loading ? (
            [...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse bg-[#0f0f23] p-4 rounded-lg">
                <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-600 rounded w-full mb-3"></div>
                <div className="h-8 bg-gray-600 rounded w-full"></div>
              </div>
            ))
          ) : (
            recommendations.map((category, index) => (
              <div key={index} className="bg-[#0f0f23] p-4 rounded-lg border border-[#2a2a4a]">
                <div className="flex items-center gap-2 mb-2">
                  <FiTrendingUp className="text-[#64ff4b] text-sm" />
                  <span className={`${styles.label} !text-sm font-medium text-white`}>
                    {category.category}
                  </span>
                </div>
                <p className={`${styles.paragraph} !text-xs mb-3`}>
                  {category.demandScore >= 80 ? "🔥 High demand" : 
                   category.demandScore >= 60 ? "📈 Growing trend" : "💡 Emerging"}
                </p>
                <Button
                  size="sm"
                  onClick={() => onCategoryFilter?.(category.category)}
                  className={`w-full text-xs ${
                    currentCategory === category.category 
                      ? "bg-[#835DED] text-white" 
                      : "bg-[#835DED20] text-[#835DED] hover:bg-[#835DED30]"
                  }`}
                  startContent={<FiSearch size={12} />}
                >
                  Explore {category.category}
                </Button>
              </div>
            ))
          )}
        </div>

        {!loading && recommendations.length === 0 && (
          <div className="text-center py-4">
            <p className={`${styles.paragraph} !text-sm`}>
              AI recommendations temporarily unavailable
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default MarketplaceAIAssistant;
