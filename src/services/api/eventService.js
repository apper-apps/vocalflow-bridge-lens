import eventsData from "@/services/mockData/events.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class EventService {
  constructor() {
    this.events = [...eventsData];
  }

  async getAll() {
    await delay(300);
    return [...this.events].sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
  }

  async getById(id) {
    await delay(200);
    const event = this.events.find(e => e.Id === parseInt(id));
    if (!event) {
      throw new Error("Event not found");
    }
    return { ...event };
  }

  async getUpcoming() {
    await delay(250);
    const now = new Date();
    return this.events
      .filter(e => new Date(e.datetime) > now)
      .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
      .slice(0, 5);
  }

  async getByCategory(category) {
    await delay(250);
    return this.events.filter(e => e.category === category);
  }

  async create(eventData) {
    await delay(400);
    const newEvent = {
      ...eventData,
      Id: Math.max(...this.events.map(e => e.Id), 0) + 1,
      rsvpList: []
    };
    this.events.push(newEvent);
    return { ...newEvent };
  }

  async update(id, eventData) {
    await delay(300);
    const index = this.events.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Event not found");
    }
    
    this.events[index] = { ...this.events[index], ...eventData };
    return { ...this.events[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.events.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Event not found");
    }
    
    const deletedEvent = { ...this.events[index] };
    this.events.splice(index, 1);
    return deletedEvent;
  }

  async rsvp(eventId, userId) {
    await delay(200);
    const event = await this.getById(eventId);
    
    if (event.rsvpList.includes(userId)) {
      // User already RSVP'd, remove them
      const updatedRsvp = event.rsvpList.filter(id => id !== userId);
      return await this.update(eventId, { rsvpList: updatedRsvp });
    } else {
      // Add user to RSVP list
      const updatedRsvp = [...event.rsvpList, userId];
      return await this.update(eventId, { rsvpList: updatedRsvp });
    }
  }

  async getUserEvents(userId) {
    await delay(300);
    return this.events.filter(e => e.rsvpList.includes(userId));
  }
}

export default new EventService();