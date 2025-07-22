import practiceSessionsData from "@/services/mockData/practiceSessions.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PracticeService {
  constructor() {
    this.sessions = [...practiceSessionsData];
  }

  async getAll() {
    await delay(300);
    return [...this.sessions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async getById(id) {
    await delay(200);
    const session = this.sessions.find(s => s.Id === parseInt(id));
    if (!session) {
      throw new Error("Practice session not found");
    }
    return { ...session };
  }

  async getByUserId(userId) {
    await delay(300);
    return this.sessions
      .filter(s => s.userId === parseInt(userId))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async getUserStats(userId) {
    await delay(350);
    const userSessions = await this.getByUserId(userId);
    
    const totalSessions = userSessions.length;
    const totalMinutes = userSessions.reduce((sum, session) => sum + session.duration, 0);
    const averageDuration = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
    const averageVoiceHealth = totalSessions > 0 
      ? Math.round(userSessions.reduce((sum, session) => sum + session.voiceHealth, 0) / totalSessions * 10) / 10 
      : 0;
    
    // Calculate streak (consecutive days with sessions)
    const sortedSessions = userSessions.sort((a, b) => new Date(b.date) - new Date(a.date));
    let currentStreak = 0;
    let currentDate = new Date();
    
    for (const session of sortedSessions) {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate - sessionDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === currentStreak) {
        currentStreak++;
        currentDate = new Date(sessionDate);
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      totalSessions,
      totalMinutes,
      averageDuration,
      averageVoiceHealth,
      currentStreak,
      sessionsThisWeek: userSessions.filter(s => {
        const sessionDate = new Date(s.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return sessionDate >= weekAgo;
      }).length
    };
  }

  async create(sessionData) {
    await delay(400);
    const newSession = {
      ...sessionData,
      Id: Math.max(...this.sessions.map(s => s.Id), 0) + 1,
      date: sessionData.date || new Date().toISOString()
    };
    this.sessions.push(newSession);
    return { ...newSession };
  }

  async update(id, sessionData) {
    await delay(300);
    const index = this.sessions.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Practice session not found");
    }
    
    this.sessions[index] = { ...this.sessions[index], ...sessionData };
    return { ...this.sessions[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.sessions.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Practice session not found");
    }
    
    const deletedSession = { ...this.sessions[index] };
    this.sessions.splice(index, 1);
    return deletedSession;
  }

  async getCalendarData(userId, year, month) {
    await delay(300);
    const userSessions = await this.getByUserId(userId);
    
    const calendarData = {};
    userSessions.forEach(session => {
      const date = new Date(session.date);
      if (date.getFullYear() === year && date.getMonth() === month) {
        const day = date.getDate();
        calendarData[day] = {
          practiced: true,
          duration: session.duration,
          voiceHealth: session.voiceHealth,
          exerciseCount: session.exercises.length
        };
      }
    });
    
    return calendarData;
  }
}

export default new PracticeService();