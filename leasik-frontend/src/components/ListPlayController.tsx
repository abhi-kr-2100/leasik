import Card from "../models/Card";
import ListPlay from "./ListPlay";

export default function ListPlayController() {
  const mockCards: Card[] = [
    {
      id: "1",
      note: "",
      sentence: {
        id: "1",
        text: "Hello, world!",
        translation: "Hallo, welt!",
      },
      hiddenWordPosition: 0,
    },
    {
      id: "2",
      note: "",
      sentence: {
        id: "2",
        text: "Dragon and the Unicorn",
        translation: "Drache und der Zebra",
      },
      hiddenWordPosition: 1,
    },
  ];

  return <ListPlay cards={mockCards} />;
}
