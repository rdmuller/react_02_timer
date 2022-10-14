import { createContext, ReactNode, useState, useReducer } from "react";

interface CreateNewCycleData {
    task: string;
    minutesAmount: number;
}

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date; // data+hora
    interruptedDate?: Date;
    finishedDate?: Date;
}

interface CyclesContextType {
    cycles: Cycle[];
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    amountSecondsPassed: number;
    markCurrentCycleAsFinished: () => void;
    setSecondsPassed: (seconds: number) => void;
    createNewCycle: (data: CreateNewCycleData) => void;
    interruptCurrentCycle: () => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

interface CyclesContextProviderProps {
    children: ReactNode;
}

export function CyclesContextProvider({ children, }:CyclesContextProviderProps) {
    const [cycles, dispatch] = useReducer((state: Cycle[], action: any) => {
        console.log(state);
        console.log(action);

        if (action.type === "ADD_NEW_CYCLE") {
            return [...state, action.payload.newCycle];
        }
        return state;
    }, []);  //useState<Cycle[]>([]);

    const [activeCycleId, SetActiveCycleId] = useState<string | null>(null);
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    function markCurrentCycleAsFinished() { 
        dispatch({
            type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
            payload: {
                activeCycleId,
            },
        });

        /*setCycles((state) =>
            state.map((cycle) => {
                if (cycle.id === activeCycleId) {
                    return { ...cycle, finishedDate: new Date() };
                } else {
                    return cycle;
                }
            })
        );*/
    }

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function createNewCycle(data: CreateNewCycleData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        };

        dispatch({
            type: 'ADD_NEW_CYCLE',
            payload: {
                newCycle,
            },
        });
        //setCycles((state) => [...state, newCycle]);
        SetActiveCycleId(newCycle.id);
        setAmountSecondsPassed(0);
    }

    function interruptCurrentCycle() {
        dispatch({
            type: 'INTERRUPT_CURRENT_CYCLE',
            payload: {
                activeCycleId,
            },
        });
        // setCycles((state) =>
        //     state.map((cycle) => {
        //         if (cycle.id === activeCycleId) {
        //             return { ...cycle, interruptedDate: new Date() };
        //         } else {
        //             return cycle;
        //         }
        //     })
        // );

        SetActiveCycleId(null);
    }

    return (
        <CyclesContext.Provider 
            value={{ 
                cycles,
                activeCycle, 
                activeCycleId, 
                amountSecondsPassed, 
                markCurrentCycleAsFinished, 
                setSecondsPassed, 
                createNewCycle, 
                interruptCurrentCycle }
            } 
        >
            {children}
        </CyclesContext.Provider>
    );
}