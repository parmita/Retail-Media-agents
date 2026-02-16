# Agent Deep-Dive Synthetic Data Pack

This folder contains **sample synthetic datasets** you can reuse for detailed deep dives across the full Retail Media agent ecosystem.

## Included agents and files

| Agent | Primary file | What it helps analyze |
|---|---|---|
| Bid Optimization Agent | `bid_optimization_agent_metrics.csv` | CPC/ROAS trends, bid strategy impact, win-rate changes |
| Budget Pacing Agent | `budget_pacing_agent_metrics.csv` | Spend pacing, under/over delivery risk, hourly burn alignment |
| Creative Intelligence Agent | `creative_intelligence_agent_metrics.csv` | CTR/CVR by creative format, fatigue detection, refresh timing |
| Audience Discovery Agent | `audience_discovery_agent_metrics.csv` | Segment lift, overlap, incremental reach and conversion efficiency |
| Inventory Quality Agent | `inventory_quality_agent_metrics.csv` | Placement quality, fraud flags, viewability and downstream return |

## Data design notes

- Data is fully synthetic and safe for demos/workshops.
- Date range spans two weeks at a daily grain.
- Fields are aligned where possible so you can join by:
  - `date`
  - `agent_name`
  - `campaign_id`
- `insight_signal` and `recommended_action` are intentionally included to simulate analyst/agent narratives.

## Suggested deep-dive workflow

1. **Trend scan**: Look for directional changes in spend, CTR, CVR, ROAS.
2. **Exception review**: Filter rows where `insight_signal != "stable"`.
3. **Action mapping**: Group by `recommended_action` to quantify expected impact.
4. **Cross-agent triangulation**: Combine pacing + creative + inventory for root-cause analysis.
5. **Executive summary**: Surface 3 wins, 3 risks, and 3 next actions per agent.

## Quick start examples

- Top risk signals by agent:
  - Group by `agent_name, insight_signal` and count rows.
- Highest opportunity campaigns:
  - Filter `insight_signal IN ('high_opportunity','optimization_gap')`.
- Creative fatigue candidates:
  - `creative_intelligence_agent_metrics.csv` where `fatigue_score >= 70`.


## Dashboard UI (directly from data)

A simple UI is available at `dashboard/index.html` and reads these CSVs directly.

Run locally:

```bash
python -m http.server 8000
```

Then open:

- `http://localhost:8000/dashboard/`

