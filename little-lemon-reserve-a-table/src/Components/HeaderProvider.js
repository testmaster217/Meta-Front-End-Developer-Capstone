import { createContext, useContext, useRef } from "react";

const HeaderContext = createContext();

export default function HeaderProvider({children}) {
    const headerSkipTarget = useRef(null);

    return <HeaderContext.Provider value={{headerSkipTarget}}>
        {children}
    </HeaderContext.Provider>
}

export const useHeaderContext = () => useContext(HeaderContext);