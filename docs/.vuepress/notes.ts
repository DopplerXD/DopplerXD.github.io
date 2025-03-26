import { defineNoteConfig, defineNotesConfig } from 'vuepress-theme-plume'

/* =================== locale: zh-CN ======================= */

const algorithm = defineNoteConfig({
  dir: 'algorithm',
  link: '/algorithm/',
  sidebar: 'auto',
})

const interview = defineNoteConfig({
  dir: 'interview',
  link: '/interview/',
  sidebar: 'auto',
})

// 从 interview 分离出来, 设置为 note 但不在导航栏显示
const interview_questions = defineNoteConfig({
  dir: 'interview-questions',
  link: '/interview_questions/',
  sidebar: 'auto',
})

// 从 leetcode 分离出来, 设置为 note 但不在导航栏显示
const leetcode_problems = defineNoteConfig({
  dir: 'leetcode-problems',
  link: '/leetcode_problems/',
  sidebar: 'auto',
})

const develop = defineNoteConfig({
  dir: 'develop',
  link: '/develop/',
  sidebar: 'auto',
})

const solution = defineNoteConfig({
  dir: 'solution',
  link: '/solution/',
  sidebar: 'auto',
})

const leetcode = defineNoteConfig({
  dir: 'leetcode',
  link: '/leetcode/',
  sidebar: 'auto',
})

const resource_share = defineNoteConfig({
  dir: 'resource-share',
  link: '/resource-share/',
  sidebar: 'auto',
})

export const zhNotes = defineNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [algorithm, interview, develop, solution, leetcode, resource_share, interview_questions, leetcode_problems],
})

/* =================== locale: en-US ======================= */

const enDemoNote = defineNoteConfig({
  dir: 'demo',
  link: '/demo',
  sidebar: ['', 'foo', 'bar'],
})

export const enNotes = defineNotesConfig({
  dir: 'en/notes',
  link: '/en/',
  notes: [enDemoNote],
})

