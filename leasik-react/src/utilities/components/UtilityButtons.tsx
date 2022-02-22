import { AugmentedCard } from "../types";
import BookmarkButton from "./BookmarkButton";
import EditCardsButton from "./EditCardsButton";

interface IUtilityButtonsProperties {
    card: AugmentedCard;
    isEditCardsDialogBoxOpen: boolean;
    isCardEditsBeingSaved: boolean;
    isBookmarkBeingToggled: boolean;
    onBookmark: () => any;
    onStartEditingCards: () => any;
    onCancelEditingCards: () => any;
    onSaveEditingCards: (wordIndicesToSave: number[]) => any;
}

export default function UtilityButtons({
    card,
    isEditCardsDialogBoxOpen,
    isCardEditsBeingSaved,
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
                    isCardEditsBeingSaved={isCardEditsBeingSaved}
                    isDialogBoxOpen={isEditCardsDialogBoxOpen}
                    onStartEditingCards={onStartEditingCards}
                    onCancelEdits={onCancelEditingCards}
                    onSaveEdits={onSaveEditingCards}
                />
            </div>
        </div>
    );
}
