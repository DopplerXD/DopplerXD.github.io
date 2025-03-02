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

export const zhNotes = defineNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [algorithm, interview, develop, solution, leetcode],
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

