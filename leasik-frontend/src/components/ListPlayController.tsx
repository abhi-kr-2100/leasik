import Card from "./Card";
import ListPlay from "./ListPlay";

export default function ListPlayController() {
  const mockCards = [
    Card({
      id: "1",
      text: "Hello",
      translation: "Hallo",
      note: "",
      isBookmarked: false,
    }),
    Card({
      id: "2",
      text: "World",
      translation: "Welt",
      note: "",
      isBookmarked: false,
    }),
    Card({
      id: "3",
      text: "Dragon",
      translation: "Drache",
      note: "",
      isBookmarked: false,
    }),
    Card({
      id: "4",
      text: "Wyvern",
      translation: "Wyvern",
      note: "",
      isBookmarked: false,
    }),
  ];

  return <ListPlay cards={mockCards} />;
}
