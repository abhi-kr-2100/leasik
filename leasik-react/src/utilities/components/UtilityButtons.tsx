import React from "react";
import { AugmentedCard } from "../types";
import BookmarkButton from "./BookmarkButton";
import EditCardsButton from "./EditCardsButton";

interface IUtilityButtonsProperties {
    card: AugmentedCard;
    isEditCardsDialogBoxOpen: boolean;
    isCardEditsBeingSaved: boolean;
    isBookmarkBeingToggled: boolean;
    selectedWordIndices: number[];
    onBookmark: () => any;
    onSelectWordIndex: (
        event: React.MouseEvent<HTMLElement>,
        newSelectedWordIndices: number[]
    ) => any;
    onStartEditingCards: () => any;
    onCancelEditingCards: () => any;
    onSaveEditingCards: () => any;
    bookmarkAccessKey?: string;
    editCardsAccessKey?: string;
    editSaveAccessKey?: string;
    editCancelAccessKey?: string;
}

export default function UtilityButtons({
    card,
    isEditCardsDialogBoxOpen,
    isCardEditsBeingSaved,
    isBookmarkBeingToggled,
    selectedWordIndices,
    onBookmark,
    onSelectWordIndex,
    onStartEditingCards,
    onCancelEditingCards,
    onSaveEditingCards,
    bookmarkAccessKey,
    editCardsAccessKey,
    editSaveAccessKey,
    editCancelAccessKey,
}: IUtilityButtonsProperties) {
    return (
        <div className="container">
            <div className="buttons is-centered">
                <BookmarkButton
                    accessKey={bookmarkAccessKey}
                    card={card}
                    isBookmarkBeingToggled={isBookmarkBeingToggled}
                    onBookmark={onBookmark}
                />
                <EditCardsButton
                    startAccessKey={editCardsAccessKey}
                    saveAccessKey={editSaveAccessKey}
                    cancelAccessKey={editCancelAccessKey}
                    card={card}
                    isCardEditsBeingSaved={isCardEditsBeingSaved}
                    isDialogBoxOpen={isEditCardsDialogBoxOpen}
                    selectedWordIndices={selectedWordIndices}
                    onSelect={onSelectWordIndex}
                    onStartEditingCards={onStartEditingCards}
                    onCancelEdits={onCancelEditingCards}
                    onSaveEdits={onSaveEditingCards}
                />
            </div>
        </div>
    );
}
