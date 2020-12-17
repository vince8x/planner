import { SELECTED_OPTIMIZE_PLAN } from "../constants";

// eslint-disable-next-line import/prefer-default-export
export const selectedOptimizePlan = (plan) => ({
  type: SELECTED_OPTIMIZE_PLAN,
  payload: plan
});