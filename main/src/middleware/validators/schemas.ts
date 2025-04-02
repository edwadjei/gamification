// Validation schemas
export const userAnswerSchema = {
  userId: { type: 'uuid', required: true },
  elementId: { type: 'uuid', required: true },
  userAnswer: { type: 'number', required: true },
};

export const elementSchema = {
  eventId: { type: 'uuid', required: true },
  projectId: { type: 'uuid', required: true },
  scores: { type: 'number', required: true, positive: true },
};

export const rightAnswerSchema = {
  rightAnswer: { type: 'number', required: true },
};
