export type StackGroup = { label: string; tools: string[] };

export const stackCopy = { label: "The full kit" };

// Plain list for anyone scanning for a keyword. Keep it in step with the résumé's Technical Skills section.
export const stack: StackGroup[] = [
  { label: "Languages", tools: ["Python", "SQL", "TypeScript", "JavaScript", "Shell/Bash"] },
  { label: "Pipelines", tools: ["Azure Data Factory", "Databricks (PySpark)", "Apache Airflow", "ETL/ELT", "GitHub Actions CI/CD"] },
  { label: "Storage", tools: ["Snowflake", "PostgreSQL/Supabase", "Azure Data Lake Gen2", "SQLite", "MySQL"] },
  { label: "BI and analytics", tools: ["Power BI", "Spotfire", "pandas", "NumPy", "scikit-learn", "Matplotlib"] },
  { label: "Cloud and tools", tools: ["Azure", "Docker", "Vercel"] },
];
