export default (state, action) => {
  state = state.update('react-planner', plannerState => PlannerReducer(plannerState, action));
  return state;
}