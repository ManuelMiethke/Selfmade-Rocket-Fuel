import { useState, useEffect } from 'react';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import { calculateRecipe, CalculationInput, CalculationOutput } from './lib/calculation';

function App() {
  const [carbTarget, setCarbTarget] = useState(90);
  const [bottleSize, setBottleSize] = useState(750);
  const [carbRatio, setCarbRatio] = useState('2:1');
  const [syrup, setSyrup] = useState('Maple Syrup');
  const [syrupSugar, setSyrupSugar] = useState(66);
  const [syrupAmount, setSyrupAmount] = useState(0);
  const [maltodextrin, setMaltodextrin] = useState(true);
  const [sugar, setSugar] = useState(true);
  const [sweatRate, setSweatRate] = useState('medium');
  const [recipe, setRecipe] = useState<CalculationOutput | null>(null);

  useEffect(() => {
    const input: CalculationInput = {
      carbTarget,
      bottleSize,
      carbRatio,
      syrup,
      syrupSugar,
      syrupAmount,
      maltodextrin,
      sugar,
      sweatRate,
    };
    setRecipe(calculateRecipe(input));
  }, [
    carbTarget,
    bottleSize,
    carbRatio,
    syrup,
    syrupSugar,
    syrupAmount,
    maltodextrin,
    sugar,
    sweatRate,
  ]);

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="container mx-auto p-4">
        <header className="text-center my-8">
          <h1 className="text-4xl font-bold text-gray-800">Selfmade Rocket Fuel</h1>
          <p className="text-gray-600">Your custom carb drink mix calculator</p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputPanel
            carbTarget={carbTarget}
            setCarbTarget={setCarbTarget}
            bottleSize={bottleSize}
            setBottleSize={setBottleSize}
            carbRatio={carbRatio}
            setCarbRatio={setCarbRatio}
            syrup={syrup}
            setSyrup={setSyrup}
            syrupSugar={syrupSugar}
            setSyrupSugar={setSyrupSugar}
            syrupAmount={syrupAmount}
            setSyrupAmount={setSyrupAmount}
            maltodextrin={maltodextrin}
            setMaltodextrin={setMaltodextrin}
            sugar={sugar}
            setSugar={setSugar}
            sweatRate={sweatRate}
            setSweatRate={setSweatRate}
          />

          {recipe && <OutputPanel recipe={recipe} />}
        </main>

        <footer className="text-center mt-12 text-sm text-gray-500">
          <p>Built with ❤️ for endurance athletes</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
