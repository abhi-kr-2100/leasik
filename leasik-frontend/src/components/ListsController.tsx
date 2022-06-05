import Lists from "./Lists";
import List from "./List";

export default function ListsController() {
  const mockLists = [
    <List
      id="123"
      name="Turkish List"
      description="Learn Turkish in context"
    />,
    <List
      id="231"
      name="French List"
      description="Learn French and impress your friends!"
    />,
    <List
      id="321"
      name="German List"
      description="The language that makes you sound badass!"
    />,
  ];

  return <Lists lists={mockLists} />;
}
