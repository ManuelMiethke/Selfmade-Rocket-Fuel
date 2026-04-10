import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Droplets, Info, ArrowRight, ArrowLeft, RefreshCw, Flame, CheckCircle2, Wheat, Beaker, Zap, Waves, Hexagon, Grid, Sparkles, Droplet } from 'lucide-react';
import './index.css';
import { calculateRecipe, safeNum, type CalculatorInputs, type Intensity } from './calculator';

const pageVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.3, ease: "easeIn" as const } }
};

function App() {
  const [step, setStep] = useState(1);
  const [ratioPreset, setRatioPreset] = useState<'1:0.8' | '2:1' | 'Custom'>('2:1');
  const [inputs, setInputs] = useState<CalculatorInputs>({
    carbTarget: 90,
    volume: 500,
    ratio: { glucose: 2, fructose: 1 },
    useSyrup: false,
    syrupMixRatioWater: 6,
    syrupSugarPer100mlPrepared: 7,
    syrupTasteIntensity: 3,
    sweatRate: 3,
  });

  const updateInput = <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleRatioPreset = (preset: '1:0.8' | '2:1' | 'Custom') => {
    setRatioPreset(preset);
    if (preset === '1:0.8') updateInput('ratio', { glucose: 1, fructose: 0.8 });
    if (preset === '2:1') updateInput('ratio', { glucose: 2, fructose: 1 });
  };

  const renderStep1 = () => (
    <motion.div className="step-container" variants={pageVariants} initial="initial" animate="animate" exit="exit" key="step1">
      <h2>Base Parameters</h2>
      <p className="text-muted" style={{ marginBottom: '20px' }}>
        How many carbohydrates and liquid do you need?
      </p>

      <div className="form-group">
        <label><Target size={20} className="text-muted" /> Carb Target (g)</label>
        <div className="input-icon-wrapper">
          <Wheat size={20} />
          <input 
            type="text" inputMode="decimal"
            value={inputs.carbTarget} 
            onChange={e => updateInput('carbTarget', e.target.value)} 
          />
        </div>
      </div>

      <div className="form-group">
        <label><Droplets size={20} className="text-muted" /> Liquid Volume (ml)</label>
        <div className="input-icon-wrapper">
          <Beaker size={20} />
          <input 
            type="text" inputMode="decimal"
            value={inputs.volume} 
            onChange={e => updateInput('volume', e.target.value)} 
          />
        </div>
      </div>

      <div className="form-group">
        <label><Zap size={20} className="text-muted" /> Glucose:Fructose Ratio</label>
        <div className="radio-group" style={{ marginBottom: ratioPreset === 'Custom' ? '15px' : '0' }}>
          <div 
            className={`radio-btn ${ratioPreset === '2:1' ? 'selected' : ''}`}
            onClick={() => handleRatioPreset('2:1')}
          >
            2 : 1
          </div>
          <div 
            className={`radio-btn ${ratioPreset === '1:0.8' ? 'selected' : ''}`}
            onClick={() => handleRatioPreset('1:0.8')}
          >
            1 : 0.8
          </div>
          <div 
            className={`radio-btn ${ratioPreset === 'Custom' ? 'selected' : ''}`}
            onClick={() => handleRatioPreset('Custom')}
          >
            Custom
          </div>
        </div>
        
        <AnimatePresence>
          {ratioPreset === 'Custom' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              style={{ display: 'flex', gap: '15px', alignItems: 'center', overflow: 'hidden' }}
            >
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '1rem', marginBottom: '4px' }}>Glucose</label>
                <input 
                  type="text" inputMode="decimal"
                  value={inputs.ratio.glucose} 
                  onChange={e => updateInput('ratio', { ...inputs.ratio, glucose: e.target.value })} 
                  style={{ paddingLeft: '16px' }}
                />
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '30px' }}>:</span>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '1rem', marginBottom: '4px' }}>Fructose</label>
                <input 
                  type="text" inputMode="decimal"
                  value={inputs.ratio.fructose} 
                  onChange={e => updateInput('ratio', { ...inputs.ratio, fructose: e.target.value })} 
                  style={{ paddingLeft: '16px' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div className="step-container" variants={pageVariants} initial="initial" animate="animate" exit="exit" key="step2">
      <h2>Ingredients</h2>
      
      <div className="info-box">
        <Info size={24} style={{ flexShrink: 0, color: 'var(--primary-color)' }} />
        <div>
          <p><strong>Base Ingredients:</strong></p>
          <ul style={{ marginLeft: '25px', marginTop: '10px' }}>
            <li>Maltodextrin (100% Glucose)</li>
            <li>Table Sugar (50% Glucose, 50% Fructose)</li>
          </ul>
        </div>
      </div>

      <div className="form-group" style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <span style={{ fontWeight: 500, fontSize: '1.2rem' }}>Would you like to add syrup for flavor?</span>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={inputs.useSyrup} 
              onChange={e => updateInput('useSyrup', e.target.checked)} 
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
      
      <AnimatePresence>
        {inputs.useSyrup && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="info-box" 
            style={{ background: 'rgba(255, 255, 255, 0.05)', borderLeftColor: 'var(--text-muted)' }}
          >
            <CheckCircle2 size={24} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
            <p>Great, we will calculate the exact sugar from the syrup in the next step.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div className="step-container" variants={pageVariants} initial="initial" animate="animate" exit="exit" key="step3">
      <h2>Syrup Settings</h2>
      <p className="text-muted" style={{ marginBottom: '20px' }}>
        The bottle usually states the sugar content for the <strong>prepared drink</strong>.
      </p>

      <div className="form-group">
        <label>Sugar per 100ml in the <strong>prepared drink</strong> (g)</label>
        <input 
          type="text" inputMode="decimal"
          value={inputs.syrupSugarPer100mlPrepared} 
          onChange={e => updateInput('syrupSugarPer100mlPrepared', e.target.value)} 
          style={{ paddingLeft: '16px' }}
        />
      </div>

      <div className="form-group">
        <label>Mix Ratio (1 part syrup : X parts water)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>1 : </span>
          <div style={{ flex: 1 }}>
            <input 
              type="text" inputMode="decimal"
              value={inputs.syrupMixRatioWater} 
              onChange={e => updateInput('syrupMixRatioWater', e.target.value)} 
              style={{ paddingLeft: '16px' }}
            />
          </div>
        </div>
      </div>
      
      <div className="info-box">
        <Info size={24} style={{ flexShrink: 0, color: 'var(--primary-color)' }} />
        <p>Calculated sugar in <strong>pure syrup</strong>: <br/> 
        <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>{Math.round(safeNum(inputs.syrupSugarPer100mlPrepared) * (1 + safeNum(inputs.syrupMixRatioWater)))}g</span> per 100ml</p>
      </div>

      <div className="form-group">
        <label>How strong should the syrup flavor be?</label>
        <div className="radio-group">
          {([1, 2, 3, 4, 5] as Intensity[]).map((intensity) => (
            <div 
              key={intensity}
              className={`radio-btn ${inputs.syrupTasteIntensity === intensity ? 'selected' : ''}`}
              onClick={() => updateInput('syrupTasteIntensity', intensity)}
              style={{ fontSize: '0.9rem', padding: '10px 5px' }}
            >
              {intensity === 1 ? 'Very Light' : 
               intensity === 2 ? 'Light' : 
               intensity === 3 ? 'Medium' : 
               intensity === 4 ? 'Strong' : 'Very Strong'}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div className="step-container" variants={pageVariants} initial="initial" animate="animate" exit="exit" key="step4">
      <h2>Sweat Rate & Sodium</h2>
      <p className="text-muted" style={{ marginBottom: '20px' }}>
        Sodium helps prevent cramps and aids fluid absorption.
      </p>

      <div className="form-group">
        <label><Flame size={20} className="text-muted" /> How much do you sweat?</label>
        <div className="radio-group">
          {([1, 2, 3, 4, 5] as Intensity[]).map((intensity) => (
            <div 
              key={intensity}
              className={`radio-btn ${inputs.sweatRate === intensity ? 'selected' : ''}`}
              onClick={() => updateInput('sweatRate', intensity)}
              style={{ fontSize: '0.9rem', padding: '10px 5px' }}
            >
              {intensity === 1 ? 'Very Low' : 
               intensity === 2 ? 'Low' : 
               intensity === 3 ? 'Normal' : 
               intensity === 4 ? 'High' : 'Very High'}
            </div>
          ))}
        </div>
      </div>
      
      <div className="info-box">
        <Info size={24} style={{ flexShrink: 0, color: 'var(--primary-color)' }} />
        <p>We calculate the required amount of table salt (sodium chloride) based on your sweat rate and drink volume.</p>
      </div>
    </motion.div>
  );

  const renderStep5 = () => {
    const recipe = calculateRecipe(inputs);
    
    return (
      <motion.div className="step-container" variants={pageVariants} initial="initial" animate="animate" exit="exit" key="step5">
        <h2>Your Recipe</h2>
        <p className="text-muted" style={{ marginBottom: '20px' }}>
          Here is the perfect mix for your {inputs.volume}ml drink with {inputs.carbTarget}g of carbs.
        </p>

        <motion.div 
          className="recipe-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <div className="recipe-item">
            <div className="recipe-item-name">
              <Hexagon size={24} color="#ffffff" />
              <span>Maltodextrin</span>
            </div>
            <span className="recipe-value" style={{ color: '#ffffff', background: 'rgba(255, 255, 255, 0.15)' }}>{recipe.maltodextrin} g</span>
          </div>
          <div className="recipe-item">
            <div className="recipe-item-name">
              <Grid size={24} color="#ffffff" />
              <span>Table Sugar</span>
            </div>
            <span className="recipe-value" style={{ color: '#ffffff', background: 'rgba(255, 255, 255, 0.15)' }}>{recipe.tableSugar} g</span>
          </div>
          {inputs.useSyrup && (
            <div className="recipe-item">
              <div className="recipe-item-name">
                <Droplet size={24} color="var(--primary-color)" />
                <span>Syrup</span>
              </div>
              <span className="recipe-value" style={{ color: 'var(--primary-color)', background: 'rgba(255, 71, 87, 0.15)' }}>{recipe.syrup} ml</span>
            </div>
          )}
          <div className="recipe-item">
            <div className="recipe-item-name">
              <Sparkles size={24} color="#ffffff" />
              <span>Salt</span>
            </div>
            <span className="recipe-value" style={{ color: '#ffffff', background: 'rgba(255, 255, 255, 0.15)' }}>{recipe.salt} g</span>
          </div>
          <div className="recipe-item">
            <div className="recipe-item-name">
              <Waves size={24} color="#3498db" />
              <span>Water</span>
            </div>
            <span className="recipe-value" style={{ color: '#3498db', background: 'rgba(52, 152, 219, 0.15)' }}>{recipe.water} ml</span>
          </div>
        </motion.div>
        
        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary" 
            onClick={() => setStep(1)} 
            style={{ width: '100%', margin: 0, justifyContent: 'center' }}
          >
            <RefreshCw size={20} />
            New Calculation
          </motion.button>
        </div>
      </motion.div>
    );
  };

  const totalSteps = inputs.useSyrup ? 5 : 4;
  
  const handleNext = () => {
    if (step === 2 && !inputs.useSyrup) {
      setStep(4);
    } else {
      setStep(s => Math.min(s + 1, 5));
    }
  };

  const handlePrev = () => {
    if (step === 4 && !inputs.useSyrup) {
      setStep(2);
    } else {
      setStep(s => Math.max(s - 1, 1));
    }
  };
  
  const displayStep = step === 4 && !inputs.useSyrup ? 3 : step === 5 && !inputs.useSyrup ? 4 : step;

  return (
    <>
      <div className="bg-animation"></div>
      <div className="app-container">
        <div className="header">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Selfmade Rocket Fuel
          </motion.h1>
        </div>

        <div className="progress-bar">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const s = index + 1;
            return (
              <motion.div 
                key={s} 
                className={`progress-step ${displayStep > s ? 'completed' : displayStep === s ? 'active' : ''}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: displayStep === s ? 1.15 : 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {displayStep > s ? <CheckCircle2 size={24} /> : s}
              </motion.div>
            );
          })}
        </div>

        <div className="step-content">
          <AnimatePresence mode="wait">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
          </AnimatePresence>
        </div>

        {step < 5 && (
          <div className="btn-container">
            {step > 1 ? (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary" 
                onClick={handlePrev}
              >
                <ArrowLeft size={20} /> Back
              </motion.button>
            ) : (
              <div></div>
            )}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary" 
              onClick={handleNext}
            >
              Next <ArrowRight size={20} />
            </motion.button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;