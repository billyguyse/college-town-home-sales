# Agent log

Add a dated entry each time you work with your AI coding agent, with the newest entry at the bottom. Each entry records what you asked the agent, what it produced, and what you checked or changed. Paste your key prompts in exactly as you typed them. Include at least one time the agent got something wrong, and how you caught it.

Copy this outline for each entry:

```markdown
## YYYY-MM-DD: What you worked on

- **Asked:** "Paste your prompt here."
- **Agent produced:** What it made or changed.
- **Checked or changed:** How you checked it, and what you fixed.
```

## 2026-11-20: College-town home sales website

- **Asked:**

  > Read AGENTS.md and docs/data_description_sheet.md before making any changes.
  >
  >
  >
  > Replace the placeholder index.html page with a clean, professional, responsive website using data/college_town_home_sales.csv.
  >
  >
  >
  > Requirements:
  >
  > 1. Display the median home sale price for each city.
  > 2. Exclude sales under $10,000 from the calculations.
  > 3. Show the number of qualifying home sales for each city.
  > 4. Sort cities from highest to lowest median sale price.
  > 5. Format prices in whole dollars with commas.
  > 6. Clearly explain the $10,000 exclusion rule on the website.
  > 7. Use a modern, attractive layout that works on desktop and mobile.
  > 8. Use plain HTML, CSS, and JavaScript so the existing GitHub Pages workflow continues working.
  > 9. Do not modify any of the five original dataset files in the data/ folder.
  >
  > Test that the website loads and that the calculations are correct. Record this coding-agent session in AGENT_LOG.md.
  >
  >
  >
  > When finished, summarize the changes and create a pull request targeting main. Do not merge it automatically.

- **Agent produced:** A responsive city ranking that calculates medians and qualifying counts directly from the original CSV using plain HTML, CSS, and JavaScript.
- **Checked or changed:** Chromium loaded the site over HTTP at 320, 390, and 1,440 pixels. The initial table overflowed at 320 pixels, so the agent adjusted the mobile columns and reran the checks. All 18 displayed medians and counts matched an independent Python CSV calculation covering 35,402 qualifying sales. A separate case checked the $10,000 boundary, even-sized medians, grouping by city and state, and quoted CSV fields. Git confirmed that the five datasets and Pages workflow were untouched.
