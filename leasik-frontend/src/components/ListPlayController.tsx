import Card from "./Card";
import ListPlay from "./ListPlay";

export default function ListPlayController() {
  const mockCards = [
    Card({
      id: "1",
      text: "Hello World",
      translation: "Hallo Welt",
      note: "",
      isBookmarked: false,
      hiddenWordPosition: 0,
    }),
    Card({
      id: "3",
      text: "Dragon and Wyvern",
      translation: "Drache und Wyvern",
      note: "",
      isBookmarked: false,
      hiddenWordPosition: 1,
    }),
  ];

  return <ListPlay cards={mockCards} />;
}
