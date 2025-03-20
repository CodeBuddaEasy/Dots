import { getEnvVar } from '../../utils/envLoader';

interface ProgressionConfig {
  levels: number;
  experienceMultiplier: number;
  achievementCategories: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  points: number;
  unlocked: boolean;
  requirements: string[];
  icon: string;
  challenge?: {
    description: string;
    steps: string[];
    currentStep: number;
  };
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  category: string;
  experience: number;
  unlocked: boolean;
}

type AchievementCallback = (achievement: Achievement) => void;

export class ProgressionSystem {
  private config: ProgressionConfig;
  private experience: number = 0;
  private level: number = 1;
  private skills: Skill[] = [];
  private achievements: Achievement[] = [];
  private subscribers: ((achievement: Achievement) => void)[] = [];

  constructor() {
    this.config = JSON.parse(getEnvVar('VITE_PROGRESSION_SYSTEM_CONFIG'));
    this.initializeAchievements();
    this.calculateLevel();
    this.initializeSkills();
  }

  private initializeAchievements() {
    // Initialize achievement templates based on categories
    this.config.achievementCategories.forEach(category => {
      this.achievements.push(
        {
          id: "first_commit",
          name: "First Steps",
          description: "Make your first code contribution",
          category: "Technical",
          points: 50,
          unlocked: false,
          requirements: ["Make a commit to any repository"],
          icon: "🚀",
          challenge: {
            description: "Start your coding journey by making your first contribution",
            steps: [
              "Fork a repository",
              "Make changes to the code",
              "Create a pull request"
            ],
            currentStep: 0
          }
        },
        {
          id: "bug_hunter",
          name: "Bug Hunter",
          description: "Find and fix your first bug",
          category: "Technical",
          points: 75,
          unlocked: false,
          requirements: ["Fix a reported bug"],
          icon: "🐛",
          challenge: {
            description: "Track down and squash your first bug",
            steps: [
              "Identify a bug in the issue tracker",
              "Reproduce the bug locally",
              "Fix the bug and test the solution"
            ],
            currentStep: 0
          }
        },
        
        // Community Achievements
        {
          id: "team_player",
          name: "Team Player",
          description: "Collaborate with others on a project",
          category: "Community",
          points: 100,
          unlocked: false,
          requirements: ["Work with at least 2 other contributors"],
          icon: "👥",
          challenge: {
            description: "Learn to work effectively in a team",
            steps: [
              "Join a project team",
              "Participate in team discussions",
              "Complete a task with team input"
            ],
            currentStep: 0
          }
        },
        {
          id: "mentor",
          name: "Mentor Spirit",
          description: "Help another member with their journey",
          category: "Community",
          points: 150,
          unlocked: false,
          requirements: ["Help resolve someone's question"],
          icon: "🎓",
          challenge: {
            description: "Share your knowledge with others",
            steps: [
              "Find someone who needs help",
              "Provide guidance and support",
              "Follow up on their progress"
            ],
            currentStep: 0
          }
        },
        
        // Creative Achievements
        {
          id: "innovator",
          name: "Innovator",
          description: "Propose a new feature or improvement",
          category: "Creative",
          points: 125,
          unlocked: false,
          requirements: ["Submit a feature proposal"],
          icon: "💡",
          challenge: {
            description: "Bring new ideas to life",
            steps: [
              "Identify an opportunity for improvement",
              "Draft a detailed proposal",
              "Present your idea to the community"
            ],
            currentStep: 0
          }
        },
        {
          id: "designer",
          name: "UI Artist",
          description: "Improve the user interface of any project",
          category: "Creative",
          points: 100,
          unlocked: false,
          requirements: ["Make UI/UX improvements"],
          icon: "🎨",
          challenge: {
            description: "Enhance the user experience through design",
            steps: [
              "Identify UI/UX issues",
              "Create mockups of improvements",
              "Implement the design changes"
            ],
            currentStep: 0
          }
        },
        
        // Leadership Achievements
        {
          id: "project_lead",
          name: "Project Pioneer",
          description: "Start your own project and gather contributors",
          category: "Leadership",
          points: 200,
          unlocked: false,
          requirements: ["Create and maintain a project"],
          icon: "👑",
          challenge: {
            description: "Lead your own open source project",
            steps: [
              "Create a project repository",
              "Write clear documentation",
              "Attract contributors"
            ],
            currentStep: 0
          }
        },
        {
          id: "community_builder",
          name: "Community Builder",
          description: "Organize a community event or workshop",
          category: "Leadership",
          points: 175,
          unlocked: false,
          requirements: ["Organize one community event"],
          icon: "🌟",
          challenge: {
            description: "Bring the community together",
            steps: [
              "Plan an event or workshop",
              "Promote the event",
              "Successfully host the event"
            ],
            currentStep: 0
          }
        }
      );
    });
  }

