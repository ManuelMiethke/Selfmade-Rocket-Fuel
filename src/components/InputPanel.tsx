import React from 'react';

interface InputPanelProps {
  carbTarget: number;
  setCarbTarget: (value: number) => void;
  bottleSize: number;
  setBottleSize: (value: number) => void;
  carbRatio: string;
  setCarbRatio: (value: string) => void;
  syrup: string;
  setSyrup: (value: string) => void;
  syrupSugar: number;
  setSyrupSugar: (value: number) => void;
  syrupAmount: number;
  setSyrupAmount: (value: number) => void;
  maltodextrin: boolean;
  setMaltodextrin: (value: boolean) => void;
  sugar: boolean;
  setSugar: (value: boolean) => void;
  sweatRate: string;
  setSweatRate: (value: string) => void;
}

const InputPanel: React.FC<InputPanelProps> = ({
  carbTarget,
  setCarbTarget,
  bottleSize,
  setBottleSize,
  carbRatio,
  setCarbRatio,
  syrup,
  setSyrup,
  syrupSugar,
  setSyrupSugar,
  syrupAmount,
  setSyrupAmount,
  maltodextrin,
  setMaltodextrin,
  sugar,
  setSugar,
  sweatRate,
  setSweatRate,
}) => {
  const syrupTemplates = [
    { name: 'Maple Syrup', sugar: 66 },
    { name: 'Elderflower Syrup', sugar: 77 },
    { name: 'Almdudler Syrup', sugar: 64 },
  ];

  const handleSyrupChange = (syrupName: string) => {
    setSyrup(syrupName);
    const template = syrupTemplates.find((s) => s.name === syrupName);
    if (template) {
      setSyrupSugar(template.sugar);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Targets</h2>

      <div className="mb-4">
        <label htmlFor="carbTarget" className="block text-gray-700 font-bold mb-2">
          Carb Target (grams)
        </label>
        <div className="flex items-center">
          <input
            type="range"
            id="carbTarget"
            min="30"
            max="150"
            value={carbTarget}
            onChange={(e) => setCarbTarget(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-4 font-bold text-gray-800">{carbTarget}g</span>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="bottleSize" className="block text-gray-700 font-bold mb-2">
          Bottle Size (ml)
        </label>
        <div className="flex items-center">
          <input
            type="range"
            id="bottleSize"
            min="250"
            max="1000"
            step="50"
            value={bottleSize}
            onChange={(e) => setBottleSize(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-4 font-bold text-gray-800">{bottleSize}ml</span>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="carbRatio" className="block text-gray-700 font-bold mb-2">
          Carb Ratio (Glucose:Fructose)
        </label>
        <select
          id="carbRatio"
          value={carbRatio}
          onChange={(e) => setCarbRatio(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="2:1">2:1</option>
          <option value="1:0.8">1:0.8</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Syrup</label>
        <div className="flex space-x-2 mb-2">
          {syrupTemplates.map((template) => (
            <button
              key={template.name}
              onClick={() => handleSyrupChange(template.name)}
              className={`p-2 border rounded ${
                syrup === template.name ? 'bg-blue-500 text-white' : ''
              }`}
            >
              {template.name}
            </button>
          ))}
          <button
            onClick={() => setSyrup('Custom')}
            className={`p-2 border rounded ${
              syrup === 'Custom' ? 'bg-blue-500 text-white' : ''
            }`}
          >
            Custom
          </button>
        </div>
        {syrup === 'Custom' && (
          <div className="mt-2">
            <label htmlFor="syrupSugar" className="block text-gray-700 font-bold mb-2">
              Sugar per 100ml pure syrup
            </label>
            <input
              type="number"
              id="syrupSugar"
              value={syrupSugar}
              onChange={(e) => setSyrupSugar(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="syrupAmount" className="block text-gray-700 font-bold mb-2">
          Syrup Amount (ml)
        </label>
        <div className="flex items-center">
          <input
            type="range"
            id="syrupAmount"
            min="0"
            max="200"
            value={syrupAmount}
            onChange={(e) => setSyrupAmount(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-4 font-bold text-gray-800">{syrupAmount}ml</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Ingredients</label>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="maltodextrin"
            checked={maltodextrin}
            onChange={(e) => setMaltodextrin(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="maltodextrin">Maltodextrin available</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="sugar"
            checked={sugar}
            onChange={(e) => setSugar(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="sugar">Table sugar available</label>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="sweatRate" className="block text-gray-700 font-bold mb-2">
          Sweat Rate
        </label>
        <div className="flex justify-between text-sm">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
        <input
          type="range"
          id="sweatRate"
          min="0"
          max="2"
          value={sweatRate === 'low' ? 0 : sweatRate === 'medium' ? 1 : 2}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value === 0) setSweatRate('low');
            else if (value === 1) setSweatRate('medium');
            else setSweatRate('high');
          }}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default InputPanel;
