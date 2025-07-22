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