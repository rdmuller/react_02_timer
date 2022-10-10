import { ThemeProvider } from "styled-components";
import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";

import { GlobalStyle } from "./styles/global";
import { defaultTheme } from "./styles/themes/default";
import { CyclesContextProvider } from "./contexts/CyclesContex";

export function App() {
    
    return (
        <ThemeProvider theme={defaultTheme}>
            <BrowserRouter>
                <CyclesContextProvider>
                    <Router />
                </CyclesContextProvider>
            </BrowserRouter>
            <GlobalStyle />
        </ThemeProvider>
    );

    // <GlobalStyle /> pode ficar em qualquer lugar, mas é interessante que fique dentro do ThemeProvider
    //                 para acessar o que existe dentro
}
