---
name: full-project-audit
description: Autonomous, production-grade frontend audit, verification, repair, testing, and re-audit workflow for web applications. Use to inspect, detect issues, prioritize backlog (P0-P3), verify root causes, safely fix frontend P0/P1 defects, run test suites, re-audit, and generate comprehensive audit reports.
---

# Full Project Frontend Audit Skill

Autonomous end-to-end frontend audit, verification, repair, testing, and re-audit workflow. This skill evaluates, stabilizes, and verifies production readiness across correctness, security, performance, accessibility, responsive design, type safety, state management, API integration, and date/time handling.

## Scope & Boundaries

* **FRONTEND ONLY**: The repository may contain backend code, databases, infrastructure, or third-party services. **Do NOT audit, modify, or refactor backend/database/infrastructure code** unless strictly necessary to understand a frontend integration contract.
* **Autonomous Execution**: Execute all steps (Audit → Backlog → Verify → Fix P0 → Test P0 → Fix P1 → Test P1 → Re-audit → Final Report) continuously without asking for confirmation between non-destructive steps.
* **Stop & Ask Triggers**: Pause and solicit user approval ONLY if:
  1. A destructive repository/data operation is required.
  2. Production credentials or secret variables need changing.
  3. Requirements are fundamentally ambiguous with multiple conflicting business interpretations.
  4. A proposed fix necessitates a major architectural rewrite.

---

## Workflow Overview

```text
STEP 1: Full Frontend Audit
   │
   ▼
STEP 2: Create Prioritized Backlog (P0 - P3)
   │
   ▼
STEP 3: Verify Findings (Trace Execution Flow & Classify)
   │
   ▼
STEP 4: Fix Confirmed P0 (Critical/Blocker Issues)
   │
   ▼
STEP 5: Test & Validate P0 Fixes (Typecheck, Lint, Tests, Build)
   │
   ▼
STEP 6: Fix Confirmed P1 (High Severity Issues)
   │
   ▼
STEP 7: Test & Validate P1 Fixes
   │
   ▼
STEP 8: Re-Audit Frontend
   │
   ▼
STEP 9: Secondary Fixes & Convergence Loop
   │
   ▼
STEP 10: Generate Final Report (`docs/audits/latest-audit.md`)
```

---

## STEP 1 — Full Frontend Audit

Inspect the frontend codebase before making any changes.

### 1. Identify Environment & Tech Stack
* **Framework**: Next.js (App/Pages Router), Vite, React, Vue, Svelte, Remix, Angular, etc.
* **Build Tool & Package Manager**: npm, pnpm, yarn, bun, Turbopack, Webpack, Vite, esbuild.
* **Routing**: Next.js App Router, React Router, TanStack Router, Vue Router, etc.
* **State Management**: Zustand, Redux Toolkit, Pinia, Jotai, Recoil, React Context.
* **Data Fetching & Cache**: TanStack Query (React Query), SWR, RTK Query, Apollo Client, Axios, native fetch.
* **UI & Styling**: Vanilla CSS, CSS Modules, Tailwind CSS, Shadcn UI, Radix UI, styled-components.
* **Forms & Validation**: React Hook Form, Formik, Zod, Yup, Valibot.
* **Auth State**: Cookies (HttpOnly), LocalStorage, JWT decoding, Session stores.
* **Testing & Linting**: Jest, Vitest, Playwright, Cypress, Testing Library, ESLint, TypeScript.

### 2. Comprehensive Multi-Axis Audit Matrix

