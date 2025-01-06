import React, { useState } from "react";

const ProblemSelector: React.FC = () => {
  const [selectedProblem, setSelectedProblem] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedProblem(event.target.value);
  };

  return (
    <div className="max-w-lg mx-auto">
      <fieldset className="mb-5">
        <legend className="sr-only">Type of Problem</legend>

        {/* Linear Regression */}
        <div className="flex items-center mb-4">
          <input
            id="problem-option-1"
            type="radio"
            name="problem_type"
            value="Linear_Regression"
            className="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
            checked={selectedProblem === "Linear_Regression"}
            onChange={handleChange}
          />
          <label
            htmlFor="problem-option-1"
            className="text-sm font-medium text-gray-900 ml-2 block"
          >
            Linear Regression
          </label>
        </div>

        {/* Time Series Forecasting */}
        <div className="flex items-center mb-4">
          <input
            id="problem-option-2"
            type="radio"
            name="problem_type"
            value="Time_Series_Forecasting"
            className="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
            checked={selectedProblem === "Time_Series_Forecasting"}
            onChange={handleChange}
          />
          <label
            htmlFor="problem-option-2"
            className="text-sm font-medium text-gray-900 ml-2 block"
          >
            Time Series Forecasting
          </label>
        </div>
      </fieldset>
    </div>
  );
};

export default ProblemSelector;
