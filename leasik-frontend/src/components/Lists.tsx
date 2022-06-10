import { ReactElement } from "react";
import { IListProps } from "./List";

export interface IListsProps {
  lists: ReactElement<IListProps>[];
}

export default function Lists(props: IListsProps) {
  return (
    <div>
      {props.lists.length === 0 ? (
        <p>No lists to show.</p>
      ) : (
        <ul>
          {props.lists.map((list) => (
            <li key={list.props.id}>{list}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
