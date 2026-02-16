# Deep-Dive Playbook (Synthetic Data)

Use this playbook with the CSV files in this folder to generate consistent insights for all agents.

## 1) Core KPI scorecard by agent

```sql
SELECT
  agent_name,
  ROUND(SUM(spend), 2) AS total_spend,
  ROUND(SUM(revenue), 2) AS total_revenue,
  ROUND(SUM(revenue) / NULLIF(SUM(spend), 0), 2) AS blended_roas,
  SUM(orders) AS total_orders
FROM unified_agent_metrics
GROUP BY agent_name
ORDER BY blended_roas DESC;
```

## 2) Exception report (daily)

```sql
SELECT
  date,
  agent_name,
  campaign_id,
  insight_signal,
  recommended_action
FROM unified_agent_metrics
WHERE insight_signal <> 'stable'
ORDER BY date, agent_name, campaign_id;
```

## 3) Opportunity prioritization rubric

- **Tier 1**: `insight_signal = 'high_opportunity'` and ROAS above agent median.
- **Tier 2**: `insight_signal = 'optimization_gap'` with spend in top 40%.
- **Tier 3**: `insight_signal = 'efficiency_risk'` requiring guardrails first.

## 4) Narrative template per agent

1. **What changed?**
   - Summarize KPI deltas vs previous 3-day average.
2. **Why it changed?**
   - Reference top 2 signals and affected campaign IDs.
3. **What to do next?**
   - Convert `recommended_action` values into owner + timeline.
4. **Expected impact**
   - Estimate revenue upside or loss avoidance for next 7 days.

## 5) Output format for leadership

- 3 wins
- 3 risks
- 3 actions
- 1 confidence score (High/Medium/Low) based on data completeness

