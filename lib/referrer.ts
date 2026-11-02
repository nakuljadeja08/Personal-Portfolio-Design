const FINTECH_HOST =
  /bank|fintech|financ|capital|invest|trading|securities|jpmorgan|jpmchase|chase\.|goldmansachs|morganstanley|citigroup|citibank|barclays|hsbc|wellsfargo|blackrock|fidelity|schwab|stripe|plaid|robinhood|coinbase|paypal|mastercard|americanexpress|bloomberg/i;

/** Fired by the command box when someone asks about fintech, so the résumé picker can follow. */
export const FINTECH_EVENT = "nl:fintech";

/** True when the visitor followed a link from a bank or fintech domain. */
export function isFintechReferrer(referrer: string): boolean {
  try {
    return FINTECH_HOST.test(new URL(referrer).hostname);
  } catch {
    return false;
  }
}
