// Basic (template-based) question generator — works fully offline

const questionTemplates = {
  easy: {
    openEnded: [
      "What is {topic}?",
      "Define {topic} in simple terms.",
      "Name three examples of {topic}.",
      "What are the basic characteristics of {topic}?",
      "Why is {topic} important?",
      "List the main components of {topic}.",
      "What are the uses of {topic}?",
      "Who uses {topic} and why?",
      "Describe {topic} in your own words.",
      "What do you understand by the term '{topic}'?",
    ],
    mcq: [
      { q: "Which of the following best describes {topic}?", type: "definition" },
      { q: "What is the primary purpose of {topic}?", type: "purpose" },
      { q: "{topic} is mainly used for which of the following?", type: "usage" },
      { q: "Which statement about {topic} is correct?", type: "fact" },
      { q: "What is a key feature of {topic}?", type: "feature" },
    ],
  },
  medium: {
    openEnded: [
      "Explain how {topic} works in detail.",
      "Compare and contrast {topic} with similar concepts.",
      "What are the advantages and disadvantages of {topic}?",
      "How has {topic} evolved over time?",
      "Describe a real-world application of {topic}.",
      "What are the key principles behind {topic}?",
      "How does {topic} impact everyday life?",
      "Explain the relationship between {topic} and related fields.",
      "What challenges are associated with {topic}?",
      "How would you implement {topic} in a practical scenario?",
    ],
    mcq: [
      { q: "Which of the following is an advantage of {topic}?", type: "advantage" },
      { q: "How does {topic} differ from its alternatives?", type: "comparison" },
      { q: "In which scenario is {topic} most effectively applied?", type: "application" },
      { q: "What is a common challenge when working with {topic}?", type: "challenge" },
      { q: "Which of the following best explains the working of {topic}?", type: "mechanism" },
    ],
  },
  hard: {
    openEnded: [
      "Critically analyze the role of {topic} in modern contexts.",
      "Evaluate the long-term implications of {topic} on society.",
      "Propose an innovative improvement to {topic} and justify your reasoning.",
      "How would you design a system that integrates {topic} for maximum efficiency?",
      "Debate the ethical considerations surrounding {topic}.",
      "Analyze the trade-offs involved in different approaches to {topic}.",
      "Formulate a hypothesis about the future of {topic} and support it with evidence.",
      "How does {topic} interact with complex systems? Provide a detailed analysis.",
      "Critique the current methods used in {topic} and suggest improvements.",
      "Design an experiment to test the effectiveness of {topic}.",
    ],
    mcq: [
      { q: "Which of the following best critiques the current approach to {topic}?", type: "critique" },
      { q: "What would be the most significant consequence of removing {topic} from modern systems?", type: "consequence" },
      { q: "Which advanced technique is most associated with optimizing {topic}?", type: "optimization" },
      { q: "How does {topic} interact with emerging technologies in its domain?", type: "integration" },
      { q: "Which of the following represents the most complex aspect of {topic}?", type: "complexity" },
    ],
  },
};

