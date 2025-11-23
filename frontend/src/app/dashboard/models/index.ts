export interface Summary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface Budget {
  needs: BudgetDetails;
  wants: BudgetDetails;
  savings: BudgetDetails;
}

export interface BudgetDetails {
  goal: number;
  spent: number;
  remaining: number;
}

export interface ExpensesDistribution {
  needs: number;
  wants: number;
  savings: number;
}

export interface BudgetRule {
  needs: number;
  wants: number;
  savings: number;
}
