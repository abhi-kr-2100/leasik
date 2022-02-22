import { useState } from "react";
import { ToggleButtonGroup, ToggleButton, Dialog } from "@mui/material";

import { AugmentedCard } from "../types";
import { ICard } from "../models";
import { getWords } from "../utilFunctions";

interface IBookmarkButtonProperties {
    card: AugmentedCard;
    isBookmarkBeingToggled: boolean;
    onBookmark: () => any;
}
function BookmarkButton({
    card,
    isBookmarkBeingToggled,
    onBookmark,
}: IBookmarkButtonProperties) {
    const classNamesFinal = `button ${
        card.isBookmarked ? "is-danger" : "is-info"
    } ${isBookmarkBeingToggled ? "is-loading is-disabled" : ""}`;

    const buttonText = card.isBookmarked ? "Remove Bookmark" : "Bookmark";

    return (
        <button onClick={onBookmark} className={classNamesFinal}>
            {buttonText}
        </button>
    );
}

interface IEditCardsButtonProperties {
    card: ICard;
    isDialogBoxOpen: boolean;
    onStartEditingCards: () => any;
    onSaveEdits: (wordIndicesToSave: number[]) => any;
    onCancelEdits: () => any;
}
function EditCardsButton({
    card,
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
    isEditCardsDialogBoxOpen: boolean;
    isBookmarkBeingToggled: boolean;
    onBookmark: () => any;
    onStartEditingCards: () => any;
    onCancelEditingCards: () => any;
    onSaveEditingCards: (wordIndicesToSave: number[]) => any;
}
export default function UtilityButtons({
    card,
    isEditCardsDialogBoxOpen,
    isBookmarkBeingToggled,
    onBookmark,
    onStartEditingCards,
    onCancelEditingCards,
    onSaveEditingCards,
}: IUtilityButtonsProperties) {
    return (
        <div className="container">
            <div className="buttons is-centered">
                <BookmarkButton
                    card={card}
                    isBookmarkBeingToggled={isBookmarkBeingToggled}
                    onBookmark={onBookmark}
                />
                <EditCardsButton
                    card={card}
                    isDialogBoxOpen={isEditCardsDialogBoxOpen}
                    onStartEditingCards={onStartEditingCards}
                    onCancelEdits={onCancelEditingCards}
                    onSaveEdits={onSaveEditingCards}
                />
            </div>
        </div>
    );
}