| Dimension | Audit Checkpoints |
| :--- | :--- |
| **Architecture & Structure** | Folder hierarchy, component boundaries, separation of concerns, dependency cycles, dead code, duplicated logic, reusable hooks/services. |
| **Pages & Routing** | Route definitions, nested layouts, protected vs public routes, query/route parameters, safe redirects, 404/error handling, unauthorized flash prevention. |
| **Components** | Single responsibility, prop drilling, render performance, keys in lists, modal/dialog lifecycle, empty/loading/error states. |
| **State Management** | Global vs local vs server state, stale cache, race conditions, unmount leaks, optimistic update rollback. |
| **API Integration** | Client configuration, interceptors, token refresh queue, request cancellation, HTTP error unwrapping, contract alignment. |
| **Authentication & RBAC** | Login/logout flows, token expiry handling, permission gates, client-side UI affordance vs server security boundary. |
| **Forms & Validation** | Schema validation, submit blocking, double submission prevention, async validation, field reset behavior. |
| **Data Display** | Pagination, sorting, filtering, empty fallbacks, number/currency formatting, calculation accuracy on client. |
| **Date & Time** | UTC parsing, output timezone (`Asia/Ho_Chi_Minh`), ISO conversions, `datetime-local` input drift, day/month boundary shifts (`00:00`, `23:59`). |
| **Error Handling** | Error boundaries, unhandled promise rejections, toast notifications, fallback UI, error logging integrity. |
| **Loading & Empty States** | Skeletons, spinners, disabled mutation buttons, empty states differentiated from error states. |
| **Performance** | Image optimization (`next/image`), code splitting, memoization, debounce on search inputs, waterfall prevention. |
| **Security** | DOMPurify sanitization, iframe sandboxing, URL host whitelisting, Open Redirect prevention, no exposed secrets/env vars. |
| **Accessibility (a11y)** | Semantic HTML, ARIA attributes, keyboard focus management, no blocking `window.prompt`/`alert`, label associations. |
| **Responsive Design** | Mobile/tablet/desktop layouts, table horizontal scrolling (`overflow-x-auto`), touch targets, drawer sheets. |
| **Type Safety** | No arbitrary `any`, no `@ts-ignore` / `@ts-expect-error` without strict justification, Zod inference matching API types. |
| **Dependencies** | Redundant libraries, unused packages, security vulnerabilities, bundle bloat. |

---

## STEP 2 — Create Prioritized Backlog

Convert all findings into a structured backlog using standard severity tiers:

* **P0 (Critical)**: Production-breaking bugs, severe data loss/corruption, application crash, security vulnerability, broken critical user flows.
* **P1 (High)**: Major functional breakage, authentication failure, broken API integration, data sync inconsistency, severe state bug.
* **P2 (Medium)**: Non-breaking functional bug, missing debounce, suboptimal error message, accessibility deficiency, minor layout overflow.
* **P3 (Low)**: Minor UI inconsistency, maintainability improvement, code style cleanup, non-urgent refactor.

### Standard Finding Record Format

```text
[FINDING-XXX]

Severity: P0 | P1 | P2 | P3

File:
<file_path>

Line:
<start_line>-<end_line>

Module:
<module_or_component_name>

Vấn đề (Problem):
<clear_concise_description>

Tác động (Impact):
<user_and_system_impact>

Root cause:
<technical_root_cause_explanation>

Cách sửa đề xuất (Recommended fix):
<concrete_code_solution_or_diff>

Required test:
<exact_steps_to_verify_fix>
```

---

## STEP 3 — Verify Findings

Before applying code modifications, rigorously verify every **P0** and **P1** finding:
1. **Trace execution flow**: Follow variables, props, hooks, API calls, and state transitions end-to-end.
2. **Inspect related modules**: Verify if the issue is handled elsewhere in the tree or if assumptions were missed.
3. **Classify status**:
   - `CONFIRMED`: Verified defect with reproducible path.
   - `FALSE_POSITIVE`: Code behaves correctly under full context.
   - `NEEDS_MORE_INVESTIGATION`: Ambiguous; requires deeper trace before editing.

> **RULE**: Only `CONFIRMED` findings may be automatically modified.

---

## STEP 4 — Fix Confirmed P0 Issues

Resolve all confirmed P0 issues using the minimal, safest change:
* **Preserve Architecture**: Do not rewrite unrelated components or change global architectural patterns.
* **Preserve API Compatibility**: Treat backend contracts as external dependencies.
* **No Unnecessary Dependencies**: Do not install new packages when native or existing dependencies suffice.
* **No Regression**: Ensure existing behavior outside the affected component remains intact.

---

## STEP 5 — Test & Validate P0 Fixes

Run the project's native validation commands:
```bash
# 1. Type Check
npm run typecheck # or npx tsc --noEmit

# 2. Lint Check
npm run lint # or npx eslint .

# 3. Unit / Component / E2E Tests (if configured)
npm test

# 4. Production Build Verification
npm run build
```

* If automated tests for the critical flow are missing, write focused frontend test cases covering:
  - Component rendering under happy/empty/error states.
  - Form submission & validation states.
  - State transitions and cache invalidation.
