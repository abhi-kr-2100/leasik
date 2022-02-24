import { ICard } from "../models";
import EditCardsDialogBox from "./EditCardsDialogBox";

interface IEditCardsButtonProperties {
    card: ICard;
    isCardEditsBeingSaved: boolean;
    isDialogBoxOpen: boolean;
    selectedWordIndices: number[];
    onSelect: (
        event: React.MouseEvent<HTMLElement>,
        newSelectedWordIndices: number[]
    ) => any;
    onStartEditingCards: () => any;
    onSaveEdits: () => any;
    onCancelEdits: () => any;
    startAccessKey?: string;
    saveAccessKey?: string;
    cancelAccessKey?: string;
}

export default function EditCardsButton({
    card,
    isCardEditsBeingSaved,
    isDialogBoxOpen,
    selectedWordIndices,
    onSelect,
    onStartEditingCards,
    onSaveEdits,
    onCancelEdits,
    startAccessKey,
    saveAccessKey,
    cancelAccessKey,
}: IEditCardsButtonProperties) {
    return (
        <div>
            <button
                accessKey={startAccessKey}
                className="button is-info"
                onClick={onStartEditingCards}
            >
                Edit Cards
            </button>
            <EditCardsDialogBox
                saveAccessKey={saveAccessKey}
                cancelAccessKey={cancelAccessKey}
                card={card}
                isCardEditsBeingSaved={isCardEditsBeingSaved}
                open={isDialogBoxOpen}
                selectedWordIndices={selectedWordIndices}
                onSelect={onSelect}
                /* onClose implies cancel because action should only be saved
                    if user explicity clicks the save button. Click outside the
                    box is considered a cancel.
                 */
                onClose={onCancelEdits}
                onCancel={onCancelEdits}
                onSave={onSaveEdits}
            />
        </div>
    );
}
