import React from 'react';
import type { CalculationOutput } from '../lib/calculation';

interface OutputPanelProps {
  recipe: CalculationOutput;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ recipe }) => {
  const isTooConcentrated = recipe.water > 0 && (recipe.totalCarbs / recipe.water) * 500 > 90;
  const glucosePercentage = recipe.totalCarbs > 0 ? (recipe.glucose / recipe.totalCarbs) * 100 : 0;
  const fructosePercentage = recipe.totalCarbs > 0 ? (recipe.fructose / recipe.totalCarbs) * 100 : 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      {isTooConcentrated && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Warning!</strong>
          <span className="block sm:inline"> Drink is highly concentrated. This may cause GI issues.</span>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-white">Your Recipe</h2>

      <div className="grid grid-cols-2 gap-4 dark:text-gray-300">
        <div>
          <p className="font-bold text-gray-800 dark:text-white">Syrup:</p>
          <p>{recipe.syrup} ml</p>
        </div>
        <div>
          <p className="font-bold text-gray-800 dark:text-white">Maltodextrin:</p>
          <p>{recipe.maltodextrin} g</p>
        </div>
        <div>
          <p className="font-bold text-gray-800 dark:text-white">Sugar:</p>
          <p>{recipe.sugar} g</p>
        </div>
        <div>
          <p className="font-bold text-gray-800 dark:text-white">Salt:</p>
          <p>{recipe.salt} g</p>
        </div>
        <div>
          <p className="font-bold text-gray-800 dark:text-white">Water:</p>
          <p>Fill with water to {recipe.water} ml</p>
        </div>
      </div>

      <div className="mt-6 border-t pt-4 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-white">Macro Breakdown</h3>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 my-2 flex">
          <div
            className="bg-blue-500 h-4 rounded-l-full"
            style={{ width: `${glucosePercentage}%` }}
          ></div>
          <div
            className="bg-purple-500 h-4 rounded-r-full"
            style={{ width: `${fructosePercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-blue-500">Glucose</span>
          <span className="text-purple-500">Fructose</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2 dark:text-gray-300">
          <div>
            <p className="font-bold text-gray-800 dark:text-white">Total Carbs:</p>
            <p>{recipe.totalCarbs} g</p>
          </div>
          <div>
            <p className="font-bold text-gray-800 dark:text-white">Glucose:</p>
            <p>{recipe.glucose} g</p>
          </div>
          <div>
            <p className="font-bold text-gray-800 dark:text-white">Fructose:</p>
            <p>{recipe.fructose} g</p>
          </div>
          <div>
            <p className="font-bold text-gray-800 dark:text-white">Ratio Achieved:</p>
            <p>{recipe.ratio}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t pt-4 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-white">Hydration Info</h3>
        <div className="grid grid-cols-2 gap-4 mt-2 dark:text-gray-300">
          <div>
            <p className="font-bold text-gray-800 dark:text-white">Sodium:</p>
            <p>{recipe.sodium} mg</p>
          </div>
          <div>
            <p className="font-bold text-gray-800 dark:text-white">Sweat Level:</p>
            <p className="capitalize">{recipe.sweatLevel}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputPanel;