* Diagnose and resolve any test failure before proceeding.

---

## STEP 6 — Fix Confirmed P1 Issues

Following successful P0 verification, apply minimal, targeted fixes for all confirmed P1 findings adhering to the same safety and design preservation rules.

---

## STEP 7 — Test & Validate P1 Fixes

Re-run the full validation suite:
- TypeScript typecheck
- ESLint
- Unit / Component tests
- Production build validation

Ensure zero regressions are introduced.

---

## STEP 8 — Re-Audit Frontend

Conduct a comprehensive secondary audit:
1. Verify that all original P0/P1 findings are genuinely resolved.
2. Check that no secondary defects or regressions were introduced across:
   - Routing and navigation
   - State synchronization
   - API error handling
   - Responsive layouts
   - Accessibility
   - Type definitions

---

## STEP 9 — Secondary Fixes & Convergence Loop

If the re-audit reveals any new confirmed P0/P1 defects caused by the fixes:
```text
VERIFY → FIX → TEST → RE-AUDIT
```
Repeat until:
1. Zero confirmed P0 defects remain.
2. Zero confirmed P1 defects remain.
3. Typecheck passes with 0 errors.
4. ESLint passes with 0 errors.
5. Production build succeeds cleanly.

---

## STEP 10 — Generate Final Audit Report

Create directory `docs/audits/` (if not present) and write the final report to:
`docs/audits/latest-audit.md`

### Required Report Structure

```markdown
# Frontend Project Audit Report

## Executive Summary
- Date & Time: <ISO_timestamp>
- Total Findings Detected: <count>
- Confirmed Findings: <count>
- False Positives: <count>
- Fixed Issues (P0/P1): <count>
- Remaining/Deferred Issues (P2/P3): <count>
- Typecheck Status: PASS / FAIL
- Lint Status: PASS / FAIL
- Build Status: PASS / FAIL

## Frontend Architecture
- Framework, Routing, State Management, Styling, Data Fetching overview.

## Initial Findings
- Summary of all findings detected in Step 1.

## Verified Findings
- Findings confirmed during Step 3.

## Fixed Issues
- Detailed breakdown per fixed finding:
  - **ID**: [FINDING-XXX]
  - **Severity**: P0 / P1
  - **Root Cause**: ...
  - **Applied Fix**: ...
  - **Files Changed**: [filename](file:///path/to/file)
  - **Verification / Test Result**: PASS

## P0 Issues (Summary of Fixes)
## P1 Issues (Summary of Fixes)
## P2 Issues (Remaining / Roadmap)
## P3 Issues (Remaining / Roadmap)

## Tests & Verification
- Test commands executed and results.

## Build Verification
- Build output summary and confirmation.

## Re-Audit Results
- Verification matrix confirming zero P0/P1 regressions.

## Remaining & Deferred Issues
- Non-blocking P2/P3 items documented for future sprints.

## Changed Files
- Complete list of all modified files with clickable markdown links.

## Risk Assessment & Recommended Next Steps
- Production deployment considerations and follow-up maintenance recommendations.
```

---

## Safety & Quality Guidelines

1. **Date & Time Precision**:
   - Determine whether API sends UTC ISO strings (`2026-08-28T10:00:00.000Z`) or local date representations.
   - When converting for `<input type="datetime-local" />`, adjust for local timezone offset (`getTimezoneOffset() * 60000`) to prevent timezone drift on save.
   - Use explicit `timeZone: "Asia/Ho_Chi_Minh"` in `Intl.DateTimeFormat` when standardized Vietnam time is required.
2. **State Lifecycle Integrity**:
   - Ensure every mutation adheres to the complete lifecycle: `Trigger → Optimistic/Loading State → API Call → Success/Error Toast → Cache Invalidation → UI Render`.
   - Never leave UI in a falsely successful state upon API rejection.
3. **No Unsafe Type Suppressions**:
   - Do not fix TypeScript errors by adding `as any`, `// @ts-ignore`, or `// eslint-disable`. Fix the underlying type signature or use proper discriminated unions / Zod schema parsing.
4. **Security Defense-in-Depth**:
   - Always sanitize user-generated HTML with DOMPurify.
   - Always isolate embedded preview frames with `sandbox=""`.
   - Never trust client-side IDs for authoritative authorization.
