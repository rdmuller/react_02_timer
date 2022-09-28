import { Play } from "phosphor-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod"; // precisou fazer assim por a bibliotéca não tem o export default
import {
    CountdownContainer,
    FormContainer,
    HomeContainer,
    MinutesAmountInput,
    Separator,
    StartCountdownContainer,
    TaskInput,
} from "./styles";

const newTaskFormValidationSchema = zod.object({
    task: zod.string().min(1, "Informe a tarefa"),
    minutesAmount: zod
        .number()
        .min(5, "A tarefa deve ter no mínimo 5 minutos")
        .max(60, "São permitidas tarefas ate 60 minutos"),
});

// interface NewTaskFormData {
//     task: string;
//     minutesAmount: number;
// }

// sempre que utilizar uma variável do javascript no typescript como tipagem, é necessário o typeof
type NewTaskFormData = zod.infer<typeof newTaskFormValidationSchema>;

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
}

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, SetActiveCycleId] = useState<string | null>(null);

    // const { register, handleSubmit, watch, formState } = ...
    const { register, handleSubmit, watch, reset } = useForm<NewTaskFormData>({
        resolver: zodResolver(newTaskFormValidationSchema),
        defaultValues: {
            task: "",
            minutesAmount: 0,
        },
    });

    function handleCreateNewTask(data: NewTaskFormData) {
        const newCycle: Cycle = {
            id: String(new Date().getDate()),
            task: data.task,
            minutesAmount: data.minutesAmount,
        };

        setCycles((state) => [...state, newCycle]);
        SetActiveCycleId(newCycle.id);
        reset();
    }

    // console.log(formState.errors);
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
    const task = watch("task");
    const isSubmitDisabled = !task;

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewTask)} action="">
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput
                        id="task"
                        type="text"
                        placeholder="Dê um nome para o seu projeto"
                        list="task-suggestions"
                        {...register("task")}
                    />
                    <datalist id="task-suggestions">
                        <option value="Projeto 1" />
                        <option value="Projeto 2" />
                        <option value="Projeto 3" />
                        <option value="Projeto 4" />
                    </datalist>

                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesAmountInput
                        id="minutesAmount"
                        type="number"
                        placeholder="00"
                        step={5}
                        min={5}
                        max={60}
                        {...register("minutesAmount", { valueAsNumber: true })}
                    />

                    <span>minutos.</span>
                </FormContainer>

                <CountdownContainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountdownContainer>

                <StartCountdownContainer
                    disabled={isSubmitDisabled}
                    type="submit"
                >
                    <Play size={24} />
                    Começar
                </StartCountdownContainer>
            </form>
        </HomeContainer>
    );
}
