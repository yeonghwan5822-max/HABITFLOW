import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { signInWithGoogle } from '../../firebase';

export function LandingView() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-card rounded-3xl p-8 shadow-xl border border-border text-center"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="CheckCircle2" size={40} className="text-primary" />
        </div>
        <h1 className="text-3xl font-headline font-black text-card-foreground mb-4">
          Habit Tracker
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          작은 습관이 모여 위대한 변화를 만듭니다. <br/>
          지금 바로 시작해보세요.
        </p>
        
        <Button 
          variant="primary" 
          size="lg" 
          className="w-full flex items-center justify-center gap-3 py-4 text-lg"
          onClick={signInWithGoogle}
        >
          <Icon name="User" size={20} />
          Google 계정으로 시작하기
        </Button>
      </motion.div>
    </div>
  );
}
