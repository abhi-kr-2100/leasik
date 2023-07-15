export interface IBookDescriptionProps {
  text: string;
}

export default function BookDescription(props: IBookDescriptionProps) {
  return <>{renderDescription(props.text)}</>;
}

function renderDescription(description: string) {
  const paragraphs = getParagraphs(description);
  return paragraphs.map((p, i) => (
    <p key={i} className={"break-words " + isFirstPara(i) ? "" : "pt-2"}>
      {p}
    </p>
  ));
}

function getParagraphs(text: string) {
  return text
    .split("\n")
    .map((p) => p.trim())
    .filter((p) => p !== "");
}

function isFirstPara(index: number) {
  return index === 0;
}
