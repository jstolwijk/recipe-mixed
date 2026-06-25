# Graph Report - recipe-mixer  (2026-06-25)

## Corpus Check
- 46 files · ~13,814 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 196 nodes · 257 edges · 20 communities (13 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `134e4d9c`
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
- [[_COMMUNITY_Story Template|Story Template]]
- [[_COMMUNITY_Community 19|Community 19]]

## God Nodes (most connected - your core abstractions)
1. `validate()` - 14 edges
2. `compress_file()` - 12 edges
3. `detect_file_type()` - 9 edges
4. `should_compress()` - 8 edges
5. `Generate Remixed Recipe` - 8 edges
6. `Caveman Compress` - 7 edges
7. `main()` - 7 edges
8. `Caveman Help` - 7 edges
9. `Snyk High Risk Rating` - 6 edges
10. `backup_dir_for()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Structured Recipe Object` --conceptually_related_to--> `Generate Remixed Recipe`  [INFERRED]
  issues/stories/STORY-003-normalize-recipe-structure.md → issues/stories/STORY-005-generate-remixed-recipe.md
- `benchmark_pair()` --calls--> `validate()`  [EXTRACTED]
  .agents/skills/caveman-compress/scripts/benchmark.py → .agents/skills/caveman-compress/scripts/validate.py
- `compress_file()` --calls--> `validate()`  [EXTRACTED]
  .agents/skills/caveman-compress/scripts/compress.py → .agents/skills/caveman-compress/scripts/validate.py
- `Tech Stack And Scaffolding` --implements--> `MVP Foundation`  [EXTRACTED]
  issues/stories/STORY-000-tech-stack-and-scaffolding.md → issues/epics/EPIC-006-mvp-foundation.md
- `SQLite Backup Strategy` --implements--> `MVP Foundation`  [EXTRACTED]
  issues/stories/STORY-013-sqlite-backup-strategy.md → issues/epics/EPIC-006-mvp-foundation.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Locate Fix Verify Workflow** — cavecrew_skill_cavecrew_investigator, cavecrew_skill_cavecrew_builder, cavecrew_skill_cavecrew_reviewer [EXTRACTED 1.00]
- **Caveman Token Efficiency System** — caveman_skill_caveman, caveman_compress_skill_caveman_compress, caveman_stats_skill_caveman_stats, cavecrew_skill_cavecrew [INFERRED 0.85]
- **MVP First Run Flow** — stories_story_001_paste_recipe_text_paste_recipe_text, stories_story_004_select_remix_direction_select_remix_direction, stories_story_005_generate_remixed_recipe_generate_remixed_recipe, stories_story_012_mvp_app_shell_mvp_app_shell [EXTRACTED 1.00]
- **Trust And Iteration Loop** — stories_story_005_generate_remixed_recipe_generate_remixed_recipe, stories_story_006_show_what_changed_show_what_changed, stories_story_007_cooking_sanity_check_cooking_sanity_check, stories_story_008_remix_adjustments_remix_adjustments, stories_story_009_compare_original_and_remix_compare_original_and_remix [INFERRED 0.85]
- **Raspberry Pi MVP Deployment Stack** — stories_story_000_tech_stack_and_scaffolding_tech_stack_and_scaffolding, stories_story_013_sqlite_backup_strategy_sqlite_backup_strategy, stories_story_000_tech_stack_and_scaffolding_sqlite, stories_story_000_tech_stack_and_scaffolding_docker_compose, stories_story_000_tech_stack_and_scaffolding_cloudflare_tunnel, stories_story_000_tech_stack_and_scaffolding_caddy [INFERRED 0.85]

## Communities (20 total, 7 thin omitted)

### Community 0 - "Recipe Product Plan"
Cohesion: 0.15
Nodes (23): Recipe Input, Remix Engine, Trust And Safety, Remix Experience, Saving And Sharing, MVP Foundation, Recipe Mixer Issues, Paste Recipe Text (+15 more)

### Community 1 - "Validation Script"
Cohesion: 0.22
Nodes (16): count_bullets(), extract_code_blocks(), extract_headings(), extract_inline_codes(), extract_paths(), extract_urls(), Line-based fenced code block extractor.      Handles ``` and ~~~ fences with var, read_file() (+8 more)

### Community 2 - "Caveman Skill Suite"
Cohesion: 0.17
Nodes (11): Boundaries, Caveman Compress, Compress, Compression Rules, Pattern, Preserve EXACTLY (never modify), Preserve Structure, Process (+3 more)

### Community 3 - "Compression Workflow"
Cohesion: 0.13
Nodes (26): Path, main(), print_usage(), backup_dir_for(), build_compress_prompt(), build_fix_prompt(), call_claude(), compress_file() (+18 more)

### Community 4 - "Delegation Modes"
Cohesion: 0.17
Nodes (10): caveman, Example output, How to invoke, See also, What it does, Auto-Clarity, Boundaries, Intensity (+2 more)

### Community 5 - "Content Detection"
Cohesion: 0.09
Nodes (20): Before / After, Benchmarks, How It Work, <img src="../../docs/assets/dancing-rock.svg" width="20" height="20" alt="rock"/> Caveman (285 tokens), Install, 📄 Original (706 tokens), Part of Caveman, Security (+12 more)

### Community 6 - "MVP Infrastructure"
Cohesion: 0.33
Nodes (7): Caddy, Cloudflare Tunnel, Docker Compose, SQLite, Tech Stack And Scaffolding, SQLite Aware Backup, SQLite Backup Strategy

### Community 7 - "CLI Entry Points"
Cohesion: 0.15
Nodes (11): cavecrew, Example chaining, How to invoke, See also, What it does, Auto-clarity (inherited), Chaining patterns, Output contracts (+3 more)

### Community 8 - "Sensitive File Filters"
Cohesion: 0.18
Nodes (9): caveman-commit, Example output, How to invoke, See also, What it does, Auto-Clarity, Boundaries, Examples (+1 more)

### Community 9 - "Benchmarking Tools"
Cohesion: 0.70
Nodes (4): benchmark_pair(), count_tokens(), main(), print_table()

### Community 12 - "Help Skill"
Cohesion: 0.14
Nodes (12): caveman-help, Example output, How to invoke, See also, What it does, Caveman Help, Configure Default Mode, Deactivate (+4 more)

### Community 13 - "Mode Tracker Hook"
Cohesion: 0.18
Nodes (9): caveman-review, Example output, How to invoke, See also, What it does, Auto-Clarity, Boundaries, Examples (+1 more)

### Community 19 - "Community 19"
Cohesion: 0.29
Nodes (5): caveman-stats, Example output, How to invoke, See also, What it does

## Knowledge Gaps
- **85 isolated node(s):** `What it does`, `How to invoke`, `Example chaining`, `See also`, `When to use cavecrew vs alternatives` (+80 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `validate()` connect `Validation Script` to `Benchmarking Tools`, `Compression Workflow`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `compress_file()` connect `Compression Workflow` to `Validation Script`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `What it does`, `How to invoke`, `Example chaining` to the rest of the system?**
  _99 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Recipe Product Plan` be split into smaller, more focused modules?**
  _Cohesion score 0.14624505928853754 - nodes in this community are weakly interconnected._
- **Should `Compression Workflow` be split into smaller, more focused modules?**
  _Cohesion score 0.1310344827586207 - nodes in this community are weakly interconnected._
- **Should `Content Detection` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Help Skill` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._