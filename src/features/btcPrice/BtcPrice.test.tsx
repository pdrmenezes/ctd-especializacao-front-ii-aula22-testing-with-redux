// Escreva seus testes aqui
import { screen } from "@testing-library/react";
import { renderWithReduxProvider } from "../../test-utils";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";

import { BtcPrice } from "./BtcPrice";

describe("App component", () => {
  describe("when something went wrong with the API call", () => {
    const server = setupServer(
      rest.get("https://api.coindesk.com/v1/bpi/currentprice.json", (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: "Error" }));
      })
    );

    beforeEach(() => {
      server.listen();
    });

    afterEach(() => {
      server.close();
      server.resetHandlers();
    });

    it("shows the error message", async () => {
      renderWithReduxProvider(<BtcPrice />);

      const fetchPriceButton = await screen.findByText("Obter preço");
      await userEvent.click(fetchPriceButton);

      expect(await screen.findByText("Ocorreu um erro ao obter as informações")).toBeInTheDocument();
    });
  });

  describe("when everything goes well with the API call", () => {
    const server = setupServer(
      rest.get("https://api.coindesk.com/v1/bpi/currentprice.json", (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            bpi: {
              USD: {
                rate: 1200,
              },
            },
            time: {
              updated: "12/12/2022",
            },
          })
        );
      })
    );

    beforeEach(() => {
      server.listen();
    });

    afterEach(() => {
      server.close();
      server.resetHandlers();
    });
    it("shows the loading message", async () => {
      renderWithReduxProvider(<BtcPrice />);

      const fetchPriceButton = await screen.findByText("Obter preço");
      await userEvent.click(fetchPriceButton);

      expect(screen.getByText("Carregamento...")).toBeInTheDocument();
    });
    it("shows the current BTC currency", async () => {
      renderWithReduxProvider(<BtcPrice />);
      const fetchPriceButton = await screen.findByText("Obter preço");
      await userEvent.click(fetchPriceButton);

      expect(await screen.findByText("USD 1200")).toBeInTheDocument();
    });

    describe('and the button "Apagar dados" is clicked', () => {
      it("goes back to the page initial state", async () => {
        renderWithReduxProvider(<BtcPrice />);

        const apagarDadosButton = await screen.findByText("Apagar dados");
        await userEvent.click(apagarDadosButton);

        expect(await screen.findByText("USD 0")).toBeInTheDocument();
      });
    });
  });
});
