import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Interview from '../models/Interview.js';
import mongoose from 'mongoose';

const DEMO_EMAIL = 'demo@intervyuh.app';
const DEMO_PASSWORD = 'demo1234';
const DEMO_NAME = 'Demo Student';

const INTERVIEWS = [
  {
    company: 'Adrta Technology',
    role: 'Python Developer',
    date: new Date('2026-07-29'),
    round: 'Technical',
    result: 'Rejected',
    rating: 2,
    wentWell: 'This was my first interview, so it gave me a clear understanding of what a real technical interview can be like.',
    wentWrong: 'I prepared for a non-technical interview, but the interviewer asked Python technical questions. I was not prepared for the actual role-based questions and was not even well prepared for my introduction.',
    questionsICouldntAnswer: 'Python technical questions asked during the interview.',
    keyLearning: 'Always prepare for role-specific questions, whether the interview is technical or non-technical.',
    whatToImprove: 'Role-specific preparation, Python fundamentals, introduction / "Tell me about yourself", understanding the likely interview format.',
    topicsToPrepare: 'Python fundamentals and role-specific technical questions.',
    additionalNotes: 'This was my first interview and I considered it a poor interview overall.',
  },
  {
    company: 'Ace Analytics',
    role: 'Software Developer Trainee',
    date: new Date('2026-09-03'),
    round: 'Technical',
    result: 'Rejected',
    rating: 6,
    wentWell: 'I was able to answer DBMS and DSA questions. The interview lasted almost one hour.',
    wentWrong: 'React was an important skill for the role, but I had not prepared it well enough.',
    questionsICouldntAnswer: 'React-related questions.',
    keyLearning: 'Always prepare deeply for the primary skill that will be used in the role.',
    whatToImprove: 'React preparation, role-specific preparation, primary technology mentioned in the JD.',
    topicsToPrepare: 'React fundamentals and role-specific technical skills.',
    additionalNotes: 'This interview was much better than my first interview, but the lack of React preparation was a clear weakness.',
  },
  {
    company: "Biziverse",
    role: "Founder's Office Executive",
    date: new Date('2026-09-22'),
    round: 'Other',
    result: 'Pending',
    rating: 7.5,
    wentWell: 'The interview went well overall. The founder was friendly and the role was interesting. The biggest positive was that I researched the company and prepared extensively before the interview.',
    wentWrong: 'Some answers could have been more specific and better prepared, particularly questions around 1-year goals, 5-year goals, salary expectations, and recently read book and author. For the book question, I mentioned the Mahabharata but did not provide the author\'s name.',
    questionsICouldntAnswer: 'No major question was identified as completely unanswered.',
    keyLearning: 'Thorough company research and preparation significantly improve interview performance.',
    whatToImprove: 'Career goal answers, salary expectations, personal-interest questions, specificity of answers.',
    topicsToPrepare: '1-year goals, 5-year goals, salary expectations, recent book + author, company-specific questions.',
    additionalNotes: 'The interview felt significantly better than the first two.',
  },
  {
    company: 'Silicon Signals',
    role: 'Full Stack Developer',
    date: new Date('2026-09-23'),
    round: 'Technical + HR',
    result: 'Pending',
    rating: 8,
    wentWell: 'The technical round went very well. I cleared the technical round.',
    wentWrong: 'During the HR round, I struggled with the question: "What do you know about our company?" I had not researched the company properly. I also struggled with questions related to my freelance experience.',
    questionsICouldntAnswer: 'Company-related questions.',
    keyLearning: 'Always know the company before going into the interview. Prepare strong answers around freelance experience.',
    whatToImprove: 'Company research, freelance experience explanation, HR preparation, behavioral questions.',
    topicsToPrepare: 'Company overview, why this company?, freelance experience, client communication, project experience, HR questions.',
    additionalNotes: 'Technical performance was strong and the technical round was cleared. The weaknesses appeared mainly in HR preparation.',
  },
  {
    company: 'Cerebulb',
    role: 'Business Analyst',
    date: new Date('2026-09-24'),
    round: 'HR',
    result: 'Rejected',
    rating: 3,
    wentWell: 'The interview clearly identified a specific area I need to improve: understanding and explaining the Business Analyst role.',
    wentWrong: 'I was asked about the basic working/responsibilities of a Business Analyst and was unable to frame the answer properly. My English and answer framing became weak during the interview.',
    questionsICouldntAnswer: 'Basic Business Analyst role/work questions.',
    keyLearning: 'I need to understand the role and its basic responsibilities well enough to explain them clearly under pressure.',
    whatToImprove: 'Business Analyst fundamentals, answer framing, spoken English, communication under pressure.',
    topicsToPrepare: 'What does a Business Analyst do?, BRD, FRD, user stories, stakeholder management, Agile/Scrum, requirement gathering.',
    additionalNotes: 'This interview was a clear example of a role-knowledge and communication gap.',
  },
];

async function seed() {
  await connectDB();

  let user = await User.findOne({ email: DEMO_EMAIL });
  if (!user) {
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
    user = await User.create({ name: DEMO_NAME, email: DEMO_EMAIL, passwordHash });
    console.log(`Created demo user: ${DEMO_EMAIL}`);
  } else {
    console.log('Demo user already exists, reusing it.');
  }

  let inserted = 0;
  for (const interview of INTERVIEWS) {
    const exists = await Interview.findOne({
      userId: user._id,
      company: interview.company,
      role: interview.role,
      date: interview.date,
    });
    if (exists) continue;
    await Interview.create({ ...interview, userId: user._id });
    inserted += 1;
  }

  console.log(`Seed complete. Inserted ${inserted} new interview(s).`);
  console.log(`Demo login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
