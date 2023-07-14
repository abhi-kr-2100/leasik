import { ReactElement } from "react";
import { IListProps } from "./Book";

export interface IListsProps {
  lists: ReactElement<IListProps>[];
}

export default function Lists(props: IListsProps) {
  return (
    <>
      {props.lists.length === 0 ? (
        <p>No lists to show.</p>
      ) : (
        <ul>
          {props.lists.map((list) => (
            <li key={list.props.book.id}>{list}</li>
          ))}
        </ul>
      )}
    </>
  );
}
