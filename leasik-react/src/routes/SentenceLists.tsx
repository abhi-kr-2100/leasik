import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getSentenceLists } from "../utilities/apiCalls";
import { getToken } from "../utilities/authentication";
import LoadingScreen from "../utilities/components/LoadingScreen";
import { ISentenceList } from "../utilities/models";

interface ISentenceListProperties {
    sentenceList: ISentenceList;
}
function SentenceList({ sentenceList }: ISentenceListProperties) {
    const { id, name, description } = sentenceList;

    return (
        <div className="card block">
            <header className="card-header">
                <h2 className="card-header-title notification is-primary">
                    {name}
                </h2>
            </header>

            <div className="card-content">
                <div className="content">
                    <p>{description}</p>
                </div>
            </div>

            <footer className="card-footer">
                <Link
                    to={`/lists/${id}`}
                    className="card-footer-item button is-primary is-outlined"
                >
                    Play
                </Link>
                <Link
                    to={`/lists/${id}/bookmarks`}
                    className="card-footer-item button is-success is-outlined"
                >
                    Bookmarks
                </Link>
            </footer>
        </div>
    );
}

export default function SentenceLists() {
    const [isLoading, setIsLoading] = useState(false);
    const [sentenceLists, setSentenceLists] = useState<ISentenceList[]>([]);

    useEffect(() => {
        const token = getToken();

        setIsLoading(true);
        getSentenceLists(token)
            .then(setSentenceLists)
            .catch((error) => alert(`Couldn't load sentence lists! ${error}`))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return <LoadingScreen />;
    }

    const sentenceListElements = sentenceLists.map(toSentenceListElement);

    return (
        <div>
            <div className="container py-6 px-6">{sentenceListElements}</div>
        </div>
    );
}

function toSentenceListElement(sentenceList: ISentenceList, key: number) {
    return <SentenceList key={key} sentenceList={sentenceList} />;
}
