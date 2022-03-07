import { AugmentedCard } from "../types";

interface IBookmarkButtonProperties {
    card: AugmentedCard;
    isBookmarkBeingToggled: boolean;
    onBookmark: () => any;
    accessKey?: string;
}

export default function BookmarkButton({
    card,
    isBookmarkBeingToggled,
    onBookmark,
    accessKey,
}: IBookmarkButtonProperties) {
    const classNamesFinal = `button ${
        card.is_bookmarked ? "is-danger" : "is-info"
    } ${isBookmarkBeingToggled ? "is-loading is-disabled" : ""}`;

    const buttonText = card.is_bookmarked ? "Remove Bookmark" : "Bookmark";

    return (
        <button
            accessKey={accessKey}
            onClick={onBookmark}
            className={classNamesFinal}
        >
            {buttonText}
        </button>
    );
}