// MCQ option generators based on type
const generateMCQOptions = (topic, type, difficulty) => {
  const optionSets = {
    definition: [
      `A structured approach to understanding ${topic}`,
      `A method for avoiding ${topic}`,
      `An unrelated concept to ${topic}`,
      `A historical predecessor of ${topic}`,
    ],
    purpose: [
      `To improve efficiency and outcomes related to ${topic}`,
      `To eliminate the need for ${topic}`,
      `To complicate processes involving ${topic}`,
      `To replace all existing systems with ${topic}`,
    ],
    usage: [
      `Solving problems related to ${topic}`,
      `Preventing ${topic} from occurring`,
      `Documenting the history of ${topic}`,
      `Ignoring the implications of ${topic}`,
    ],
    fact: [
      `${topic} has wide applications across multiple domains`,
      `${topic} is only theoretical with no practical use`,
      `${topic} was invented in the 21st century only`,
      `${topic} works only in controlled environments`,
    ],
    feature: [
      `Scalability and adaptability in ${topic}`,
      `Complete rigidity of ${topic}`,
      `Isolation from external systems in ${topic}`,
      `Dependency on a single approach in ${topic}`,
    ],
    advantage: [
      `Increased efficiency and reliability`,
      `Decreased performance and accuracy`,
      `Complete system incompatibility`,
      `Reduced flexibility and scalability`,
    ],
    comparison: [
      `${topic} offers more flexibility than its alternatives`,
      `${topic} is identical to all its alternatives`,
      `${topic} performs worse than all alternatives`,
      `${topic} cannot be compared to similar concepts`,
    ],
    application: [
      `Large-scale systems requiring ${topic}`,
      `Systems that must avoid ${topic}`,
      `Legacy systems incompatible with ${topic}`,
      `Simple tasks that don't benefit from ${topic}`,
    ],
    challenge: [
      `Integration complexity and resource requirements`,
      `Simplicity that makes it hard to use`,
      `Lack of any real-world applications`,
      `Too many available implementations to choose from`,
    ],
    mechanism: [
      `Through a systematic process that leverages core principles of ${topic}`,
      `By randomly selecting outcomes related to ${topic}`,
      `By ignoring the fundamental aspects of ${topic}`,
      `Through a single fixed approach regardless of context`,
    ],
    critique: [
      `Current methods lack scalability in certain edge cases`,
      `The current approach is flawless and needs no improvement`,
      `There are no known issues with current ${topic} approaches`,
      `All current methods are too advanced for practical use`,
    ],
    consequence: [
      `Significant disruption to efficiency and established workflows`,
      `No impact whatsoever on existing systems`,
      `Immediate improvement in all performance metrics`,
      `Complete elimination of the problem domain`,
    ],
    optimization: [
      `Adaptive algorithms tailored to ${topic}'s specific requirements`,
      `Manual trial-and-error without systematic analysis`,
      `Ignoring feedback loops and iterative improvement`,
      `Applying a single universal solution to all cases`,
    ],
    integration: [
      `Through APIs and shared data models that complement ${topic}`,
      `By completely replacing emerging tech with ${topic}`,
      `${topic} is completely isolated from other technologies`,
      `By eliminating all emerging technologies in favor of ${topic}`,
    ],
    complexity: [
      `Managing the interactions between ${topic} and its environment`,
      `The simplicity of defining ${topic} in basic terms`,
      `The complete predictability of all ${topic} outcomes`,
      `The lack of any variables affecting ${topic}`,
    ],
  };

  const options = optionSets[type] || optionSets.definition;
  // Shuffle so correct answer isn't always first
  const shuffled = [...options];
  const correctAnswer = shuffled[0];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return { options: shuffled, answer: correctAnswer };
};

const generateBasicQuestions = (topic, count, difficulty, questionType) => {
  const level = difficulty.toLowerCase();
  const templates = questionTemplates[level] || questionTemplates.medium;
  const questions = [];

  if (questionType === "mcq") {
    const mcqTemplates = templates.mcq;
    for (let i = 0; i < count; i++) {
      const template = mcqTemplates[i % mcqTemplates.length];
      const questionText = template.q.replace(/{topic}/g, topic);
      const { options, answer } = generateMCQOptions(topic, template.type, level);
      questions.push({
        id: i + 1,
        question: questionText,
        type: "mcq",
        difficulty: level,
        options,
        answer,
        explanation: `This question tests your understanding of ${topic} at a ${level} level.`,
      });
    }
  } else {
    const openTemplates = templates.openEnded;
    for (let i = 0; i < count; i++) {
      const template = openTemplates[i % openTemplates.length];
      const questionText = template.replace(/{topic}/g, topic);
      questions.push({
        id: i + 1,
        question: questionText,
        type: "open-ended",
        difficulty: level,
        hint: `Think about the core aspects and real-world applications of ${topic}.`,
      });
    }
  }

  return questions;
};

module.exports = { generateBasicQuestions };
