import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Badge } from '../common';
import { colors } from '../../styles/theme';
import { recommendationEngine } from '../../services/recommendations/RecommendationEngine';
import type { LearningPathRecommendation, SkillRecommendation, OpportunityRecommendation } from '../../services/recommendations/RecommendationEngine';

export const LearningPathsPanel: React.FC = () => {
  const [learningPaths, setLearningPaths] = useState<LearningPathRecommendation[]>([]);
  const [skillRecommendations, setSkillRecommendations] = useState<SkillRecommendation[]>([]);
  const [opportunityRecommendations, setOpportunityRecommendations] = useState<OpportunityRecommendation[]>([]);
  const [insights, setInsights] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      const [paths, skills, opportunities, personalInsights] = await Promise.all([
        recommendationEngine.getLearningPathRecommendations(),
        recommendationEngine.getSkillRecommendations(),
        recommendationEngine.getOpportunityRecommendations(),
        recommendationEngine.getPersonalizedInsights()
      ]);

      setLearningPaths(paths);
      setSkillRecommendations(skills);
      setOpportunityRecommendations(opportunities);
      setInsights(personalInsights);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
    setIsLoading(false);
  };

  const getDifficultyColor = (difficulty: LearningPathRecommendation['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'advanced':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4" />
          <p className="text-gray-400">Loading your learning paths...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Insights Card */}
      <Card
        variant="glass"
        header={
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Personalized Insights</h2>
            <Badge variant="info">AI Generated</Badge>
          </div>
        }
      >
        <p className="text-gray-300">{insights}</p>
      </Card>

      {/* Learning Paths */}
      <div>
        <h2 className={`text-xl font-semibold ${colors.text.primary} mb-4`}>
          Learning Paths
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningPaths.map((path) => (
            <Card
              key={path.goalId}
              variant="glass"
              hoverable
              className={selectedPath === path.goalId ? 'ring-2 ring-blue-500' : ''}
              onClick={() => setSelectedPath(path.goalId === selectedPath ? null : path.goalId)}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {path.name}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {path.description}
                    </p>
                  </div>
                  <Badge
                    variant="info"
                    className={getDifficultyColor(path.difficulty)}
                  >
                    {path.difficulty}
                  </Badge>
                </div>

                <AnimatePresence>
                  {selectedPath === path.goalId && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      {/* Timeline */}
                      <div className="relative pl-4 space-y-4">
                        {path.steps.map((step, index) => (
                          <div
                            key={`${step.type}-${step.id}`}
                            className="relative"
                          >
                            {/* Timeline line */}
                            {index < path.steps.length - 1 && (
                              <div className="absolute left-0 top-6 bottom-0 w-0.5 bg-gray-700" />
                            )}
                            {/* Timeline dot */}
                            <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-blue-500 -translate-x-[5px]" />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-300">
                                Step {step.order}: {step.name}
                              </div>
                              <div className="text-sm text-gray-400 mt-1">
                                {step.description}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Duration: {step.estimatedDuration}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                        <div className="text-sm text-gray-400">
                          Total Duration: {path.totalDuration}
                        </div>
                        <Button variant="primary" size="sm">
                          Start Path
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Skill Recommendations */}
      <div>
        <h2 className={`text-xl font-semibold ${colors.text.primary} mb-4`}>
          Recommended Skills
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillRecommendations.map((skill) => (
            <Card
              key={skill.skillId}
              variant="glass"
              hoverable
            >
              <div className="space-y-4">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {skill.name}
                    </h3>
                    <Badge variant="info">
                      {skill.relevance}% Match
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300">
                    {skill.reason}
                  </p>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-400 mb-2">
                    Prerequisites
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skill.prerequisites.map((prereq) => (
                      <Badge key={prereq} variant="default" size="sm">
                        {prereq}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div className="text-sm text-gray-400">
                    Est. Time: {skill.estimatedTimeToMaster}
                  </div>
                  <Button variant="primary" size="sm">
                    Start Learning
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Opportunity Recommendations */}
      <div>
        <h2 className={`text-xl font-semibold ${colors.text.primary} mb-4`}>
          Recommended Opportunities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunityRecommendations.map((opportunity) => (
            <Card
              key={opportunity.opportunityId}
              variant="glass"
              hoverable
            >
              <div className="space-y-4">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {opportunity.title}
                    </h3>
                    <Badge variant="success">
                      {opportunity.matchScore}% Match
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300">
                    {opportunity.description}
                  </p>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-400 mb-2">
                    Required Skills
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.requiredSkills.map((skill) => (
                      <Badge key={skill} variant="default" size="sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-400 mb-2">
                    Skills You'll Gain
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.gainableSkills.map((skill) => (
                      <Badge key={skill} variant="info" size="sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <div>
                    <div className="text-sm text-gray-300">
                      Impact: {opportunity.estimatedImpact}
                    </div>
                    <div className="text-sm text-gray-400">
                      Time: {opportunity.timeCommitment}
                    </div>
                  </div>
                  <Button variant="primary" size="sm">
                    Learn More
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}; 