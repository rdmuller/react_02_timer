import { HeaderContainer } from "./styles";
import logoIgnite from "../../assets/logo-ignite.svg";

export function Header() {
    return (
        <HeaderContainer>
            <img src={logoIgnite} alt="" />
            <nav>
                <a href="">Timer</a>
                <a href="">Histórico</a>
            </nav>
        </HeaderContainer>
    );
}
