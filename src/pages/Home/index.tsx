import { HandPalm, Play } from "phosphor-react";
import { createContext, useContext, useState } from "react";
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
import { CyclesContext } from "../../contexts/CyclesContex";

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
    const { activeCycle, createNewCycle, interruptCurrentCycle, } = useContext(CyclesContext);

    const newCycleForm = useForm<NewTaskFormData>({
        resolver: zodResolver(newTaskFormValidationSchema), defaultValues: {
            task: "",
            minutesAmount: 0,
        },
    });

    const { handleSubmit, watch, /* reset */ } = newCycleForm;

    // console.log(formState.errors);
    const task = watch("task");
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(createNewCycle)} action="">
                <FormProvider {...newCycleForm}>
                    <NewCycleFrom /> 
                </FormProvider>
                <Countdown />

                {activeCycle ? (
                    <StopCountdownContainer type="button" onClick={interruptCurrentCycle} >
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
