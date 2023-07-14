export interface IListDescriptionProps {
  text: string;
}

export default function ListDescription(props: IListDescriptionProps) {
  return (
    <>
      {props.text
        .split("\n")
        .filter((d) => d.trim() !== "")
        .map((d, i) => (
          <p key={i} className={"break-words " + (i !== 0 ? "pt-2" : "")}>
            {d}
          </p>
        ))}
    </>
  );
}
