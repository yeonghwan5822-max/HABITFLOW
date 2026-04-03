/// <reference types="vite/client" />
import ReactGA from 'react-ga4';

export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA4_ID || 'G-TEMP123456';
  ReactGA.initialize(measurementId);
};

export const trackLoginSuccess = (userId?: string) => {
  ReactGA.event({
    category: 'Authentication',
    action: '로그인 성공',
    label: userId || 'anonymous',
  });
};

export const trackHabitCompletion = (habitName: string) => {
  ReactGA.event({
    category: 'Engagement',
    action: '습관 완료',
    label: habitName,
  });
};

export const trackAIReflection = () => {
  ReactGA.event({
    category: 'Premium Feature',
    action: 'AI 성찰 클릭',
    label: 'AI Duty Reflection',
  });
};

export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};
