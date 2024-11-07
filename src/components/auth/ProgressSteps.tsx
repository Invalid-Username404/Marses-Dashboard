interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressSteps({
  currentStep,
  totalSteps,
}: ProgressStepsProps) {
  return (
    <div className="flex justify-center items-center gap-1 sm:gap-2 py-4">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center 
              justify-center text-sm sm:text-base transition-colors ${
                currentStep > index + 1
                  ? "bg-blue-600 text-white"
                  : currentStep === index + 1
                  ? "bg-blue-100 text-blue-600 border-2 border-blue-600"
                  : "bg-gray-100 text-gray-400"
              }`}
          >
            {index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div
              className={`w-8 sm:w-12 h-1 mx-1 sm:mx-2 transition-colors ${
                currentStep > index + 1 ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
