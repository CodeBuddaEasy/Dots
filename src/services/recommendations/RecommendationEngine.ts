import { progressionSystem } from '../progression/ProgressionSystem';
import { nova } from '../ai/NovaAI';
import debounce from 'lodash/debounce';

interface Skill {
  id: string;
  name: string;
  level: number;
  experience: number;
  category: string;
  projects: string[];
  mentors: string[];
}

export interface SkillRecommendation {
  skillId: string;
  name: string;
  category: string;
  relevance: number;
  reason: string;
  prerequisites: string[];
  estimatedTimeToMaster: string;
}

export interface OpportunityRecommendation {
  opportunityId: string;
  title: string;
  description: string;
  matchScore: number;
  requiredSkills: string[];
  gainableSkills: string[];
  estimatedImpact: string;
  timeCommitment: string;
}

export interface LearningPathStep {
  order: number;
  type: 'skill' | 'opportunity';
  id: string;
  name: string;
  description: string;
  estimatedDuration: string;
}

export interface LearningPathRecommendation {
  goalId: string;
  name: string;
  description: string;
  steps: LearningPathStep[];
  totalDuration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

class RecommendationEngine {
  private cachedRecommendations: {
    skills: SkillRecommendation[];
    opportunities: OpportunityRecommendation[];
    learningPaths: LearningPathRecommendation[];
    lastUpdate: number;
  } = {
    skills: [],
    opportunities: [],
    learningPaths: [],
    lastUpdate: 0
  };

  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  private refreshPromise: Promise<void> | null = null;

