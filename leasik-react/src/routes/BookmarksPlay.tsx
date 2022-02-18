import GeneralListPlay from './common/PlayCommon'
import { getBookmarksForList } from '../utilities/apiCalls'


export default function BookmarksPlay() {
    return (
        <GeneralListPlay
            getInitialCards={ getBookmarksForList }
            assumeDefaultBookmarkValue={ true }
        />
    )
}
