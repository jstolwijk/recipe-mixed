# Graph Report - /Users/jessestolwijk/Documents/recipe-mixer  (2026-06-25)

## Corpus Check
- Corpus is ~13,814 words - fits in a single context window. You may not need a graph.

## Summary
- 119 nodes · 184 edges · 19 communities (10 shown, 9 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

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

## God Nodes (most connected - your core abstractions)
1. `validate()` - 14 edges
2. `compress_file()` - 12 edges
3. `detect_file_type()` - 9 edges
4. `should_compress()` - 8 edges
5. `Generate Remixed Recipe` - 8 edges
6. `main()` - 7 edges
7. `backup_dir_for()` - 6 edges
8. `Recipe Mixer Issues` - 6 edges
9. `Tech Stack And Scaffolding` - 6 edges
10. `benchmark_pair()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Token Reduction Rationale` --semantically_similar_to--> `Token-Saving Delegation Rationale`  [INFERRED] [semantically similar]
  .agents/skills/caveman/SKILL.md → .agents/skills/cavecrew/SKILL.md
- `Preservation Rules` --semantically_similar_to--> `Language Preservation`  [INFERRED] [semantically similar]
  .agents/skills/caveman-compress/SKILL.md → .agents/skills/caveman/SKILL.md
- `Security Model` --rationale_for--> `caveman-compress`  [INFERRED]
  .agents/skills/caveman-compress/SECURITY.md → .agents/skills/caveman-compress/SKILL.md
- `Structured Recipe Object` --conceptually_related_to--> `Generate Remixed Recipe`  [INFERRED]
  issues/stories/STORY-003-normalize-recipe-structure.md → issues/stories/STORY-005-generate-remixed-recipe.md
- `benchmark_pair()` --calls--> `validate()`  [EXTRACTED]
  .agents/skills/caveman-compress/scripts/benchmark.py → .agents/skills/caveman-compress/scripts/validate.py

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Locate Fix Verify Workflow** — cavecrew_skill_cavecrew_investigator, cavecrew_skill_cavecrew_builder, cavecrew_skill_cavecrew_reviewer [EXTRACTED 1.00]
- **Caveman Token Efficiency System** — caveman_skill_caveman, caveman_compress_skill_caveman_compress, caveman_stats_skill_caveman_stats, cavecrew_skill_cavecrew [INFERRED 0.85]
- **MVP First Run Flow** — stories_story_001_paste_recipe_text_paste_recipe_text, stories_story_004_select_remix_direction_select_remix_direction, stories_story_005_generate_remixed_recipe_generate_remixed_recipe, stories_story_012_mvp_app_shell_mvp_app_shell [EXTRACTED 1.00]
- **Trust And Iteration Loop** — stories_story_005_generate_remixed_recipe_generate_remixed_recipe, stories_story_006_show_what_changed_show_what_changed, stories_story_007_cooking_sanity_check_cooking_sanity_check, stories_story_008_remix_adjustments_remix_adjustments, stories_story_009_compare_original_and_remix_compare_original_and_remix [INFERRED 0.85]
- **Raspberry Pi MVP Deployment Stack** — stories_story_000_tech_stack_and_scaffolding_tech_stack_and_scaffolding, stories_story_013_sqlite_backup_strategy_sqlite_backup_strategy, stories_story_000_tech_stack_and_scaffolding_sqlite, stories_story_000_tech_stack_and_scaffolding_docker_compose, stories_story_000_tech_stack_and_scaffolding_cloudflare_tunnel, stories_story_000_tech_stack_and_scaffolding_caddy [INFERRED 0.85]

## Communities (19 total, 9 thin omitted)

### Community 0 - "Recipe Product Plan"
Cohesion: 0.15
Nodes (22): Recipe Input, Remix Engine, Trust And Safety, Remix Experience, Saving And Sharing, Recipe Mixer Issues, Paste Recipe Text, Import Recipe Link (+14 more)

### Community 1 - "Validation Script"
Cohesion: 0.22
Nodes (16): count_bullets(), extract_code_blocks(), extract_headings(), extract_inline_codes(), extract_paths(), extract_urls(), Line-based fenced code block extractor.      Handles ``` and ~~~ fences with var, read_file() (+8 more)

### Community 2 - "Caveman Skill Suite"
Cohesion: 0.14
Nodes (14): caveman-commit, Conventional Commits, Why Over What Rationale, Security Model, Backup Strategy, caveman-compress, Compression Pipeline, Preservation Rules (+6 more)

### Community 3 - "Compression Workflow"
Cohesion: 0.31
Nodes (9): build_compress_prompt(), build_fix_prompt(), call_claude(), compress_file(), Strip outer ```markdown ... ``` fence when it wraps the entire output., Send a prompt to Claude.      Prefers the Anthropic SDK when ANTHROPIC_API_KEY i, Split YAML frontmatter from body. Returns (frontmatter, body).      Memory files, split_frontmatter() (+1 more)

### Community 4 - "Delegation Modes"
Cohesion: 0.22
Nodes (9): cavecrew, cavecrew-builder, cavecrew-investigator, cavecrew-reviewer, Token-Saving Delegation Rationale, Auto-Clarity, caveman, Caveman Modes (+1 more)

### Community 5 - "Content Detection"
Cohesion: 0.31
Nodes (8): detect_file_type(), _is_code_line(), _is_json_content(), _is_yaml_content(), Check if a line looks like code., Check if content is valid JSON., Heuristic: check if content looks like YAML., Classify a file as 'natural_language', 'code', 'config', or 'unknown'.      Retu

### Community 6 - "MVP Infrastructure"
Cohesion: 0.32
Nodes (8): MVP Foundation, Caddy, Cloudflare Tunnel, Docker Compose, SQLite, Tech Stack And Scaffolding, SQLite Aware Backup, SQLite Backup Strategy

### Community 7 - "CLI Entry Points"
Cohesion: 0.53
Nodes (4): main(), print_usage(), backup_dir_for(), Resolve the out-of-tree backup directory for a given source file.      Backups m

### Community 8 - "Sensitive File Filters"
Cohesion: 0.40
Nodes (5): Path, is_sensitive_path(), Heuristic denylist for files that must never be shipped to a third-party API., Return True if the file is natural language and should be compressed., should_compress()

### Community 9 - "Benchmarking Tools"
Cohesion: 0.70
Nodes (4): benchmark_pair(), count_tokens(), main(), print_table()

## Knowledge Gaps
- **26 isolated node(s):** `cavecrew-investigator`, `cavecrew-builder`, `cavecrew-reviewer`, `Caveman Modes`, `Auto-Clarity` (+21 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `validate()` connect `Validation Script` to `Sensitive File Filters`, `Benchmarking Tools`, `Compression Workflow`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `detect_file_type()` connect `Content Detection` to `Sensitive File Filters`, `CLI Entry Points`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `compress_file()` connect `Compression Workflow` to `Sensitive File Filters`, `Validation Script`, `CLI Entry Points`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `Caveman compress scripts.  This package provides tools to compress natural langu`, `Split YAML frontmatter from body. Returns (frontmatter, body).      Memory files`, `Resolve the out-of-tree backup directory for a given source file.      Backups m` to the rest of the system?**
  _41 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Caveman Skill Suite` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._