const db = require("../../database");

const getAllQuizzes = async (userId) => {
  const [rows] = await db.execute(
    `
    SELECT 
        q.IDQuiz,
        q.responseVerification,
        q.category,
        q.description AS quizDescription,
        q.dateOfCreation,
        q.available,
        q.experience,
        uq.status AS userStatus,

        r.IDReward,
        r.name AS rewardName,
        r.description AS rewardDescription,
        r.type AS rewardType,
        r.value AS rewardValue,

        mon.type AS monetaryType,
        mon.value AS monetaryValue,
        mon.dateReceived,
        mon.expiresAt,
        sr.name AS statusRewardName,
        br.extraCoins AS boostExtraCoins,
        ir.extraCoins AS impactExtraCoins,

        ques.IDQuestion,
        ques.question,
        ques.answer,
        ques.wrongAnswers

    FROM quiz q
    LEFT JOIN userQuizzes uq 
        ON q.IDQuiz = uq.IDQuiz AND uq.IDUser = ?
    LEFT JOIN quizRewards qr 
        ON q.IDQuiz = qr.IDQuiz
    LEFT JOIN rewards r 
        ON qr.IDReward = r.IDReward
    LEFT JOIN monetaryReward mon 
        ON r.IDReward = mon.IDReward
    LEFT JOIN statusReward sr 
        ON r.IDReward = sr.IDReward
    LEFT JOIN boostReward br 
        ON r.IDReward = br.IDReward
    LEFT JOIN impactReward ir 
        ON r.IDReward = ir.IDReward
    LEFT JOIN question ques
        ON q.IDQuiz = ques.IDQuiz
    ORDER BY q.IDQuiz, r.IDReward, ques.IDQuestion
    `,
    [userId]
  );

  const quizzesMap = {};

  rows.forEach(row => {
    const quizId = row.IDQuiz;
    
    if (!quizzesMap[quizId]) {
      quizzesMap[quizId] = {
        IDQuiz: row.IDQuiz,
        responseVerification: row.responseVerification,
        category: row.category,
        quizDescription: row.quizDescription,
        dateOfCreation: row.dateOfCreation,
        available: row.available,
        experience: row.experience,
        isCompleted: row.userStatus || 0,
        rewards: [],
        questions: []
      };
    }

    if (row.IDReward) {
      const existingReward = quizzesMap[quizId].rewards.find(r => r.IDReward === row.IDReward);
      
      if (!existingReward) {
        const reward = {
          IDReward: row.IDReward,
          name: row.rewardName,
          description: row.rewardDescription,
          type: row.rewardType,
          value: row.rewardValue,
          monetary: row.monetaryType ? {
            type: row.monetaryType,
            value: row.monetaryValue,
            dateReceived: row.dateReceived,
            expiresAt: row.expiresAt,
          } : null,
          statusReward: row.statusRewardName ? {
            name: row.statusRewardName
          } : null,
          boostReward: row.boostExtraCoins ? {
            extraCoins: row.boostExtraCoins
          } : null,
          impactReward: row.impactExtraCoins ? {
            extraCoins: row.impactExtraCoins
          } : null
        };

        quizzesMap[quizId].rewards.push(reward);
      }
    }

    // Agregar preguntas con wrongAnswers
    if (row.IDQuestion) {
      const existingQuestion = quizzesMap[quizId].questions.find(q => q.IDQuestion === row.IDQuestion);
      
      if (!existingQuestion) {
        const question = {
          IDQuestion: row.IDQuestion,
          question: row.question,
          answer: row.answer,
          wrongAnswers: row.wrongAnswers
        };

        quizzesMap[quizId].questions.push(question);
      }
    }
  });

  return Object.values(quizzesMap);
};

// Obtener UN quiz específico con sus preguntas (para resolverlo)
const getQuizById = async (quizId) => {
  const [rows] = await db.execute(
    `
    SELECT 
        q.IDQuiz,
        q.responseVerification,
        q.category,
        q.description AS quizDescription,
        q.dateOfCreation,
        q.available,
        q.experience,

        r.IDReward,
        r.name AS rewardName,
        r.description AS rewardDescription,
        r.type AS rewardType,
        r.value AS rewardValue,

        mon.type AS monetaryType,
        mon.value AS monetaryValue,
        mon.dateReceived,
        mon.expiresAt,
        sr.name AS statusRewardName,
        br.extraCoins AS boostExtraCoins,
        ir.extraCoins AS impactExtraCoins,

        ques.IDQuestion,
        ques.question,
        ques.answer,
        ques.wrongAnswers

    FROM quiz q
    LEFT JOIN quizRewards qr 
        ON q.IDQuiz = qr.IDQuiz
    LEFT JOIN rewards r 
        ON qr.IDReward = r.IDReward
    LEFT JOIN monetaryReward mon 
        ON r.IDReward = mon.IDReward
    LEFT JOIN statusReward sr 
        ON r.IDReward = sr.IDReward
    LEFT JOIN boostReward br 
        ON r.IDReward = br.IDReward
    LEFT JOIN impactReward ir 
        ON r.IDReward = ir.IDReward
    LEFT JOIN question ques
        ON q.IDQuiz = ques.IDQuiz
    WHERE q.IDQuiz = ?
    ORDER BY r.IDReward, ques.IDQuestion
    `,
    [quizId]
  );

  if (rows.length === 0) {
    return null;
  }

  const firstRow = rows[0];
  
  const quiz = {
    IDQuiz: firstRow.IDQuiz,
    responseVerification: firstRow.responseVerification,
    category: firstRow.category,
    quizDescription: firstRow.quizDescription,
    dateOfCreation: firstRow.dateOfCreation,
    available: firstRow.available,
    experience: firstRow.experience,
    rewards: [],
    questions: []
  };

  rows.forEach(row => {
    if (row.IDReward) {
      const existingReward = quiz.rewards.find(r => r.IDReward === row.IDReward);
      
      if (!existingReward) {
        const reward = {
          IDReward: row.IDReward,
          name: row.rewardName,
          description: row.rewardDescription,
          type: row.rewardType,
          value: row.rewardValue,
          monetary: row.monetaryType ? {
            type: row.monetaryType,
            value: row.monetaryValue,
            dateReceived: row.dateReceived,
            expiresAt: row.expiresAt,
          } : null,
          statusReward: row.statusRewardName ? {
            name: row.statusRewardName
          } : null,
          boostReward: row.boostExtraCoins ? {
            extraCoins: row.boostExtraCoins
          } : null,
          impactReward: row.impactExtraCoins ? {
            extraCoins: row.impactExtraCoins
          } : null
        };

        quiz.rewards.push(reward);
      }
    }

    if (row.IDQuestion) {
      const existingQuestion = quiz.questions.find(q => q.IDQuestion === row.IDQuestion);
      
      if (!existingQuestion) {
        const question = {
          IDQuestion: row.IDQuestion,
          question: row.question,
          answer: row.answer,
          wrongAnswers: row.wrongAnswers
        };

        quiz.questions.push(question);
      }
    }
  });

  return quiz;
};


module.exports = { getAllQuizzes, getQuizById};


