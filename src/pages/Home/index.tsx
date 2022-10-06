import { HandPalm, Play } from "phosphor-react";
import { createContext, useState } from "react";
import * as zod from "zod"; // precisou fazer assim por a bibliotéca não tem o export default
import {
    HomeContainer,
    StartCountdownContainer,
    StopCountdownContainer,
} from "./styles";
import { NewCycleFrom } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date; // data+hora
    interruptedDate?: Date;
    finishedDate?: Date;
}

interface CyclesContextType {
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    amountSecondsPassed: number;
    markCurrentCycleAsFinished: () => void;
    setSecondsPassed: (seconds: number) => void;
}

export const CyclesContext = createContext({} as CyclesContextType);

const newTaskFormValidationSchema = zod.object({
    task: zod.string().min(1, "Informe a tarefa"),
    minutesAmount: zod
        .number()
        .min(5, "A tarefa deve ter no mínimo 5 minutos")
        .max(60, "São permitidas tarefas ate 60 minutos"),
});

// sempre que utilizar uma variável do javascript no typescript como tipagem, é necessário o typeof
type NewTaskFormData = zod.infer<typeof newTaskFormValidationSchema>;

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, SetActiveCycleId] = useState<string | null>(null);
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    const newCycleForm = useForm<NewTaskFormData>({
        resolver: zodResolver(newTaskFormValidationSchema), defaultValues: {
            task: "",
            minutesAmount: 0,
        },
    });

    const { handleSubmit, watch, reset } = newCycleForm;

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }


    function markCurrentCycleAsFinished() { 
        setCycles((state) =>
            state.map((cycle) => {
                if (cycle.id === activeCycleId) {
                    return { ...cycle, finishedDate: new Date() };
                } else {
                    return cycle;
                }
            })
        );
    }

    function handleCreateNewTask(data: NewTaskFormData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        };

        setCycles((state) => [...state, newCycle]);
        SetActiveCycleId(newCycle.id);
        setAmountSecondsPassed(0);
        reset();
    }

    function handleInterruptCycle() {
        setCycles((state) =>
            state.map((cycle) => {
                if (cycle.id === activeCycleId) {
                    return { ...cycle, interruptedDate: new Date() };
                } else {
                    return cycle;
                }
            })
        );

        SetActiveCycleId(null);
    }

    // console.log(formState.errors);
    const task = watch("task");
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewTask)} action="">
                <CyclesContext.Provider value={{ activeCycle, activeCycleId, amountSecondsPassed, markCurrentCycleAsFinished, setSecondsPassed, }} >
                    <FormProvider {...newCycleForm}>
                        <NewCycleFrom /> 
                    </FormProvider>
                    <Countdown />
                </CyclesContext.Provider>

                {activeCycle ? (
                    <StopCountdownContainer type="button" onClick={handleInterruptCycle} >
                        <HandPalm size={24} />
                        Interromper
                    </StopCountdownContainer>
                ) : (
                    <StartCountdownContainer disabled={isSubmitDisabled} type="submit">
                        <Play size={24} />
                        Começar
                    </StartCountdownContainer>
                )}
            </form>
        </HomeContainer>
    );
}
