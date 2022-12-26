import React, { MutableRefObject, PropsWithChildren, useContext, useRef } from 'react';

interface IElementContext {
    sidePortal: MutableRefObject<HTMLDivElement | null>;
    setSidePortal: (ref: HTMLDivElement) => void;
    ccPortal: MutableRefObject<HTMLDivElement | null>;
    setCcPortal: (ref: HTMLDivElement) => void;
}
const ElementContext = React.createContext<IElementContext>({
    sidePortal: null,
    setSidePortal: () => {},
    ccPortal: null,
    setCcPortal: () => {},
} as any);

const useElementContext = () => useContext<IElementContext>(ElementContext);

export const ElementContextProvider: React.FC<PropsWithChildren<{}>> = props => {
    const sidePortal = useRef(null);

    const setSidePortal = ref => {
        sidePortal.current = ref;
    };

    const ccPortal = useRef(null);

    const setCcPortal = ref => {
        ccPortal.current = ref;
    };
    return (
        <ElementContext.Provider value={{ sidePortal, setSidePortal, ccPortal, setCcPortal }}>
            {props.children}
        </ElementContext.Provider>
    );
};

export { useElementContext };
