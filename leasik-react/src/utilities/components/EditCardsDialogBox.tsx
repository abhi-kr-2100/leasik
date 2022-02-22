import { ToggleButtonGroup, ToggleButton, Dialog } from "@mui/material";
import { ICard } from "../models";
import { getWords } from "../utilFunctions";

interface IEditCardsDialogBoxProperties {
    card: ICard;
    open: boolean;
    isCardEditsBeingSaved: boolean;
    selectedWordIndices: number[];
    onSelect: (
        event: React.MouseEvent<HTMLElement>,
        newSelectedWordIndices: number[]
    ) => any;
    onClose: () => any;
    onCancel: () => any;
    onSave: () => any;
}

export default function EditCardsDialogBox({
    card,
    open,
    isCardEditsBeingSaved,
    selectedWordIndices,
    onSelect,
    onClose,
    onCancel,
    onSave,
}: IEditCardsDialogBoxProperties) {
    const words = getWords(card.sentence.text);
    const wordSelectButtons = words.map((w, index) => (
        <ToggleButton value={index} key={index}>
            {w}
        </ToggleButton>
    ));

    const saveButtonClasses = `button is-success ${
        isCardEditsBeingSaved ? "is-loading is-disabled" : ""
    }`;
    const cancelButtonClasses = `button is-danger ${
        isCardEditsBeingSaved ? "is-disabled" : ""
    }`;

    return (
        <Dialog onClose={onClose} open={open}>
            <ToggleButtonGroup
                orientation="vertical"
                value={selectedWordIndices}
                onChange={onSelect}
            >
                {wordSelectButtons}
            </ToggleButtonGroup>

            <div>
                <button className={cancelButtonClasses} onClick={onCancel}>
                    Cancel
                </button>
                <button className={saveButtonClasses} onClick={onSave}>
                    Save
                </button>
            </div>
        </Dialog>
    );
}
