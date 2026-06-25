# Graph Report - recipe-mixer  (2026-06-25)

## Corpus Check
- 58 files · ~15,941 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 290 nodes · 358 edges · 30 communities (21 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `06f02271`
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
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `validate()` - 14 edges
3. `compress_file()` - 12 edges
4. `detect_file_type()` - 9 edges
5. `AppConfig` - 8 edges
6. `should_compress()` - 8 edges
7. `Generate Remixed Recipe` - 8 edges
8. `main()` - 7 edges
9. `Caveman Compress` - 7 edges
10. `main()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Structured Recipe Object` --conceptually_related_to--> `Generate Remixed Recipe`  [INFERRED]
  issues/stories/STORY-003-normalize-recipe-structure.md → issues/stories/STORY-005-generate-remixed-recipe.md
- `compress_file()` --calls--> `validate()`  [EXTRACTED]
  .agents/skills/caveman-compress/scripts/compress.py → .agents/skills/caveman-compress/scripts/validate.py
- `SQLite` --conceptually_related_to--> `SQLite Aware Backup`  [INFERRED]
  issues/stories/STORY-000-tech-stack-and-scaffolding.md → issues/stories/STORY-013-sqlite-backup-strategy.md
- `benchmark_pair()` --calls--> `validate()`  [EXTRACTED]
  .agents/skills/caveman-compress/scripts/benchmark.py → .agents/skills/caveman-compress/scripts/validate.py
- `main()` --calls--> `backup_dir_for()`  [EXTRACTED]
  .agents/skills/caveman-compress/scripts/cli.py → .agents/skills/caveman-compress/scripts/compress.py

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Locate Fix Verify Workflow** — cavecrew_skill_cavecrew_investigator, cavecrew_skill_cavecrew_builder, cavecrew_skill_cavecrew_reviewer [EXTRACTED 1.00]
- **Caveman Token Efficiency System** — caveman_skill_caveman, caveman_compress_skill_caveman_compress, caveman_stats_skill_caveman_stats, cavecrew_skill_cavecrew [INFERRED 0.85]
- **MVP First Run Flow** — stories_story_001_paste_recipe_text_paste_recipe_text, stories_story_004_select_remix_direction_select_remix_direction, stories_story_005_generate_remixed_recipe_generate_remixed_recipe, stories_story_012_mvp_app_shell_mvp_app_shell [EXTRACTED 1.00]
- **Trust And Iteration Loop** — stories_story_005_generate_remixed_recipe_generate_remixed_recipe, stories_story_006_show_what_changed_show_what_changed, stories_story_007_cooking_sanity_check_cooking_sanity_check, stories_story_008_remix_adjustments_remix_adjustments, stories_story_009_compare_original_and_remix_compare_original_and_remix [INFERRED 0.85]
- **Raspberry Pi MVP Deployment Stack** — stories_story_000_tech_stack_and_scaffolding_tech_stack_and_scaffolding, stories_story_013_sqlite_backup_strategy_sqlite_backup_strategy, stories_story_000_tech_stack_and_scaffolding_sqlite, stories_story_000_tech_stack_and_scaffolding_docker_compose, stories_story_000_tech_stack_and_scaffolding_cloudflare_tunnel, stories_story_000_tech_stack_and_scaffolding_caddy [INFERRED 0.85]

## Communities (30 total, 9 thin omitted)

### Community 0 - "Recipe Product Plan"
Cohesion: 0.11
Nodes (30): Recipe Input, Remix Engine, Trust And Safety, Remix Experience, Saving And Sharing, MVP Foundation, Recipe Mixer Issues, Caddy (+22 more)

### Community 1 - "Validation Script"
Cohesion: 0.17
Nodes (21): Path, benchmark_pair(), count_tokens(), main(), print_table(), count_bullets(), extract_code_blocks(), extract_headings() (+13 more)

### Community 2 - "Caveman Skill Suite"
Cohesion: 0.17
Nodes (11): Boundaries, Caveman Compress, Compress, Compression Rules, Pattern, Preserve EXACTLY (never modify), Preserve Structure, Process (+3 more)

### Community 3 - "Compression Workflow"
Cohesion: 0.13
Nodes (25): main(), print_usage(), backup_dir_for(), build_compress_prompt(), build_fix_prompt(), call_claude(), compress_file(), is_sensitive_path() (+17 more)

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

### Community 12 - "Help Skill"
Cohesion: 0.14
Nodes (12): caveman-help, Example output, How to invoke, See also, What it does, Caveman Help, Configure Default Mode, Deactivate (+4 more)

### Community 13 - "Mode Tracker Hook"
Cohesion: 0.18
Nodes (9): caveman-review, Example output, How to invoke, See also, What it does, Auto-Clarity, Boundaries, Examples (+1 more)

### Community 19 - "Community 19"
Cohesion: 0.29
Nodes (5): caveman-stats, Example output, How to invoke, See also, What it does

### Community 20 - "Community 20"
Cohesion: 0.29
Nodes (5): Communication, Current Commands, Makefile, Project, Work Rules

### Community 21 - "Community 21"
Cohesion: 0.29
Nodes (6): Commit, Implement, Implement Issue, Inputs, Select Issue, Verify

### Community 22 - "Community 22"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, allowSyntheticDefaultImports, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+10 more)

### Community 23 - "Community 23"
Cohesion: 0.50
Nodes (3): Deployment Notes, Raspberry Pi Deploy Assumptions, Runtime Shape

### Community 24 - "Community 24"
Cohesion: 0.50
Nodes (3): Checks, Local Development, Recipe Mixer

## Knowledge Gaps
- **137 isolated node(s):** `Local Development`, `Checks`, `name`, `version`, `private` (+132 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `validate()` connect `Validation Script` to `Compression Workflow`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `detect_file_type()` connect `Compression Workflow` to `Validation Script`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `compress_file()` connect `Compression Workflow` to `Validation Script`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `Local Development`, `Checks`, `name` to the rest of the system?**
  _151 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Recipe Product Plan` be split into smaller, more focused modules?**
  _Cohesion score 0.10574712643678161 - nodes in this community are weakly interconnected._
- **Should `Compression Workflow` be split into smaller, more focused modules?**
  _Cohesion score 0.12807881773399016 - nodes in this community are weakly interconnected._
- **Should `Content Detection` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._