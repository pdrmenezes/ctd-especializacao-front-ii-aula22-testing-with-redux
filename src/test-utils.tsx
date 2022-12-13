import { ReactElement } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import btcPriceReducer from "./features/btcPrice/btcPriceSlice";

export function renderWithReduxProvider(element: ReactElement) {
  const store = configureStore({
    reducer: {
      btcPrice: btcPriceReducer,
    },
  });

  return render(element, {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
}
