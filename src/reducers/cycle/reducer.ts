import { ActionTypes } from "./actions";
import { produce } from "immer";

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
            // return {
            //     ...state,
            //     cycles: [...state.cycles, action.payload.newCycle],
            //     activeCycleId: action.payload.newCycle.id,
            // }
            return produce(state, draft => {
                draft.cycles.push(action.payload.newCycle);
                draft.activeCycleId = action.payload.newCycle.id;
            })
        case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
            // return {
            //     ...state,
            //     activeCycleId: null,
            //     cycles: state.cycles.map((cycle) => {
            //         if (cycle.id != state.activeCycleId) {
            //             return cycle;
            //         } else {
            //             return { ...cycle, interruptedDate: new Date() }
            //         }
            //     }),
            // }

            const currentCycleIndex = state.cycles.findIndex((cycle) => {
                return cycle.id === state.activeCycleId
            });

            if (currentCycleIndex < 0) {
                return state;
            } else {
                return produce(state, draft => {
                    draft.activeCycleId = null;
                    draft.cycles[currentCycleIndex].interruptedDate = new Date();
                });
            }
        }
        case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
            const currentCycleIndex = state.cycles.findIndex((cycle) => {
                return cycle.id === state.activeCycleId
            });

            if (currentCycleIndex < 0) {
                return state;
            } else {
                return produce(state, draft => {
                    draft.activeCycleId = null;
                    draft.cycles[currentCycleIndex].finishedDate = new Date();
                });                
            }
        }
       default:
            console.log("Op????o inv??lida [cyclesState, dispatch] = useReducer((state: CycleState, action: any)")
            return state;
    }
}