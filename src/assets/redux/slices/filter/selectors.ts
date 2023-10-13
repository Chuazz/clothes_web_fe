import type { ReduxState } from '@assets/redux';

const selectFilter = (state: ReduxState) => state.filter;

export { selectFilter };