  // Debounce the refresh to prevent multiple simultaneous calls
  private debouncedRefresh = debounce(async () => {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const now = Date.now();
    if (now - this.cachedRecommendations.lastUpdate < this.CACHE_DURATION) {
      return;
    }

    this.refreshPromise = this.performRefresh();
    try {
      await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }, 1000);

  private async performRefresh() {
    const userProgress = progressionSystem.getProgress();
    const currentSkills = userProgress.skills;

    try {
      const [aiRecommendations, skillRecs, opportunityRecs] = await Promise.all([
        this.getAIRecommendations(userProgress),
        this.generateSkillRecommendations(currentSkills),
        this.generateOpportunityRecommendations(currentSkills)
      ]);

      this.cachedRecommendations = {
        skills: skillRecs,
        opportunities: opportunityRecs,
        learningPaths: this.generateLearningPaths(aiRecommendations),
        lastUpdate: Date.now()
      };
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
      if (this.cachedRecommendations.skills.length === 0) {
        this.cachedRecommendations = this.getFallbackRecommendations();
      }
    }
  }

  private async getAIRecommendations(userProgress: ReturnType<typeof progressionSystem.getProgress>): Promise<string> {
    try {
      const response = await nova.interact(`
        Based on the user's progress:
        - Current level: ${userProgress.level}
        - Total skills: ${userProgress.skills.length}
        - Achievements: ${userProgress.achievements.filter((a) => a.isUnlocked).length}
        
        Please provide personalized recommendations for:
        1. Skills they should develop next
        2. Opportunities that match their profile
        3. Learning paths to help them achieve their goals
      `);

      return response.message;
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      return '';
    }
  }

  private getFallbackRecommendations(): typeof this.cachedRecommendations {
    return {
      skills: [{
        skillId: 'web_basics',
        name: 'Web Development Fundamentals',
        category: 'Technology',
        relevance: 100,
        reason: 'Essential foundation for digital volunteering',
        prerequisites: [],
        estimatedTimeToMaster: '2 months'
      }],
      opportunities: [{
        opportunityId: 'starter_project',
        title: 'Community Website Project',
        description: 'Help build a simple website for a local community organization',
        matchScore: 100,
        requiredSkills: ['web_basics'],
        gainableSkills: ['html', 'css', 'javascript'],
        estimatedImpact: 'Help local organization establish online presence',
        timeCommitment: '5-10 hours/week'
      }],
      learningPaths: [{
        goalId: 'web_dev_starter',
        name: 'Web Development Foundation',
        description: 'Start your journey in web development',
        steps: [
          {
            order: 1,
            type: 'skill' as const,
            id: 'html_basics',
            name: 'HTML Fundamentals',
            description: 'Learn the basics of HTML',
            estimatedDuration: '2 weeks'
          }
        ],
        totalDuration: '2 weeks',
        difficulty: 'beginner'
      }],
      lastUpdate: Date.now()
    };
  }

  private generateSkillRecommendations(currentSkills: Skill[]): SkillRecommendation[] {
    // Use currentSkills to generate personalized recommendations
    const hasWebBasics = currentSkills.some(s => s.id === 'web_basics' && s.level >= 2);
    const hasProjectManagement = currentSkills.some(s => s.id === 'project_management' && s.level >= 1);

    const recommendations: SkillRecommendation[] = [];

    if (hasWebBasics) {
      recommendations.push({
        skillId: 'web_advanced',
        name: 'Advanced Web Development',
        category: 'Technology',
        relevance: 95,
        reason: 'Natural progression from your current web development skills',
        prerequisites: ['web_basics', 'react'],
        estimatedTimeToMaster: '3 months'
      });
    }

    if (hasProjectManagement) {
      recommendations.push({
        skillId: 'project_leadership',
        name: 'Project Leadership',
        category: 'Leadership',
        relevance: 85,
        reason: 'Complements your technical skills and opens new opportunities',
        prerequisites: ['project_management'],
        estimatedTimeToMaster: '6 months'
      });
    }

    return recommendations;
  }

  private generateOpportunityRecommendations(currentSkills: Skill[]): OpportunityRecommendation[] {
    // Use currentSkills to filter and rank opportunities
    const hasReact = currentSkills.some(s => s.id === 'react' && s.level >= 1);
    const hasWebBasics = currentSkills.some(s => s.id === 'web_basics' && s.level >= 1);

    if (hasReact && hasWebBasics) {
      return [{
        opportunityId: 'op1',
        title: 'Open Source Education Platform',
        description: 'Help build an education platform for underprivileged communities',
        matchScore: 92,
        requiredSkills: ['react', 'web_basics'],
        gainableSkills: ['api_design', 'project_leadership'],
        estimatedImpact: 'Potential to help 10,000+ students',
        timeCommitment: '10-15 hours/week'
      }];
    }

    return [];
  }

  private generateLearningPaths(aiSuggestions: string): LearningPathRecommendation[] {
    // Use AI suggestions to customize the learning path
    const paths: LearningPathRecommendation[] = [{
      goalId: 'full_stack_dev',
      name: 'Full Stack Developer Path',
      description: aiSuggestions.includes('backend') 
        ? 'Master both frontend and backend development with a focus on scalable architectures'
        : 'Master both frontend and backend development',
      steps: [
        {
          order: 1,
          type: 'skill',
          id: 'web_advanced',
          name: 'Advanced Web Development',
          description: aiSuggestions.includes('React')
            ? 'Master advanced React concepts and modern frontend development'
            : 'Master advanced frontend concepts',
          estimatedDuration: '3 months'
        },
        {
          order: 2,
          type: 'opportunity',
          id: 'op1',
          name: 'Open Source Education Platform',
          description: 'Apply your skills in a real project',
          estimatedDuration: '6 months'
        }
      ],
      totalDuration: '9 months',
      difficulty: aiSuggestions.includes('beginner') ? 'beginner' : 'intermediate'
    }];

    // Add additional paths based on AI suggestions
    if (aiSuggestions.includes('leadership') || aiSuggestions.includes('management')) {
      paths.push({
        goalId: 'tech_lead',
        name: 'Technical Leadership Path',
        description: 'Develop the skills needed to lead technical teams and projects',
        steps: [
          {
            order: 1,
            type: 'skill',
            id: 'project_management',
            name: 'Project Management Fundamentals',
            description: 'Learn the basics of project management and team coordination',
            estimatedDuration: '2 months'
          },
          {
            order: 2,
            type: 'skill',
            id: 'team_leadership',
            name: 'Team Leadership',
            description: 'Develop leadership skills and learn to manage technical teams',
            estimatedDuration: '4 months'
          }
        ],
        totalDuration: '6 months',
        difficulty: 'intermediate'
      });
    }

    return paths;
  }

  public async getSkillRecommendations(): Promise<SkillRecommendation[]> {
    await this.debouncedRefresh();
    return this.cachedRecommendations.skills;
  }

  public async getOpportunityRecommendations(): Promise<OpportunityRecommendation[]> {
    await this.debouncedRefresh();
    return this.cachedRecommendations.opportunities;
  }

  public async getLearningPathRecommendations(): Promise<LearningPathRecommendation[]> {
    await this.debouncedRefresh();
    return this.cachedRecommendations.learningPaths;
  }

  public async getPersonalizedInsights(): Promise<string> {
    const userProgress = progressionSystem.getProgress();
    
    try {
      const response = await nova.interact(`
        Based on the user's progress:
        - Current level: ${userProgress.level}
        - Total skills: ${userProgress.skills.length}
        - Achievements: ${userProgress.achievements.filter(a => a.isUnlocked).length}
        
        Please provide personalized insights about their journey and suggestions for next steps.
      `);

      return response.message;
    } catch (error) {
      console.error('Error getting personalized insights:', error);
      return 'Focus on building your foundational skills and exploring opportunities that match your interests. Every small step counts towards making a difference!';
    }
  }
}

export const recommendationEngine = new RecommendationEngine(); 