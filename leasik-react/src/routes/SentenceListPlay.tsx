import GeneralListPlay from "./common/PlayCommon";
import { getPlaylist } from "../utilities/apiCalls";

export default function SentenceListPlay() {
    return <GeneralListPlay getInitialCards={getPlaylist} />;
}
