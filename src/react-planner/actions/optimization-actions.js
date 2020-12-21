import { SELECTED_OPTIMIZE_PLAN, LOAD_ORIGINAL } from "../constants";

// eslint-disable-next-line import/prefer-default-export
export const selectedOptimizePlan = (plan) => ({
  type: SELECTED_OPTIMIZE_PLAN,
  payload: plan
});

export const loadOriginal = (sceneJS) => ({
  type: LOAD_ORIGINAL,
  payload: sceneJS
});