  private initializeSkills(): void {
    this.skills = [
      {
        id: 'coding',
        name: 'Coding',
        level: 1,
        maxLevel: 10,
        category: 'Technical',
        experience: 0,
        unlocked: true,
      },
      {
        id: 'design',
        name: 'Design',
        level: 1,
        maxLevel: 10,
        category: 'Creative',
        experience: 0,
        unlocked: true,
      },
      {
        id: 'leadership',
        name: 'Leadership',
        level: 1,
        maxLevel: 10,
        category: 'Soft Skills',
        experience: 0,
        unlocked: true,
      },
    ];
  }

  public addSkill(name: string, category: string): Skill {
    const skill: Skill = {
      id: `${category.toLowerCase()}_${name.toLowerCase().replace(/\s+/g, '_')}`,
      name,
      level: 1,
      maxLevel: 10,
      category,
      experience: 0,
      unlocked: true,
    };
    this.skills.push(skill);
    this.checkAchievements();
    return skill;
  }

  public addExperience(amount: number): void {
    const oldLevel = this.level;
    this.experience += amount;
    this.calculateLevel();
    
    if (this.level > oldLevel) {
      this.checkAchievements();
    }
  }

  private calculateLevel(): void {
    const baseXP = 100;
    const exponent = 1.5;
    this.level = Math.floor(Math.pow((this.experience / baseXP), (1 / exponent))) + 1;
  }

  public getLevel(): number {
    return this.level;
  }

  public getExperience(): number {
    return this.experience;
  }

  public getNextLevelExperience(): number {
    const baseXP = 100;
    const exponent = 1.5;
    return Math.ceil(Math.pow(this.level, exponent) * baseXP);
  }

  public getProgress() {
    return {
      level: this.level,
      experience: this.experience,
      nextLevelExperience: this.getNextLevelExperience(),
      skills: this.skills,
      achievements: this.achievements,
      progressPercentage: this.calculateLevelProgress()
    };
  }

  private calculateLevelProgress(): number {
    const currentLevelExp = Math.pow((this.level - 1), 2) * 100 * this.config.experienceMultiplier;
    const nextLevelExp = Math.pow(this.level, 2) * 100 * this.config.experienceMultiplier;
    const levelDiff = nextLevelExp - currentLevelExp;
    const currentDiff = this.experience - currentLevelExp;
    
    return (currentDiff / levelDiff) * 100;
  }

  public subscribeToAchievements(callback: AchievementCallback): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifyAchievementUnlocked(achievement: Achievement) {
    this.subscribers.forEach(callback => callback(achievement));
  }

  private checkAchievements(): void {
    if (this.level >= 5 && !this.achievements.find((a: Achievement) => a.id === "level_5")?.unlocked) {
      this.unlockAchievement("level_5");
    }
  }

  private unlockAchievement(achievementId: string): void {
    const achievement = this.achievements.find((a: Achievement) => a.id === achievementId);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      this.addExperience(achievement.points);
      this.notifyAchievementUnlocked(achievement);
    }
  }

  public advanceChallengeStep(achievementId: string): void {
    const achievement = this.achievements.find((a: Achievement) => a.id === achievementId);
    if (achievement?.challenge && achievement.challenge.currentStep < achievement.challenge.steps.length - 1) {
      achievement.challenge.currentStep++;
      if (achievement.challenge.currentStep === achievement.challenge.steps.length - 1) {
        this.unlockAchievement(achievementId);
      }
    }
  }

  public getSkills(): Skill[] {
    return this.skills;
  }

  public getAchievements(): Achievement[] {
    return this.achievements;
  }
}

export const progressionSystem = new ProgressionSystem(); 