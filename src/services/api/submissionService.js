import submissionsData from "@/services/mockData/submissions.json";
import userService from "./userService.js";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SubmissionService {
  constructor() {
    this.submissions = [...submissionsData];
  }

  async getAll() {
    await delay(400);
    const submissions = [...this.submissions];
    
    // Add user data to each submission
    const users = await userService.getAll();
    return submissions.map(submission => {
      const user = users.find(u => u.Id === submission.userId);
      return {
        ...submission,
        userName: user?.name || "Unknown User",
        userAvatar: user?.avatar || ""
      };
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async getById(id) {
    await delay(200);
    const submission = this.submissions.find(s => s.Id === parseInt(id));
    if (!submission) {
      throw new Error("Submission not found");
    }
    
    const user = await userService.getById(submission.userId);
    return {
      ...submission,
      userName: user.name,
      userAvatar: user.avatar || ""
    };
  }

  async getByUserId(userId) {
    await delay(300);
    const userSubmissions = this.submissions.filter(s => s.userId === parseInt(userId));
    return userSubmissions.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  async create(submissionData) {
    await delay(500);
    const newSubmission = {
      ...submissionData,
      Id: Math.max(...this.submissions.map(s => s.Id), 0) + 1,
      date: new Date().toISOString(),
      likes: 0,
      comments: []
    };
    this.submissions.push(newSubmission);
    return { ...newSubmission };
  }

  async update(id, submissionData) {
    await delay(300);
    const index = this.submissions.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Submission not found");
    }
    
    this.submissions[index] = { ...this.submissions[index], ...submissionData };
    return { ...this.submissions[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.submissions.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Submission not found");
    }
    
    const deletedSubmission = { ...this.submissions[index] };
    this.submissions.splice(index, 1);
    return deletedSubmission;
  }

  async toggleLike(submissionId, userId) {
    await delay(200);
    const submission = await this.getById(submissionId);
    const newLikes = submission.likes + 1; // Simplified - just increment
    return await this.update(submissionId, { likes: newLikes });
  }

  async addComment(submissionId, userId, text) {
    await delay(300);
    const submission = await this.getById(submissionId);
    const user = await userService.getById(userId);
    
    const newComment = {
      id: Date.now(),
      userId: userId,
      userName: user.name,
      text: text,
      date: new Date().toISOString()
    };
    
    const updatedComments = [...submission.comments, newComment];
    return await this.update(submissionId, { comments: updatedComments });
  }
}

export default new SubmissionService();