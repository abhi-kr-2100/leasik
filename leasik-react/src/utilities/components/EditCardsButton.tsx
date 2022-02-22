import { ICard } from "../models";
import EditCardsDialogBox from "./EditCardsDialogBox";

interface IEditCardsButtonProperties {
    card: ICard;
    isCardEditsBeingSaved: boolean;
    isDialogBoxOpen: boolean;
    onStartEditingCards: () => any;
    onSaveEdits: (wordIndicesToSave: number[]) => any;
    onCancelEdits: () => any;
}

export default function EditCardsButton({
    card,
    isCardEditsBeingSaved,
    isDialogBoxOpen,
    onStartEditingCards,
    onSaveEdits,
    onCancelEdits,
}: IEditCardsButtonProperties) {
    return (
        <div>
            <button className="button is-info" onClick={onStartEditingCards}>
                Edit Cards
            </button>
            <EditCardsDialogBox
                card={card}
                isCardEditsBeingSaved={isCardEditsBeingSaved}
                open={isDialogBoxOpen}
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
