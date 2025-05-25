import React from 'react';
import { Button } from '../ui';
import { RefinedOutputs } from '../../types';

interface RefinedOutputDisplayProps {
  refinedOutputs: RefinedOutputs;
  onStartNew: () => void;
}

export const RefinedOutputDisplay = React.memo<RefinedOutputDisplayProps>(({
  refinedOutputs,
  onStartNew,
}) => {
  const hasOutputs = refinedOutputs.better || refinedOutputs.best || refinedOutputs.corrected;

  if (!hasOutputs) {
    return null;
  }

  return (
    <div className="refined-output-area">
      <h2 className="section-title">Refined Results</h2>
      
      {refinedOutputs.corrected && (
        <div className="output-container corrected-input-container">
          <h4 className="output-heading">Corrected Input</h4>
          <pre>{refinedOutputs.corrected}</pre>
        </div>
      )}
      
      {refinedOutputs.better && (
        <div className="output-container better-output-container">
          <h4 className="output-heading">Better Version</h4>
          <pre>{refinedOutputs.better}</pre>
        </div>
      )}
      
      {refinedOutputs.best && (
        <div className="output-container best-output-container">
          <h4 className="output-heading">Best Version</h4>
          <pre>{refinedOutputs.best}</pre>
        </div>
      )}
      
      <Button 
        className="reset-button start-new-button"
        onClick={onStartNew}
        variant="secondary"
      >
        Start New Session
      </Button>
    </div>
  );
});
