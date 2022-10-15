import { ActionTypes } from "./actions";

interface CycleState {
    cycles: Cycle[];
    activeCycleId: string | null;
}

export interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date; // data+hora
    interruptedDate?: Date;
    finishedDate?: Date;
}

export function cyclesReducer(state: CycleState, action: any) {
    switch (action.type) {
        case ActionTypes.ADD_NEW_CYCLE:
            return {
                ...state,
                cycles: [...state.cycles, action.payload.newCycle],
                activeCycleId: action.payload.newCycle.id,
            }
        case ActionTypes.INTERRUPT_CURRENT_CYCLE:
            return {
                ...state,
                activeCycleId: null,
                cycles: state.cycles.map((cycle) => {
                    if (cycle.id != state.activeCycleId) {
                        return cycle;
                    } else {
                        return { ...cycle, interruptedDate: new Date() }
                    }
                }),
            }
        case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED:
            return {
                ...state,
                activeCycleId: null,
                cycles: state.cycles.map((cycle) => {
                    if (cycle.id != state.activeCycleId) {
                        return cycle
                    } else {
                        return { ...cycle, finishedDate: new Date() }
                    }
                })
            };
        default:
            console.log("Opção inválida [cyclesState, dispatch] = useReducer((state: CycleState, action: any)")
            return state;
    }
}