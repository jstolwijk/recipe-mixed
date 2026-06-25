# Graph Report - recipe-mixer  (2026-06-25)

## Corpus Check
- 67 files · ~19,151 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 445 nodes · 515 edges · 36 communities (34 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0949e588`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Recipe Product Plan|Recipe Product Plan]]
- [[_COMMUNITY_Validation Script|Validation Script]]
- [[_COMMUNITY_Caveman Skill Suite|Caveman Skill Suite]]
- [[_COMMUNITY_Compression Workflow|Compression Workflow]]
- [[_COMMUNITY_Delegation Modes|Delegation Modes]]
- [[_COMMUNITY_Content Detection|Content Detection]]
- [[_COMMUNITY_MVP Infrastructure|MVP Infrastructure]]
- [[_COMMUNITY_CLI Entry Points|CLI Entry Points]]
- [[_COMMUNITY_Sensitive File Filters|Sensitive File Filters]]
- [[_COMMUNITY_Benchmarking Tools|Benchmarking Tools]]
- [[_COMMUNITY_Product Thesis|Product Thesis]]
- [[_COMMUNITY_Compression Package|Compression Package]]
- [[_COMMUNITY_Help Skill|Help Skill]]
- [[_COMMUNITY_Mode Tracker Hook|Mode Tracker Hook]]
- [[_COMMUNITY_OpenRouter|OpenRouter]]
- [[_COMMUNITY_React Frontend|React Frontend]]
- [[_COMMUNITY_Rust Backend|Rust Backend]]
- [[_COMMUNITY_Epic Template|Epic Template]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 39|Community 39]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `STORY-000: Tech Stack And Scaffolding` - 15 edges
3. `validate()` - 14 edges
4. `compress_file()` - 12 edges
5. `detect_file_type()` - 9 edges
6. `Recipe Mixer Issues` - 8 edges
7. `AppConfig` - 8 edges
8. `should_compress()` - 8 edges
9. `Implement Issue` - 7 edges
10. `EPIC-001: Recipe Input` - 7 edges

## Surprising Connections (you probably didn't know these)
- `benchmark_pair()` --calls--> `validate()`  [EXTRACTED]
  .agents/skills/caveman-compress/scripts/benchmark.py → .agents/skills/caveman-compress/scripts/validate.py
- `main()` --calls--> `backup_dir_for()`  [EXTRACTED]
  .agents/skills/caveman-compress/scripts/cli.py → .agents/skills/caveman-compress/scripts/compress.py
- `main()` --calls--> `compress_file()`  [EXTRACTED]
  .agents/skills/caveman-compress/scripts/cli.py → .agents/skills/caveman-compress/scripts/compress.py
- `main()` --calls--> `detect_file_type()`  [EXTRACTED]
  .agents/skills/caveman-compress/scripts/cli.py → .agents/skills/caveman-compress/scripts/detect.py
- `main()` --calls--> `should_compress()`  [EXTRACTED]
  .agents/skills/caveman-compress/scripts/cli.py → .agents/skills/caveman-compress/scripts/detect.py

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Locate Fix Verify Workflow** — cavecrew_skill_cavecrew_investigator, cavecrew_skill_cavecrew_builder, cavecrew_skill_cavecrew_reviewer [EXTRACTED 1.00]
- **Caveman Token Efficiency System** — caveman_skill_caveman, caveman_compress_skill_caveman_compress, caveman_stats_skill_caveman_stats, cavecrew_skill_cavecrew [INFERRED 0.85]
- **MVP First Run Flow** — stories_story_001_paste_recipe_text_paste_recipe_text, stories_story_004_select_remix_direction_select_remix_direction, stories_story_005_generate_remixed_recipe_generate_remixed_recipe, stories_story_012_mvp_app_shell_mvp_app_shell [EXTRACTED 1.00]
- **Trust And Iteration Loop** — stories_story_005_generate_remixed_recipe_generate_remixed_recipe, stories_story_006_show_what_changed_show_what_changed, stories_story_007_cooking_sanity_check_cooking_sanity_check, stories_story_008_remix_adjustments_remix_adjustments, stories_story_009_compare_original_and_remix_compare_original_and_remix [INFERRED 0.85]
- **Raspberry Pi MVP Deployment Stack** — stories_story_000_tech_stack_and_scaffolding_tech_stack_and_scaffolding, stories_story_013_sqlite_backup_strategy_sqlite_backup_strategy, stories_story_000_tech_stack_and_scaffolding_sqlite, stories_story_000_tech_stack_and_scaffolding_docker_compose, stories_story_000_tech_stack_and_scaffolding_cloudflare_tunnel, stories_story_000_tech_stack_and_scaffolding_caddy [INFERRED 0.85]

## Communities (36 total, 2 thin omitted)

### Community 0 - "Recipe Product Plan"
Cohesion: 0.07
Nodes (25): EPIC-003: Trust And Safety, Goal, Open Questions, Scope, Stories, Success Criteria, Why It Matters, Acceptance Criteria (+17 more)

### Community 1 - "Validation Script"
Cohesion: 0.20
Nodes (14): count_bullets(), extract_code_blocks(), extract_headings(), extract_inline_codes(), extract_paths(), extract_urls(), Line-based fenced code block extractor.      Handles ``` and ~~~ fences with var, validate_bullets() (+6 more)

### Community 2 - "Caveman Skill Suite"
Cohesion: 0.17
Nodes (11): Boundaries, Caveman Compress, Compress, Compression Rules, Pattern, Preserve EXACTLY (never modify), Preserve Structure, Process (+3 more)

### Community 3 - "Compression Workflow"
Cohesion: 0.11
Nodes (32): Path, benchmark_pair(), count_tokens(), main(), print_table(), main(), print_usage(), backup_dir_for() (+24 more)

### Community 4 - "Delegation Modes"
Cohesion: 0.17
Nodes (10): caveman, Example output, How to invoke, See also, What it does, Auto-Clarity, Boundaries, Intensity (+2 more)

### Community 5 - "Content Detection"
Cohesion: 0.09
Nodes (20): Before / After, Benchmarks, How It Work, <img src="../../docs/assets/dancing-rock.svg" width="20" height="20" alt="rock"/> Caveman (285 tokens), Install, 📄 Original (706 tokens), Part of Caveman, Security (+12 more)

### Community 6 - "MVP Infrastructure"
Cohesion: 0.09
Nodes (22): dependencies, react, react-dom, typescript, vite, @vitejs/plugin-react, devDependencies, autoprefixer (+14 more)

### Community 7 - "CLI Entry Points"
Cohesion: 0.15
Nodes (11): cavecrew, Example chaining, How to invoke, See also, What it does, Auto-clarity (inherited), Chaining patterns, Output contracts (+3 more)

### Community 8 - "Sensitive File Filters"
Cohesion: 0.18
Nodes (9): caveman-commit, Example output, How to invoke, See also, What it does, Auto-Clarity, Boundaries, Examples (+1 more)

### Community 9 - "Benchmarking Tools"
Cohesion: 0.17
Nodes (18): app(), HashMap, IntoResponse, Result, Router, Self, SocketAddr, AppConfig (+10 more)

### Community 10 - "Product Thesis"
Cohesion: 0.29
Nodes (7): EPIC-002: Remix Engine, Goal, Open Questions, Scope, Stories, Success Criteria, Why It Matters

### Community 12 - "Help Skill"
Cohesion: 0.14
Nodes (12): caveman-help, Example output, How to invoke, See also, What it does, Caveman Help, Configure Default Mode, Deactivate (+4 more)

### Community 13 - "Mode Tracker Hook"
Cohesion: 0.18
Nodes (9): caveman-review, Example output, How to invoke, See also, What it does, Auto-Clarity, Boundaries, Examples (+1 more)

### Community 14 - "OpenRouter"
Cohesion: 0.09
Nodes (19): EPIC-004: Remix Experience, Goal, Open Questions, Scope, Stories, Success Criteria, Why It Matters, Acceptance Criteria (+11 more)

### Community 15 - "React Frontend"
Cohesion: 0.10
Nodes (20): Caddy Preference, Context, Deployment Script Shape, Docker And Hardening Requirements, Initial Scaffold Acceptance Criteria, Local Development Requirements, Makefile Targets, MVP Decision: Two Containers (+12 more)

### Community 16 - "Rust Backend"
Cohesion: 0.09
Nodes (19): EPIC-005: Saving And Sharing, Goal, Open Questions, Scope, Stories, Success Criteria, Why It Matters, Acceptance Criteria (+11 more)

### Community 17 - "Epic Template"
Cohesion: 0.25
Nodes (7): EPIC-000: Epic Title, Goal, Open Questions, Scope, Stories, Success Criteria, Why It Matters

### Community 19 - "Community 19"
Cohesion: 0.29
Nodes (5): caveman-stats, Example output, How to invoke, See also, What it does

### Community 20 - "Community 20"
Cohesion: 0.29
Nodes (5): Communication, Current Commands, Makefile, Project, Work Rules

### Community 21 - "Community 21"
Cohesion: 0.25
Nodes (7): Commit, Implement, Implement Issue, Inputs, Select Issue, Update Status, Verify

### Community 22 - "Community 22"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+10 more)

### Community 23 - "Community 23"
Cohesion: 0.50
Nodes (3): Deployment Notes, Raspberry Pi Deploy Assumptions, Runtime Shape

### Community 24 - "Community 24"
Cohesion: 0.50
Nodes (3): Checks, Local Development, Recipe Mixer

### Community 25 - "Community 25"
Cohesion: 0.29
Nodes (7): EPIC-006: MVP Foundation, Goal, Open Questions, Scope, Stories, Success Criteria, Why It Matters

### Community 30 - "Community 30"
Cohesion: 0.33
Nodes (6): Acceptance Criteria, Context, Dependencies, Notes, STORY-006: Show What Changed, User Story

### Community 31 - "Community 31"
Cohesion: 0.25
Nodes (8): Development Order, Epic Index, MVP Outcome, Product Thesis, Recipe Mixer Issues, Status Values, Story Index, Structure

### Community 32 - "Community 32"
Cohesion: 0.29
Nodes (6): Acceptance Criteria, Context, Dependencies, Notes, STORY-000: Story Title, User Story

### Community 33 - "Community 33"
Cohesion: 0.07
Nodes (25): EPIC-001: Recipe Input, Goal, Open Questions, Scope, Stories, Success Criteria, Why It Matters, Acceptance Criteria (+17 more)

### Community 34 - "Community 34"
Cohesion: 0.22
Nodes (8): cleanListItem(), directionCopy, FlowStep, NormalizedRecipe, parseRecipeText(), RemixDirection, skillOptions, stepLabels

### Community 36 - "Community 36"
Cohesion: 0.33
Nodes (6): Acceptance Criteria, Context, Dependencies, Notes, STORY-007: Cooking Sanity Check, User Story

### Community 39 - "Community 39"
Cohesion: 0.33
Nodes (6): Acceptance Criteria, Context, Dependencies, Notes, STORY-005: Generate Remixed Recipe, User Story

## Knowledge Gaps
- **268 isolated node(s):** `RemixDirection`, `FlowStep`, `NormalizedRecipe`, `directionCopy`, `skillOptions` (+263 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `STORY-000: Tech Stack And Scaffolding` connect `React Frontend` to `Recipe Product Plan`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `Recipe Mixer Issues` connect `Community 31` to `Recipe Product Plan`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `RemixDirection`, `FlowStep`, `NormalizedRecipe` to the rest of the system?**
  _280 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Recipe Product Plan` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `Compression Workflow` be split into smaller, more focused modules?**
  _Cohesion score 0.10960960960960961 - nodes in this community are weakly interconnected._
- **Should `Content Detection` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `MVP Infrastructure` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._