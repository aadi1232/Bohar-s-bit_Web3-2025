"use client";
import { styles } from "@/utils/styles";
import { Card, CardBody, CardHeader, Progress, Chip, Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { TrendingCategory, AIResponse } from "@/types/ai";
import { FiTrendingUp, FiRefreshCw } from "react-icons/fi";

const CategorySuggestions = () => {
  const [categories, setCategories] = useState<TrendingCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTrendingCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/trending-categories');
      const data: AIResponse<TrendingCategory[]> = await response.json();
      
      if (data.success && data.data) {
        setCategories(data.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch trending categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingCategories();
  }, []);

  const getDemandColor = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "danger";
  };

  const getDemandLabel = (score: number) => {
    if (score >= 80) return "High Demand";
    if (score >= 60) return "Medium Demand";
    return "Low Demand";
  };

  return (
    <Card className="w-full bg-[#1a1a2e] border border-[#16213e]">
      <CardHeader className="flex justify-between items-center pb-2">
        <div className="flex items-center gap-2">
          <FiTrendingUp className="text-[#835DED] text-xl" />
          <h3 className={`${styles.heading} !text-xl`}>
            Trending Categories
          </h3>
        </div>
        <Button
          size="sm"
          variant="flat"
          onClick={fetchTrendingCategories}
          disabled={loading}
          className="bg-[#2a2a4a] text-white hover:bg-[#3a3a5a]"
          startContent={loading ? <FiRefreshCw className="animate-spin" /> : <FiRefreshCw />}
        >
          Refresh
        </Button>
      </CardHeader>
      <CardBody className="pt-0">
        {loading && categories.length === 0 ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-gray-600 rounded w-full mb-3"></div>
                <div className="h-3 bg-gray-600 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={index} className="border border-[#2a2a4a] rounded-lg p-4 bg-[#0f0f23]">
                <div className="flex justify-between items-center mb-3">
                  <h4 className={`${styles.label} !text-lg font-medium text-white`}>
                    {category.category}
                  </h4>
                  <Chip 
                    size="sm" 
                    color={getDemandColor(category.demandScore)}
                    variant="flat"
                  >
                    {getDemandLabel(category.demandScore)}
                  </Chip>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className={`${styles.label} !text-sm`}>Market Demand</span>
                    <span className={`${styles.label} !text-sm`}>{category.demandScore}/100</span>
                  </div>
                  <Progress 
                    value={category.demandScore} 
                    color={getDemandColor(category.demandScore)}
                    className="max-w-full"
                  />
                </div>

                <div className="mb-3">
                  <span className={`${styles.label} !text-sm mb-2 block`}>Trending Ideas:</span>
                  <div className="flex flex-wrap gap-1">
                    {category.suggestedPrompts.slice(0, 3).map((prompt, idx) => (
                      <Chip key={idx} size="sm" className="bg-[#835DED20] text-[#835DED] text-xs">
                        {prompt}
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className={`${styles.label} !text-sm text-gray-400`}>
                    Avg Price: {category.averagePrice} ETH
                  </span>
                  <span className={`${styles.label} !text-sm text-[#64ff4b]`}>
                    #{index + 1} Trending
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {lastUpdated && (
          <div className="mt-4 pt-3 border-t border-[#2a2a4a]">
            <p className={`${styles.paragraph} !text-xs text-center text-gray-400`}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="text-center py-8">
            <p className={`${styles.paragraph}`}>
              Unable to load trending categories. Please try refreshing.
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default CategorySuggestions;
