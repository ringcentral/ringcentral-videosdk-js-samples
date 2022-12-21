import React, { MutableRefObject, PropsWithChildren, useContext, useRef } from 'react';

interface IElementContext {
    sidePortal: MutableRefObject<HTMLDivElement | null>;
    setSidePortal: (ref: HTMLDivElement) => void;
}
const ElementContext = React.createContext<IElementContext>({
    sidePortal: null,
    setSidePortal: () => {},
} as any);

const useElementContext = () => useContext<IElementContext>(ElementContext);

export const ElementContextProvider: React.FC<PropsWithChildren<{}>> = props => {
    const sidePortal = useRef(null);

    const setSidePortal = ref => {
        sidePortal.current = ref;
    };
    return (
        <ElementContext.Provider value={{ sidePortal, setSidePortal }}>
            {props.children}
        </ElementContext.Provider>
    );
};

export { useElementContext };
export default ElementContext;
