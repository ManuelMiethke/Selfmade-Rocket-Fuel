import { useState } from 'react';
import './index.css';
import { calculateRecipe, type CalculatorInputs, type Intensity } from './calculator';

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
    syrupTasteIntensity: 'Medium',
    sweatRate: 'Medium',
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
    <div className="step-container">
      <h2>Base Parameters</h2>
      <p className="text-muted" style={{ marginBottom: '20px' }}>
        How many carbohydrates and liquid do you need?
      </p>

      <div className="form-group">
        <label>Carb Target (g)</label>
        <input 
          type="number" 
          value={inputs.carbTarget} 
          onChange={e => updateInput('carbTarget', Number(e.target.value))} 
          min="1"
        />
      </div>

      <div className="form-group">
        <label>Liquid Volume (ml)</label>
        <input 
          type="number" 
          value={inputs.volume} 
          onChange={e => updateInput('volume', Number(e.target.value))} 
          min="100"
          step="100"
        />
      </div>

      <div className="form-group">
        <label>Glucose:Fructose Ratio</label>
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
        
        {ratioPreset === 'Custom' && (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '1rem', marginBottom: '4px' }}>Glucose</label>
              <input 
                type="number" 
                value={inputs.ratio.glucose} 
                onChange={e => updateInput('ratio', { ...inputs.ratio, glucose: Number(e.target.value) })} 
                min="0.1"
                step="0.1"
              />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '30px' }}>:</span>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '1rem', marginBottom: '4px' }}>Fructose</label>
              <input 
                type="number" 
                value={inputs.ratio.fructose} 
                onChange={e => updateInput('ratio', { ...inputs.ratio, fructose: Number(e.target.value) })} 
                min="0.1"
                step="0.1"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="step-container">
      <h2>Ingredients</h2>
      
      <div className="info-box">
        <p><strong>Base Ingredients:</strong></p>
        <ul style={{ marginLeft: '25px', marginTop: '10px' }}>
          <li>Maltodextrin (100% Glucose)</li>
          <li>Table Sugar (50% Glucose, 50% Fructose)</li>
        </ul>
      </div>

      <div className="form-group" style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-color)', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
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
      
      {inputs.useSyrup && (
        <div className="info-box" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderLeftColor: 'var(--text-color)' }}>
          <p>Great, we will calculate the exact sugar from the syrup in the next step.</p>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="step-container">
      <h2>Syrup Settings</h2>
      <p className="text-muted" style={{ marginBottom: '20px' }}>
        The bottle usually states the sugar content for the <strong>prepared drink</strong>.
      </p>

      <div className="form-group">
        <label>Mix Ratio (1 part syrup : X parts water)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', whiteSpace: 'nowrap' }}>1 : </span>
          <div style={{ flex: 1 }}>
            <input 
              type="number" 
              value={inputs.syrupMixRatioWater} 
              onChange={e => updateInput('syrupMixRatioWater', Number(e.target.value))} 
              min="1"
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Sugar per 100ml in the <strong>prepared drink</strong> (g)</label>
        <input 
          type="number" 
          value={inputs.syrupSugarPer100mlPrepared} 
          onChange={e => updateInput('syrupSugarPer100mlPrepared', Number(e.target.value))} 
          min="0"
          step="0.1"
        />
      </div>
      
      <div className="info-box">
        <p>Calculated sugar in <strong>pure syrup</strong>: <br/> 
        {Math.round(inputs.syrupSugarPer100mlPrepared * (1 + inputs.syrupMixRatioWater))}g per 100ml</p>
      </div>

      <div className="form-group">
        <label>How strong should the syrup flavor be?</label>
        <div className="radio-group">
          {['Low', 'Medium', 'High'].map((intensity) => (
            <div 
              key={intensity}
              className={`radio-btn ${inputs.syrupTasteIntensity === intensity ? 'selected' : ''}`}
              onClick={() => updateInput('syrupTasteIntensity', intensity as Intensity)}
            >
              {intensity === 'Low' ? 'Light' : intensity === 'Medium' ? 'Medium' : 'Strong'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="step-container">
      <h2>Sweat Rate & Sodium</h2>
      <p className="text-muted" style={{ marginBottom: '20px' }}>
        Sodium helps prevent cramps and aids fluid absorption.
      </p>

      <div className="form-group">
        <label>How much do you sweat?</label>
        <div className="radio-group">
          {['Low', 'Medium', 'High'].map((intensity) => (
            <div 
              key={intensity}
              className={`radio-btn ${inputs.sweatRate === intensity ? 'selected' : ''}`}
              onClick={() => updateInput('sweatRate', intensity as Intensity)}
            >
              {intensity === 'Low' ? 'Low' : intensity === 'Medium' ? 'Normal' : 'High'}
            </div>
          ))}
        </div>
      </div>
      
      <div className="info-box">
        <p>We calculate the required amount of table salt (sodium chloride) based on your sweat rate and drink volume.</p>
      </div>
    </div>
  );

  const renderStep5 = () => {
    const recipe = calculateRecipe(inputs);
    
    return (
      <div className="step-container">
        <h2>Your Recipe</h2>
        <p className="text-muted" style={{ marginBottom: '20px' }}>
          Here is the perfect mix for your {inputs.volume}ml drink with {inputs.carbTarget}g of carbs.
        </p>

        <div className="recipe-card">
          <div className="recipe-item">
            <span>Maltodextrin</span>
            <span className="recipe-value">{recipe.maltodextrin} g</span>
          </div>
          <div className="recipe-item">
            <span>Table Sugar</span>
            <span className="recipe-value">{recipe.tableSugar} g</span>
          </div>
          {inputs.useSyrup && (
            <div className="recipe-item">
              <span>Syrup</span>
              <span className="recipe-value">{recipe.syrup} ml</span>
            </div>
          )}
          <div className="recipe-item">
            <span>Salt</span>
            <span className="recipe-value">{recipe.salt} g</span>
          </div>
          <div className="recipe-item">
            <span>Water</span>
            <span className="recipe-value">{recipe.water} ml</span>
          </div>
        </div>
        
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button className="btn-primary" onClick={() => setStep(1)} style={{ width: '100%', margin: 0 }}>
            New Calculation
          </button>
        </div>
      </div>
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
    <div className="app-container">
      <div className="header">
        <h1>Selfmade Rocket Fuel</h1>
      </div>

      <div className="progress-bar">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const s = index + 1;
          return (
            <div 
              key={s} 
              className={`progress-step ${displayStep > s ? 'completed' : displayStep === s ? 'active' : ''}`}
            >
              {s}
            </div>
          );
        })}
      </div>

      <div className="step-content">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
      </div>

      {step < 5 && (
        <div className="btn-container">
          {step > 1 ? (
            <button className="btn-secondary" onClick={handlePrev}>Back</button>
          ) : (
            <div></div>
          )}
          <button className="btn-primary" onClick={handleNext}>Next</button>
        </div>
      )}
    </div>
  );
}

export default App;
