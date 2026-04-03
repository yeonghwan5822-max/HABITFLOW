import { useMemo } from 'react';
import { WeeklyData, ReportInsight } from '../types';

const WEEKLY_DATA: WeeklyData[] = [
  { name: '월', value: 60 },
  { name: '화', value: 75 },
  { name: '수', value: 45 },
  { name: '목', value: 90 },
  { name: '금', value: 80 },
  { name: '토', value: 55 },
  { name: '오늘', value: 95 },
];

export function useReports() {
  const weeklyData = useMemo(() => WEEKLY_DATA, []);

  const averageCompletion = useMemo(() => {
    const total = weeklyData.reduce((acc, curr) => acc + curr.value, 0);
    return Math.round(total / weeklyData.length);
  }, [weeklyData]);

  const insights = useMemo(() => {
    const generatedInsights: ReportInsight[] = [];
    
    // Find highest completion day
    const sortedDays = [...weeklyData].sort((a, b) => b.value - a.value);
    const highestDay = sortedDays[0];
    
    if (highestDay) {
      generatedInsights.push({
        type: 'success',
        message: `이번 주 가장 달성률이 높은 요일은 '${highestDay.name}'(${highestDay.value}%) 입니다. 이 페이스를 유지해보세요!`
      });
    }

    // Trend analysis (recent 3 days vs overall average)
    const recentDays = weeklyData.slice(-3);
    const recentAvg = Math.round(recentDays.reduce((acc, curr) => acc + curr.value, 0) / recentDays.length);
    
    if (recentAvg > averageCompletion) {
      generatedInsights.push({
        type: 'success',
        message: `최근 3일간 평균 달성률(${recentAvg}%)이 주간 평균보다 높습니다. 상승세를 타고 있네요!`
      });
    } else if (recentAvg < averageCompletion) {
      generatedInsights.push({
        type: 'info',
        message: `최근 3일간 평균 달성률(${recentAvg}%)이 주간 평균보다 낮습니다. 조금 더 힘을 내볼까요?`
      });
    }

    // Streak info
    const isPerfectToday = weeklyData[weeklyData.length - 1].value >= 90;
    if (isPerfectToday) {
      generatedInsights.push({
        type: 'success',
        message: `오늘 달성률이 매우 훌륭합니다! 연속 달성 최고 기록을 곧 경신할 수 있을 거예요.`
      });
    }

    return generatedInsights;
  }, [weeklyData, averageCompletion]);

  return {
    weeklyData,
    insights,
    averageCompletion,
  };
}
