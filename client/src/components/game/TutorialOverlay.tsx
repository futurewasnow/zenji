import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, LightbulbIcon } from 'lucide-react';

interface TutorialOverlayProps {
  step: number;
  onNext?: () => void;
  onSkip?: () => void;
}

const tutorialSteps = [
  {
    title: "Welcome to Zenji!",
    content: "This tutorial will guide you through the basic gameplay. Let's start with understanding the game board.",
    position: "center"
  },
  {
    title: "Your Monkey Mind",
    content: "This is your Monkey Mind. It starts with 4 cards. The goal is to keep the point total here as low as possible.",
    position: "right"
  },
  {
    title: "Your Higher Mind",
    content: "This is your Higher Mind. It starts empty. You'll want to move valuable Elemental Point (EP) cards here to score points.",
    position: "right"
  },
  {
    title: "Card Piles",
    content: "The Future pile is where you draw new cards. The Past pile contains discarded cards. You can draw from either pile on your turn.",
    position: "center"
  },
  {
    title: "Taking a Turn",
    content: "On your turn, first draw a card from either pile. Then you must exchange it with a card in your Monkey Mind.",
    position: "center"
  },
  {
    title: "Scoring Points",
    content: "EP cards (values 1-4) and Avatar cards can be moved to your Higher Mind. At the end of a round, these become points if you have the lowest Monkey Mind score.",
    position: "right"
  },
  {
    title: "Knock-Out Move",
    content: "If a card in your Monkey Mind matches the top card of the Past pile, you can 'Knock Out' (discard) it by clicking the gavel button.",
    position: "right"
  },
  {
    title: "Calling Zenji",
    content: "When you think you have the lowest Monkey Mind score, call Zenji! If you're right, you score all your Higher Mind EP cards.",
    position: "center"
  },
  {
    title: "Winning the Game",
    content: "The first player to collect 15 Elemental Points wins! Let's start playing. Draw a card from the Future pile to begin.",
    position: "center"
  }
];

const TutorialOverlay = ({ step, onNext, onSkip }: TutorialOverlayProps) => {
  // If we've reached beyond the last step, don't render anything
  if (step >= tutorialSteps.length) {
    return null;
  }
  
  const currentStep = tutorialSteps[step] || tutorialSteps[0];
  
  // Determine positioning based on step
  const getPositionStyle = () => {
    switch (currentStep.position) {
      case "right":
        return "right-4 bottom-1/4 max-w-xs";
      case "left":
        return "left-4 bottom-1/4 max-w-xs";
      case "center":
      default:
        return "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md";
    }
  };
  
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={step}
        className={`absolute ${getPositionStyle()} bg-white rounded-lg shadow-lg p-4 z-50 border-2 border-zen-gold`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start mb-2">
          <LightbulbIcon className="text-zen-gold h-6 w-6 mr-2 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-cinzel text-jungle-green text-lg">{currentStep.title}</h3>
            <p className="text-gray-700 mt-1">{currentStep.content}</p>
          </div>
        </div>
        
        <div className="flex justify-between mt-4">
          {/* Skip button */}
          {onSkip && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-gray-500 hover:bg-gray-100"
              onClick={onSkip}
            >
              Skip Tutorial
            </Button>
          )}
          
          {/* Next/Start Playing button */}
          <Button 
            variant="default" 
            size="sm" 
            className="bg-zen-gold text-jungle-green hover:bg-zen-gold/90"
            onClick={onNext}
          >
            {step < tutorialSteps.length - 1 ? "Next" : "Start Playing"}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-center mt-2">
          <div className="text-xs text-gray-400">
            Step {step + 1} of {tutorialSteps.length}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TutorialOverlay;
