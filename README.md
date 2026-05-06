# FocusFlow Enterprise

FocusFlow is an enterprise productivity workspace for planning, focus sessions, reflection, insights, goals, and privacy-preserving team analytics. The implementation is a dependency-free web app so it can run anywhere from a static host while still delivering production-grade product behavior.

## Product Surface

- Home: daily command center with priority scoring, focus block, AI plan, execution risks, and reflection.
- Planner: capacity-aware scheduling, AI task breakdown, guardrails, week capacity, and ranked task table.
- Focus Mode: protected single-task timer, blocker policy, session notes, and distraction telemetry.
- Insights: productivity score based on meaningful progress, focus consistency, distraction patterns, and coaching.
- Goals: strategic goals connected to milestones and daily execution blocks.
- Team: shared commitments, async progress, aggregate team health, and analytics governance.

## Quality Bar

- State uses a schema version, local migration path, persistence guards, and timer recovery behavior.
- User-entered content is escaped before rendering into HTML.
- Navigation is routed through hash-compatible views with active state and keyboard focus support.
- Layout uses responsive constraints for desktop, tablet, and mobile.
- The UI avoids marketing-page composition and keeps the first screen as the working product.
- Team analytics are presented as aggregate signals, not individual surveillance.

## Run

Open `index.html` directly, or run:

```bash
npm run serve
```

Then visit `http://127.0.0.1:4173`.

## Verify

```bash
npm run check
```

The check validates JavaScript syntax, required DOM selectors, routed views, SVG icon references, ASCII-only source, and a few design-system guardrails.
