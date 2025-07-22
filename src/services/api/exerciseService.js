import exercisesData from "@/services/mockData/exercises.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ExerciseService {
  constructor() {
    this.exercises = [...exercisesData];
  }

  async getAll() {
    await delay(300);
    return [...this.exercises];
  }

  async getById(id) {
    await delay(200);
    const exercise = this.exercises.find(e => e.Id === parseInt(id));
    if (!exercise) {
      throw new Error("Exercise not found");
    }
    return { ...exercise };
  }

  async getByCategory(category) {
    await delay(250);
    return this.exercises.filter(e => e.category === category);
  }

  async getByDifficulty(difficulty) {
    await delay(250);
    return this.exercises.filter(e => e.difficulty === difficulty);
  }

async getRecommendations(userLevel, userGoals) {
    await delay(400);
    
    // Simple recommendation algorithm
    let recommended = [...this.exercises];
    
    // Filter by user level
    if (userLevel === "Beginner") {
      recommended = recommended.filter(e => e.difficulty !== "Advanced");
    } else if (userLevel === "Intermediate") {
      recommended = recommended.filter(e => e.difficulty !== "Advanced" || Math.random() > 0.7);
    }
    
    // Prioritize exercises that match user goals
    if (userGoals && userGoals.length > 0) {
      recommended = recommended.sort((a, b) => {
        const aMatches = a.targetAreas.filter(area => userGoals.includes(area)).length;
        const bMatches = b.targetAreas.filter(area => userGoals.includes(area)).length;
        return bMatches - aMatches;
      });
    }
    
    // Return top 4 recommendations
    return recommended.slice(0, 4);
  }

  async getAiRecommendations(userLevel, userGoals, dailyNeeds) {
    await delay(600);
    
    let recommended = [...this.exercises];
    
    // AI-enhanced filtering based on daily needs
    if (dailyNeeds) {
      const needsLower = dailyNeeds.toLowerCase();
      
      // Keyword matching for specific needs
      const keywordMap = {
        'breath': ['Breath Control', 'Breath Support', 'Endurance'],
        'high': ['Range Extension', 'Register Blending'],
        'low': ['Range Extension', 'Chest Voice'],
        'agility': ['Agility', 'Coordination', 'Articulation'],
        'tone': ['Tone Quality', 'Resonance', 'Voice Connection'],
        'warm': ['Warm-ups', 'Relaxation'],
        'pitch': ['Pitch Accuracy', 'Intonation'],
        'control': ['Dynamic Control', 'Breath Management'],
        'range': ['Range Extension', 'Register Blending', 'Vocal Flexibility'],
        'vowel': ['Vowel Clarity', 'Resonance'],
        'technique': ['Technique', 'Precision', 'Articulation']
      };

      // Score exercises based on relevance to daily needs
      recommended = recommended.map(exercise => {
        let relevanceScore = 0;
        
        for (const [keyword, areas] of Object.entries(keywordMap)) {
          if (needsLower.includes(keyword)) {
            const matches = exercise.targetAreas.filter(area => 
              areas.some(relevantArea => area.includes(relevantArea))
            ).length;
            relevanceScore += matches * 2;
          }
        }
        
        // Boost score if exercise name/instructions match needs
        if (exercise.name.toLowerCase().includes(needsLower.split(' ')[0]) ||
            exercise.instructions.toLowerCase().includes(needsLower.split(' ')[0])) {
          relevanceScore += 1;
        }
        
        return { ...exercise, aiScore: relevanceScore };
      });
      
      // Sort by AI relevance score
      recommended.sort((a, b) => b.aiScore - a.aiScore);
    }
    
    // Filter by user level
    if (userLevel === "Beginner") {
      recommended = recommended.filter(e => e.difficulty !== "Advanced");
    } else if (userLevel === "Intermediate") {
      recommended = recommended.filter(e => e.difficulty !== "Advanced" || Math.random() > 0.7);
    }
    
    // Secondary sort by user goals if provided
    if (userGoals && userGoals.length > 0) {
      recommended = recommended.sort((a, b) => {
        if (a.aiScore !== b.aiScore) return b.aiScore - a.aiScore;
        
        const aMatches = a.targetAreas.filter(area => userGoals.includes(area)).length;
        const bMatches = b.targetAreas.filter(area => userGoals.includes(area)).length;
        return bMatches - aMatches;
      });
    }
    
    // Return top 6 AI-curated recommendations
    return recommended.slice(0, 6).map(ex => {
      const { aiScore, ...exercise } = ex;
      return exercise;
    });
  }

  async create(exerciseData) {
    await delay(400);
    const newExercise = {
      ...exerciseData,
      Id: Math.max(...this.exercises.map(e => e.Id), 0) + 1
    };
    this.exercises.push(newExercise);
    return { ...newExercise };
  }

  async update(id, exerciseData) {
    await delay(300);
    const index = this.exercises.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Exercise not found");
    }
    
    this.exercises[index] = { ...this.exercises[index], ...exerciseData };
    return { ...this.exercises[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.exercises.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Exercise not found");
    }
    
    const deletedExercise = { ...this.exercises[index] };
    this.exercises.splice(index, 1);
    return deletedExercise;
  }
}

export default new ExerciseService();