export const sampleWorkspace = {
  name: 'Acme Startup',
  members: 12,
  groups: [
    {
      name: 'Engineering',
      visibility: 'Private invite link',
      modules: ['Kanban board', 'Issues tracker', 'Sprint log'],
    },
    {
      name: 'Operations',
      visibility: 'Workspace public',
      modules: ['Expenses', 'Approvals', 'Activity feed'],
    },
    {
      name: 'Leadership',
      visibility: 'Private',
      modules: ['Roadmap', 'Risks', 'Hiring tracker'],
    },
  ],
};

export const roadmap = [
  {
    phase: 'Phase 1 · Foundation',
    goal: 'Accounts, workspaces, groups, permissions, invitations, activity log, and the first Kanban workflow.',
    outcomes: ['Email/password auth', 'Workspace and group creation', 'Join requests and invite links', 'Task creation with audit history'],
  },
  {
    phase: 'Phase 2 · Collaboration',
    goal: 'Issues, comments, mentions, notifications, and dashboard summaries.',
    outcomes: ['Issue severity and tagging', 'Comments and @mentions', 'In-app notifications', 'Search and filtering'],
  },
  {
    phase: 'Phase 3 · Operations',
    goal: 'Expense tracker, approvals, reporting, exports, and automations.',
    outcomes: ['Expense submissions', 'Approval workflow', 'CSV export', 'Budget alerts and rules'],
  },
];

export const principles = [
  'Workspace > Group > Module hierarchy to keep the product flexible.',
  'Role-based access control from day one.',
  'Activity history on every important entity.',
  'Separate objects for tasks, issues, expenses, and membership events.',
  'Build vertically: one complete flow at a time with tests around it.',
];

export function getLandingMetrics() {
  return {
    workspaceCount: 1,
    groupCount: sampleWorkspace.groups.length,
    moduleCount: sampleWorkspace.groups.reduce((count, group) => count + group.modules.length, 0),
    recommendedNextStep: roadmap[0].phase,
  };
}
