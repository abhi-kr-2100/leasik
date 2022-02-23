import { ICard } from "../models";

interface IQuestionHintProperties {
    card: ICard;
}

export default function QuestionHint({ card }: IQuestionHintProperties) {
    return (
        <div className="block">
            <p className="title is-6">{card.sentence.translation}</p>
        </div>
    );
}
