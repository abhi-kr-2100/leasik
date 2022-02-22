import { AugmentedCard } from "../types";

interface IBookmarkButtonProperties {
    card: AugmentedCard;
    isBookmarkBeingToggled: boolean;
    onBookmark: () => any;
}

export default function BookmarkButton({
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
