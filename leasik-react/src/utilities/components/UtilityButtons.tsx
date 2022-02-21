import { useState } from "react";
import { ToggleButtonGroup, ToggleButton, Dialog } from "@mui/material";

import { AugmentedCard } from "../types";
import { ICard } from "../models";
import { getWords } from "../utilFunctions";

interface IBookmarkButtonProperties {
    card: AugmentedCard;
    onBookmark: (
        setIsBookmarkBeingToggled: (isBookmarkBeingToggled: boolean) => any
    ) => any;
}
function BookmarkButton({ card, onBookmark }: IBookmarkButtonProperties) {
    const [isBookmarkBeingToggled, setIsBookmarkBeingToggled] =
        useState(false);

    const classNamesFinal = `button ${
        card.isBookmarked ? "is-danger" : "is-info"
    } ${isBookmarkBeingToggled ? "is-loading is-disabled" : ""}`;

    const buttonText = card.isBookmarked ? "Remove Bookmark" : "Bookmark";

    return (
        <button onClick={toggleBookmark} className={classNamesFinal}>
            {buttonText}
        </button>
    );

    function toggleBookmark() {
        if (isBookmarkBeingToggled) {
            return;
        }

        onBookmark(setIsBookmarkBeingToggled);
    }
}

interface IEditCardsButtonProperties {
    card: ICard;
    onStartEditingCards: () => any;
    onSaveEdits: (wordIndicesToSave: number[]) => any;
    onCancelEdits: () => any;
}
function EditCardsButton({
    card,
    onStartEditingCards,
    onSaveEdits,
    onCancelEdits,
}: IEditCardsButtonProperties) {
    // clicking on the EditCardsButton causes an edit dialog box to open
    const [isDialogBoxOpen, setIsDialogBoxOpen] = useState(false);

    return (
        <div>
            <button
                className="button is-info"
                onClick={openDialogBoxAndStartEditProcess}
            >
                Edit Cards
            </button>
            <EditCardsDialogBox
                card={card}
                open={isDialogBoxOpen}
                /* onClose implies cancel because action should only be saved
                    if user explicity clicks the save button. Click outside the
                    box is considered a cancel.
                 */
                onClose={onCancel}
                onCancel={onCancel}
                onSave={onSave}
            />
        </div>
    );

    function openDialogBoxAndStartEditProcess() {
        onStartEditingCards();
        setIsDialogBoxOpen(true);
    }

    function onCancel() {
        onCancelEdits();
        setIsDialogBoxOpen(false);
    }

    function onSave(wordIndicesToSave: number[]) {
        onSaveEdits(wordIndicesToSave);
        setIsDialogBoxOpen(false);
    }
}

interface IEditCardsDialogBoxProperties {
    card: ICard;
    open: boolean;
    onClose: () => any;
    onCancel: () => any;
    onSave: (wordIndicesToSave: number[]) => any;
}
function EditCardsDialogBox({
    card,
    open,
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

    const [selectedWordIndices, setSelectedWordIndices] = useState<number[]>(
        []
    );

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
                <button className="button is-danger" onClick={onCancel}>
                    Cancel
                </button>
                <button
                    className="button is-success"
                    onClick={saveSelectedWordIndices}
                >
                    Save
                </button>
            </div>
        </Dialog>
    );

    function onSelect(
        event: React.MouseEvent<HTMLElement>,
        newSelectedWordIndices: number[]
    ) {
        setSelectedWordIndices(newSelectedWordIndices);
    }

    function saveSelectedWordIndices() {
        return onSave(selectedWordIndices);
    }
}

interface IUtilityButtonsProperties {
    card: AugmentedCard;
    onBookmark: (
        setIsBookmarkBeingToggled: (isBookmarkBeingToggled: boolean) => any
    ) => any;
    onStartEditingCards: () => any;
    onCancelEditingCards: () => any;
    onSaveEditingCards: (wordIndicesToSave: number[]) => any;
}
export default function UtilityButtons({
    card,
    onBookmark,
    onStartEditingCards,
    onCancelEditingCards,
    onSaveEditingCards,
}: IUtilityButtonsProperties) {
    return (
        <div className="container">
            <div className="buttons is-centered">
                <BookmarkButton card={card} onBookmark={onBookmark} />
                <EditCardsButton
                    card={card}
                    onStartEditingCards={onStartEditingCards}
                    onCancelEdits={onCancelEditingCards}
                    onSaveEdits={onSaveEditingCards}
                />
            </div>
        </div>
    );
}
