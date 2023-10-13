import type { ReduxState } from '@assets/redux';

const selectCart = (state: ReduxState) => state.cart;

export { selectCart };
