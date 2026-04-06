import { useState } from 'react';
import './index.css';
import { calculateRecipe, type CalculatorInputs, type Intensity } from './calculator';

function App() {
  const [step, setStep] = useState(1);
  const [inputs, setInputs] = useState<CalculatorInputs>({
    carbTarget: 90,
    volume: 500,
    ratio: { glucose: 1, fructose: 0.8 },
    useSyrup: false,
    syrupMixRatioWater: 6,
    syrupSugarPer100mlPrepared: 7,
    syrupTasteIntensity: 'Medium',
    sweatRate: 'Medium',
  });

  const updateInput = <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const renderStep1 = () => (
    <div className="step-container">
      <h2>Basis-Parameter</h2>
      <p style={{ marginBottom: '20px', color: 'var(--border-color)' }}>
        Wie viel Kohlenhydrate und Flüssigkeit benötigst du?
      </p>

      <div className="form-group">
        <label>Kohlenhydrate Ziel (g)</label>
        <input 
          type="number" 
          value={inputs.carbTarget} 
          onChange={e => updateInput('carbTarget', Number(e.target.value))} 
          min="1"
        />
      </div>

      <div className="form-group">
        <label>Flüssigkeitsmenge (ml)</label>
        <input 
          type="number" 
          value={inputs.volume} 
          onChange={e => updateInput('volume', Number(e.target.value))} 
          min="100"
          step="100"
        />
      </div>

      <div className="form-group">
        <label>Verhältnis Glucose:Fructose</label>
        <div className="radio-group">
          <div 
            className={`radio-btn ${inputs.ratio.glucose === 1 && inputs.ratio.fructose === 0.8 ? 'selected' : ''}`}
            onClick={() => updateInput('ratio', { glucose: 1, fructose: 0.8 })}
          >
            1 : 0.8
          </div>
          <div 
            className={`radio-btn ${inputs.ratio.glucose === 2 && inputs.ratio.fructose === 1 ? 'selected' : ''}`}
            onClick={() => updateInput('ratio', { glucose: 2, fructose: 1 })}
          >
            2 : 1
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="step-container">
      <h2>Zutaten</h2>
      
      <div className="info-box">
        <p><strong>Basis-Zutaten:</strong> Maltodextrin (100% Glucose) und Haushaltszucker (50% Glucose, 50% Fructose).</p>
      </div>

      <div className="form-group">
        <label className="checkbox-group">
          <input 
            type="checkbox" 
            checked={inputs.useSyrup} 
            onChange={e => updateInput('useSyrup', e.target.checked)} 
          />
          <span>Möchtest du Sirup für den Geschmack hinzufügen?</span>
        </label>
      </div>
      
      {inputs.useSyrup && (
        <div className="info-box" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderLeftColor: 'var(--text-color)' }}>
          <p>Super, wir berechnen im nächsten Schritt genau, wie viel Zucker aus dem Sirup kommt.</p>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="step-container">
      <h2>Sirup-Einstellungen</h2>
      <p style={{ marginBottom: '20px', color: 'var(--border-color)' }}>
        Auf der Flasche steht meistens der Zuckergehalt für das <strong>fertige Getränk</strong>.
      </p>

      <div className="form-group">
        <label>Mischverhältnis (1 Teil Sirup : X Teile Wasser)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>1 : </span>
          <input 
            type="number" 
            value={inputs.syrupMixRatioWater} 
            onChange={e => updateInput('syrupMixRatioWater', Number(e.target.value))} 
            min="1"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Zucker pro 100ml im <strong>fertigen Getränk</strong> (g)</label>
        <input 
          type="number" 
          value={inputs.syrupSugarPer100mlPrepared} 
          onChange={e => updateInput('syrupSugarPer100mlPrepared', Number(e.target.value))} 
          min="0"
          step="0.1"
        />
      </div>
      
      <div className="info-box">
        <p>Berechneter Zuckergehalt im <strong>reinen Sirup</strong>: <br/> 
        {Math.round(inputs.syrupSugarPer100mlPrepared * (1 + inputs.syrupMixRatioWater))}g pro 100ml</p>
      </div>

      <div className="form-group">
        <label>Wie stark soll es nach Sirup schmecken?</label>
        <div className="radio-group">
          {['Low', 'Medium', 'High'].map((intensity) => (
            <div 
              key={intensity}
              className={`radio-btn ${inputs.syrupTasteIntensity === intensity ? 'selected' : ''}`}
              onClick={() => updateInput('syrupTasteIntensity', intensity as Intensity)}
            >
              {intensity === 'Low' ? 'Leicht' : intensity === 'Medium' ? 'Mittel' : 'Stark'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="step-container">
      <h2>Schweißrate & Natrium</h2>
      <p style={{ marginBottom: '20px', color: 'var(--border-color)' }}>
        Natrium hilft, Krämpfen vorzubeugen und die Flüssigkeit aufzunehmen.
      </p>

      <div className="form-group">
        <label>Wie stark schwitzt du?</label>
        <div className="radio-group">
          {['Low', 'Medium', 'High'].map((intensity) => (
            <div 
              key={intensity}
              className={`radio-btn ${inputs.sweatRate === intensity ? 'selected' : ''}`}
              onClick={() => updateInput('sweatRate', intensity as Intensity)}
            >
              {intensity === 'Low' ? 'Wenig' : intensity === 'Medium' ? 'Normal' : 'Stark'}
            </div>
          ))}
        </div>
      </div>
      
      <div className="info-box">
        <p>Wir berechnen die benötigte Menge an Kochsalz (Natriumchlorid) basierend auf der Schweißrate und Getränkemenge.</p>
      </div>
    </div>
  );

  const renderStep5 = () => {
    const recipe = calculateRecipe(inputs);
    
    return (
      <div className="step-container">
        <h2>Dein Rezept</h2>
        <p style={{ marginBottom: '20px', color: 'var(--border-color)' }}>
          Hier ist die perfekte Mischung für dein {inputs.volume}ml Getränk mit {inputs.carbTarget}g Kohlenhydraten.
        </p>

        <div className="recipe-card">
          <div className="recipe-item">
            <span>Maltodextrin</span>
            <span className="recipe-value">{recipe.maltodextrin} g</span>
          </div>
          <div className="recipe-item">
            <span>Haushaltszucker</span>
            <span className="recipe-value">{recipe.tableSugar} g</span>
          </div>
          {inputs.useSyrup && (
            <div className="recipe-item">
              <span>Sirup</span>
              <span className="recipe-value">{recipe.syrup} ml</span>
            </div>
          )}
          <div className="recipe-item">
            <span>Kochsalz</span>
            <span className="recipe-value">{recipe.salt} g</span>
          </div>
          <div className="recipe-item">
            <span>Wasser</span>
            <span className="recipe-value">{recipe.water} ml</span>
          </div>
        </div>
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button className="btn-primary" onClick={() => setStep(1)} style={{ width: '100%', margin: 0 }}>
            Neue Berechnung
          </button>
        </div>
      </div>
    );
  };

  const totalSteps = inputs.useSyrup ? 5 : 4;
  
  // Adjusted navigation logic to skip step 3 if syrup is not used
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
  
  // Calculate display step for the progress bar
  const displayStep = step === 4 && !inputs.useSyrup ? 3 : step === 5 && !inputs.useSyrup ? 4 : step;

  return (
    <div className="app-container">
      <div className="header">
        <h1>Rocket Fuel</h1>
        <p>Dein selfmade Sportgetränk</p>
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
            <button className="btn-secondary" onClick={handlePrev}>Zurück</button>
          ) : (
            <div></div> // empty div for flex spacing
          )}
          <button className="btn-primary" onClick={handleNext}>Weiter</button>
        </div>
      )}
    </div>
  );
}

export default App;