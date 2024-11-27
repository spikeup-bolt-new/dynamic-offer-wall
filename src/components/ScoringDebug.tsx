import React from 'react';
import type { ScoringDetails } from '../hooks/useOfferTypeScoring';

interface ScoringDebugProps {
  scoringDetails: ScoringDetails;
  recommendedOfferType: string;
  selectionPath: {
    steps: Array<{
      check: string;
      result: boolean;
      action: string;
    }>;
    finalFilters: {
      country: string;
      language: string;
      offerType: string;
    };
  } | null;
}

export function ScoringDebug({ scoringDetails, recommendedOfferType, selectionPath }: ScoringDebugProps) {
  if (!scoringDetails) return null;

  return (
    <div className="space-y-6 mb-8">
      {/* 1. Detected Categories */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">1. Detected Categories</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scoringDetails.detectedCategories.map((category) => (
            <div key={category} className="bg-gray-50 p-3 rounded">
              <div className="font-medium text-gray-700">{category}</div>
              <div className="text-gray-600">
                Value: {scoringDetails.categoryScores[category].value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Scoring Calculations */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">2. Scoring Calculations</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            {Object.entries(scoringDetails.categoryScores).map(([category, scores]) => (
              <div 
                key={category}
                className="bg-gray-50 p-3 rounded flex flex-wrap items-center gap-2"
              >
                <span className="font-medium min-w-[100px]">{category}:</span>
                <span className="text-gray-600">({scores.value || 'Unknown'})</span>
                <span>Raw Score: {scores.rawScore}</span>
                <span>×</span>
                <span>Weight: {scores.weight}</span>
                <span>=</span>
                <span className="font-medium">{scores.weightedScore}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium">Total Score</div>
                <div>{scoringDetails.totalScore.toFixed(2)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium">Maximum Score</div>
                <div>{scoringDetails.maxPossibleScore.toFixed(2)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="font-medium">Normalized Score</div>
                <div>{scoringDetails.normalizedScore.toFixed(2)}/100</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Offer Type Thresholds */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">3. Offer Type Thresholds</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <div className="font-medium">RevShare</div>
              <div>Score: 81-100 (top 20%)</div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="font-medium">Hybrid</div>
              <div>Score: 41-80 (middle 40%)</div>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <div className="font-medium">CPA</div>
              <div>Score: 0-40 (bottom 40%)</div>
            </div>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded">
            <div className="font-medium">Recommended Offer Type</div>
            <div className="text-lg font-semibold text-indigo-600">
              {recommendedOfferType || 'None'}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Filter Selection Process */}
      {selectionPath && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">4. Filter Selection Process</h3>
          <div className="space-y-4">
            <div className="space-y-2 font-mono text-sm">
              {selectionPath.steps.map((step, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded ${
                    step.check.startsWith('ELSE')
                      ? 'bg-orange-50'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="text-gray-700 whitespace-pre-wrap">{step.check}</div>
                  <div 
                    className={`ml-4 ${
                      step.action.startsWith('✓')
                        ? 'text-green-600'
                        : step.action.startsWith('✗')
                          ? 'text-red-600'
                          : step.action.startsWith('→')
                            ? 'text-blue-600'
                            : 'text-gray-600'
                    }`}
                  >
                    {step.action}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <div className="font-medium mb-2">Final Filter Selection:</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="font-medium">Country</div>
                  <div>{selectionPath.finalFilters.country || 'All Countries'}</div>
                </div>
                <div>
                  <div className="font-medium">Language</div>
                  <div>{selectionPath.finalFilters.language || 'All Languages'}</div>
                </div>
                <div>
                  <div className="font-medium">Offer Type</div>
                  <div>{selectionPath.finalFilters.offerType || 'All Types'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}